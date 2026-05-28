import { jsxs as t, jsx as n } from "react/jsx-runtime";
/* empty css                */
import { Button as a } from "../../../actions/Button/Button.js";
import { cn as e } from "../../../../utils/cn.js";
function m({ primary: i, secondary: l, className: s }) {
  return /* @__PURE__ */ t("span", { className: e("fds-table-cell-buttons", s), children: [
    l && /* @__PURE__ */ n(
      a,
      {
        variant: "Gray",
        size: "XSmall",
        label: l.label,
        leadingIcon: l.leadingIcon,
        isDisabled: l.isDisabled,
        isLoading: l.isLoading,
        onClick: (o) => {
          o.stopPropagation(), l.onClick(o);
        }
      }
    ),
    i && /* @__PURE__ */ n(
      a,
      {
        variant: "Primary",
        size: "XSmall",
        label: i.label,
        leadingIcon: i.leadingIcon,
        isDisabled: i.isDisabled,
        isLoading: i.isLoading,
        onClick: (o) => {
          o.stopPropagation(), i.onClick(o);
        }
      }
    )
  ] });
}
export {
  m as CellButtons
};
