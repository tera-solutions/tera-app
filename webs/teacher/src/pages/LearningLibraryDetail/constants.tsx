import { ReactNode } from "react";
import {
  BookOpenOutlined,
  MicrophoneOutlined,
  PuzzlePieceOutlined,
  QuestionMarkCircleOutlined,
  SpeakerWaveOutlined,
} from "tera-dls";

import type { DetailTabKey } from "./_interface";

export const DETAIL_TABS: { key: DetailTabKey; label: string; icon: ReactNode }[] = [
  { key: "listen", label: "Nghe", icon: <SpeakerWaveOutlined /> },
  { key: "read", label: "Đọc", icon: <BookOpenOutlined /> },
  { key: "dubbing", label: "Lồng tiếng", icon: <MicrophoneOutlined /> },
  { key: "quiz", label: "Quiz", icon: <QuestionMarkCircleOutlined /> },
  { key: "game", label: "Game", icon: <PuzzlePieceOutlined /> },
];

export const SCORE_COLOR = (score: number | null) => {
  if (score == null) return "bg-slate-100 text-slate-400";
  if (score >= 85) return "bg-emerald-50 text-emerald-600";
  if (score >= 60) return "bg-amber-50 text-amber-600";
  return "bg-rose-50 text-rose-600";
};

export const RANK_BADGE_CLASS = (rank: number) => {
  if (rank === 1) return "bg-amber-100 text-amber-600";
  if (rank === 2) return "bg-slate-200 text-slate-600";
  if (rank === 3) return "bg-orange-100 text-orange-600";
  return "bg-slate-100 text-slate-400";
};
