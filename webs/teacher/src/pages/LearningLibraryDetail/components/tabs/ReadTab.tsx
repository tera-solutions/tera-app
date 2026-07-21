import { useState } from "react";
import { Button, ChevronLeftOutlined, ChevronRightOutlined, SpeakerWaveOutlined } from "tera-dls";

import Card from "_common/components/Card";
import IconBox from "_common/components/IconBox";

import type { VocabularyItem } from "../../_interface";
import type { ReadPage } from "../../mock";

interface ReadTabProps {
  pages: ReadPage[];
  vocabulary: VocabularyItem[];
  onViewAllVocabulary: () => void;
}

const ReadTab = ({ pages, vocabulary, onViewAllVocabulary }: ReadTabProps) => {
  const [pageIndex, setPageIndex] = useState(0);
  const page = pages[pageIndex];

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
      <Card>
        <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-slate-100 sm:grid-cols-2">
          <div className={`flex aspect-square items-center justify-center bg-gradient-to-br ${page.gradient} text-[96px] sm:aspect-auto`}>
            {page.emoji}
          </div>
          <div className="relative flex flex-col justify-center bg-amber-50/60 p-6">
            <h2 className="text-3xl font-bold text-orange-500">{page.title}</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-700">{page.paragraph}</p>
            <span className="absolute bottom-3 right-4 text-sm text-slate-400">{page.page}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <Button
            outlined
            icon={<ChevronLeftOutlined />}
            className="border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
            disabled={pageIndex === 0}
            onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
          >
            Trang trước
          </Button>
          <span className="text-sm font-medium text-slate-500">
            {pageIndex + 1} / {pages.length}
          </span>
          <Button
            outlined
            icon={<ChevronRightOutlined />}
            className="flex-row-reverse border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
            disabled={pageIndex === pages.length - 1}
            onClick={() => setPageIndex((i) => Math.min(pages.length - 1, i + 1))}
          >
            Trang sau
          </Button>
        </div>

        <input
          type="range"
          min={0}
          max={pages.length - 1}
          value={pageIndex}
          onChange={(e) => setPageIndex(Number(e.target.value))}
          className="mt-3 w-full accent-brand"
        />
      </Card>

      <Card>
        <p className="mb-3 text-sm font-semibold text-slate-800">Từ vựng chính</p>
        <div className="flex flex-col gap-3">
          {vocabulary.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <IconBox
                icon={<span>{item.emoji}</span>}
                sizeClassName="h-11 w-11"
                roundedClassName="rounded-lg"
                colorClassName="bg-amber-50"
                iconSizeClassName="text-xl"
              />
              <div className="min-w-0 flex-1">
                <p className="flex items-baseline gap-2">
                  <span className="font-semibold text-slate-800">{item.word}</span>
                  <span className="text-xs text-slate-400">{item.ipa}</span>
                </p>
                <p className="truncate text-xs text-slate-500">{item.meaning}</p>
              </div>
              <button
                type="button"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-brand [&_svg]:h-4 [&_svg]:w-4"
              >
                <SpeakerWaveOutlined />
              </button>
            </div>
          ))}
        </div>

        <Button
          outlined
          className="mt-4 w-full border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
          onClick={onViewAllVocabulary}
        >
          Xem tất cả từ vựng
        </Button>
      </Card>
    </div>
  );
};

export default ReadTab;
