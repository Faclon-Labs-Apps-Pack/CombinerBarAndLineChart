import { jsx as r } from "react/jsx-runtime";
import { forwardRef as m } from "react";
import { Menu as n } from "react-feather";
import { IconButton as g } from "../../actions/IconButton/IconButton.js";
import { useSideNavBar as d } from "./useSideNavBar.js";
const f = m(
  function({ icon: i, accessibilityLabel: o = "Toggle navigation", className: e }, a) {
    const { toggleSideNavBar: t } = d();
    return /* @__PURE__ */ r(
      g,
      {
        ref: a,
        size: "Medium",
        icon: i ?? /* @__PURE__ */ r(n, { size: 16 }),
        accessibilityLabel: o,
        onClick: t,
        className: e
      }
    );
  }
);
f.displayName = "SideNavBarTrigger";
export {
  f as SideNavBarTrigger
};
