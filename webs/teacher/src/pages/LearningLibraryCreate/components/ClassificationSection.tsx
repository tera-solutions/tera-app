import { Select } from "tera-dls";

import Card from "_common/components/Card";

import { LEVEL_SELECT_OPTIONS, MATERIAL_TYPE_SELECT_OPTIONS, TAG_SELECT_OPTIONS, UNIT_SELECT_OPTIONS } from "../constants";

interface ClassificationSectionProps {
  materialType: string;
  onChangeMaterialType: (value: string) => void;
  level: string;
  onChangeLevel: (value: string) => void;
  unit: string;
  onChangeUnit: (value: string) => void;
  tags: string[];
  onChangeTags: (tags: string[]) => void;
}

const ClassificationSection = ({
  materialType,
  onChangeMaterialType,
  level,
  onChangeLevel,
  unit,
  onChangeUnit,
  tags,
  onChangeTags,
}: ClassificationSectionProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-800">4. Thông tin phân loại</p>

    <div className="mb-3">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        Loại học liệu <span className="text-rose-500">*</span>
      </label>
      <Select
        value={materialType}
        options={MATERIAL_TYPE_SELECT_OPTIONS}
        onChange={(v) => onChangeMaterialType(v as string)}
      />
    </div>

    <div className="mb-3">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        Cấp độ / Lớp học <span className="text-rose-500">*</span>
      </label>
      <Select value={level} options={LEVEL_SELECT_OPTIONS} onChange={(v) => onChangeLevel(v as string)} />
    </div>

    <div className="mb-3">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        Unit / Chapter <span className="text-rose-500">*</span>
      </label>
      <Select value={unit} options={UNIT_SELECT_OPTIONS} onChange={(v) => onChangeUnit(v as string)} />
    </div>

    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">Thẻ (Tags)</label>
      <Select
        mode="multiple"
        value={tags as any}
        options={TAG_SELECT_OPTIONS}
        onChange={(v) => onChangeTags(v as unknown as string[])}
        placeholder="Nhấn Enter để thêm thẻ"
      />
    </div>
  </Card>
);

export default ClassificationSection;
