import { jsx as n } from "react/jsx-runtime";
import { cn as r } from "../../../utils/cn.js";
/* empty css                        */
function e({
  leading: a = "Icon",
  children: d,
  className: o,
  ...i
}) {
  return d ? a === "Icon" ? /* @__PURE__ */ n("div", { className: r("fds-dropdown-leading", "fds-dropdown-leading--icon", o), ...i, children: /* @__PURE__ */ n("span", { className: "fds-dropdown-leading__icon", children: d }) }) : /* @__PURE__ */ n("div", { className: r("fds-dropdown-leading", "fds-dropdown-leading--asset", o), ...i, children: d }) : null;
}
e.displayName = "DropdownLeadingItem";
export {
  e as DropdownLeadingItem
};
