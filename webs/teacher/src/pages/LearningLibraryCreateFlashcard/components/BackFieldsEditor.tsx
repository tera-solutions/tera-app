import { Input, InformationCircleOutlined, SpeakerWaveOutlined, notification } from "tera-dls";

import type { FlashcardDraft } from "../_interface";

const WORD_MAX = 50;
const EXAMPLE_MAX = 100;

interface BackFieldsEditorProps {
  card: FlashcardDraft;
  onChange: (patch: Partial<FlashcardDraft>) => void;
}

const playPreview = () => notification.success({ message: "Đang phát thử phát âm..." });

const BackFieldsEditor = ({ card, onChange }: BackFieldsEditorProps) => (
  <div>
    <p className="mb-2 flex items-center gap-1 text-sm font-medium text-slate-700">
      Mặt sau (Back)
      <span title="Nội dung hiển thị khi lật thẻ">
        <InformationCircleOutlined className="h-3.5 w-3.5 text-slate-300" />
      </span>
    </p>

    <div className="flex flex-col gap-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">
          Từ vựng (Word) <span className="text-rose-500">*</span>
        </label>
        <Input
          value={card.word}
          onChange={(e) => onChange({ word: e.target.value.slice(0, WORD_MAX) })}
          placeholder="VD: Dog"
        />
        <p className="mt-1 text-right text-xs text-slate-400">
          {card.word.length}/{WORD_MAX}
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">Phiên âm (Phonetic)</label>
        <div className="flex items-center gap-2">
          <Input
            value={card.phonetic}
            onChange={(e) => onChange({ phonetic: e.target.value })}
            placeholder="/dɒg/"
            className="flex-1"
          />
          <button
            type="button"
            onClick={playPreview}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-brand hover:text-brand"
          >
            <SpeakerWaveOutlined className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">Nghĩa (Meaning)</label>
        <Input
          value={card.meaning}
          onChange={(e) => onChange({ meaning: e.target.value })}
          placeholder="VD: Con chó"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">Ví dụ (Example)</label>
        <div className="flex items-center gap-2">
          <Input
            value={card.example}
            onChange={(e) => onChange({ example: e.target.value.slice(0, EXAMPLE_MAX) })}
            placeholder="VD: The dog is playful."
            className="flex-1"
          />
          <button
            type="button"
            onClick={playPreview}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-brand hover:text-brand"
          >
            <SpeakerWaveOutlined className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-right text-xs text-slate-400">
          {card.example.length}/{EXAMPLE_MAX}
        </p>
      </div>
    </div>
  </div>
);

export default BackFieldsEditor;
