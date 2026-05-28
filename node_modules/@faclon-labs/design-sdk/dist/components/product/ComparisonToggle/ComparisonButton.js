import { jsx as o, jsxs as e } from "react/jsx-runtime";
import { cn as a } from "../../../utils/cn.js";
/* empty css                     */
function i() {
  return /* @__PURE__ */ e("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", children: [
    /* @__PURE__ */ o(
      "path",
      {
        className: "fds-comparison-btn__arrow-up",
        d: "M5.33 6L8 3.33L10.67 6",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    ),
    /* @__PURE__ */ o(
      "path",
      {
        className: "fds-comparison-btn__arrow-down",
        d: "M10.67 10L8 12.67L5.33 10",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    )
  ] });
}
function d({
  isSelected: r = !1,
  isDisabled: n = !1,
  className: t,
  ...s
}) {
  return /* @__PURE__ */ o(
    "button",
    {
      type: "button",
      className: a(
        "fds-comparison-btn",
        r ? "fds-comparison-btn--selected" : "fds-comparison-btn--unselected",
        n && "fds-comparison-btn--disabled",
        t
      ),
      disabled: n,
      "aria-pressed": r,
      "aria-label": "Toggle comparison",
      ...s,
      children: /* @__PURE__ */ o(i, {})
    }
  );
}
d.displayName = "ComparisonButton";
export {
  d as ComparisonButton
};
