/** 提示词（数据库持久化用） */
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

/** 单步优化请求体 */
export interface OptimizeDto {
  /** 用户的原始提示词 */
  prompt: string;
  /** 选择的模型 id */
  modelId: string;
  /** 用户填入的 API Key */
  apiKey: string;
}

/** 单步优化响应 */
export interface OptimizeResult {
  /** 优化后的提示词 */
  optimizedPrompt: string;
  /** 优化耗时（ms） */
  durationMs: number;
}

/** 对比请求体 */
export interface CompareDto {
  /** 要对比的提示词文本列表 */
  prompts: string[];
  /** 测试输入，作为 user message */
  input: string;
  /** 选择的模型 id */
  modelId: string;
  /** 用户填入的 API Key */
  apiKey: string;
}

/** 单个提示词的对比结果 */
export interface CompareItemResult {
  /** 提示词文本 */
  prompt: string;
  /** 模型输出 */
  output: string;
  /** 耗时（ms） */
  durationMs: number;
  error?: string;
}
