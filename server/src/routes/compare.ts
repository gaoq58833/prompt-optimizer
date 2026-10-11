import { Router } from 'express';
import { getModel } from '../models/registry';
import { callLlm } from '../services/llm';
import type { CompareDto, CompareItemResult } from '../types';

const router = Router();

/**
 * 对比多个提示词在同一输入下的效果
 * 请求体：{ prompts: string[], input, modelId, apiKey }
 * 返回：{ input, results: [{ prompt, output, durationMs, error? }] }
 */
router.post('/', async (req, res) => {
  const { prompts, input, modelId, apiKey } = req.body as CompareDto;

  if (!input?.trim()) {
    res.status(400).json({ error: 'input 不能为空' });
    return;
  }
  if (!Array.isArray(prompts) || prompts.length === 0) {
    res.status(400).json({ error: 'prompts 不能为空数组' });
    return;
  }

  const model = getModel(modelId || '');
  if (!model) {
    res.status(400).json({ error: '请选择有效的模型' });
    return;
  }

  // 并发调用 LLM，对比每个提示词的输出
  const results: CompareItemResult[] = await Promise.all(
    prompts.map(async (p) => {
      const start = Date.now();
      try {
        const output = await callLlm({
          model,
          apiKey,
          messages: [
            { role: 'system', content: p },
            { role: 'user', content: input },
          ],
        });
        return { prompt: p, output, durationMs: Date.now() - start };
      } catch (err) {
        return {
          prompt: p,
          output: '',
          durationMs: Date.now() - start,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    }),
  );

  res.json({ input, results });
});

export default router;
