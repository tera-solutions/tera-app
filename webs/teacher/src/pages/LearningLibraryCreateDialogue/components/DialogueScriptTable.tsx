import { Button, Input, InformationCircleOutlined, PencilSquareOutlined, PlusOutlined, TrashOutlined, notification } from "tera-dls";

import type { DialogueLineDraft } from "../_interface";

const characterEmoji = (name: string) => {
  const key = name.trim().toLowerCase();
  if (key === "tom") return "🧒";
  if (key === "shopkeeper") return "👩";
  return "🧑";
};

let lineIdCounter = 0;

interface DialogueScriptTableProps {
  lines: DialogueLineDraft[];
  onChange: (lines: DialogueLineDraft[]) => void;
}

const DialogueScriptTable = ({ lines, onChange }: DialogueScriptTableProps) => {
  const handleChangeLine = (id: string, patch: Partial<DialogueLineDraft>) =>
    onChange(lines.map((line) => (line.id === id ? { ...line, ...patch } : line)));

  const handleAddLine = () => {
    lineIdCounter += 1;
    onChange([
      ...lines,
      { id: `line-new-${lineIdCounter}`, character: "", lineEn: "", lineVi: "", duration: "00:00" },
    ]);
  };

  const handleRemoveLine = (id: string) =>
    onChange(lines.length > 1 ? lines.filter((line) => line.id !== id) : lines);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="flex items-center gap-1 text-sm font-medium text-slate-700">
          Kịch bản hội thoại
          <span title="Nội dung lời thoại theo từng nhân vật, hiển thị dạng phụ đề trên video">
            <InformationCircleOutlined className="h-3.5 w-3.5 text-slate-300" />
          </span>
        </p>
        <Button
          outlined
          icon={<PencilSquareOutlined className="h-3.5 w-3.5" />}
          className="whitespace-nowrap border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:border-brand hover:text-brand"
          onClick={() => notification.warning({ message: "Tính năng đang được phát triển" })}
        >
          Quản lý kịch bản
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-100">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-slate-500">
              <th className="w-8 px-2 py-2">#</th>
              <th className="w-28 px-2 py-2">Nhân vật</th>
              <th className="px-2 py-2">Lời thoại (Tiếng Anh)</th>
              <th className="px-2 py-2">Dịch nghĩa</th>
              <th className="w-16 px-2 py-2">Thời lượng</th>
              <th className="w-8 px-2 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lines.map((line, index) => (
              <tr key={line.id} className="align-top">
                <td className="px-2 py-2 text-slate-400">{index + 1}</td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-1.5">
                    <span>{characterEmoji(line.character)}</span>
                    <Input
                      value={line.character}
                      onChange={(e) => handleChangeLine(line.id, { character: e.target.value })}
                      placeholder="Tên"
                      className="border-none px-1 py-0.5 text-xs focus:ring-0"
                    />
                  </div>
                </td>
                <td className="px-2 py-2">
                  <Input
                    value={line.lineEn}
                    onChange={(e) => handleChangeLine(line.id, { lineEn: e.target.value })}
                    placeholder="Lời thoại tiếng Anh..."
                    className="border-none px-1 py-0.5 text-xs focus:ring-0"
                  />
                </td>
                <td className="px-2 py-2">
                  <Input
                    value={line.lineVi}
                    onChange={(e) => handleChangeLine(line.id, { lineVi: e.target.value })}
                    placeholder="Dịch nghĩa..."
                    className="border-none px-1 py-0.5 text-xs focus:ring-0"
                  />
                </td>
                <td className="px-2 py-2 text-slate-500">{line.duration}</td>
                <td className="px-2 py-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveLine(line.id)}
                    disabled={lines.length <= 1}
                    className="flex h-6 w-6 items-center justify-center rounded text-slate-300 hover:bg-rose-50 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <TrashOutlined className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button
        outlined
        icon={<PlusOutlined className="h-3.5 w-3.5" />}
        className="mt-2 border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:border-brand hover:text-brand"
        onClick={handleAddLine}
      >
        Thêm dòng thoại
      </Button>
    </div>
  );
};

export default DialogueScriptTable;
