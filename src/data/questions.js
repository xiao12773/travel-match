// 题目数据
const LK = [
  { label: '完全符合我', value: 4 },
  { label: '比较符合', value: 3 },
  { label: '不太符合', value: 2 },
  { label: '完全不符合', value: 1 },
];
const LKR = [
  { label: '完全符合我', value: 1 },
  { label: '比较符合', value: 2 },
  { label: '不太符合', value: 3 },
  { label: '完全不符合', value: 4 },
];

export const QUESTIONS = [
  { id: 'T01', dim: 'budget', type: 'choice', text: '这次旅行你的总预算大概是多少？', sub: '不含机票', options: [{ label: '1000 以下', value: 1 }, { label: '1000–3000', value: 2 }, { label: '3000–6000', value: 3 }, { label: '6000 以上', value: 4 }] },
  { id: 'T02', dim: 'spending', type: 'likert', text: '旅行中花超预算，是可以接受的事', options: LK },
  { id: 'T03', dim: 'spending', type: 'likert', text: '旅行前我会给每一项开销设定上限', options: LKR },
  { id: 'T04', dim: 'spending_priority', type: 'rank', text: '假设这次旅行有一笔额外的钱，你最想花在哪里？', options: [{ label: '🛏️ 住得更好', value: 'stay' }, { label: '🍜 吃得更好', value: 'food' }, { label: '🎡 多一个体验或活动', value: 'experience' }, { label: '🛍️ 买东西或逛街', value: 'shopping' }] },
  { id: 'T05', dim: 'pace', type: 'likert', text: '旅行中我喜欢把行程排满，多看多体验', options: LK },
  { id: 'T06', dim: 'pace', type: 'scene', text: '旅行第二天下午，你们已经逛了两个景点。同伴说"还有时间，要不再去一个？"你的感受是？', options: [{ label: '好啊，来都来了多看一个', value: 1 }, { label: '可以去，但不会主动提', value: 2 }, { label: '有点犹豫，看同伴状态再说', value: 3 }, { label: '有点累了，更想找个地方坐下来发呆', value: 4 }] },
  { id: 'T07', dim: 'attraction', type: 'choice', text: '一个城市只有一天，你优先去？', options: [{ label: '🌿 自然风景（山、海、公园）', value: 'nature' }, { label: '🏛️ 人文历史（博物馆、古迹）', value: 'culture' }, { label: '🏮 街区市集（本地生活气息）', value: 'local' }, { label: '📸 网红打卡（好看、有话题）', value: 'popular' }] },
  { id: 'T08', dim: 'attraction', type: 'likert', text: '去一个城市，不去当地最著名的景点会觉得遗憾', options: LK },
  { id: 'T09', dim: 'planning', type: 'likert', text: '出发前我会做好详细的行程攻略', options: LK },
  { id: 'T10', dim: 'planning', type: 'scene', text: '出发前三天，同伴问"餐厅要不要提前订？"你的反应是？', options: [{ label: '不用订，到了再找反而有惊喜', value: 1 }, { label: '订几个重点的，其他随机应变', value: 2 }, { label: '重要的都应该提前订好', value: 3 }, { label: '我已经做好攻略了，早订好了', value: 4 }] },
  { id: 'T11', dim: 'emotion', type: 'scene', text: '旅行中发生了一件让你很扫兴的事（比如排了很久队结果进不去）。接下来一小时你更可能是？', options: [{ label: '需要安静一会儿，不太想说话', value: 1 }, { label: '会抱怨几句，发泄完就好了', value: 2 }, { label: '很快切换到下一件事，不太会停留在负面情绪里', value: 3 }, { label: '马上开始想替代方案，负面情绪对我影响不大', value: 4 }] },
  { id: 'T12', dim: 'emotion', type: 'scene', text: '旅途中同伴因为一件小事情绪很低落，沉默了很长时间。你的感受是？', options: [{ label: '会有点担心，主动问他怎么了', value: 4 }, { label: '给他空间，等他自己缓过来', value: 3 }, { label: '有点不知所措，不确定该说什么', value: 2 }, { label: '有点影响我的心情，希望他快点调整好', value: 1 }] },
  { id: 'T13', dim: 'alone', type: 'likert', text: '旅行超过三天，我会需要一些独自一人的时间来恢复状态', options: LK },
  { id: 'T14', dim: 'alone', type: 'likert', text: '旅行中24小时和同伴在一起，我完全不会觉得疲惫', options: LKR },
  { id: 'T15', dim: 'splitting', type: 'scene', text: '旅途中你帮大家垫付了500元门票，你会怎么处理？', options: [{ label: '当天就在群里发收款', value: 4 }, { label: '旅途结束后统一结算', value: 3 }, { label: '看对方，对方提我就提醒一下', value: 2 }, { label: '关系好就算了，不在乎这点钱', value: 1 }] },
  { id: 'T16', dim: 'splitting', type: 'likert', text: '旅行结束后有共同花销没人提，我会主动把账算清楚', options: LK },
  { id: 'T17', dim: 'food', type: 'scene', text: '旅行中到了饭点，你更倾向于？', options: [{ label: '找一家当地有特色的餐厅坐下来好好吃一顿', value: 4 }, { label: '随便找家看起来还不错的地方解决', value: 3 }, { label: '吃什么不重要，快点吃完继续玩', value: 2 }, { label: '方便就好，能填饱肚子就行', value: 1 }] },
  { id: 'T18', dim: 'food', type: 'scene', text: '旅行中遇到一家排队两小时的本地名店，你会？', options: [{ label: '值得等，这就是旅游的意义', value: 4 }, { label: '看情况，如果别人都说好就等', value: 3 }, { label: '等半小时可以，两小时太久了', value: 2 }, { label: '不值得，随便找家差不多的吃', value: 1 }] },
  { id: 'T19', dim: 'food_restriction', type: 'text', text: '你有哪些忌口或饮食限制？', sub: '没有可以填"无"', placeholder: '例如：不吃辣、素食、海鲜过敏……' },
  { id: 'T20', dim: 'photo', type: 'scene', text: '到了一个很美的景点，同伴说想多拍一会儿照片，大概需要二十分钟。你的感受是？', options: [{ label: '完全理解，我也喜欢好好拍', value: 4 }, { label: '可以接受，刷刷手机等一下', value: 3 }, { label: '有点不耐烦，但不会说出来', value: 2 }, { label: '会直接说先去下一个，拍照可以快点', value: 1 }] },
  { id: 'T21', dim: 'photo', type: 'likert', text: '旅行中我觉得拍照会打断体验，更喜欢用眼睛记录', options: LKR },
  { id: 'T22', dim: 'transport', type: 'likert', text: '旅行中我倾向于打车，省时间比省钱更重要', options: LK },
  { id: 'T23', dim: 'transport', type: 'scene', text: '景点之间大概3公里，打车15元，走路40分钟。同伴说想走过去顺便逛逛。你的感受是？', options: [{ label: '好啊，走路才能发现有趣的东西', value: 4 }, { label: '可以走，但如果太晒可能会后悔', value: 3 }, { label: '有点浪费时间，但同伴想走就走', value: 2 }, { label: '打车吧，时间更值钱', value: 1 }] },
  { id: 'T24', dim: 'sleep', type: 'likert', text: '旅行时我会比平时更早起床，不想浪费白天的时间', options: LK },
  { id: 'T25', dim: 'sleep', type: 'likert', text: '旅行中睡到自然醒对我来说很重要', options: LKR },
];

export const ATTENTION = [
  { id: 'A01', type: 'attention', text: '这道题是用来确认你在认真阅读题目的，请选择「不太符合」。', correct: 2, options: [{ label: '完全符合我', value: 4 }, { label: '比较符合', value: 3 }, { label: '不太符合', value: 2 }, { label: '完全不符合', value: 1 }] },
  { id: 'A02', type: 'attention', text: '不管上面的题目选了什么，这道题请选第二个选项。', correct: 2, options: [{ label: '选项一', value: 1 }, { label: '选项二', value: 2 }, { label: '选项三', value: 3 }, { label: '选项四', value: 4 }] },
];
