import { jsxs as l, jsx as e } from "react/jsx-runtime";
import { cn as o } from "../../../utils/cn.js";
const m = ({
  children: r,
  validationState: a = "none",
  errorText: n = "Message not sent. Tap to retry.",
  isChildText: t
}) => {
  const s = a === "error";
  return /* @__PURE__ */ l("div", { className: "fds-chat-msg__self-bubble", children: [
    /* @__PURE__ */ e(
      "div",
      {
        className: o(
          "fds-chat-msg__self-inner",
          t && "fds-chat-msg__self-inner--padded",
          s && "fds-chat-msg__self-inner--error"
        ),
        children: r
      }
    ),
    s && /* @__PURE__ */ e("span", { className: "BodySmallRegular fds-chat-msg__error-hint", children: n })
  ] });
};
export {
  m as SelfMessageBubble
};
