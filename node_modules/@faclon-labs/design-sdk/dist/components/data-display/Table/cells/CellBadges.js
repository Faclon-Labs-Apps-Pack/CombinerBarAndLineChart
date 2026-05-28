import { jsxs as t, jsx as o } from "react/jsx-runtime";
/* empty css               */
import { Badge as i } from "../../Badge/Badge.js";
import { IconButton as p } from "../../../actions/IconButton/IconButton.js";
import { cn as f } from "../../../../utils/cn.js";
function S({
  badges: a,
  maxVisible: m = 3,
  trailingAction: e,
  className: c
}) {
  const s = a.slice(0, m), r = a.length - s.length;
  return /* @__PURE__ */ t("span", { className: f("fds-table-cell-badges", c), children: [
    s.map((l, n) => /* @__PURE__ */ o(
      i,
      {
        label: l.label,
        color: l.color ?? "Neutral",
        emphasis: l.emphasis ?? "Subtle",
        size: "Small",
        leadingIcon: l.leadingIcon
      },
      `${l.label}-${n}`
    )),
    r > 0 && /* @__PURE__ */ o(i, { label: `+${r}`, color: "Neutral", emphasis: "Subtle", size: "Small" }),
    e && /* @__PURE__ */ o(
      p,
      {
        size: "20",
        icon: e.icon,
        "aria-label": e.ariaLabel,
        onClick: (l) => {
          l.stopPropagation(), e.onClick(l);
        }
      }
    )
  ] });
}
export {
  S as CellBadges
};
