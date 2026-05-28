import { jsxs as H, jsx as E } from "react/jsx-runtime";
import { useState as v, useRef as m, useCallback as B, useEffect as L, useLayoutEffect as J, isValidElement as Q, cloneElement as $ } from "react";
import { createPortal as g } from "react-dom";
import { cn as O } from "../../../utils/cn.js";
/* empty css            */
const z = 200, tt = 0, et = 200, ot = 8, nt = 8, _ = 8, rt = {
  Top: "top",
  TopStart: "top-start",
  TopEnd: "top-end",
  Bottom: "bottom",
  BottomStart: "bottom-start",
  BottomEnd: "bottom-end",
  Left: "left",
  Right: "right"
};
function it(t) {
  return t === "Top" ? "Bottom" : t === "Bottom" ? "Top" : t === "TopStart" ? "BottomStart" : t === "TopEnd" ? "BottomEnd" : t === "BottomStart" ? "TopStart" : t === "BottomEnd" ? "TopEnd" : t === "Left" ? "Right" : "Left";
}
function V(t, e, i) {
  const u = t.left + t.width / 2, l = t.top + t.height / 2, n = ot + nt;
  switch (i) {
    case "Top":
      return { top: t.top - e.height - n, left: u - e.width / 2 };
    case "TopStart":
      return { top: t.top - e.height - n, left: t.left };
    case "TopEnd":
      return { top: t.top - e.height - n, left: t.right - e.width };
    case "Bottom":
      return { top: t.bottom + n, left: u - e.width / 2 };
    case "BottomStart":
      return { top: t.bottom + n, left: t.left };
    case "BottomEnd":
      return { top: t.bottom + n, left: t.right - e.width };
    case "Left":
      return { top: l - e.height / 2, left: t.left - e.width - n };
    case "Right":
      return { top: l - e.height / 2, left: t.right + n };
  }
}
function j(t, e, i) {
  const u = window.innerWidth, l = window.innerHeight;
  return !!(i.startsWith("Top") && t.top < _ || i.startsWith("Bottom") && t.top + e.height > l - _ || i === "Left" && t.left < _ || i === "Right" && t.left + e.width > u - _);
}
function st({
  bodyText: t,
  heading: e,
  placement: i = "Top",
  open: u,
  onOpenChange: l,
  zIndex: n,
  accessibilityLabel: q,
  children: y,
  className: Y,
  ...F
}) {
  const r = u !== void 0, [K, b] = v(!1), d = r ? u : K, [f, W] = v(d), [U, N] = v(!1), P = m(null), A = m(null), x = m(void 0), D = m(void 0), I = m(void 0), [s, X] = v(null), c = B(
    (o) => {
      l == null || l({ isOpen: o });
    },
    [l]
  ), M = B(() => {
    clearTimeout(D.current), x.current = setTimeout(() => {
      r || b(!0), c(!0);
    }, z);
  }, [c, r]), k = B(() => {
    clearTimeout(x.current), D.current = setTimeout(() => {
      r || b(!1), c(!1);
    }, tt);
  }, [c, r]);
  L(() => {
    d ? (clearTimeout(I.current), W(!0), N(!1)) : f && (N(!0), I.current = setTimeout(() => {
      W(!1), N(!1);
    }, et));
  }, [d]), L(() => () => {
    clearTimeout(x.current), clearTimeout(D.current), clearTimeout(I.current);
  }, []), L(() => {
    if (!d) return;
    const o = (h) => {
      h.key === "Escape" && (r || b(!1), c(!1));
    };
    return document.addEventListener("keydown", o), () => document.removeEventListener("keydown", o);
  }, [d, r, c]);
  const p = B(() => {
    if (!P.current || !A.current) return;
    const o = P.current.getBoundingClientRect(), h = A.current.getBoundingClientRect(), w = { width: h.width, height: h.height };
    let a = i, T = V(o, w, a);
    if (j(T, w, a)) {
      const S = it(a), R = V(o, w, S);
      j(R, w, S) || (a = S, T = R);
    }
    X({ top: T.top, left: T.left, placement: a });
  }, [i]);
  J(() => {
    f && p();
  }, [f, p, t, e]), L(() => {
    if (!f) return;
    const o = () => p();
    return window.addEventListener("scroll", o, !0), window.addEventListener("resize", o), () => {
      window.removeEventListener("scroll", o, !0), window.removeEventListener("resize", o);
    };
  }, [f, p]);
  let C = y;
  Q(y) && (C = $(y, {
    "aria-label": q ?? t
  }));
  const Z = {
    top: s == null ? void 0 : s.top,
    left: s == null ? void 0 : s.left,
    visibility: s ? "visible" : "hidden",
    ...n !== void 0 && { zIndex: n }
  }, G = f ? /* @__PURE__ */ H(
    "div",
    {
      ref: A,
      className: O("fds-tooltip", U && "fds-tooltip--exiting"),
      role: "tooltip",
      "data-placement": rt[(s == null ? void 0 : s.placement) ?? i],
      style: Z,
      children: [
        /* @__PURE__ */ H("div", { className: "fds-tooltip__content", children: [
          e && /* @__PURE__ */ E("span", { className: "fds-tooltip__heading BodyMediumSemibold", children: e }),
          /* @__PURE__ */ E("span", { className: "fds-tooltip__body BodySmallRegular", children: t })
        ] }),
        /* @__PURE__ */ E(
          "svg",
          {
            className: "fds-tooltip__arrow",
            width: "14",
            height: "8",
            viewBox: "0 0 14 8",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            "aria-hidden": "true",
            children: /* @__PURE__ */ E("path", { d: "M7 0L14 8H0L7 0Z", fill: "currentColor" })
          }
        )
      ]
    }
  ) : null;
  return /* @__PURE__ */ H(
    "span",
    {
      ref: P,
      className: O("fds-tooltip-wrapper", Y),
      onMouseEnter: r ? void 0 : M,
      onMouseLeave: r ? void 0 : k,
      onFocus: r ? void 0 : M,
      onBlur: r ? void 0 : k,
      ...F,
      children: [
        C,
        typeof document < "u" && G ? g(G, document.body) : null
      ]
    }
  );
}
st.displayName = "Tooltip";
export {
  st as Tooltip
};
