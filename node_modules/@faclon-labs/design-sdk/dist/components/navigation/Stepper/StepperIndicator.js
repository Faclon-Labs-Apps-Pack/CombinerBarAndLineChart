import { jsx as e } from "react/jsx-runtime";
import { forwardRef as d } from "react";
import { cn as s } from "../../../utils/cn.js";
/* empty css                     */
const n = {
  positive: "fds-stepper-indicator--positive",
  negative: "fds-stepper-indicator--negative",
  notice: "fds-stepper-indicator--notice",
  information: "fds-stepper-indicator--information",
  primary: "fds-stepper-indicator--primary",
  neutral: "fds-stepper-indicator--neutral"
}, c = d(
  ({ color: i = "neutral", size: r = "Medium", isDisabled: t, className: a, ...o }, p) => /* @__PURE__ */ e(
    "div",
    {
      ref: p,
      className: s(
        "fds-stepper-indicator",
        `fds-stepper-indicator--size-${r.toLowerCase()}`,
        n[i],
        a
      ),
      "data-disabled": t || void 0,
      ...o,
      children: /* @__PURE__ */ e("span", { className: "fds-stepper-indicator__dot", "aria-hidden": "true" })
    }
  )
);
c.displayName = "StepperIndicator";
export {
  c as StepperIndicator
};
