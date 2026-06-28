import { useState } from 'react';
import RankQ from '../components/RankQ';
import { buildQuizList } from '../utils/quiz';

export default function Quiz({ onDone, onHome }) {
  const [list] = useState(buildQuizList);
  const [idx, setIdx] = useState(0);
  const [ans, setAns] = useState({});
  const [confirm, setConfirm] = useState(false);

  const q = list[idx];
  const total = list.length;
  const cur = ans[q.id];
  const canGo = q.type === 'text' ? cur !== undefined && cur.trim() !== '' : cur !== undefined;

  function next() {
    if (idx < total - 1) setIdx((i) => i + 1);
    else onDone(ans);
  }
  function setAnswer(v) {
    setAns((a) => ({ ...a, [q.id]: v }));
  }

  return (
    <div style={{ paddingTop: 40 }}>
      {/* 退出确认弹窗 */}
      {confirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '0 24px' }}>
          <div style={{ background: '#F5F0E8', borderRadius: 20, padding: '28px 24px', width: '100%', maxWidth: 360 }}>
            <p style={{ fontFamily: 'DM Serif Display,serif', fontSize: 20, marginBottom: 10 }}>退出测试？</p>
            <p style={{ fontSize: 14, color: '#8B8578', lineHeight: 1.7, marginBottom: 24 }}>已填写的内容不会保存，下次需要重新开始。</p>
            <button className="btn-primary" style={{ marginBottom: 10 }} onClick={() => { setConfirm(false); onHome(); }}>确认退出</button>
            <button className="btn-ghost" onClick={() => setConfirm(false)}>继续答题</button>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <button onClick={() => idx > 0 && setIdx((i) => i - 1)} style={{ background: 'none', border: 'none', cursor: idx === 0 ? 'default' : 'pointer', color: '#8B8578', fontSize: 22, padding: 4, opacity: idx === 0 ? 0.3 : 1 }}>←</button>
        <span style={{ fontSize: 13, color: '#8B8578' }}>{idx + 1} / {total}</span>
        <button onClick={() => setConfirm(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B8578', fontSize: 13, padding: 4 }}>退出</button>
      </div>
      <div className="progress-bar" style={{ marginBottom: 32 }}>
        <div className="progress-fill" style={{ width: `${(idx / total) * 100}%` }} />
      </div>
      <div className="card fade-up" key={q.id} style={{ padding: '28px 24px', marginBottom: 20 }}>
        {q.type === 'attention' && (
          <span style={{ display: 'inline-block', background: '#C4956A', color: '#fff', fontSize: 11, borderRadius: 100, padding: '3px 10px', marginBottom: 12 }}>注意</span>
        )}
        <p style={{ fontSize: q.type === 'scene' ? 14 : 16, lineHeight: 1.7, fontWeight: q.type === 'scene' ? 400 : 500 }}>{q.text}</p>
        {q.sub && <p style={{ fontSize: 12, color: '#8B8578', marginTop: 8 }}>{q.sub}</p>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {q.type === 'rank' ? (
          <RankQ q={q} value={cur} onChange={setAnswer} />
        ) : q.type === 'text' ? (
          <textarea className="text-input" rows={3} placeholder={q.placeholder} value={cur || ''} onChange={(e) => setAnswer(e.target.value)} />
        ) : (
          q.options.map((o) => (
            <button key={o.value} className={`option-btn ${cur === o.value ? 'selected' : ''}`} onClick={() => setAnswer(o.value)}>{o.label}</button>
          ))
        )}
      </div>
      <button className="btn-primary" onClick={next} disabled={!canGo}>
        {idx === total - 1 ? '查看我的旅行人格 →' : '下一题'}
      </button>
    </div>
  );
}
