import { jsx as a } from "react/jsx-runtime";
import { Children as i, isValidElement as l, cloneElement as p } from "react";
import { cn as c } from "../../../utils/cn.js";
/* empty css               */
function d({ size: m = "Medium", children: o, className: t, ...n }) {
  const e = i.toArray(o);
  return /* @__PURE__ */ a("nav", { className: c("fds-breadcrumb", t), "aria-label": "Breadcrumb", ...n, children: /* @__PURE__ */ a("ol", { className: "fds-breadcrumb__list", children: e.map((r, s) => l(r) ? p(r, {
    size: m,
    showSeparator: r.props.showSeparator ?? s < e.length - 1
  }) : r) }) });
}
d.displayName = "Breadcrumb";
export {
  d as Breadcrumb
};
