# Plot Line / Plot Band — axis pinning (Left / Right)

Lets a plot line or plot band render against a chosen Y-axis. With a single (Left) axis there's nothing to choose, so the control is hidden; once a **Right axis** is configured, the user picks which axis each threshold/band belongs to. Builds on the [dual-axis](./AXIS_FUNCTIONALITY.md) model.

---

## 1. Why
A chart can have a second (Right) Y-axis with its own scale. Plot lines/bands used to always draw against the **Left** axis (`yAxis[0]`), so a threshold meant for a right-axis series sat at the wrong height. This adds a per-line/band axis choice.

---

## 2. Types
Add an optional axis to both configs (default = Left when absent):
```ts
// types.ts
export interface PlotLineConfig { …; yAxis?: 0 | 1; }   // 0 = left (default), 1 = right
export interface PlotBandConfig { …; yAxis?: 0 | 1; }
```

---

## 3. Configurator
A shared state (only one modal is open at a time, so plot line + plot band reuse it):
```ts
const [formPlotYAxis, setFormPlotYAxis] = useState<0 | 1>(0);
```

**Right-axis detection + the radio** (rendered once, used in both modal bodies). It only renders when the chart being edited has a Right axis:
```tsx
const modalChartForPlot = chartsList.find(c => c._id === modalChartId);
const plotRightAxisExists = (modalChartForPlot?.axes ?? []).some(a => a.yAxis === 1);

const plotAxisRadio = plotRightAxisExists ? (
  <RadioGroup name="plot-axis" label="Axis" size="Medium"
    value={String(formPlotYAxis)} orientation="Horizontal"
    onChange={({ value }: RadioGroupChangeMeta) => setFormPlotYAxis(value === '1' ? 1 : 0)}>
    <Radio label="Left"  value="0" />
    <Radio label="Right" value="1" />
  </RadioGroup>
) : null;

// Drop {plotAxisRadio} into BOTH the plotLine and plotBand modal bodies.
```

**Save** — persist `yAxis` only when the chart actually has a Right axis (keeps configs clean / defaults left):
```ts
const entry: PlotLineConfig = {
  …,
  ...((chart.axes ?? []).some(a => a.yAxis === 1) ? { yAxis: formPlotYAxis } : {}),
};
// same pattern for PlotBandConfig.
```

**Populate on edit / reset:**
```ts
// openEditPlotLineModal / openEditPlotBandModal:
setFormPlotYAxis((item.yAxis ?? 0) as 0 | 1);
// openAddModal + handleModalClose:
setFormPlotYAxis(0);
```

**Right-axis deletion fallback** — when the Right axis is deleted, re-home any right-pinned line/band to the Left axis so nothing dangles:
```ts
function deleteRightAxis(chart: ChartConfig): Partial<ChartConfig> {
  const synced = syncAxes(chart, []);
  return {
    series: synced.series, fixedSeries: synced.fixedSeries, axes: synced.axes,
    plotLines: chart.plotLines.map(p => p.yAxis === 1 ? { ...p, yAxis: 0 } : p),
    plotBands: chart.plotBands.map(p => p.yAxis === 1 ? { ...p, yAxis: 0 } : p),
  };
}
```

---

## 4. Widget render (Highcharts)
Highcharts attaches `plotLines`/`plotBands` **per yAxis object**, so split them by their `yAxis` and put each group on the matching axis entry.

```ts
// In buildChartDisplayData:
const chartHasRightAxis = (chart.axes ?? []).some(a => a.yAxis === 1);
// A right-pinned item folds back to left if there's no right axis (safety net).
const plotAxisOf = (y?: 0 | 1): 0 | 1 => (chartHasRightAxis && y === 1 ? 1 : 0);

// Carry yAxis through the resolve .map():
const plotLines = (chart.plotLines ?? []).map((p, i) => ({ …resolved…, yAxis: plotAxisOf(p.yAxis) })).filter(Boolean);
const plotBands = (chart.plotBands ?? []).map((p, i) => ({ …resolved…, yAxis: plotAxisOf(p.yAxis) })).filter(Boolean);

// Highcharts-shaped, split into Left / Right groups:
const toHcLine = (p) => ({ value: p.value, color: p.color ?? '#ef4444', width: p.width ?? 2, dashStyle: p.dashStyle ?? 'Solid', zIndex: 5, ...(p.label ? { label: { text: p.label, align: 'right', style: { color: p.color ?? '#ef4444' } } } : {}) });
const toHcBand = (p) => ({ from: p.from, to: p.to, color: p.color ?? 'rgba(239,68,68,0.1)', zIndex: 0, ...(p.label ? { label: { text: p.label, align: 'right' } } : {}) });

const hcPlotLinesLeft  = plotLines.filter(p => p.yAxis !== 1).map(toHcLine);
const hcPlotLinesRight = plotLines.filter(p => p.yAxis === 1).map(toHcLine);
const hcPlotBandsLeft  = plotBands.filter(p => p.yAxis !== 1).map(toHcBand);
const hcPlotBandsRight = plotBands.filter(p => p.yAxis === 1).map(toHcBand);
```

Attach each group to the correct axis in the yAxis array (left = `[0]`, right = the `opposite:true` entry):
```ts
highchartsOptions.yAxis = [
  { title: { text: leftAxisName || yAxisUnit || '' }, visible: leftHasSeries,
    ...(hcPlotLinesLeft.length  ? { plotLines: hcPlotLinesLeft }  : {}),
    ...(hcPlotBandsLeft.length  ? { plotBands: hcPlotBandsLeft }  : {}) },
  ...(rightAxisExists ? [{
    title: { text: rightAxisName || '' }, opposite: true, visible: hasRightAxis,
    ...(hcPlotLinesRight.length ? { plotLines: hcPlotLinesRight } : {}),
    ...(hcPlotBandsRight.length ? { plotBands: hcPlotBandsRight } : {}),
  }] : []),
];
```
> Why inject onto the axis objects (not the SDK `plotLines` prop): when you hand the SDK an explicit `yAxis` array, `Highcharts.merge` replaces the SDK's yAxis object and discards plot lines it put there — so they must live on the axis entries.

---

## 5. Edge cases
| # | Case | Handling |
|---|---|---|
| 1 | No Right axis configured | Radio not rendered; `yAxis` not persisted → defaults Left. |
| 2 | Right-pinned line, then Right axis deleted | `deleteRightAxis` resets `yAxis → 0`; render also folds right-tagged items to left via `plotAxisOf` if the right entry is absent. |
| 3 | Edit an existing line/band | Radio reflects saved `item.yAxis ?? 0`. |
| 4 | Comparison mode | Renders via `ComboLineChart`, which isn't passed plot lines → plot lines (and their axis choice) **don't show in comparison mode** — by design. |
| 5 | Single-axis chart | No regression — everything folds to Left exactly as before. |

---

## 6. Files / functions to reuse
- Types: `PlotLineConfig.yAxis`, `PlotBandConfig.yAxis` (`src/iosense-sdk/types.ts`).
- Configurator: `formPlotYAxis`, `plotAxisRadio` (gated on `plotRightAxisExists`), the save/edit/reset wiring, `deleteRightAxis` re-home (`CombinerBarLineChartConfiguration.tsx`).
- Widget: `chartHasRightAxis` / `plotAxisOf`, `toHcLine`/`toHcBand`, the Left/Right group split, and the yAxis-array attach (`CombinerBarLineChart.tsx`).
