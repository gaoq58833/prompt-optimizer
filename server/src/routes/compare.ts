import { Router } from 'express';
import { db } from '../db';
import { callLlm } from '../services/llm';
import type { CompareDto, ComparisonResult, Prompt } from '../types';

const router = Router();

/**
 * 对比多个提示词在同一输入下的效果
 * 请求体：{ input: string, promptIds: number[] }
 * 返回：每个提示词对应的模型输出 + 耗时
 */
router.post('/', async (req, res) => {
  const { input, promptIds } = req.body as CompareDto;

  if (!input?.trim()) {
    res.status(400).json({ error: 'input 不能为空' });
    return;
  }
  if (!Array.isArray(promptIds) || promptIds.length === 0) {
    res.status(400).json({ error: 'promptIds 不能为空数组' });
    return;
  }

  // 查出所有要对比的提示词
  const placeholders = promptIds.map(() => '?').join(',');
  const prompts = db
    .prepare(`SELECT * FROM prompts WHERE id IN (${placeholders})`)
    .all(...promptIds) as Prompt[];

  if (prompts.length === 0) {
    res.status(404).json({ error: '未找到对应的提示词' });
    return;
  }

  // 并发调用 LLM，对比每个提示词的输出
  const results: ComparisonResult[] = await Promise.all(
    prompts.map(async (p) => {
      const start = Date.now();
      try {
        const output = await callLlm([
          { role: 'system', content: p.content },
          { role: 'user', content: input },
        ]);
        return {
          promptId: p.id,
          promptTitle: p.title,
          output,
          durationMs: Date.now() - start,
        };
      } catch (err) {
        return {
          promptId: p.id,
          promptTitle: p.title,
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
