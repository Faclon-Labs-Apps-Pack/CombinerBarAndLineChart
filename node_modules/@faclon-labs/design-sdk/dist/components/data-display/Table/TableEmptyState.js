import { jsx as t, jsxs as r, Fragment as n } from "react/jsx-runtime";
/* empty css                    */
import { cn as c } from "../../../utils/cn.js";
import { EmptyState as f } from "../../feedback/EmptyState/EmptyState.js";
import { NoDataOneIllustration as d } from "../../feedback/EmptyState/illustrations/NoDataOneIllustration.js";
function x({
  colSpan: m = 1,
  asCell: s = !0,
  illustration: o = /* @__PURE__ */ t(d, {}),
  title: l = "No data to display",
  className: p,
  children: e,
  ...i
}) {
  const a = /* @__PURE__ */ t(
    f,
    {
      illustration: o,
      title: l,
      className: c("fds-table__empty-state", p),
      ...i
    }
  );
  return s ? /* @__PURE__ */ t("tr", { className: "fds-table__empty-state-row", children: /* @__PURE__ */ r("td", { className: "fds-table__empty-state-cell", colSpan: m, children: [
    a,
    e
  ] }) }) : /* @__PURE__ */ r(n, { children: [
    a,
    e
  ] });
}
export {
  x as TableEmptyState
};
