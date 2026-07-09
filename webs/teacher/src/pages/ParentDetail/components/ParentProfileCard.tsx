import { EnvelopeOutlined, PhoneOutlined } from "tera-dls";

import Avatar from "_common/components/Avatar";
import Card from "_common/components/Card";

import type { ParentDetail } from "../_interface";

const ParentProfileCard = ({ parent }: { parent: ParentDetail }) => (
  <Card>
    <div className="flex flex-col items-center gap-3 text-center">
      <Avatar src={parent.avatar} alt={parent.name} sizeClassName="size-20" iconSizeClassName="[&_svg]:h-9 [&_svg]:w-9" />
      <div>
        <p className="text-lg font-bold text-slate-800">{parent.name || "—"}</p>
        <p className="text-sm text-slate-400">Phụ huynh</p>
      </div>
    </div>

    <div className="mt-4 flex flex-col gap-2.5 border-t border-slate-100 pt-4 text-sm">
      <div className="flex items-center gap-2.5 text-slate-600 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-slate-400">
        <PhoneOutlined />
        {parent.phone ? <a href={`tel:${parent.phone}`} className="hover:text-brand">{parent.phone}</a> : "—"}
      </div>
      <div className="flex items-center gap-2.5 text-slate-600 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-slate-400">
        <EnvelopeOutlined />
        {parent.email || "—"}
      </div>
    </div>
  </Card>
);

export default ParentProfileCard;
