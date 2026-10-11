export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  baseUrl: string;
  modelId: string;
  format: 'openai' | 'anthropic';
  keyUrl: string;
}

export interface OptimizeResult {
  optimizedPrompt: string;
  durationMs: number;
}

export interface CompareItemResult {
  prompt: string;
  output: string;
  durationMs: number;
  error?: string;
}

export interface CompareResponse {
  input: string;
  results: CompareItemResult[];
}
