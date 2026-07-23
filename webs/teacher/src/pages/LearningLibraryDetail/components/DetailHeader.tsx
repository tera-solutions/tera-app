import { Link } from "react-router-dom";
import {
  ArrowDownTrayOutlined,
  Button,
  ChevronRightOutlined,
  EyeOutlined,
  HeartOutlined,
  PlayCircleSolid,
  ShareOutlined,
  StarSolid,
} from "tera-dls";

import Badge from "_common/components/Badge";
import { PATHS } from "_common/components/Layout/Menu/menus";

import type { MaterialDetail } from "../_interface";

interface DetailHeaderProps {
  detail: MaterialDetail;
  onUse: () => void;
  onDownload: () => void;
  onToggleFavorite: () => void;
  onShare: () => void;
  isFavorite: boolean;
}

const DetailHeader = ({
  detail,
  onUse,
  onDownload,
  onToggleFavorite,
  onShare,
  isFavorite,
}: DetailHeaderProps) => (
  <div className="mb-4">
    <div className="mb-3 flex items-center gap-1.5 text-sm text-slate-500">
      <Link to={PATHS.learningLibrary} className="hover:text-brand">
        Học liệu
      </Link>
      <ChevronRightOutlined className="h-3.5 w-3.5 text-slate-300" />
      <span className="text-slate-700">Chi tiết học liệu</span>
    </div>

    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex flex-wrap items-start gap-4">
        <div
          className={`relative flex h-32 w-52 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${detail.gradient}`}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-brand shadow [&_svg]:h-7 [&_svg]:w-7">
            <PlayCircleSolid />
          </span>
        </div>

        <div>
          <Badge className="bg-violet-500 px-2.5 py-0.5 text-[11px] text-white">
            {detail.formatLabel}
          </Badge>
          <h1 className="mt-1.5 text-2xl font-bold text-slate-800">{detail.title}</h1>
          <p className="mt-1 text-sm text-slate-400">
            {detail.unit} · {detail.category} · {detail.level} · {detail.meta} ·{" "}
            {detail.usageCount} lượt sử dụng
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button icon={<PlayCircleSolid />} className="bg-brand hover:bg-brand/80" onClick={onUse}>
              Sử dụng
            </Button>
            <Button
              outlined
              icon={<ArrowDownTrayOutlined />}
              className="border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
              onClick={onDownload}
            >
              Tải xuống
            </Button>
            <Button
              outlined
              icon={<HeartOutlined className={isFavorite ? "text-rose-500" : undefined} />}
              className="border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
              onClick={onToggleFavorite}
            >
              Yêu thích
            </Button>
            <Button
              outlined
              icon={<ShareOutlined />}
              className="border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
              onClick={onShare}
            >
              Chia sẻ
            </Button>
          </div>
        </div>
      </div>

      <div className="text-right">
        <p className="flex items-center justify-end gap-1.5 text-lg font-semibold text-slate-800">
          <StarSolid className="h-5 w-5 text-amber-400" />
          {detail.rating}
          <span className="text-sm font-normal text-slate-400">
            ({detail.reviewCount} đánh giá)
          </span>
        </p>
        <p className="mt-1 flex items-center justify-end gap-1.5 text-sm text-slate-400">
          <EyeOutlined className="h-4 w-4" />
          {detail.views} lượt xem
        </p>
      </div>
    </div>
  </div>
);

export default DetailHeader;
