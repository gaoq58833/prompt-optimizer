/** 提示词 */
export interface Prompt {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

/** 创建提示词的请求体 */
export interface CreatePromptDto {
  title: string;
  content: string;
}

/** 单次对比结果 */
export interface ComparisonResult {
  promptId: number;
  promptTitle: string;
  output: string;
  durationMs: number;
  error?: string;
}

/** 对比请求体 */
export interface CompareDto {
  /** 用户输入，作为 user message */
  input: string;
  /** 要对比的提示词 ID 列表 */
  promptIds: number[];
}
