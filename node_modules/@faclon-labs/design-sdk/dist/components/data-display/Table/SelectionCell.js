import { jsx as n } from "react/jsx-runtime";
import { Checkbox as a } from "../../inputs/Checkbox/Checkbox.js";
import { useTableContextOptional as r } from "./TableContext.js";
function p({ item: o, isSelected: c, isDisabled: l }) {
  const t = r();
  return t ? /* @__PURE__ */ n(
    "td",
    {
      className: "fds-table__cell fds-table__cell--selection",
      "data-content-type": "selection",
      onClick: (e) => e.stopPropagation(),
      children: /* @__PURE__ */ n("div", { className: "fds-table__cell-selection-wrapper", children: /* @__PURE__ */ n(
        a,
        {
          label: "",
          size: "Medium",
          "aria-label": c ? "Deselect row" : "Select row",
          checked: c,
          isDisabled: l,
          onClick: (e) => {
            l || e.shiftKey && (e.preventDefault(), t.toggleRowSelectionRange(o.id));
          },
          onChange: (e) => {
            l || t.toggleRowSelection(o.id);
          }
        }
      ) })
    }
  ) : null;
}
export {
  p as SelectionCell
};
