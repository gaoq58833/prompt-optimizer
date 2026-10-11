export interface Prompt {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export interface ComparisonResult {
  promptId: number;
  promptTitle: string;
  output: string;
  durationMs: number;
  error?: string;
}

export interface CompareResponse {
  input: string;
  results: ComparisonResult[];
}
