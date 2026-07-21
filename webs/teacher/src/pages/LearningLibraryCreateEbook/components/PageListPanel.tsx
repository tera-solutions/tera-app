import classNames from "classnames";

import type { EbookPageDraft } from "../_interface";

interface PageListPanelProps {
  pages: EbookPageDraft[];
  activeId: string;
  onSelect: (id: string) => void;
}

const PageListPanel = ({ pages, activeId, onSelect }: PageListPanelProps) => (
  <div>
    <p className="mb-2 text-sm font-medium text-slate-700">Danh sách trang ({pages.length})</p>
    <div className="flex flex-col gap-2">
      {pages.map((page, index) => {
        const active = page.id === activeId;
        return (
          <button
            key={page.id}
            type="button"
            onClick={() => onSelect(page.id)}
            className={classNames(
              "flex items-center gap-2.5 rounded-lg border-2 p-1.5 text-left transition-colors",
              active ? "border-brand bg-sky-50" : "border-transparent hover:bg-slate-50",
            )}
          >
            <span
              className={`flex h-12 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br text-sm ${page.gradient}`}
            >
              {page.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-slate-400">{index + 1}</span>
              <span className={classNames("block truncate text-sm", active ? "font-semibold text-brand" : "text-slate-700")}>
                {page.title}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

export default PageListPanel;
