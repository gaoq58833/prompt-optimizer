import { Router } from 'express';
import { getModel } from '../models/registry';
import { optimizePrompt } from '../services/optimizer';
import type { OptimizeDto } from '../types';

const router = Router();

/**
 * 单步优化提示词
 * 请求体：{ prompt, modelId, apiKey }
 * 返回：{ optimizedPrompt, durationMs }
 */
router.post('/', async (req, res) => {
  const { prompt, modelId, apiKey } = req.body as OptimizeDto;

  if (!prompt?.trim()) {
    res.status(400).json({ error: 'prompt 不能为空' });
    return;
  }
  if (!modelId) {
    res.status(400).json({ error: '请选择模型' });
    return;
  }

  const model = getModel(modelId);
  if (!model) {
    res.status(400).json({ error: '未知的模型' });
    return;
  }

  try {
    const start = Date.now();
    const optimizedPrompt = await optimizePrompt(prompt.trim(), model, apiKey);
    res.json({ optimizedPrompt, durationMs: Date.now() - start });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : '优化失败',
    });
  }
});

export default router;
