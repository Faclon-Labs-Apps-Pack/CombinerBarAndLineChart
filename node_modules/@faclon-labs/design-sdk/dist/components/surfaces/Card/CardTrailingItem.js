import { jsx as t } from "react/jsx-runtime";
import { cn as e } from "../../../utils/cn.js";
/* empty css                     */
function n({
  trailing: r = "None",
  children: a,
  className: i,
  ...o
}) {
  return r === "None" || !a ? null : /* @__PURE__ */ t("div", { className: e("fds-card-trailing", `fds-card-trailing--${r.toLowerCase()}`, i), ...o, children: a });
}
n.displayName = "CardTrailingItem";
export {
  n as CardTrailingItem
};
