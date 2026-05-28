import { jsx as o } from "react/jsx-runtime";
import { cn as u } from "../../../utils/cn.js";
/* empty css               */
function n({ page: e, isSelected: r = !1, className: a, ...m }) {
  return /* @__PURE__ */ o(
    "button",
    {
      type: "button",
      className: u("fds-page-number", r && "fds-page-number--selected", r ? "BodyMediumSemibold" : "BodyMediumRegular", a),
      "aria-current": r ? "page" : void 0,
      tabIndex: r ? -1 : 0,
      ...m,
      children: e
    }
  );
}
n.displayName = "PageNumber";
export {
  n as PageNumber
};
