import { useState } from "react";
import { Button, CheckOutlined, Input, PencilOutlined, PlusOutlined, SpeakerWaveOutlined, TableCellsOutlined, TrashOutlined, notification } from "tera-dls";

import Card from "_common/components/Card";

import type { AudioContentItemDraft } from "../_interface";

let itemIdCounter = 0;

interface ContentListSectionProps {
  items: AudioContentItemDraft[];
  onChange: (items: AudioContentItemDraft[]) => void;
}

const ContentListSection = ({ items, onChange }: ContentListSectionProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleChangeItem = (id: string, patch: Partial<AudioContentItemDraft>) =>
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const handleAdd = () => {
    itemIdCounter += 1;
    const newItem: AudioContentItemDraft = {
      id: `item-new-${itemIdCounter}`,
      textEn: "",
      textVi: "",
      startTime: "00:00.00",
      endTime: "00:00.00",
    };
    onChange([...items, newItem]);
    setEditingId(newItem.id);
  };

  const handleRemove = (id: string) => onChange(items.filter((item) => item.id !== id));

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold text-slate-800">3. Danh sách nội dung trong audio (Từ vựng/Hội thoại)</p>

      <div className="overflow-hidden rounded-lg border border-slate-100">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
              <th className="w-10 px-3 py-2.5">#</th>
              <th className="px-3 py-2.5">Nội dung (English)</th>
              <th className="px-3 py-2.5">Dịch nghĩa (Tiếng Việt)</th>
              <th className="w-28 px-3 py-2.5">Thời gian bắt đầu</th>
              <th className="w-28 px-3 py-2.5">Thời gian kết thúc</th>
              <th className="w-20 px-3 py-2.5">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, index) => {
              const editing = editingId === item.id;
              return (
                <tr key={item.id}>
                  <td className="px-3 py-2 text-slate-400">{index + 1}</td>
                  <td className="px-3 py-2">
                    {editing ? (
                      <Input
                        value={item.textEn}
                        onChange={(e) => handleChangeItem(item.id, { textEn: e.target.value })}
                        className="text-sm"
                      />
                    ) : (
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <SpeakerWaveOutlined className="h-3.5 w-3.5 text-brand" />
                        {item.textEn || "—"}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {editing ? (
                      <Input
                        value={item.textVi}
                        onChange={(e) => handleChangeItem(item.id, { textVi: e.target.value })}
                        className="text-sm"
                      />
                    ) : (
                      <span className="text-slate-600">{item.textVi || "—"}</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {editing ? (
                      <Input
                        value={item.startTime}
                        onChange={(e) => handleChangeItem(item.id, { startTime: e.target.value })}
                        className="w-24 text-sm"
                      />
                    ) : (
                      <span className="text-slate-500">{item.startTime}</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {editing ? (
                      <Input
                        value={item.endTime}
                        onChange={(e) => handleChangeItem(item.id, { endTime: e.target.value })}
                        className="w-24 text-sm"
                      />
                    ) : (
                      <span className="text-slate-500">{item.endTime}</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingId(editing ? null : item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-sky-50 hover:text-brand"
                      >
                        {editing ? <CheckOutlined className="h-4 w-4" /> : <PencilOutlined className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                      >
                        <TrashOutlined className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <Button
          outlined
          icon={<PlusOutlined />}
          className="border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
          onClick={handleAdd}
        >
          Thêm nội dung
        </Button>
        <Button
          outlined
          icon={<TableCellsOutlined />}
          className="border-emerald-200 text-emerald-600 hover:border-emerald-400"
          onClick={() => notification.warning({ message: "Tính năng đang được phát triển" })}
        >
          Nhập từ Excel
        </Button>
      </div>
    </Card>
  );
};

export default ContentListSection;
