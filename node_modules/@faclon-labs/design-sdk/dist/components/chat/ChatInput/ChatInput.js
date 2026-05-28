import { jsxs as i, jsx as e } from "react/jsx-runtime";
import $ from "react";
import { AnimatePresence as d, motion as c } from "framer-motion";
import { X as h, AlertCircle as H } from "react-feather";
import { cn as n } from "../../../utils/cn.js";
import { IconButton as p } from "../../actions/IconButton/IconButton.js";
import { useChatInput as J } from "./useChatInput.js";
import { ChatInputActionBar as Q } from "./ChatInputActionBar.js";
import { ChatInputGhostSuggestion as Z } from "./ChatInputGhostSuggestion.js";
/* empty css              */
const m = 0.28, u = [0.5, 0, 0, 1], f = 0.2, _ = [0.5, 0, 0, 1], ee = $.forwardRef(
  ({
    value: R,
    defaultValue: C,
    onChange: I,
    onFocus: v,
    onBlur: N,
    onSubmit: x,
    placeholder: w = "Ask a question...",
    isDisabled: a = !1,
    isGenerating: g = !1,
    onStop: y,
    accept: s,
    onFileChange: E,
    suggestions: r,
    onSuggestionAccept: S,
    validationState: b = "none",
    errorText: A,
    onErrorDismiss: l,
    accessibilityLabel: k = "Chat input",
    testID: z
  }, B) => {
    const {
      textValue: F,
      files: P,
      activeSuggestionIndex: O,
      hasFiles: U,
      isSubmitDisabled: V,
      showGhostSuggestion: o,
      textareaRef: D,
      fileInputRef: M,
      handleTextChange: T,
      handleKeyDown: Y,
      handlePaste: j,
      handleSubmit: G,
      handleUploadClick: K,
      handleFileInputChange: L,
      handleFileRemove: W,
      handleInnerMouseDownCapture: q
    } = J(
      {
        value: R,
        defaultValue: C,
        onChange: I,
        onSubmit: x,
        isDisabled: a,
        accept: s,
        onFileChange: E,
        suggestions: r,
        onSuggestionAccept: S
      },
      B
    ), X = b === "error";
    return /* @__PURE__ */ i(
      "div",
      {
        className: n("fds-chat-input", a && "fds-chat-input--disabled"),
        "data-testid": z,
        children: [
          /* @__PURE__ */ e(
            "input",
            {
              ref: M,
              type: "file",
              accept: s,
              multiple: !0,
              onChange: L,
              disabled: a,
              style: { display: "none" },
              "aria-hidden": "true",
              tabIndex: -1
            }
          ),
          /* @__PURE__ */ i(
            "div",
            {
              className: "fds-chat-input__card",
              onMouseDownCapture: q,
              children: [
                /* @__PURE__ */ e(d, { initial: !1, children: U && /* @__PURE__ */ e(
                  c.div,
                  {
                    initial: { height: 0, overflow: "hidden" },
                    animate: {
                      height: "auto",
                      overflow: "hidden",
                      transition: { duration: f, ease: _ }
                    },
                    exit: {
                      height: 0,
                      overflow: "hidden",
                      transition: { duration: f, ease: _ }
                    },
                    children: /* @__PURE__ */ e("div", { className: "fds-chat-input__files", children: P.map((t) => /* @__PURE__ */ i("div", { className: "fds-chat-input__file-chip", children: [
                      /* @__PURE__ */ e("span", { className: n("fds-chat-input__file-chip-name", "BodySmallRegular"), children: t.name }),
                      /* @__PURE__ */ e(
                        p,
                        {
                          icon: /* @__PURE__ */ e(h, { size: 12 }),
                          size: "12",
                          onClick: () => W(t),
                          "aria-label": `Remove ${t.name}`
                        }
                      )
                    ] }, t.id ?? t.name)) })
                  },
                  "file-preview"
                ) }),
                /* @__PURE__ */ i("div", { className: "fds-chat-input__textarea-row", children: [
                  o && r && /* @__PURE__ */ e(
                    Z,
                    {
                      suggestions: r,
                      activeSuggestionIndex: O,
                      isVisible: o
                    }
                  ),
                  /* @__PURE__ */ e(
                    "textarea",
                    {
                      ref: D,
                      className: n("fds-chat-input__textarea", "BodyMediumRegular"),
                      value: F,
                      placeholder: o ? "" : w,
                      "aria-label": k,
                      disabled: a,
                      rows: 1,
                      onChange: T,
                      onKeyDown: Y,
                      onPaste: j,
                      onFocus: v,
                      onBlur: N
                    }
                  )
                ] }),
                /* @__PURE__ */ e(
                  Q,
                  {
                    isDisabled: a,
                    isGenerating: g,
                    isSubmitDisabled: V,
                    onUploadClick: K,
                    onSubmit: G,
                    onStop: y
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ e("div", { className: "fds-chat-input__error-wrap", children: /* @__PURE__ */ e(d, { children: X && /* @__PURE__ */ i(
            c.div,
            {
              className: "fds-chat-input__error-strip",
              initial: { opacity: 0, translateY: "100%" },
              animate: {
                opacity: 1,
                translateY: "0%",
                transition: { duration: m, ease: u }
              },
              exit: {
                opacity: 0,
                translateY: "100%",
                transition: { duration: m, ease: u }
              },
              role: "alert",
              children: [
                /* @__PURE__ */ e("span", { className: "fds-chat-input__error-icon", "aria-hidden": !0, children: /* @__PURE__ */ e(H, { size: 14 }) }),
                /* @__PURE__ */ e("span", { className: n("fds-chat-input__error-text", "BodySmallRegular"), children: A }),
                l && /* @__PURE__ */ e("span", { className: "fds-chat-input__error-dismiss", children: /* @__PURE__ */ e(
                  p,
                  {
                    icon: /* @__PURE__ */ e(h, { size: 12 }),
                    size: "12",
                    onClick: l,
                    "aria-label": "Dismiss error"
                  }
                ) })
              ]
            },
            "error"
          ) }) })
        ]
      }
    );
  }
);
ee.displayName = "ChatInput";
export {
  ee as ChatInput
};
