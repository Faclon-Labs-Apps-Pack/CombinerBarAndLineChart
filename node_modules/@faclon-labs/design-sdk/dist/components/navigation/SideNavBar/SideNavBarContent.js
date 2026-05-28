import { jsx as e } from "react/jsx-runtime";
import { forwardRef as a } from "react";
import { cn as i } from "../../../utils/cn.js";
const d = a(
  function({ children: t, className: n, ...o }, r) {
    return /* @__PURE__ */ e("div", { ref: r, className: i("fds-sidenav-content", n), ...o, children: t });
  }
);
d.displayName = "SideNavBarContent";
export {
  d as SideNavBarContent
};
