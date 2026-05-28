import { jsx as e, Fragment as n } from "react/jsx-runtime";
/* empty css                  */
function _({ rows: r = 5, columns: a }) {
  return /* @__PURE__ */ e(n, { children: Array.from({ length: r }).map((s, l) => /* @__PURE__ */ e(
    "tr",
    {
      className: "fds-table__skeleton-row",
      "aria-hidden": "true",
      children: Array.from({ length: a }).map((o, t) => /* @__PURE__ */ e("td", { className: "fds-table__skeleton-cell", children: /* @__PURE__ */ e("span", { className: "fds-table__skeleton-bar" }) }, t))
    },
    l
  )) });
}
export {
  _ as TableSkeleton
};
