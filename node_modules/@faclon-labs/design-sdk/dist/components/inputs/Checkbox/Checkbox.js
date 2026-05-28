import { jsxs as d, jsx as e } from "react/jsx-runtime";
import { forwardRef as L, useId as N, useRef as B, useCallback as h, useEffect as M } from "react";
import { cn as f } from "../../../utils/cn.js";
/* empty css             */
const D = {
  Small: "BodySmallRegular",
  Medium: "BodyMediumRegular",
  Large: "BodyLargeRegular"
};
function E() {
  return /* @__PURE__ */ e("svg", { viewBox: "0 0 12 12", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", children: /* @__PURE__ */ e(
    "path",
    {
      d: "M9.46967 2.46967C9.76256 2.17678 10.2373 2.17678 10.5302 2.46967C10.8231 2.76256 10.8231 3.23732 10.5302 3.53022L5.03022 9.03022C4.73732 9.32311 4.26256 9.32311 3.96967 9.03022L1.46967 6.53022C1.17678 6.23732 1.17678 5.76256 1.46967 5.46967C1.76256 5.17678 2.23732 5.17678 2.53022 5.46967L4.49994 7.4394L9.46967 2.46967Z",
      fill: "currentColor"
    }
  ) });
}
function R() {
  return /* @__PURE__ */ e("svg", { viewBox: "0 0 12 12", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", children: /* @__PURE__ */ e(
    "path",
    {
      d: "M9.5 5.25C9.91421 5.25 10.25 5.58579 10.25 6C10.25 6.41421 9.91421 6.75 9.5 6.75H2.5C2.08579 6.75 1.75 6.41421 1.75 6C1.75 5.58579 2.08579 5.25 2.5 5.25H9.5Z",
      fill: "currentColor"
    }
  ) });
}
const H = L(
  ({
    label: u,
    children: b,
    size: a = "Small",
    isDisabled: m = !1,
    isIndeterminate: s = !1,
    className: k,
    id: x,
    disabled: p,
    onChange: C,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isChecked: S,
    ...w
  }, n) => {
    const t = b ?? u, _ = N(), i = x ?? _, o = m || p || !1, l = B(null), g = h(
      (c) => {
        l.current = c, typeof n == "function" ? n(c) : n && (n.current = c);
      },
      [n]
    );
    M(() => {
      l.current && (l.current.indeterminate = s);
    }, [s]);
    const v = h(
      (c) => {
        if (c.key === "Enter") {
          c.preventDefault();
          const r = c.currentTarget;
          r.checked = !r.checked, r.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      },
      []
    ), y = f(
      "fds-checkbox",
      `fds-checkbox--size-${a.toLowerCase()}`,
      o && "fds-checkbox--disabled",
      s && "fds-checkbox--indeterminate",
      k
    );
    return /* @__PURE__ */ d("label", { className: y, htmlFor: i, children: [
      /* @__PURE__ */ e(
        "input",
        {
          ref: g,
          className: "fds-checkbox__input",
          type: "checkbox",
          id: i,
          disabled: o,
          "aria-disabled": o || void 0,
          onChange: C,
          onKeyDown: v,
          ...w
        }
      ),
      /* @__PURE__ */ d("span", { className: "fds-checkbox__box", "aria-hidden": "true", children: [
        /* @__PURE__ */ e("span", { className: "fds-checkbox__icon fds-checkbox__icon--check", children: /* @__PURE__ */ e(E, {}) }),
        /* @__PURE__ */ e("span", { className: "fds-checkbox__icon fds-checkbox__icon--minus", children: /* @__PURE__ */ e(R, {}) })
      ] }),
      t != null && /* @__PURE__ */ e("span", { className: f("fds-checkbox__label", D[a]), children: t })
    ] });
  }
);
H.displayName = "Checkbox";
export {
  H as Checkbox
};
