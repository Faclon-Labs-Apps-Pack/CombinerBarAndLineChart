import { useRef as f, useState as n, useCallback as b } from "react";
function m({
  value: r,
  defaultValue: c,
  onChange: t
}) {
  const e = f(r !== void 0), [l, o] = n(c), u = e.current ? r : l, i = b(
    (s) => {
      e.current || o(s), t == null || t(s);
    },
    [t]
  );
  return [u, i];
}
export {
  m as useControllableState
};
