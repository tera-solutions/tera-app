import classNames from "classnames";
import { ChevronRightOutlined, ClockOutlined, GiftTopOutlined, SpeakerWaveOutlined, StarSolid, TrophyOutlined } from "tera-dls";

import Card from "_common/components/Card";
import { CARD_LINK } from "_common/constants/dashboard";

import type { LeaderboardEntry } from "../../_interface";
import { RANK_BADGE_CLASS } from "../../constants";
import { GAME_INFO, REWARD_INFO } from "../../mock";

interface GameTabProps {
  leaderboard: LeaderboardEntry[];
}

const GameTab = ({ leaderboard }: GameTabProps) => (
  <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
    <Card>
      <div className="relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-sky-200 to-emerald-200">
        <div className="absolute left-3 top-3 rounded-lg bg-white/90 px-3 py-1.5 text-sm shadow">
          <p className="font-semibold text-slate-700">Score: {GAME_INFO.score}</p>
          <p className="flex gap-0.5 text-amber-400">
            {Array.from({ length: GAME_INFO.stars }).map((_, i) => (
              <StarSolid key={i} className="h-4 w-4" />
            ))}
          </p>
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-semibold text-slate-700 shadow">
          <ClockOutlined className="h-4 w-4 text-brand" />
          {GAME_INFO.timeLeft}
        </div>

        <p className="rounded-full bg-white/80 px-5 py-1.5 text-xl font-extrabold text-emerald-700 shadow">
          {GAME_INFO.title}
        </p>

        <div className="relative mt-4 flex w-full flex-1 items-center justify-center gap-6 text-2xl font-bold text-slate-700">
          {GAME_INFO.bubbles.map((bubble) => (
            <span
              key={bubble.id}
              className={classNames(
                "flex h-20 w-20 items-center justify-center rounded-full text-base shadow",
                bubble.color,
              )}
            >
              {bubble.label}
            </span>
          ))}
        </div>

        <div className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand shadow [&_svg]:h-4.5 [&_svg]:w-4.5">
          <SpeakerWaveOutlined />
        </div>
        <div className="absolute bottom-3 right-4 text-5xl">🐶</div>
      </div>
    </Card>

    <div className="flex flex-col gap-4">
      <Card>
        <div className="mb-3 flex items-center gap-2">
          <TrophyOutlined className="h-5 w-5 text-amber-500" />
          <p className="text-sm font-semibold text-slate-800">Class Leaderboard</p>
        </div>

        <div className="flex flex-col gap-2.5">
          {leaderboard.map((entry) => (
            <div key={entry.id} className="flex items-center gap-3">
              <span
                className={classNames(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  RANK_BADGE_CLASS(entry.rank),
                )}
              >
                {entry.rank}
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sm">
                🧒
              </span>
              <span className="flex-1 truncate text-sm font-medium text-slate-700">{entry.name}</span>
              <span className="text-sm font-semibold text-slate-800">
                {entry.score.toLocaleString("vi-VN")}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className={`mt-3 flex w-full items-center justify-center gap-1 ${CARD_LINK}`}
        >
          Xem bảng xếp hạng đầy đủ
          <ChevronRightOutlined className="h-3.5 w-3.5" />
        </button>
      </Card>

      <Card>
        <div className="mb-3 flex items-center gap-2">
          <GiftTopOutlined className="h-5 w-5 text-violet-500" />
          <p className="text-sm font-semibold text-slate-800">Phần thưởng</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-2xl">
            🥇
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-slate-800">{REWARD_INFO.title} 🏅</p>
            <p className="truncate text-xs text-slate-400">{REWARD_INFO.description}</p>
          </div>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-violet-500"
            style={{ width: `${(REWARD_INFO.progress / REWARD_INFO.target) * 100}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-slate-400">
          {REWARD_INFO.progress} / {REWARD_INFO.target}
        </p>

        <div className="mt-3 flex items-center gap-3 rounded-lg bg-amber-50 px-3 py-2.5">
          <span className="text-xl">🪙</span>
          <div>
            <p className="text-sm font-semibold text-amber-700">+{REWARD_INFO.coins} Coins</p>
            <p className="text-xs text-amber-600">Hoàn thành thử thách để nhận thưởng!</p>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

export default GameTab;
