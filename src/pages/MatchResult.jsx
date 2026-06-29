import { calcPersona } from '../utils/quiz';
import { totalMatchScore, matchTier, matchHighlights } from '../utils/match';

export default function MatchResult({ answersA, answersB }) {
  const personaA = calcPersona(answersA);
  const personaB = calcPersona(answersB);
  const score = totalMatchScore(answersA, answersB);
  const tier = matchTier(score);
  const { best, worst } = matchHighlights(answersA, answersB);
  const restrictionA = answersA['T19'];
  const restrictionB = answersB['T19'];

  return (
    <div className="fade-up" style={{ paddingTop: 48 }}>
      <p style={{ fontSize: 12, color: '#8B8578', letterSpacing: 3, marginBottom: 14 }}>匹配结果</p>
      <h2 style={{ fontFamily: 'DM Serif Display,serif', fontSize: 30, lineHeight: 1.4, marginBottom: 6 }}>
        {tier.label} · {score}%
      </h2>
      <p style={{ fontSize: 14, color: '#8B8578', lineHeight: 1.7 }}>{tier.desc}</p>

      {/* 双方人格对比 */}
      <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
        {[{ label: 'A', persona: personaA }, { label: 'B', persona: personaB }].map(({ label, persona }) => (
          <div key={label} className="card" style={{ flex: 1, padding: '20px 16px' }}>
            <p style={{ fontSize: 11, color: '#8B8578', marginBottom: 10, letterSpacing: 1 }}>{label}</p>
            <p style={{ fontSize: 14, lineHeight: 1.8 }}>
              {persona.pace.emoji} {persona.pace.name}<br />
              {persona.spending.emoji} {persona.spending.name}<br />
              {persona.social.emoji} {persona.social.name}
            </p>
          </div>
        ))}
      </div>

      {/* 高度匹配维度 */}
      <div className="card" style={{ marginTop: 14, padding: '20px 22px' }}>
        <p style={{ fontSize: 11, color: '#8B8578', letterSpacing: 1, marginBottom: 14 }}>最合拍的地方</p>
        {best.map((d) => (
          <div key={d.dim} style={{ marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{d.label}</span>
            <span style={{ fontSize: 12, color: '#8B8578', marginLeft: 8 }}>{d.score}% 一致</span>
          </div>
        ))}
      </div>

      {/* 需要沟通维度 */}
      <div className="card" style={{ marginTop: 14, padding: '20px 22px' }}>
        <p style={{ fontSize: 11, color: '#8B8578', letterSpacing: 1, marginBottom: 14 }}>建议提前聊聊</p>
        {worst.map((d) => (
          <div key={d.dim} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{d.label}</span>
              <span style={{ fontSize: 12, color: '#8B8578' }}>{d.score}% 一致</span>
            </div>
            <p style={{ fontSize: 13, color: '#6B6560', lineHeight: 1.7 }}>{d.suggestion}</p>
          </div>
        ))}
      </div>

      {/* 忌口对比 */}
      {(restrictionA || restrictionB) && (
        <div className="card" style={{ marginTop: 14, padding: '20px 22px' }}>
          <p style={{ fontSize: 11, color: '#8B8578', letterSpacing: 1, marginBottom: 10 }}>饮食限制</p>
          <p style={{ fontSize: 13, lineHeight: 1.7 }}>A：{restrictionA || '无'}</p>
          <p style={{ fontSize: 13, lineHeight: 1.7, marginTop: 6 }}>B：{restrictionB || '无'}</p>
        </div>
      )}
    </div>
  );
}
