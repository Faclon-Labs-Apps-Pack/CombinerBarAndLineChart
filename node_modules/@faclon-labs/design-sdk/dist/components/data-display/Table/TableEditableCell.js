import { jsx as c, jsxs as C } from "react/jsx-runtime";
/* empty css                      */
import { useState as k, useRef as y, useCallback as h, useEffect as P } from "react";
import { Edit2 as S } from "react-feather";
import { TextInput as T } from "../../inputs/TextInput/TextInput.js";
import { IconButton as q } from "../../actions/IconButton/IconButton.js";
import { cn as D } from "../../../utils/cn.js";
function U({
  type: w = "text",
  value: l,
  item: E,
  onCommit: s,
  placeholder: I,
  emptyText: _ = "—",
  editMode: t = "click",
  isDisabled: n,
  validationState: K = "none",
  accessibilityLabel: i,
  className: N,
  style: g,
  ...W
}) {
  const [f, u] = k(t === "always"), [r, d] = k(l), a = y(l), x = y(null), p = y(null), [b, m] = k(null);
  l !== a.current && r === a.current && (a.current = l, d(l));
  const v = h(() => {
    r !== a.current && (a.current = r, s == null || s({ value: r, item: E })), t !== "always" && (u(!1), m(null));
  }, [r, E, s, t]), $ = h(() => {
    d(a.current), t !== "always" && (u(!1), m(null));
  }, [t]), o = h(() => {
    n || t === "always" || (p.current && m(p.current.offsetWidth), u(!0));
  }, [n, t]);
  P(() => {
    if (!f) return;
    const e = x.current;
    e && (e.focus(), e.select());
  }, [f]);
  const z = (e) => {
    e.key === "Enter" ? (e.preventDefault(), v()) : e.key === "Escape" && (e.preventDefault(), $());
  }, B = (e) => {
    (e.key === "Enter" || e.key === " ") && (e.preventDefault(), o());
  }, R = f || t === "always", j = b != null ? { ...g, width: b, maxWidth: b } : g;
  return /* @__PURE__ */ c(
    "td",
    {
      ref: p,
      className: D("fds-table__editable-cell", "fds-table__cell", N),
      "data-content-type": "editable",
      "data-editing": R ? "true" : void 0,
      onDoubleClick: t === "dblclick" ? o : void 0,
      style: j,
      ...W,
      children: R ? /* @__PURE__ */ c(
        T,
        {
          ref: x,
          label: "",
          "aria-label": i,
          type: w === "email" ? "email" : w === "number" ? "number" : "text",
          size: "Medium",
          value: r,
          placeholder: I,
          isDisabled: n,
          validationState: K,
          onChange: ({ value: e }) => d(e),
          onBlur: () => v(),
          onKeyDown: z
        }
      ) : /* @__PURE__ */ C("span", { className: "fds-table__editable-cell-read BodyMediumRegular", children: [
        /* @__PURE__ */ c(
          "span",
          {
            role: "button",
            tabIndex: n ? -1 : 0,
            "aria-label": `${i}. Currently ${l || _}. ${t === "dblclick" ? "Double-click" : "Press Enter"} to edit.`,
            "aria-disabled": n || void 0,
            className: D(
              "fds-table__editable-cell-read-value",
              !l && "fds-table__editable-cell-read-value--empty"
            ),
            onClick: t === "click" ? o : void 0,
            onKeyDown: B,
            children: l || _
          }
        ),
        !n && /* @__PURE__ */ c("span", { className: "fds-table-cell-hover-action", children: /* @__PURE__ */ c(
          q,
          {
            size: "20",
            icon: /* @__PURE__ */ c(S, { size: 16 }),
            "aria-label": `Edit ${i}`,
            onClick: (e) => {
              e.stopPropagation(), o();
            }
          }
        ) })
      ] })
    }
  );
}
export {
  U as TableEditableCell
};
