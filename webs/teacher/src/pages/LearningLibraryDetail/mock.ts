import type {
  DubbingLine,
  LeaderboardEntry,
  MaterialDetail,
  QuizQuestion,
  SubtitleLine,
  VocabularyItem,
} from "./_interface";

export const MATERIAL_DETAIL: MaterialDetail = {
  id: "res-1",
  title: "Animals Vocabulary",
  formatLabel: "Video",
  unit: "Unit 5",
  category: "Vocabulary",
  level: "Beginner",
  meta: "15 phút",
  usageCount: 245,
  rating: 4.9,
  reviewCount: 124,
  views: 356,
  description:
    "E-book giúp học viên mở rộng vốn từ vựng về các loài động vật thông qua hình ảnh minh họa sinh động và đoạn văn ngắn dễ hiểu.",
  goal: "Học và hiểu từ vựng về các loài động vật.",
  audience: "Trẻ em, người mới bắt đầu",
  topic: "Animals",
  duration: "15 phút",
  tags: ["Animals", "Vocabulary", "Beginner", "Kids", "ESL"],
  gradient: "from-amber-200 to-orange-100",
};

export interface ReadPage {
  page: number;
  emoji: string;
  gradient: string;
  title: string;
  paragraph: string;
}

export const READ_PAGES: ReadPage[] = [
  {
    page: 1,
    emoji: "🦒",
    gradient: "from-sky-200 to-emerald-100",
    title: "Giraffe",
    paragraph:
      "The giraffe is the tallest animal in the world. It has a long neck and long legs. Giraffes eat leaves from tall trees. They are very gentle and beautiful.",
  },
  {
    page: 2,
    emoji: "🐘",
    gradient: "from-slate-200 to-blue-100",
    title: "Elephant",
    paragraph:
      "The elephant is the biggest land animal. It has big ears and a long trunk. Elephants use their trunk to drink water and pick up food.",
  },
  {
    page: 3,
    emoji: "🦁",
    gradient: "from-amber-200 to-yellow-100",
    title: "Lion",
    paragraph:
      "The lion is known as the king of the jungle. It has a big mane and a loud roar. Lions live together in groups called prides.",
  },
  {
    page: 4,
    emoji: "🐶",
    gradient: "from-orange-200 to-rose-100",
    title: "Dog",
    paragraph:
      "The dog is a loyal friend to people. It likes to run and play. Dogs can hear and smell much better than humans.",
  },
  {
    page: 5,
    emoji: "🐱",
    gradient: "from-pink-200 to-fuchsia-100",
    title: "Cat",
    paragraph:
      "The cat is a small and gentle pet. It likes to sleep and jump. Cats are very clean and often wash themselves.",
  },
];

export const VOCABULARY_ITEMS: VocabularyItem[] = [
  { id: "voc-1", emoji: "🦒", word: "giraffe", ipa: "/dʒəˈræf/", meaning: "con hươu cao cổ" },
  { id: "voc-2", emoji: "📏", word: "tallest", ipa: "/ˈtɔːlɪst/", meaning: "cao nhất" },
  { id: "voc-3", emoji: "🔵", word: "neck", ipa: "/nek/", meaning: "cái cổ" },
  { id: "voc-4", emoji: "🦵", word: "leg", ipa: "/leɡ/", meaning: "cái chân" },
  { id: "voc-5", emoji: "🍃", word: "leaves", ipa: "/liːvz/", meaning: "lá cây" },
  { id: "voc-6", emoji: "💗", word: "gentle", ipa: "/ˈdʒentl/", meaning: "hiền lành, nhẹ nhàng" },
];

export const SUBTITLE_LINES: SubtitleLine[] = [
  { id: "sub-1", start: "00:00", end: "00:04", en: "This is a dog.", vi: "Đây là một con chó." },
  { id: "sub-2", start: "00:04", end: "00:07", en: "It says woof woof.", vi: "Nó kêu gâu gâu." },
  { id: "sub-3", start: "00:07", end: "00:10", en: "This is a cat.", vi: "Đây là một con mèo." },
  { id: "sub-4", start: "00:10", end: "00:13", en: "It says meow meow.", vi: "Nó kêu meo meo." },
  { id: "sub-5", start: "00:13", end: "00:16", en: "The dog is happy.", vi: "Con chó rất vui." },
  { id: "sub-6", start: "00:16", end: "00:19", en: "The cat is cute.", vi: "Con mèo thật dễ thương." },
];

export const DUBBING_LINES: DubbingLine[] = [
  { id: "dub-1", index: 1, start: "00:00", end: "00:04", en: "This is a dog.", vi: "Đây là một con chó.", score: 92 },
  { id: "dub-2", index: 2, start: "00:04", end: "00:07", en: "It says woof woof.", vi: "Nó kêu gâu gâu.", score: 88 },
  { id: "dub-3", index: 3, start: "00:07", end: "00:10", en: "This is a cat.", vi: "Đây là một con mèo.", score: 95 },
  { id: "dub-4", index: 4, start: "00:10", end: "00:13", en: "It says meow meow.", vi: "Nó kêu meo meo.", score: 76 },
  { id: "dub-5", index: 5, start: "00:13", end: "00:15", en: "They are friends.", vi: "Chúng là bạn.", score: 91 },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q-1",
    question: "Which animal has a long neck?",
    options: [
      { id: "q1-a", label: "Giraffe", emoji: "🦒" },
      { id: "q1-b", label: "Dog", emoji: "🐶" },
      { id: "q1-c", label: "Cat", emoji: "🐱" },
      { id: "q1-d", label: "Bear", emoji: "🐻" },
    ],
    correctOptionId: "q1-a",
  },
  {
    id: "q-2",
    question: "Which animal says 'Meow meow'?",
    options: [
      { id: "q2-a", label: "Dog", emoji: "🐶" },
      { id: "q2-b", label: "Cat", emoji: "🐱" },
      { id: "q2-c", label: "Monkey", emoji: "🐵" },
      { id: "q2-d", label: "Bear", emoji: "🐻" },
    ],
    correctOptionId: "q2-b",
  },
  {
    id: "q-3",
    question: "Which animal says 'Woof woof'?",
    options: [
      { id: "q3-a", label: "Dog", emoji: "🐶" },
      { id: "q3-b", label: "Cat", emoji: "🐱" },
      { id: "q3-c", label: "Monkey", emoji: "🐵" },
      { id: "q3-d", label: "Bear", emoji: "🐻" },
    ],
    correctOptionId: "q3-a",
  },
  {
    id: "q-4",
    question: "Which animal loves bananas?",
    options: [
      { id: "q4-a", label: "Dog", emoji: "🐶" },
      { id: "q4-b", label: "Cat", emoji: "🐱" },
      { id: "q4-c", label: "Monkey", emoji: "🐵" },
      { id: "q4-d", label: "Bear", emoji: "🐻" },
    ],
    correctOptionId: "q4-c",
  },
  {
    id: "q-5",
    question: "Which animal hibernates in winter?",
    options: [
      { id: "q5-a", label: "Dog", emoji: "🐶" },
      { id: "q5-b", label: "Cat", emoji: "🐱" },
      { id: "q5-c", label: "Monkey", emoji: "🐵" },
      { id: "q5-d", label: "Bear", emoji: "🐻" },
    ],
    correctOptionId: "q5-d",
  },
];

/** Which questions the learner already answered, and with what — drives the
 * grid overview colors before any new answers are picked in this session. */
export const ANSWERED_OPTION_BY_QUESTION: Record<string, string> = {
  "q-1": "q1-a",
  "q-2": "q2-b",
};

export const QUIZ_INFO = {
  bestScore: 80,
  timeLimitMinutes: 5,
  timeLeft: "02:30",
};

export const LEADERBOARD_ENTRIES: LeaderboardEntry[] = [
  { id: "lb-1", rank: 1, name: "Minh Anh", score: 1250 },
  { id: "lb-2", rank: 2, name: "Gia Hân", score: 980 },
  { id: "lb-3", rank: 3, name: "Đức Phát", score: 860 },
  { id: "lb-4", rank: 4, name: "Bảo Nam", score: 720 },
  { id: "lb-5", rank: 5, name: "Tuấn Kiệt", score: 650 },
];

export const GAME_INFO = {
  title: "Word Catcher",
  score: 250,
  stars: 3,
  timeLeft: "00:45",
  bubbles: [
    { id: "b-1", label: "Dog", color: "bg-emerald-300" },
    { id: "b-2", label: "Cat", color: "bg-pink-300" },
    { id: "b-3", label: "Woof", color: "bg-sky-300" },
    { id: "b-4", label: "Pet", color: "bg-violet-300" },
  ],
};

export const REWARD_INFO = {
  title: "Animal Explorer",
  description: "Catch 20 correct words in a game",
  progress: 0,
  target: 20,
  coins: 50,
};
