import { jsxs as r, jsx as e } from "react/jsx-runtime";
import { X as c } from "react-feather";
import { cn as m } from "../../../utils/cn.js";
import { IconButton as n } from "../../actions/IconButton/IconButton.js";
import { usePopoverContext as f } from "./PopoverContext.js";
/* empty css                  */
function h({
  title: s,
  leading: o,
  showClose: a = !0,
  onClose: d,
  className: p,
  ...i
}) {
  const { close: l } = f(), t = d ?? l;
  return /* @__PURE__ */ r("div", { className: m("fds-popover-header", p), ...i, children: [
    /* @__PURE__ */ r("div", { className: "fds-popover-header__left", children: [
      o && /* @__PURE__ */ e("span", { className: "fds-popover-header__leading", children: o }),
      /* @__PURE__ */ e("h3", { className: "fds-popover-header__title BodyLargeSemibold", children: s })
    ] }),
    a && /* @__PURE__ */ e(
      n,
      {
        className: "fds-popover-header__close",
        icon: /* @__PURE__ */ e(c, { size: 16 }),
        size: "16",
        onClick: t,
        "aria-label": "Close"
      }
    )
  ] });
}
h.displayName = "PopoverHeader";
export {
  h as PopoverHeader
};
