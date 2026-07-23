import { ReactNode } from "react";
import { GlobeAltOutlined, PuzzlePieceOutlined, QuestionMarkCircleOutlined, SparklesOutlined, Toggle } from "tera-dls";

import Card from "_common/components/Card";
import IconBox from "_common/components/IconBox";

import type { FeatureToggles } from "../_interface";

interface FeatureToggleSectionProps {
  value: FeatureToggles;
  onChange: (patch: Partial<FeatureToggles>) => void;
}

const ROWS: {
  key: keyof FeatureToggles;
  icon: ReactNode;
  title: string;
  description: string;
}[] = [
  {
    key: "aiDubbing",
    icon: <SparklesOutlined />,
    title: "Enable AI Dubbing (Lồng tiếng AI)",
    description: "Cho phép tạo bản lồng tiếng bằng AI",
  },
  {
    key: "quiz",
    icon: <QuestionMarkCircleOutlined />,
    title: "Enable Quiz",
    description: "Thêm câu hỏi trắc nghiệm vào bài học",
  },
  {
    key: "game",
    icon: <PuzzlePieceOutlined />,
    title: "Enable Game Mode",
    description: "Kích hoạt trò chơi tương tác",
  },
  {
    key: "publicVisible",
    icon: <GlobeAltOutlined />,
    title: "Hiển thị công khai",
    description: "Cho phép giáo viên khác sử dụng",
  },
];

const FeatureToggleSection = ({ value, onChange }: FeatureToggleSectionProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-800">5. Tùy chọn &amp; Tính năng</p>

    <div className="flex flex-col divide-y divide-slate-100">
      {ROWS.map((row) => (
        <div key={row.key} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <IconBox
            icon={row.icon}
            sizeClassName="h-9 w-9"
            roundedClassName="rounded-lg"
            colorClassName="bg-sky-50 text-brand"
            iconSizeClassName="[&_svg]:h-4.5 [&_svg]:w-4.5"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-700">{row.title}</p>
            <p className="truncate text-xs text-slate-400">{row.description}</p>
          </div>
          <Toggle
            checked={value[row.key]}
            onChange={(e) => onChange({ [row.key]: e.target.checked })}
          />
        </div>
      ))}
    </div>
  </Card>
);

export default FeatureToggleSection;
