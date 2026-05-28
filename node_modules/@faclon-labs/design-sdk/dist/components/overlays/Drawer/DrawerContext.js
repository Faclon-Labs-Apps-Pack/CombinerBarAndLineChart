import { createContext as e, useContext as t } from "react";
const o = e(null);
function a() {
  const r = t(o);
  if (!r)
    throw new Error(
      "Drawer sub-components (DrawerHeader, DrawerBody, DrawerFooter) must be rendered inside <Drawer>."
    );
  return r;
}
export {
  o as DrawerContext,
  a as useDrawerContext
};
