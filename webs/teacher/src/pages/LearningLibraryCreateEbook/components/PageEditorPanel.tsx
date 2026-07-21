import {
  ArrowUturnLeftOutline,
  Bars3BottomLeftOutlined,
  Bars3BottomRightOutlined,
  ArrowUturnRightOutlined,
  EllipsisHorizontalOutlined,
  Input,
  LinkOutlined,
  ListBulletOutlined,
  PhotoOutlined,
  QueueListOutlined,
  Select,
  TextArea,
} from "tera-dls";

import type { EbookPageDraft } from "../_interface";
import { HEADING_STYLE_OPTIONS } from "../constants";

interface PageEditorPanelProps {
  page: EbookPageDraft;
  onChange: (patch: Partial<EbookPageDraft>) => void;
}

const PageEditorPanel = ({ page, onChange }: PageEditorPanelProps) => (
  <div>
    <p className="mb-2 text-sm font-medium text-slate-700">Chỉnh sửa trang: {page.title}</p>

    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5 text-slate-500">
        <button type="button" className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-200/70">
          <ArrowUturnLeftOutline className="h-4 w-4" />
        </button>
        <button type="button" className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-200/70">
          <ArrowUturnRightOutlined className="h-4 w-4" />
        </button>
        <Select value="title1" options={HEADING_STYLE_OPTIONS} className="mx-1 w-32" />
        <button type="button" className="flex h-7 w-7 items-center justify-center rounded font-bold hover:bg-slate-200/70">
          B
        </button>
        <button type="button" className="flex h-7 w-7 items-center justify-center rounded underline hover:bg-slate-200/70">
          U
        </button>
        <button type="button" className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-200/70">
          <Bars3BottomLeftOutlined className="h-4 w-4" />
        </button>
        <button type="button" className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-200/70">
          <Bars3BottomRightOutlined className="h-4 w-4" />
        </button>
        <button type="button" className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-200/70">
          <ListBulletOutlined className="h-4 w-4" />
        </button>
        <button type="button" className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-200/70">
          <QueueListOutlined className="h-4 w-4" />
        </button>
        <button type="button" className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-200/70">
          <PhotoOutlined className="h-4 w-4" />
        </button>
        <button type="button" className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-200/70">
          <LinkOutlined className="h-4 w-4" />
        </button>
        <button type="button" className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-200/70">
          <EllipsisHorizontalOutlined className="h-4 w-4" />
        </button>
      </div>

      <div
        className={`flex min-h-72 flex-col items-center justify-center gap-3 bg-gradient-to-br px-6 py-8 text-center ${page.gradient}`}
      >
        <span className="text-5xl">{page.emoji}</span>
        <TextArea
          value={page.headline}
          onChange={(e) => onChange({ headline: e.target.value })}
          rows={2}
          className="w-full max-w-md resize-none border-none bg-transparent text-center text-3xl font-extrabold leading-tight text-white drop-shadow focus:ring-0"
        />
        {page.body !== undefined && (
          <TextArea
            value={page.body}
            onChange={(e) => onChange({ body: e.target.value })}
            rows={2}
            placeholder="Nội dung trang..."
            className="w-full max-w-md resize-none border-none bg-white/70 text-center text-sm text-slate-700 focus:ring-0"
          />
        )}
      </div>
    </div>

    <Input
      value={page.note}
      onChange={(e) => onChange({ note: e.target.value })}
      placeholder="Thêm ghi chú cho trang này..."
      className="mt-2 border-none px-1 text-sm text-slate-500 focus:ring-0"
    />
  </div>
);

export default PageEditorPanel;
