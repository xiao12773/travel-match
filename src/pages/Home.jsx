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
      <p style={{ fontSize: 15, color: '#8B8578', lineHeight: 1.9, marginBottom: 36 }}>
        你们说好了要一起去，目的地都选好了，群也建了。<br /><br />
        但有些话还没聊。谁来做攻略？钱怎么结算？你喜欢早起赶第一班缆车，对方可能习惯睡到自然醒。你觉得旅行就该好好吃一顿，对方可能随便找个地方填饱肚子就走。<br /><br />
        这些事聊起来总有点尬——像在审问对方，又怕显得自己太计较。于是就这么带着这些问题出发了。直到旅途中某一刻，两个人都沉默着，谁也不说话。那时候机票退不了，酒店退不了，只能硬撑着走完剩下的行程。<br /><br />
        花十分钟做完这个测试。你会拿到自己的旅行人格——你是什么节奏、把钱花在哪里、需不需要独处时间充电。把链接发给对方，等他也测完，你们会看到一份报告：哪些地方你们天然合拍，哪些地方值得出发前坐下来聊十分钟。<br /><br />
        把该说的话说完，然后放心出发。
      </p>
      <p style={{ fontSize: 12, color: '#B0A89E', marginBottom: 12, letterSpacing: 0.5 }}>约28题 · 发现你的旅行人格 · 可邀请对方匹配</p>
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
