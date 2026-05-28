import { jsx as a, jsxs as d } from "react/jsx-runtime";
import { useId as M, useState as P, useCallback as $, useContext as h, createContext as j } from "react";
import { cn as p } from "../../../utils/cn.js";
import { InputFieldFooter as w } from "../../forms/InputFieldFooter/InputFieldFooter.js";
/* empty css               */
const f = j(null);
function H() {
  return h(f);
}
const A = {
  Small: "BodySmallSemibold",
  Medium: "BodySmallSemibold",
  Large: "BodyMediumSemibold"
};
function F({
  label: e,
  labelPosition: v = "Top",
  helpText: i,
  isRequired: s = !1,
  necessityIndicator: t = "None",
  name: _,
  value: u,
  defaultValue: N,
  onChange: o,
  size: n = "Small",
  isDisabled: S = !1,
  children: b,
  className: g,
  orientation: x = "Vertical",
  ...C
}) {
  const G = M(), r = _ ?? `radio-group-${G}`, l = u !== void 0, [L, R] = P(N ?? ""), y = l ? u : L, B = $(
    (c, I) => {
      l || R(c), o == null || o({ name: r, value: c, event: I });
    },
    [l, o, r]
  ), m = t === "Required" ? " *" : t === "Optional" ? " (optional)" : "", V = {
    name: r,
    value: y,
    onChange: B,
    isDisabled: S,
    isRequired: s,
    size: n
  };
  return /* @__PURE__ */ a(f.Provider, { value: V, children: /* @__PURE__ */ d(
    "div",
    {
      role: "radiogroup",
      className: p(
        "fds-radio-group",
        `fds-radio-group--${x.toLowerCase()}`,
        `fds-radio-group--label-${v.toLowerCase()}`,
        g
      ),
      "aria-label": e,
      "aria-required": s || void 0,
      ...C,
      children: [
        e && /* @__PURE__ */ d("span", { className: p("fds-radio-group__label", A[n]), children: [
          e,
          m && /* @__PURE__ */ a("span", { className: "fds-radio-group__label-suffix", children: m })
        ] }),
        /* @__PURE__ */ d("div", { className: "fds-radio-group__content", children: [
          /* @__PURE__ */ a("div", { className: "fds-radio-group__body", children: b }),
          i && /* @__PURE__ */ a(
            w,
            {
              helpText: i,
              state: "default",
              size: "Medium",
              className: "fds-radio-group__footer"
            }
          )
        ] })
      ]
    }
  ) });
}
F.displayName = "RadioGroup";
export {
  F as RadioGroup,
  H as useRadioGroupContext
};
