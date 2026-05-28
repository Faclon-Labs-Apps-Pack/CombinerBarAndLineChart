import { useRef as u, useEffect as c } from "react";
function d(t, n) {
  const r = u(n);
  r.current = n, c(() => {
    const e = (o) => {
      !t.current || t.current.contains(o.target) || r.current(o);
    };
    return document.addEventListener("mousedown", e), document.addEventListener("touchstart", e), () => {
      document.removeEventListener("mousedown", e), document.removeEventListener("touchstart", e);
    };
  }, [t]);
}
export {
  d as useClickOutside
};
