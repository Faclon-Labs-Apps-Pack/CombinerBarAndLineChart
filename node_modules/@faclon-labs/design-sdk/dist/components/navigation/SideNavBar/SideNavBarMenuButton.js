import { jsxs as p, jsx as t } from "react/jsx-runtime";
import { forwardRef as b } from "react";
import { cn as N } from "../../../utils/cn.js";
const B = b(
  function({
    icon: d,
    label: u,
    isActive: a,
    isDisabled: n,
    href: o,
    target: i,
    as: r,
    onClick: m,
    trailing: s,
    className: c,
    ...l
  }, v) {
    const e = r ?? (o ? "a" : "button"), f = e === "button" ? { type: "button" } : e === "a" ? { href: o, target: i } : {};
    return /* @__PURE__ */ p(
      e,
      {
        ref: v,
        className: N(
          "fds-sidenav-menu-button",
          a && "fds-sidenav-menu-button--active",
          n && "fds-sidenav-menu-button--disabled",
          c
        ),
        "aria-current": a ? "page" : void 0,
        "aria-disabled": n || void 0,
        onClick: n ? void 0 : m,
        ...f,
        ...l,
        children: [
          /* @__PURE__ */ t("span", { className: "fds-sidenav-menu-button__icon", children: d }),
          /* @__PURE__ */ t("span", { className: "fds-sidenav-menu-button__label", children: u }),
          s && /* @__PURE__ */ t("span", { className: "fds-sidenav-menu-button__trailing", children: s })
        ]
      }
    );
  }
);
B.displayName = "SideNavBarMenuButton";
export {
  B as SideNavBarMenuButton
};
