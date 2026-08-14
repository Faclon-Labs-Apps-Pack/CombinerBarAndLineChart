import { ColumnChartEnvelope, ColumnChartUIConfig, DataEntry, SeriesPayload, TimeConfig, TimeWindow } from './types';
import { resolveAndCompute } from './api';
import { resolveDurationWindow } from './time';

// Maps widget periodicity values → timeFrame string expected by resolveAndCompute.
// Accepts both the widget's enum form (hourly/daily/…) and the raw cycle form
// (hour/day/…) so the fixed duration's configured periodicity resolves too.
const PERIODICITY_TIME_FRAME: Record<string, string> = {
  minute:  'minute',
  hour:    'hour',  hourly:  'hour',
  day:     'day',   daily:   'day',
  week:    'week',  weekly:  'week',
  month:   'month', monthly: 'month',
};

// ── DEV-ONLY synthetic data ──────────────────────────────────────────────
// In the dev harness there is often no backend/auth, so `resolveAndCompute`
// returns nothing and the chart stays empty. When that happens we synthesize
// plausible series for each configured binding so the widget (and Comparison
// Mode in particular) can be previewed. Set MOCK_WHEN_EMPTY = false to disable.
const MOCK_WHEN_EMPTY = true;
const DUMMY_BUCKETS = 12;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatBucketLabel(ts: number, timeFrame: string): string {
  const d = new Date(ts);
  if (timeFrame === 'minute') return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  if (timeFrame === 'hour')   return `${String(d.getHours()).padStart(2, '0')}:00`;
  if (timeFrame === 'month')  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  if (timeFrame === 'week')   return `Wk ${MONTHS[d.getMonth()]} ${d.getDate()}`;
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

// Deterministic synthetic series — `phase`/`scale` differ between the current
// and comparison windows so the ▲/▼ deviation varies in sign and magnitude.
function makeDummyData(
  bindings: { key: string; topic: string }[],
  startTime: number,
  endTime: number,
  timeFrame: string,
  phase: number,
  scale: number,
): DataEntry[] {
  const span = Math.max(1, endTime - startTime);
  const step = span / DUMMY_BUCKETS;
  return bindings.map((b, bi) => {
    const base = 60 + bi * 28;
    const slots = Array.from({ length: DUMMY_BUCKETS }, (_, i) => {
      const from = Math.round(startTime + i * step);
      const to   = Math.round(startTime + (i + 1) * step);
      const wave = Math.sin(i / 1.7 + bi * 0.9 + phase) * 22 + Math.cos(i / 3.1 + phase) * 10;
      return {
        from, to,
        label: formatBucketLabel(from, timeFrame),
        value: Math.round((base + wave) * scale * 10) / 10,
        quality: 'good',
      };
    });
    return { key: b.key, path: b.topic, range: { from: startTime, to: endTime }, slots };
  });
}

// True when at least one entry carries a non-null slot value (i.e. real data).
// Used to decide whether the dev fallback should synthesize — this also covers
// the case where the backend returns entries but with all-null values (e.g. no
// data for the prior comparison window), which would otherwise leave the
// comparison series empty and suppress the ▲/▼ deviation tooltip.
function hasValues(entries?: DataEntry[]): boolean {
  return Array.isArray(entries) && entries.some(
    (e) => Array.isArray(e.slots) && e.slots.some((s) => s.value != null),
  );
}

// True when at least one entry carries a non-null comparison slot value.
function hasComparisonValues(entries?: DataEntry[]): boolean {
  return Array.isArray(entries) && entries.some(
    (e) => Array.isArray(e.comparisonSlots) && e.comparisonSlots.some((s) => s.value != null),
  );
}

// Attach a comparison window onto each entry INLINE as `comparisonSlots`, keyed
// by binding key. The widget reads these directly (no parallel comparisonData
// array). Used only by the dev-mock path — the live backend already returns
// comparisonSlots inline per entry.
function attachComparisonSlots(items: DataEntry[], comparison: DataEntry[]): DataEntry[] {
  return items.map((e) => {
    const cmp = comparison.find((c) => c.key === e.key);
    return { ...e, comparisonSlots: cmp?.slots ?? e.comparisonSlots };
  });
}

// True when any entry already carries backend-tagged shift slots (`slot.shift`).
function hasShiftTags(entries?: DataEntry[]): boolean {
  return Array.isArray(entries) && entries.some(
    (e) => Array.isArray(e.slots) && e.slots.some((s) => typeof s.shift === 'string' && s.shift.length > 0),
  );
}

// Which shift a bucket belongs to: the shift whose time-of-day window contains
// the bucket's start. Windows are "HH:MM"; a window whose end <= start wraps
// past midnight (e.g. 22:00→06:00). Falls back to the first shift so a bucket is
// never left untagged.
function shiftNameForBucket(
  fromTs: number,
  shifts: Array<{ name: string; startTime: string; endTime: string }>,
): string | undefined {
  const d = new Date(fromTs);
  const mins = d.getHours() * 60 + d.getMinutes();
  for (const s of shifts) {
    const [sh, sm] = s.startTime.split(':').map(Number);
    const [eh, em] = s.endTime.split(':').map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    const inWin = start <= end ? (mins >= start && mins < end) : (mins >= start || mins < end);
    if (inWin) return s.name;
  }
  return shifts[0]?.name;
}

// Dev-mock: tag each bucket with the shift its start falls in, so the widget's
// data-driven shift render (`slot.shift`) lights up without a live backend. The
// live backend already returns tagged slots, so this only fires as a fallback.
function tagShiftSlots(
  items: DataEntry[],
  shifts: Array<{ name: string; startTime: string; endTime: string }>,
): DataEntry[] {
  return items.map((e) => ({
    ...e,
    slots: (e.slots ?? []).map((s) => ({ ...s, shift: shiftNameForBucket(s.from, shifts) })),
  }));
}

interface MiniEngineCtx {
  authentication: string;
  // Local picker emit (intent override). Honored only in `local` mode.
  override?: TimeWindow;
  // The linked Global Time Picker's live broadcast window, injected by the host
  // (Lens Intent Router in prod, App.tsx in dev). Honored only in `global` mode
  // and flows straight into the resolveAndCompute payload.
  globalTimeWindow?: TimeWindow;
}

export async function resolve(
  envelope: ColumnChartEnvelope,
  ctx: MiniEngineCtx,
): Promise<{ config: ColumnChartUIConfig; data: DataEntry[] }> {
  const { startTime, endTime, periodicity } = computeWindow(envelope, ctx);
  const bindings = envelope.dynamicBindingPathList ?? [];

  if (bindings.length === 0) return { config: envelope.uiConfig, data: [] };

  const UNS_TOPIC_RE = /^uns:[^/]+:\/\//;
  const validBindings = bindings.filter(({ topic }) => {
    if (!UNS_TOPIC_RE.test(topic)) {
      console.error(
        `[MiniEngine] Invalid topic format: "${topic}". ` +
        `Expected "uns:wsId://path". ` +
        `Check that Angular's resolveUNSValue returns {{uns:wsId://path}} ` +
        `and that this.meta is keyed by workspace NAME.`
      );
      return false;
    }
    return true;
  });

  if (validBindings.length === 0 && bindings.length > 0) {
    // Dev fallback: topics aren't in `uns:` form (e.g. raw paths typed in the
    // harness) — still synthesize data so the widget can be previewed.
    if (MOCK_WHEN_EMPTY) {
      const tf = PERIODICITY_TIME_FRAME[(periodicity ?? 'daily').toLowerCase()] ?? 'day';
      let data = makeDummyData(bindings, startTime, endTime, tf, 0, 1);
      if (envelope.timeConfig?.comparisonMode) {
        const span = Math.max(0, endTime - startTime);
        const dummyCmp = makeDummyData(bindings, startTime - span, startTime, tf, 0.6, 0.88);
        data = attachComparisonSlots(data, dummyCmp);
      }
      return { config: envelope.uiConfig, data };
    }
    return { config: envelope.uiConfig, data: [] };
  }

  try {
    // Default to a daily timeFrame when no periodicity is resolved — this
    // matches the widget's periodicity selector, which defaults to "Daily".
    // (Without this the backend falls back to hourly, so the chart shows hourly
    // buckets while the selector says "Daily".)
    const timeFrame =
      PERIODICITY_TIME_FRAME[(periodicity ?? 'daily').toLowerCase()] ?? 'day';

    const bindingsPayload = validBindings.map((binding) =>
      'type' in binding && binding.type === 'series'
        ? { key: binding.key, topic: binding.topic, type: 'series' as const }
        : { key: binding.key, topic: binding.topic },
    );

    // Comparison mode: resolve the comparison window the widget overlays for the
    // ▲/▼ deviation. The window is whatever the date picker's Compare panel chose
    // (Previous period / Same period last year / Custom), passed through
    // ctx.override; otherwise default to the immediately-preceding equivalent
    // window (same length, ending where the current window starts). The backend
    // returns BOTH windows in ONE call — slots (current) + comparisonSlots
    // (prior) per entry — so we request comparison inline rather than refetching.
    // Live Shift intent (date-picker toggle) rides the override. It is mutually
    // exclusive with comparison and MUST win over the persisted `comparisonMode`
    // config flag — otherwise enabling Shift keeps returning comparison buckets
    // and the widget never leaves comparison mode.
    const overrideShifts = ctx.override?.shifts;
    const shiftActive = Array.isArray(overrideShifts) && overrideShifts.length > 0;
    const comparisonMode = Boolean(envelope.timeConfig?.comparisonMode) && !shiftActive;
    let compStart = 0;
    let compEnd = 0;
    if (comparisonMode) {
      const span = Math.max(0, endTime - startTime);
      const ov = ctx.override;
      const hasExplicit = ov?.comparisonStartTime != null && ov?.comparisonEndTime != null;
      compStart = hasExplicit ? ov!.comparisonStartTime! : startTime - span;
      compEnd   = hasExplicit ? ov!.comparisonEndTime!   : startTime;
      console.log('[MiniEngine] comparison window', {
        source: hasExplicit ? 'date-picker Compare panel' : 'default preceding period',
        window: [new Date(compStart).toLocaleString(), new Date(compEnd).toLocaleString()],
      });
    }

    // Comparison and shift are mutually exclusive — comparison wins. When shift
    // comparison is active (comparison off + shifts configured) the engine sends
    // the configured `shifts` array verbatim per the SDK contract.
    const extras = comparisonMode
      ? { comparisonMode: true, comparisonStartTime: compStart, comparisonEndTime: compEnd }
      : (shiftActive
          ? {
              shifts: overrideShifts as unknown as Array<Record<string, unknown>>,
              shiftAggregator: ctx.override?.shiftAggregator,
            }
          : undefined);
    if (extras && 'shifts' in extras) {
      console.log('[MiniEngine] shift mode — sending shifts verbatim', extras.shifts);
    }

    let items: DataEntry[] = [];
    if (ctx.authentication) {
      try {
        items = await resolveAndCompute(
          ctx.authentication, bindingsPayload, startTime, endTime, timeFrame, extras,
        );
      } catch {
        items = [];
      }
    }
    // Dev fallback: no backend data (or no auth, or all-null) → synthesize.
    if (MOCK_WHEN_EMPTY && !hasValues(items)) {
      items = makeDummyData(bindingsPayload, startTime, endTime, timeFrame, 0, 1);
    }

    // The live backend returns each entry's prior-period buckets INLINE as
    // `comparisonSlots` (parallel to `slots`), which the widget reads directly —
    // no parallel comparisonData array. Dev fallback: when the live fetch was
    // empty/unauthenticated (so `items` is synthetic and carried no
    // comparisonSlots) synthesize the comparison window and attach it inline, so
    // the deviation tooltip still has something to compute.
    if (comparisonMode && MOCK_WHEN_EMPTY && !hasComparisonValues(items)) {
      const dummyCmp = makeDummyData(bindingsPayload, compStart, compEnd, timeFrame, 0.6, 0.88);
      items = attachComparisonSlots(items, dummyCmp);
    }

    // Dev fallback for Shift mode: synthetic (and legacy-backend) slots carry no
    // shift tag, so the widget can't tell it's shift data. Tag each bucket by its
    // time-of-day window so the per-shift render lights up. Best visualized at an
    // hourly/minute range where buckets span different shift windows.
    if (shiftActive && MOCK_WHEN_EMPTY && overrideShifts && !hasShiftTags(items)) {
      items = tagShiftSlots(items, overrideShifts);
    }

    // Pass resolveAndCompute items through AS-IS (raw shape) — same as the
    // production Lens Data Engine. No reshaping/wrapping here.
    return { config: envelope.uiConfig, data: items };
  } catch {
    return { config: envelope.uiConfig, data: [] };
  }
}

export function getSeriesData(key: string, data: DataEntry[]): SeriesPayload | null {
  const entry = data.find((d) => d.key === key);
  if (!entry) return null;
  // Raw API item: series fields live at the top level of the entry.
  if (Array.isArray(entry.slots)) {
    return {
      __type: 'series',
      path: entry.path ?? '',
      meta: entry.meta as SeriesPayload['meta'],
      range: entry.range ?? { from: 0, to: 0 },
      slots: entry.slots,
      ...(Array.isArray(entry.comparisonSlots) ? { comparisonSlots: entry.comparisonSlots } : {}),
    };
  }
  // Backward-compat: wrapped DataEntry where value is a SeriesPayload.
  const v = entry.value;
  if (v !== null && typeof v === 'object' && (v as SeriesPayload).__type === 'series') {
    return v as SeriesPayload;
  }
  return null;
}

// Scalar read-helper counterpart of getSeriesData: resolves a binding key to
// its scalar value, falling back to a dot/bracket path lookup into the config
// for keys that were never bound (e.g. static uiConfig values).
export function getValue(key: string, config: unknown, data: DataEntry[]): string | number | null {
  const entry = data.find((d) => d.key === key);
  if (entry !== undefined) {
    // A series entry (raw slots at top level, or a wrapped SeriesPayload) is
    // not a scalar — never coerce it through getValue.
    if (Array.isArray(entry.slots)) return null;
    const v = entry.value;
    if (v !== null && typeof v === 'object') return null;
    return (v ?? null) as string | number | null;
  }
  const parts = key.replace(/\[(\d+)\]/g, '.$1').split('.');
  return parts.reduce((acc: unknown, k) => (acc as Record<string, unknown>)?.[k], config) as string | number | null;
}

// Resolve the configured "default duration" of a time config to a window.
// Used as the seed/fallback for local + global modes.
function defaultDurationWindow(timeConfig: TimeConfig, now: number): TimeWindow {
  const dur = timeConfig.allDurations?.find((d) => d.id === timeConfig.defaultDurationId);
  if (dur) {
    return { ...resolveDurationWindow(dur, now, timeConfig.cycleTime), periodicity: timeConfig.defaultPeriodicity };
  }
  return { startTime: now - 86_400_000, endTime: now, periodicity: timeConfig.defaultPeriodicity };
}

// The single window that feeds resolveAndCompute. One owner per picker mode:
//
//   fixed   → the configured set-duration (time tab). Locked: neither the local
//             override nor a global window can shadow it.
//   global  → the linked Global Time Picker's live window (ctx.globalTimeWindow,
//             injected by the host). Falls back to the inherited default
//             duration when no live window is available (e.g. dev before the
//             GTP broadcasts). The local override is ignored — the GTP owns time.
//   local   → the widget's own picker emit (ctx.override) wins; otherwise the
//             configured default duration seeds the window.
//
// This mirrors the platform resolution priority: fixed is absolute; otherwise
// the externally-controlled window (global) or the widget-controlled window
// (local override) wins over the persisted envelope default.
function computeWindow(
  envelope: ColumnChartEnvelope,
  ctx: { override?: TimeWindow; globalTimeWindow?: TimeWindow },
): TimeWindow {
  const { timeConfig } = envelope;
  const now = Date.now();

  if (!timeConfig) {
    // No time config at all → engine safety-net 24h window.
    return ctx.override ?? { startTime: now - 86_400_000, endTime: now };
  }

  const picker = timeConfig.pickerType ?? timeConfig.type;

  // 1. Fixed picker — purely the configured set-duration. Runs first so a stale
  //    override or an injected global window can never shadow it.
  if (picker === 'fixed') {
    if (timeConfig.fixedDuration) {
      const win = resolveDurationWindow(timeConfig.fixedDuration, now, timeConfig.cycleTime);
      return { ...win, periodicity: timeConfig.defaultPeriodicity };
    }
    // Legacy absolute fixed window.
    if (timeConfig.startTime && timeConfig.endTime) {
      return { startTime: timeConfig.startTime, endTime: timeConfig.endTime, periodicity: timeConfig.defaultPeriodicity };
    }
    return defaultDurationWindow(timeConfig, now);
  }

  // 2. Global picker — the linked GTP's live broadcast window (host-injected).
  //    Falls back to the inherited default duration. The local override is
  //    intentionally ignored: in global mode the widget has no local picker.
  if (picker === 'global') {
    if (ctx.globalTimeWindow) return ctx.globalTimeWindow;
    return defaultDurationWindow(timeConfig, now);
  }

  // 3. Local picker — the widget's own picker emit wins over the default.
  if (ctx.override) return ctx.override;
  // Legacy absolute fixed window kept for back-compat with old `type: 'fixed'`.
  if (timeConfig.type === 'fixed' && timeConfig.startTime && timeConfig.endTime) {
    return { startTime: timeConfig.startTime, endTime: timeConfig.endTime, periodicity: timeConfig.defaultPeriodicity };
  }
  return defaultDurationWindow(timeConfig, now);
}
