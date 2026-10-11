import type { ModelConfig } from '../models/registry';

export interface LlmMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CallLlmOptions {
  model: ModelConfig;
  apiKey: string;
  messages: LlmMessage[];
  temperature?: number;
}

/**
 * 调用 LLM，返回模型输出文本
 * 支持 OpenAI 兼容格式 和 Anthropic 格式
 */
export async function callLlm(options: CallLlmOptions): Promise<string> {
  const { model, apiKey, messages, temperature = 0.7 } = options;

  if (!apiKey) {
    // mock 模式：未提供 API Key 时返回占位结果
    await new Promise((r) => setTimeout(r, 300));
    return `[Mock 响应] 未配置 API Key，以下是模拟输出：\n\n${messages
      .map((m) => `[${m.role}] ${m.content}`)
      .join('\n')}`;
  }

  if (model.format === 'anthropic') {
    return callAnthropic(model, apiKey, messages, temperature);
  }
  return callOpenAi(model, apiKey, messages, temperature);
}

/** OpenAI 兼容格式调用 */
async function callOpenAi(
  model: ModelConfig,
  apiKey: string,
  messages: LlmMessage[],
  temperature: number,
): Promise<string> {
  const res = await fetch(`${model.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model.modelId,
      messages,
      temperature,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`LLM 请求失败 (${model.name} ${res.status}): ${text}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content ?? '';
}

/** Anthropic 格式调用 */
async function callAnthropic(
  model: ModelConfig,
  apiKey: string,
  messages: LlmMessage[],
  temperature: number,
): Promise<string> {
  // Anthropic 不支持 system role 在 messages 中，需拆到 system 字段
  const systemMsg = messages.find((m) => m.role === 'system');
  const nonSystem = messages.filter((m) => m.role !== 'system');

  const body: Record<string, unknown> = {
    model: model.modelId,
    messages: nonSystem,
    max_tokens: 4096,
    temperature,
  };
  if (systemMsg) {
    body.system = systemMsg.content;
  }

  const res = await fetch(`${model.baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`LLM 请求失败 (${model.name} ${res.status}): ${text}`);
  }

  const data = (await res.json()) as {
    content?: { type: string; text?: string }[];
  };
  return data.content?.find((c) => c.type === 'text')?.text ?? '';
}
