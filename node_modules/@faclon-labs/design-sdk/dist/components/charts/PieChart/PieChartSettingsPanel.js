import { jsxs as l, jsx as e, Fragment as T } from "react/jsx-runtime";
import { ActionListItem as t } from "../../overlays/DropdownMenu/ActionListItem.js";
import { ActionListItemGroup as g } from "../../overlays/DropdownMenu/ActionListItemGroup.js";
import { Radio as p } from "../../inputs/Radio/Radio.js";
import { RadioGroup as M } from "../../inputs/Radio/RadioGroup.js";
/* empty css                          */
function k({
  showDataLabelPercentage: n,
  showDataLabelValue: o,
  onShowDataLabelPercentageChange: s,
  onShowDataLabelValueChange: a,
  labelPosition: d,
  onLabelPositionChange: m,
  showLegend: i,
  onShowLegendChange: u,
  showLegendPercentage: c,
  showLegendValue: r,
  onShowLegendPercentageChange: S,
  onShowLegendValueChange: y,
  className: f
}) {
  return /* @__PURE__ */ l(g, { className: f, children: [
    /* @__PURE__ */ e(t, { contentType: "SectionHeading", title: "Label fields" }),
    /* @__PURE__ */ e(
      t,
      {
        title: "Percentage",
        selectionType: "Multiple",
        isSelected: n,
        onClick: () => s(!n)
      }
    ),
    /* @__PURE__ */ e(
      t,
      {
        title: "Value",
        selectionType: "Multiple",
        isSelected: o,
        onClick: () => a(!o)
      }
    ),
    /* @__PURE__ */ e(t, { contentType: "SectionHeading", title: "Label position" }),
    /* @__PURE__ */ e("div", { className: "fds-pie-settings-panel__radio-slot", children: /* @__PURE__ */ l(
      M,
      {
        orientation: "Horizontal",
        size: "Medium",
        value: d,
        onChange: ({ value: C }) => m(C),
        children: [
          /* @__PURE__ */ e(p, { label: "Outside", value: "outside" }),
          /* @__PURE__ */ e(p, { label: "Center", value: "center" })
        ]
      }
    ) }),
    /* @__PURE__ */ e(t, { contentType: "Separator" }),
    /* @__PURE__ */ e(
      t,
      {
        title: "Show legend",
        selectionType: "Multiple",
        isSelected: i,
        onClick: () => u(!i)
      }
    ),
    i && /* @__PURE__ */ l(T, { children: [
      /* @__PURE__ */ e(t, { contentType: "SectionHeading", title: "Legend fields" }),
      /* @__PURE__ */ e(
        t,
        {
          title: "Percentage",
          selectionType: "Multiple",
          isSelected: c,
          onClick: () => S(!c)
        }
      ),
      /* @__PURE__ */ e(
        t,
        {
          title: "Value",
          selectionType: "Multiple",
          isSelected: r,
          onClick: () => y(!r)
        }
      )
    ] })
  ] });
}
k.displayName = "PieChartSettingsPanel";
export {
  k as PieChartSettingsPanel
};
