# Comparison Mode — UI + logic

Comparison Mode overlays the **current period** against a **comparison period** and shows a **▲/▼ % deviation** indicator. This doc covers every piece: the config UI, the runtime date-picker UI, the data pipeline, the chart rendering, and edge cases.

---

## 1. Two surfaces, one feature
Comparison has **two UI surfaces**:
1. **Config (Time tab)** — turns the feature ON and sets *how* deviation is shown (pattern + per-source overrides).
2. **Runtime (date picker "Compare" panel)** — picks *which* comparison window (Previous period / Same period last year / Custom), local mode only.

And one **render contract**: the SDK's `ComboLineChart` `comparison` prop + its built-in deviation tooltip.

---

## 2. Config UI — Time tab (SDK `TimeTabConfiguration`)
Shown when the time tab's **Comparison Mode** switch is on. Rendered by the SDK; the widget only *captures* the values.

| Element | What it sets | Notes |
|---|---|---|
| **Comparison Mode** switch | `comparisonMode: boolean` | Master ON/OFF. In **global** mode it's **inherited from the linked GTP** and shown disabled. |
| **"General Behaviour of Deviation Indicator"** — two cards | `deviationPattern: 'green-up-positive' \| 'red-up-positive'` | green-up = increase is good; red-up = increase is bad. Disabled when Advance Settings is on. |
| **"Advance Settings"** switch | `allowPerSourceIndicator: boolean` | Reveals the per-source section. |
| **Chart selector + per-source rows** (when Advance on) | `sourceDeviationOverrides: Record<\`${chartId}:${sourceId}\`, pattern>` | Each row is a product `ComparisonToggle` (left = green-up, right = red-up). **Requires the `charts` prop** to be passed to `TimeTabConfiguration` (see §3). |

### Scoping (critical)
Comparison settings live in **different places per picker** — capture them from the right scope in `mapTimeTabToTimeConfig`:
```ts
const cmpScope = picker === 'fixed' ? ttc.fixed : picker === 'global' ? ttc.global : ttc;
return {
  …,
  // ON/OFF: global INHERITS the GTP; otherwise from the scope.
  comparisonMode: picker === 'global'
    ? Boolean(linkedGtp?.comparisonMode ?? cmpScope?.comparisonMode)
    : Boolean(cmpScope?.comparisonMode),
  deviationPattern:         cmpScope?.deviationPattern,
  allowPerSourceIndicator:  Boolean(cmpScope?.allowPerSourceIndicator),
  sourceDeviationOverrides: cmpScope?.sourceDeviationOverrides,
};
```
> In **global** mode the deviation pattern + Advance per-source settings stay **user-editable** (read from `ttc.global`), just like local — only the ON/OFF toggle is inherited from the GTP.

### Wiring the per-source rows
The SDK renders the per-source `ComparisonToggle` rows only when `comparisonMode && allowPerSourceIndicator && charts.length > 0`. So pass the chart/source list:
```tsx
const gtpCharts = useMemo(() => chartsList.map((c, ci) => ({
  id: c._id, name: c.title || `Chart ${ci + 1}`,
  sources: c.series.map((s, si) => ({ id: s._id, name: s.label || `Series ${si + 1}` })),
})), [chartsList]);

<TimeTabConfiguration … charts={gtpCharts} />
```

### Disable the global cards when per-source is on
Add a class when `allowPerSourceIndicator` is on and grey out the global deviation cards (they're redundant):
```css
.cc-config__time-tab--per-source .fds-ttc__deviation { opacity: 0.45; pointer-events: none; }
```

---

## 3. Runtime UI — date picker "Compare" panel (local mode)
When `timeConfig.comparisonMode` is on, mount the SDK DatePicker's comparison panel:
```tsx
<DatePicker mode="range" …
  {...(comparisonModeOn ? {
    showComparison: true,
    comparisonEnabled: compareOn,
    onComparisonToggle: handleComparisonToggle,
    comparisonRangeValue: compRange,
    onComparisonRangeChange: handleComparisonRangeChange,  // fires on Apply with {start,end}
  } : {})}
/>
```

### What the date/range picker shows when comparison is on
Turning on `showComparison` changes the picker popover from a plain range picker into a **compare** picker. It adds, on top of the normal Start/End range + presets sidebar + calendar:

| Element | Where | What it does |
|---|---|---|
| **"Compare" switch** | sidebar footer | Toggles comparison on/off (controlled by `comparisonEnabled` / `onComparisonToggle`). Mutually exclusive with the **Shift** switch (only one can be on; both may be off). |
| **Comp. Start Date / Comp. End Date** inputs | next to the main Start/End date inputs (a second row) | Show/edit the comparison window's dates. |
| **Comparison-mode list** (when Compare is on) | sidebar (below the presets) | Three options that compute the comparison window from the main range: **Previous period** (`preceding`), **Same period last year** (`preceding_last_year`), **Custom** (free-pick comparison dates on the calendar). |
| **Comparison highlight on the calendar** | calendar grid | The comparison range is shaded distinctly from the main range. |
| **Apply / Cancel** | footer | On **Apply**, the picker fires `onRangeChange` (main window) **and** `onComparisonRangeChange` ({start,end} of the comparison window). |

The chip on the trigger still shows the main range (e.g. `Custom · 22/06/2026 – 29/06/2026`); the comparison window is what's fed to the engine.

### Capturing it
`onComparisonRangeChange(value)` gives the resolved comparison `{start,end}` for whichever of the 3 modes was chosen. Ride it into the `TIME_CHANGE` payload alongside the main window (use a ref since the picker fires the main + comparison callbacks separately on Apply):
```ts
function emitTimeChange(start, end, periodicity) {
  const cr = compareOn ? compRangeRef.current : null;
  onEvent({ type: 'TIME_CHANGE', payload: {
    startTime: String(start), endTime: String(end), periodicity,
    ...(cr ? { comparisonStartTime: String(cr.start.getTime()), comparisonEndTime: String(cr.end.getTime()) } : {}),
  }});
}
```
The host folds `comparisonStartTime/EndTime` into the engine override → the engine fetches **that exact** comparison window (or, if none applied yet, the immediately-preceding period).

### Mutual exclusion with Shift
Compare and Shift toggles are **mutually exclusive** (both may be off):
```ts
function handleComparisonToggle(on: boolean) { setCompareOn(on); if (on) setShiftOn(false); … }
function handleShiftToggle(on: boolean)      { setShiftOn(on);   if (on) setCompareOn(false); }
```

---

## 4. Data pipeline
1. **Capture** (config) → `timeConfig.comparisonMode / deviationPattern / allowPerSourceIndicator / sourceDeviationOverrides`.
2. **Re-fetch trigger** — the host's data signature MUST include `comparisonMode` (toggling it must re-resolve so the prior window is fetched). In `App.tsx` `timeCfgWindowInputs`:
   ```ts
   comparisonMode: tc.comparisonMode ?? false,
   ```
3. **Engine** (`mini-engine.resolve`) — when `comparisonMode` is on, also fetch the comparison window:
   ```ts
   const compStart = override.comparisonStartTime ?? (startTime - span);   // explicit picker window, else preceding
   const compEnd   = override.comparisonEndTime   ?? startTime;
   comparisonData = await resolveAndCompute(auth, bindings, compStart, compEnd, timeFrame);
   ```
   Return `{ data, comparisonData }`; the host passes `comparisonData` to the widget as a prop.

---

## 5. Chart rendering (SDK `ComboLineChart`)
Comparison renders through `ComboLineChart` (the only chart with the comparison render contract).

```ts
// Gate: master switch on, data present, and Shift not active.
const comparisonOn = comparisonModeOn && !shiftOn && (comparisonData?.length ?? 0) > 0;

// Per-source deviation overrides only when Advance Settings is on:
const perSourceOverrides = timeConfig?.allowPerSourceIndicator ? timeConfig.sourceDeviationOverrides : undefined;

if (comparisonOn) {
  // Build {id,name,current[],comparison[],color,seriesType,deviationPattern?} per series,
  // aligned by category index. Per-source override = overrides[`${chartId}:${seriesId}`].
  const cmp = buildChartComparison(chart, ci, data, comparisonData, perSourceOverrides);
  const { series } = buildComparisonSeries({ sources: cmp.sources, deviationPattern });
  return (
    <ComboLineChart
      bare
      categories={cmp.categories}
      comparison={{ series, showDeviation: true, comparisonCategories: cmp.comparisonCategories }}
      showLegend={showLegend} showDataLabels={showDataLabels}
      yAxisUnit={config.style.yAxisUnit || undefined} scrollable={scrollable}
    />
  );
}
```

**How the SDK pieces fit (verified):**
- `buildComparisonSeries({ sources, deviationPattern })` → per source emits a **Current** series (solid, in legend, carries `deviation: %` per point + polarity) and a **Comparison** series (dotted `Dot`, out of legend). Deviation `% = round((cur − cmp)/cmp × 1000)/10`.
- `ComboLineChart` (with `comparison` set) ignores `series`, runs `comparison.series` through `toComboSeries` (which copies `deviation`/`deviationPattern`/`sourceName` into `series.custom`) and applies the **`comparisonTooltip`** formatter.
- The tooltip reads `series.custom.deviation[index]` → shows `Source (Current): 134 ▲5.5% / Source (Comparison): 127 … vs <date>` (the "vs <date>" comes from `comparisonCategories`).
- Per-source polarity: `buildComparisonSeries` honors `source.deviationPattern ?? deviationPattern` — so a per-source override flips just that series' arrow colors.

---

## 6. Config types (`TimeConfig`)
```ts
comparisonMode?: boolean;
deviationPattern?: 'green-up-positive' | 'red-up-positive';
allowPerSourceIndicator?: boolean;
sourceDeviationOverrides?: Record<string, 'green-up-positive' | 'red-up-positive'>;  // key = `${chartId}:${seriesId}`
// TIME_CHANGE / TimeWindow also carry: comparisonStartTime?, comparisonEndTime?
```

---

## 7. Edge cases & rules
| # | Case | Handling |
|---|---|---|
| 1 | Toggle comparison ON | Host signature includes `comparisonMode` → re-resolve → `comparisonData` generated. **Without this the tooltip never shows.** |
| 2 | Global mode | ON/OFF inherited from GTP (disabled toggle); deviation + advanced editable (from `ttc.global`). |
| 3 | Advance Settings on | Per-source rows render (needs `charts` prop); global deviation cards greyed out. |
| 4 | Per-source override unset | Falls back to the chart-wide `deviationPattern`. |
| 5 | Compare + Shift | Mutually exclusive; both may be off; comparison render also gated on `!shiftOn`. |
| 6 | Comparison window degenerate / prior period empty | Dev fallback synthesizes the comparison window when the fetch returns empty **or all-null** values, so the deviation always has something to compute. |
| 7 | Plot lines / bands | `ComboLineChart` isn't passed plot lines → they don't render in comparison mode (by design). |
| 8 | Picker Compare toggle | Selects the comparison **range** only; the time-tab Comparison Mode is the master that drives rendering. |

---

## 8. Files / functions to reuse
- **Config:** `mapTimeTabToTimeConfig` (`cmpScope`), `gtpCharts` for `charts` prop, the `--per-source` CSS gate.
- **Engine:** `resolve()` comparison-window fetch + `hasValues()` null-fallback.
- **Widget:** `comparisonOn` gate, `buildChartComparison`, `buildComparisonSeries` (`@faclon-labs/design-sdk`), `ComboLineChart` (`@faclon-labs/design-sdk/ComboLineChart`), the Compare/Shift toggle handlers.

> **Status note:** the config capture, per-source UI, and data pipeline are wired and verified against the SDK. If the deviation tooltip ever shows only the Current value (no Comparison row / no ▲%), it means the comparison-period **values are null** — confirm the engine returned non-null `comparisonData` (edge case #6).
