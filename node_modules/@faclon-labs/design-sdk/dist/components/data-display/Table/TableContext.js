import { createContext as o, useContext as e } from "react";
const n = o(null);
function u() {
  const t = e(n);
  if (!t)
    throw new Error("useTableContext() must be used inside <Table>.");
  return t;
}
function s() {
  return e(n);
}
export {
  n as TableContext,
  u as useTableContext,
  s as useTableContextOptional
};
