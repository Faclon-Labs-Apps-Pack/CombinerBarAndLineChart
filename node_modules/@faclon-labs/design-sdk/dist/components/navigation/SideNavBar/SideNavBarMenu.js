import { jsx as i } from "react/jsx-runtime";
import { forwardRef as n } from "react";
import { cn as m } from "../../../utils/cn.js";
const s = n(
  function({ children: r, className: e, ...a }, o) {
    return /* @__PURE__ */ i("ul", { ref: o, className: m("fds-sidenav-menu", e), role: "list", ...a, children: r });
  }
);
s.displayName = "SideNavBarMenu";
export {
  s as SideNavBarMenu
};
