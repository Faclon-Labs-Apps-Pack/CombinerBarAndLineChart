const p = {
  XSmall: "Small",
  Small: "Small",
  Medium: "Medium",
  Large: "Medium",
  XLarge: "Large"
}, t = {
  XSmall: 8,
  Small: 10,
  Medium: 12,
  Large: 16,
  XLarge: 20
}, a = {
  Circle: {
    XSmall: { right: "0px", top: "0px" },
    Small: { right: "1px", top: "1px" },
    Medium: { right: "1px", top: "2px" },
    Large: { right: "4px", top: "2px" },
    XLarge: { right: "4px", top: "2px" }
  },
  Square: {
    XSmall: { right: "-2px", top: "-2px" },
    Small: { right: "-2px", top: "-2px" },
    Medium: { right: "-2px", top: "-2px" },
    Large: { right: "-2px", top: "-2px" },
    XLarge: { right: "-2px", top: "-2px" }
  }
};
export {
  t as avatarToBottomAddonPx,
  p as avatarToIndicatorSize,
  a as avatarTopAddonOffsets
};
