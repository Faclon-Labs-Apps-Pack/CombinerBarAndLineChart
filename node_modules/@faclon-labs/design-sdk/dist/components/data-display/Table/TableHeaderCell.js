import { jsx as n, jsxs as f } from "react/jsx-runtime";
/* empty css                    */
import { Info as v } from "react-feather";
import { useEffect as g } from "react";
import { cn as K } from "../../../utils/cn.js";
import { useTableContextOptional as N } from "./TableContext.js";
import { SortIndicator as k } from "./SortIndicator.js";
function H({
  children: m,
  infoTooltip: h,
  className: b,
  ...p
}) {
  var l, d, c;
  const { isSticky: T, headerKey: o, onClick: s, onKeyDown: a, ...u } = p, e = N(), t = !!(o && ((l = e == null ? void 0 : e.sortableKeys) != null && l.includes(o)));
  typeof process < "u" && ((d = process.env) == null ? void 0 : d.NODE_ENV) !== "production" && g(() => {
    o && e && !e.sortableKeys.includes(o) && console.warn(
      `[TableHeaderCell] \`headerKey="${o}"\` has no matching entry in \`sortFunctions\` on the parent <Table>. The column will not be sortable.`
    );
  }, [o, e == null ? void 0 : e.sortableKeys]);
  const i = t && ((c = e == null ? void 0 : e.sortState) == null ? void 0 : c.sortKey) === o ? e.sortState.direction : null, y = (r) => {
    s == null || s(r), t && o && (e == null || e.toggleSort(o));
  }, _ = (r) => {
    a == null || a(r), !(!t || !o) && (r.key === "Enter" || r.key === " ") && (r.preventDefault(), e == null || e.toggleSort(o));
  }, S = t ? i === "asc" ? "ascending" : i === "desc" ? "descending" : "none" : void 0;
  return /* @__PURE__ */ n(
    "th",
    {
      className: K("fds-table__header-cell", "BodyMediumSemibold", b),
      "data-sortable": t ? "true" : void 0,
      "aria-sort": S,
      tabIndex: t ? 0 : void 0,
      onClick: t ? y : s,
      onKeyDown: t ? _ : a,
      ...u,
      children: /* @__PURE__ */ f("div", { className: "fds-table__header-cell-inner", children: [
        /* @__PURE__ */ f("div", { className: "fds-table__header-cell-text-container", children: [
          /* @__PURE__ */ n("span", { className: "fds-table__header-cell-text", children: m }),
          h && /* @__PURE__ */ n("span", { className: "fds-table__header-cell-info", "aria-hidden": "true", children: /* @__PURE__ */ n(v, { size: 16 }) })
        ] }),
        t && /* @__PURE__ */ n(k, { direction: i })
      ] })
    }
  );
}
export {
  H as TableHeaderCell
};
