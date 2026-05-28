import { jsx as r } from "react/jsx-runtime";
import { forwardRef as p } from "react";
import { cn as m } from "../../../utils/cn.js";
/* empty css               */
const u = {
  12: "Small",
  16: "Medium",
  20: "Large"
}, b = p(
  ({
    icon: s,
    size: o = "Medium",
    emphasis: i = "Intense",
    isHighlighted: e = !1,
    isDisabled: a = !1,
    accessibilityLabel: t,
    className: c,
    ...d
  }, l) => {
    const n = o === "12" || o === "16" || o === "20" ? u[o] : o;
    process.env.NODE_ENV !== "production" && e && n === "Large" && console.warn('[IconButton] `isHighlighted` is not supported for size "Large" and will be ignored.'), process.env.NODE_ENV !== "production" && !t && console.warn("[IconButton] Provide `accessibilityLabel` so screen readers can announce the action.");
    const f = e && n !== "Large";
    return /* @__PURE__ */ r(
      "button",
      {
        ref: l,
        type: "button",
        "aria-label": t,
        className: m(
          "fds-icon-btn",
          `fds-icon-btn--size-${n.toLowerCase()}`,
          `fds-icon-btn--emphasis-${i.toLowerCase()}`,
          f && "fds-icon-btn--highlighted",
          c
        ),
        disabled: a,
        ...d,
        children: /* @__PURE__ */ r("span", { className: "fds-icon-btn__icon", children: s })
      }
    );
  }
);
b.displayName = "IconButton";
export {
  b as IconButton
};
