import { jsx as l } from "react/jsx-runtime";
import { Checkbox as n } from "../../../inputs/Checkbox/Checkbox.js";
function p({
  accessibilityLabel: o,
  checked: r,
  onChange: t,
  isDisabled: a,
  isIndeterminate: i
}) {
  return /* @__PURE__ */ l(
    n,
    {
      label: "",
      size: "Medium",
      "aria-label": o,
      checked: r,
      isDisabled: a,
      isIndeterminate: i,
      onClick: (e) => e.stopPropagation(),
      onChange: (e) => t(e.target.checked)
    }
  );
}
export {
  p as CellCheckbox
};
