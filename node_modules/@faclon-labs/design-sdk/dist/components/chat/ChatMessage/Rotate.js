import { jsx as r } from "react/jsx-runtime";
import { motion as o } from "framer-motion";
const n = ({ children: t, animate: e }) => e ? /* @__PURE__ */ r(
  o.div,
  {
    style: { display: "flex" },
    animate: { rotate: [0, 90] },
    transition: {
      duration: 0.48,
      // --global-duration-gentle = 480ms
      repeat: 1 / 0,
      ease: [0.5, 0, 0, 1],
      // --global-easing-emphasized
      repeatDelay: 0.48
      // --global-delay-gentle = 480ms (pause between cycles)
    },
    children: t
  }
) : t;
export {
  n as Rotate
};
