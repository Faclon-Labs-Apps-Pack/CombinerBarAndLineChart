import { useContext as e } from "react";
import { SideNavBarContext as o } from "./SideNavBarContext.js";
function a() {
  const r = e(o);
  if (!r)
    throw new Error(
      "[useSideNavBar] Hook called outside <SideNavBarProvider>. Wrap your tree in <SideNavBarProvider> before reading the hook."
    );
  return r;
}
export {
  a as useSideNavBar
};
