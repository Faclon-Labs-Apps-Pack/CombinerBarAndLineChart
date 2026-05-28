import { jsx as r } from "react/jsx-runtime";
import { forwardRef as a, createElement as c } from "react";
import { cn as d } from "../../../utils/cn.js";
/* empty css                */
const f = {
  positive: "fds-stepper-icon--positive",
  negative: "fds-stepper-icon--negative",
  notice: "fds-stepper-icon--notice",
  information: "fds-stepper-icon--information",
  primary: "fds-stepper-icon--primary",
  neutral: "fds-stepper-icon--neutral"
}, m = {
  Medium: 12,
  Large: 14
}, l = a(
  ({ icon: i, color: t = "neutral", size: e = "Medium", isDisabled: o = !1, className: p, ...s }, n) => /* @__PURE__ */ r(
    "div",
    {
      ref: n,
      className: d(
        "fds-stepper-icon",
        `fds-stepper-icon--size-${e.toLowerCase()}`,
        f[t],
        p
      ),
      "data-disabled": o || void 0,
      ...s,
      children: /* @__PURE__ */ r("span", { className: "fds-stepper-icon__glyph", "aria-hidden": "true", children: c(i, { size: m[e] }) })
    }
  )
);
l.displayName = "StepperIcon";
export {
  l as StepperIcon
};
