# Axis Functionality — Combined Bar & Line Chart

Reference for how Y-axes work in the widget: the model, the configurator behaviour, how data sources and plot lines/bands map to axes, how the chart renders, and every condition / edge case the implementation handles.

---

## 1. Model (at a glance)

- A chart **always has a default Left axis** (`yAxis: 0`). It can be **renamed but never deleted**.
- A chart may have **one optional Right axis** (`yAxis: 1`). It is **deletable**.
- **Maximum 2 axes** total (Left + Right) — mirrors the `yAxis: 0 | 1` model.
- **Every data source belongs to exactly one axis.** `series.yAxis` / `fixedSeries.yAxis` always mirrors its axis membership.
- **New data sources auto-join the Left axis.**
- An axis with **no data sources is auto-hidden** in the rendered chart (its line/labels/title are not drawn; series still plot).

---

## 2. Data model

`AxisConfig` (in `src/iosense-sdk/types.ts`):

```ts
interface AxisConfig {
  _id: string;          // LEFT_AXIS_ID ('axis_left') or RIGHT_AXIS_ID ('axis_right')
  name: string;         // axis title; '' = no title (left falls back to yAxisUnit)
  yAxis: 0 | 1;         // 0 = left, 1 = right
  seriesIds: string[];  // _id refs into series[] and fixedSeries[]
}
```

- Stable id constants: `LEFT_AXIS_ID = 'axis_left'`, `RIGHT_AXIS_ID = 'axis_right'`.
- Each `ColumnChartSeriesConfig` / `FixedSeriesConfig` carries an optional `yAxis?: 0 | 1` that **mirrors** axis membership.
- `PlotLineConfig` / `PlotBandConfig` carry an optional `yAxis?: 0 | 1` — which axis the line/band is drawn against (default `0` = left).
- There is **no stored `hidden`/`visible` flag** — auto-hide is derived at render time from "does this axis own any series".

---

## 3. Core helpers (configurator)

File: `src/components/CombinedBarLineChartConfiguration/CombinedBarLineChartConfiguration.tsx`

| Helper | Purpose |
|---|---|
| `makeLeftAxis(seriesIds = [])` | Seed the default Left axis: `{ _id: LEFT_AXIS_ID, name: '', yAxis: 0, seriesIds }`. |
| `rightIdsOf(chart)` | The series ids currently on the Right axis (`[]` if none). |
| `syncAxes(chart, rightIds, { leftName?, rightName? })` | **The single source of truth.** Rebuilds `axes` + every `series.yAxis`/`fixedSeries.yAxis` from a desired set of Right-axis ids. Left = everything else. **Drops the Right axis entirely when it would be empty.** |
| `normalizeChart(chart)` | Enforces invariants on load — back-fills a Left axis for old `axes: []` configs, and re-derives the Right axis from any `series.yAxis === 1`. Runs on init + on every config sync. |
| `removeSeriesEverywhere(chart, id)` | Removes a deleted data source and re-syncs axis membership so no id dangles. |
| `deleteRightAxis(chart)` | Removes the Right axis; its series **fall back to the Left axis**; right-pinned plot lines/bands re-home to the left. |

**Invariant guaranteed by `syncAxes`:** after any change, (a) a Left axis always exists, (b) the Right axis exists **iff** it owns ≥1 series, (c) every series id lives in exactly one axis, (d) `series.yAxis` matches its axis.

---

## 4. Configurator — the Axis accordion

- Header shows an axis **count badge** (1 or 2) and is always active (Left always exists).
- Hint text: *"Left axis is used by default. Add a right axis for different values."*
- Hint shows a 16px **info icon** + the text above.
- **`+ Add` button** is **disabled once a Right axis exists** (`chart.axes.some(a => a.yAxis === 1)`).
- **Left axis row:** click to **Edit** (rename only). **No delete button.**
- **Right axis row:** click to **Edit**; **Delete** icon (red, revealed on hover) → confirmation modal → `deleteRightAxis`.
- List card title = `axis.name` or fallback `"Left Axis"` / `"Right Axis"`. Subtitle = **position + count**: `"Left • 0 Data Sources"`, `"Right • 1 Data Source"`, `"Left • 2 Data Sources"` (singular "Data Source" for 1).

### Axis modal

| Action | Title | Behaviour |
|---|---|---|
| Add | **Add Right Axis** | Adding always means the Right axis (Left is the default). |
| Edit Left | **Edit Left Axis** | Rename only — membership unchanged. |
| Edit Right | **Edit Right Axis** | Rename + choose which data sources sit on it. |

- **Label field** (`"Label"`) is **compulsory** for both axes (Save disabled until non-empty).
- **Data Sources** multi-select shows **only for the Right axis**; the Right axis additionally requires **≥1 data source** to save.
- **Save semantics (Right axis):** `syncAxes(chart, formAxisSeriesIds, { rightName })` — selected series move to the Right; everything else stays Left; an empty Right axis is dropped.
- Primary button: **"Add Right Axis"** (new) / **"Save Changes"** (edit).

---

## 5. Data source ↔ axis mapping

- **Adding** a data source (series or fixed): it auto-joins the **Left axis** (`yAxis: 0`), via `syncAxes(..., rightIdsOf(chart))` which leaves the new id out of the right set.
- **Editing** a data source: axis membership is **preserved**.
- **Deleting** a data source: routed through `removeSeriesEverywhere` so axis `seriesIds` never dangle. If it was the **last** series on the Right axis, the Right axis is **auto-dropped** (by `syncAxes`).

---

## 6. Plot lines & plot bands — axis selection

- `PlotLineConfig` / `PlotBandConfig` carry `yAxis?: 0 | 1`.
- In the Plot Line / Plot Band add-edit modals, an **Axis radio with two options labelled "Left" and "Right"** (`size="Medium"`) appears **only when the chart has a Right axis** (`plotRightAxisExists`). With just the Left axis, the radio is not rendered at all.
- The chosen axis is **persisted only when a Right axis exists** (otherwise the field is omitted → defaults to left).
- On **Right axis deletion**, any plot line/band pinned to it is re-homed to the Left axis (`deleteRightAxis`).

---

## 7. Widget rendering

File: `src/components/CombinedBarLineChart/CombinedBarLineChart.tsx` (`buildChartDisplayData`)

- The Highcharts `yAxis` array is built as `[ leftEntry, ...(rightAxisExists ? [rightEntry] : []) ]`.
- **Auto-hide:** each entry gets `visible: <axis has ≥1 series>`:
  - `leftHasSeries  = resolvedSeries.some(s => (s.yAxis ?? 0) === 0)`
  - the Right entry uses `visible: hasRightAxis` (right has ≥1 series).
- **Titles:** left = `leftAxisName || yAxisUnit || ''`; right = `rightAxisName || ''`. Right axis uses `opposite: true` (drawn on the right side).
- **Series** map to their axis via `yAxis: s.yAxis ?? 0`.
- **Plot lines/bands** are split into Left/Right groups by their `yAxis` and attached to the matching axis entry (a right-pinned item folds back to left if no Right axis exists — safety net). They are injected directly onto the axis entries because Highcharts.merge replaces the SDK's yAxis object when an explicit `yAxis` array is passed.

---

## 8. Conditions & edge cases

| # | Condition / edge case | Handling |
|---|---|---|
| 1 | Default Left axis must always exist | `makeChart` / `EMPTY_SECTION_CHART` seed `axes: [makeLeftAxis()]`; `normalizeChart` back-fills it on load. |
| 2 | Left axis cannot be deleted | No delete button on the Left row; `deleteRightAxis` only ever removes `yAxis === 1`. |
| 3 | At most 2 axes | `+ Add` disabled once a Right axis exists. |
| 4 | Right axis with 0 series is meaningless | `syncAxes` **drops** the Right axis whenever its id set is empty. |
| 5 | New data source with no explicit axis | Auto-joins the Left axis. |
| 6 | Deleting the last Right-axis series | Right axis auto-drops; `+ Add` re-enables. |
| 7 | Deleting the Right axis | Its series fall back to Left (`series.yAxis = 0`); right-pinned plot lines/bands re-home to Left. |
| 8 | Old configs with `axes: []` | `normalizeChart` injects a Left axis containing all series. |
| 9 | Config where some `series.yAxis === 1` but no Right axis object | `normalizeChart` reconstructs the Right axis from those series. |
| 10 | Axis with no series in the chart | Auto-hidden via `visible: false` (scale kept, chrome hidden; series still plot). |
| 11 | Left axis renamed to empty | Allowed only via model default (`name: ''`); however the **modal Label is compulsory**, so a user-driven rename cannot be blank. Empty name → falls back to `yAxisUnit` for the title. |
| 12 | Right axis requires a label + ≥1 series to save | Save button disabled otherwise. |
| 13 | Moving a series between axes | Handled by `syncAxes`, which removes it from the other axis and re-derives `series.yAxis`. |
| 14 | Plot line/band axis radio when no Right axis | Not rendered; `yAxis` not persisted (defaults left). |
| 15 | Plot line/band pinned to Right axis but Right axis later removed | `deleteRightAxis` resets `yAxis` to 0; widget also folds right-pinned items back to left if the right entry is absent. |
| 16 | Comparison mode | Renders via `ComboLineChart`, which is **not** passed plot lines/bands — so plot lines (and their axis choice) do not show in comparison mode by design. |
| 17 | `buildDynamicBindingPathList` | Walks only `series[].unsPath`; axis changes never affect bindings. |

---

## 9. Key file references

- **Types:** `src/iosense-sdk/types.ts` — `AxisConfig`, `LEFT_AXIS_ID`/`RIGHT_AXIS_ID`, `series.yAxis`, `PlotLineConfig.yAxis`, `PlotBandConfig.yAxis`.
- **Configurator helpers:** `CombinedBarLineChartConfiguration.tsx` — `makeLeftAxis`, `rightIdsOf`, `syncAxes`, `normalizeChart`, `removeSeriesEverywhere`, `deleteRightAxis`.
- **Axis UI + modal:** same file — the "Axis" `ProductAccordionItem`, `openAddAxisModal`/`openEditAxisModal`, the `modalSection === 'axis'` body + save branch.
- **Plot-line/band axis radio:** same file — `plotAxisRadio` (gated on `plotRightAxisExists`).
- **Widget render:** `CombinedBarLineChart.tsx` — `buildChartDisplayData` (yAxis array, auto-hide flags, plot line/band routing).
