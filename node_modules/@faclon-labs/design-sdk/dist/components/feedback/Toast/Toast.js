import { jsxs as a, jsx as s } from "react/jsx-runtime";
import { forwardRef as y } from "react";
import { X as z, Info as r, AlertTriangle as L, AlertCircle as S, CheckCircle as I } from "react-feather";
import { cn as k } from "../../../utils/cn.js";
import { Button as x } from "../../actions/Button/Button.js";
import { IconButton as A } from "../../actions/IconButton/IconButton.js";
/* empty css          */
const B = {
  Positive: /* @__PURE__ */ s(I, { size: 16 }),
  Negative: /* @__PURE__ */ s(S, { size: 16 }),
  Notice: /* @__PURE__ */ s(L, { size: 16 }),
  Information: /* @__PURE__ */ s(r, { size: 16 }),
  Neutral: /* @__PURE__ */ s(r, { size: 16 })
}, T = y(function({
  type: d = "Information",
  color: n = "Neutral",
  content: N,
  heading: m,
  leading: p,
  action: e,
  toastId: h = "",
  onDismiss: i,
  showProgress: g = !1,
  duration: o,
  isVisible: u = !0,
  className: v
}, b) {
  const t = d === "Promotional", c = p ?? (t ? /* @__PURE__ */ s(r, { size: 16 }) : B[n]), C = (l) => {
    i == null || i(l);
  }, f = (l) => {
    var _;
    (_ = e == null ? void 0 : e.onClick) == null || _.call(e, { event: l, toastId: h });
  };
  return /* @__PURE__ */ a(
    "div",
    {
      ref: b,
      role: "status",
      "aria-live": "polite",
      className: k(
        "fds-toast",
        `fds-toast--type-${d.toLowerCase()}`,
        `fds-toast--color-${n.toLowerCase()}`,
        u ? "fds-toast--entering" : "fds-toast--exiting",
        v
      ),
      children: [
        /* @__PURE__ */ a("div", { className: "fds-toast__container", children: [
          /* @__PURE__ */ a("div", { className: "fds-toast__leading-content", children: [
            c && /* @__PURE__ */ s("span", { className: "fds-toast__leading", children: c }),
            /* @__PURE__ */ a("div", { className: "fds-toast__skeleton", children: [
              t && m && /* @__PURE__ */ s("p", { className: "fds-toast__heading BodySmallSemibold", children: m }),
              /* @__PURE__ */ s("p", { className: "fds-toast__content BodySmallRegular", children: N }),
              t && e && /* @__PURE__ */ s("div", { className: "fds-toast__action", children: /* @__PURE__ */ s(
                x,
                {
                  variant: "Secondary",
                  color: "Primary",
                  size: "XSmall",
                  label: e.text,
                  onClick: f,
                  isLoading: e.isLoading
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ a("div", { className: "fds-toast__trailing", children: [
            !t && e && /* @__PURE__ */ s(
              "button",
              {
                type: "button",
                className: "fds-toast__inline-action BodySmallSemibold",
                onClick: f,
                disabled: e.isLoading,
                children: e.text
              }
            ),
            i && /* @__PURE__ */ s(
              A,
              {
                icon: /* @__PURE__ */ s(z, { size: 16 }),
                size: "Small",
                emphasis: t ? "Intense" : "Subtle",
                accessibilityLabel: "Dismiss",
                className: "fds-toast__dismiss",
                onClick: C
              }
            )
          ] })
        ] }),
        g && o && Number.isFinite(o) && /* @__PURE__ */ s(
          "span",
          {
            "aria-hidden": "true",
            className: "fds-toast__progress",
            style: { animationDuration: `${o}ms` }
          }
        )
      ]
    }
  );
});
T.displayName = "Toast";
export {
  T as Toast
};
