import { jsxs as s, jsx as r } from "react/jsx-runtime";
import { cn as a } from "../../../utils/cn.js";
import { Divider as m } from "../../layout/Divider/Divider.js";
/* empty css                 */
function d({
  children: o,
  showDivider: e = !0,
  className: i,
  ...t
}) {
  return /* @__PURE__ */ s("div", { className: a("fds-drawer-footer", i), ...t, children: [
    e && /* @__PURE__ */ r(m, { thickness: "Thin" }),
    /* @__PURE__ */ r("div", { className: "fds-drawer-footer__actions", children: o })
  ] });
}
d.displayName = "DrawerFooter";
export {
  d as DrawerFooter
};
