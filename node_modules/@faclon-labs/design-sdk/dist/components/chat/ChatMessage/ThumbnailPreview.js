import { jsxs as h, jsx as i } from "react/jsx-runtime";
import { cn as u } from "../../../utils/cn.js";
const _ = 3, n = 120, p = 12, v = { bottom: 0, right: 0, transform: "rotate(0deg)", zIndex: 3 }, m = [
  { bottom: 0, right: 32, transform: "rotate(0deg)", zIndex: 3 },
  { bottom: 59, right: 10, transform: "rotate(15deg)", zIndex: 2 },
  { bottom: 42, right: 62, transform: "rotate(-15deg)", zIndex: 1 }
], S = (t, s) => ({
  id: t.id ?? `thumbnail-${s}-${t.url}`,
  url: t.url,
  alt: t.alt ?? "",
  originalIndex: s,
  originalThumbnail: t
}), f = (t, s) => s ? v : m[t] ?? m[m.length - 1], w = ({ thumbnails: t, onThumbnailClick: s }) => {
  const c = t.map(S), e = c.slice(0, _), r = e.length === 1, l = Math.max(c.length - _, 0), x = r ? n : Math.max(...e.map((d, a) => f(a, !1).bottom + n), 0) + p;
  return /* @__PURE__ */ h(
    s ? "button" : "div",
    {
      ...s ? { type: "button", onClick: s } : {},
      className: u("fds-chat-msg__thumbs", s && "fds-chat-msg__thumbs--clickable"),
      style: {
        width: r ? `${n}px` : "188px",
        height: `${x}px`
      },
      children: [
        [...e].reverse().map(({ id: d, url: a, alt: b }, I) => {
          const g = e.length - I - 1, o = f(g, r);
          return /* @__PURE__ */ i(
            "div",
            {
              className: "fds-chat-msg__thumb-card",
              style: {
                bottom: o.bottom,
                right: o.right,
                transform: o.transform,
                zIndex: o.zIndex
              },
              children: /* @__PURE__ */ i("img", { className: "fds-chat-msg__thumb-img", src: a, alt: b })
            },
            `${d}-${g}`
          );
        }),
        l > 0 && /* @__PURE__ */ h("div", { className: "BodySmallRegular fds-chat-msg__thumb-overflow", children: [
          "+",
          l
        ] })
      ]
    }
  );
};
export {
  w as ThumbnailPreview
};
