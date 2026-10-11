import { useEffect, useState } from 'react';
import { api } from './api';
import type { CompareResponse, ModelConfig } from './types';
import './App.css';

type View = 'home' | 'optimize' | 'compare';

function App() {
  const [view, setView] = useState<View>('home');

  // 模型与配置
  const [models, setModels] = useState<ModelConfig[]>([]);
  const [selectedModelId, setSelectedModelId] = useState('');
  const [apiKey, setApiKey] = useState('');

  // 提示词与测试输入
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [input, setInput] = useState('');

  // 状态
  const [loading, setLoading] = useState(false);
  const [compareResult, setCompareResult] = useState<CompareResponse | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.listModels().then((list) => {
      setModels(list);
      if (list.length > 0) setSelectedModelId(list[0].id);
    });
    const saved = localStorage.getItem('llm_api_key');
    if (saved) setApiKey(saved);
  }, []);

  const selectedModel = models.find((m) => m.id === selectedModelId);

  const handleApiKeyChange = (val: string) => {
    setApiKey(val);
    localStorage.setItem('llm_api_key', val);
  };

  const goCompare = () => {
    setCompareResult(null);
    setError('');
    setView('compare');
  };

  const goOptimize = () => {
    setError('');
    setView('optimize');
  };

  // 优化页：优化提示词，完成后自动进入对比页
  const handleOptimize = async () => {
    if (!originalPrompt.trim()) {
      setError('请先输入要优化的提示词');
      return;
    }
    if (!selectedModelId) {
      setError('请选择模型');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.optimize({
        prompt: originalPrompt.trim(),
        modelId: selectedModelId,
        apiKey: apiKey.trim(),
      });
      setOptimizedPrompt(res.optimizedPrompt);
      setCompareResult(null);
      setView('compare'); // 自动进入对比页
    } catch (err) {
      setError(err instanceof Error ? err.message : '优化失败');
    } finally {
      setLoading(false);
    }
  };

  // 对比页：对比原提示词与优化后提示词的输出
  const handleCompare = async () => {
    if (!originalPrompt.trim()) {
      setError('请先输入提示词');
      return;
    }
    if (!input.trim()) {
      setError('请输入测试内容');
      return;
    }
    if (!selectedModelId) {
      setError('请选择模型');
      return;
    }
    setError('');
    setLoading(true);
    setCompareResult(null);
    try {
      // 若还没有优化后的提示词（直接对比进入），先自动优化
      let opt = optimizedPrompt;
      if (!opt.trim()) {
        const r = await api.optimize({
          prompt: originalPrompt.trim(),
          modelId: selectedModelId,
          apiKey: apiKey.trim(),
        });
        opt = r.optimizedPrompt;
        setOptimizedPrompt(opt);
      }

      const res = await api.compare({
        prompts: [originalPrompt.trim(), opt],
        input: input.trim(),
        modelId: selectedModelId,
        apiKey: apiKey.trim(),
      });
      setCompareResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : '对比失败');
    } finally {
      setLoading(false);
    }
  };

  // 复制优化后的提示词
  const handleCopy = async () => {
    if (!optimizedPrompt) return;
    try {
      await navigator.clipboard.writeText(optimizedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError('复制失败，请手动复制');
    }
  };

  const configBar = (
    <section className="config-bar">
      <div className="config-item">
        <label>模型</label>
        <select
          value={selectedModelId}
          onChange={(e) => setSelectedModelId(e.target.value)}
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.provider} · {m.name}
            </option>
          ))}
        </select>
      </div>
      <div className="config-item">
        <label>
          API Key
          {selectedModel && (
            <a
              href={selectedModel.keyUrl}
              target="_blank"
              rel="noreferrer"
              className="key-hint"
            >
              获取 Key
            </a>
          )}
        </label>
        <input
          type="password"
          placeholder="填入对应服务商的 API Key（留空则用 mock 模式）"
          value={apiKey}
          onChange={(e) => handleApiKeyChange(e.target.value)}
        />
      </div>
    </section>
  );

  // 首页
  if (view === 'home') {
    return (
      <div className="app">
        <header className="home-header">
          <h1>提示词优化器</h1>
          <p className="subtitle">对比不同提示词的效果差异，让 AI 输出更符合预期</p>
        </header>

        <div className="entry-cards">
          <button className="entry-card" onClick={goCompare}>
            <span className="entry-icon">⚡</span>
            <h2>直接对比</h2>
            <p>粘贴提示词，直接对比不同提示词的输出效果</p>
          </button>
          <button className="entry-card" onClick={goOptimize}>
            <span className="entry-icon">✨</span>
            <h2>先优化提示词</h2>
            <p>先让 AI 优化你的提示词，再对比优化前后的差异</p>
          </button>
        </div>
      </div>
    );
  }

  // 优化页
  if (view === 'optimize') {
    return (
      <div className="app">
        <div className="topbar">
          <button className="back-btn" onClick={() => setView('home')}>
            ← 返回
          </button>
          <h1>优化提示词</h1>
        </div>

        {configBar}

        <section className="prompt-section">
          <label className="section-label">原始提示词</label>
          <textarea
            className="prompt-box"
            placeholder="在这里粘贴你的原始提示词..."
            value={originalPrompt}
            onChange={(e) => setOriginalPrompt(e.target.value)}
          />
        </section>

        <div className="action-bar">
          <button className="primary-btn" onClick={handleOptimize} disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? '优化中...' : '优化提示词'}
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    );
  }

  // 对比页
  const originalResult = compareResult?.results[0];
  const optimizedResult = compareResult?.results[1];

  return (
    <div className="app">
      <div className="topbar">
        <button className="back-btn" onClick={() => setView('home')}>
          ← 返回
        </button>
        <h1>对比效果</h1>
      </div>

      {configBar}

      <section className="input-section">
        <label className="section-label">测试输入（作为 user message，用于检验提示词效果）</label>
        <textarea
          className="input-box"
          placeholder="输入一段测试内容，例如：帮我写一段关于春天的短文"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
        />
      </section>

      <section className="grid-2x2">
        <div className="cell">
          <div className="cell-header">
            <span className="cell-title">我的提示词</span>
          </div>
          <textarea
            className="cell-textarea"
            placeholder="在这里输入你的原始提示词..."
            value={originalPrompt}
            onChange={(e) => setOriginalPrompt(e.target.value)}
          />
        </div>

        <div className="cell">
          <div className="cell-header">
            <span className="cell-title">原来的输出</span>
            {originalResult && (
              <span className="cell-meta">{originalResult.durationMs} ms</span>
            )}
          </div>
          <div className="cell-output">
            {loading && !originalResult
              ? <span className="placeholder">生成中...</span>
              : originalResult?.error
                ? <span className="error-text">❌ {originalResult.error}</span>
                : originalResult?.output || <span className="placeholder">点击「开始对比」查看输出</span>}
          </div>
        </div>

        <div className="cell">
          <div className="cell-header">
            <span className="cell-title highlight">优化后的提示词</span>
            {optimizedPrompt && (
              <button className="copy-btn" onClick={handleCopy}>
                {copied ? '已复制' : '复制'}
              </button>
            )}
          </div>
          <div className="cell-output">
            {optimizedPrompt || <span className="placeholder">优化后的提示词将显示在这里</span>}
          </div>
        </div>

        <div className="cell">
          <div className="cell-header">
            <span className="cell-title highlight">优化后的输出</span>
            {optimizedResult && (
              <span className="cell-meta">{optimizedResult.durationMs} ms</span>
            )}
          </div>
          <div className="cell-output">
            {loading && !optimizedResult
              ? <span className="placeholder">生成中...</span>
              : optimizedResult?.error
                ? <span className="error-text">❌ {optimizedResult.error}</span>
                : optimizedResult?.output || <span className="placeholder">点击「开始对比」查看输出</span>}
          </div>
        </div>
      </section>

      <div className="action-bar">
        <button className="primary-btn" onClick={handleCompare} disabled={loading}>
          {loading && <span className="spinner" />}
          {loading ? '对比中...' : '开始对比'}
        </button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default App;
