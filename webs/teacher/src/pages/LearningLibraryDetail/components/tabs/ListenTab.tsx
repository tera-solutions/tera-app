import { useState } from "react";
import classNames from "classnames";
import {
  ArrowsPointingOuOutlined,
  Cog6ToothOutlined,
  ForwardOutlined,
  PauseOutlined,
  PlayOutlined,
  SpeakerWaveOutlined,
} from "tera-dls";

import Card from "_common/components/Card";

import type { SubtitleLine } from "../../_interface";

interface ListenTabProps {
  lines: SubtitleLine[];
}

const ListenTab = ({ lines }: ListenTabProps) => {
  const [playing, setPlaying] = useState(false);
  const [lang, setLang] = useState<"en" | "vi">("en");
  const [activeId, setActiveId] = useState(lines[0]?.id);
  const activeLine = lines.find((line) => line.id === activeId) ?? lines[0];

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
      <Card>
        <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-sky-200 to-emerald-100">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white/85 text-brand shadow [&_svg]:h-8 [&_svg]:w-8"
          >
            {playing ? <PauseOutlined /> : <PlayOutlined />}
          </button>

          {activeLine && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-md bg-black/60 px-3 py-1.5 text-sm text-white">
              {lang === "en" ? activeLine.en : activeLine.vi}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center gap-3">
          <span className="text-xs text-slate-400">00:12</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-1/6 rounded-full bg-brand" />
          </div>
          <span className="text-xs text-slate-400">02:30</span>
        </div>

        <div className="mt-2 flex items-center gap-3 text-slate-500">
          <button type="button" onClick={() => setPlaying((p) => !p)} className="[&_svg]:h-4.5 [&_svg]:w-4.5">
            {playing ? <PauseOutlined /> : <PlayOutlined />}
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
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-800">Phụ đề</p>
          <div className="flex overflow-hidden rounded-lg border border-slate-200 text-xs font-medium">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={classNames("px-2.5 py-1", lang === "en" ? "bg-brand text-white" : "text-slate-500")}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("vi")}
              className={classNames("px-2.5 py-1", lang === "vi" ? "bg-brand text-white" : "text-slate-500")}
            >
              VI
            </button>
          </div>
        </div>

        <div className="flex max-h-96 flex-col gap-1 overflow-y-auto">
          {lines.map((line, index) => {
            const active = line.id === activeLine?.id;
            return (
              <button
                key={line.id}
                type="button"
                onClick={() => setActiveId(line.id)}
                className={classNames(
                  "flex items-start gap-3 rounded-lg px-2.5 py-2 text-left",
                  active ? "bg-sky-50" : "hover:bg-slate-50",
                )}
              >
                <span
                  className={classNames(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    active ? "bg-brand text-white" : "bg-slate-100 text-slate-500",
                  )}
                >
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-400">
                    {line.start} - {line.end}
                  </p>
                  <p className={classNames("truncate text-sm", active ? "font-semibold text-brand" : "text-slate-700")}>
                    {line.en}
                  </p>
                  <p className="truncate text-xs text-slate-400">{line.vi}</p>
                </div>
                <PlayOutlined className="mt-1 h-3.5 w-3.5 shrink-0 text-slate-300" />
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default ListenTab;
