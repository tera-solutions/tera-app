import classNames from "classnames";
import { ArrowsRightLeftOutlined, ChevronLeftOutlined, ChevronRightOutlined } from "tera-dls";

import Card from "_common/components/Card";

import type { FlashcardDraft, FlashcardViewMode } from "../_interface";

interface PreviewSectionProps {
  cards: FlashcardDraft[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  cardCountTarget: number;
  viewMode: FlashcardViewMode;
  onViewModeChange: (mode: FlashcardViewMode) => void;
}

const PreviewSection = ({
  cards,
  activeIndex,
  onActiveIndexChange,
  cardCountTarget,
  viewMode,
  onViewModeChange,
}: PreviewSectionProps) => {
  const card = cards[activeIndex];

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold text-slate-800">3. Xem trước</p>

      {viewMode === "card" && card ? (
        <>
          <div className="mb-1 grid grid-cols-2 gap-3 text-center text-xs font-medium text-slate-500">
            <p>Mặt trước</p>
            <p>Mặt sau</p>
          </div>

          <div className="relative grid grid-cols-2 gap-3">
            <div
              className={`flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br text-6xl ${card.gradient}`}
            >
              {card.imageUrl ? (
                <img src={card.imageUrl} alt={card.word} className="h-full w-full object-cover" />
              ) : (
                <span>{card.emoji}</span>
              )}
            </div>

            <div className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-100 bg-white px-2 text-center shadow-sm">
              <p className="text-2xl font-bold text-slate-800">{card.word || "—"}</p>
              <p className="text-sm text-slate-400">{card.phonetic}</p>
              <p className="mt-2 text-sm text-slate-600">{card.meaning}</p>
            </div>

            <button
              type="button"
              className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white shadow"
            >
              <ArrowsRightLeftOutlined className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={activeIndex === 0}
              onClick={() => onActiveIndexChange(activeIndex - 1)}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeftOutlined className="h-4 w-4" /> Trước
            </button>
            <span className="text-sm text-slate-500">
              {activeIndex + 1} / {cardCountTarget}
            </span>
            <button
              type="button"
              disabled={activeIndex >= cards.length - 1}
              onClick={() => onActiveIndexChange(activeIndex + 1)}
              className="flex items-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sau <ChevronRightOutlined className="h-4 w-4" />
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col divide-y divide-slate-100 rounded-lg border border-slate-100">
          {cards.map((c, index) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onActiveIndexChange(index)}
              className={classNames(
                "flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-50",
                index === activeIndex && "bg-sky-50",
              )}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-lg">
                {c.imageUrl ? <img src={c.imageUrl} alt={c.word} className="h-full w-full rounded-lg object-cover" /> : c.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">{c.word || "—"}</p>
                <p className="truncate text-xs text-slate-400">{c.meaning}</p>
              </div>
              <span className="shrink-0 text-xs text-slate-400">{c.phonetic}</span>
            </button>
          ))}
        </div>
      )}

      <p className="mb-1.5 mt-4 text-sm font-medium text-slate-700">Chế độ xem</p>
      <div className="flex overflow-hidden rounded-lg border border-slate-200 text-sm font-medium">
        <button
          type="button"
          onClick={() => onViewModeChange("card")}
          className={classNames("flex-1 py-1.5", viewMode === "card" ? "bg-brand text-white" : "text-slate-500")}
        >
          Thẻ
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange("list")}
          className={classNames("flex-1 py-1.5", viewMode === "list" ? "bg-brand text-white" : "text-slate-500")}
        >
          Danh sách
        </button>
      </div>
    </Card>
  );
};

export default PreviewSection;
