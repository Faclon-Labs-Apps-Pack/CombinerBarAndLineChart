import { jsxs as i, jsx as n } from "react/jsx-runtime";
import { useState as l } from "react";
import { X as $ } from "react-feather";
import { TextInput as x } from "../../inputs/TextInput/TextInput.js";
import { SelectInput as d } from "../../inputs/SelectInput/SelectInput.js";
import { DropdownMenu as c } from "../../overlays/DropdownMenu/DropdownMenu.js";
import { ActionListItem as m } from "../../overlays/DropdownMenu/ActionListItem.js";
import { ActionListItemGroup as p } from "../../overlays/DropdownMenu/ActionListItemGroup.js";
import { ColorInput as F } from "../../inputs/ColorPicker/ColorInput.js";
import { Divider as g } from "../../layout/Divider/Divider.js";
import { Button as P } from "../../actions/Button/Button.js";
import { IconButton as B } from "../../actions/IconButton/IconButton.js";
/* empty css                  */
const H = "#e4553d", T = Array.from({ length: 24 }, (o, a) => String(a).padStart(2, "0")), O = Array.from({ length: 60 }, (o, a) => String(a).padStart(2, "0"));
function b(o) {
  const [a, t] = (o || ":").split(":");
  return { hour: a ?? "", minute: t ?? "" };
}
function ee({ onClose: o, onSave: a, shift: t }) {
  const v = !!t, N = b((t == null ? void 0 : t.startTime) ?? ""), M = b((t == null ? void 0 : t.endTime) ?? ""), [u, w] = l((t == null ? void 0 : t.name) ?? ""), [C, y] = l((t == null ? void 0 : t.color) ?? H), [_, E] = l(N.hour), [S, I] = l(N.minute), [h, A] = l(M.hour), [f, D] = l(M.minute), [s, k] = l(null);
  function r(e, q) {
    k(q ? e : null);
  }
  function L() {
    if (!u.trim()) return;
    const e = {
      id: (t == null ? void 0 : t.id) ?? `shift_${Date.now()}`,
      name: u.trim(),
      color: C || H,
      startTime: `${_ || "00"}:${S || "00"}`,
      endTime: `${h || "00"}:${f || "00"}`
    };
    a(e);
  }
  return /* @__PURE__ */ i("div", { className: "fds-asp", children: [
    /* @__PURE__ */ i("div", { className: "fds-asp__header", children: [
      /* @__PURE__ */ n("span", { className: "fds-asp__title", children: v ? "Edit Shift" : "Add Shift" }),
      /* @__PURE__ */ n(
        B,
        {
          icon: /* @__PURE__ */ n($, {}),
          size: "Medium",
          accessibilityLabel: "Close",
          onClick: o
        }
      )
    ] }),
    /* @__PURE__ */ n(g, { variant: "Muted" }),
    /* @__PURE__ */ i("div", { className: "fds-asp__body", children: [
      /* @__PURE__ */ n(
        x,
        {
          label: "Name",
          name: "shiftName",
          placeholder: "Enter shift name",
          value: u,
          necessityIndicator: "required",
          onChange: ({ value: e }) => w(e)
        }
      ),
      /* @__PURE__ */ n(
        F,
        {
          label: "Color",
          placeholder: "Select a color",
          value: C,
          onChange: (e) => y(e)
        }
      ),
      /* @__PURE__ */ n("span", { className: "fds-asp__section-label", children: "Shift Duration Settings" }),
      /* @__PURE__ */ i("div", { className: "fds-asp__row", children: [
        /* @__PURE__ */ n("div", { className: "fds-ttc__required-select", children: /* @__PURE__ */ n(
          d,
          {
            label: "Start Hour",
            name: "startHour",
            placeholder: "Select hr",
            value: _,
            isOpen: s === "startHour",
            onOpenChange: (e) => r("startHour", e),
            children: /* @__PURE__ */ n(c, { className: "fds-asp__dropdown-scroll", children: /* @__PURE__ */ n(p, { children: T.map((e) => /* @__PURE__ */ n(
              m,
              {
                title: e,
                selectionType: "Single",
                isSelected: _ === e,
                onClick: () => {
                  E(e), r("startHour", !1);
                }
              },
              e
            )) }) })
          }
        ) }),
        /* @__PURE__ */ n("div", { className: "fds-ttc__required-select", children: /* @__PURE__ */ n(
          d,
          {
            label: "Start Minute",
            name: "startMinute",
            placeholder: "Select min",
            value: S,
            isOpen: s === "startMinute",
            onOpenChange: (e) => r("startMinute", e),
            children: /* @__PURE__ */ n(c, { className: "fds-asp__dropdown-scroll", children: /* @__PURE__ */ n(p, { children: O.map((e) => /* @__PURE__ */ n(
              m,
              {
                title: e,
                selectionType: "Single",
                isSelected: S === e,
                onClick: () => {
                  I(e), r("startMinute", !1);
                }
              },
              e
            )) }) })
          }
        ) })
      ] }),
      /* @__PURE__ */ i("div", { className: "fds-asp__row", children: [
        /* @__PURE__ */ n("div", { className: "fds-ttc__required-select", children: /* @__PURE__ */ n(
          d,
          {
            label: "End Hour",
            name: "endHour",
            placeholder: "Select hr",
            value: h,
            isOpen: s === "endHour",
            onOpenChange: (e) => r("endHour", e),
            children: /* @__PURE__ */ n(c, { className: "fds-asp__dropdown-scroll", children: /* @__PURE__ */ n(p, { children: T.map((e) => /* @__PURE__ */ n(
              m,
              {
                title: e,
                selectionType: "Single",
                isSelected: h === e,
                onClick: () => {
                  A(e), r("endHour", !1);
                }
              },
              e
            )) }) })
          }
        ) }),
        /* @__PURE__ */ n("div", { className: "fds-ttc__required-select", children: /* @__PURE__ */ n(
          d,
          {
            label: "End Minute",
            name: "endMinute",
            placeholder: "Select min",
            value: f,
            isOpen: s === "endMinute",
            onOpenChange: (e) => r("endMinute", e),
            children: /* @__PURE__ */ n(c, { className: "fds-asp__dropdown-scroll", children: /* @__PURE__ */ n(p, { children: O.map((e) => /* @__PURE__ */ n(
              m,
              {
                title: e,
                selectionType: "Single",
                isSelected: f === e,
                onClick: () => {
                  D(e), r("endMinute", !1);
                }
              },
              e
            )) }) })
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ n(g, { variant: "Muted" }),
    /* @__PURE__ */ n("div", { className: "fds-asp__footer", children: /* @__PURE__ */ n(
      P,
      {
        label: v ? "Save Changes" : "Add Shift",
        variant: "Primary",
        size: "Large",
        isFullWidth: !0,
        onClick: L
      }
    ) })
  ] });
}
export {
  ee as AddShiftPanel
};
