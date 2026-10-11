import express from 'express';
import cors from 'cors';
import promptsRouter from './routes/prompts';
import compareRouter from './routes/compare';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/prompts', promptsRouter);
  app.use('/api/compare', compareRouter);

  return app;
}
