import { useContext as e, createContext as n } from "react";
const o = n(null);
function s() {
  const t = e(o);
  if (!t)
    throw new Error("TabItem must be rendered inside <Tabs>.");
  return t;
}
export {
  o as TabsContext,
  s as useTabsContext
};
