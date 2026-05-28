import { jsxs as u, jsx as e } from "react/jsx-runtime";
import { forwardRef as q, useMemo as D, isValidElement as m, Children as H, cloneElement as J } from "react";
import { cn as p } from "../../../utils/cn.js";
import { useStepper as Q } from "./StepperContext.js";
import { StepperIndicator as W } from "./StepperIndicator.js";
import { StepLine as Y } from "./StepLine.js";
/* empty css                */
function Z(s, o, r) {
  return o === 0 ? "default" : r === 1 ? "single-item" : s === 0 ? "start" : s === r - 1 ? "end" : "middle";
}
function $(s) {
  var r;
  const o = (r = s.type) == null ? void 0 : r.displayName;
  return o === "StepperIndicator" || o === "StepperIcon";
}
const k = /* @__PURE__ */ e(W, { color: "neutral" }), ee = q(
  ({
    title: s,
    titleColor: o,
    description: r,
    timestamp: g,
    stepProgress: E = "none",
    marker: t,
    trailing: h,
    isSelected: S,
    isDisabled: a,
    href: v,
    target: M,
    onClick: i,
    accessibilityLabel: L,
    children: _,
    _index: b = 0,
    _totalIndex: B = 0,
    _nestingLevel: d = 0,
    className: C,
    style: T
  }, x) => {
    const {
      itemsInGroupCount: w,
      totalItemsInParentGroupCount: F,
      orientation: l,
      size: n
    } = Q(), G = D(
      () => Z(b, d, w),
      [b, d, w]
    ), O = l === "vertical", V = B === 0, j = B === F - 1, y = !!v || !!i;
    if (process.env.NODE_ENV !== "production") {
      h && l === "horizontal" && console.warn("[StepperStep] `trailing` is ignored in horizontal Stepper."), d >= 1 && l === "horizontal" && console.warn(
        "[StepperStep] Nested Steppers are not supported in horizontal orientation."
      ), t && m(t) && !$(t) && console.warn(
        "[StepperStep] `marker` should be a `<StepperIndicator>` or `<StepperIcon>`. Other elements will not receive the `isDisabled` / `size` cascade and may break the colour-cascade hover background."
      );
      let f = !1;
      H.forEach(_, (z) => {
        var R;
        m(z) && ((R = z.type) == null ? void 0 : R.displayName) === "Stepper" && (f = !0);
      }), f && console.warn(
        "[StepperStep] Found a nested <Stepper> inside `children`. Move it OUT of <StepperStep> and render it as a SIBLING of the StepperStep items in the parent <Stepper> for nesting curves to render."
      );
    }
    const A = m(t) ? J(
      t,
      {
        isDisabled: a ?? t.props.isDisabled,
        size: t.props.size ?? n
      }
    ) : k, K = (m(t) ? t.props.color : void 0) ?? "neutral", P = n === "Large" ? "BodyLargeRegular" : "BodyMediumRegular", U = n === "Large" ? "BodyMediumRegular" : "BodySmallRegular", X = n === "Large" ? "BodySmallRegular" : "BodyXSmallRegular", N = /* @__PURE__ */ u("div", { className: "fds-stepper-step__header", children: [
      /* @__PURE__ */ u("div", { className: "fds-stepper-step__text-stack", children: [
        /* @__PURE__ */ e(
          "p",
          {
            className: p("fds-stepper-step__title", P),
            style: o ? { color: o } : void 0,
            children: s
          }
        ),
        r && /* @__PURE__ */ e("p", { className: p("fds-stepper-step__description", U), children: r }),
        g && /* @__PURE__ */ e("p", { className: p("fds-stepper-step__timestamp", X), children: g })
      ] }),
      h && O && /* @__PURE__ */ e("span", { className: "fds-stepper-step__trailing", children: h })
    ] }), I = {
      className: p(
        "fds-stepper-step__header-box",
        y && "fds-stepper-step__header-box--interactive"
      )
    };
    let c;
    return v ? c = /* @__PURE__ */ e(
      "a",
      {
        ...I,
        href: a ? void 0 : v,
        target: M,
        "aria-disabled": a || void 0,
        onClick: a ? (f) => f.preventDefault() : i,
        children: N
      }
    ) : i ? c = /* @__PURE__ */ e(
      "button",
      {
        ...I,
        type: "button",
        disabled: a,
        onClick: i,
        children: N
      }
    ) : c = /* @__PURE__ */ e("div", { ...I, children: N }), /* @__PURE__ */ u(
      "div",
      {
        ref: x,
        className: p("fds-stepper-step", C),
        style: T,
        role: "listitem",
        "aria-label": L ?? s,
        "aria-current": S ? "step" : void 0,
        "aria-disabled": a || void 0,
        "data-orientation": l,
        "data-size": n.toLowerCase(),
        "data-nesting-level": d,
        "data-selected": S || void 0,
        "data-disabled": a || void 0,
        "data-color": K,
        children: [
          /* @__PURE__ */ e(
            Y,
            {
              stepType: G,
              shouldShowStartBranch: !V,
              shouldShowEndBranch: !j,
              marker: A,
              stepProgress: E
            }
          ),
          /* @__PURE__ */ u(
            "div",
            {
              className: p(
                "fds-stepper-step__body",
                y && "fds-stepper-step__body--interactive"
              ),
              "data-selected": S || void 0,
              "data-interactive": y || void 0,
              children: [
                c,
                _ && /* @__PURE__ */ e("div", { className: "fds-stepper-step__slot", children: _ })
              ]
            }
          )
        ]
      }
    );
  }
);
ee.displayName = "StepperStep";
export {
  ee as StepperStep
};
