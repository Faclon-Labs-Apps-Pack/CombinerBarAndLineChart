import { jsxs as e, jsx as o, Fragment as n } from "react/jsx-runtime";
import { cn as l } from "../../../utils/cn.js";
import { Divider as _ } from "../../layout/Divider/Divider.js";
/* empty css                   */
function c({
  primaryAction: d,
  secondaryAction: r,
  children: s,
  stacking: t = "Horizontal",
  className: a,
  ...f
}) {
  const i = d || r;
  return /* @__PURE__ */ e("div", { className: l("fds-dropdown-footer", `fds-dropdown-footer--${t.toLowerCase()}`, a), ...f, children: [
    /* @__PURE__ */ o(_, { variant: "Muted" }),
    /* @__PURE__ */ e("div", { className: "fds-dropdown-footer__container", children: [
      s && /* @__PURE__ */ o("div", { className: "fds-dropdown-footer__slot", children: s }),
      i && /* @__PURE__ */ o("div", { className: "fds-dropdown-footer__actions", children: t === "Horizontal" ? /* @__PURE__ */ e(n, { children: [
        r && /* @__PURE__ */ o("div", { className: "fds-dropdown-footer__action", children: r }),
        d && /* @__PURE__ */ o("div", { className: "fds-dropdown-footer__action", children: d })
      ] }) : /* @__PURE__ */ e(n, { children: [
        d && /* @__PURE__ */ o("div", { className: "fds-dropdown-footer__action", children: d }),
        r && /* @__PURE__ */ o("div", { className: "fds-dropdown-footer__action", children: r })
      ] }) })
    ] })
  ] });
}
c.displayName = "DropdownFooter";
export {
  c as DropdownFooter
};
