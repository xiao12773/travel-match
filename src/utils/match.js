import { dimScore } from './quiz';

// 类型题相似度矩阵（T07 景点偏好）
const ATTRACTION_MATRIX = {
  nature: { nature: 100, culture: 60, local: 40, popular: 20 },
  culture: { nature: 60, culture: 100, local: 60, popular: 20 },
  local: { nature: 40, culture: 60, local: 100, popular: 40 },
  popular: { nature: 20, culture: 20, local: 40, popular: 100 },
};

// T04 消费优先级排序，用于判断"相差一位"
const SPENDING_PRIORITY_ORDER = ['stay', 'food', 'experience', 'shopping'];

const WEIGHTS = {
  pace: 0.13,
  splitting: 0.13,
  planning: 0.10,
  emotion: 0.10,
  budget: 0.08,
  alone: 0.08,
  food: 0.07,
  spending: 0.07,
  stamina: 0.08,
  sleep: 0.04,
  transport: 0.04,
  photo: 0.04,
  attraction: 0.04,
};

// 普通维度（差值法），用各自题目的 dimScore 差值
const DIFF_DIMS = {
  pace: ['T05', 'T06'],
  splitting: ['T15', 'T16'],
  planning: ['T09', 'T10'],
  emotion: ['T11', 'T12'],
  alone: ['T13', 'T14'],
  food: ['T17', 'T18'],
  spending: ['T02', 'T03'],
  stamina: ['T27'],
  sleep: ['T24', 'T25'],
  transport: ['T22', 'T23'],
  photo: ['T20', 'T21'],
};

function budgetMatch(a, b) {
  const va = a['T01'], vb = b['T01'];
  if (typeof va !== 'number' || typeof vb !== 'number') return 50;
  const gap = Math.abs(va - vb);
  return [100, 60, 20, 0][gap] ?? 0;
}

function attractionMatch(a, b) {
  const va = a['T07'], vb = b['T07'];
  if (!va || !vb || !ATTRACTION_MATRIX[va]) return 50;
  return ATTRACTION_MATRIX[va][vb] ?? 50;
}

function spendingPriorityMatch(a, b) {
  const va = Array.isArray(a['T04']) ? a['T04'][0] : a['T04'];
  const vb = Array.isArray(b['T04']) ? b['T04'][0] : b['T04'];
  if (!va || !vb) return 50;
  if (va === vb) return 100;
  const gap = Math.abs(SPENDING_PRIORITY_ORDER.indexOf(va) - SPENDING_PRIORITY_ORDER.indexOf(vb));
  return gap === 1 ? 50 : 0;
}

// 各维度匹配度（0-100），用于展示"最合拍"/"需要沟通"的维度列表
export function dimensionMatches(answersA, answersB) {
  const result = {};
  Object.entries(DIFF_DIMS).forEach(([dim, ids]) => {
    const a = dimScore(answersA, ids);
    const b = dimScore(answersB, ids);
    result[dim] = 100 - Math.abs(a - b);
  });
  result.budget = budgetMatch(answersA, answersB);
  result.attraction = attractionMatch(answersA, answersB);
  result.spending_priority = spendingPriorityMatch(answersA, answersB);
  return result;
}

export function totalMatchScore(answersA, answersB) {
  const dims = dimensionMatches(answersA, answersB);
  let sum = 0;
  Object.entries(WEIGHTS).forEach(([dim, w]) => {
    sum += (dims[dim] ?? 50) * w;
  });
  return Math.round(sum);
}

export function matchTier(score) {
  if (score >= 80) return { label: '天生搭子', desc: '主要维度高度一致，可以放心出发' };
  if (score >= 60) return { label: '有缘搭子', desc: '大方向合得来，有几件事出发前聊一聊' };
  return { label: '互补搭子', desc: '你们风格各有不同，提前说好比旅途中发现代价小' };
}

const DIM_LABELS = {
  pace: '节奏', splitting: '分账', planning: '计划', emotion: '情绪处理',
  budget: '预算', alone: '独处需求', food: '美食', spending: '消费弹性',
  stamina: '体力', sleep: '作息', transport: '交通', photo: '拍照', attraction: '景点偏好',
};

const DIM_SUGGESTIONS = {
  pace: '提前约定好行程密度，比如一天最多排几个点，留出一些弹性时间。',
  splitting: '出发前商量好分账方式，按天结算还是用记账软件实时同步。',
  planning: '约定哪些事必须提前订（住宿、热门餐厅），哪些可以随性决定。',
  emotion: '遇到扫兴的事时，提前说清楚自己更需要安静还是需要被关心。',
  budget: '出发前对一下大致预算区间，避免临场因为花销产生分歧。',
  alone: '约定好如果有人想要独处时间，怎么开口、怎么回应。',
  food: '提前聊聊对吃饭这件事的优先级，要不要为了一顿饭专门等位。',
  spending: '聊聊对超预算的接受度，避免临时为该不该花钱起争执。',
  stamina: '提前聊聊每天大概能走多少路，步行量差太多旅途中容易产生摩擦。',
  sleep: '约定好起床时间，避免一方觉得被拖累、一方觉得被催促。',
  transport: '提前商量打车和走路怎么取舍，尤其是赶时间的时候。',
  photo: '聊聊拍照需要多少时间，找到双方都舒服的等待节奏。',
  attraction: '提前对一下这次想看的景点类型，找到都感兴趣的部分。',
};

export function matchHighlights(answersA, answersB) {
  const dims = dimensionMatches(answersA, answersB);
  const entries = Object.entries(dims)
    .filter(([dim]) => dim !== 'spending_priority')
    .map(([dim, score]) => ({ dim, label: DIM_LABELS[dim], score, suggestion: DIM_SUGGESTIONS[dim] }))
    .sort((x, y) => y.score - x.score);

  return {
    best: entries.slice(0, 3),
    worst: entries.slice(-3).reverse(),
  };
}
