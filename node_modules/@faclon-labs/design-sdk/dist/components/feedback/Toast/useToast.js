import { useContext as o } from "react";
import { ToastContext as e } from "./ToastContainer.js";
function a() {
  const t = o(e);
  if (!t)
    throw new Error(
      "[useToast] No <ToastContainer> found in the React tree. Mount one at the app root."
    );
  return t;
}
export {
  a as useToast
};
