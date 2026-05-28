import { jsxs as z, jsx as d } from "react/jsx-runtime";
import { forwardRef as B, useId as J, useMemo as x, useState as K, useCallback as L } from "react";
import { cn as O } from "../../../utils/cn.js";
import { useControllableState as Q } from "../../../hooks/useControllableState.js";
import { InputFieldHeader as U } from "../../forms/InputFieldHeader/InputFieldHeader.js";
import { InputFieldFooter as V } from "../../forms/InputFieldFooter/InputFieldFooter.js";
import { ChipGroupContext as W } from "./ChipGroupContext.js";
/* empty css              */
function X(e) {
  return e == null ? /* @__PURE__ */ new Set() : new Set(Array.isArray(e) ? e : [e]);
}
const Y = B(
  ({
    children: e,
    selectionType: r = "single",
    value: I,
    defaultValue: h,
    onChange: i,
    name: w,
    size: l = "Small",
    isDisabled: m = !1,
    isRequired: f = !1,
    necessityIndicator: g,
    validationState: A = "none",
    label: o,
    helpText: N,
    errorText: q,
    accessibilityLabel: y,
    className: C,
    ...F
  }, G) => {
    const j = J(), n = w ?? `chip-group-${j}`, [p, S] = Q({
      value: I,
      defaultValue: h ?? (r === "multiple" ? [] : void 0)
    }), s = x(() => X(p), [p]), [E, H] = K(!1), v = L(
      (a) => {
        let t;
        r === "single" ? t = /* @__PURE__ */ new Set([a]) : (t = new Set(s), t.has(a) ? t.delete(a) : t.add(a));
        const c = Array.from(t), R = r === "single" ? c[0] ?? "" : c;
        H(!0), S(R), i == null || i({ name: n, values: c });
      },
      [r, s, S, i, n]
    ), _ = x(
      () => ({
        selectionType: r,
        selectedValues: s,
        onChipToggle: v,
        size: l,
        isDisabled: m,
        name: n
      }),
      [r, s, v, l, m, n]
    ), $ = g ?? (f ? "required" : "none"), k = f && E && s.size === 0, u = A === "error" || k, M = u ? "error" : "default", P = u ? q ?? (o ? `${o} is required` : "Selection is required") : N;
    return /* @__PURE__ */ z(
      "div",
      {
        ref: G,
        role: "group",
        "aria-label": o ? void 0 : y,
        "aria-invalid": u || void 0,
        className: O("fds-chip-group", C),
        ...F,
        children: [
          o && /* @__PURE__ */ d(
            U,
            {
              label: o,
              necessityIndicator: $
            }
          ),
          /* @__PURE__ */ d("div", { className: "fds-chip-group__chips", children: /* @__PURE__ */ d(W.Provider, { value: _, children: e }) }),
          /* @__PURE__ */ d(V, { helpText: P, state: M })
        ]
      }
    );
  }
);
Y.displayName = "ChipGroup";
export {
  Y as ChipGroup
};
