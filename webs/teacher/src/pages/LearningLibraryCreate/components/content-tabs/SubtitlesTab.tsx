import { useRef } from "react";
import { Checkbox, CloudArrowUpOutlined, Select } from "tera-dls";

import { SUBTITLE_DISPLAY_MODE_OPTIONS } from "../../constants";
import type { SubtitleConfig } from "../../_interface";

interface SubtitlesTabProps {
  value: SubtitleConfig;
  onChange: (patch: Partial<SubtitleConfig>) => void;
}

const SubtitlesTab = ({ value, onChange }: SubtitlesTabProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Ngôn ngữ phụ đề</p>
        <div className="flex items-center gap-5">
          <Checkbox
            checked={value.english}
            onChange={(e: any) => onChange({ english: e.target.checked })}
          >
            <span className="text-sm text-slate-600">English</span>
          </Checkbox>
          <Checkbox
            checked={value.vietnamese}
            onChange={(e: any) => onChange({ vietnamese: e.target.checked })}
          >
            <span className="text-sm text-slate-600">Tiếng Việt</span>
          </Checkbox>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Kiểu hiển thị</p>
        <Select
          value={value.displayMode}
          options={SUBTITLE_DISPLAY_MODE_OPTIONS}
          onChange={(v) => onChange({ displayMode: v as string })}
        />
      </div>

      <div className="sm:col-span-2">
        <p className="mb-2 text-sm font-medium text-slate-700">Upload file phụ đề (tùy chọn)</p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-brand hover:border-brand"
          >
            <CloudArrowUpOutlined className="h-4 w-4" />
            Upload SRT / VTT File
          </button>
          <span className="text-sm text-slate-400">
            {value.fileName || "Không có file nào được chọn"}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept=".srt,.vtt"
            className="hidden"
            onChange={(e) => onChange({ fileName: e.target.files?.[0]?.name || "" })}
          />
        </div>
      </div>
    </div>
  );
};

export default SubtitlesTab;
