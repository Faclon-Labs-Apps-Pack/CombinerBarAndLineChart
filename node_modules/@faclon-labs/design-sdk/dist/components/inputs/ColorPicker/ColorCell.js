import { jsx as r } from "react/jsx-runtime";
import { Check as a } from "react-feather";
import { cn as s } from "../../../utils/cn.js";
/* empty css              */
function t({
  color: l,
  isSelected: o = !1,
  className: e,
  ...c
}) {
  return /* @__PURE__ */ r(
    "button",
    {
      type: "button",
      className: s(
        "fds-color-cell",
        o && "fds-color-cell--selected",
        e
      ),
      style: { backgroundColor: l },
      "aria-label": l,
      "aria-pressed": o,
      ...c,
      children: o && /* @__PURE__ */ r(a, { className: "fds-color-cell__check", size: 14, color: "white" })
    }
  );
}
t.displayName = "ColorCell";
export {
  t as ColorCell
};
