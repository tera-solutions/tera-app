import type { FlashcardDraft } from "./_interface";

export const DEFAULT_CARDS: FlashcardDraft[] = [
  {
    id: "card-1",
    emoji: "🐶",
    gradient: "from-sky-200 to-emerald-100",
    imageUrl: "",
    word: "Dog",
    phonetic: "/dɒg/",
    meaning: "Con chó",
    example: "The dog is playful.",
  },
  {
    id: "card-2",
    emoji: "🐱",
    gradient: "from-pink-200 to-rose-100",
    imageUrl: "",
    word: "Cat",
    phonetic: "/kæt/",
    meaning: "Con mèo",
    example: "The cat is sleeping.",
  },
  {
    id: "card-3",
    emoji: "🐦",
    gradient: "from-amber-200 to-yellow-100",
    imageUrl: "",
    word: "Bird",
    phonetic: "/bɜːd/",
    meaning: "Con chim",
    example: "The bird can fly.",
  },
  {
    id: "card-4",
    emoji: "🐟",
    gradient: "from-cyan-200 to-blue-100",
    imageUrl: "",
    word: "Fish",
    phonetic: "/fɪʃ/",
    meaning: "Con cá",
    example: "The fish swims fast.",
  },
];
