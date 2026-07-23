import { useNavigate } from "react-router-dom";
import { EnvelopeOutlined, PhoneOutlined } from "tera-dls";

import Avatar from "_common/components/Avatar";
import Badge from "_common/components/Badge";
import EmptyState from "_common/components/EmptyState";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { RELATION_BADGE, RELATION_BADGE_DEFAULT, RELATION_LABEL } from "pages/Parents/constants";

import type { StudentParent } from "../_interface";

const StudentGuardiansCard = ({ parents }: { parents: StudentParent[] }) => {
  const navigate = useNavigate();

  if (parents.length === 0) {
    return <EmptyState description="Chưa liên kết người giám hộ nào" className="py-8" />;
  }

  return (
    <div className="flex flex-col divide-y divide-slate-100">
      {parents.map((parent) => (
        <button
          key={parent.id}
          type="button"
          onClick={() => navigate(`${PATHS.parentDetail}/${parent.id}`)}
          className="flex items-center gap-3 py-2.5 text-left first:pt-0 last:pb-0"
        >
          <Avatar alt={parent.name} sizeClassName="size-9" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-medium text-slate-800 hover:text-brand">{parent.name || "—"}</span>
              <Badge
                className={`px-2 py-0.5 text-[11px] ${RELATION_BADGE[parent.relation] ?? RELATION_BADGE_DEFAULT}`}
              >
                {RELATION_LABEL[parent.relation] ?? parent.relation ?? "Phụ huynh"}
              </Badge>
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400">
              {parent.phone && (
                <span className="flex items-center gap-1">
                  <PhoneOutlined className="h-3.5 w-3.5" /> {parent.phone}
                </span>
              )}
              {parent.email && (
                <span className="flex items-center gap-1">
                  <EnvelopeOutlined className="h-3.5 w-3.5" /> {parent.email}
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default StudentGuardiansCard;
