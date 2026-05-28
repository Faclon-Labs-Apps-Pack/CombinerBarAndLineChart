import { jsxs as d, jsx as t } from "react/jsx-runtime";
import { useRef as p, useCallback as _ } from "react";
import { cn as A } from "../../../utils/cn.js";
import { ColorConfig as G } from "./ColorConfig.js";
/* empty css                     */
function I({
  hue: M = 0,
  saturation: E = 100,
  brightness: L = 100,
  opacity: $ = 100,
  r: m = 255,
  g: a = 0,
  b: i = 0,
  hex: b = "#FF0000",
  configMode: x = "Hex",
  onHueChange: v,
  onSaturationBrightnessChange: f,
  onOpacityChange: u,
  onRgbChange: R,
  onHexChange: D,
  onConfigModeChange: X,
  className: y,
  ...P
}) {
  const N = p(null), h = p(null), k = p(null), U = _(
    (r) => {
      var l;
      const e = (l = N.current) == null ? void 0 : l.getBoundingClientRect();
      if (!e) return;
      const s = (o, Y) => {
        const q = Math.max(0, Math.min(100, (o - e.left) / e.width * 100)), z = Math.max(0, Math.min(100, 100 - (Y - e.top) / e.height * 100));
        f == null || f(q, z);
      };
      s(r.clientX, r.clientY);
      const n = (o) => s(o.clientX, o.clientY), c = () => {
        document.removeEventListener("mousemove", n), document.removeEventListener("mouseup", c);
      };
      document.addEventListener("mousemove", n), document.addEventListener("mouseup", c);
    },
    [f]
  ), j = _(
    (r) => {
      var l;
      const e = (l = h.current) == null ? void 0 : l.getBoundingClientRect();
      if (!e) return;
      const s = (o) => {
        v == null || v(Math.round(Math.max(0, Math.min(360, (o - e.left) / e.width * 360))));
      };
      s(r.clientX);
      const n = (o) => s(o.clientX), c = () => {
        document.removeEventListener("mousemove", n), document.removeEventListener("mouseup", c);
      };
      document.addEventListener("mousemove", n), document.addEventListener("mouseup", c);
    },
    [v]
  ), F = _(
    (r) => {
      var l;
      const e = (l = k.current) == null ? void 0 : l.getBoundingClientRect();
      if (!e) return;
      const s = (o) => {
        u == null || u(Math.round(Math.max(0, Math.min(100, (o - e.left) / e.width * 100))));
      };
      s(r.clientX);
      const n = (o) => s(o.clientX), c = () => {
        document.removeEventListener("mousemove", n), document.removeEventListener("mouseup", c);
      };
      document.addEventListener("mousemove", n), document.addEventListener("mouseup", c);
    },
    [u]
  ), w = `hsl(${M}, 100%, 50%)`;
  return /* @__PURE__ */ d("div", { className: A("fds-color-panel", y), ...P, children: [
    /* @__PURE__ */ d(
      "div",
      {
        ref: N,
        className: "fds-color-panel__canvas",
        style: { background: w },
        onMouseDown: U,
        children: [
          /* @__PURE__ */ t("div", { className: "fds-color-panel__canvas-white" }),
          /* @__PURE__ */ t("div", { className: "fds-color-panel__canvas-black" }),
          /* @__PURE__ */ t(
            "div",
            {
              className: "fds-color-panel__picker",
              style: { left: `${E}%`, top: `${100 - L}%` }
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ d("div", { className: "fds-color-panel__sliders-row", children: [
      /* @__PURE__ */ d("div", { className: "fds-color-panel__sliders-col", children: [
        /* @__PURE__ */ d("div", { ref: h, className: "fds-color-panel__hue", onMouseDown: j, children: [
          /* @__PURE__ */ t("div", { className: "fds-color-panel__hue-track" }),
          /* @__PURE__ */ t("div", { className: "fds-color-panel__slider-thumb", style: { left: `${M / 360 * 100}%`, backgroundColor: w } })
        ] }),
        /* @__PURE__ */ d("div", { ref: k, className: "fds-color-panel__opacity", onMouseDown: F, children: [
          /* @__PURE__ */ t(
            "div",
            {
              className: "fds-color-panel__opacity-track",
              style: { background: `linear-gradient(to right, rgba(${m},${a},${i},0), rgb(${m},${a},${i}))` }
            }
          ),
          /* @__PURE__ */ t("div", { className: "fds-color-panel__slider-thumb", style: { left: `${$}%`, backgroundColor: `rgb(${m},${a},${i})` } })
        ] })
      ] }),
      /* @__PURE__ */ t(
        "div",
        {
          className: "fds-color-panel__preview",
          style: { background: `rgb(${m},${a},${i})` }
        }
      )
    ] }),
    /* @__PURE__ */ t(
      G,
      {
        mode: x,
        hex: b,
        r: m,
        g: a,
        b: i,
        opacity: $,
        onModeChange: X,
        onHexChange: D,
        onRgbChange: R,
        onOpacityChange: u
      }
    )
  ] });
}
I.displayName = "ColorPickerPanel";
export {
  I as ColorPickerPanel
};
