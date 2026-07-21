import { ReactNode } from "react";
import { ChatBubbleLeftRightOutlined, UsersOutlined } from "tera-dls";

import type { DialogueContentType } from "./_interface";

export const CONTENT_TYPE_OPTIONS: {
  value: DialogueContentType;
  icon: ReactNode;
  title: string;
  description: string;
}[] = [
  {
    value: "dialogue",
    icon: <ChatBubbleLeftRightOutlined />,
    title: "Hội thoại",
    description: "Video hội thoại có kịch bản và tình huống giao tiếp",
  },
  {
    value: "vocabulary",
    icon: <UsersOutlined />,
    title: "Từ vựng",
    description: "Video dạy từ vựng với hình ảnh minh họa",
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
  { value: "Pets", label: "Pets" },
  { value: "Vocabulary", label: "Vocabulary" },
  { value: "Conversation", label: "Conversation" },
  { value: "Kids", label: "Kids" },
  { value: "Shopping", label: "Shopping" },
];

export const MUSIC_OPTIONS = [
  { value: "happy_bright", label: "Happy & Bright" },
  { value: "soft_piano", label: "Soft Piano" },
  { value: "playful", label: "Playful" },
  { value: "none", label: "Không dùng nhạc nền" },
];

export const SUBTITLE_LANGUAGE_OPTIONS = [
  { value: "vi", label: "Tiếng Việt" },
  { value: "en", label: "Tiếng Anh" },
  { value: "bilingual", label: "Song ngữ" },
];

export const SUBTITLE_SPEED_OPTIONS = [
  { value: "slow", label: "Chậm" },
  { value: "normal", label: "Bình thường" },
  { value: "fast", label: "Nhanh" },
];

export const SUBTITLE_POSITION_OPTIONS = [
  { value: "top", label: "Trên video (đầu)" },
  { value: "middle", label: "Dưới video (giữa)" },
  { value: "bottom", label: "Dưới video (cuối)" },
];

export const VISIBILITY_OPTIONS = [
  { value: "all", label: "Tất cả học viên" },
  { value: "classroom", label: "Lớp học cụ thể" },
];

export const CLASSROOM_OPTIONS = [
  { value: "", label: "Chọn lớp học" },
  { value: "starters_2a", label: "Starters 2A" },
  { value: "movers_1b", label: "Movers 1B" },
  { value: "flyers_3a", label: "Flyers 3A" },
];
