import classNames from "classnames";
import { Checkbox, DocumentDuplicateOutlined, PlusOutlined, TableCellsOutlined, notification } from "tera-dls";

import Card from "_common/components/Card";

import type { FlashcardDraft } from "../_interface";
import FrontImageEditor from "./FrontImageEditor";
import BackFieldsEditor from "./BackFieldsEditor";

const CARD_GRADIENTS = [
  "from-sky-200 to-emerald-100",
  "from-pink-200 to-rose-100",
  "from-amber-200 to-yellow-100",
  "from-cyan-200 to-blue-100",
  "from-violet-200 to-purple-100",
];

let cardIdCounter = 0;

interface CardDesignSectionProps {
  cards: FlashcardDraft[];
  onChangeCards: (cards: FlashcardDraft[]) => void;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  reverseOnReview: boolean;
  onReverseOnReviewChange: (value: boolean) => void;
}

const CardDesignSection = ({
  cards,
  onChangeCards,
  activeIndex,
  onActiveIndexChange,
  reverseOnReview,
  onReverseOnReviewChange,
}: CardDesignSectionProps) => {
  const activeCard = cards[activeIndex];

  const handleAddCard = () => {
    cardIdCounter += 1;
    const gradient = CARD_GRADIENTS[cards.length % CARD_GRADIENTS.length];
    onChangeCards([
      ...cards,
      { id: `card-new-${cardIdCounter}`, emoji: "🔤", gradient, imageUrl: "", word: "", phonetic: "", meaning: "", example: "" },
    ]);
    onActiveIndexChange(cards.length);
  };

  const handleDuplicateActive = () => {
    if (!activeCard) return;
    cardIdCounter += 1;
    const copy: FlashcardDraft = { ...activeCard, id: `card-copy-${cardIdCounter}` };
    const next = [...cards.slice(0, activeIndex + 1), copy, ...cards.slice(activeIndex + 1)];
    onChangeCards(next);
    onActiveIndexChange(activeIndex + 1);
  };

  const handleChangeActiveCard = (patch: Partial<FlashcardDraft>) =>
    onChangeCards(cards.map((c, i) => (i === activeIndex ? { ...c, ...patch } : c)));

  if (!activeCard) return null;

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold text-slate-800">2. Thiết kế flashcard</p>

      <div className="mb-4 flex flex-wrap items-center gap-1 border-b border-slate-100">
        {cards.map((c, index) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onActiveIndexChange(index)}
            className={classNames(
              "border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              index === activeIndex
                ? "border-brand text-brand"
                : "border-transparent text-slate-500 hover:text-slate-700",
            )}
          >
            Thẻ {index + 1}
          </button>
        ))}
        <button
          type="button"
          onClick={handleAddCard}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-500 hover:text-brand"
        >
          <PlusOutlined className="h-3.5 w-3.5" /> Thêm thẻ
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FrontImageEditor
          emoji={activeCard.emoji}
          gradient={activeCard.gradient}
          imageUrl={activeCard.imageUrl}
          onUpload={(file) => file && handleChangeActiveCard({ imageUrl: URL.createObjectURL(file) })}
          onRemove={() => handleChangeActiveCard({ imageUrl: "" })}
          onOpenLibrary={() => notification.warning({ message: "Tính năng đang được phát triển" })}
          onAiGenerate={() => notification.warning({ message: "Tính năng đang được phát triển" })}
        />

        <BackFieldsEditor card={activeCard} onChange={handleChangeActiveCard} />
      </div>

      <div className="mt-4">
        <Checkbox checked={reverseOnReview} onChange={(e: any) => onReverseOnReviewChange(e.target.checked)}>
          <span className="text-sm text-slate-600">Đảo ngược mặt thẻ khi ôn tập</span>
        </Checkbox>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <p className="mb-2 text-sm font-medium text-slate-700">Thêm nhanh thẻ</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleAddCard}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:border-brand hover:text-brand"
          >
            <PlusOutlined className="h-4 w-4" /> Thêm thẻ mới
          </button>
          <button
            type="button"
            onClick={handleDuplicateActive}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:border-brand hover:text-brand"
          >
            <DocumentDuplicateOutlined className="h-4 w-4" /> Nhân bản thẻ này
          </button>
          <button
            type="button"
            onClick={() => notification.warning({ message: "Tính năng đang được phát triển" })}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-1.5 text-sm text-emerald-600 hover:border-emerald-400"
          >
            <TableCellsOutlined className="h-4 w-4" /> Nhập từ Excel
          </button>
        </div>
      </div>
    </Card>
  );
};

export default CardDesignSection;
