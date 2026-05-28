import { BindingEntry, SeriesPayload, SeriesMeta, SeriesSlot } from './types';

const STAGING_BASE = 'https://stagingsv.iosense.io/api';
const GRAPH = 'iosense_test_uns';

function isRawSeriesItem(item: Record<string, unknown>): boolean {
  return Array.isArray(item.slots);
}

export async function validateSSOToken(ssoToken: string): Promise<string> {
  const res = await fetch(`${STAGING_BASE}/account/validateSSO`, {
    method: 'GET',
    headers: { token: ssoToken },
  });
  const json = await res.json();
  if (!json.success || !json.token) throw new Error('SSO validation failed');
  return json.token;
}

export async function resolveAndCompute(
  authentication: string,
  config: Array<BindingEntry>,
  startTime: number,
  endTime: number,
  timeFrame?: string,
): Promise<Array<{ key: string; value: string | number | null | SeriesPayload }>> {
  const body: Record<string, unknown> = { graph: GRAPH, config, startTime, endTime };
  if (timeFrame) body.timeFrame = timeFrame;

  console.log('[API] Calling resolveAndCompute with:', { endpoint: `${STAGING_BASE}/account/uns/resolveAndCompute`, auth: !!authentication, configCount: config.length });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const res = await fetch(`${STAGING_BASE}/account/uns/resolveAndCompute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authentication}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[API] resolveAndCompute failed with status ${res.status}:`, errorText);
      throw new Error(`API error: ${res.status} - ${errorText}`);
    }

    const json = await res.json();
    console.log('[API] resolveAndCompute response:', json);

    if (!json.success) {
      console.error('[API] resolveAndCompute returned success=false:', json);
    }

    const rawItems: Record<string, unknown>[] = json?.data ?? [];
    return rawItems.map((item) => {
      if (isRawSeriesItem(item)) {
        return {
          key: item.key as string,
          value: {
            __type: 'series' as const,
            path: item.path as string,
            meta: item.meta as SeriesMeta,
            range: item.range as { from: number; to: number },
            slots: item.slots as SeriesSlot[],
          } satisfies SeriesPayload,
        };
      }
      return { key: item.key as string, value: item.value as string | number | null };
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[API] resolveAndCompute timeout after 30 seconds');
      throw new Error('API request timeout');
    }
    console.error('[API] resolveAndCompute fetch error:', error);
    throw error;
  }
}

export async function fetchUNSNodes(
  authentication: string,
  graph: string,
  label?: string,
  limit = 100,
  expandPostfix = false,
): Promise<Array<{ id: string; type: string; name?: string; path: string | null; parentId: string | null }>> {
  const params = new URLSearchParams({ graph, limit: String(limit) });
  if (label) params.set('label', label);
  if (expandPostfix) params.set('expandPostfix', 'true');

  console.log('[API] Calling fetchUNSNodes:', { endpoint: `${STAGING_BASE}/account/uns/nodes`, graph, label, auth: !!authentication });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const res = await fetch(`${STAGING_BASE}/account/uns/nodes?${params}`, {
      headers: { Authorization: `Bearer ${authentication}` },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[API] fetchUNSNodes failed with status ${res.status}:`, errorText);
      throw new Error(`API error: ${res.status} - ${errorText}`);
    }

    const json = await res.json();
    console.log('[API] fetchUNSNodes response:', json);

    return (json?.data?.data ?? []) as Array<{
      id: string; type: string; name?: string; path: string | null; parentId: string | null;
    }>;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[API] fetchUNSNodes timeout after 30 seconds');
      throw new Error('API request timeout');
    }
    console.error('[API] fetchUNSNodes fetch error:', error);
    throw error;
  }
}
