import { ReactNode } from "react";
import {
  BookOpenOutlined,
  ChatBubbleBottomCenterTextOutlined,
  PuzzlePieceOutlined,
  QuestionMarkCircleOutlined,
} from "tera-dls";

import type { ContentConfigTabKey } from "./_interface";

export const MATERIAL_TYPE_SELECT_OPTIONS = [
  { value: "video", label: "▶ Video" },
  { value: "ebook", label: "📖 E-book" },
  { value: "worksheet", label: "📝 Worksheet" },
  { value: "flashcard", label: "🗂 Flashcard" },
  { value: "audio", label: "🔊 Audio" },
  { value: "game", label: "🎮 Trò chơi" },
  { value: "comic", label: "📚 Truyện tranh" },
];

export const LEVEL_SELECT_OPTIONS = [
  { value: "beginner", label: "🔰 Beginner (6-8 tuổi)" },
  { value: "elementary", label: "🔰 Elementary (9-11 tuổi)" },
  { value: "intermediate", label: "🔰 Intermediate (12-14 tuổi)" },
];

export const UNIT_SELECT_OPTIONS = [
  { value: "unit1", label: "📘 Unit 1: Colors" },
  { value: "unit2", label: "📘 Unit 2: Numbers" },
  { value: "unit3", label: "📘 Unit 3: Family" },
  { value: "unit5", label: "📘 Unit 5: Animals" },
  { value: "unit6", label: "📘 Unit 6: Grammar" },
];

export const TAG_SELECT_OPTIONS = [
  { value: "Animals", label: "Animals" },
  { value: "Vocabulary", label: "Vocabulary" },
  { value: "Grammar", label: "Grammar" },
  { value: "Reading", label: "Reading" },
  { value: "Listening", label: "Listening" },
  { value: "Kids", label: "Kids" },
  { value: "Beginner", label: "Beginner" },
  { value: "ESL", label: "ESL" },
];

export const SUBTITLE_DISPLAY_MODE_OPTIONS = [
  { value: "bilingual", label: "Hiển thị song ngữ (2 dòng)" },
  { value: "en_only", label: "Chỉ tiếng Anh" },
  { value: "vi_only", label: "Chỉ tiếng Việt" },
  { value: "toggle", label: "Chuyển đổi EN / VI" },
];

export const GAME_TYPE_OPTIONS = [
  { value: "word_catcher", label: "Word Catcher — bắt bong bóng từ vựng" },
  { value: "memory_match", label: "Memory Match — lật thẻ ghép cặp" },
  { value: "quiz_race", label: "Quiz Race — đua trả lời nhanh" },
  { value: "spelling_bee", label: "Spelling Bee — đánh vần từ" },
];

export const CONTENT_CONFIG_TABS: { key: ContentConfigTabKey; label: string; icon: ReactNode }[] = [
  { key: "subtitles", label: "Subtitles", icon: <ChatBubbleBottomCenterTextOutlined /> },
  { key: "reading", label: "Reading Material", icon: <BookOpenOutlined /> },
  { key: "quiz", label: "Quiz", icon: <QuestionMarkCircleOutlined /> },
  { key: "game", label: "Game", icon: <PuzzlePieceOutlined /> },
];
