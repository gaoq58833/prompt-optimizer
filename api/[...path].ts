import { createApp } from '../server/src/app';

// Vercel serverless 入口：catch-all 函数接管 /api/* 的全部请求
// 导出 Express app 作为 Node 请求处理器；不调用 initDb()，
// SQLite 在 serverless 环境由 db 层懒加载容错，失败不影响核心优化/对比功能
export default createApp();
