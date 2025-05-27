import { Novel, User } from '@/types';

export const dummyUsers: User[] = [
  {
    id: '1',
    email: 'user1@example.com',
    displayName: '夢見る作家',
    avatarUrl: '/img/avatars/dummy.png',
    subscriptionStatus: 'premium',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    email: 'user2@example.com',
    displayName: '星降る詩人',
    avatarUrl: '/img/avatars/dummy.png',
    subscriptionStatus: 'premium',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    email: 'user3@example.com',
    displayName: '黄昏の語り部',
    avatarUrl: '/img/avatars/dummy.png',
    subscriptionStatus: 'free',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
  },
];

export const dummyNovels: Novel[] = [
  {
    id: '1',
    userId: '1',
    title: '星の彼方の約束',
    content: `月明かりが照らす静かな夜、私は約束の場所へと向かった。

十年前、幼なじみの彼女と交わした約束。「大人になったら、また必ずここで会おう」という言葉が、今でも心に響いている。

駅前の小さな公園。錆びたブランコが、風に揺られて軋んだ音を立てている。ベンチに座り、星空を見上げる。都会の光に隠れて、星はほとんど見えない。でも、あの頃と同じように、北極星だけは確かに輝いていた。

「遅くなってごめん」

振り返ると、そこには変わらない笑顔があった。時間が止まったような、不思議な感覚。

「ずっと待ってたよ」と私は答えた。`,
    summary: '十年ぶりの再会を描いた、切なくも温かい物語',
    genre: ['恋愛', 'ドラマ'],
    generatedAt: new Date('2024-05-20'),
    createdAt: new Date('2024-05-20'),
    user: dummyUsers[0],
    likeCount: 42,
    isLikedByUser: false,
  },
  {
    id: '2',
    userId: '2',
    title: '魔法使いの休日',
    content: `「今日は魔法を使わない」

朝起きて、最初に決めたことだった。

千年生きた大魔法使いの私にとって、魔法なしの生活など想像もつかない。でも、人間たちはそうやって生きている。一度くらい、体験してみてもいいだろう。

まず困ったのは朝食だ。いつもは指を鳴らせば現れる豪華な食事。今日は自分で作らなければならない。

冷蔵庫を開けて途方に暮れる。卵を割ろうとして殻ごと潰してしまい、パンを焼こうとして炭にしてしまった。

結局、近所のパン屋に行くことにした。店員の少女が笑顔で「いらっしゃいませ」と迎えてくれる。

「クロワッサンを一つ」

お金を払うのも初めてだ。小銭を数えるのに手間取っていると、後ろに並んだ老婦人が優しく教えてくれた。

魔法を使わない一日。不便だけれど、なぜか心が温かい。人と人との小さな触れ合いが、最高の魔法なのかもしれない。`,
    summary: '千年生きた魔法使いが体験する、魔法なしの一日',
    genre: ['ファンタジー', 'ほのぼの'],
    generatedAt: new Date('2024-05-19'),
    createdAt: new Date('2024-05-19'),
    user: dummyUsers[1],
    likeCount: 38,
    isLikedByUser: true,
  },
  {
    id: '3',
    userId: '1',
    title: '雨音のジャズ',
    content: `雨の夜は、決まってあの店に行く。

路地裏の小さなジャズバー。看板もなく、知る人ぞ知る隠れ家。重い木製のドアを押し開けると、煙草の煙とウイスキーの香りが迎えてくれる。

「いらっしゃい、また雨の日ね」

マスターが苦笑いを浮かべながら、いつものグラスを差し出す。

カウンターの端に座り、ステージを眺める。今夜のピアニストは若い女性だ。繊細な指先が鍵盤を撫でるように動き、Bill Evansの「Autumn Leaves」が流れ始める。

雨音とピアノの音が絶妙に絡み合う。まるで自然が奏でるセッションのようだ。

「雨の日にしか来ないお客さんも珍しいよ」

マスターの言葉に、私は微笑んだ。

「晴れの日には、晴れの日の音楽がある。でも、ジャズは雨の日に限る」

グラスを傾けながら、私は音楽に身を委ねた。外では雨が街を洗い流している。この瞬間だけは、すべての悩みも一緒に流れていくような気がした。`,
    summary: '雨の夜のジャズバーで過ごす、大人の時間',
    genre: ['ドラマ', '音楽'],
    generatedAt: new Date('2024-05-18'),
    createdAt: new Date('2024-05-18'),
    user: dummyUsers[0],
    likeCount: 56,
    isLikedByUser: false,
  },
  {
    id: '4',
    userId: '2',
    title: '猫と過ごす日曜日',
    content: `「ニャー」

日曜の朝は、必ず猫の鳴き声で目が覚める。

ミケと名付けた三毛猫は、朝の6時きっかりに私の顔を肉球でぺちぺちと叩く。時計なんて見ていないはずなのに、なぜか時間通りだ。

「もう少し寝かせてよ」

そう言っても聞いてくれるはずもなく、仕方なくベッドから這い出る。

キッチンでミケの朝食を用意する。カリカリと音を立てて食べる姿を眺めながら、私はコーヒーを淹れる。

食事を終えたミケは、満足そうに窓辺で毛づくろいを始めた。朝日を浴びて、毛並みがきらきらと輝いている。

「今日は何して過ごそうか」

ミケに話しかけると、「ニャー」と返事が返ってくる。まるで会話が成立しているような気がして、つい笑ってしまう。

結局、一日中ミケと過ごすことになった。昼寝をして、遊んで、また昼寝をして。

何も生産的なことはしていない。でも、こんな日曜日も悪くない。ミケがいてくれるだけで、世界は十分に豊かだ。`,
    summary: '猫との穏やかな日曜日を描いた心温まる物語',
    genre: ['日常', '動物'],
    generatedAt: new Date('2024-05-17'),
    createdAt: new Date('2024-05-17'),
    user: dummyUsers[1],
    likeCount: 72,
    isLikedByUser: true,
  },
];

export const getCurrentUserDummy = (): User => ({
  id: '4',
  email: 'current@example.com',
  displayName: '現在のユーザー',
  avatarUrl: '/img/avatars/dummy.png',
  subscriptionStatus: 'free',
  createdAt: new Date(),
  updatedAt: new Date(),
});