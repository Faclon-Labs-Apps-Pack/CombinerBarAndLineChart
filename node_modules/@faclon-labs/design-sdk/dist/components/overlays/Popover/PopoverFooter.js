import { jsx as i, jsxs as m, Fragment as n } from "react/jsx-runtime";
import { cn as s } from "../../../utils/cn.js";
/* empty css                  */
function a({
  primaryAction: o,
  secondaryAction: r,
  children: e,
  className: t,
  ...p
}) {
  return /* @__PURE__ */ i("div", { className: s("fds-popover-footer", t), ...p, children: e ?? /* @__PURE__ */ m(n, { children: [
    r,
    o
  ] }) });
}
a.displayName = "PopoverFooter";
export {
  a as PopoverFooter
};
