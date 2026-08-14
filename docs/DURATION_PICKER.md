# Duration Picker + Periodicity — port guide

How the local date-range picker fetches **all durations** (the SDK's built-in presets **plus** the user's configured durations) and resolves the **default periodicity** for each. Drop-in guide for the Column Chart (or any widget using the SDK `DatePicker`).

All widget code lives in the chart component (e.g. `CombinedBarLineChart.tsx`); the data-signature bit lives in the dev harness `App.tsx`.

---

## 1. The problem these fixes solve
- The SDK `DatePicker` chooses its preset list as **`presets ?? DEFAULT_PRESETS`** (`DatePicker.js`). It's a *fallback*, not a merge — so passing your own `presets` (the configured durations) **hides all 11 built-ins**.
- Built-in presets have **no periodicity** attached — the picker just resolves a window; the widget must decide the periodicity.
- A few related glitches: the chip showed **"Custom"** even on a named preset; **fixed-mode** periodicity/chart didn't update; editing a duration didn't move the **local** picker; toggling **periodicity/comparison** didn't re-fetch data.

---

## 2. Merge built-in presets + custom durations
`DEFAULT_PRESETS` is **not** re-exported from `@faclon-labs/design-sdk/DatePicker`, so define the 11 built-ins locally (id + label only — the window comes from the SDK's `getPresetDateRange`):

```ts
const BUILTIN_PRESETS: Array<{ id: string; label: string }> = [
  { id: 'today',             label: 'Today' },
  { id: 'yesterday',         label: 'Yesterday' },
  { id: 'current_week',      label: 'Current Week' },
  { id: 'previous_7_days',   label: 'Past 7 days' },
  { id: 'current_month',     label: 'Current Month' },
  { id: 'previous_month',    label: 'Previous Month' },
  { id: 'previous_3_month',  label: 'Previous 3 Month' },
  { id: 'previous_12_month', label: 'Previous 12 Month' },
  { id: 'current_year',      label: 'Current Year' },
  { id: 'previous_year',     label: 'Previous Year' },
];
// (The SDK also has a "custom" free-range entry — omitted here since the
//  calendar itself is the custom picker. Add { id:'custom', label:'Custom' } if wanted.)
```

Build the merged list (configured durations first, then built-ins not already present) and **always** pass it:
```ts
const durationPresets = (timeConfig?.allDurations ?? []).map(d => ({ label: d.label || d.id, value: d.id }));
const builtinPresetOptions = BUILTIN_PRESETS
  .filter(b => !durationPresets.some(d => d.value === b.id))
  .map(b => ({ label: b.label, value: b.id }));
const presetOptions = [...durationPresets, ...builtinPresetOptions];

// <DatePicker mode="range" presets={presetOptions} … />   // ALWAYS pass — no length gate
```

**Selecting a preset:** built-ins resolve their window via the SDK's `getPresetDateRange` (fires `onRangeChange`); custom durations are resolved by you in `handlePresetSelect` via `resolveDurationWindow` (the SDK can't resolve custom ids). Keep this branch:
```ts
function handlePresetSelect(durationId: string) {
  const dur = (timeConfig?.allDurations ?? []).find(d => d.id === durationId);
  if (!dur) {                                    // built-in OR "custom" → SDK owns the window
    setPreset(durationId);
    setPresetLabel(DATEPICKER_PRESET_LABELS[durationId] ?? durationId.replace(/_/g, ' '));
    return;
  }
  const { startTime, endTime } = resolveDurationWindow(dur, Date.now(), timeConfig?.cycleTime);
  rangeRef.current = { start: new Date(startTime), end: new Date(endTime) };
  setRange({ start: new Date(startTime), end: new Date(endTime) });
  setPreset(dur.id); setPresetLabel(dur.label || dur.id); setDrillPath([]);
  emitTimeChange(startTime, endTime, basePeriodicity.toLowerCase());
}
```

---

## 3. Default periodicity per preset (the SDK range rule)
Built-in presets are intentionally **not** matched as configured durations, so their periodicity falls to the SDK's **range-length heuristic**, which adapts to the preset's actual resolved window:

```ts
function getAvailablePeriodicities(range: DateRange): Periodicity[] {
  const days = (range.end.getTime() - range.start.getTime()) / 86_400_000;
  if (days <= 2)   return ['Hourly'];
  if (days <= 31)  return ['Hourly', 'Daily'];
  if (days <= 180) return ['Daily', 'Weekly', 'Monthly'];   // ← Monthly added for quarter windows
  return ['Daily', 'Weekly', 'Monthly'];
}

// Custom durations use their CONFIGURED periodicities (or length-based) via getPresetPeriodicities:
function durationPeriodicities(dur: Duration | undefined, range: DateRange): Periodicity[] {
  if (!dur) return getAvailablePeriodicities(range);                 // built-ins land here
  const mapped = [...new Set(getPresetPeriodicities(dur).map(p => RAW_TO_PERIODICITY[p.toLowerCase()]).filter(Boolean))];
  return mapped.length ? (mapped as Periodicity[]) : getAvailablePeriodicities(range);
}

// IMPORTANT: built-ins are NOT in selectedDuration, so they fall to the range rule:
const selectedDuration =
  timeConfig?.allDurations?.find(d => d.id === preset) ??                          // configured durations
  (timeConfig?.pickerType === 'fixed' ? timeConfig.fixedDuration : undefined);     // (no BUILTIN_PRESETS here)
const availablePeriodicities = durationPeriodicities(selectedDuration, range);
```

`getPresetPeriodicities` (for configured durations — calendarType / length thresholds, ported from GlobalTimePicker) and `RAW_TO_PERIODICITY` (`hour→Hourly`, `day→Daily`, `week→Weekly`, `month→Monthly`) are unchanged from the original widget — copy them as-is.

**Default = the first available periodicity.** The constraint effect snaps `basePeriodicity` to it when the current one isn't valid — gate it to **local** mode only (fixed/global are config-driven):
```ts
useEffect(() => {
  if (pickerType !== 'local') return;                  // don't clobber config-driven periodicity
  if (!availablePeriodicities.includes(basePeriodicity)) {
    const next = availablePeriodicities[0];
    setBasePeriodicity(next);
    if (next) emitTimeChange(range.start.getTime(), range.end.getTime(), next.toLowerCase());
  }
}, [range]);   // eslint-disable-line react-hooks/exhaustive-deps
```

### Resulting default periodicity table
| Preset (≈range) | Periodicities | Default |
|---|---|---|
| Today / Yesterday (1d) | Hourly | Hourly |
| Current Week / Past 7 days (≤31d) | Hourly, Daily | Hourly |
| Current Month / Previous Month (≤31d) | Hourly, Daily | Hourly |
| Previous 3 Month (≤180d) | Daily, Weekly, Monthly | Daily |
| Previous 12 Month / Current Year / Previous Year (>180d) | Daily, Weekly, Monthly | Daily |
| *Custom configured duration* | its configured set (else `["Hourly","Daily"]`) | its first entry |

---

## 4. Supporting fixes (port these too)

**A. Chip showed "Custom" on a named preset.** The SDK fires `onRangeChange` twice when a preset is applied (echo + Apply); resetting `preset` there made the chip fall back to "Custom" (`presets.find(value===selectedPreset)?.label ?? "Custom"`). Fix: `preset` is owned **only by `onPresetSelect`** — `handleRangeChange` must NOT touch `preset`/`presetLabel`:
```ts
function handleRangeChange(r: DateRange | null) {
  if (!r) return;
  rangeRef.current = r; setRange(r); setDrillPath([]);
  emitTimeChange(r.start.getTime(), r.end.getTime(), basePeriodicity.toLowerCase());
  // The SDK calls onPresetSelect("custom") itself when a custom range/day is picked.
}
```

**B. Editing a duration didn't move the local picker.** The effect that syncs the picker range from config listened to `defaultDurationId`/`fixedDuration` etc. but **not `allDurations`** — add it so editing a duration (same id, new length) re-resolves:
```ts
}, [
  timeConfig?.defaultDurationId, timeConfig?.type, timeConfig?.pickerType,
  timeConfig?.startTime, timeConfig?.endTime, timeConfig?.defaultPeriodicity,
  JSON.stringify(timeConfig?.fixedDuration ?? null),
  JSON.stringify(timeConfig?.cycleTime ?? null),
  JSON.stringify(timeConfig?.allDurations ?? []),   // ← add this
]);
```

**C. Fixed-mode periodicity didn't update chart or chip.** The periodicity in fixed/global is config-driven (see §3 — gate the constraint effect to local). The chip uses `effectivePeriodicity` which follows `basePeriodicity`, kept synced from `timeConfig.defaultPeriodicity`.

**D. Data didn't re-fetch on periodicity / comparison change.** The host's data-refetch signature must include the fields that change *what* is fetched. In `App.tsx` `timeCfgWindowInputs(tc)` add:
```ts
defaultPeriodicity: tc.defaultPeriodicity ?? null,   // periodicity → resolveAndCompute timeFrame
comparisonMode:     tc.comparisonMode ?? false,      // comparison → also fetch the prior window
```

---

## 5. Files / functions to reuse
- `getAvailablePeriodicities`, `getPresetPeriodicities`, `RAW_TO_PERIODICITY`, `durationPeriodicities`, `MINS_MAP`, `DATEPICKER_PRESET_LABELS` — copy verbatim.
- `BUILTIN_PRESETS`, `presetOptions` merge, `selectedDuration` (without built-ins), the gated constraint effect — §2/§3 above.
- `getPresetDateRange`, `resolveDurationWindow` — already imported from `@faclon-labs/design-sdk/DatePicker` / your time util.

## 6. Verify
1. `npx tsc --noEmit` clean; webpack "compiled successfully".
2. Open the local picker with ≥1 configured duration → list shows **your durations + all 10 built-ins**.
3. Pick **Today** → Hourly; **Current Month** → Hourly/Daily; **Previous 3 Month** → Daily/Weekly/Monthly (default Daily); a **custom** duration → its configured periodicity, and the chip keeps its **name** (not "Custom").
4. Edit a configured duration's length → the picker chip + chart follow.
5. Change periodicity → chart re-buckets (data refetches).
