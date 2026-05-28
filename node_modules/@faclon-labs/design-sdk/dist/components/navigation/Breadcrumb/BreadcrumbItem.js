import { jsxs as I, jsx as a } from "react/jsx-runtime";
import { cn as r } from "../../../utils/cn.js";
import { LinkButton as L } from "../../actions/LinkButton/LinkButton.js";
import { IconButton as S } from "../../actions/IconButton/IconButton.js";
/* empty css                   */
const g = {
  Small: "BodySmallMedium",
  Medium: "BodyMediumMedium",
  Large: "BodyLargeMedium"
}, y = {
  Small: "Small",
  Medium: "Medium",
  Large: "Medium"
}, h = {
  Small: "Small",
  Medium: "Medium",
  Large: "Large"
};
function x({
  type: m = "Text",
  currentItem: c,
  isCurrentPage: o,
  showSeparator: u = !0,
  size: e = "Medium",
  value: i,
  icon: t,
  href: n,
  target: b,
  rel: p,
  onClick: l,
  "aria-label": _,
  accessibilityLabel: f,
  className: M,
  ...N
}) {
  const d = g[e], B = c ?? o ?? !1, s = _ ?? f;
  return /* @__PURE__ */ I("li", { className: r("fds-breadcrumb-item", M), ...N, children: [
    B ? /* @__PURE__ */ a("span", { className: r("fds-breadcrumb-item__current", d), "aria-current": "page", children: m === "Icon" ? t : i }) : m === "Icon" ? /* @__PURE__ */ a(
      S,
      {
        icon: t,
        size: y[e],
        className: "fds-breadcrumb-item__action",
        onClick: l,
        "aria-label": s
      }
    ) : /* @__PURE__ */ a(
      L,
      {
        type: "Action",
        color: "Neutral",
        size: h[e],
        label: i,
        href: n,
        target: b,
        rel: p,
        onClick: l,
        className: "fds-breadcrumb-item__action",
        "aria-label": s
      }
    ),
    u && /* @__PURE__ */ a("span", { className: r("fds-breadcrumb-item__separator", d), "aria-hidden": "true", children: "/" })
  ] });
}
x.displayName = "BreadcrumbItem";
export {
  x as BreadcrumbItem
};
