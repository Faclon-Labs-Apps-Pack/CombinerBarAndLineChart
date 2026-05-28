import { jsxs as c, jsx as e, Fragment as N } from "react/jsx-runtime";
import { useState as R, useEffect as _ } from "react";
import { motion as o, AnimatePresence as S } from "framer-motion";
import { cn as d } from "../../../utils/cn.js";
import { Rotate as w } from "./Rotate.js";
const f = 0.28, v = [0, 0, 0.2, 1], A = 0.36, u = [0.5, 0, 0, 1], b = 0.36, D = 0.96, I = 0.48, M = [0.3, 0, 0.2, 1], O = () => /* @__PURE__ */ e("svg", { width: "9", height: "9", viewBox: "0 0 9 9", fill: "none", "aria-hidden": !0, children: /* @__PURE__ */ e(
  "path",
  {
    d: "M4.7169 8.67519C4.62025 8.93638 4.25084 8.93638 4.15419 8.67519L3.13296 5.91537C3.10258 5.83326 3.03784 5.76851 2.95572 5.73813L0.195898 4.7169C-0.0652872 4.62025 -0.0652871 4.25084 0.195899 4.15419L2.95572 3.13296C3.03784 3.10258 3.10258 3.03784 3.13297 2.95572L4.15419 0.1959C4.25084 -0.0652861 4.62026 -0.0652861 4.7169 0.195899L5.73813 2.95572C5.76851 3.03784 5.83326 3.10258 5.91537 3.13297L8.6752 4.15419C8.93638 4.25084 8.93638 4.62026 8.6752 4.7169L5.91537 5.73813C5.83326 5.76851 5.76851 5.83326 5.73813 5.91537L4.7169 8.67519Z",
    fill: "currentColor"
  }
) }), L = () => /* @__PURE__ */ e("span", { className: "fds-chat-msg__sparkle", children: /* @__PURE__ */ e(w, { animate: !0, children: /* @__PURE__ */ e(O, {}) }) }), T = () => /* @__PURE__ */ e("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": !0, children: /* @__PURE__ */ e("polyline", { points: "6 9 12 15 18 9" }) }), k = () => /* @__PURE__ */ e("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": !0, children: /* @__PURE__ */ e("polyline", { points: "18 15 12 9 6 15" }) }), x = ({ children: t, isActive: a }) => a ? /* @__PURE__ */ c("span", { className: "fds-chat-msg__shimmer-wrap", children: [
  t,
  /* @__PURE__ */ e(
    o.span,
    {
      "aria-hidden": !0,
      className: "fds-chat-msg__shimmer",
      initial: { x: "-100%" },
      animate: { x: "100%" },
      transition: { duration: D, ease: M, repeat: 1 / 0, repeatDelay: I }
    }
  )
] }) : /* @__PURE__ */ e(N, { children: t }), B = ({ status: t }) => /* @__PURE__ */ e(
  "span",
  {
    className: d(
      "fds-chat-msg__trace-dot",
      t === "completed" ? "fds-chat-msg__trace-dot--completed" : "fds-chat-msg__trace-dot--pending"
    )
  }
), U = ({ fromStatus: t }) => /* @__PURE__ */ e(
  "span",
  {
    className: d(
      "fds-chat-msg__trace-connector",
      t === "completed" ? "fds-chat-msg__trace-connector--completed" : "fds-chat-msg__trace-connector--pending"
    )
  }
), y = ({ text: t, isLast: a, stepStatus: n }) => /* @__PURE__ */ c("div", { className: "fds-chat-msg__trace-row", children: [
  /* @__PURE__ */ c("div", { className: "fds-chat-msg__trace-timeline", children: [
    /* @__PURE__ */ e("div", { className: "fds-chat-msg__trace-icon-cell", children: n === "active" ? /* @__PURE__ */ e(L, {}) : /* @__PURE__ */ e(B, { status: n }) }),
    !a && /* @__PURE__ */ e(U, { fromStatus: n })
  ] }),
  /* @__PURE__ */ e(
    "div",
    {
      className: d(
        "fds-chat-msg__trace-text-col",
        a && "fds-chat-msg__trace-text-col--last",
        n === "pending" && "fds-chat-msg__trace-text-col--pending"
      ),
      children: /* @__PURE__ */ e(x, { isActive: n === "active", children: /* @__PURE__ */ e("span", { className: d("BodySmallRegular", "fds-chat-msg__trace-text", n === "active" && "fds-chat-msg__trace-text--active"), children: t }) })
    }
  )
] }), J = ({
  traces: t,
  status: a = "loading",
  title: n = "Explored",
  activeStepIndex: r
}) => {
  const p = r !== void 0, [g, m] = R(!p), C = a === "loading";
  _(() => {
    a === "loading" && m(!0);
  }, [a]), _(() => {
    if (a === "complete") {
      const i = setTimeout(() => m(!1), 600);
      return () => clearTimeout(i);
    }
  }, [a]);
  const E = (i) => a === "complete" ? "completed" : r !== void 0 ? i < r ? "completed" : i === r ? "active" : "pending" : i < t.length - 1 ? "completed" : "active", h = (i, s) => s === "completed" && i.completedLabel ? i.completedLabel : i.label;
  return /* @__PURE__ */ c("div", { className: "fds-chat-msg__reasoning", children: [
    a === "complete" && /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: "fds-chat-msg__reasoning-header",
        onClick: () => m((i) => !i),
        children: [
          /* @__PURE__ */ e("span", { className: "BodyMediumRegular fds-chat-msg__reasoning-title", children: n }),
          /* @__PURE__ */ e("span", { style: { color: "var(--text-gray-tertiary)", display: "flex" }, children: g ? /* @__PURE__ */ e(k, {}) : /* @__PURE__ */ e(T, {}) })
        ]
      }
    ),
    /* @__PURE__ */ e(
      o.div,
      {
        className: "fds-chat-msg__reasoning-body",
        initial: !1,
        animate: { height: g ? "auto" : 0 },
        transition: { duration: b, ease: u },
        children: /* @__PURE__ */ e("div", { className: "fds-chat-msg__reasoning-inner", children: p || !C ? t.map((i, s) => {
          const l = E(s);
          return /* @__PURE__ */ e(y, { text: h(i, l), isLast: s === t.length - 1, stepStatus: l }, i.label);
        }) : /* @__PURE__ */ c(N, { children: [
          t.slice(0, -1).map((i, s) => {
            const l = s === t.length - 2;
            return /* @__PURE__ */ e(
              o.div,
              {
                initial: l ? !1 : { opacity: 0, y: 8 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: f, ease: v },
                children: /* @__PURE__ */ e(y, { text: h(i, "completed"), isLast: !1, stepStatus: "completed" })
              },
              i.label
            );
          }),
          t.length > 0 && /* @__PURE__ */ e(
            o.div,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: f, ease: v },
              children: /* @__PURE__ */ c("div", { className: "fds-chat-msg__trace-row", children: [
                /* @__PURE__ */ e("div", { className: "fds-chat-msg__trace-timeline", children: /* @__PURE__ */ e("div", { className: "fds-chat-msg__trace-icon-cell", children: /* @__PURE__ */ e(L, {}) }) }),
                /* @__PURE__ */ e("div", { style: { position: "relative", overflow: "hidden" }, children: /* @__PURE__ */ e(S, { mode: "popLayout", initial: !1, children: /* @__PURE__ */ e(
                  o.div,
                  {
                    initial: { y: 12, opacity: 0 },
                    animate: { y: 0, opacity: 1 },
                    exit: { y: -12, opacity: 0, position: "absolute" },
                    transition: { duration: A, ease: u },
                    children: /* @__PURE__ */ e(x, { isActive: !0, children: /* @__PURE__ */ e("span", { className: "BodySmallRegular fds-chat-msg__trace-text fds-chat-msg__trace-text--active", children: h(t[t.length - 1], "active") }) })
                  },
                  t.length
                ) }) })
              ] })
            },
            "active-row"
          )
        ] }) })
      }
    )
  ] });
};
export {
  J as ReasoningTraces
};
