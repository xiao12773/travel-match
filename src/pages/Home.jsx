import { useState } from 'react';
import HeroIllustration from '../components/HeroIllustration';
import { decode } from '../utils/quiz';

export default function Home({ onStart, onRestore }) {
  const [showRestore, setShowRestore] = useState(false);
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');

  function tryRestore() {
    const r = decode(code.trim());
    if (!r) {
      setErr('备份码无效，请检查后重试');
      return;
    }
    onRestore(r);
  }

  return (
    <div className="fade-up" style={{ paddingTop: 48 }}>
      <div style={{ marginBottom: 32, borderRadius: 20, overflow: 'hidden' }}>
        <HeroIllustration />
      </div>
      <p style={{ fontSize: 12, color: '#8B8578', letterSpacing: 3, marginBottom: 14 }}>TRAVEL MATCH</p>
      <h1 style={{ fontFamily: 'DM Serif Display,serif', fontSize: 36, lineHeight: 1.25, marginBottom: 18 }}>
        出发之前，<br />先认识一下彼此
      </h1>
      <p style={{ fontSize: 15, color: '#8B8578', lineHeight: 1.8, marginBottom: 40 }}>
        和一个人出门，其实比想象中更需要默契。节奏、花销、拍照、分账……细节才是旅途中真正的考验。花几分钟发现你的旅行风格，再决定要不要一起出发。
      </p>
      <button className="btn-primary" onClick={onStart}>开始测试 →</button>
      <div style={{ marginTop: 14 }}>
        {!showRestore ? (
          <button className="btn-ghost" onClick={() => setShowRestore(true)}>已有旅行人格，粘贴备份码恢复</button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <textarea className="text-input" rows={3} placeholder="粘贴你的备份码…" value={code} onChange={(e) => { setCode(e.target.value); setErr(''); }} />
            {err && <p style={{ fontSize: 13, color: '#C0392B' }}>{err}</p>}
            <button className="btn-primary" onClick={tryRestore} disabled={!code.trim()}>恢复我的旅行人格</button>
            <button className="btn-ghost" onClick={() => setShowRestore(false)}>取消</button>
          </div>
        )}
      </div>
      <p style={{ marginTop: 36, fontSize: 12, color: '#D4CFC6', textAlign: 'center', lineHeight: 1.6 }}>数据仅存储在你的设备上，不会上传至任何服务器</p>
    </div>
  );
}
