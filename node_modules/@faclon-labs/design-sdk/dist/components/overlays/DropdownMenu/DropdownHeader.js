import { jsxs as d, jsx as e } from "react/jsx-runtime";
import { cn as c } from "../../../utils/cn.js";
import { Divider as p } from "../../layout/Divider/Divider.js";
/* empty css                   */
function m({
  title: o,
  subtitle: r,
  leadingItem: n,
  trailingItem: s,
  counter: a,
  className: i,
  ...l
}) {
  return /* @__PURE__ */ d("div", { className: c("fds-dropdown-header", i), ...l, children: [
    /* @__PURE__ */ d("div", { className: "fds-dropdown-header__container", children: [
      /* @__PURE__ */ d("div", { className: "fds-dropdown-header__left", children: [
        n,
        /* @__PURE__ */ d("div", { className: "fds-dropdown-header__content", children: [
          /* @__PURE__ */ d("div", { className: "fds-dropdown-header__heading", children: [
            /* @__PURE__ */ e("span", { className: "fds-dropdown-header__title BodyLargeSemibold", children: o }),
            a && /* @__PURE__ */ e("span", { className: "fds-dropdown-header__counter", children: a })
          ] }),
          r && /* @__PURE__ */ e("span", { className: "fds-dropdown-header__subtitle BodySmallRegular", children: r })
        ] })
      ] }),
      s
    ] }),
    /* @__PURE__ */ e(p, { variant: "Muted" })
  ] });
}
m.displayName = "DropdownHeader";
export {
  m as DropdownHeader
};
