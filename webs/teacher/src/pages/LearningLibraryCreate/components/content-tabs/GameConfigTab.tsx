import { InputNumber, Select } from "tera-dls";

import { GAME_TYPE_OPTIONS } from "../../constants";
import type { GameConfigDraft } from "../../_interface";

const VOCABULARY_OPTIONS = [
  { value: "Dog", label: "Dog" },
  { value: "Cat", label: "Cat" },
  { value: "Woof", label: "Woof" },
  { value: "Pet", label: "Pet" },
  { value: "Giraffe", label: "Giraffe" },
  { value: "Leaves", label: "Leaves" },
];

interface GameConfigTabProps {
  value: GameConfigDraft;
  onChange: (patch: Partial<GameConfigDraft>) => void;
}

const GameConfigTab = ({ value, onChange }: GameConfigTabProps) => {
  const selectedGame = GAME_TYPE_OPTIONS.find((o) => o.value === value.gameType);

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Loại trò chơi</label>
        <Select
          value={value.gameType}
          options={GAME_TYPE_OPTIONS}
          onChange={(v) => onChange({ gameType: v as string })}
        />
        {selectedGame && (
          <p className="mt-1 text-xs text-slate-400">Học viên sẽ chơi: {selectedGame.label}</p>
        )}
      </div>

      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Từ vựng áp dụng</label>
        <Select
          mode="multiple"
          value={value.vocabulary as any}
          options={VOCABULARY_OPTIONS}
          onChange={(v) => onChange({ vocabulary: v as unknown as string[] })}
          placeholder="Chọn từ vựng dùng trong trò chơi"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Thời gian chơi (giây)</label>
        <InputNumber
          min={10}
          value={value.playSeconds}
          onChange={(v: any) => onChange({ playSeconds: Number(v) || 10 })}
          className="w-full"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Điểm thưởng (Coins)</label>
        <InputNumber
          min={0}
          value={value.rewardCoins}
          onChange={(v: any) => onChange({ rewardCoins: Number(v) || 0 })}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default GameConfigTab;
