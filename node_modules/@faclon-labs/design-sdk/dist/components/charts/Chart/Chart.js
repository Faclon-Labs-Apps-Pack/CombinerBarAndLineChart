import { jsxs as e, jsx as a } from "react/jsx-runtime";
import { forwardRef as b } from "react";
import { ChevronDown as S, Clock as C } from "react-feather";
import { cn as d } from "../../../utils/cn.js";
/* empty css          */
const R = {
  Small: "HeadingSmallSemibold",
  Medium: "HeadingMediumSemibold",
  Large: "HeadingLargeSemibold"
}, w = b(
  ({
    title: s,
    titleSize: o = "Small",
    titleClassName: h,
    titleHasDropdown: m = !1,
    onTitleClick: _,
    breadcrumb: c,
    duration: l,
    actions: r,
    filters: i,
    children: f,
    className: u,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ...N
  }, p) => {
    const { zoomable: y, ...v } = N, g = typeof s == "string", n = s != null || c != null, t = n || l != null, H = t || r != null;
    return /* @__PURE__ */ e("div", { ref: p, className: d("fds-chart", u), ...v, children: [
      H && /* @__PURE__ */ e("div", { className: "fds-chart__header", children: [
        t && /* @__PURE__ */ e("div", { className: "fds-chart__header-main", children: [
          n && /* @__PURE__ */ e("div", { className: "fds-chart__header-row", children: [
            g ? /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                className: d("fds-chart__title", h),
                onClick: _,
                children: [
                  /* @__PURE__ */ a(
                    "span",
                    {
                      className: d(
                        "fds-chart__title-label",
                        R[o]
                      ),
                      children: s
                    }
                  ),
                  m && /* @__PURE__ */ a(
                    S,
                    {
                      className: "fds-chart__title-icon",
                      "aria-hidden": "true"
                    }
                  )
                ]
              }
            ) : s,
            c
          ] }),
          l != null && /* @__PURE__ */ e("div", { className: "fds-chart__duration", children: [
            /* @__PURE__ */ a(C, { className: "fds-chart__duration-icon", "aria-hidden": "true" }),
            /* @__PURE__ */ a("span", { className: "fds-chart__duration-label BodyMediumRegular", children: l })
          ] })
        ] }),
        r != null && /* @__PURE__ */ a("div", { className: "fds-chart__actions", children: r })
      ] }),
      i != null && /* @__PURE__ */ a("div", { className: "fds-chart__filters", children: i }),
      /* @__PURE__ */ a("div", { className: "fds-chart__canvas", children: f })
    ] });
  }
);
w.displayName = "Chart";
export {
  R as CHART_TITLE_TYPOGRAPHY,
  w as Chart
};
