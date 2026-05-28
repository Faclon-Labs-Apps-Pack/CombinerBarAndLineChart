import { jsxs as c, jsx as a } from "react/jsx-runtime";
/* empty css                   */
import { IconButton as i } from "../../../actions/IconButton/IconButton.js";
import { cn as r } from "../../../../utils/cn.js";
function f({
  title: o,
  description: l,
  leading: t,
  trailingAction: e,
  className: n
}) {
  return /* @__PURE__ */ c("span", { className: r("fds-table-cell-text-action", n), children: [
    t && /* @__PURE__ */ a("span", { className: "fds-table-cell-text-action__leading", children: t }),
    /* @__PURE__ */ c("span", { className: "fds-table-cell-text-action__content", children: [
      /* @__PURE__ */ a("span", { className: "fds-table-cell-text-action__title BodyMediumRegular", children: o }),
      l && /* @__PURE__ */ a("span", { className: "fds-table-cell-text-action__description BodySmallRegular", children: l })
    ] }),
    /* @__PURE__ */ a(
      "span",
      {
        className: "fds-table-cell-hover-action",
        "data-always-visible": e.alwaysVisible ? "true" : void 0,
        children: /* @__PURE__ */ a(
          i,
          {
            size: "20",
            icon: e.icon,
            "aria-label": e.ariaLabel,
            onClick: (s) => {
              s.stopPropagation(), e.onClick(s);
            }
          }
        )
      }
    )
  ] });
}
export {
  f as CellTextAction
};
