import { jsx as t } from "react/jsx-runtime";
import { cn as a } from "../../../utils/cn.js";
/* empty css                         */
function d({
  trailing: r = "Action",
  children: o,
  className: i,
  ...n
}) {
  return o ? /* @__PURE__ */ t("div", { className: a("fds-dropdown-trailing", `fds-dropdown-trailing--${r.toLowerCase()}`, i), ...n, children: o }) : null;
}
d.displayName = "DropdownTrailingItem";
export {
  d as DropdownTrailingItem
};
