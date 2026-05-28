import { jsxs as u, jsx as r } from "react/jsx-runtime";
import { cn as _ } from "../../../utils/cn.js";
import { ColorPickerPresets as h } from "./ColorPickerPresets.js";
import { ColorPickerPanel as y } from "./ColorPickerPanel.js";
/* empty css                */
function b({
  hue: o,
  saturation: i,
  brightness: e,
  opacity: c,
  r: m,
  g: s,
  b: l,
  hex: p,
  configMode: t,
  onHueChange: d,
  onSaturationBrightnessChange: a,
  onOpacityChange: f,
  onRgbChange: k,
  onHexChange: n,
  onConfigModeChange: P,
  onColorSelect: C,
  swatches: v,
  selectedColor: x,
  className: N,
  ...j
}) {
  return /* @__PURE__ */ u("div", { className: _("fds-color-picker", N), ...j, children: [
    /* @__PURE__ */ r(
      y,
      {
        hue: o,
        saturation: i,
        brightness: e,
        opacity: c,
        r: m,
        g: s,
        b: l,
        hex: p,
        configMode: t,
        onHueChange: d,
        onSaturationBrightnessChange: a,
        onOpacityChange: f,
        onRgbChange: k,
        onHexChange: n,
        onConfigModeChange: P
      }
    ),
    /* @__PURE__ */ r("div", { className: "fds-color-picker__divider" }),
    /* @__PURE__ */ r(
      h,
      {
        swatches: v,
        selectedColor: x,
        onColorSelect: C
      }
    )
  ] });
}
b.displayName = "ColorPicker";
export {
  b as ColorPicker
};
