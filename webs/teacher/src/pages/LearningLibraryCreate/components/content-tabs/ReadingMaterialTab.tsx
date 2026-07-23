import { Button, Input, PlusOutlined, TextArea, TrashOutlined } from "tera-dls";

import type { ReadingPageDraft } from "../../_interface";

interface ReadingMaterialTabProps {
  pages: ReadingPageDraft[];
  onChangePage: (id: string, patch: Partial<ReadingPageDraft>) => void;
  onAddPage: () => void;
  onRemovePage: (id: string) => void;
}

const ReadingMaterialTab = ({ pages, onChangePage, onAddPage, onRemovePage }: ReadingMaterialTabProps) => (
  <div className="flex flex-col gap-3">
    <p className="text-sm text-slate-500">
      Thêm nội dung bài đọc (e-book) đi kèm video, mỗi trang gồm ảnh minh họa và đoạn văn ngắn.
    </p>

    {pages.map((page, index) => (
      <div key={page.id} className="rounded-xl border border-slate-100 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-50 text-xs font-semibold text-brand">
            {index + 1}
          </span>
          {pages.length > 1 && (
            <button
              type="button"
              onClick={() => onRemovePage(page.id)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500"
            >
              <TrashOutlined className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mb-2">
          <label className="mb-1 block text-xs font-medium text-slate-500">Tiêu đề trang</label>
          <Input
            value={page.title}
            onChange={(e) => onChangePage(page.id, { title: e.target.value })}
            placeholder="VD: Giraffe"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Nội dung</label>
          <TextArea
            value={page.content}
            onChange={(e) => onChangePage(page.id, { content: e.target.value })}
            placeholder="Đoạn văn ngắn mô tả nội dung trang..."
            rows={3}
          />
        </div>
      </div>
    ))}

    <Button
      outlined
      icon={<PlusOutlined />}
      className="self-start border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
      onClick={onAddPage}
    >
      Thêm trang
    </Button>
  </div>
);

export default ReadingMaterialTab;
