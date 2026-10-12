import { Router } from 'express';
import { getDb } from '../db';
import type { Prompt, CreatePromptDto } from '../types';

const router = Router();

/** 获取所有提示词 */
router.get('/', (_req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM prompts ORDER BY created_at DESC').all() as Prompt[];
  res.json(rows);
});

/** 获取单个提示词 */
router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM prompts WHERE id = ?').get(Number(req.params.id)) as
    | Prompt
    | undefined;
  if (!row) {
    res.status(404).json({ error: '提示词不存在' });
    return;
  }
  res.json(row);
});

/** 创建提示词 */
router.post('/', (req, res) => {
  const db = getDb();
  const { title, content } = req.body as CreatePromptDto;
  if (!title?.trim() || !content?.trim()) {
    res.status(400).json({ error: 'title 和 content 不能为空' });
    return;
  }
  const stmt = db.prepare('INSERT INTO prompts (title, content) VALUES (?, ?)');
  const info = stmt.run(title.trim(), content.trim());
  const row = db.prepare('SELECT * FROM prompts WHERE id = ?').get(info.lastInsertRowid) as Prompt;
  res.status(201).json(row);
});

/** 更新提示词 */
router.put('/:id', (req, res) => {
  const db = getDb();
  const { title, content } = req.body as Partial<CreatePromptDto>;
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM prompts WHERE id = ?').get(id) as Prompt | undefined;
  if (!existing) {
    res.status(404).json({ error: '提示词不存在' });
    return;
  }
  db.prepare('UPDATE prompts SET title = ?, content = ? WHERE id = ?').run(
    title?.trim() ?? existing.title,
    content?.trim() ?? existing.content,
    id,
  );
  const row = db.prepare('SELECT * FROM prompts WHERE id = ?').get(id) as Prompt;
  res.json(row);
});

/** 删除提示词 */
router.delete('/:id', (req, res) => {
  const db = getDb();
  const info = db.prepare('DELETE FROM prompts WHERE id = ?').run(Number(req.params.id));
  if (info.changes === 0) {
    res.status(404).json({ error: '提示词不存在' });
    return;
  }
  res.status(204).end();
});

export default router;
