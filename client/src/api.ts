import type { Prompt, CompareResponse } from './types';

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
  listPrompts: () => request<Prompt[]>(`${BASE}/prompts`),
  createPrompt: (data: { title: string; content: string }) =>
    request<Prompt>(`${BASE}/prompts`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deletePrompt: (id: number) =>
    request<void>(`${BASE}/prompts/${id}`, { method: 'DELETE' }),
  compare: (input: string, promptIds: number[]) =>
    request<CompareResponse>(`${BASE}/compare`, {
      method: 'POST',
      body: JSON.stringify({ input, promptIds }),
    }),
};
