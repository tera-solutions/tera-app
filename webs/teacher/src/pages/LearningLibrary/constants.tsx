import { ReactNode } from "react";
import {
  BookOpenOutlined,
  ChatBubbleLeftRightOutlined,
  PuzzlePieceOutlined,
  RectangleStackOutlined,
  Squares2x2Outlined,
  DocumentTextOutlined,
  SpeakerWaveOutlined,
  VideoCameraOutlined,
} from "tera-dls";

import type { ResourceType } from "./_interface";

export const LIBRARY_TYPE_TABS: { key: string; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "video", label: "Video" },
  { key: "lesson_plan", label: "Giáo án" },
  { key: "worksheet", label: "Worksheet" },
  { key: "flashcard", label: "Flashcard" },
  { key: "audio", label: "Audio" },
  { key: "game", label: "Trò chơi" },
  { key: "comic", label: "Truyện tranh" },
  { key: "dialogue", label: "Hội thoại" },
];

export const RESOURCE_TYPE_META: Record<
  ResourceType,
  { icon: ReactNode; badgeClassName: string }
> = {
  video: { icon: <VideoCameraOutlined />, badgeClassName: "bg-sky-500 text-white" },
  lesson_plan: { icon: <BookOpenOutlined />, badgeClassName: "bg-white text-slate-600 border border-slate-200" },
  worksheet: { icon: <DocumentTextOutlined />, badgeClassName: "bg-white text-slate-600 border border-slate-200" },
  flashcard: { icon: <Squares2x2Outlined />, badgeClassName: "bg-white text-slate-600 border border-slate-200" },
  audio: { icon: <SpeakerWaveOutlined />, badgeClassName: "bg-white text-slate-600 border border-slate-200" },
  game: { icon: <PuzzlePieceOutlined />, badgeClassName: "bg-white text-slate-600 border border-slate-200" },
  comic: { icon: <RectangleStackOutlined />, badgeClassName: "bg-white text-slate-600 border border-slate-200" },
  dialogue: { icon: <ChatBubbleLeftRightOutlined />, badgeClassName: "bg-white text-slate-600 border border-slate-200" },
};

export const LEVEL_OPTIONS = [
  { value: "", label: "Cấp độ: Tất cả" },
  { value: "beginner", label: "Beginner" },
  { value: "elementary", label: "Elementary" },
  { value: "intermediate", label: "Intermediate" },
];

export const CATEGORY_TAGS = [
  "Speaking",
  "Reading",
  "Writing",
  "Listening",
  "Grammar",
  "Vocabulary",
  "Flashcard",
  "Game",
  "Pronunciation",
  "Homework",
  "Assessment",
];

export const SUBJECT_OPTIONS = [
  { value: "", label: "Môn học: Tất cả" },
  ...CATEGORY_TAGS.map((tag) => ({ value: tag, label: tag })),
];

export const LIBRARY_PAGE_SIZE = 6;

/** Types offered by the "Thêm học liệu" dropdown on the library list page. */
export const ADD_MATERIAL_TYPE_ITEMS: { value: string; label: string; icon: ReactNode }[] = [
  { value: "video", label: "Video", icon: <VideoCameraOutlined /> },
  { value: "ebook", label: "E-book", icon: <BookOpenOutlined /> },
  { value: "worksheet", label: "Worksheet", icon: <DocumentTextOutlined /> },
  { value: "flashcard", label: "Flashcard", icon: <Squares2x2Outlined /> },
  { value: "audio", label: "Audio", icon: <SpeakerWaveOutlined /> },
  { value: "game", label: "Trò chơi", icon: <PuzzlePieceOutlined /> },
  { value: "comic", label: "Truyện tranh", icon: <RectangleStackOutlined /> },
  { value: "dialogue", label: "Hội thoại", icon: <ChatBubbleLeftRightOutlined /> },
];
