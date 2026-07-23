import { Input, Select } from "tera-dls";

import Card from "_common/components/Card";

import type { PublishSettings } from "../_interface";
import { CLASSROOM_OPTIONS, STATUS_OPTIONS, VISIBILITY_OPTIONS } from "../constants";

interface PublishShareSectionProps {
  value: PublishSettings;
  onChange: (patch: Partial<PublishSettings>) => void;
}

const PublishShareSection = ({ value, onChange }: PublishShareSectionProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-800">7. Xuất bản &amp; Chia sẻ</p>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Hiển thị cho</label>
        <Select
          value={value.visibility}
          options={VISIBILITY_OPTIONS}
          onChange={(v) => onChange({ visibility: v as string })}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Hoặc chọn lớp học</label>
        <Select
          value={value.classroomId}
          options={CLASSROOM_OPTIONS}
          onChange={(v) => onChange({ classroomId: v as string })}
          disabled={value.visibility !== "classroom"}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Ngày xuất bản</label>
        <Input
          type="date"
          value={value.publishDate}
          onChange={(e) => onChange({ publishDate: e.target.value })}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Trạng thái</label>
        <Select value={value.status} options={STATUS_OPTIONS} onChange={(v) => onChange({ status: v as string })} />
      </div>
    </div>
  </Card>
);

export default PublishShareSection;
