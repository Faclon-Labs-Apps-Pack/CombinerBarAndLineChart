import { jsx as i, jsxs as C } from "react/jsx-runtime";
import { cn as t } from "../../../utils/cn.js";
/* empty css                  */
function h({ type: l = "xyz", className: e, ...a }) {
  if (l === "error")
    return /* @__PURE__ */ i("div", { className: t("fds-file-thumbnail", e), "data-type": "error", ...a, children: /* @__PURE__ */ i("svg", { width: "38", height: "38", viewBox: "0 0 38 38", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ i(
      "path",
      {
        className: "fds-file-thumbnail__error",
        d: "M26.06 1L33.2 8.826V33.085C33.2 34.03 32.86 34.937 32.25 35.606C31.64 36.274 30.812 36.65 29.95 36.65H8.254C7.391 36.65 6.563 36.274 5.953 35.606C5.343 34.937 5 34.03 5 33.085V4.565C5 3.62 5.343 2.713 5.953 2.044C6.563 1.376 7.391 1 8.254 1H26.06ZM19.215 12.168C17.33 12.168 15.522 12.917 14.19 14.25C12.857 15.583 12.108 17.39 12.108 19.275C12.108 21.16 12.857 22.968 14.19 24.301C15.522 25.634 17.33 26.383 19.215 26.383C21.1 26.383 22.908 25.634 24.241 24.301C25.574 22.968 26.322 21.16 26.322 19.275C26.322 17.391 25.574 15.583 24.241 14.25C22.908 12.917 21.1 12.168 19.215 12.168ZM19.215 22.118C19.466 22.118 19.708 22.218 19.886 22.396C20.063 22.573 20.163 22.815 20.163 23.066C20.163 23.318 20.063 23.559 19.886 23.736C19.708 23.914 19.466 24.014 19.215 24.014C18.964 24.014 18.723 23.914 18.545 23.736C18.367 23.559 18.268 23.318 18.268 23.066C18.268 22.815 18.367 22.573 18.545 22.396C18.723 22.218 18.964 22.118 19.215 22.118ZM19.215 14.537C19.403 14.537 19.585 14.612 19.718 14.745C19.851 14.878 19.926 15.06 19.926 15.248V20.46C19.926 20.649 19.851 20.83 19.718 20.963C19.585 21.096 19.403 21.171 19.215 21.171C19.027 21.171 18.846 21.096 18.713 20.963C18.58 20.83 18.505 20.649 18.505 20.46V15.248C18.505 15.06 18.58 14.878 18.713 14.745C18.846 14.612 19.027 14.537 19.215 14.537Z",
        fillOpacity: "0.32"
      }
    ) }) });
  const s = l === "json" ? ".JSON" : `.${l}`;
  return /* @__PURE__ */ i("div", { className: t("fds-file-thumbnail", e), "data-type": l, ...a, children: /* @__PURE__ */ C(
    "svg",
    {
      width: "38",
      height: "38",
      viewBox: "0 0 38 38",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      children: [
        /* @__PURE__ */ i("g", { transform: "translate(5.23, 1)", children: /* @__PURE__ */ i(
          "path",
          {
            className: "fds-file-thumbnail__body",
            d: "M3.214 0.25H20.688L27.604 7.922V32.087C27.604 32.974 27.286 33.82 26.727 34.44C26.168 35.06 25.417 35.402 24.64 35.402H3.214C2.437 35.402 1.685 35.06 1.127 34.44C0.568 33.82 0.25 32.974 0.25 32.087V3.565C0.25 2.678 0.568 1.832 1.127 1.212C1.685 0.593 2.437 0.25 3.214 0.25Z",
            strokeWidth: "0.5"
          }
        ) }),
        /* @__PURE__ */ i(
          "rect",
          {
            className: "fds-file-thumbnail__ribbon",
            x: "3",
            y: "18.83",
            width: "32.31",
            height: "12.25"
          }
        ),
        /* @__PURE__ */ i(
          "path",
          {
            className: "fds-file-thumbnail__shadow",
            d: "M5.5 31.08H3L5.5 33.58V31.08Z"
          }
        ),
        /* @__PURE__ */ i(
          "path",
          {
            className: "fds-file-thumbnail__shadow",
            d: "M32.8 31.08H35.3L32.8 33.58V31.08Z"
          }
        ),
        /* @__PURE__ */ i(
          "text",
          {
            className: "fds-file-thumbnail__label",
            x: "19.15",
            y: "27",
            textAnchor: "middle",
            children: s
          }
        )
      ]
    }
  ) });
}
h.displayName = "FileThumbnail";
export {
  h as FileThumbnail
};
