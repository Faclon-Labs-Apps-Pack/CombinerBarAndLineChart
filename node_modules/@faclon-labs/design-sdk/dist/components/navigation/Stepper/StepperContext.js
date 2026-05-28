import { createContext as t, useContext as e } from "react";
const o = t({
  orientation: "vertical",
  size: "Medium",
  itemsInGroupCount: 0,
  totalItemsInParentGroupCount: 0
});
function r() {
  return e(o);
}
export {
  o as StepperContext,
  r as useStepper
};
