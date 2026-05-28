import { jsx as t, jsxs as p } from "react/jsx-runtime";
import { useState as d, useEffect as m } from "react";
import { AnimatePresence as u, motion as r } from "framer-motion";
/* empty css                */
const f = "rgba(255, 255, 255, 0.24)", E = 3e3, a = 0.36, o = [0.5, 0, 0, 1], h = 0.96, g = 0.48, I = [0.3, 0, 0.2, 1], R = ({ texts: n }) => {
  const [e, i] = d(0), s = n.join("\0");
  return m(() => {
    if (i(0), n.length <= 1) return;
    const l = setInterval(() => i((c) => (c + 1) % n.length), E);
    return () => clearInterval(l);
  }, [s]), n.length === 0 ? /* @__PURE__ */ t("span", {}) : n.length === 1 ? /* @__PURE__ */ t("span", { children: n[0] }) : /* @__PURE__ */ t("span", { className: "fds-chat-msg__rolling", children: /* @__PURE__ */ t(u, { mode: "popLayout", initial: !1, children: /* @__PURE__ */ t(
    r.span,
    {
      initial: { y: 16, opacity: 0, filter: "blur(4px)" },
      animate: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: a, ease: o } },
      exit: { y: -16, opacity: 0, filter: "blur(4px)", position: "absolute", transition: { duration: a, ease: o } },
      children: /* @__PURE__ */ p("span", { className: "fds-chat-msg__shimmer-wrap", children: [
        n[e],
        /* @__PURE__ */ t(
          r.span,
          {
            "aria-hidden": !0,
            style: {
              position: "absolute",
              inset: 0,
              background: `linear-gradient(90deg, transparent 0%, ${f} 50%, transparent 100%)`,
              pointerEvents: "none"
            },
            initial: { x: "-100%" },
            animate: { x: "100%" },
            transition: { duration: h, ease: I, repeat: 1 / 0, repeatDelay: g }
          }
        )
      ] })
    },
    e
  ) }) });
};
export {
  R as RollingText
};
