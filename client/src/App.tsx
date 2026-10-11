import { useEffect, useState } from 'react';
import { api } from './api';
import type { Prompt, CompareResponse } from './types';
import './App.css';

function App() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompareResponse | null>(null);
  const [error, setError] = useState('');

  // 新建提示词表单
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const loadPrompts = async () => {
    const list = await api.listPrompts();
    setPrompts(list);
  };

  useEffect(() => {
    loadPrompts();
  }, []);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    await api.createPrompt({ title: newTitle.trim(), content: newContent.trim() });
    setNewTitle('');
    setNewContent('');
    loadPrompts();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除该提示词？')) return;
    await api.deletePrompt(id);
    setSelectedIds((prev) => prev.filter((x) => x !== id));
    loadPrompts();
  };

  const handleCompare = async () => {
    if (!input.trim() || selectedIds.length === 0) {
      setError('请输入测试内容并至少选择一个提示词');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await api.compare(input.trim(), selectedIds);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : '对比失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>提示词优化器</h1>
        <p className="subtitle">对比不同提示词在同一输入下的效果差异</p>
      </header>

      <div className="layout">
        {/* 左侧：提示词管理 */}
        <aside className="sidebar">
          <h2>提示词列表</h2>
          <form className="create-form" onSubmit={handleCreate}>
            <input
              placeholder="提示词标题"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <textarea
              placeholder="提示词内容（作为 system message）"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={3}
            />
            <button type="submit">添加提示词</button>
          </form>

          <ul className="prompt-list">
            {prompts.map((p) => (
              <li
                key={p.id}
                className={`prompt-item ${selectedIds.includes(p.id) ? 'selected' : ''}`}
              >
                <label className="prompt-label">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(p.id)}
                    onChange={() => toggleSelect(p.id)}
                  />
                  <div className="prompt-info">
                    <div className="prompt-title">{p.title}</div>
                    <div className="prompt-content">{p.content}</div>
                  </div>
                </label>
                <button className="del-btn" onClick={() => handleDelete(p.id)}>
                  删除
                </button>
              </li>
            ))}
            {prompts.length === 0 && <li className="empty">暂无提示词</li>}
          </ul>
        </aside>

        {/* 右侧：对比区 */}
        <main className="main">
          <div className="input-section">
            <h2>测试输入</h2>
            <textarea
              className="input-box"
              placeholder="输入要测试的内容（作为 user message）"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={5}
            />
            <button
              className="compare-btn"
              onClick={handleCompare}
              disabled={loading || selectedIds.length === 0}
            >
              {loading ? '对比中...' : `开始对比（已选 ${selectedIds.length} 个）`}
            </button>
            {error && <p className="error">{error}</p>}
          </div>

          {result && (
            <div className="results">
              <h2>对比结果</h2>
              <div className="result-grid">
                {result.results.map((r) => (
                  <div key={r.promptId} className="result-card">
                    <div className="result-header">
                      <span className="result-title">{r.promptTitle}</span>
                      <span className="result-duration">{r.durationMs} ms</span>
                    </div>
                    <pre className="result-output">
                      {r.error ? `❌ ${r.error}` : r.output}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
