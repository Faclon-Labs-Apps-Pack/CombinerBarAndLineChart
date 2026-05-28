import { jsxs as b, jsx as e } from "react/jsx-runtime";
import { forwardRef as Y, useState as D, createElement as I, cloneElement as H } from "react";
import { User as V } from "react-feather";
import { cn as B } from "../../../utils/cn.js";
import { useAvatarGroup as q } from "./AvatarGroupContext.js";
import { avatarTopAddonOffsets as F, avatarToIndicatorSize as J, avatarToBottomAddonPx as K } from "./avatarMaps.js";
/* empty css           */
const Q = {
  XSmall: 12,
  Small: 16,
  Medium: 16,
  Large: 20,
  XLarge: 24
}, W = {
  XSmall: "BodyXSmallSemibold",
  Small: "BodyXSmallSemibold",
  Medium: "BodySmallSemibold",
  Large: "BodyMediumSemibold",
  XLarge: "BodyMediumSemibold"
};
function Z(v) {
  const s = v.trim();
  if (!s) return "";
  if (/^\+\d+$/.test(s)) return s;
  const a = s.split(/\s+/);
  return a.length === 1 ? a[0].slice(0, 2).toUpperCase() : (a[0][0] + a[a.length - 1][0]).toUpperCase();
}
const k = Y(function({
  size: s,
  variant: a = "Circle",
  color: z = "Neutral",
  src: p,
  alt: u,
  srcSet: L,
  crossOrigin: w,
  referrerPolicy: E,
  name: o,
  icon: X,
  href: n,
  target: C,
  rel: M,
  onClick: c,
  isSelected: P = !1,
  topAddon: r,
  bottomAddon: _,
  accessibilityLabel: A,
  className: O
}, T) {
  var y;
  const d = q(), t = (d == null ? void 0 : d.size) ?? s ?? "Medium";
  if (process.env.NODE_ENV !== "production" && r) {
    const l = (y = r.type) == null ? void 0 : y.displayName;
    l !== "Indicator" && console.error(
      "[Avatar] `topAddon` only accepts an `<Indicator>` element. Got:",
      l ?? r.type
    );
  }
  const [$, x] = D(!1), m = !!p && !$, N = o ? Z(o) : "", g = !m && !!N, G = !m && !g, R = X ?? V, U = !!n || !!c, h = A ?? o ?? u, j = B(
    "fds-avatar",
    `fds-avatar--size-${t.toLowerCase()}`,
    `fds-avatar--variant-${a.toLowerCase()}`,
    `fds-avatar--color-${z.toLowerCase()}`,
    U && "fds-avatar--interactive",
    P && "fds-avatar--selected",
    O
  ), f = /* @__PURE__ */ b("span", { className: "fds-avatar__visual", children: [
    m && /* @__PURE__ */ e(
      "img",
      {
        src: p,
        alt: u ?? o ?? "",
        srcSet: L,
        crossOrigin: w,
        referrerPolicy: E,
        className: "fds-avatar__img",
        onError: () => x(!0),
        draggable: !1
      }
    ),
    g && /* @__PURE__ */ e("span", { className: B("fds-avatar__initials", W[t]), children: N }),
    G && /* @__PURE__ */ e("span", { className: "fds-avatar__icon", "aria-hidden": "true", children: I(R, { size: Q[t] }) })
  ] });
  let i;
  const S = {
    className: "fds-avatar__interactive",
    "aria-label": h
  };
  return n ? i = /* @__PURE__ */ e("a", { ...S, href: n, target: C, rel: M, children: f }) : c ? i = /* @__PURE__ */ e(
    "button",
    {
      ...S,
      type: "button",
      onClick: (l) => c(l),
      children: f
    }
  ) : i = /* @__PURE__ */ e("div", { className: "fds-avatar__static", role: "img", "aria-label": h, children: f }), /* @__PURE__ */ b("div", { ref: T, className: j, children: [
    i,
    r && /* @__PURE__ */ e(
      "span",
      {
        className: "fds-avatar__top-addon",
        style: F[a][t],
        children: H(r, { size: J[t] })
      }
    ),
    _ && /* @__PURE__ */ e("span", { className: "fds-avatar__bottom-addon", "aria-hidden": "true", children: I(_, { size: K[t] }) })
  ] });
});
k.displayName = "Avatar";
export {
  k as Avatar
};
