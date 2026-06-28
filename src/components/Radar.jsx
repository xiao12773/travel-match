import { RADAR_DIMS } from '../data/personas';
import { dimScore, getStory } from '../utils/quiz';

export function Radar({ answers }) {
  const N = RADAR_DIMS.length, sz = 220, cx = sz / 2, cy = sz / 2, R = 78;
  const ang = (i) => (Math.PI * 2 * i) / N - Math.PI / 2;
  const pt = (r, i) => [cx + r * Math.cos(ang(i)), cy + r * Math.sin(ang(i))];
  const grid = [1, 2, 3, 4].map((l) => {
    const r = (R * l) / 4;
    return RADAR_DIMS.map((_, i) => pt(r, i)).map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join('') + 'Z';
  });
  const vals = RADAR_DIMS.map((d) => dimScore(answers, d.key) / 100);
  const data = vals.map((v, i) => pt(R * v, i)).map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join('') + 'Z';

  return (
    <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}>
      {grid.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#D4CFC6" strokeWidth={0.8} />
      ))}
      {RADAR_DIMS.map((_, i) => {
        const [x, y] = pt(R, i);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#D4CFC6" strokeWidth={0.8} />;
      })}
      <path d={data} fill="#4A7C6F" fillOpacity={0.18} stroke="#4A7C6F" strokeWidth={2} strokeLinejoin="round" />
      {vals.map((v, i) => {
        const [x, y] = pt(Math.max(v, 0.08) * R, i);
        return <circle key={i} cx={x} cy={y} r={3.5} fill="#4A7C6F" />;
      })}
      {RADAR_DIMS.map(({ label }, i) => {
        const [x, y] = pt(R + 17, i);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill="#8B8578" fontFamily="Inter,sans-serif">
            {label}
          </text>
        );
      })}
    </svg>
  );
}

export function RadarExplain({ answers }) {
  return (
    <div>
      {RADAR_DIMS.map((dim) => {
        const score = dimScore(answers, dim.key);
        const story = getStory(dim, score);
        return (
          <div key={dim.label} className="radar-row">
            <div style={{ paddingTop: 3 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(74,124,111,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#4A7C6F' }}>{dim.label}</span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{dim.label}</span>
                <span style={{ fontSize: 12, color: '#8B8578' }}>{score}%</span>
              </div>
              <div style={{ height: 4, background: '#EDE8DF', borderRadius: 2, marginBottom: 10, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${score}%`, background: '#4A7C6F', borderRadius: 2 }} />
              </div>
              <p style={{ fontSize: 13, color: '#6B6560', lineHeight: 1.75 }}>{story}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
