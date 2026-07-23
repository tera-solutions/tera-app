import { Select } from "tera-dls";

import Card from "_common/components/Card";

import type { AccessSettings } from "../_interface";
import { CLASSROOM_OPTIONS, VISIBILITY_OPTIONS } from "../constants";

interface AccessSectionProps {
  value: AccessSettings;
  onChange: (patch: Partial<AccessSettings>) => void;
}

const AccessSection = ({ value, onChange }: AccessSectionProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-800">6. Quyền truy cập</p>

    <div className="mb-3">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">Hiển thị cho</label>
      <Select
        value={value.visibility}
        options={VISIBILITY_OPTIONS}
        onChange={(v) => onChange({ visibility: v as string })}
      />
    </div>

    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">Hoặc chọn lớp học cụ thể</label>
      <Select
        value={value.classroomId}
        options={CLASSROOM_OPTIONS}
        onChange={(v) => onChange({ classroomId: v as string })}
        disabled={value.visibility !== "classroom"}
      />
    </div>
  </Card>
);

export default AccessSection;
