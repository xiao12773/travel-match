// 首页插画（无人像，线条简洁）
export default function HeroIllustration() {
  return (
    <svg viewBox="0 0 440 240" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <rect width="440" height="240" fill="#E4DDD0" rx="20" />

      {/* 地图网格线 */}
      {[60, 120, 180, 240, 300, 360].map((x) => (
        <line key={'vl' + x} x1={x} y1="0" x2={x} y2="240" stroke="#D0C9BC" strokeWidth="0.6" strokeDasharray="4,6" />
      ))}
      {[48, 96, 144, 192].map((y) => (
        <line key={'hl' + y} x1="0" y1={y} x2="440" y2={y} stroke="#D0C9BC" strokeWidth="0.6" strokeDasharray="4,6" />
      ))}

      {/* 远山轮廓线 */}
      <polyline points="0,160 60,100 120,140 180,80 260,130 320,75 380,115 440,90 440,240 0,240" fill="#C8C0B0" fillOpacity="0.5" stroke="none" />
      <polyline points="0,160 60,100 120,140 180,80 260,130 320,75 380,115 440,90" fill="none" stroke="#A89E8E" strokeWidth="1.5" strokeLinejoin="round" />

      {/* 近山色块 */}
      <polyline points="0,200 80,130 160,175 240,115 330,160 440,130 440,240 0,240" fill="#4A7C6F" fillOpacity="0.55" stroke="none" />
      <polyline points="0,200 80,130 160,175 240,115 330,160 440,130" fill="none" stroke="#3A6259" strokeWidth="2" strokeLinejoin="round" />

      {/* 太阳 */}
      <circle cx="368" cy="46" r="22" fill="#C4956A" fillOpacity="0.25" />
      <circle cx="368" cy="46" r="14" fill="#C4956A" fillOpacity="0.55" />
      {/* 太阳光线 */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const r = (Math.PI * deg) / 180;
        return (
          <line
            key={deg}
            x1={368 + 18 * Math.cos(r)}
            y1={46 + 18 * Math.sin(r)}
            x2={368 + 26 * Math.cos(r)}
            y2={46 + 26 * Math.sin(r)}
            stroke="#C4956A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.6"
          />
        );
      })}

      {/* 云朵（线条风格）*/}
      <path d="M100,38 Q108,28 120,32 Q124,20 136,24 Q148,16 158,26 Q168,20 174,30 Q180,26 182,34 Q174,42 158,40 Q148,48 136,42 Q120,48 108,42 Z" fill="white" fillOpacity="0.65" stroke="#C8C0B0" strokeWidth="0.8" />
      <path d="M280,52 Q286,44 296,47 Q300,38 310,41 Q318,34 326,42 Q332,38 336,46 Q340,42 342,50 Q336,56 326,54 Q318,60 310,54 Q296,60 286,56 Z" fill="white" fillOpacity="0.55" stroke="#C8C0B0" strokeWidth="0.8" />

      {/* 指南针 */}
      <g transform="translate(48,42)">
        <circle r="20" fill="#EDE8DF" stroke="#8B8578" strokeWidth="1.2" />
        <circle r="2" fill="#8B8578" />
        {/* 指针 */}
        <polygon points="0,-14 3,0 0,4 -3,0" fill="#C4956A" />
        <polygon points="0,14 3,0 0,-4 -3,0" fill="#8B8578" fillOpacity="0.5" />
        {/* N S */}
        <text x="0" y="-16" textAnchor="middle" fontSize="6" fill="#8B8578" fontFamily="Inter,sans-serif">N</text>
        <text x="0" y="22" textAnchor="middle" fontSize="6" fill="#8B8578" fontFamily="Inter,sans-serif">S</text>
      </g>

      {/* 小鸟 */}
      <path d="M210,65 Q215,59 220,65" stroke="#8B8578" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M228,58 Q233,52 238,58" stroke="#8B8578" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M194,72 Q198,67 202,72" stroke="#8B8578" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
