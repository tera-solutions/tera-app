import type { DialogueLineDraft, VocabularyItemDraft } from "./_interface";

export const DEFAULT_DIALOGUE_LINES: DialogueLineDraft[] = [
  { id: "line-1", character: "Tom", lineEn: "Hello! I want to buy a pet.", lineVi: "Xin chào! Tớ muốn mua một con thú cưng.", duration: "00:04" },
  { id: "line-2", character: "Shopkeeper", lineEn: "What kind of pet do you like?", lineVi: "Bạn thích loại thú cưng nào?", duration: "00:04" },
  { id: "line-3", character: "Tom", lineEn: "I like dogs. They are so cute.", lineVi: "Tớ thích chó. Chúng rất dễ thương!", duration: "00:05" },
  { id: "line-4", character: "Shopkeeper", lineEn: "Here is a small puppy. Do you like it?", lineVi: "Đây là một chú chó con nhỏ. Bạn có thích không?", duration: "00:05" },
];

export const DEFAULT_VOCABULARY_ITEMS: VocabularyItemDraft[] = [
  { id: "voc-1", emoji: "🐶", word: "dog", ipa: "/dɒg/", meaning: "con chó" },
  { id: "voc-2", emoji: "🐱", word: "cat", ipa: "/kæt/", meaning: "con mèo" },
  { id: "voc-3", emoji: "🏬", word: "pet shop", ipa: "/ˈpet ʃɒp/", meaning: "cửa hàng thú cưng" },
  { id: "voc-4", emoji: "🐕", word: "puppy", ipa: "/ˈpʌpi/", meaning: "chó con" },
];

export const DEFAULT_TAGS = ["Animals", "Pets", "Vocabulary", "Conversation", "Kids"];

export const DEFAULT_COVER_GRADIENT = "from-orange-200 to-amber-100";
