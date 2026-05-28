import { jsx as x, jsxs as W } from "react/jsx-runtime";
import { useState as v, useRef as D, useCallback as m, useEffect as H, useMemo as L, createContext as Y } from "react";
import { createPortal as q } from "react-dom";
import { cn as U } from "../../../utils/cn.js";
import { Toast as J } from "./Toast.js";
/* empty css          */
const Q = Y(null), Z = 4e3, tt = 8e3, et = 0.05, st = 0.7, nt = 12, ot = 12, rt = 3, ct = 64, it = 280;
let F = 0;
const at = () => (F += 1, `fds-toast-${F}`);
function lt({ id: i, reportHeight: h, className: u, style: y, children: o }) {
  const d = D(null);
  return H(() => {
    if (!d.current) return;
    const g = d.current;
    h(i, g.offsetHeight);
    const a = typeof ResizeObserver < "u" ? new ResizeObserver(() => h(i, g.offsetHeight)) : null;
    return a && a.observe(g), () => a == null ? void 0 : a.disconnect();
  }, [i, h]), /* @__PURE__ */ x("div", { ref: d, className: u, style: y, children: o });
}
function Tt({
  position: i = "bottom-left",
  zIndex: h = 2001,
  offset: u = 24,
  children: y
}) {
  const [o, d] = v([]), [g, a] = v(!1), f = D(/* @__PURE__ */ new Map()), T = D(/* @__PURE__ */ new Map()), R = D(/* @__PURE__ */ new Map()), I = D(/* @__PURE__ */ new Map()), [, V] = v(0), p = m((t, e) => {
    I.current.get(t) !== e && (I.current.set(t, e), V((s) => s + 1));
  }, []), N = m((t) => {
    const e = f.current.get(t);
    e && (clearTimeout(e), f.current.delete(t));
  }, []), E = m(
    (t) => {
      const e = t ? [t] : o.filter((s) => s.isVisible).map((s) => s.id);
      e.length !== 0 && (e.forEach((s) => N(s)), d(
        (s) => s.map((n) => e.includes(n.id) ? { ...n, isVisible: !1 } : n)
      ), e.forEach((s) => {
        setTimeout(() => {
          d((n) => n.filter((r) => r.id !== s)), I.current.delete(s), T.current.delete(s), R.current.delete(s);
        }, it);
      }));
    },
    [o, N]
  ), w = m(
    (t, e) => {
      if (!Number.isFinite(e) || e <= 0) return;
      R.current.set(t, Date.now()), T.current.set(t, e);
      const s = setTimeout(() => E(t), e);
      f.current.set(t, s);
    },
    [E]
  ), O = m(
    (t) => {
      const e = t.id ?? at(), s = t.type ?? "Information", n = t.color ?? "Neutral", r = t.autoDismiss ?? s === "Information", b = s === "Promotional" ? tt : Z, M = t.duration ?? (r ? b : 1 / 0), k = {
        id: e,
        type: s,
        color: n,
        content: t.content,
        heading: t.heading,
        leading: t.leading,
        action: t.action,
        onDismissButtonClick: t.onDismissButtonClick,
        autoDismiss: r,
        duration: M,
        showProgress: t.showProgress ?? !1,
        createdAt: Date.now(),
        isVisible: !0
      };
      return d((A) => {
        const l = A.findIndex((c) => c.id === e);
        if (l >= 0) {
          const c = [...A];
          return c[l] = k, c;
        }
        return [...A, k];
      }), r && Number.isFinite(M) && w(e, M), e;
    },
    [w]
  ), B = m(() => {
    a(!0), f.current.forEach((t, e) => {
      clearTimeout(t);
      const s = R.current.get(e) ?? Date.now(), n = T.current.get(e) ?? 0, r = Date.now() - s;
      T.current.set(e, Math.max(0, n - r));
    }), f.current.clear();
  }, []), K = m(() => {
    a(!1), o.forEach((t) => {
      if (!t.autoDismiss || !Number.isFinite(t.duration) || !t.isVisible) return;
      const e = T.current.get(t.id) ?? t.duration;
      w(t.id, e);
    });
  }, [o, w]);
  H(() => () => {
    f.current.forEach(clearTimeout), f.current.clear();
  }, []);
  const $ = L(
    () => ({ toasts: o, show: O, dismiss: E }),
    [o, O, E]
  ), j = L(() => {
    const t = { zIndex: h }, [e, s] = i.split("-");
    return e === "top" ? t.top = u : t.bottom = u, s === "left" ? t.left = u : s === "right" ? t.right = u : (t.left = "50%", t.transform = "translateX(-50%)"), t;
  }, [i, h, u]), P = i.startsWith("top"), S = o.slice(-4), _ = S.length, C = g || _ <= rt, G = /* @__PURE__ */ x(
    "div",
    {
      className: U("fds-toast-stack", `fds-toast-stack--${i}`),
      style: j,
      onMouseEnter: B,
      onMouseLeave: K,
      children: S.map((t, e) => {
        const s = _ - 1 - e, n = s === 0, r = C ? 1 : Math.max(st, 1 - s * et);
        let b = 0;
        if (C)
          for (let l = e + 1; l < _; l += 1) {
            const c = S[l].id, X = I.current.get(c) ?? ct;
            b += X + ot;
          }
        else
          b = s * nt;
        const A = {
          transform: `translateY(${b * (P ? 1 : -1)}px) scale(${r})`,
          zIndex: -s
        };
        return /* @__PURE__ */ x(
          lt,
          {
            id: t.id,
            reportHeight: p,
            className: U(
              "fds-toast-slot",
              P ? "fds-toast-slot--top" : "fds-toast-slot--bottom"
            ),
            style: A,
            children: /* @__PURE__ */ x(
              J,
              {
                type: t.type,
                color: t.color,
                content: t.content,
                heading: t.heading,
                leading: t.leading,
                action: t.action,
                toastId: t.id,
                onDismiss: (l) => {
                  var c;
                  (c = t.onDismissButtonClick) == null || c.call(t, { event: l, toastId: t.id }), E(t.id);
                },
                showProgress: t.showProgress && n,
                duration: t.duration,
                isVisible: t.isVisible
              }
            )
          },
          t.id
        );
      })
    }
  ), z = typeof document < "u" ? q(G, document.body) : null;
  return /* @__PURE__ */ W(Q.Provider, { value: $, children: [
    y,
    z
  ] });
}
export {
  Tt as ToastContainer,
  Q as ToastContext
};
