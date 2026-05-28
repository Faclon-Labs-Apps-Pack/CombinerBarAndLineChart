import { jsxs as n } from "react/jsx-runtime";
import { cn as m } from "../../../utils/cn.js";
/* empty css         */
function p({
  elevation: e = "None",
  isHoverable: r = !1,
  isHoverScaled: s = !1,
  isSelected: a = !1,
  header: d,
  body: o,
  footer: c,
  children: f,
  className: l,
  ...t
}) {
  const i = m(
    "fds-card",
    `fds-card--elevation-${e.toLowerCase()}`,
    r && "fds-card--hoverable",
    s && "fds-card--hover-scaled",
    a && "fds-card--selected",
    l
  );
  return /* @__PURE__ */ n("div", { className: i, ...t, children: [
    d,
    o,
    c,
    f
  ] });
}
p.displayName = "Card";
export {
  p as Card
};
