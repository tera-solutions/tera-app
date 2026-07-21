import { useState } from "react";
import classNames from "classnames";
import {
  ArrowPathOutlined,
  ArrowsPointingOuOutlined,
  Cog6ToothOutlined,
  ForwardOutlined,
  MicrophoneOutlined,
  PlayOutlined,
  SpeakerWaveOutlined,
} from "tera-dls";

import Card from "_common/components/Card";
import CompactSelect from "_common/components/CompactSelect";

import type { DubbingLine } from "../../_interface";
import { SCORE_COLOR } from "../../constants";

interface DubbingTabProps {
  lines: DubbingLine[];
}

const ROLE_OPTIONS = [
  { value: "dog", label: "🐶 Dog" },
  { value: "cat", label: "🐱 Cat" },
];

const LEGEND = [
  { key: "good", label: "Tốt (Good)", className: "bg-emerald-500" },
  { key: "retry", label: "Cần cải thiện (Try again)", className: "bg-amber-500" },
  { key: "skip", label: "Bỏ qua (Skip)", className: "bg-slate-300" },
];

const DubbingTab = ({ lines }: DubbingTabProps) => {
  const [role, setRole] = useState("dog");
  const [recording, setRecording] = useState(false);
  const [activeId, setActiveId] = useState(lines[0]?.id);
  const activeLine = lines.find((line) => line.id === activeId) ?? lines[0];

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
      <Card>
        <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-orange-100 to-sky-100 text-6xl">
          🐶 🐱
        </div>

        <div className="mt-3 flex items-center gap-3">
          <span className="text-xs text-slate-400">00:04</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-1/4 rounded-full bg-brand" />
          </div>
          <span className="text-xs text-slate-400">00:15</span>
        </div>

        <div className="mt-2 flex items-center gap-3 text-slate-500">
          <button type="button" className="[&_svg]:h-4.5 [&_svg]:w-4.5">
            <PlayOutlined />
          </button>
          <button type="button" className="[&_svg]:h-4.5 [&_svg]:w-4.5">
            <ForwardOutlined />
          </button>
          <button type="button" className="[&_svg]:h-4.5 [&_svg]:w-4.5">
            <SpeakerWaveOutlined />
          </button>
          <div className="flex-1" />
          <button type="button" className="[&_svg]:h-4.5 [&_svg]:w-4.5">
            <Cog6ToothOutlined />
          </button>
          <button type="button" className="[&_svg]:h-4.5 [&_svg]:w-4.5">
            <ArrowsPointingOuOutlined />
          </button>
        </div>

        <div className="mt-4 flex h-10 items-center overflow-hidden rounded-lg bg-slate-50">
          <div className="h-full w-2/5 bg-rose-200" />
          <div className="h-full w-3/5 bg-sky-200" />
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:border-brand hover:text-brand"
          >
            <PlayOutlined className="h-4 w-4" /> Play Preview
          </button>
          <button
            type="button"
            onClick={() => setRecording((r) => !r)}
            className={classNames(
              "flex h-14 w-14 items-center justify-center rounded-full text-white shadow [&_svg]:h-6 [&_svg]:w-6",
              recording ? "bg-rose-600" : "bg-rose-500",
            )}
          >
            <MicrophoneOutlined />
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:border-brand hover:text-brand"
          >
            <ArrowPathOutlined className="h-4 w-4" /> Re-record
          </button>
        </div>
        <p className="mt-1 text-center text-xs text-slate-400">
          {recording ? "Đang ghi âm..." : "Record"}
        </p>

        {activeLine && (
          <p className="mt-3 text-center text-lg font-medium text-emerald-600">
            {activeLine.en}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
          {LEGEND.map((item) => (
            <span key={item.key} className="flex items-center gap-1.5">
              <span className={classNames("h-2 w-2 rounded-full", item.className)} />
              {item.label}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm text-slate-500">Role:</span>
          <CompactSelect value={role} options={ROLE_OPTIONS} onChange={setRole} className="min-w-32" />
        </div>

        <div className="flex flex-col gap-2">
          {lines.map((line) => {
            const active = line.id === activeLine?.id;
            return (
              <button
                key={line.id}
                type="button"
                onClick={() => setActiveId(line.id)}
                className={classNames(
                  "flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left",
                  active ? "border-brand bg-sky-50" : "border-slate-100 hover:bg-slate-50",
                )}
              >
                <span
                  className={classNames(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    active ? "bg-brand text-white" : "bg-slate-100 text-slate-500",
                  )}
                >
                  {line.index}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-400">
                    {line.start} - {line.end}
                  </p>
                  <p className="truncate text-sm font-medium text-slate-800">{line.en}</p>
                  <p className="truncate text-xs text-slate-400">{line.vi}</p>
                </div>
                <button
                  type="button"
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 [&_svg]:h-3.5 [&_svg]:w-3.5"
                >
                  <MicrophoneOutlined />
                </button>
                <span
                  className={classNames(
                    "mt-0.5 shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold",
                    SCORE_COLOR(line.score),
                  )}
                >
                  {line.score != null ? `${line.score}/100` : "—"}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-3 rounded-lg bg-sky-50 px-3 py-2 text-xs text-slate-500">
          Mẹo: Nhấn vào mic để thu âm câu thoại của bạn
        </p>
      </Card>
    </div>
  );
};

export default DubbingTab;
