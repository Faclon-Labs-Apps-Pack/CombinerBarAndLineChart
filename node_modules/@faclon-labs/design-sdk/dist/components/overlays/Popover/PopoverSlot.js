import { jsx as t } from "react/jsx-runtime";
import { cn as e } from "../../../utils/cn.js";
/* empty css                */
function m({ children: o, className: r, ...p }) {
  return /* @__PURE__ */ t("div", { className: e("fds-popover-slot", r), ...p, children: o });
}
m.displayName = "PopoverSlot";
export {
  m as PopoverSlot
};
