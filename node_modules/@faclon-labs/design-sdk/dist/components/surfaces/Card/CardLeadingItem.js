import { jsx as d } from "react/jsx-runtime";
import { cn as e } from "../../../utils/cn.js";
/* empty css                    */
function o({
  leading: n = "None",
  children: a,
  className: r,
  ...i
}) {
  return n === "None" || !a ? null : n === "Icon" ? /* @__PURE__ */ d("div", { className: e("fds-card-leading", "fds-card-leading--icon", r), ...i, children: /* @__PURE__ */ d("span", { className: "fds-card-leading__icon", children: a }) }) : /* @__PURE__ */ d("div", { className: e("fds-card-leading", "fds-card-leading--custom", r), ...i, children: a });
}
o.displayName = "CardLeadingItem";
export {
  o as CardLeadingItem
};
