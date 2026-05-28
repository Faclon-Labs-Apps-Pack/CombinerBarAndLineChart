import { jsxs as q, jsx as l } from "react/jsx-runtime";
import { forwardRef as Ne, useId as Ie, useState as O, useRef as H, useCallback as u } from "react";
import { Minus as _e, Plus as De } from "react-feather";
import { Button as K } from "../../actions/Button/Button.js";
import { InputFieldHeader as ge } from "../../forms/InputFieldHeader/InputFieldHeader.js";
import { InputFieldFooter as we } from "../../forms/InputFieldFooter/InputFieldFooter.js";
import { cn as qe } from "../../../utils/cn.js";
/* empty css                 */
const X = (n, o, p) => {
  let i = n;
  return typeof o == "number" && i < o && (i = o), typeof p == "number" && i > p && (i = p), i;
}, T = (n) => {
  if (n.trim() === "" || n === "-") return null;
  const o = Number(n);
  return Number.isFinite(o) ? o : null;
}, Se = Ne(
  ({
    label: n,
    necessityIndicator: o,
    name: p,
    value: i,
    defaultValue: U = null,
    min: a,
    max: c,
    step: b = 1,
    placeholder: J = "Enter value",
    helpText: Q,
    errorText: V,
    successText: W,
    validationState: S = "none",
    isDisabled: Y = !1,
    isRequired: h = !1,
    isReadOnly: Z = !1,
    leadingIcon: $,
    leadingLabel: j,
    onChange: N,
    onFocus: I,
    onBlur: _,
    decrementLabel: L = "Decrease value",
    incrementLabel: ee = "Increase value",
    className: re,
    id: te,
    disabled: ne,
    ...se
  }, le) => {
    const ae = Ie(), M = te ?? ae, P = `${M}-help`, d = p ?? "", m = Y || ne || !1, v = o ?? (h ? "required" : void 0), R = i !== void 0, [oe, ie] = O(U), r = R ? i ?? null : oe, [A, D] = O(
      r === null ? "" : String(r)
    ), k = H(!1), g = H(r);
    if (!k.current && g.current !== r) {
      g.current = r;
      const e = r === null ? "" : String(r);
      e !== A && D(e);
    }
    const [ue, ce] = O(!1), y = S === "error" || (v === "required" || h) && ue && r === null, E = S === "success" && !y, B = y ? S === "error" ? V ?? "Error" : V ?? `${n} is required` : E ? W ?? "" : Q ?? "", de = y ? "error" : E ? "success" : "default", G = !!B, fe = typeof a == "number" && r !== null && r <= a, pe = typeof c == "number" && r !== null && r >= c, F = m || fe, x = m || pe, f = u(
      (e) => {
        R || ie(e), N == null || N({ name: d, value: e });
      },
      [R, d, N]
    ), w = u(
      (e) => {
        const t = X((r ?? (typeof a == "number" ? a : 0)) + e, a, c);
        g.current = t, D(String(t)), f(t);
      },
      [r, a, c, f]
    ), z = u(() => {
      F || w(-b);
    }, [F, w, b]), C = u(() => {
      x || w(b);
    }, [x, w, b]), me = u(
      (e) => {
        const s = e.target.value;
        if (s !== "" && s !== "-" && !/^-?\d*\.?\d*$/.test(s)) return;
        k.current = !0, D(s);
        const t = T(s);
        f(t);
      },
      [f]
    ), ve = u(
      (e) => {
        e.key === "ArrowUp" ? (e.preventDefault(), C()) : e.key === "ArrowDown" && (e.preventDefault(), z());
      },
      [C, z]
    ), ye = u(
      (e) => {
        I == null || I({ name: d, value: T(e.target.value) });
      },
      [d, I]
    ), be = u(
      (e) => {
        k.current = !1, ce(!0);
        const s = T(e.target.value), t = s === null ? null : X(s, a, c);
        t !== s && (g.current = t, D(t === null ? "" : String(t)), f(t)), _ == null || _({ name: d, value: t });
      },
      [d, a, c, f, _]
    ), he = qe(
      "fds-counter-input",
      m && "fds-counter-input--disabled",
      y && "fds-counter-input--error",
      E && "fds-counter-input--success",
      re
    );
    return /* @__PURE__ */ q("div", { className: he, children: [
      /* @__PURE__ */ l(
        ge,
        {
          label: v === "optional" ? `${n} (optional)` : n,
          necessityIndicator: v === "required" ? "required" : "none",
          htmlFor: M
        }
      ),
      /* @__PURE__ */ l("div", { className: "fds-counter-input__field-wrapper", children: /* @__PURE__ */ q("div", { className: "fds-counter-input__field", children: [
        /* @__PURE__ */ q("div", { className: "fds-counter-input__leading", children: [
          $ && /* @__PURE__ */ l("span", { className: "fds-counter-input__icon", children: $ }),
          j && /* @__PURE__ */ l("span", { className: "fds-counter-input__leading-label BodyMediumRegular", children: j }),
          /* @__PURE__ */ l(
            "input",
            {
              ref: le,
              className: "fds-counter-input__input BodyMediumRegular",
              type: "text",
              inputMode: "numeric",
              id: M,
              name: d || void 0,
              placeholder: J,
              value: A,
              readOnly: Z,
              disabled: m,
              required: v === "required" || h || void 0,
              "aria-label": n,
              "aria-required": v === "required" || h || void 0,
              "aria-disabled": m || void 0,
              "aria-invalid": y || void 0,
              "aria-describedby": G ? P : void 0,
              "aria-valuenow": r ?? void 0,
              "aria-valuemin": a,
              "aria-valuemax": c,
              onChange: me,
              onKeyDown: ve,
              onFocus: ye,
              onBlur: be,
              ...se
            }
          )
        ] }),
        /* @__PURE__ */ q("div", { className: "fds-counter-input__trailing", children: [
          /* @__PURE__ */ l(
            K,
            {
              iconOnly: !0,
              size: "XSmall",
              variant: "Gray",
              color: "Primary",
              leadingIcon: /* @__PURE__ */ l(_e, { size: 16 }),
              onClick: z,
              isDisabled: F,
              "aria-label": L,
              tabIndex: -1
            }
          ),
          /* @__PURE__ */ l(
            K,
            {
              iconOnly: !0,
              size: "XSmall",
              variant: "Gray",
              color: "Primary",
              leadingIcon: /* @__PURE__ */ l(De, { size: 16 }),
              onClick: C,
              isDisabled: x,
              "aria-label": ee,
              tabIndex: -1
            }
          )
        ] })
      ] }) }),
      G && /* @__PURE__ */ l(
        we,
        {
          helpText: B || void 0,
          state: de,
          id: P
        }
      )
    ] });
  }
);
Se.displayName = "CounterInput";
export {
  Se as CounterInput
};
