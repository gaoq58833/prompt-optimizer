/**
 * LLM 调用服务
 * 兼容 OpenAI 接口格式（可通过环境变量切换到任意兼容服务，如 DeepSeek、通义千问等）
 *
 * 环境变量：
 *   LLM_API_KEY   - API 密钥（必填，否则使用 mock 模式）
 *   LLM_BASE_URL  - API 地址，默认 https://api.openai.com/v1
 *   LLM_MODEL     - 模型名称，默认 gpt-4o-mini
 */

const API_KEY = process.env.LLM_API_KEY;
const BASE_URL = process.env.LLM_BASE_URL || 'https://api.openai.com/v1';
const MODEL = process.env.LLM_MODEL || 'gpt-4o-mini';

export interface LlmMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/** 调用 LLM，返回模型输出文本 */
export async function callLlm(messages: LlmMessage[]): Promise<string> {
  if (!API_KEY) {
    // mock 模式：未配置 API Key 时返回占位结果，方便本地开发
    await new Promise((r) => setTimeout(r, 300));
    return `[Mock 响应] 未配置 LLM_API_KEY，这里是模型针对以下输入的模拟输出：\n\n${messages
      .map((m) => `[${m.role}] ${m.content}`)
      .join('\n')}`;
  }

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`LLM 请求失败 (${res.status}): ${text}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content ?? '';
}
