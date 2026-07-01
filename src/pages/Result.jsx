import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radar, RadarExplain } from '../components/Radar';
import { calcPersona, checkAttention, encode } from '../utils/quiz';
import { createRoom } from '../utils/room';
import { supabaseEnabled } from '../lib/supabase';

export default function Result({ answers, onReset }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [matchLink, setMatchLink] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const [matchErr, setMatchErr] = useState('');
  const persona = calcPersona(answers);
  const reliable = checkAttention(answers);
  const code = encode(answers);
  const restriction = answers['T19'];
  const travelValue = answers['T26'];
  const dealbreaker = answers['T28'];

  const VALUE_LABELS = {
    checkin: '打卡了想去的地方，有照片和回忆',
    food: '吃到了真正满意的东西',
    relax: '有几个真正放松下来的瞬间',
    understand: '对这个地方有了真实的了解和感受',
  };
  const valueLabelText = travelValue ? (VALUE_LABELS[travelValue] || travelValue) : null;

  async function startMatch() {
    setCreating(true);
    setMatchErr('');
    try {
      const roomId = await createRoom(answers);
      const link = `${window.location.origin}/room/${roomId}`;
      setMatchLink(link);
      navigate(`/room/${roomId}`);
    } catch {
      setMatchErr('创建匹配失败，请稍后再试');
    } finally {
      setCreating(false);
    }
  }

  function copyMatchLink() {
    navigator.clipboard?.writeText(matchLink).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  }

  function copy() {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const cards = [
    { label: '行程风格', data: persona.pace },
    { label: '消费倾向', data: persona.spending },
    { label: '社交风格', data: persona.social },
  ];

  return (
    <div className="fade-up" style={{ paddingTop: 48 }}>
      <p style={{ fontSize: 12, color: '#8B8578', letterSpacing: 3, marginBottom: 14 }}>你的旅行人格</p>
      <h2 style={{ fontFamily: 'DM Serif Display,serif', fontSize: 26, lineHeight: 1.4, marginBottom: 6 }}>
        {persona.pace.name} · {persona.spending.name} · {persona.social.name}
      </h2>
      {!reliable && (
        <div style={{ background: '#FFF8E1', border: '1px solid #FFE082', borderRadius: 10, padding: '10px 14px', marginTop: 14, fontSize: 13, color: '#7D6608' }}>
          部分注意力题未通过，结果仅供参考
        </div>
      )}

      {/* 三张人格卡片 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 28 }}>
        {cards.map(({ label, data }) => (
          <div key={label} className="card" style={{ padding: '24px 22px' }}>
            <p style={{ fontSize: 11, color: '#8B8578', marginBottom: 10, letterSpacing: 1 }}>{label}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 28 }}>{data.emoji}</span>
              <span style={{ fontFamily: 'DM Serif Display,serif', fontSize: 22 }}>{data.name}</span>
            </div>
            <p style={{ fontSize: 14, color: '#6B6560', lineHeight: 1.8 }}>{data.desc}</p>
          </div>
        ))}
      </div>

      {/* 雷达图 + 解读 */}
      <div className="card" style={{ marginTop: 14, padding: '24px 16px 20px' }}>
        <p style={{ fontSize: 11, color: '#8B8578', letterSpacing: 1, textAlign: 'center', marginBottom: 4 }}>旅行风格图谱</p>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8, paddingBottom: 8 }}>
          <Radar answers={answers} />
        </div>
        <div style={{ borderTop: '1px solid #E4DED6', paddingTop: 16, marginTop: 4, padding: '16px 6px 0' }}>
          <p style={{ fontSize: 11, color: '#8B8578', letterSpacing: 1, marginBottom: 14 }}>各维度解读</p>
          <RadarExplain answers={answers} />
        </div>
      </div>

      {/* 旅行价值观 */}
      {valueLabelText && (
        <div className="card" style={{ marginTop: 14, padding: '20px 22px' }}>
          <p style={{ fontSize: 11, color: '#8B8578', letterSpacing: 1, marginBottom: 8 }}>旅行成功的标准</p>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>{valueLabelText}</p>
        </div>
      )}

      {/* 忌口 */}
      {restriction && restriction.trim() !== '无' && restriction.trim() !== '' && (
        <div className="card" style={{ marginTop: 14, padding: '20px 22px' }}>
          <p style={{ fontSize: 11, color: '#8B8578', letterSpacing: 1, marginBottom: 8 }}>饮食限制</p>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>{restriction}</p>
        </div>
      )}

      {/* 双人匹配 */}
      {supabaseEnabled && (
        <div className="card" style={{ marginTop: 28, padding: '22px 22px' }}>
          <p style={{ fontSize: 11, color: '#8B8578', letterSpacing: 1, marginBottom: 8 }}>和同伴一起测</p>
          <p style={{ fontSize: 14, color: '#6B6560', lineHeight: 1.7, marginBottom: 16 }}>
            发起一次匹配，把链接发给同伴。双方都完成测试后，才能解锁匹配报告。
          </p>
          {!matchLink ? (
            <button className="btn-primary" onClick={startMatch} disabled={creating}>
              {creating ? '创建中…' : '发起匹配 →'}
            </button>
          ) : (
            <>
              <div className="code-box" style={{ marginBottom: 10 }}>{matchLink}</div>
              <button className="btn-ghost" onClick={copyMatchLink}>{linkCopied ? '✓ 已复制' : '复制链接'}</button>
            </>
          )}
          {matchErr && <p style={{ fontSize: 13, color: '#C0392B', marginTop: 10 }}>{matchErr}</p>}
        </div>
      )}

      {/* 备份码 */}
      <div style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <p style={{ fontSize: 13, color: '#8B8578' }}>备份你的旅行人格</p>
          <button onClick={() => setShowCode((v) => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#4A7C6F' }}>
            {showCode ? '收起' : '查看备份码'}
          </button>
        </div>
        {showCode && (
          <>
            <div className="code-box" style={{ marginBottom: 10 }}>{code}</div>
            <button className="btn-ghost" onClick={copy}>{copied ? '✓ 已复制' : '复制备份码'}</button>
          </>
        )}
        <p style={{ fontSize: 12, color: '#D4CFC6', marginTop: 10, lineHeight: 1.6 }}>保存这串码，换设备时可以恢复你的旅行人格，无需重新作答</p>
      </div>
      <div style={{ marginTop: 20 }}>
        <button className="btn-ghost" onClick={onReset}>重新测试</button>
      </div>
    </div>
  );
}
