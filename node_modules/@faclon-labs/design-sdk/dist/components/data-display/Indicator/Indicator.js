import { jsx as i, jsxs as u } from "react/jsx-runtime";
import { cn as d } from "../../../utils/cn.js";
/* empty css              */
const p = {
  Small: "BodySmallMedium",
  Medium: "BodyMediumMedium",
  Large: "BodyMediumMedium"
};
function f({
  intent: r = "Neutral",
  size: e = "Small",
  emphasis: t = "Subtle",
  label: n,
  children: c,
  accessibilityLabel: s,
  className: l,
  ...m
}) {
  const o = n ?? c, a = o != null && o !== "";
  return process.env.NODE_ENV !== "production" && !a && !s && console.warn("[Indicator] Provide `label`, `children`, or `accessibilityLabel` so the indicator has an accessible name."), /* @__PURE__ */ i(
    "div",
    {
      role: "status",
      "aria-label": a ? void 0 : s,
      className: d(
        "fds-indicator",
        `fds-indicator--emphasis-${t.toLowerCase()}`,
        l
      ),
      ...m,
      children: /* @__PURE__ */ u("div", { className: "fds-indicator__wrapper", children: [
        /* @__PURE__ */ i(
          "span",
          {
            className: d(
              "fds-indicator__dot",
              `fds-indicator__dot--${r.toLowerCase()}`,
              `fds-indicator__dot--${e.toLowerCase()}`
            )
          }
        ),
        a && /* @__PURE__ */ i("span", { className: d("fds-indicator__label", p[e]), children: o })
      ] })
    }
  );
}
f.displayName = "Indicator";
export {
  f as Indicator
};
