import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import promptsRouter from './routes/prompts';
import compareRouter from './routes/compare';
import optimizeRouter from './routes/optimize';
import modelsRouter from './routes/models';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/models', modelsRouter);
  app.use('/api/prompts', promptsRouter);
  app.use('/api/compare', compareRouter);
  app.use('/api/optimize', optimizeRouter);

  // 托管前端静态文件（部署时前端构建产物位于 server/public 目录）
  const publicDir = path.join(__dirname, '..', 'public');
  if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
    // SPA fallback：非 /api 路由返回 index.html
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        next();
        return;
      }
      res.sendFile(path.join(publicDir, 'index.html'));
    });
  }

  return app;
}
