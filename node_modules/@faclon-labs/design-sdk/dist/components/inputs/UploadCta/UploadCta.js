import { jsxs as f, jsx as e } from "react/jsx-runtime";
import { useRef as _, useState as k } from "react";
import { cn as D } from "../../../utils/cn.js";
import { LinkButton as C } from "../../actions/LinkButton/LinkButton.js";
/* empty css              */
function N({
  bodyText: l = "Drag files here or",
  linkText: s = "Upload",
  isDisabled: r = !1,
  accept: p,
  multiple: u = !1,
  onFilesSelect: t,
  className: c,
  ...i
}) {
  const o = _(null), [m, n] = k(!1), d = () => {
    var a;
    r || (a = o.current) == null || a.click();
  }, g = (a) => {
    a.target.files && a.target.files.length > 0 && (t == null || t(a.target.files)), a.target.value = "";
  }, h = (a) => {
    a.preventDefault(), r || n(!0);
  }, v = () => {
    n(!1);
  }, y = (a) => {
    a.preventDefault(), n(!1), !r && a.dataTransfer.files.length > 0 && (t == null || t(a.dataTransfer.files));
  };
  return /* @__PURE__ */ f(
    "div",
    {
      className: D(
        "fds-upload-cta",
        m && "fds-upload-cta--active",
        r && "fds-upload-cta--disabled",
        c
      ),
      onDragOver: h,
      onDragLeave: v,
      onDrop: y,
      ...i,
      children: [
        /* @__PURE__ */ e(
          "div",
          {
            className: "fds-upload-cta__root",
            onClick: d,
            role: "button",
            tabIndex: r ? -1 : 0,
            "aria-disabled": r,
            onKeyDown: (a) => {
              (a.key === "Enter" || a.key === " ") && (a.preventDefault(), d());
            },
            children: /* @__PURE__ */ f("div", { className: "fds-upload-cta__inner", children: [
              /* @__PURE__ */ e("span", { className: "fds-upload-cta__body BodyMediumRegular", children: l }),
              /* @__PURE__ */ e(
                C,
                {
                  type: "Anchor",
                  color: "Primary",
                  size: "Medium",
                  label: s,
                  isDisabled: r,
                  className: "fds-upload-cta__link"
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ e(
          "input",
          {
            ref: o,
            type: "file",
            accept: p,
            multiple: u,
            onChange: g,
            hidden: !0,
            tabIndex: -1
          }
        )
      ]
    }
  );
}
N.displayName = "UploadCta";
export {
  N as UploadCta
};
