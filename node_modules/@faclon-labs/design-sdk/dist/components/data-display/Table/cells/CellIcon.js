import { jsx as l } from "react/jsx-runtime";
/* empty css             */
import { cn as t } from "../../../../utils/cn.js";
function m({ icon: r, color: e = "default", ariaLabel: o, className: i }) {
  return /* @__PURE__ */ l(
    "span",
    {
      className: t("fds-table-cell-icon", i),
      "data-color": e,
      role: o ? "img" : void 0,
      "aria-label": o,
      "aria-hidden": o ? void 0 : !0,
      children: r
    }
  );
}
export {
  m as CellIcon
};
