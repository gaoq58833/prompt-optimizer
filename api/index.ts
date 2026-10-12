import { createApp } from '../server/src/app';

// Vercel serverless function：处理所有 /api/* 请求
// 注意：不调用 initDb()，SQLite 在 serverless 环境不可用（db 层已做懒加载容错，
// 仅在访问 /api/prompts 时才尝试加载，失败不影响核心的优化/对比功能）
export default createApp();
