import { jsxs as t, jsx as s } from "react/jsx-runtime";
import { forwardRef as N } from "react";
import { Info as S } from "react-feather";
import { cn as v } from "../../../utils/cn.js";
/* empty css               */
const u = 12, w = N(
  ({
    illustration: m,
    title: p,
    description: l,
    primaryAction: d,
    secondaryAction: c,
    helpText: e,
    helpLink: a,
    helpLinkIcon: i = /* @__PURE__ */ s(S, { size: u }),
    size: n = "Medium",
    className: _,
    ...f
  }, y) => {
    const o = !!d || !!c, r = !!e || !!a, h = o || r;
    return /* @__PURE__ */ t(
      "div",
      {
        ref: y,
        className: v(
          "fds-empty-state",
          `fds-empty-state--size-${n.toLowerCase()}`,
          _
        ),
        role: "status",
        ...f,
        children: [
          m && /* @__PURE__ */ s("div", { className: "fds-empty-state__illustration", children: m }),
          /* @__PURE__ */ t("div", { className: "fds-empty-state__text", children: [
            /* @__PURE__ */ s("p", { className: "fds-empty-state__title HeadingSmallSemibold", children: p }),
            l && /* @__PURE__ */ s("p", { className: "fds-empty-state__description BodySmallRegular", children: l })
          ] }),
          h && /* @__PURE__ */ t("div", { className: "fds-empty-state__actions-block", children: [
            o && /* @__PURE__ */ t("div", { className: "fds-empty-state__actions", children: [
              c,
              d
            ] }),
            r && /* @__PURE__ */ t("div", { className: "fds-empty-state__help", children: [
              i && /* @__PURE__ */ s("span", { className: "fds-empty-state__help-icon", children: i }),
              e && /* @__PURE__ */ s("span", { className: "fds-empty-state__help-text BodyXSmallRegular", children: e }),
              a && /* @__PURE__ */ s("span", { className: "fds-empty-state__help-link", children: a })
            ] })
          ] })
        ]
      }
    );
  }
);
w.displayName = "EmptyState";
export {
  w as EmptyState
};
