import { jsxs as c, jsx as s } from "react/jsx-runtime";
import { X as d } from "react-feather";
import { IconButton as n } from "../../actions/IconButton/IconButton.js";
import { cn as f } from "../../../utils/cn.js";
/* empty css        */
function p({
  label: o,
  size: e = "Medium",
  isDisabled: a = !1,
  leadingIcon: i,
  onDismiss: m,
  className: r,
  ...t
}) {
  const l = f(
    "fds-tag",
    `fds-tag--size-${e.toLowerCase()}`,
    a && "fds-tag--disabled",
    r
  );
  return /* @__PURE__ */ c("div", { className: l, ...t, children: [
    i && /* @__PURE__ */ s("span", { className: "fds-tag__icon", children: i }),
    /* @__PURE__ */ s("span", { className: "fds-tag__label BodySmallRegular", children: o }),
    /* @__PURE__ */ s(
      n,
      {
        icon: /* @__PURE__ */ s(d, { size: 12 }),
        size: "12",
        onClick: a ? void 0 : m,
        isDisabled: a,
        "aria-label": "Dismiss",
        className: "fds-tag__dismiss"
      }
    )
  ] });
}
p.displayName = "Tag";
export {
  p as Tag
};
