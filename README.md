# 提示词优化器 (Prompt Optimizer)

一个开源免费的提示词优化与对比工具。粘贴你的提示词，选择主流大模型，一键生成优化后的提示词，并并排对比优化前后的输出效果。

## 功能特性

- **双入口流程**：既可直接对比，也可先优化提示词再对比
- **智能提示词优化**：内置「提示词优化专家」系统提示词，选好模型后自动塞入上下文进行优化
- **效果并排对比**：2×2 布局展示「我的提示词 / 原来的输出 / 优化后的提示词 / 优化后的输出」
- **16 个主流大模型**：5 个国外 + 11 个国产，覆盖主流服务商，支持 OpenAI 与 Anthropic 两种接口格式
- **用户自填 API Key**：Key 仅保存在浏览器本地（localStorage），不上传到服务器，无需登录鉴权
- **一键复制**：优化结果支持一键复制到剪贴板
- **响应式设计**：适配桌面端与移动端

## 技术栈

- 前端：React + TypeScript + Vite
- 后端：Node.js + TypeScript + Express
- 存储：SQLite
- 工程：npm workspaces（monorepo）

## 内置模型

共 16 个主流大模型（5 个国外 + 11 个国产）。

### 国外模型

| 模型 | 服务商 | 接口格式 |
|------|--------|----------|
| GPT-6 Astra | OpenAI | OpenAI |
| Claude Opus 5.5 | Anthropic | Anthropic |
| Claude Sonnet 5.5 | Anthropic | Anthropic |
| Gemini 4 Argon | Google | OpenAI |
| Grok 4.7 | xAI | OpenAI |

### 国产模型

| 模型 | 服务商 | 接口格式 |
|------|--------|----------|
| DeepSeek-V4.1-Flash | 深度求索 | OpenAI |
| DeepSeek-V4-Pro | 深度求索 | OpenAI |
| 通义千问 Qwen3.8-Max | 阿里 | OpenAI |
| 智谱 GLM-5.3 | 智谱AI | OpenAI |
| Kimi K3 | 月之暗面 | OpenAI |
| 豆包 Doubao-Seed-2.1-Pro | 字节跳动 | OpenAI |
| 文心一言 ERNIE 5.0 | 百度 | OpenAI |
| 讯飞星火 4.0 Ultra | 科大讯飞 | OpenAI |
| 腾讯混元 Hy3 | 腾讯 | OpenAI |
| MiniMax-M3 | MiniMax | OpenAI |
| 阶跃星辰 Step-3.7 Flash | 阶跃星辰 | OpenAI |

## 快速开始

### 环境要求

- Node.js 18+

### 安装与运行

```bash
# 安装依赖（根目录一次性安装前后端）
npm install

# 同时启动前后端
npm run dev
```

启动后：

- 前端：http://localhost:5173
- 后端：http://localhost:3001

也可以分别启动：

```bash
npm run dev:server   # 仅启动后端
npm run dev:client   # 仅启动前端
```

### 配置 API Key

在网页上选择模型后，填入对应服务商的 API Key 即可（每个模型项都附带了「获取 Key」的官网链接）。Key 仅保存在浏览器本地，不会上传到服务器。

未填写 API Key 时，接口会返回 mock 结果，方便先体验完整交互流程。

## 项目结构

```
prompt-optimizer/
├── client/                 # 前端（React + Vite + TypeScript）
│   ├── src/
│   │   ├── App.tsx         # 三视图主界面
│   │   ├── App.css         # 样式（含移动端适配）
│   │   ├── api.ts          # API 封装
│   │   └── types.ts        # 类型定义
│   └── vite.config.ts      # 配置 /api 代理到后端
├── server/                 # 后端（Express + TypeScript）
│   ├── src/
│   │   ├── index.ts        # 入口
│   │   ├── app.ts          # 应用与路由注册
│   │   ├── models/         # 模型注册表
│   │   ├── routes/         # models / prompts / optimize / compare
│   │   ├── services/       # LLM 调用与优化器
│   │   └── db/             # SQLite
│   └── .env.example        # 环境变量示例
└── package.json            # npm workspaces
```

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| GET | `/api/models` | 获取模型列表 |
| GET | `/api/prompts` | 获取提示词列表 |
| GET | `/api/prompts/:id` | 获取单个提示词 |
| POST | `/api/prompts` | 创建提示词 |
| PUT | `/api/prompts/:id` | 更新提示词 |
| DELETE | `/api/prompts/:id` | 删除提示词 |
| POST | `/api/optimize` | 优化提示词 |
| POST | `/api/compare` | 对比多个提示词效果 |

### 优化提示词

```json
POST /api/optimize
{
  "prompt": "你的原始提示词",
  "modelId": "gpt-6-astra",
  "apiKey": "sk-..."
}
```

返回：

```json
{
  "optimizedPrompt": "优化后的提示词",
  "durationMs": 1234
}
```

### 对比提示词

```json
POST /api/compare
{
  "prompts": ["提示词A", "提示词B"],
  "input": "测试输入内容",
  "modelId": "gpt-6-astra",
  "apiKey": "sk-..."
}
```

## 开源协议

本项目开源免费使用，欢迎 Fork 与贡献。
