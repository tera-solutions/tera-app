import { ReactNode } from "react";
import { BookOpenOutlined, ChatBubbleLeftRightOutlined, SpeakerWaveOutlined } from "tera-dls";

import type { AudioContentType } from "./_interface";

export const CONTENT_TYPE_OPTIONS: {
  value: AudioContentType;
  icon: ReactNode;
  title: string;
  description: string;
}[] = [
  {
    value: "vocabulary",
    icon: <SpeakerWaveOutlined />,
    title: "Từ vựng",
    description: "Học từ vựng qua audio",
  },
  {
    value: "dialogue",
    icon: <ChatBubbleLeftRightOutlined />,
    title: "Hội thoại",
    description: "Đoạn hội thoại mẫu",
  },
  {
    value: "story",
    icon: <BookOpenOutlined />,
    title: "Kể chuyện",
    description: "Câu chuyện ngắn",
  },
];

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "🇬🇧 Tiếng Anh" },
  { value: "vi", label: "🇻🇳 Tiếng Việt" },
];

export const LEVEL_OPTIONS = [
  { value: "beginner_6_8", label: "Beginner (6-8 tuổi)" },
  { value: "elementary_9_11", label: "Elementary (9-11 tuổi)" },
  { value: "intermediate_12_14", label: "Intermediate (12-14 tuổi)" },
];

export const TAG_OPTIONS = [
  { value: "Animals", label: "Animals" },
  { value: "Vocabulary", label: "Vocabulary" },
  { value: "Kids", label: "Kids" },
  { value: "Conversation", label: "Conversation" },
  { value: "Story", label: "Story" },
];

export const MUSIC_OPTIONS = [
  { value: "happy_bright", label: "Happy & Bright" },
  { value: "soft_piano", label: "Soft Piano" },
  { value: "playful", label: "Playful" },
  { value: "none", label: "Không dùng nhạc nền" },
];

export const PLAYBACK_SPEED_OPTIONS = [
  { value: "0.75", label: "Chậm (0.75x)" },
  { value: "1.0", label: "Bình thường (1.0x)" },
  { value: "1.25", label: "Nhanh (1.25x)" },
];
