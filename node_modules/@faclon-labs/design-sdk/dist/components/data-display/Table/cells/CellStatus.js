import { jsxs as i, jsx as a } from "react/jsx-runtime";
/* empty css               */
import { Indicator as c } from "../../Indicator/Indicator.js";
import { Badge as n } from "../../Badge/Badge.js";
import { IconButton as u } from "../../../actions/IconButton/IconButton.js";
import { cn as f } from "../../../../utils/cn.js";
function z({
  intent: m,
  label: e,
  size: t = "Medium",
  badges: r,
  trailingAction: l,
  className: p
}) {
  return /* @__PURE__ */ i("span", { className: f("fds-table-cell-status", p), children: [
    /* @__PURE__ */ a(c, { intent: m, size: t, label: e }),
    r == null ? void 0 : r.map((o, s) => /* @__PURE__ */ a(
      n,
      {
        label: o.label,
        color: o.color ?? "Neutral",
        emphasis: o.emphasis ?? "Subtle",
        size: "Small"
      },
      `${o.label}-${s}`
    )),
    l && /* @__PURE__ */ a(
      u,
      {
        size: "20",
        icon: l.icon,
        "aria-label": l.ariaLabel,
        onClick: (o) => {
          o.stopPropagation(), l.onClick(o);
        }
      }
    )
  ] });
}
export {
  z as CellStatus
};
