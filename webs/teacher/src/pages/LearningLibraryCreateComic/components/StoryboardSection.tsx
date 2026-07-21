import { useState } from "react";
import classNames from "classnames";
import {
  ArrowsUpDownOutlined,
  Button,
  ChevronLeftOutlined,
  ChevronRightOutlined,
  DocumentDuplicateOutlined,
  Dropdown,
  EllipsisHorizontalOutlined,
  Input,
  PlusOutlined,
  TrashOutlined,
} from "tera-dls";

import Card from "_common/components/Card";

import type { ComicFrameDraft } from "../_interface";

const FRAME_GRADIENTS = [
  "from-sky-200 to-emerald-100",
  "from-amber-200 to-orange-100",
  "from-pink-200 to-rose-100",
  "from-violet-200 to-purple-100",
  "from-lime-200 to-teal-100",
];

interface StoryboardSectionProps {
  frames: ComicFrameDraft[];
  onChange: (frames: ComicFrameDraft[]) => void;
}

let frameIdCounter = 0;

const StoryboardSection = ({ frames, onChange }: StoryboardSectionProps) => {
  const [selectedId, setSelectedId] = useState(frames[0]?.id ?? "");
  const [reorderMode, setReorderMode] = useState(false);

  const selectedIndex = frames.findIndex((f) => f.id === selectedId);

  const handleAddFrame = () => {
    frameIdCounter += 1;
    const gradient = FRAME_GRADIENTS[frames.length % FRAME_GRADIENTS.length];
    const newFrame: ComicFrameDraft = {
      id: `frame-new-${frameIdCounter}`,
      gradient,
      emoji: "🧒",
      caption: "",
    };
    onChange([...frames, newFrame]);
    setSelectedId(newFrame.id);
  };

  const handleDuplicate = (id: string) => {
    const index = frames.findIndex((f) => f.id === id);
    if (index === -1) return;
    frameIdCounter += 1;
    const copy: ComicFrameDraft = { ...frames[index], id: `frame-copy-${frameIdCounter}` };
    const next = [...frames.slice(0, index + 1), copy, ...frames.slice(index + 1)];
    onChange(next);
    setSelectedId(copy.id);
  };

  const handleRemove = (id: string) => {
    if (frames.length <= 1) return;
    const next = frames.filter((f) => f.id !== id);
    onChange(next);
    if (selectedId === id) setSelectedId(next[0]?.id ?? "");
  };

  const handleCaptionChange = (id: string, caption: string) =>
    onChange(frames.map((f) => (f.id === id ? { ...f, caption } : f)));

  const handleMove = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= frames.length) return;
    const next = [...frames];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    onChange(next);
  };

  return (
    <Card>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-800">2. Kịch bản truyện (Storyboard)</p>
      </div>
      <p className="mb-3 text-xs text-slate-400">Thêm các khung truyện để tạo nên câu chuyện của bạn.</p>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            outlined
            icon={<PlusOutlined />}
            className="border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
            onClick={handleAddFrame}
          >
            Thêm khung
          </Button>
          <Button
            outlined
            icon={<DocumentDuplicateOutlined />}
            className="border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
            disabled={!selectedId}
            onClick={() => selectedId && handleDuplicate(selectedId)}
          >
            Sao chép
          </Button>
          <Button
            outlined
            icon={<TrashOutlined />}
            className="border-slate-200 text-slate-600 hover:border-rose-400 hover:text-rose-500"
            disabled={!selectedId || frames.length <= 1}
            onClick={() => selectedId && handleRemove(selectedId)}
          >
            Xóa
          </Button>
        </div>

        <Button
          outlined
          icon={<ArrowsUpDownOutlined />}
          className={classNames(
            "border-slate-200 text-slate-600 hover:border-brand hover:text-brand",
            reorderMode && "border-brand text-brand",
          )}
          onClick={() => setReorderMode((v) => !v)}
        >
          Sắp xếp
        </Button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {frames.map((frame, index) => {
          const active = frame.id === selectedId;
          return (
            <div
              key={frame.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedId(frame.id)}
              className={classNames(
                "w-44 shrink-0 rounded-xl border-2 p-1.5 transition-colors",
                active ? "border-brand" : "border-transparent hover:border-slate-200",
              )}
            >
              <div
                className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br text-4xl ${frame.gradient}`}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white absolute left-1.5 top-1.5">
                  {index + 1}
                </span>

                <Dropdown
                  trigger="click"
                  menu={{
                    items: [
                      {
                        key: "duplicate",
                        icon: <DocumentDuplicateOutlined className="h-4 w-4" />,
                        label: "Sao chép",
                        onClick: () => handleDuplicate(frame.id),
                      },
                      {
                        key: "delete",
                        icon: <TrashOutlined className="h-4 w-4" />,
                        label: "Xóa",
                        onClick: () => handleRemove(frame.id),
                      },
                    ],
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-slate-500 hover:bg-white"
                  >
                    <EllipsisHorizontalOutlined className="h-4 w-4" />
                  </button>
                </Dropdown>

                <span>{frame.emoji}</span>

                {reorderMode && (
                  <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, -1)}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-slate-500 hover:bg-white disabled:opacity-30"
                    >
                      <ChevronLeftOutlined className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === frames.length - 1}
                      onClick={() => handleMove(index, 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-slate-500 hover:bg-white disabled:opacity-30"
                    >
                      <ChevronRightOutlined className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <Input
                value={frame.caption}
                onChange={(e) => handleCaptionChange(frame.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Lời thoại / chú thích..."
                className="mt-1.5 border-none px-1 text-xs text-slate-600 focus:ring-0"
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default StoryboardSection;
