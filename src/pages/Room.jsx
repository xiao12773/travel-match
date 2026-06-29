import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Quiz from './Quiz';
import MatchResult from './MatchResult';
import { supabaseEnabled } from '../lib/supabase';
import { getRoom, submitAnswersB, isExpired, roleKey } from '../utils/room';

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
    return (
      <div className="app">
        <MatchResult answersA={room.user_a_answers} answersB={room.user_b_answers} />
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
    return (
      <Centered>
        <p style={{ fontFamily: 'DM Serif Display,serif', fontSize: 22, marginBottom: 12 }}>等待对方完成测试</p>
        <p style={{ fontSize: 14, color: '#8B8578', lineHeight: 1.7 }}>把链接发给同伴，TA 完成测试后这里会自动解锁匹配结果。</p>
      </Centered>
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
