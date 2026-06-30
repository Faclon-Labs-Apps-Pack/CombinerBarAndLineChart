# Combined Bar & Line Chart — Feature Porting Kit

Reference docs for the three reusable features built into this widget, written so they can be **ported into the Column Chart** (or any sibling widget). Each doc is self-contained: model, UI, code snippets, edge cases, and a verification checklist.

| Doc | Feature | Port into Column Chart? |
|---|---|---|
| [AXIS_FUNCTIONALITY.md](./AXIS_FUNCTIONALITY.md) | **Dual Y-axis** — default Left axis + optional Right axis, per-series membership, auto-hide, plot-line/band axis pinning | ✅ |
| [DURATION_PICKER.md](./DURATION_PICKER.md) | **Duration picker + periodicity** — merge SDK built-in presets with configured durations, default periodicity per preset, chip/fixed/local fixes | ✅ |
| [COMPARISON_MODE.md](./COMPARISON_MODE.md) | **Comparison mode** — Time-tab config, date-picker Compare panel, ▲/▼ deviation tooltip via ComboLineChart, per-source overrides | ✅ |
| [PLOTLINE_PLOTBAND_AXIS.md](./PLOTLINE_PLOTBAND_AXIS.md) | **Plot line / band axis pinning** — Left/Right radio (shown only when a Right axis exists), per-axis Highcharts rendering | ✅ |
| [CYCLE_TIME_DEFAULTS.md](./CYCLE_TIME_DEFAULTS.md) | **Cycle Time defaults** — idempotent pre-fill of the Cycle Time form for Local + Fixed pickers (Calendar / 00:00 / Monday / 1st) | ✅ |

---

## 1. Axis (Left / Right)
- A chart **always has a default Left axis** (renamable, not deletable); a **Right axis is optional** and exists only while it owns ≥1 series. **Max 2.**
- **`syncAxes` is the single mutator** — rebuilds `axes` + every `series.yAxis` from a desired *right-id* set, and **drops the Right axis when empty**.
- New sources auto-join Left; an axis with no series **auto-hides** in render (`visible` flag, `opposite:true` for the right).
- Plot lines/bands can be **pinned** to either axis (radio shown only when a Right axis exists).
- → Full helpers (`makeLeftAxis`, `syncAxes`, `normalizeChart`, `removeSeriesEverywhere`, `deleteRightAxis`), modal wiring, Highcharts yAxis build, and a 17-row edge-case table in **[AXIS_FUNCTIONALITY.md](./AXIS_FUNCTIONALITY.md)**.

## 2. Duration picker + periodicity
- The SDK uses **`presets ?? DEFAULT_PRESETS`** (a fallback) — so passing configured durations hides the 11 built-ins. Fix: define `BUILTIN_PRESETS` locally and pass a **merged** list always.
- Built-ins are **not** matched as durations, so their periodicity comes from the SDK **range heuristic** (`getAvailablePeriodicities`); configured durations use their own periodicities. Default = first available.
- Supporting fixes: the **"Custom" chip** (preset owned only by `onPresetSelect`), the **`allDurations`** sync-effect dep, **fixed-mode** config-driven periodicity, and the **`App.tsx` data-signature** additions (`defaultPeriodicity`, `comparisonMode`) so changes re-fetch.
- → Code + per-preset default table in **[DURATION_PICKER.md](./DURATION_PICKER.md)**.

## 3. Comparison mode
- **Two surfaces:** the **Time tab** turns it on + sets the deviation pattern / per-source overrides (scoped local/fixed/global; ON/OFF inherited from the GTP in global); the **date-picker Compare panel** picks the comparison window (Previous period / Same period last year / Custom).
- **Data:** the engine fetches the comparison window (explicit or preceding period); the host signature must include `comparisonMode` to re-fetch.
- **Render:** through `ComboLineChart`'s `comparison` prop — `buildComparisonSeries` produces Current (solid + deviation) and Comparison (dotted) series; the SDK `comparisonTooltip` shows `Source (Current) … ▲% / Source (Comparison) … / vs <date>`.
- **Mutually exclusive** with Shift mode (both may be off).
- → Full UI tables (config + date picker), data flow, render contract, and edge cases in **[COMPARISON_MODE.md](./COMPARISON_MODE.md)**.

---

## Shared conventions across all three
- **Config flows one way:** Time-tab/uiConfig → `mapTimeTabToTimeConfig` / `buildDynamicBindingPathList` → envelope → widget props. The widget **never fetches** — data arrives via props from the engine.
- **All UI is `@faclon-labs/design-sdk`** components + CSS tokens.
- **Scoping rule** (time-related settings): `fixed → ttc.fixed`, `global → ttc.global` / linked GTP, `local → top level`.
- **`npx tsc --noEmit`** must pass (babel strips types at build, so type-check separately), and webpack must report "compiled successfully".

## Source files
- Types: `src/iosense-sdk/types.ts`
- Configurator: `src/components/CombinerBarLineChartConfiguration/CombinerBarLineChartConfiguration.tsx`
- Widget: `src/components/CombinerBarLineChart/CombinerBarLineChart.tsx`
- Engine (dev): `src/iosense-sdk/mini-engine.ts`
- Dev harness: `src/App.tsx`
