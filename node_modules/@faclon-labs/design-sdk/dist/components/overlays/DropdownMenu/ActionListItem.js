import { jsx as i, jsxs as t } from "react/jsx-runtime";
import { cn as s } from "../../../utils/cn.js";
import { Divider as u } from "../../layout/Divider/Divider.js";
/* empty css                   */
const N = () => /* @__PURE__ */ i("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ i("path", { d: "M10 3L4.5 8.5L2 6", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) });
function p({
  contentType: c = "Item",
  selectionType: o = "None",
  title: m,
  description: r,
  leadingIcon: f,
  trailing: e,
  badges: h,
  isSelected: a = !1,
  isDisabled: l = !1,
  isDestructive: _ = !1,
  singleLine: v = !1,
  className: d,
  ...n
}) {
  return c === "Separator" ? /* @__PURE__ */ i("div", { className: s("fds-action-list-item fds-action-list-item--separator", d), ...n, children: /* @__PURE__ */ i(u, { variant: "Muted" }) }) : c === "SectionHeading" ? /* @__PURE__ */ i("div", { className: s("fds-action-list-item fds-action-list-item--heading", d), ...n, children: /* @__PURE__ */ t("div", { className: "fds-action-list-item__heading-wrapper", children: [
    /* @__PURE__ */ i("div", { className: "fds-action-list-item__heading-body", children: /* @__PURE__ */ i("span", { className: "fds-action-list-item__heading-title BodySmallSemibold", children: m }) }),
    e && /* @__PURE__ */ i("div", { className: "fds-action-list-item__trailing BodySmallRegular", children: e })
  ] }) }) : /* @__PURE__ */ i(
    "div",
    {
      className: s(
        "fds-action-list-item",
        a && "fds-action-list-item--selected",
        o === "Multiple" && "fds-action-list-item--selection-multiple",
        l && "fds-action-list-item--disabled",
        _ && "fds-action-list-item--destructive",
        v && "fds-action-list-item--single-line",
        d
      ),
      role: "menuitem",
      "aria-disabled": l || void 0,
      tabIndex: l ? -1 : 0,
      ...n,
      children: /* @__PURE__ */ t("div", { className: "fds-action-list-item__wrapper", children: [
        /* @__PURE__ */ t("div", { className: "fds-action-list-item__body", children: [
          o === "Multiple" ? /* @__PURE__ */ i("div", { className: "fds-action-list-item__checkbox-container", children: /* @__PURE__ */ i("div", { className: s("fds-action-list-item__checkbox-box", a && "fds-action-list-item__checkbox-box--checked"), children: a && /* @__PURE__ */ i(N, {}) }) }) : f ? /* @__PURE__ */ i("span", { className: "fds-action-list-item__leading", children: f }) : null,
          /* @__PURE__ */ t("div", { className: "fds-action-list-item__content", children: [
            /* @__PURE__ */ t("div", { className: "fds-action-list-item__title-row", children: [
              /* @__PURE__ */ i("span", { className: "fds-action-list-item__title BodyMediumRegular", children: m }),
              h && /* @__PURE__ */ i("div", { className: "fds-action-list-item__badge-group", children: h })
            ] }),
            r && /* @__PURE__ */ i("span", { className: "fds-action-list-item__description BodySmallRegular", children: r })
          ] })
        ] }),
        e && /* @__PURE__ */ i("div", { className: "fds-action-list-item__trailing BodySmallRegular", children: e })
      ] })
    }
  );
}
p.displayName = "ActionListItem";
export {
  p as ActionListItem
};
