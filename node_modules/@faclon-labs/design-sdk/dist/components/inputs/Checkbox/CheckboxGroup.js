import { jsxs as s, jsx as e } from "react/jsx-runtime";
import { cn as r } from "../../../utils/cn.js";
/* empty css                  */
const i = {
  Small: "BodySmallSemibold",
  Medium: "BodySmallSemibold",
  Large: "BodyMediumSemibold"
};
function p({
  label: o,
  size: c = "Small",
  orientation: l = "Vertical",
  children: a,
  className: d,
  ...m
}) {
  return /* @__PURE__ */ s(
    "div",
    {
      role: "group",
      className: r("fds-checkbox-group", `fds-checkbox-group--${l.toLowerCase()}`, d),
      "aria-label": o,
      ...m,
      children: [
        o && /* @__PURE__ */ e("span", { className: r("fds-checkbox-group__label", i[c]), children: o }),
        /* @__PURE__ */ e("div", { className: "fds-checkbox-group__body", children: a })
      ]
    }
  );
}
p.displayName = "CheckboxGroup";
export {
  p as CheckboxGroup
};
