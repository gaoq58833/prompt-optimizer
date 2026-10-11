import { createApp } from './app';
import { initDb } from './db';

const PORT = Number(process.env.PORT) || 3001;

initDb();

const app = createApp();
app.listen(PORT, () => {
  console.log(`🚀 服务已启动: http://localhost:${PORT}`);
});
