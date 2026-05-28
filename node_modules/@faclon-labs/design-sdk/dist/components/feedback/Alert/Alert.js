import { jsxs as a, jsx as e } from "react/jsx-runtime";
import { forwardRef as A } from "react";
import { X as B, Info as d, AlertTriangle as C, AlertCircle as R, CheckCircle as b } from "react-feather";
import { cn as x } from "../../../utils/cn.js";
import { IconButton as E } from "../../actions/IconButton/IconButton.js";
/* empty css          */
const L = {
  Positive: /* @__PURE__ */ e(b, {}),
  Negative: /* @__PURE__ */ e(R, {}),
  Notice: /* @__PURE__ */ e(C, {}),
  Information: /* @__PURE__ */ e(d, {}),
  Neutral: /* @__PURE__ */ e(d, {})
}, P = {
  Negative: "alert",
  Notice: "alert",
  Positive: "status",
  Information: "status",
  Neutral: "status"
}, S = {
  Negative: "assertive",
  Notice: "polite",
  Positive: "polite",
  Information: "polite",
  Neutral: "polite"
}, j = A(
  ({
    title: c,
    description: o,
    color: t = "Information",
    emphasis: m = "Subtle",
    isFullWidth: l = !1,
    isBanner: f = !1,
    icon: N,
    primaryAction: s,
    secondaryAction: i,
    isDismissible: _ = !1,
    onDismiss: v,
    dismissAriaLabel: p = "Dismiss alert",
    className: u,
    ...h
  }, I) => {
    const g = N ?? L[t], r = _ ? /* @__PURE__ */ e(
      E,
      {
        size: "16",
        icon: /* @__PURE__ */ e(B, {}),
        onClick: v,
        "aria-label": p,
        className: "fds-alert__close"
      }
    ) : null, n = !!(s || i);
    return /* @__PURE__ */ a(
      "div",
      {
        ref: I,
        role: P[t],
        "aria-live": S[t],
        className: x("fds-alert", u),
        "data-color": t,
        "data-emphasis": m,
        "data-full-width": l || void 0,
        "data-banner": f || void 0,
        ...h,
        children: [
          /* @__PURE__ */ e("span", { className: "fds-alert__leading-icon", "aria-hidden": "true", children: g }),
          /* @__PURE__ */ a("div", { className: "fds-alert__content", children: [
            /* @__PURE__ */ a("div", { className: "fds-alert__header", children: [
              /* @__PURE__ */ e("p", { className: "fds-alert__title BodyMediumSemibold", children: c }),
              l && r
            ] }),
            o && /* @__PURE__ */ e("p", { className: "fds-alert__description BodySmallRegular", children: o }),
            l && n && /* @__PURE__ */ a("div", { className: "fds-alert__actions", children: [
              s,
              i
            ] })
          ] }),
          !l && (n || r) && /* @__PURE__ */ a("div", { className: "fds-alert__trailing", children: [
            s,
            i,
            r
          ] })
        ]
      }
    );
  }
);
j.displayName = "Alert";
export {
  j as Alert
};
