import { jsxs as i, jsx as a } from "react/jsx-runtime";
import { forwardRef as l } from "react";
import { cn as o } from "../../../utils/cn.js";
const p = l(
  function({ children: e, className: r, ...s }, d) {
    return /* @__PURE__ */ i(
      "div",
      {
        ref: d,
        className: o("fds-sidenav-group-label BodySmallRegular", r),
        ...s,
        children: [
          /* @__PURE__ */ a("span", { className: "fds-sidenav-group-label__text", children: e }),
          /* @__PURE__ */ a("span", { className: "fds-sidenav-group-label__divider", "aria-hidden": "true" })
        ]
      }
    );
  }
);
p.displayName = "SideNavBarGroupLabel";
export {
  p as SideNavBarGroupLabel
};
