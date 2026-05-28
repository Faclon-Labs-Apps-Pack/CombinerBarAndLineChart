import { jsx as R } from "react/jsx-runtime";
import { forwardRef as W, Children as b, useMemo as T, useRef as _, useCallback as k, isValidElement as j, cloneElement as P } from "react";
import { cn as H } from "../../../utils/cn.js";
import { StepperStep as M } from "./StepperStep.js";
import { StepperContext as q, useStepper as B } from "./StepperContext.js";
/* empty css            */
function F(t) {
  return typeof t != "string" && (t == null ? void 0 : t.displayName) === "Stepper";
}
function G(t) {
  return t === M;
}
function U({
  children: t,
  orientation: r,
  _nestingLevel: o
}) {
  const f = B(), c = T(() => {
    let s = 0;
    const x = (l, p, u) => {
      let I = u;
      return b.map(l, (n, S) => {
        if (!j(n)) return n;
        if (G(n.type)) {
          const C = {
            _index: I++,
            _totalIndex: s++,
            _nestingLevel: p
          };
          return P(n, { ...C, key: S });
        }
        return F(n.type) && p < 3 ? P(n, {
          orientation: r,
          _nestingLevel: p + 1,
          children: x(
            n.props.children,
            p + 1,
            0
          )
        }) : n;
      });
    };
    return {
      childrenWithIndex: o === 0 ? x(t, 0, 0) : t,
      totalIndex: s
    };
  }, [t, o, r]), m = o === 0 ? c.totalIndex : f.totalItemsInParentGroupCount;
  return {
    childrenWithIndex: c.childrenWithIndex,
    totalItemsInParentGroupCount: m
  };
}
const V = '.fds-stepper-step__header-box--interactive:not([aria-disabled="true"]):not([disabled])', $ = W(
  ({
    children: t,
    orientation: r = "vertical",
    size: o = "Medium",
    width: f,
    minWidth: c,
    maxWidth: m,
    _nestingLevel: s = 0,
    className: x,
    style: h,
    onKeyDown: l,
    ...p
  }, u) => {
    const I = b.count(t), { childrenWithIndex: n, totalItemsInParentGroupCount: S } = U({
      children: t,
      orientation: r,
      _nestingLevel: s
    }), C = T(
      () => ({
        orientation: r,
        size: o,
        itemsInGroupCount: I,
        totalItemsInParentGroupCount: S
      }),
      [r, o, I, S]
    ), y = _(null), g = k(
      (e) => {
        if (l == null || l(e), e.defaultPrevented || r !== "horizontal" || s !== 0 || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
        const E = y.current;
        if (!E) return;
        const i = Array.from(
          E.querySelectorAll(V)
        );
        if (i.length === 0) return;
        const A = document.activeElement, d = A ? i.indexOf(A) : -1;
        let a = d;
        e.key === "ArrowRight" ? a = d < 0 ? 0 : (d + 1) % i.length : e.key === "ArrowLeft" ? a = d <= 0 ? i.length - 1 : d - 1 : e.key === "Home" ? a = 0 : e.key === "End" && (a = i.length - 1), i[a] && (e.preventDefault(), i[a].focus());
      },
      [l, r, s]
    ), w = k(
      (e) => {
        y.current = e, typeof u == "function" ? u(e) : u && (u.current = e);
      },
      [u]
    ), N = {
      ...h,
      ...f !== void 0 && { width: f },
      ...c !== void 0 && { minWidth: c },
      ...m !== void 0 && { maxWidth: m }
    };
    return /* @__PURE__ */ R(q.Provider, { value: C, children: /* @__PURE__ */ R(
      "div",
      {
        ref: w,
        className: H(
          "fds-stepper",
          `fds-stepper--size-${o.toLowerCase()}`,
          x
        ),
        role: "list",
        "aria-orientation": r,
        "data-orientation": r,
        "data-size": o.toLowerCase(),
        "data-nesting-level": s,
        style: N,
        onKeyDown: g,
        ...p,
        children: n
      }
    ) });
  }
);
$.displayName = "Stepper";
export {
  $ as Stepper
};
