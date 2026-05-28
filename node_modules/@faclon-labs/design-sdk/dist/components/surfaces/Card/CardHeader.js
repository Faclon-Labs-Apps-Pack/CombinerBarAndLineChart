import { jsxs as e, jsx as d } from "react/jsx-runtime";
import { cn as m } from "../../../utils/cn.js";
/* empty css               */
function _({
  title: s,
  subtitle: a,
  leadingItem: c,
  trailingItem: r,
  counter: i,
  showDivider: l = !0,
  className: h,
  ...n
}) {
  return /* @__PURE__ */ e("div", { className: m("fds-card-header", h), ...n, children: [
    /* @__PURE__ */ e("div", { className: "fds-card-header__container", children: [
      /* @__PURE__ */ e("div", { className: "fds-card-header__left", children: [
        c,
        /* @__PURE__ */ e("div", { className: "fds-card-header__content", children: [
          /* @__PURE__ */ e("div", { className: "fds-card-header__title-container", children: [
            /* @__PURE__ */ d("span", { className: "fds-card-header__title BodyLargeSemibold", children: s }),
            i
          ] }),
          a && /* @__PURE__ */ d("span", { className: "fds-card-header__subtitle BodySmallRegular", children: a })
        ] })
      ] }),
      r && /* @__PURE__ */ d("div", { className: "fds-card-header__right", children: r })
    ] }),
    l && /* @__PURE__ */ d("hr", { className: "fds-card-header__divider" })
  ] });
}
_.displayName = "CardHeader";
export {
  _ as CardHeader
};
