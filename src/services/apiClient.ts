import { apiUrl } from '../config/runtime';

export type JsonObject = Record<string, unknown>;

export function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Accept both a plain API payload and the common `{ data: payload }` envelope. */
export function unwrapApiData<T>(value: unknown): T {
  if (isJsonObject(value) && 'data' in value) {
    return value.data as T;
  }
  return value as T;
}

export async function getJson<T>(path: string, timeoutMs = 2500): Promise<T> {
  const response = await fetch(apiUrl(path), {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return unwrapApiData<T>(await response.json());
}

export async function postJson<T>(path: string, body: unknown, timeoutMs = 5000): Promise<T> {
  const response = await fetch(apiUrl(path), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return unwrapApiData<T>(await response.json());
}
