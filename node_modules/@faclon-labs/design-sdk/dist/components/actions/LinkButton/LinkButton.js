import { jsx as a, jsxs as h, Fragment as L } from "react/jsx-runtime";
import { forwardRef as N } from "react";
import { cn as k } from "../../../utils/cn.js";
/* empty css               */
const R = {
  Large: "BodyLargeRegular",
  Medium: "BodyMediumRegular",
  Small: "BodySmallRegular",
  XSmall: "BodyXSmallRegular"
}, A = {
  Large: "BodyLargeSemibold",
  Medium: "BodyMediumSemibold",
  Small: "BodySmallSemibold",
  XSmall: "BodyXSmallSemibold"
}, x = N(
  ({
    type: l = "Anchor",
    color: c = "Primary",
    size: f = "Large",
    label: p,
    leadingIcon: o,
    trailingIcon: n,
    isDisabled: s = !1,
    className: u,
    children: b,
    href: y,
    target: S,
    rel: g,
    onClick: t,
    accessibilityLabel: B,
    ...r
  }, d) => {
    const _ = l === "Action" ? A : R, i = k(
      "fds-link",
      `fds-link--type-${l.toLowerCase()}`,
      `fds-link--color-${c.toLowerCase()}`,
      _[f],
      u
    ), e = p ?? b, m = /* @__PURE__ */ h(L, { children: [
      o && /* @__PURE__ */ a("span", { className: "fds-link__icon", children: o }),
      /* @__PURE__ */ a("span", { className: "fds-link__label", "data-text": typeof e == "string" ? e : void 0, children: /* @__PURE__ */ a("span", { className: "fds-link__label-inner", children: e }) }),
      n && /* @__PURE__ */ a("span", { className: "fds-link__icon", children: n })
    ] });
    return l === "Action" ? /* @__PURE__ */ a(
      "button",
      {
        ref: d,
        className: i,
        type: "button",
        disabled: s,
        "aria-disabled": s || void 0,
        onClick: t,
        "aria-label": B,
        ...r,
        children: m
      }
    ) : /* @__PURE__ */ a(
      "a",
      {
        ref: d,
        className: i,
        href: y,
        target: S,
        rel: g,
        onClick: t,
        ...r,
        children: m
      }
    );
  }
);
x.displayName = "LinkButton";
export {
  x as LinkButton
};
