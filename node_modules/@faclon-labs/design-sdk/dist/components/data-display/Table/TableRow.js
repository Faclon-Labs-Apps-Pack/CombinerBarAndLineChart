import { jsxs as w, jsx as f } from "react/jsx-runtime";
/* empty css             */
import { useTableContextOptional as g } from "./TableContext.js";
import { SelectionCell as p } from "./SelectionCell.js";
function v({
  children: c,
  item: d,
  onClick: i,
  ...r
}) {
  const e = g(), t = d, o = e ? e.isRowSelectable(t) : !0, l = e ? e.selectedIds.includes(t.id) : !1, s = (e == null ? void 0 : e.selectionType) === "multiple", a = (e == null ? void 0 : e.selectionType) === "single", m = s, n = s && (e == null ? void 0 : e.multiSelectTrigger) === "row" || a;
  return /* @__PURE__ */ w(
    "tr",
    {
      className: "fds-table__row",
      "aria-selected": l || void 0,
      "data-selected": l ? "true" : void 0,
      "data-disabled": o ? void 0 : "true",
      onClick: i || n ? (u) => {
        n && o && e && (u.shiftKey && s ? e.toggleRowSelectionRange(t.id) : e.toggleRowSelection(t.id)), i == null || i(d);
      } : void 0,
      ...r,
      children: [
        m && /* @__PURE__ */ f(
          p,
          {
            item: t,
            isSelected: l,
            isDisabled: !o
          }
        ),
        c
      ]
    }
  );
}
export {
  v as TableRow
};
