import { jsx as i } from "react/jsx-runtime";
import { forwardRef as p } from "react";
import { cn as d } from "../../../utils/cn.js";
const m = p(
  function({ children: r, className: o, ...a }, e) {
    return /* @__PURE__ */ i("div", { ref: e, className: d("fds-sidenav-group", o), role: "group", ...a, children: r });
  }
);
m.displayName = "SideNavBarGroup";
export {
  m as SideNavBarGroup
};
