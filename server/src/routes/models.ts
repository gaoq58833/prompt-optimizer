import { Router } from 'express';
import { MODELS } from '../models/registry';

const router = Router();

/** 获取所有支持的模型列表 */
router.get('/', (_req, res) => {
  res.json(MODELS);
});

export default router;
