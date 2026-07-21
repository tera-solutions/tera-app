import { Button, Input, InformationCircleOutlined, PlusOutlined, TrashOutlined } from "tera-dls";

import IconBox from "_common/components/IconBox";

import type { VocabularyItemDraft } from "../_interface";

let vocabIdCounter = 0;

interface VocabularyListPanelProps {
  items: VocabularyItemDraft[];
  onChange: (items: VocabularyItemDraft[]) => void;
}

const VocabularyListPanel = ({ items, onChange }: VocabularyListPanelProps) => {
  const handleChangeItem = (id: string, patch: Partial<VocabularyItemDraft>) =>
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const handleAdd = () => {
    vocabIdCounter += 1;
    onChange([...items, { id: `voc-new-${vocabIdCounter}`, emoji: "🔤", word: "", ipa: "", meaning: "" }]);
  };

  const handleRemove = (id: string) =>
    onChange(items.length > 1 ? items.filter((item) => item.id !== id) : items);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="flex items-center gap-1 text-sm font-medium text-slate-700">
          Danh sách từ vựng chính
          <span title="Từ vựng chính được trích xuất và làm nổi bật trong video">
            <InformationCircleOutlined className="h-3.5 w-3.5 text-slate-300" />
          </span>
        </p>
        <Button
          outlined
          icon={<PlusOutlined className="h-3.5 w-3.5" />}
          className="whitespace-nowrap border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:border-brand hover:text-brand"
          onClick={handleAdd}
        >
          Thêm từ vựng
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2 rounded-lg border border-slate-100 p-2">
            <span className="w-4 shrink-0 text-center text-xs text-slate-400">{index + 1}</span>
            <IconBox
              icon={<span>{item.emoji}</span>}
              sizeClassName="h-9 w-9"
              roundedClassName="rounded-lg"
              colorClassName="bg-amber-50"
              iconSizeClassName="text-lg"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-1.5">
                <Input
                  value={item.word}
                  onChange={(e) => handleChangeItem(item.id, { word: e.target.value })}
                  placeholder="từ vựng"
                  className="w-24 border-none px-1 py-0.5 text-sm font-medium focus:ring-0"
                />
                <Input
                  value={item.ipa}
                  onChange={(e) => handleChangeItem(item.id, { ipa: e.target.value })}
                  placeholder="/ipa/"
                  className="w-20 border-none px-1 py-0.5 text-xs text-slate-400 focus:ring-0"
                />
              </div>
              <Input
                value={item.meaning}
                onChange={(e) => handleChangeItem(item.id, { meaning: e.target.value })}
                placeholder="nghĩa tiếng Việt"
                className="border-none px-1 py-0.5 text-xs text-slate-500 focus:ring-0"
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemove(item.id)}
              disabled={items.length <= 1}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-slate-300 hover:bg-rose-50 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <TrashOutlined className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VocabularyListPanel;
