import { jsxs as f, jsx as e } from "react/jsx-runtime";
import { cn as $ } from "../../../utils/cn.js";
/* empty css                */
function B({
  label: a,
  accessibilityLabel: h,
  type: d = "progress",
  value: v = 0,
  min: c = 0,
  max: l = 100,
  size: _ = "Large",
  intent: b = "Neutral",
  isIndeterminate: p = !1,
  showPercentage: m = !0,
  className: N,
  ...x
}) {
  const s = d === "meter", r = !s && p;
  process.env.NODE_ENV !== "production" && s && p && console.warn('[ProgressBar] `isIndeterminate` is ignored when `type="meter"` (meters represent static values).');
  const o = Math.min(c, l), t = Math.max(c, l), i = Math.min(t, Math.max(o, v)), g = t - o, n = g > 0 ? (i - o) / g * 100 : 0, u = s ? `${i}` : `${Math.round(n)}%`, w = r ? void 0 : u, y = !!a || m && !r, M = s ? "meter" : "progressbar";
  return /* @__PURE__ */ f(
    "div",
    {
      className: $(
        "fds-progress-bar",
        `fds-progress-bar--size-${_.toLowerCase()}`,
        `fds-progress-bar--intent-${b.toLowerCase()}`,
        `fds-progress-bar--type-${d}`,
        r && "fds-progress-bar--indeterminate",
        N
      ),
      role: M,
      "aria-valuenow": r ? void 0 : i,
      "aria-valuemin": o,
      "aria-valuemax": t,
      "aria-valuetext": w,
      "aria-label": h ?? a ?? "Progress",
      ...x,
      children: [
        y && /* @__PURE__ */ f("div", { className: "fds-progress-bar__header", children: [
          a && /* @__PURE__ */ e("span", { className: "fds-progress-bar__label BodySmallRegular", children: a }),
          m && !r && /* @__PURE__ */ e("span", { className: "fds-progress-bar__percentage BodySmallRegular", children: u })
        ] }),
        /* @__PURE__ */ e("div", { className: "fds-progress-bar__track", children: /* @__PURE__ */ e(
          "div",
          {
            className: "fds-progress-bar__indicator",
            style: r ? void 0 : { width: `${n}%` },
            children: !s && !r && n > 0 && /* @__PURE__ */ e("span", { className: "fds-progress-bar__pulse", "aria-hidden": "true" })
          }
        ) })
      ]
    }
  );
}
B.displayName = "ProgressBar";
export {
  B as ProgressBar
};
