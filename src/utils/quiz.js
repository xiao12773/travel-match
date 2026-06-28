import { QUESTIONS, ATTENTION } from '../data/questions';
import { PERSONAS } from '../data/personas';

export function buildQuizList() {
  const pool = [...QUESTIONS];
  const checks = [...ATTENTION].sort(() => Math.random() - 0.5);
  const total = pool.length + checks.length;
  const pos = new Set();
  while (pos.size < checks.length) pos.add(Math.floor(Math.random() * (total - 1)) + 1);
  const result = [];
  let qi = 0, ci = 0;
  for (let i = 0; i < total; i++) {
    if (pos.has(i) && ci < checks.length) result.push(checks[ci++]);
    else result.push(pool[qi++]);
  }
  return result;
}

// 加权计分——每道题权重略有差异，增加输出分布密度
const Q_WEIGHTS = {
  T05: 1.0, T06: 1.15, T09: 1.0, T10: 1.1,
  T13: 1.05, T14: 1.0, T17: 1.1, T18: 1.0,
  T22: 1.0, T23: 1.1, T02: 1.05, T03: 1.0,
  T11: 1.0, T12: 1.1, T20: 1.0, T21: 1.05,
  T24: 1.0, T25: 1.1,
};

export function dimScore(answers, ids) {
  let wSum = 0, wTotal = 0;
  ids.forEach((id) => {
    const v = answers[id];
    if (typeof v !== 'number') return;
    const w = Q_WEIGHTS[id] || 1.0;
    wSum += (v - 1) * w; // v 范围 1-4，减1后0-3
    wTotal += 3 * w;
  });
  if (wTotal === 0) return 50;
  // 保留1位小数再取整，减少分数聚集
  return Math.round((wSum / wTotal) * 100);
}

export function getStory(dim, score) {
  const s = dim.stories.find((s) => score >= s.range[0] && score <= s.range[1]);
  return s ? s.text : '';
}

export function calcPersona(answers) {
  const pace = dimScore(answers, ['T05', 'T06']);
  const planning = dimScore(answers, ['T09', 'T10']);
  const sleep = dimScore(answers, ['T24', 'T25']);
  // 加权平均：节奏权重最高
  const paceAvg = (pace * 1.2 + planning + sleep * 0.8) / 3;
  const paceP = paceAvg >= 60 ? PERSONAS.pace.high : paceAvg >= 33 ? PERSONAS.pace.mid : PERSONAS.pace.low;

  const first = Array.isArray(answers['T04']) ? answers['T04'][0] : answers['T04'];
  const spendP = PERSONAS.spending_priority[first] || PERSONAS.spending_priority.experience;

  const alone = dimScore(answers, ['T13', 'T14']);
  const emotion = dimScore(answers, ['T11', 'T12']);
  const photo = dimScore(answers, ['T20', 'T21']);
  const socAvg = ((100 - alone) * 1.1 + emotion + photo * 0.9) / 3;
  const socP = socAvg >= 60 ? PERSONAS.social.high : socAvg >= 33 ? PERSONAS.social.mid : PERSONAS.social.low;

  return { pace: paceP, spending: spendP, social: socP };
}

export function checkAttention(answers) {
  let ok = 0;
  if (answers['A01'] === 2) ok++;
  if (answers['A02'] === 2) ok++;
  return ok >= 1;
}

export function encode(a) {
  return btoa(encodeURIComponent(JSON.stringify(a)));
}
export function decode(c) {
  try {
    return JSON.parse(decodeURIComponent(atob(c)));
  } catch {
    return null;
  }
}
