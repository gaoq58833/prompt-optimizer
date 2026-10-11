/**
 * 主流大模型注册表
 * 用户选择模型后，自行填入对应服务商的 API Key
 */

export type LlmFormat = 'openai' | 'anthropic';

export interface ModelConfig {
  /** 前端下拉选项的唯一标识 */
  id: string;
  /** 展示名称 */
  name: string;
  /** 服务商 */
  provider: string;
  /** API 基础地址 */
  baseUrl: string;
  /** 实际调用时的模型 ID */
  modelId: string;
  /** 接口格式 */
  format: LlmFormat;
  /** 获取 API Key 的官网地址（前端提示用） */
  keyUrl: string;
}

export const MODELS: ModelConfig[] = [
  {
    id: 'gpt-6-astra',
    name: 'GPT-6 Astra',
    provider: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    modelId: 'gpt-6-astra',
    format: 'openai',
    keyUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'claude-opus-5-5',
    name: 'Claude Opus 5.5',
    provider: 'Anthropic',
    baseUrl: 'https://api.anthropic.com',
    modelId: 'claude-opus-5-5',
    format: 'anthropic',
    keyUrl: 'https://console.anthropic.com/settings/keys',
  },
  {
    id: 'claude-sonnet-5-5',
    name: 'Claude Sonnet 5.5',
    provider: 'Anthropic',
    baseUrl: 'https://api.anthropic.com',
    modelId: 'claude-sonnet-5-5',
    format: 'anthropic',
    keyUrl: 'https://console.anthropic.com/settings/keys',
  },
  {
    id: 'gemini-4-argon',
    name: 'Gemini 4 Argon',
    provider: 'Google',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    modelId: 'gemini-4-argon',
    format: 'openai',
    keyUrl: 'https://aistudio.google.com/apikey',
  },
  {
    id: 'grok-4.7',
    name: 'Grok 4.7',
    provider: 'xAI',
    baseUrl: 'https://api.x.ai/v1',
    modelId: 'grok-4.7',
    format: 'openai',
    keyUrl: 'https://console.x.ai/',
  },
  {
    id: 'deepseek-v4.1-flash',
    name: 'DeepSeek-V4.1-Flash',
    provider: '深度求索',
    baseUrl: 'https://api.deepseek.com/v1',
    modelId: 'deepseek-v4.1-flash',
    format: 'openai',
    keyUrl: 'https://platform.deepseek.com/api_keys',
  },
  {
    id: 'qwen3.8-max',
    name: '通义千问 Qwen3.8-Max',
    provider: '阿里',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    modelId: 'qwen3.8-max',
    format: 'openai',
    keyUrl: 'https://dashscope.console.aliyun.com/apiKey',
  },
  {
    id: 'glm-5.3',
    name: '智谱 GLM-5.3',
    provider: '智谱AI',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    modelId: 'glm-5.3',
    format: 'openai',
    keyUrl: 'https://open.bigmodel.cn/usercenter/apikeys',
  },
  {
    id: 'kimi-k3',
    name: 'Kimi K3',
    provider: '月之暗面',
    baseUrl: 'https://api.moonshot.cn/v1',
    modelId: 'kimi-k3',
    format: 'openai',
    keyUrl: 'https://platform.moonshot.cn/console/api-keys',
  },
  {
    id: 'doubao-seed-2.1-pro',
    name: '豆包 Doubao-Seed-2.1-Pro',
    provider: '字节跳动',
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    modelId: 'doubao-seed-2.1-pro',
    format: 'openai',
    keyUrl: 'https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey',
  },
];

/** 根据 id 获取模型配置 */
export function getModel(id: string): ModelConfig | undefined {
  return MODELS.find((m) => m.id === id);
}
