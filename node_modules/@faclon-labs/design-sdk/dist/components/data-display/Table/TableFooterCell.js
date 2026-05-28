import { jsx as t } from "react/jsx-runtime";
import { cn as l } from "../../../utils/cn.js";
function f({ children: o, className: e, ...r }) {
  return /* @__PURE__ */ t(
    "td",
    {
      className: l("fds-table__footer-cell", "BodyMediumSemibold", e),
      ...r,
      children: o
    }
  );
}
export {
  f as TableFooterCell
};
