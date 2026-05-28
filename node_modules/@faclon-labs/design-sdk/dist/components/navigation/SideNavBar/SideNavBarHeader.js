import { jsxs as i, jsx as e } from "react/jsx-runtime";
import { forwardRef as l } from "react";
import { cn as o } from "../../../utils/cn.js";
const v = l(
  function({ brand: r, title: a, subtitle: d, trailing: s, className: n, ...m }, c) {
    return /* @__PURE__ */ i("div", { ref: c, className: o("fds-sidenav-header", n), ...m, children: [
      r && /* @__PURE__ */ e("div", { className: "fds-sidenav-header__brand", children: r }),
      (a || d) && /* @__PURE__ */ i("div", { className: "fds-sidenav-header__text", children: [
        a && /* @__PURE__ */ e("span", { className: "fds-sidenav-header__title BodyMediumSemibold", children: a }),
        d && /* @__PURE__ */ e("span", { className: "fds-sidenav-header__subtitle BodySmallRegular", children: d })
      ] }),
      s && /* @__PURE__ */ e("div", { className: "fds-sidenav-header__trailing", children: s })
    ] });
  }
);
v.displayName = "SideNavBarHeader";
export {
  v as SideNavBarHeader
};
