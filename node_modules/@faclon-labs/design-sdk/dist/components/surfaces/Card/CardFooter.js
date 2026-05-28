import { jsxs as o, jsx as d } from "react/jsx-runtime";
import { cn as m } from "../../../utils/cn.js";
/* empty css               */
function _({
  title: r,
  subtitle: a,
  primaryAction: e,
  secondaryAction: s,
  showDivider: c = !0,
  layout: t = "Desktop",
  className: f,
  ...i
}) {
  const l = r || a, n = e || s;
  return /* @__PURE__ */ o("div", { className: m("fds-card-footer", `fds-card-footer--${t.toLowerCase()}`, f), ...i, children: [
    c && /* @__PURE__ */ d("hr", { className: "fds-card-footer__divider" }),
    /* @__PURE__ */ o("div", { className: "fds-card-footer__container", children: [
      l && /* @__PURE__ */ o("div", { className: "fds-card-footer__content", children: [
        r && /* @__PURE__ */ d("span", { className: "fds-card-footer__title BodyMediumSemibold", children: r }),
        a && /* @__PURE__ */ d("span", { className: "fds-card-footer__subtitle BodySmallRegular", children: a })
      ] }),
      n && /* @__PURE__ */ o("div", { className: "fds-card-footer__actions", children: [
        s && /* @__PURE__ */ d("div", { className: "fds-card-footer__action", children: s }),
        e && /* @__PURE__ */ d("div", { className: "fds-card-footer__action", children: e })
      ] })
    ] })
  ] });
}
_.displayName = "CardFooter";
export {
  _ as CardFooter
};
