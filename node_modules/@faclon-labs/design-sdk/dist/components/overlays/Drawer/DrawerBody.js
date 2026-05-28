import { jsx as a } from "react/jsx-runtime";
import { cn as m } from "../../../utils/cn.js";
/* empty css               */
function t({
  children: r,
  hasPadding: d = !0,
  className: o,
  ...e
}) {
  return /* @__PURE__ */ a(
    "div",
    {
      className: m(
        "fds-drawer-body",
        d && "fds-drawer-body--padded",
        o
      ),
      ...e,
      children: r
    }
  );
}
t.displayName = "DrawerBody";
export {
  t as DrawerBody
};
