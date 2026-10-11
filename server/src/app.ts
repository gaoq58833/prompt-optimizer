import express from 'express';
import cors from 'cors';
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

  return app;
}
