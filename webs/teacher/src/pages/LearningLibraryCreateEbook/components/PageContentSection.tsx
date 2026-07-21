import { ArrowsUpDownOutlined, Button, PlusOutlined, notification } from "tera-dls";

import Card from "_common/components/Card";

import type { EbookPageDraft } from "../_interface";
import PageListPanel from "./PageListPanel";
import PageEditorPanel from "./PageEditorPanel";

let pageIdCounter = 0;

const PAGE_GRADIENTS = [
  "from-sky-200 to-emerald-100",
  "from-amber-200 to-orange-100",
  "from-pink-200 to-rose-100",
  "from-violet-200 to-purple-100",
  "from-lime-200 to-teal-100",
];

interface PageContentSectionProps {
  pages: EbookPageDraft[];
  onChangePages: (pages: EbookPageDraft[]) => void;
  activeId: string;
  onActiveIdChange: (id: string) => void;
}

const PageContentSection = ({ pages, onChangePages, activeId, onActiveIdChange }: PageContentSectionProps) => {
  const activePage = pages.find((p) => p.id === activeId) ?? pages[0];

  const handleAddPage = () => {
    pageIdCounter += 1;
    const gradient = PAGE_GRADIENTS[pages.length % PAGE_GRADIENTS.length];
    const newPage: EbookPageDraft = {
      id: `page-new-${pageIdCounter}`,
      title: `Trang mới ${pages.length + 1}`,
      gradient,
      emoji: "📄",
      headline: "Tiêu đề trang",
      body: "",
      note: "",
    };
    onChangePages([...pages, newPage]);
    onActiveIdChange(newPage.id);
  };

  const handleChangeActivePage = (patch: Partial<EbookPageDraft>) =>
    onChangePages(pages.map((p) => (p.id === activePage.id ? { ...p, ...patch } : p)));

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-800">2. Nội dung ebook</p>
        <div className="flex items-center gap-2">
          <Button
            outlined
            icon={<PlusOutlined className="h-3.5 w-3.5" />}
            className="whitespace-nowrap border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:border-brand hover:text-brand"
            onClick={handleAddPage}
          >
            Thêm trang
          </Button>
          <Button
            outlined
            icon={<ArrowsUpDownOutlined className="h-3.5 w-3.5" />}
            className="whitespace-nowrap border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:border-brand hover:text-brand"
            onClick={() => notification.warning({ message: "Tính năng đang được phát triển" })}
          >
            Sắp xếp trang
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[180px_1fr]">
        <PageListPanel pages={pages} activeId={activePage.id} onSelect={onActiveIdChange} />
        <PageEditorPanel page={activePage} onChange={handleChangeActivePage} />
      </div>
    </Card>
  );
};

export default PageContentSection;
