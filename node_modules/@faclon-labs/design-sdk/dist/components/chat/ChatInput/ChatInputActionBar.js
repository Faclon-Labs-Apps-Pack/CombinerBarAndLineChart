import { jsxs as e, jsx as a } from "react/jsx-runtime";
import { Plus as s, StopCircle as d, ArrowUp as m } from "react-feather";
import { cn as u } from "../../../utils/cn.js";
import { Button as l } from "../../actions/Button/Button.js";
const y = ({
  isDisabled: r,
  isGenerating: n,
  isSubmitDisabled: t,
  onUploadClick: c,
  onSubmit: o,
  onStop: i
}) => /* @__PURE__ */ e("div", { className: "fds-chat-input__action-bar", children: [
  /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      className: u("fds-chat-input__attach-btn", "BodySmallRegular"),
      onClick: c,
      disabled: r,
      "aria-label": "Attach file",
      children: [
        /* @__PURE__ */ a(s, { size: 14, "aria-hidden": !0 }),
        /* @__PURE__ */ a("span", { children: "Upload file" })
      ]
    }
  ),
  /* @__PURE__ */ a("div", { children: n ? /* @__PURE__ */ a(
    l,
    {
      variant: "Secondary",
      color: "Primary",
      size: "Small",
      iconOnly: !0,
      leadingIcon: /* @__PURE__ */ a(d, { size: 14 }),
      "aria-label": "Stop generation",
      onClick: () => i == null ? void 0 : i(),
      isDisabled: r
    }
  ) : /* @__PURE__ */ a(
    l,
    {
      variant: "Primary",
      color: "Primary",
      size: "Small",
      iconOnly: !0,
      leadingIcon: /* @__PURE__ */ a(m, { size: 14 }),
      "aria-label": "Send message",
      onClick: o,
      isDisabled: t
    }
  ) })
] });
export {
  y as ChatInputActionBar
};
