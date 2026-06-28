import { useState, useEffect } from 'react';

// 排序题
export default function RankQ({ q, value, onChange }) {
  const initOrder = q.options.map((o) => o.value);
  const [items, setItems] = useState(value || initOrder);
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);

  useEffect(() => {
    if (!value) onChange(initOrder);
  }, []);

  const getLabel = (v) => q.options.find((o) => o.value === v)?.label || v;

  function move(idx, dir) {
    const next = [...items];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setItems(next);
    onChange(next);
  }

  return (
    <div>
      {/* 操作提示 */}
      <div className="rank-hint">
        <span style={{ fontSize: 16 }}>↕</span>
        <span style={{ fontSize: 13, color: '#4A7C6F', fontWeight: 500 }}>点击 ▲▼ 调整顺序，最想花的放在第一位</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((val, idx) => (
          <div
            key={val}
            className={`rank-item ${overIdx === idx && dragIdx !== idx ? 'drag-over' : ''} ${dragIdx === idx ? 'is-dragging' : ''}`}
            draggable
            onDragStart={() => setDragIdx(idx)}
            onDragOver={(e) => {
              e.preventDefault();
              setOverIdx(idx);
            }}
            onDrop={() => {
              if (dragIdx === null || dragIdx === idx) {
                setDragIdx(null);
                setOverIdx(null);
                return;
              }
              const next = [...items];
              const [m] = next.splice(dragIdx, 1);
              next.splice(idx, 0, m);
              setItems(next);
              onChange(next);
              setDragIdx(null);
              setOverIdx(null);
            }}
            onDragEnd={() => {
              setDragIdx(null);
              setOverIdx(null);
            }}
          >
            <span style={{ color: '#C4C0BA', fontSize: 15, cursor: 'grab', flexShrink: 0 }}>⠿</span>
            <span style={{ fontSize: 14, flex: 1 }}>{getLabel(val)}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flexShrink: 0 }}>
              <button onClick={() => move(idx, -1)} disabled={idx === 0} style={{ background: 'none', border: 'none', cursor: idx === 0 ? 'default' : 'pointer', color: idx === 0 ? '#D4CFC6' : '#4A7C6F', fontSize: 15, padding: '1px 8px', lineHeight: 1.2 }}>▲</button>
              <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} style={{ background: 'none', border: 'none', cursor: idx === items.length - 1 ? 'default' : 'pointer', color: idx === items.length - 1 ? '#D4CFC6' : '#4A7C6F', fontSize: 15, padding: '1px 8px', lineHeight: 1.2 }}>▼</button>
            </div>
            <span style={{ minWidth: 28, color: '#C4C0BA', fontSize: 12, textAlign: 'right', flexShrink: 0 }}>#{idx + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
