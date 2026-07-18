import {
  FileText,
  Headphones,
  Image as ImageIcon,
  List,
  LucideIcon,
  NotebookPen,
  Video,
} from 'lucide-react-native';

import { Product, ProductCategory } from '@screens/HocLieuScreen/constants';

// Không có kho nội dung/PDF/audio thật cho học liệu (cùng lý do đã ghi ở
// HocLieuScreen/constants.ts — chưa có product/shop API). Màn "Xem học liệu"
// dưới đây dựng giao diện trình đọc/trình xem đúng theo mockup, nội dung từng
// trang, mục lục, tài nguyên đều là dữ liệu MẪU sinh ra từ số trang ước lượng
// của sản phẩm — không phải nội dung bài học thật.
export type ViewerTab = 'content' | 'toc' | 'notes' | 'resources';

export const VIEWER_TABS: { id: ViewerTab; label: string; icon: LucideIcon }[] = [
  { id: 'content', label: 'Nội dung', icon: FileText },
  { id: 'toc', label: 'Mục lục', icon: List },
  { id: 'notes', label: 'Ghi chú', icon: NotebookPen },
  { id: 'resources', label: 'Tài nguyên', icon: FileText },
];

export const VIEWER_TITLES: Record<ProductCategory, string> = {
  book: 'Xem giáo trình',
  worksheet: 'Xem bài tập',
  flashcard: 'Xem flashcard',
  poster: 'Xem poster',
  supply: 'Xem học liệu',
  other: 'Xem học liệu',
};

export const parsePageCount = (product: Product): number => {
  const spec = product.specs?.find((s) => s.label === 'Số trang');
  if (spec) {
    const match = spec.value.match(/\d+/);
    if (match) return Number(match[0]);
  }
  const subtitleMatch = product.subtitle.match(/(\d+)\s*(thẻ|trang)/i);
  if (subtitleMatch) return Number(subtitleMatch[1]);
  if (product.category === 'poster' || product.category === 'supply' || product.category === 'other') {
    return 1;
  }
  return 20;
};

export interface TocEntry {
  id: string;
  title: string;
  startPage: number;
}

const CHAPTER_SPAN = 20;

export const buildToc = (totalPages: number): TocEntry[] => {
  const entries: TocEntry[] = [];
  for (let start = 1; start <= totalPages; start += CHAPTER_SPAN) {
    const end = Math.min(start + CHAPTER_SPAN - 1, totalPages);
    entries.push({
      id: `chapter-${start}`,
      title: `Chương ${entries.length + 1} (Trang ${start}${end > start ? `-${end}` : ''})`,
      startPage: start,
    });
  }
  return entries.length > 0 ? entries : [{ id: 'chapter-1', title: 'Trang 1', startPage: 1 }];
};

export interface ResourceEntry {
  id: string;
  name: string;
  meta: string;
  icon: LucideIcon;
}

export const buildResources = (product: Product): ResourceEntry[] => {
  const base: ResourceEntry[] = [
    { id: 'audio', name: 'File nghe kèm sách', meta: 'MP3 • 24 MB', icon: Headphones },
    { id: 'video', name: 'Video hướng dẫn sử dụng', meta: 'MP4 • 86 MB', icon: Video },
    { id: 'print', name: 'Bản in PDF', meta: 'PDF • 12 MB', icon: FileText },
  ];
  if (product.category === 'poster' || product.category === 'flashcard') {
    base.push({ id: 'print-image', name: 'Ảnh in khổ lớn', meta: 'PNG • 8 MB', icon: ImageIcon });
  }
  return base;
};
