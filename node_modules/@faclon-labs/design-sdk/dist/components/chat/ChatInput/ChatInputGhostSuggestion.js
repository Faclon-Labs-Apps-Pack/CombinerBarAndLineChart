import { jsxs as l, jsx as i } from "react/jsx-runtime";
import { AnimatePresence as s, motion as p } from "framer-motion";
import { cn as c } from "../../../utils/cn.js";
import { Badge as m } from "../../data-display/Badge/Badge.js";
const o = 0.28, a = [0.5, 0, 0, 1], x = ({
  suggestions: t,
  activeSuggestionIndex: r,
  isVisible: e
}) => {
  if (!e || t.length === 0) return null;
  const n = t[r] ?? t[0];
  return /* @__PURE__ */ l("div", { className: "fds-chat-input__ghost", "aria-hidden": "true", children: [
    /* @__PURE__ */ i(s, { mode: "popLayout", initial: !1, children: /* @__PURE__ */ i(
      p.span,
      {
        className: c("fds-chat-input__ghost-text", "BodyMediumRegular"),
        initial: { y: 8, opacity: 0, filter: "blur(2px)" },
        animate: {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          transition: { duration: o, ease: a }
        },
        exit: {
          y: -8,
          opacity: 0,
          filter: "blur(2px)",
          position: "absolute",
          transition: { duration: o, ease: a }
        },
        children: n
      },
      r
    ) }),
    /* @__PURE__ */ i(m, { color: "Neutral", size: "Small", children: "Tab" })
  ] });
};
export {
  x as ChatInputGhostSuggestion
};
