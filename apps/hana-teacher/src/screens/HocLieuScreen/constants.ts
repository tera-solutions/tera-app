import {
  BookOpen,
  Building2,
  Calendar,
  FileText,
  Grid3x3,
  Headphones,
  Image as ImageIcon,
  LayoutGrid,
  LucideIcon,
  NotebookPen,
  Package,
  Shuffle,
  Smile,
  Sparkles,
  Target,
} from 'lucide-react-native';

// Chưa có API/module thương mại điện tử nào trong repo (không có route
// product/shop/cart/order ở services/api hay services/modules, không có
// trang tương ứng ở webs/teacher) — khác hẳn với MaterialScreen hiện có
// (kho tài liệu PDF/DOCX/PPT của giáo viên, dùng useMaterialList thật).
// Màn "Học liệu" ở đây là một catalog bán học liệu (sách, flashcard, poster…)
// nên toàn bộ sản phẩm/giá/danh mục dưới đây là dữ liệu MẪU cố định, chỉ để
// dựng đúng giao diện — giỏ hàng hoạt động thật ở client (thêm/bớt/số lượng),
// nhưng KHÔNG có API đặt hàng/thanh toán thật phía sau.
export type ProductCategory =
  | 'book'
  | 'flashcard'
  | 'poster'
  | 'worksheet'
  | 'supply'
  | 'other';

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  book: 'Sách',
  flashcard: 'Flashcard',
  poster: 'Poster',
  worksheet: 'Bài tập',
  supply: 'Đồ dùng',
  other: 'Khác',
};

export const CATEGORY_ICONS: Record<ProductCategory, LucideIcon> = {
  book: BookOpen,
  flashcard: LayoutGrid,
  poster: ImageIcon,
  worksheet: NotebookPen,
  supply: Package,
  other: Grid3x3,
};

export const CATEGORY_COLORS: Record<ProductCategory, string> = {
  book: '#2563EB',
  flashcard: '#16A34A',
  poster: '#8B5CF6',
  worksheet: '#DB2777',
  supply: '#F97316',
  other: '#64748B',
};

export interface ProductSpec {
  icon: LucideIcon;
  label: string;
  value: string;
}

export interface ProductHighlight {
  icon: LucideIcon;
  color: string;
  label: string;
}

// rating/reviewCount/soldCount/description/specs/highlights là dữ liệu MẪU
// (chưa có API đánh giá/lượt bán thật) — chỉ điền chi tiết đầy đủ cho 1-2 sản
// phẩm mẫu (p1) để dựng đúng giao diện màn Chi tiết học liệu; các sản phẩm
// khác dùng mô tả rút gọn, HocLieuDetailScreen tự ẩn phần nào không có dữ liệu.
export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  badge?: 'new' | 'sale';
  featured?: boolean;
  bestsellerRank?: number;
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  ageRange?: string;
  description?: string;
  specs?: ProductSpec[];
  highlights?: ProductHighlight[];
  // Các trường dưới đây phục vụ riêng màn "Quản lý học liệu" (HocLieuManageScreen)
  // và "Xem học liệu" (HocLieuViewerScreen) — góc nhìn người bán/nội dung (giáo
  // viên tự đăng học liệu) trên cùng catalog PRODUCTS này.
  // manageVisibility: hiển thị / đã ẩn khỏi màn Học liệu (mua sắm).
  // publisher/manageAgeLabel: dùng để ghép dòng phụ "Độ tuổi: X • NXB: Y".
  manageVisibility?: 'active' | 'hidden';
  publisher?: string;
  manageAgeLabel?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Smart Kids 1 - Student Book',
    subtitle: 'Giáo trình tiếng Anh cho trẻ em 6-7 tuổi',
    category: 'book',
    price: 180000,
    originalPrice: 200000,
    badge: 'sale',
    featured: true,
    rating: 4.9,
    reviewCount: 126,
    soldCount: 256,
    ageRange: '6 - 7 tuổi',
    manageVisibility: 'active',
    publisher: 'Pearson',
    manageAgeLabel: 'Độ tuổi: 6 - 7 tuổi',
    description:
      'Smart Kids 1 - Student Book là giáo trình dành cho trẻ em mới bắt đầu học tiếng Anh. Nội dung sinh động, hình ảnh minh hoạ hấp dẫn, giúp trẻ làm quen và phát triển 4 kỹ năng Nghe - Nói - Đọc - Viết một cách tự nhiên và hiệu quả.',
    specs: [
      { icon: Building2, label: 'Nhà xuất bản', value: 'Pearson' },
      { icon: Calendar, label: 'Năm xuất bản', value: '2023' },
      { icon: FileText, label: 'Số trang', value: '96 trang' },
      { icon: Smile, label: 'Độ tuổi', value: '6 - 7 tuổi' },
    ],
    highlights: [
      { icon: Sparkles, color: '#16A34A', label: 'Nội dung sinh động gần gũi với trẻ em' },
      { icon: ImageIcon, color: '#F97316', label: 'Phát triển toàn diện 4 kỹ năng' },
      { icon: Shuffle, color: '#8B5CF6', label: 'Bài tập đa dạng, dễ tiếp cận' },
      { icon: Target, color: '#DB2777', label: 'Phù hợp chương trình tiểu học' },
    ],
  },
  {
    id: 'p2',
    name: 'Picture Flashcards - At School',
    subtitle: 'Bộ 45 thẻ hình',
    category: 'flashcard',
    price: 120000,
    originalPrice: 150000,
    badge: 'new',
    featured: true,
    ageRange: '3 - 8 tuổi',
    manageVisibility: 'active',
    publisher: 'FutureLang',
    manageAgeLabel: 'Độ tuổi: 3 - 8 tuổi',
  },
  {
    id: 'p3',
    name: 'Poster - Classroom Rules',
    subtitle: 'Khổ A2, ép plastic',
    category: 'poster',
    price: 85000,
    originalPrice: 100000,
    badge: 'sale',
    featured: true,
    ageRange: '8+ tuổi',
    manageVisibility: 'active',
    publisher: 'Hana Edu',
    manageAgeLabel: 'Độ tuổi: 8+ tuổi',
  },
  {
    id: 'p4',
    name: 'Phonics Flashcards',
    subtitle: 'Bộ 52 thẻ âm',
    category: 'flashcard',
    price: 150000,
    bestsellerRank: 1,
    manageVisibility: 'active',
    publisher: 'FutureLang',
    manageAgeLabel: 'Độ tuổi: 4 - 9 tuổi',
  },
  {
    id: 'p5',
    name: 'Grammar Practice 1 - Workbook',
    subtitle: 'Sách bài tập ngữ pháp',
    category: 'worksheet',
    price: 95000,
    bestsellerRank: 2,
    manageVisibility: 'active',
    publisher: 'FutureLang',
    manageAgeLabel: 'Độ tuổi: 7 - 9 tuổi',
  },
  {
    id: 'p6',
    name: 'Sight Words Flashcards',
    subtitle: 'Bộ 100 từ vựng',
    category: 'flashcard',
    price: 130000,
    bestsellerRank: 3,
    manageVisibility: 'active',
    publisher: 'FutureLang',
    manageAgeLabel: 'Độ tuổi: 5 - 10 tuổi',
  },
  {
    id: 'p7',
    name: 'Speaking Cue Cards',
    subtitle: 'Bộ 30 thẻ chủ đề',
    category: 'flashcard',
    price: 140000,
    bestsellerRank: 4,
    manageVisibility: 'hidden',
    publisher: 'FutureLang',
    manageAgeLabel: 'Độ tuổi: 6 - 12 tuổi',
  },
  {
    id: 'p8',
    name: 'Bộ bút dạ lớp học',
    subtitle: '12 màu, có đế xoá bảng',
    category: 'supply',
    price: 95000,
    manageVisibility: 'active',
    manageAgeLabel: 'Phù hợp: Mọi lứa tuổi',
  },
  {
    id: 'p9',
    name: 'Poster Bảng chữ cái',
    subtitle: 'Khổ A1',
    category: 'poster',
    price: 75000,
    manageVisibility: 'active',
    publisher: 'Hana Edu',
    manageAgeLabel: 'Độ tuổi: 4+ tuổi',
  },
  {
    id: 'p10',
    name: 'Worksheet Numbers 1-20',
    subtitle: 'Bộ 20 trang in sẵn',
    category: 'worksheet',
    price: 60000,
    manageVisibility: 'hidden',
    publisher: 'Hana Edu',
    manageAgeLabel: 'Độ tuổi: 4 - 6 tuổi',
  },
  {
    id: 'p11',
    name: 'Túi vải Hana Edu',
    subtitle: 'Canvas, in logo',
    category: 'other',
    price: 55000,
    manageVisibility: 'active',
    manageAgeLabel: 'Phù hợp: Mọi lứa tuổi',
  },
  {
    id: 'p12',
    name: 'Tai nghe lớp học',
    subtitle: 'Dùng cho luyện nghe',
    category: 'supply',
    price: 220000,
    badge: 'new',
    manageVisibility: 'active',
    manageAgeLabel: 'Phù hợp: Mọi lứa tuổi',
  },
  {
    id: 'p13',
    name: 'Smart Kids 2 - Student Book',
    subtitle: 'Giáo trình tiếng Anh cho trẻ em 7-8 tuổi',
    category: 'book',
    price: 180000,
    manageVisibility: 'active',
    publisher: 'Pearson',
    manageAgeLabel: 'Độ tuổi: 7 - 8 tuổi',
  },
  {
    id: 'p14',
    name: 'Smart Kids 3 - Student Book',
    subtitle: 'Giáo trình tiếng Anh cho trẻ em 8-9 tuổi',
    category: 'book',
    price: 180000,
    manageVisibility: 'active',
    publisher: 'Pearson',
    manageAgeLabel: 'Độ tuổi: 8 - 9 tuổi',
  },
  {
    id: 'p15',
    name: 'Phonics Kids 1 - Student Book',
    subtitle: 'Giáo trình phát âm cho trẻ em',
    category: 'book',
    price: 160000,
    manageVisibility: 'hidden',
    publisher: 'Pearson',
    manageAgeLabel: 'Độ tuổi: 5 - 7 tuổi',
  },
  {
    id: 'p16',
    name: 'Story Land 1 - Student Book',
    subtitle: 'Giáo trình luyện đọc qua câu chuyện',
    category: 'book',
    price: 150000,
    manageVisibility: 'active',
    publisher: 'Pearson',
    manageAgeLabel: 'Độ tuổi: 7 - 10 tuổi',
  },
  {
    id: 'p17',
    name: 'Bộ đồ dùng học tập',
    subtitle: 'Phù hợp: Mọi lứa tuổi',
    category: 'supply',
    price: 65000,
    manageVisibility: 'hidden',
    manageAgeLabel: 'Phù hợp: Mọi lứa tuổi',
  },
];

export interface CategoryTile {
  id: ProductCategory;
  icon: LucideIcon;
}

export const CATEGORY_TILES: CategoryTile[] = [
  { id: 'book', icon: BookOpen },
  { id: 'flashcard', icon: LayoutGrid },
  { id: 'poster', icon: ImageIcon },
  { id: 'worksheet', icon: NotebookPen },
  { id: 'supply', icon: Package },
  { id: 'other', icon: Headphones },
];

export const CATEGORY_CHIPS: { id: 'all' | ProductCategory; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'book', label: 'Sách' },
  { id: 'flashcard', label: 'Flashcard' },
  { id: 'poster', label: 'Poster' },
  { id: 'worksheet', label: 'Bài tập' },
  { id: 'supply', label: 'Đồ dùng' },
  { id: 'other', label: 'Khác' },
];
