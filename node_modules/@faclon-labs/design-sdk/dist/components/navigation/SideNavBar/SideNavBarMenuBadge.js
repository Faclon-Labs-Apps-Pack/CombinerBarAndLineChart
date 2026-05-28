import { jsx as n } from "react/jsx-runtime";
import { forwardRef as o } from "react";
import { cn as i } from "../../../utils/cn.js";
const m = o(
  function({ children: a, className: e, ...r }, d) {
    return /* @__PURE__ */ n("span", { ref: d, className: i("fds-sidenav-menu-badge", e), ...r, children: a });
  }
);
m.displayName = "SideNavBarMenuBadge";
export {
  m as SideNavBarMenuBadge
};
