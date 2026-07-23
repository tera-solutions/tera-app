import { useState } from "react";
import moment from "moment";
import {
  DocumentTextOutlined,
  MusicalNoteOutlined,
  PhotoOutlined,
  SpeakerWaveOutlined,
  VideoCameraOutlined,
} from "tera-dls";

import Badge from "_common/components/Badge";
import Card from "_common/components/Card";
import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";

import type { VocabularyItem } from "../_interface";
import { DEFAULT_TOPIC_BADGE_CLASSNAME, STATUS_GROUP_META, TOPIC_BADGE_CLASSNAMES } from "../constants";
import { buildVocabularyPreviewImageUrl, buildVocabularyThumbnailUrl } from "../_utils";
import ImagePreviewModal from "./ImagePreviewModal";

interface VocabularyTableProps {
  items: VocabularyItem[];
  total: number;
  page: number;
  perPage: number;
  loading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onPageChange: (page: number, perPage: number) => void;
}

const playAudio = (url: string) => new Audio(url).play().catch(() => undefined);

const ResourceIcon = ({
  active,
  title,
  icon,
  onClick,
}: {
  active: boolean;
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) => (
  <button
    type="button"
    title={active ? title : `${title} — chưa có`}
    disabled={!active}
    onClick={onClick}
    className={`flex h-7 w-7 items-center justify-center rounded-lg [&_svg]:h-4 [&_svg]:w-4 ${
      active ? "bg-sky-50 text-brand hover:bg-sky-100" : "cursor-not-allowed bg-slate-50 text-slate-300"
    }`}
  >
    {icon}
  </button>
);

/** Thumbnail from the deterministic preview URL — falls back to a placeholder icon on 404
 * instead of trusting `image_path` (not reliably populated on every record). */
const WordThumbnail = ({ word, previewUrl }: { word: string; previewUrl: string }) => {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-300">
        <PhotoOutlined className="h-4.5 w-4.5" />
      </span>
    );
  }
  return (
    <img
      src={previewUrl}
      alt={word}
      className="h-9 w-9 shrink-0 rounded-lg bg-slate-50 object-cover"
      onError={() => setBroken(true)}
    />
  );
};

const VocabularyTable = ({ items, total, page, perPage, loading, isError, onRetry, onPageChange }: VocabularyTableProps) => {
  const [previewItem, setPreviewItem] = useState<VocabularyItem | null>(null);

  const columns: TableColumn<VocabularyItem>[] = [
    {
      key: "word",
      title: "Từ vựng",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <WordThumbnail word={row.word} previewUrl={buildVocabularyThumbnailUrl(row.level, row.topic, row.word)} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate font-semibold text-slate-800">{row.word || "—"}</span>
              {row.audioPath && (
                <button
                  type="button"
                  onClick={() => playAudio(row.audioPath as string)}
                  className="shrink-0 text-slate-400 hover:text-brand"
                >
                  <SpeakerWaveOutlined className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {row.subcategory && <div className="truncate text-xs text-slate-400">{row.subcategory}</div>}
          </div>
        </div>
      ),
    },
    {
      key: "topic",
      title: "Chủ đề",
      render: (row) =>
        row.topic ? (
          <Badge className={`px-2.5 py-1 text-xs ${TOPIC_BADGE_CLASSNAMES[row.topic] ?? DEFAULT_TOPIC_BADGE_CLASSNAME}`}>
            {row.topic}
          </Badge>
        ) : (
          "—"
        ),
    },
    {
      key: "level",
      title: "Cấp độ",
      render: (row) =>
        row.level ? (
          <Badge className="border border-slate-200 px-2.5 py-1 text-xs text-slate-600">{row.level}</Badge>
        ) : (
          "—"
        ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => (
        <span className={`flex items-center gap-1.5 text-sm ${STATUS_GROUP_META[row.statusGroup].textClassName}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${STATUS_GROUP_META[row.statusGroup].dotClassName}`} />
          {STATUS_GROUP_META[row.statusGroup].label}
        </span>
      ),
    },
    {
      key: "resources",
      title: "Tài nguyên",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <ResourceIcon active title="Xem ảnh" icon={<PhotoOutlined />} onClick={() => setPreviewItem(row)} />
          <ResourceIcon active={!!row.audioPath} title="Nghe phát âm" icon={<MusicalNoteOutlined />} onClick={() => playAudio(row.audioPath as string)} />
          <ResourceIcon active={!!row.videoPath} title="Xem video" icon={<VideoCameraOutlined />} onClick={() => window.open(row.videoPath as string, "_blank")} />
          <ResourceIcon active={!!row.storyPath} title="Xem truyện" icon={<DocumentTextOutlined />} onClick={() => window.open(row.storyPath as string, "_blank")} />
        </div>
      ),
    },
    {
      key: "createdAt",
      title: "Ngày tạo",
      render: (row) => (
        <span className="text-slate-500">{row.createdAt ? moment(row.createdAt).format("DD/MM/YYYY HH:mm") : "—"}</span>
      ),
    },
  ];

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold text-slate-800">{total.toLocaleString("vi-VN")} từ vựng</p>

      <Table
        columns={columns}
        data={items}
        rowKey={(row) => row.id}
        isLoading={loading}
        isError={isError}
        onRetry={onRetry}
        errorMessage="Không tải được danh sách từ vựng"
        emptyText="Không có từ vựng phù hợp"
        minWidthClassName="min-w-200"
      />

      <TablePagination total={total} page={page} perPage={perPage} unit="từ vựng" onChange={onPageChange} />

      <ImagePreviewModal
        open={!!previewItem}
        word={previewItem?.word ?? ""}
        imageUrl={previewItem ? buildVocabularyPreviewImageUrl(previewItem.level, previewItem.topic, previewItem.word) : ""}
        onClose={() => setPreviewItem(null)}
      />
    </Card>
  );
};

export default VocabularyTable;
