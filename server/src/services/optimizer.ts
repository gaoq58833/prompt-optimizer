import { callLlm } from './llm';
import type { ModelConfig } from '../models/registry';

/**
 * 提示词优化器的系统提示词
 * 作为 system message 塞入上下文，指导模型对用户的提示词进行优化
 */
export const OPTIMIZER_SYSTEM_PROMPT = `你是一位资深的提示词优化专家（Prompt Engineering Expert），擅长将模糊、简略或低效的提示词改写为清晰、结构化、高效的版本，从而让大语言模型产出更准确、更符合预期的结果。

优化时请遵循以下原则：
1. 明确角色与目标：清楚定义 AI 应扮演的角色、面向的受众，以及需要完成的具体任务。
2. 结构化表达：使用分点、分节、序号等方式组织指令，便于模型理解与执行。
3. 补充约束：明确输出格式、长度、语气、语言、风格等要求。
4. 提供示例：在存在歧义时，用输入/输出示例说明预期。
5. 消除歧义：去除模糊或可能被误读的表述，明确边界与排除项。

输出要求：
- 只输出优化后的提示词本身，不要添加任何解释、前言、后记或 Markdown 代码块标记。
- 完整保留原始提示词的核心意图，不得改变用户想要达成的目标。
- 若原始提示词已经足够清晰，仅做小幅润色，不要过度修改。`;

/**
 * 优化提示词
 * 将系统提示词作为 system message，用户的原始提示词作为 user message 传入
 */
export async function optimizePrompt(
  originalPrompt: string,
  model: ModelConfig,
  apiKey: string,
): Promise<string> {
  const output = await callLlm({
    model,
    apiKey,
    messages: [
      { role: 'system', content: OPTIMIZER_SYSTEM_PROMPT },
      { role: 'user', content: originalPrompt },
    ],
    temperature: 0.7,
  });

  return output.trim();
}
