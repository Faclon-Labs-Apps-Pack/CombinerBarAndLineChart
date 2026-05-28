import { jsx as H, jsxs as P } from "react/jsx-runtime";
import { forwardRef as S, useId as T, useRef as B, useCallback as c, useMemo as I, Children as F, isValidElement as O } from "react";
import { cn as U } from "../../../utils/cn.js";
import { useControllableState as q } from "../../../hooks/useControllableState.js";
import { TabsContext as G } from "./TabsContext.js";
import { TabIndicator as J } from "./TabIndicator.js";
/* empty css         */
function Q(i) {
  let s;
  return F.forEach(i, (l) => {
    if (s !== void 0 || !O(l)) return;
    const o = l.props;
    typeof o.value == "string" && !o.isDisabled && (s = o.value);
  }), s;
}
const X = S(
  ({
    value: i,
    defaultValue: s,
    onChange: l,
    onValueChange: o,
    variant: d = "Bordered",
    size: u = "Medium",
    orientation: r = "Horizontal",
    isFullWidthTabItem: m = !1,
    className: k,
    children: p,
    onKeyDown: n,
    ...h
  }, z) => {
    const L = T(), b = h.id ?? `fds-tabs-${L}`, R = l ?? o, [C, w] = q({
      value: i,
      defaultValue: s,
      onChange: R
    }), f = B(/* @__PURE__ */ new Map()), x = c((e, t) => {
      t ? f.current.set(e, t) : f.current.delete(e);
    }, []), v = c(
      (e) => f.current.get(e),
      []
    ), y = I(
      () => Q(p),
      [p]
    ), a = c(
      (e, t) => {
        if (e.length === 0) return;
        e[(t + e.length) % e.length].focus();
      },
      []
    ), V = c(
      (e) => {
        if (n == null || n(e), e.defaultPrevented) return;
        const t = Array.from(f.current.values()).filter(
          (N) => !N.disabled
        );
        if (t.length === 0) return;
        const g = document.activeElement, A = g ? t.indexOf(g) : -1, E = r === "Horizontal", M = E ? "ArrowRight" : "ArrowDown", j = E ? "ArrowLeft" : "ArrowUp";
        e.key === M ? (e.preventDefault(), a(t, A + 1)) : e.key === j ? (e.preventDefault(), a(t, A - 1)) : e.key === "Home" ? (e.preventDefault(), a(t, 0)) : e.key === "End" && (e.preventDefault(), a(t, t.length - 1));
      },
      [a, n, r]
    ), $ = I(
      () => ({
        selectedValue: C,
        setSelectedValue: w,
        variant: d,
        size: u,
        orientation: r,
        isFullWidthTabItem: m,
        baseId: b,
        registerItem: x,
        getItemEl: v,
        firstFocusableValue: y
      }),
      [
        C,
        w,
        d,
        u,
        r,
        m,
        b,
        x,
        v,
        y
      ]
    ), D = U(
      "fds-tabs",
      `fds-tabs--variant-${d.toLowerCase()}`,
      `fds-tabs--orientation-${r.toLowerCase()}`,
      `fds-tabs--size-${u.toLowerCase()}`,
      r === "Horizontal" && m && "fds-tabs--full-width",
      k
    );
    return /* @__PURE__ */ H(G.Provider, { value: $, children: /* @__PURE__ */ P(
      "div",
      {
        ref: z,
        role: "tablist",
        "aria-orientation": r === "Horizontal" ? "horizontal" : "vertical",
        className: D,
        onKeyDown: V,
        ...h,
        id: b,
        children: [
          p,
          /* @__PURE__ */ H(J, {})
        ]
      }
    ) });
  }
);
X.displayName = "Tabs";
export {
  X as Tabs
};
