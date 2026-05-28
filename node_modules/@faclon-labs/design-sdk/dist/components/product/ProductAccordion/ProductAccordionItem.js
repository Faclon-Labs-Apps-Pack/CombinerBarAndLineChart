import { jsxs as i, jsx as a } from "react/jsx-runtime";
import { X as k, ChevronDown as w } from "react-feather";
import { cn as p } from "../../../utils/cn.js";
import { IconButton as B } from "../../actions/IconButton/IconButton.js";
/* empty css                         */
function P({
  title: l,
  subtitle: c,
  isExpanded: d = !1,
  isActive: t = !0,
  isDisabled: s = !1,
  leadingItem: f,
  trailingIcon: n,
  headerAction: o,
  onToggle: r,
  onClose: m,
  children: _,
  className: h,
  ...u
}) {
  const N = d && t && !s, y = (e) => {
    e.stopPropagation(), m == null || m();
  }, v = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      if (e.target.closest(".fds-pa-item__close")) return;
      e.preventDefault(), s || r == null || r();
    }
  };
  return /* @__PURE__ */ i(
    "div",
    {
      className: p(
        "fds-pa-item",
        d && t && "fds-pa-item--expanded",
        !t && "fds-pa-item--inactive",
        s && "fds-pa-item--disabled",
        h
      ),
      ...u,
      children: [
        /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: "fds-pa-item__header",
            onClick: s ? void 0 : r,
            onKeyDown: v,
            disabled: s,
            "aria-expanded": d && t,
            children: [
              /* @__PURE__ */ i("div", { className: "fds-pa-item__title-area", children: [
                f,
                /* @__PURE__ */ i("div", { className: "fds-pa-item__title-section", children: [
                  /* @__PURE__ */ i("div", { className: "fds-pa-item__heading-row", children: [
                    /* @__PURE__ */ a("span", { className: "fds-pa-item__title BodyMediumMedium", children: l }),
                    n && /* @__PURE__ */ a("span", { className: "fds-pa-item__trailing-icon", children: n })
                  ] }),
                  c && /* @__PURE__ */ a("span", { className: "fds-pa-item__subtitle BodySmallRegular", children: c })
                ] })
              ] }),
              o && /* @__PURE__ */ a(
                "span",
                {
                  className: "fds-pa-item__header-action",
                  onClick: (e) => e.stopPropagation(),
                  children: o
                }
              ),
              m && /* @__PURE__ */ a(
                B,
                {
                  icon: /* @__PURE__ */ a(k, { size: 16 }),
                  size: "16",
                  onClick: y,
                  "aria-label": "Close",
                  className: "fds-pa-item__close"
                }
              ),
              t && /* @__PURE__ */ a("span", { className: p("fds-pa-item__chevron", d && "fds-pa-item__chevron--open"), children: /* @__PURE__ */ a(w, { size: 16 }) })
            ]
          }
        ),
        N && /* @__PURE__ */ a("div", { className: "fds-pa-item__body", children: _ })
      ]
    }
  );
}
P.displayName = "ProductAccordionItem";
export {
  P as ProductAccordionItem
};
