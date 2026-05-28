import { jsxs as ae, jsx as H } from "react/jsx-runtime";
import { useId as fe, useState as w, useCallback as f, useRef as E, useEffect as R, useMemo as me } from "react";
import { createPortal as de } from "react-dom";
import { cn as pe } from "../../../utils/cn.js";
import { useDropdownPortal as ye } from "../../../hooks/useDropdownPortal.js";
import { useKeyboard as ge } from "../../../hooks/useKeyboard.js";
import { TimeInputTrigger as he } from "./TimeInputTrigger.js";
import { TimeInputPopover as Ie } from "./TimeInputPopover.js";
/* empty css              */
const u = (t) => t < 10 ? `0${t}` : String(t), Te = Array.from({ length: 24 }, (t, r) => u(r)), ve = Array.from({ length: 12 }, (t, r) => u(r + 1)), Me = Array.from({ length: 60 }, (t, r) => u(r)), P = (t) => t < 12 ? "AM" : "PM", $ = (t) => {
  const r = t % 12;
  return r === 0 ? 11 : r - 1;
}, k = (t, r) => {
  const s = t === 11 ? 12 : t + 1;
  return r === "AM" ? s === 12 ? 0 : s : s === 12 ? 12 : s + 12;
}, _e = (t, r) => {
  if (!t) return "";
  const { hours: s, minutes: d } = t;
  if (r === "24") return `${u(s)} : ${u(d)}`;
  const c = s % 12 === 0 ? 12 : s % 12;
  return `${u(c)} : ${u(d)} ${P(s)}`;
}, xe = "Select time", N = () => {
  const t = /* @__PURE__ */ new Date();
  return { hours: t.getHours(), minutes: t.getMinutes() };
};
function Ae({
  label: t,
  name: r,
  value: s,
  defaultValue: d = null,
  hourFormat: c = "12",
  size: V = "Medium",
  placeholder: K,
  isOpen: S,
  onOpenChange: p,
  onChange: y,
  helpText: U,
  errorText: b,
  successText: C,
  validationState: L = "none",
  isDisabled: g = !1,
  isRequired: j = !1,
  necessityIndicator: q,
  className: B,
  id: z,
  ...G
}) {
  const J = fe(), Q = z ?? J, T = r ?? "", W = K ?? xe, v = s !== void 0, [X, Y] = w(d), m = v ? s ?? null : X, M = S !== void 0, [Z, F] = w(!1), n = M ? S : Z, l = f(
    (e) => {
      M || F(e), p == null || p(e);
    },
    [M, p]
  ), [h, I] = w(() => m ?? N()), _ = E(n);
  R(() => {
    !_.current && n && I(m ?? N()), _.current = n;
  }, [n, m]);
  const ee = c === "12" ? ve : Te, te = c === "12" ? $(h.hours) : h.hours, ne = h.minutes, re = P(h.hours), oe = me(
    () => _e(m, c),
    [m, c]
  ), a = f(
    (e) => {
      v || Y(e), y == null || y({ name: T, value: e });
    },
    [v, T, y]
  ), x = E(!1), se = f(
    (e) => {
      I((o) => {
        const i = {
          ...o,
          hours: c === "12" ? k(e, P(o.hours)) : e
        };
        return a(i), i;
      });
    },
    [c, a]
  ), ce = f((e) => {
    I((o) => {
      const i = { ...o, minutes: e };
      return a(i), i;
    });
  }, [a]), ie = f((e) => {
    I((o) => {
      const i = $(o.hours), O = { ...o, hours: k(i, e) };
      return a(O), O;
    });
  }, [a]), A = E(null), { portalRef: ue, pos: D } = ye(A, n, () => l(!1));
  ge(
    "Escape",
    (e) => {
      n && (e.preventDefault(), e.stopPropagation(), x.current = !0, l(!1));
    },
    n
  ), R(() => {
    _.current && !n && x.current && (x.current = !1, requestAnimationFrame(() => {
      var o;
      const e = (o = A.current) == null ? void 0 : o.querySelector(
        ".fds-text-input__input"
      );
      e == null || e.focus();
    }));
  }, [n]);
  const le = f(
    (e) => {
      if (g) return;
      const o = e.target;
      if (o.closest(".fds-time-trigger") !== null && !o.closest(".fds-time-popover"))
        switch (e.key) {
          case "Enter":
          case " ":
            e.preventDefault(), l(!n);
            break;
          case "ArrowDown":
            n || (e.preventDefault(), l(!0));
            break;
        }
    },
    [g, n, l]
  );
  return /* @__PURE__ */ ae(
    "div",
    {
      ref: A,
      id: Q,
      className: pe("fds-time-input", B),
      onKeyDown: le,
      ...G,
      children: [
        /* @__PURE__ */ H(
          he,
          {
            label: t,
            name: T || void 0,
            placeholder: W,
            displayValue: oe,
            size: V,
            isOpen: n,
            isDisabled: g,
            isRequired: j,
            necessityIndicator: q,
            helpText: U,
            errorText: b,
            successText: C,
            validationState: L,
            onClick: () => {
              g || l(!n);
            }
          }
        ),
        n && D && typeof document < "u" && de(
          /* @__PURE__ */ H(
            "div",
            {
              ref: ue,
              className: "fds-time-input__popover",
              style: { top: D.top, left: D.left },
              children: /* @__PURE__ */ H(
                Ie,
                {
                  hourFormat: c,
                  hourItems: ee,
                  minuteItems: Me,
                  hourIndex: te,
                  minuteIndex: ne,
                  meridiem: re,
                  onHourChange: se,
                  onMinuteChange: ce,
                  onMeridiemChange: ie
                }
              )
            }
          ),
          document.body
        )
      ]
    }
  );
}
Ae.displayName = "TimeInput";
export {
  Ae as TimeInput
};
