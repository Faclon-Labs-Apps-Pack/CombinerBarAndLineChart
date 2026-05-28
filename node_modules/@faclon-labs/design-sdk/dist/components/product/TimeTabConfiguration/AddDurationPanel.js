import { jsxs as u, jsx as e } from "react/jsx-runtime";
import { useState as a } from "react";
import { X as F } from "react-feather";
import { TextInput as N } from "../../inputs/TextInput/TextInput.js";
import { SelectInput as c } from "../../inputs/SelectInput/SelectInput.js";
import { DropdownMenu as t } from "../../overlays/DropdownMenu/DropdownMenu.js";
import { ActionListItem as r } from "../../overlays/DropdownMenu/ActionListItem.js";
import { ActionListItemGroup as s } from "../../overlays/DropdownMenu/ActionListItemGroup.js";
import { Divider as S } from "../../layout/Divider/Divider.js";
import { Button as G } from "../../actions/Button/Button.js";
import { IconButton as R } from "../../actions/IconButton/IconButton.js";
/* empty css                     */
const V = ["Previous", "Next"], b = ["Minute", "Hour", "Day", "Week", "Month", "Year"], I = ["Start", "Now", "End"], U = ["Minute", "Hourly", "Daily", "Weekly", "Monthly"];
function D(d) {
  return d && d[0].toUpperCase() + d.slice(1);
}
function oi({ onClose: d, onSave: T, preset: n }) {
  const E = !!n, [v, k] = a((n == null ? void 0 : n.label) ?? ""), [h, q] = a((n == null ? void 0 : n.navigation) ?? "Previous"), [O, w] = a(String((n == null ? void 0 : n.x) ?? 1)), [y, M] = a(D((n == null ? void 0 : n.xPeriod) ?? "Day")), [f, Y] = a((n == null ? void 0 : n.xEvent) ?? "Start"), [x, A] = a(String((n == null ? void 0 : n.y) ?? 1)), [P, X] = a(D((n == null ? void 0 : n.yPeriod) ?? "Day")), [g, L] = a((n == null ? void 0 : n.yEvent) ?? "End"), [_, C] = a((n == null ? void 0 : n.periodicities) ?? ["Hourly", "Daily"]), [o, B] = a(null);
  function l(i, m) {
    B(m ? i : null);
  }
  function z(i) {
    C(
      (m) => m.includes(i) ? m.filter((j) => j !== i) : [...m, i]
    );
  }
  function H() {
    if (!v.trim()) return;
    const i = {
      id: (n == null ? void 0 : n.id) ?? `custom_${Date.now()}`,
      label: v.trim(),
      x: Number(O) || 1,
      xPeriod: y.toLowerCase(),
      navigation: h,
      xEvent: f,
      y: Number(x) || 1,
      yPeriod: P.toLowerCase(),
      yEvent: g,
      periodicities: _,
      isBuiltIn: !1
    };
    T(i);
  }
  const W = _.map((i) => ({ id: i, label: i }));
  return /* @__PURE__ */ u("div", { className: "fds-adp", children: [
    /* @__PURE__ */ u("div", { className: "fds-adp__header", children: [
      /* @__PURE__ */ e("span", { className: "fds-adp__title", children: E ? "Edit Duration" : "Add Duration" }),
      /* @__PURE__ */ e(
        R,
        {
          icon: /* @__PURE__ */ e(F, {}),
          size: "Medium",
          accessibilityLabel: "Close",
          onClick: d
        }
      )
    ] }),
    /* @__PURE__ */ e(S, { variant: "Muted" }),
    /* @__PURE__ */ u("div", { className: "fds-adp__body", children: [
      /* @__PURE__ */ e(
        N,
        {
          label: "Name",
          name: "name",
          placeholder: "Enter duration name",
          value: v,
          necessityIndicator: "required",
          onChange: ({ value: i }) => k(i)
        }
      ),
      /* @__PURE__ */ e("div", { className: "fds-ttc__required-select", children: /* @__PURE__ */ e(
        c,
        {
          label: "Navigation",
          name: "navigation",
          value: h,
          isOpen: o === "navigation",
          onOpenChange: (i) => l("navigation", i),
          children: /* @__PURE__ */ e(t, { children: /* @__PURE__ */ e(s, { children: V.map((i) => /* @__PURE__ */ e(
            r,
            {
              title: i,
              selectionType: "Single",
              isSelected: h === i,
              onClick: () => {
                q(i), l("navigation", !1);
              }
            },
            i
          )) }) })
        }
      ) }),
      /* @__PURE__ */ u("div", { className: "fds-adp__row", children: [
        /* @__PURE__ */ e(
          N,
          {
            label: "X",
            name: "x",
            type: "number",
            value: O,
            necessityIndicator: "required",
            onChange: ({ value: i }) => w(i)
          }
        ),
        /* @__PURE__ */ e("div", { className: "fds-ttc__required-select", children: /* @__PURE__ */ e(
          c,
          {
            label: "X Period",
            name: "xPeriod",
            value: y,
            isOpen: o === "xPeriod",
            onOpenChange: (i) => l("xPeriod", i),
            children: /* @__PURE__ */ e(t, { children: /* @__PURE__ */ e(s, { children: b.map((i) => /* @__PURE__ */ e(
              r,
              {
                title: i,
                selectionType: "Single",
                isSelected: y === i,
                onClick: () => {
                  M(i), l("xPeriod", !1);
                }
              },
              i
            )) }) })
          }
        ) })
      ] }),
      /* @__PURE__ */ e("div", { className: "fds-ttc__required-select", children: /* @__PURE__ */ e(
        c,
        {
          label: "X Event",
          name: "xEvent",
          value: f,
          isOpen: o === "xEvent",
          onOpenChange: (i) => l("xEvent", i),
          children: /* @__PURE__ */ e(t, { children: /* @__PURE__ */ e(s, { children: I.map((i) => /* @__PURE__ */ e(
            r,
            {
              title: i,
              selectionType: "Single",
              isSelected: f === i,
              onClick: () => {
                Y(i), l("xEvent", !1);
              }
            },
            i
          )) }) })
        }
      ) }),
      /* @__PURE__ */ u("div", { className: "fds-adp__row", children: [
        /* @__PURE__ */ e(
          N,
          {
            label: "Y",
            name: "y",
            type: "number",
            value: x,
            necessityIndicator: "required",
            onChange: ({ value: i }) => A(i)
          }
        ),
        /* @__PURE__ */ e("div", { className: "fds-ttc__required-select", children: /* @__PURE__ */ e(
          c,
          {
            label: "Y Period",
            name: "yPeriod",
            value: P,
            isOpen: o === "yPeriod",
            onOpenChange: (i) => l("yPeriod", i),
            children: /* @__PURE__ */ e(t, { children: /* @__PURE__ */ e(s, { children: b.map((i) => /* @__PURE__ */ e(
              r,
              {
                title: i,
                selectionType: "Single",
                isSelected: P === i,
                onClick: () => {
                  X(i), l("yPeriod", !1);
                }
              },
              i
            )) }) })
          }
        ) })
      ] }),
      /* @__PURE__ */ e("div", { className: "fds-ttc__required-select", children: /* @__PURE__ */ e(
        c,
        {
          label: "Y Event",
          name: "yEvent",
          value: g,
          isOpen: o === "yEvent",
          onOpenChange: (i) => l("yEvent", i),
          children: /* @__PURE__ */ e(t, { children: /* @__PURE__ */ e(s, { children: I.map((i) => /* @__PURE__ */ e(
            r,
            {
              title: i,
              selectionType: "Single",
              isSelected: g === i,
              onClick: () => {
                L(i), l("yEvent", !1);
              }
            },
            i
          )) }) })
        }
      ) }),
      /* @__PURE__ */ e("div", { className: "fds-ttc__required-select", children: /* @__PURE__ */ e(
        c,
        {
          label: "Periodicity",
          name: "periodicity",
          multiType: "multiple-flex",
          tags: W,
          isOpen: o === "periodicity",
          onOpenChange: (i) => l("periodicity", i),
          onBackspace: () => C((i) => i.slice(0, -1)),
          children: /* @__PURE__ */ e(t, { children: /* @__PURE__ */ e(s, { children: U.map((i) => /* @__PURE__ */ e(
            r,
            {
              title: i,
              selectionType: "Multiple",
              isSelected: _.includes(i),
              onClick: () => z(i)
            },
            i
          )) }) })
        }
      ) })
    ] }),
    /* @__PURE__ */ e(S, { variant: "Muted" }),
    /* @__PURE__ */ e("div", { className: "fds-adp__footer", children: /* @__PURE__ */ e(
      G,
      {
        label: E ? "Save Changes" : "Add Duration",
        variant: "Primary",
        size: "Large",
        isFullWidth: !0,
        onClick: H
      }
    ) })
  ] });
}
export {
  oi as AddDurationPanel
};
