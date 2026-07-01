import { calcPersona } from '../utils/quiz';
import { totalMatchScore, matchTier, matchHighlights } from '../utils/match';

const VALUE_LABELS = {
  checkin: '打卡了想去的地方，有照片和回忆',
  food: '吃到了真正满意的东西',
  relax: '有几个真正放松下来的瞬间',
  understand: '对这个地方有了真实的了解和感受',
};

function valueLabel(v) {
  if (!v) return null;
  return VALUE_LABELS[v] || v;
}

export default function MatchResult({ answersA, answersB, viewer = 'b' }) {
  const personaA = calcPersona(answersA);
  const personaB = calcPersona(answersB);
  const score = totalMatchScore(answersA, answersB);
  const tier = matchTier(score);
  const { best, worst } = matchHighlights(answersA, answersB);

  const restrictionA = answersA['T19'];
  const restrictionB = answersB['T19'];
  const dealbreakerA = answersA['T28'];
  const dealbreakerB = answersB['T28'];
  const showMutualSection = restrictionA || restrictionB || dealbreakerA || dealbreakerB;

  const labelsA = viewer === 'a' ? { self: '你', other: 'TA' } : { self: 'TA', other: '你' };
  const labelsB = viewer === 'a' ? { self: 'TA', other: '你' } : { self: '你', other: 'TA' };

  return (
    <div className="fade-up" style={{ paddingTop: 48 }}>
      <p style={{ fontSize: 12, color: '#8B8578', letterSpacing: 3, marginBottom: 14 }}>匹配结果</p>
      <h2 style={{ fontFamily: 'DM Serif Display,serif', fontSize: 30, lineHeight: 1.4, marginBottom: 6 }}>
        {tier.label}
      </h2>
      <p style={{ fontSize: 14, color: '#8B8578', lineHeight: 1.7 }}>{tier.desc}</p>

      {/* 双方人格对比 */}
      {[
        { roleLabel: labelsA.self, persona: personaA, answers: answersA },
        { roleLabel: labelsB.self, persona: personaB, answers: answersB },
      ].map(({ roleLabel, persona, answers }) => (
        <div key={roleLabel} className="card" style={{ marginTop: 20, padding: '20px 20px' }}>
          <p style={{ fontSize: 11, color: '#8B8578', letterSpacing: 1, marginBottom: 14 }}>{roleLabel}的旅行人格</p>
          <h3 style={{ fontFamily: 'DM Serif Display,serif', fontSize: 18, marginBottom: 16 }}>
            {persona.pace.emoji} {persona.pace.name} · {persona.spending.emoji} {persona.spending.name} · {persona.social.emoji} {persona.social.name}
          </h3>
          {[
            { label: '行程风格', data: persona.pace },
            { label: '消费倾向', data: persona.spending },
            { label: '社交风格', data: persona.social },
          ].map(({ label: dimLabel, data }, i, arr) => (
            <div key={dimLabel} style={{ marginBottom: i < arr.length - 1 ? 14 : 0, paddingBottom: i < arr.length - 1 ? 14 : 0, borderBottom: i < arr.length - 1 ? '1px solid #E4DED6' : 'none' }}>
              <p style={{ fontSize: 11, color: '#8B8578', letterSpacing: 1, marginBottom: 6 }}>{dimLabel}</p>
              <p style={{ fontSize: 14, lineHeight: 1.8 }}>{data.desc}</p>
            </div>
          ))}
          {valueLabel(answers['T26']) && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #E4DED6' }}>
              <p style={{ fontSize: 11, color: '#8B8578', letterSpacing: 1, marginBottom: 6 }}>旅行成功的标准</p>
              <p style={{ fontSize: 14, lineHeight: 1.8 }}>{valueLabel(answers['T26'])}</p>
            </div>
          )}
        </div>
      ))}

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
        <p style={{ fontSize: 11, color: '#8B8578', letterSpacing: 1, marginBottom: 14 }}>出发前聊这几件事</p>
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

      {/* 出发前互相了解（忌口 + 底线） */}
      {showMutualSection && (
        <div className="card" style={{ marginTop: 14, padding: '20px 22px' }}>
          <p style={{ fontSize: 11, color: '#8B8578', letterSpacing: 1, marginBottom: 14 }}>出发前互相了解</p>
          <p style={{ fontSize: 13, lineHeight: 1.7 }}>{labelsA.self} 的忌口：{restrictionA || '无'}</p>
          {dealbreakerA && <p style={{ fontSize: 13, lineHeight: 1.7, marginTop: 4 }}>{labelsA.self} 的底线：{dealbreakerA}</p>}
          <div style={{ borderTop: '1px solid #E4DED6', marginTop: 12, paddingTop: 12 }}>
            <p style={{ fontSize: 13, lineHeight: 1.7 }}>{labelsB.self} 的忌口：{restrictionB || '无'}</p>
            {dealbreakerB && <p style={{ fontSize: 13, lineHeight: 1.7, marginTop: 4 }}>{labelsB.self} 的底线：{dealbreakerB}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
