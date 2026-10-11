import type {
  CompareResponse,
  ModelConfig,
  OptimizeResult,
} from './types';

const BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `请求失败 (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  listModels: () => request<ModelConfig[]>(`${BASE}/models`),

  optimize: (data: { prompt: string; modelId: string; apiKey: string }) =>
    request<OptimizeResult>(`${BASE}/optimize`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  compare: (data: {
    prompts: string[];
    input: string;
    modelId: string;
    apiKey: string;
  }) =>
    request<CompareResponse>(`${BASE}/compare`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
