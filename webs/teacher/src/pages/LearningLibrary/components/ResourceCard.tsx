import { ArrowDownTrayOutlined, Button, EyeOutlined, HeartOutlined, PlayCircleSolid, StarSolid } from "tera-dls";

import Badge from "_common/components/Badge";
import { CARD } from "_common/constants/dashboard";

import type { LibraryResource } from "../_interface";
import { RESOURCE_TYPE_META } from "../constants";

interface ResourceCardProps {
  resource: LibraryResource;
  onView: (resource: LibraryResource) => void;
  onDownload: (resource: LibraryResource) => void;
}

const ResourceCard = ({ resource, onView, onDownload }: ResourceCardProps) => {
  const meta = RESOURCE_TYPE_META[resource.type];

  return (
    <div className={`${CARD} flex flex-col overflow-hidden`}>
      <div className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${resource.gradient}`}>
        <span className="text-white/70 [&_svg]:h-12 [&_svg]:w-12">{meta.icon}</span>
        {resource.type === "video" && (
          <span className="absolute flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-brand shadow [&_svg]:h-7 [&_svg]:w-7">
            <PlayCircleSolid />
          </span>
        )}
        <Badge className={`absolute right-2 top-2 px-2.5 py-0.5 text-[11px] ${meta.badgeClassName}`}>
          {resource.formatLabel}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <p className="truncate font-semibold text-slate-800">{resource.title}</p>
          <p className="mt-0.5 truncate text-xs text-slate-400">
            {resource.unit} · {resource.level} · {resource.meta} · {resource.usageCount} lượt dùng
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1 [&_svg]:h-3.5 [&_svg]:w-3.5">
              <EyeOutlined /> {resource.views}
            </span>
            <span className="flex items-center gap-1 [&_svg]:h-3.5 [&_svg]:w-3.5">
              <HeartOutlined /> {resource.likes}
            </span>
            <span className="flex items-center gap-1 text-amber-500 [&_svg]:h-3.5 [&_svg]:w-3.5">
              <StarSolid /> {resource.rating}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              className="bg-brand px-3 py-1 text-xs hover:bg-brand/80"
              onClick={() => onView(resource)}
            >
              Xem
            </Button>
            <Button
              outlined
              icon={<ArrowDownTrayOutlined className="h-4 w-4" />}
              className="border-slate-200 px-2 py-1 text-slate-500 hover:border-brand hover:text-brand"
              onClick={() => onDownload(resource)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
