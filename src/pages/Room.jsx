import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Quiz from './Quiz';
import MatchResult from './MatchResult';
import { supabaseEnabled } from '../lib/supabase';
import { getRoom, submitAnswersB, isExpired, roleKey } from '../utils/room';
import { calcPersona } from '../utils/quiz';

function WaitingPersona({ answers }) {
  const persona = calcPersona(answers);
  const cards = [
    { label: '行程风格', data: persona.pace },
    { label: '消费倾向', data: persona.spending },
    { label: '社交风格', data: persona.social },
  ];
  return (
    <div>
      <h3 style={{ fontFamily: 'DM Serif Display,serif', fontSize: 20, textAlign: 'center', marginBottom: 20 }}>
        {persona.pace.emoji} {persona.pace.name} · {persona.spending.emoji} {persona.spending.name} · {persona.social.emoji} {persona.social.name}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {cards.map(({ label, data }) => (
          <div key={label} className="card" style={{ padding: '18px 20px' }}>
            <p style={{ fontSize: 11, color: '#8B8578', marginBottom: 8, letterSpacing: 1 }}>{label}</p>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: '#6B6560' }}>{data.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const POLL_MS = 4000;

export default function Room() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const r = await getRoom(roomId);
      setRoom(r);
      setError(r ? null : 'not-found');
    } catch {
      setError('load-failed');
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    load();
  }, [load]);

  // A 等待 B 完成时轮询
  const waitingForB = room && room.user_a_answers && !room.user_b_answers;
  useEffect(() => {
    if (!waitingForB) return;
    const t = setInterval(load, POLL_MS);
    return () => clearInterval(t);
  }, [waitingForB, load]);

  async function handleBDone(answersB) {
    try {
      await submitAnswersB(roomId, answersB);
      await load();
    } catch {
      setError('submit-failed');
    }
  }

  if (!supabaseEnabled) {
    return (
      <Centered>
        <p style={{ fontSize: 14, color: '#8B8578' }}>匹配功能尚未配置，请联系站点管理员。</p>
      </Centered>
    );
  }

  if (loading) {
    return (
      <Centered>
        <p style={{ fontSize: 14, color: '#8B8578' }}>加载中…</p>
      </Centered>
    );
  }

  if (error === 'not-found' || !room) {
    return (
      <Centered>
        <p style={{ fontFamily: 'DM Serif Display,serif', fontSize: 20, marginBottom: 10 }}>房间不存在</p>
        <p style={{ fontSize: 14, color: '#8B8578', lineHeight: 1.7 }}>这个匹配链接可能输入错误，请向对方确认后重试。</p>
      </Centered>
    );
  }

  if (error === 'load-failed' || error === 'submit-failed') {
    return (
      <Centered>
        <p style={{ fontSize: 14, color: '#8B8578' }}>网络出了点问题，请刷新页面重试。</p>
      </Centered>
    );
  }

  if (isExpired(room)) {
    return (
      <Centered>
        <p style={{ fontFamily: 'DM Serif Display,serif', fontSize: 20, marginBottom: 10 }}>链接已过期</p>
        <p style={{ fontSize: 14, color: '#8B8578', lineHeight: 1.7 }}>这个匹配房间已经超过有效期，请请对方重新发起一次匹配。</p>
      </Centered>
    );
  }

  // 双方都完成 → 解锁结果
  if (room.user_a_answers && room.user_b_answers) {
    // 根据角色决定谁是"你"谁是"TA"
    let viewerRole;
    try { viewerRole = localStorage.getItem(roleKey(roomId)); } catch { viewerRole = null; }
    return (
      <div className="app">
        <MatchResult answersA={room.user_a_answers} answersB={room.user_b_answers} viewer={viewerRole || 'b'} />
      </div>
    );
  }

  // 我是创建者（A），还在等 B
  let myRole;
  try {
    myRole = localStorage.getItem(roleKey(roomId));
  } catch {
    myRole = null;
  }

  if (myRole === 'a') {
    const shareLink = `${window.location.origin}/room/${roomId}`;
    return (
      <div className="app fade-up" style={{ paddingTop: 48 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <p style={{ fontFamily: 'DM Serif Display,serif', fontSize: 22, marginBottom: 10 }}>等待对方完成测试</p>
          <p style={{ fontSize: 14, color: '#8B8578', lineHeight: 1.7, marginBottom: 16 }}>把下面的链接发给同伴，TA 完成后这里会自动解锁匹配结果。</p>
          <div className="code-box" style={{ marginBottom: 10, wordBreak: 'break-all' }}>{shareLink}</div>
          <button className="btn-ghost" onClick={() => navigator.clipboard?.writeText(shareLink)}>复制链接</button>
        </div>
        <div style={{ borderTop: '1px solid #E4DED6', paddingTop: 24 }}>
          <p style={{ fontSize: 12, color: '#8B8578', letterSpacing: 3, marginBottom: 14, textAlign: 'center' }}>你的旅行人格</p>
          <WaitingPersona answers={room.user_a_answers} />
        </div>
      </div>
    );
  }

  // 我是 B，去完成测试
  return (
    <div className="app">
      <Quiz onDone={handleBDone} onHome={() => window.history.back()} />
    </div>
  );
}

function Centered({ children }) {
  return (
    <div className="app fade-up" style={{ paddingTop: 80, textAlign: 'center' }}>
      {children}
    </div>
  );
}
