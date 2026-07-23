import { useRef } from "react";
import classNames from "classnames";
import { PlusOutlined, PuzzlePieceOutlined } from "tera-dls";

import Card from "_common/components/Card";

import type { ComicVisualSettings } from "../_interface";
import { ART_STYLE_OPTIONS, FRAME_LAYOUT_OPTIONS, THEME_COLOR_OPTIONS } from "../constants";

interface ComicSettingsSectionProps {
  value: ComicVisualSettings;
  onChange: (patch: Partial<ComicVisualSettings>) => void;
  customColor: string;
  onCustomColor: (hex: string) => void;
}

const FrameLayoutIcon = ({ panels }: { panels: number }) => {
  if (panels === 0) return <PuzzlePieceOutlined className="h-4 w-4" />;
  return (
    <div
      className="grid h-4 w-5 gap-0.5"
      style={{ gridTemplateColumns: panels >= 4 ? "1fr 1fr" : `repeat(${panels}, 1fr)` }}
    >
      {Array.from({ length: panels }).map((_, i) => (
        <span key={i} className="rounded-[2px] border border-current" />
      ))}
    </div>
  );
};

const ComicSettingsSection = ({ value, onChange, customColor, onCustomColor }: ComicSettingsSectionProps) => {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const presetHexes = THEME_COLOR_OPTIONS.map((c) => c.hex);
  const isCustomActive = !presetHexes.includes(value.themeColor);

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold text-slate-800">4. Cài đặt truyện tranh</p>

      <div className="mb-4">
        <p className="mb-2 text-sm font-medium text-slate-700">
          Phong cách tranh <span className="text-rose-500">*</span>
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {ART_STYLE_OPTIONS.map((style) => {
            const active = value.artStyle === style.value;
            return (
              <button
                key={style.value}
                type="button"
                onClick={() => onChange({ artStyle: style.value })}
                className="flex flex-col items-center gap-1.5"
              >
                <span
                  className={classNames(
                    "flex h-16 w-full items-center justify-center rounded-xl bg-gradient-to-br text-3xl transition-all",
                    style.gradient,
                    active ? "ring-2 ring-brand ring-offset-2" : "opacity-80 hover:opacity-100",
                  )}
                >
                  {style.emoji}
                </span>
                <span className={classNames("text-xs", active ? "font-semibold text-brand" : "text-slate-500")}>
                  {style.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-sm font-medium text-slate-700">Bố cục khung</p>
        <div className="grid grid-cols-5 gap-2">
          {FRAME_LAYOUT_OPTIONS.map((layout) => {
            const active = value.frameLayout === layout.value;
            return (
              <button
                key={layout.value}
                type="button"
                onClick={() => onChange({ frameLayout: layout.value })}
                className={classNames(
                  "flex flex-col items-center gap-1 rounded-lg border py-2.5 text-slate-500",
                  active ? "border-brand text-brand" : "border-slate-200 hover:border-slate-300",
                )}
              >
                <FrameLayoutIcon panels={layout.panels} />
                <span className="text-[11px]">{layout.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Màu sắc chủ đạo</p>
        <div className="flex flex-wrap items-center gap-2">
          {THEME_COLOR_OPTIONS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => onChange({ themeColor: color.hex })}
              className={classNames(
                "h-8 w-8 rounded-full transition-transform",
                value.themeColor === color.hex && "ring-2 ring-offset-2",
              )}
              style={{ backgroundColor: color.hex, ...(value.themeColor === color.hex ? ({ "--tw-ring-color": color.hex } as any) : {}) }}
            />
          ))}
          <button
            type="button"
            onClick={() => colorInputRef.current?.click()}
            className={classNames(
              "flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed text-slate-400 hover:border-brand hover:text-brand",
              isCustomActive && "border-brand text-brand",
            )}
            style={isCustomActive ? { backgroundColor: customColor } : undefined}
          >
            {!isCustomActive && <PlusOutlined className="h-4 w-4" />}
          </button>
          <input
            ref={colorInputRef}
            type="color"
            value={customColor}
            onChange={(e) => {
              onCustomColor(e.target.value);
              onChange({ themeColor: e.target.value });
            }}
            className="hidden"
          />
        </div>
      </div>
    </Card>
  );
};

export default ComicSettingsSection;
