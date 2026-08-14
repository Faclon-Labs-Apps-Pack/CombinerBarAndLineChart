# Cycle Time Defaults — port guide

Pre-fills the **Cycle Time** form (in the Time tab) with sensible "start of calendar period" defaults so it never renders blank — for both the **Local** and **Fixed** pickers. Drop-in for the Column Chart (or any widget using the SDK `TimeTabConfiguration`).

All code lives in the **configurator** (e.g. `CombinedBarLineChartConfiguration.tsx`).

---

## 1. The problem
The SDK `TimeTabConfiguration` renders a **Cycle Time** sub-form (cycle type, hour/minute, day-of-week, date, month, year) that redefines when periods begin. With no seed value every field renders blank, so the user must fill all of them before durations resolve correctly. We want it pre-filled — but **idempotently**, so it never overwrites a value the user changes.

The cycle time lives in **different places per picker**:
- **Local** → top-level `ttc.cycleTime`
- **Fixed** → `ttc.fixed.cycleTime`
- **Global** → inherited from the linked GTP (read-only, leave alone)

---

## 2. The defaults
| Field | Default | Meaning |
|---|---|---|
| `cycleTimeType` | `'calendar'` | Standard calendar periods (not financial/custom) |
| `identifier` | `'start'` | Cycle anchored at the **start** of the period |
| `hour` | `'00'` | Day begins at midnight |
| `minute` | `'00'` | … |
| `dayOfWeek` | `1` | Week starts **Monday** (ISO) |
| `date` | `'1'` | Month starts on the **1st** |
| `month` | `'1'` | Year starts in **January** (calendar) |
| `year` | `''` | Current year |

> These were chosen for a calendar/midnight/Monday default. Swap `hour`→`'06'` for a 6 AM shift-day, `dayOfWeek`→`0` for a Sunday week start, `cycleTimeType`→`'financial'` + `month`→`'4'` for an April fiscal year.

---

## 3. The code (drop into the configurator)
A pure filler that only fills **blank** fields (so it never fights edits), plus a picker-aware wrapper:

```ts
// Sensible "start of calendar period" defaults for the Cycle Time form so it
// never renders blank. Idempotent — any field the user has set is preserved;
// only blanks are filled. Local fills top-level cycleTime, Fixed fills
// fixed.cycleTime, Global inherits from the GTP (read-only) so it's left alone.
function fillCycleDefaults(ct: Record<string, unknown> | undefined): Record<string, unknown> {
  const c = ct ?? {};
  return {
    cycleTimeType: c.cycleTimeType || 'calendar',
    identifier:    c.identifier    || 'start',
    hour:          c.hour          || '00',
    minute:        c.minute        || '00',
    dayOfWeek:     c.dayOfWeek == null ? 1 : c.dayOfWeek,   // 1 = Monday
    date:          c.date          || '1',
    month:         c.month         || '1',                  // January (calendar year start)
    year:          c.year ?? '',
  };
}

function withCycleDefaults<T extends Record<string, unknown> | undefined>(ttc: T): T {
  if (!ttc) return ttc;
  const picker = (ttc.linkTimeWith ?? ttc.timeType ?? 'local') as string;
  if (picker === 'fixed') {
    const fixed = (ttc.fixed ?? {}) as Record<string, unknown>;
    return { ...ttc, fixed: { ...fixed, cycleTime: fillCycleDefaults(fixed.cycleTime as Record<string, unknown> | undefined) } } as T;
  }
  if (picker === 'local') {
    return { ...ttc, cycleTime: fillCycleDefaults(ttc.cycleTime as Record<string, unknown> | undefined) } as T;
  }
  return ttc; // global → cycle time inherited from the GTP (read-only)
}
```

> **Why `|| ''` vs `== null`:** string fields use `||` (so an empty string also fills); `dayOfWeek` is numeric where `0` is valid (Sunday), so it uses `== null` to avoid treating `0` as "blank". `year` uses `??` so an explicit `''` is kept.

---

## 4. Wire it in **both** directions
The default must show in the form **and** be saved into the config — apply the wrapper at both points.

**A. The value passed to the SDK form** (so the form renders pre-filled):
```tsx
<TimeTabConfiguration
  value={withCycleDefaults(currentTimeTabConfig) as Partial<TimeTabUIConfig> | undefined}
  onChange={handleTimeChange}
  …
/>
```

**B. The change handler** (so the defaults are baked into the emitted envelope, not just visual):
```ts
function handleTimeChange(ttcRawInput: unknown) {
  const ttc = withCycleDefaults(ttcRawInput as Record<string, unknown>) as unknown as TimeTabUIConfig;
  // …map to TimeConfig / buildDynamicBindingPathList / onChange(envelope) as usual
}
```

That's the whole change — one helper + two call sites. The picker switch (`linkTimeWith ?? timeType`) auto-routes to the right scope, so Local and Fixed are both covered with no extra branching.

---

## 5. Edge cases
| # | Case | Handling |
|---|---|---|
| 1 | User edits a field then re-renders | Idempotent — only blanks fill, so the edit is preserved. |
| 2 | `dayOfWeek = 0` (Sunday) | Kept (uses `== null`, not falsy) — `0` is a valid Sunday, not "blank". |
| 3 | Global picker | Returns `ttc` unchanged — cycle time comes from the linked GTP (read-only). |
| 4 | Switching Local ↔ Fixed | Each scope is filled independently; switching shows that scope's pre-filled (or user-edited) values. |
| 5 | No `ttc` yet (first mount) | Guard returns early; nothing to fill. |

---

## 6. Verify
1. `npx tsc --noEmit` clean; webpack "compiled successfully".
2. Harness → **Local** mode → open Cycle Time → fields pre-filled (Calendar / 00:00 / Monday / 1 / January).
3. Switch to **Fixed** mode → open Cycle Time → same pre-filled defaults.
4. Change one field (e.g. hour → 06) → it sticks across re-renders (not reset to 00).
5. **Global** mode → Cycle Time reflects the linked GTP, not these defaults.

## 7. Files / functions to reuse
- `fillCycleDefaults`, `withCycleDefaults` — copy verbatim into the Column Chart configurator.
- Apply at the `TimeTabConfiguration` `value={…}` and inside the `onChange`/`handleTimeChange` handler.
