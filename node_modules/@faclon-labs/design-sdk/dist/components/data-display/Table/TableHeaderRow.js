import { jsxs as s, jsx as l } from "react/jsx-runtime";
import { Checkbox as r } from "../../inputs/Checkbox/Checkbox.js";
import { useTableContextOptional as n } from "./TableContext.js";
function c() {
  const e = n();
  return e ? /* @__PURE__ */ l(
    "th",
    {
      className: "fds-table__header-cell fds-table__header-cell--selection",
      "data-content-type": "selection",
      onClick: (t) => t.stopPropagation(),
      children: /* @__PURE__ */ l("div", { className: "fds-table__cell-selection-wrapper", children: /* @__PURE__ */ l(
        r,
        {
          label: "",
          size: "Medium",
          "aria-label": e.isAllSelected ? "Deselect all rows" : "Select all rows",
          checked: e.isAllSelected,
          isIndeterminate: e.isIndeterminate,
          onChange: () => e.toggleAllRowsSelection()
        }
      ) })
    }
  ) : null;
}
function p({ children: e, ...t }) {
  const o = n(), a = (o == null ? void 0 : o.selectionType) === "multiple";
  return /* @__PURE__ */ s("tr", { className: "fds-table__header-row", ...t, children: [
    a && /* @__PURE__ */ l(c, {}),
    e
  ] });
}
export {
  p as TableHeaderRow
};
