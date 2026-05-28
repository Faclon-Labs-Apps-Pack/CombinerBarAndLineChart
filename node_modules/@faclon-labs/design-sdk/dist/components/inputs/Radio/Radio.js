import { jsxs as h, jsx as o } from "react/jsx-runtime";
import { forwardRef as I, useId as P, useCallback as p } from "react";
import { cn as u } from "../../../utils/cn.js";
import { useRadioGroupContext as g } from "./RadioGroup.js";
/* empty css          */
const j = {
  Small: "BodySmallRegular",
  Medium: "BodyMediumRegular",
  Large: "BodyLargeRegular"
}, G = I(
  ({
    label: a,
    accessibilityLabel: r,
    helpText: n,
    size: R = "Small",
    isDisabled: b = !1,
    className: _,
    id: y,
    disabled: N,
    value: d,
    checked: v,
    onChange: i,
    name: w,
    ...S
  }, k) => {
    const D = P(), t = y ?? D, m = `${t}-help`, e = g();
    process.env.NODE_ENV !== "production" && !a && !r && console.warn("[Radio] Provide `label` or `accessibilityLabel` for accessibility.");
    const c = b || N || (e == null ? void 0 : e.isDisabled) || !1, E = w ?? (e == null ? void 0 : e.name), x = e ? e.value === d : v, f = (e == null ? void 0 : e.size) ?? R, B = (e == null ? void 0 : e.isRequired) ?? !1, C = p(
      (s) => {
        e && d !== void 0 && e.onChange(String(d), s), i == null || i(s);
      },
      [e, d, i]
    ), q = p(
      (s) => {
        if (s.key === "Enter") {
          s.preventDefault();
          const l = s.currentTarget;
          l.checked || (l.checked = !0, l.dispatchEvent(new Event("change", { bubbles: !0 })), e && d !== void 0 && e.onChange(String(d), s));
        }
      },
      [e, d]
    ), z = u(
      "fds-radio",
      `fds-radio--size-${f.toLowerCase()}`,
      c && "fds-radio--disabled",
      _
    );
    return /* @__PURE__ */ h("label", { className: z, htmlFor: t, children: [
      /* @__PURE__ */ h("span", { className: "fds-radio__row", children: [
        /* @__PURE__ */ o(
          "input",
          {
            ref: k,
            className: "fds-radio__input",
            type: "radio",
            id: t,
            name: E,
            value: d,
            checked: x,
            disabled: c,
            "aria-disabled": c || void 0,
            "aria-required": B || void 0,
            "aria-label": !a && r ? r : void 0,
            "aria-describedby": n ? m : void 0,
            onChange: C,
            onKeyDown: q,
            ...S
          }
        ),
        /* @__PURE__ */ o("span", { className: "fds-radio__circle", "aria-hidden": "true" }),
        a && /* @__PURE__ */ o("span", { className: u("fds-radio__label", j[f]), children: a })
      ] }),
      n && /* @__PURE__ */ o("span", { id: m, className: "fds-radio__help-text BodyXSmallRegular", children: n })
    ] });
  }
);
G.displayName = "Radio";
export {
  G as Radio
};
