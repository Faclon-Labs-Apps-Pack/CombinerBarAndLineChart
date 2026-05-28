import { jsxs as s, jsx as a } from "react/jsx-runtime";
import { cn as m } from "../../../utils/cn.js";
/* empty css             */
function f({
  title: r,
  subtitle: i,
  isSelected: e = !1,
  isDisabled: d = !1,
  leadingItem: c,
  trailingItems: l,
  className: t,
  ...n
}) {
  return /* @__PURE__ */ s(
    "div",
    {
      className: m(
        "fds-list-card",
        e && "fds-list-card--selected",
        d && "fds-list-card--disabled",
        t
      ),
      tabIndex: d ? -1 : 0,
      "aria-disabled": d || void 0,
      ...n,
      children: [
        /* @__PURE__ */ s("div", { className: "fds-list-card__content", children: [
          c,
          /* @__PURE__ */ s("div", { className: "fds-list-card__text", children: [
            /* @__PURE__ */ a("span", { className: "fds-list-card__title BodyMediumMedium", children: r }),
            i && /* @__PURE__ */ a("span", { className: "fds-list-card__subtitle BodySmallRegular", children: i })
          ] })
        ] }),
        l && /* @__PURE__ */ a(
          "div",
          {
            className: "fds-list-card__trailing",
            inert: d ? "" : void 0,
            children: l
          }
        )
      ]
    }
  );
}
f.displayName = "ListCard";
export {
  f as ListCard
};
