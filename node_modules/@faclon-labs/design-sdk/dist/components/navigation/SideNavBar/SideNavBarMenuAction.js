import { jsx as a } from "react/jsx-runtime";
import { forwardRef as m } from "react";
import { IconButton as s } from "../../actions/IconButton/IconButton.js";
import { cn as p } from "../../../utils/cn.js";
const d = m(
  function({ icon: n, onClick: o, accessibilityLabel: t, className: e }, i) {
    return /* @__PURE__ */ a("span", { className: p("fds-sidenav-menu-action", e), children: /* @__PURE__ */ a(
      s,
      {
        ref: i,
        size: "Small",
        icon: n,
        accessibilityLabel: t,
        onClick: (r) => {
          r.stopPropagation(), o == null || o(r);
        }
      }
    ) });
  }
);
d.displayName = "SideNavBarMenuAction";
export {
  d as SideNavBarMenuAction
};
