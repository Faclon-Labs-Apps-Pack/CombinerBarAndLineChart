import { jsxs as p, jsx as s } from "react/jsx-runtime";
import { cn as i } from "../../../utils/cn.js";
/* empty css                */
function m({
  description: o,
  children: r,
  className: e,
  ...d
}) {
  return /* @__PURE__ */ p("div", { className: i("fds-popover-body", e), ...d, children: [
    o && /* @__PURE__ */ s("p", { className: "fds-popover-body__description BodyMediumRegular", children: o }),
    r
  ] });
}
m.displayName = "PopoverBody";
export {
  m as PopoverBody
};
