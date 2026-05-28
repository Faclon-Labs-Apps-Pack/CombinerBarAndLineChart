import { jsx as i } from "react/jsx-runtime";
import { forwardRef as t } from "react";
import { cn as n } from "../../../utils/cn.js";
const o = t(
  function({ children: e, className: r, ...m }, a) {
    return /* @__PURE__ */ i("li", { ref: a, className: n("fds-sidenav-menu-item", r), ...m, children: e });
  }
);
o.displayName = "SideNavBarMenuItem";
export {
  o as SideNavBarMenuItem
};
