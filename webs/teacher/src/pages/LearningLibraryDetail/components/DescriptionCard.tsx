import { ClockOutlined, FlagOutlined, TagOutlined, UsersOutlined } from "tera-dls";

import Badge from "_common/components/Badge";
import Card from "_common/components/Card";
import IconBox from "_common/components/IconBox";

import type { MaterialDetail } from "../_interface";

interface DescriptionCardProps {
  detail: MaterialDetail;
}

const DescriptionCard = ({ detail }: DescriptionCardProps) => (
  <Card className="mt-4">
    <p className="mb-2 text-sm font-semibold text-slate-800">Mô tả</p>
    <p className="text-sm text-slate-500">{detail.description}</p>

    <div className="mt-3 flex flex-col gap-2 text-sm">
      <div className="flex items-center gap-2 text-slate-600">
        <IconBox
          icon={<FlagOutlined />}
          sizeClassName="h-6 w-6"
          roundedClassName="rounded-md"
          colorClassName="bg-rose-50 text-rose-500"
          iconSizeClassName="[&_svg]:h-3.5 [&_svg]:w-3.5"
        />
        <span className="font-medium text-slate-700">Mục tiêu:</span> {detail.goal}
      </div>
      <div className="flex items-center gap-2 text-slate-600">
        <IconBox
          icon={<UsersOutlined />}
          sizeClassName="h-6 w-6"
          roundedClassName="rounded-md"
          colorClassName="bg-sky-50 text-brand"
          iconSizeClassName="[&_svg]:h-3.5 [&_svg]:w-3.5"
        />
        <span className="font-medium text-slate-700">Đối tượng:</span> {detail.audience}
      </div>
      <div className="flex items-center gap-2 text-slate-600">
        <IconBox
          icon={<TagOutlined />}
          sizeClassName="h-6 w-6"
          roundedClassName="rounded-md"
          colorClassName="bg-emerald-50 text-emerald-500"
          iconSizeClassName="[&_svg]:h-3.5 [&_svg]:w-3.5"
        />
        <span className="font-medium text-slate-700">Chủ đề:</span> {detail.topic}
      </div>
      <div className="flex items-center gap-2 text-slate-600">
        <IconBox
          icon={<ClockOutlined />}
          sizeClassName="h-6 w-6"
          roundedClassName="rounded-md"
          colorClassName="bg-slate-100 text-slate-500"
          iconSizeClassName="[&_svg]:h-3.5 [&_svg]:w-3.5"
        />
        <span className="font-medium text-slate-700">Thời lượng:</span> {detail.duration}
      </div>
    </div>

    <div className="mt-4 flex flex-wrap gap-2">
      {detail.tags.map((tag) => (
        <Badge key={tag} className="border border-slate-200 px-3 py-1 text-xs text-slate-500">
          {tag}
        </Badge>
      ))}
    </div>
  </Card>
);

export default DescriptionCard;
