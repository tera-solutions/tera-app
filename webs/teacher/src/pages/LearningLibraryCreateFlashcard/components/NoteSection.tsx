import { TextArea } from "tera-dls";

import Card from "_common/components/Card";

const NOTE_MAX = 300;

interface NoteSectionProps {
  value: string;
  onChange: (value: string) => void;
}

const NoteSection = ({ value, onChange }: NoteSectionProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-800">5. Ghi chú (tùy chọn)</p>
    <TextArea
      value={value}
      onChange={(e) => onChange(e.target.value.slice(0, NOTE_MAX))}
      placeholder="Nhập ghi chú hoặc hướng dẫn sử dụng cho học liệu..."
      rows={4}
    />
    <p className="mt-1 text-right text-xs text-slate-400">
      {value.length}/{NOTE_MAX}
    </p>
  </Card>
);

export default NoteSection;
