import { useEffect as oe, useRef as se, useMemo as R } from "react";
import { useRowSelect as ie, SelectClickTypes as J, SelectTypes as P } from "@table-library/react-table-library/select";
import { useSort as ne } from "@table-library/react-table-library/sort";
import { usePagination as re } from "@table-library/react-table-library/pagination";
import { useTree as le } from "@table-library/react-table-library/tree";
import { useControllableState as ae } from "../../../../hooks/useControllableState.js";
import { useStickyShadow as ce } from "./useStickyShadow.js";
function he(Q) {
  var L;
  const {
    data: s,
    rowCount: g,
    selectionType: w = "none",
    defaultSelectedIds: u,
    onSelectionChange: E,
    isRowSelectable: l,
    multiSelectTrigger: v = "checkbox",
    sortFunctions: C = {},
    defaultSort: b,
    onSortChange: K,
    pagination: S = !1,
    defaultPageSize: A = 10,
    pageSize: c,
    page: d,
    onPaginationChange: T,
    defaultExpandedIds: U,
    onExpansionChange: F,
    isGrouped: f = !1,
    rowDensity: H = "compact",
    isLoading: O = !1,
    isRefreshing: _ = !1,
    isHeaderSticky: m = !0,
    isFirstColumnSticky: j = !1,
    hasStickyActionColumn: B = !1,
    maxHeight: M
  } = Q;
  typeof process < "u" && ((L = process.env) == null ? void 0 : L.NODE_ENV) !== "production" && oe(() => {
    const e = s.nodes.filter((t) => (t == null ? void 0 : t.id) === void 0);
    e.length > 0 && console.error(
      `[Table] ${e.length} row(s) are missing an \`id\`. Every item in \`data.nodes\` must have a unique identifier.`
    ), m && M === void 0 && console.warn(
      "[Table] `isHeaderSticky` has no effect without `maxHeight` — the header needs a scroll container to stick to."
    ), (d !== void 0 || c !== void 0) && g === void 0 && console.warn(
      "[Table] Controlled pagination (`page`/`pageSize`) is set but `rowCount` is missing — the pagination label will under-count total rows."
    );
  }, [s.nodes, m, M, d, c, g]);
  const x = se(null), D = ce(x), p = w === "single", r = ie(
    s,
    {
      state: p ? { id: (u == null ? void 0 : u[0]) ?? null } : { ids: u ?? [] },
      onChange: (e, t) => {
        if (!E) return;
        const o = t.id, I = t.ids, $ = p ? o != null ? [o] : [] : I ?? [], ee = s.nodes.filter((te) => $.includes(te.id));
        E({ values: ee });
      }
    },
    {
      rowSelect: p ? P.SingleSelect : P.MultiSelect,
      buttonSelect: P.MultiSelect,
      clickType: v === "row" ? J.RowClick : J.ButtonClick
    }
  ), y = p ? r.state.id != null ? [r.state.id] : [] : r.state.ids ?? [], i = ne(
    s,
    {
      state: b ? {
        sortKey: b.sortKey,
        reverse: b.direction === "desc"
      } : { sortKey: "", reverse: !1 },
      onChange: (e, t) => {
        if (!K) return;
        const o = t.sortKey, I = t.reverse;
        K(o ? { sortKey: o, direction: I ? "desc" : "asc" } : null);
      }
    },
    {
      // The engine constrains SortFn to its own TableNode; consumers write
      // sort fns in terms of their own Item type. The cast bridges the gap.
      sortFns: C
    }
  ), N = i.state.sortKey ? {
    sortKey: i.state.sortKey,
    direction: i.state.reverse ? "desc" : "asc"
  } : null, W = d !== void 0 || c !== void 0, V = {
    page: d ?? 0,
    size: c ?? A
  }, [X, Y] = ae({
    value: W ? { page: d ?? 0, size: c ?? A } : void 0,
    defaultValue: V
  }), h = X ?? V, n = re(
    s,
    {
      state: { page: h.page, size: h.size },
      onChange: (e, t) => {
        const o = {
          page: t.page,
          size: t.size
        };
        Y(o), T == null || T(o);
      }
    },
    {}
  ), a = le(
    f ? s : { nodes: [] },
    {
      state: { ids: U ?? [] },
      onChange: (e, t) => {
        if (!F) return;
        const o = t.ids ?? [];
        F(o);
      }
    },
    {}
  ), q = a.state.ids ?? [], Z = R(() => {
    let e = s.nodes;
    return i.modifier && (e = i.modifier(e)), S && n.modifier && (e = n.modifier(e)), f && a.modifier && (e = a.modifier(e)), e;
  }, [
    s.nodes,
    i.modifier,
    n.modifier,
    a.modifier,
    S,
    f
  ]), k = R(
    () => s.nodes.filter((e) => l ? l(e) : !0).map((e) => e.id),
    [s.nodes, l]
  ), z = k.length > 0 && k.every((e) => y.includes(e)), G = !z && k.some((e) => y.includes(e));
  return { ctx: R(
    () => ({
      data: s,
      totalItems: g ?? s.nodes.length,
      selectionType: w,
      multiSelectTrigger: v,
      selectedIds: y,
      toggleRowSelection: (e) => r.fns.onToggleById(e),
      toggleRowSelectionRange: (e) => (
        // Engine walks visible nodes in render order. We feed the canonical
        // sort+paginate modifier chain so the range is what the user sees.
        r.fns.onToggleByIdShift(
          e,
          { isCarryForward: !1, isPartialToAll: !1 },
          ((t) => {
            let o = t;
            return i.modifier && (o = i.modifier(o)), S && n.modifier && (o = n.modifier(o)), o;
          })
        )
      ),
      toggleAllRowsSelection: () => r.fns.onToggleAll({ isCarryForward: !1, isPartialToAll: !1 }),
      isAllSelected: z,
      isIndeterminate: G,
      isRowSelectable: (e) => l ? l(e) : !0,
      sortState: N,
      sortableKeys: Object.keys(C),
      toggleSort: (e) => i.fns.onToggleSort({ sortKey: e }),
      pageState: h,
      setPage: (e) => n.fns.onSetPage(e),
      setPageSize: (e) => n.fns.onSetSize(e),
      expandedIds: q,
      toggleExpansion: (e) => a.fns.onToggleById(e),
      isGrouped: f,
      rowDensity: H,
      isLoading: O,
      isRefreshing: _,
      isHeaderSticky: m,
      isFirstColumnSticky: j,
      hasStickyActionColumn: B,
      scrollContainerRef: x,
      isScrolledHorizontally: D
    }),
    [
      s,
      g,
      w,
      v,
      y,
      z,
      G,
      l,
      r.fns,
      N,
      C,
      i.fns,
      i.modifier,
      S,
      h,
      n.fns,
      n.modifier,
      q,
      a.fns,
      f,
      H,
      O,
      _,
      m,
      j,
      B,
      D
    ]
  ), processedRows: Z, scrollContainerRef: x };
}
export {
  he as useTableEngine
};
