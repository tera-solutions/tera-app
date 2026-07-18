import {
  Apple,
  Backpack,
  Briefcase,
  Bus,
  Cloud,
  Cookie,
  Hash,
  Heart,
  LucideIcon,
  Palette,
  PawPrint,
  Shirt,
  Smile,
  Sofa,
  Trees,
  Trophy,
  Users,
} from 'lucide-react-native';

// Không có API từ vựng thật trong repo (đã kiểm tra services/api,
// services/modules, webs/teacher — không có route/màn hình vocabulary nào).
// Toàn bộ danh sách chủ đề/từ vựng dưới đây là dữ liệu MẪU cố định, chỉ để
// dựng đúng giao diện; học/yêu thích hoạt động thật ở client (đổi state cục
// bộ), không có API lưu tiến độ học thật phía sau. Ảnh minh hoạ dùng icon chủ
// đề thay cho ảnh chụp thật (repo không có kho ảnh từ vựng).
export type VocabLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Topic {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

// 16 chủ đề — khớp đúng số "16 Chủ đề" ở thẻ thống kê mockup (không phải số
// minh hoạ tách rời, mà tính thật từ độ dài mảng này).
export const TOPICS: Topic[] = [
  { id: 'animal', label: 'Động vật', icon: PawPrint, color: '#16A34A' },
  { id: 'fruit', label: 'Trái cây', icon: Apple, color: '#DC2626' },
  { id: 'food', label: 'Thức ăn', icon: Cookie, color: '#EA580C' },
  { id: 'family', label: 'Gia đình', icon: Users, color: '#8B5CF6' },
  { id: 'color', label: 'Màu sắc', icon: Palette, color: '#DB2777' },
  { id: 'number', label: 'Số đếm', icon: Hash, color: '#0EA5E9' },
  { id: 'weather', label: 'Thời tiết', icon: Cloud, color: '#64748B' },
  { id: 'job', label: 'Nghề nghiệp', icon: Briefcase, color: '#2563EB' },
  { id: 'school', label: 'Trường học', icon: Backpack, color: '#7C3AED' },
  { id: 'sport', label: 'Thể thao', icon: Trophy, color: '#F59E0B' },
  { id: 'transport', label: 'Giao thông', icon: Bus, color: '#0891B2' },
  { id: 'emotion', label: 'Cảm xúc', icon: Smile, color: '#F97316' },
  { id: 'body', label: 'Cơ thể', icon: Heart, color: '#DC2626' },
  { id: 'clothes', label: 'Quần áo', icon: Shirt, color: '#16A34A' },
  { id: 'nature', label: 'Thiên nhiên', icon: Trees, color: '#15803D' },
  { id: 'furniture', label: 'Đồ vật', icon: Sofa, color: '#92400E' },
];

export const topicById = (id: string) => TOPICS.find((t) => t.id === id) ?? TOPICS[0];

export const LEVEL_LABELS: Record<VocabLevel, string> = {
  A1: 'A1 – Cơ bản',
  A2: 'A2 – Sơ cấp',
  B1: 'B1 – Trung cấp',
  B2: 'B2 – Trung cao cấp',
  C1: 'C1 – Cao cấp',
  C2: 'C2 – Thành thạo',
};

export interface ExampleSentence {
  text: string;
  translation: string;
}

export interface VocabItem {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  topicId: string;
  level: VocabLevel;
  hasAudio: boolean;
  hasVideo: boolean;
  learned: boolean;
  favorite: boolean;
  // Các trường dưới đây chỉ điền chi tiết đầy đủ cho từ mẫu "Cat" để dựng đúng
  // giao diện màn Chi tiết từ vựng — các từ khác dùng dữ liệu rút gọn ở trên,
  // VocabularyDetailScreen tự ẩn phần nào không có dữ liệu.
  exampleTranslation?: string;
  wordType?: string;
  plural?: string;
  phoneticUk?: string;
  phoneticUs?: string;
  createdAt?: string;
  updatedAt?: string;
  extraExamples?: ExampleSentence[];
}

export const VOCAB_ITEMS: VocabItem[] = [
  {
    id: 'v1',
    word: 'Cat',
    phonetic: '/kæt/',
    meaning: 'Con mèo',
    example: 'I have a cat.',
    topicId: 'animal',
    level: 'A1',
    hasAudio: true,
    hasVideo: true,
    learned: true,
    favorite: true,
    exampleTranslation: 'Tôi có một con mèo.',
    wordType: 'Danh từ (Noun)',
    plural: 'Cats',
    phoneticUk: '/kæt/',
    phoneticUs: '/kæt/',
    createdAt: '2025-05-20T10:30:00',
    updatedAt: '2025-05-25T14:45:00',
    extraExamples: [
      { text: 'The cat is sleeping on the sofa.', translation: 'Con mèo đang ngủ trên ghế sofa.' },
      { text: 'My cat loves to play with yarn.', translation: 'Con mèo của tôi thích chơi với sợi len.' },
    ],
  },
  { id: 'v2', word: 'Dog', phonetic: '/dɒg/', meaning: 'Con chó', example: 'The dog is playful.', topicId: 'animal', level: 'A1', hasAudio: true, hasVideo: true, learned: true, favorite: true },
  { id: 'v3', word: 'Rabbit', phonetic: '/ˈræbɪt/', meaning: 'Con thỏ', example: 'The rabbit has long ears.', topicId: 'animal', level: 'A1', hasAudio: true, hasVideo: true, learned: false, favorite: true },
  { id: 'v25', word: 'Elephant', phonetic: '/ˈelɪfənt/', meaning: 'Con voi', example: 'The elephant is very big.', topicId: 'animal', level: 'A1', hasAudio: true, hasVideo: false, learned: false, favorite: false },
  { id: 'v4', word: 'Apple', phonetic: '/ˈæpl/', meaning: 'Quả táo', example: 'I eat an apple every day.', topicId: 'fruit', level: 'A1', hasAudio: true, hasVideo: true, learned: true, favorite: true },
  { id: 'v5', word: 'Banana', phonetic: "/bəˈnɑːnə/", meaning: 'Quả chuối', example: 'Banana is my favorite fruit.', topicId: 'fruit', level: 'A1', hasAudio: true, hasVideo: true, learned: false, favorite: true },
  { id: 'v6', word: 'Orange', phonetic: '/ˈɒrɪndʒ/', meaning: 'Quả cam', example: 'She squeezed an orange.', topicId: 'fruit', level: 'A1', hasAudio: true, hasVideo: false, learned: false, favorite: false },
  { id: 'v7', word: 'Bread', phonetic: '/bred/', meaning: 'Bánh mì', example: 'We had bread for breakfast.', topicId: 'food', level: 'A1', hasAudio: true, hasVideo: false, learned: true, favorite: false },
  { id: 'v8', word: 'Rice', phonetic: '/raɪs/', meaning: 'Cơm, gạo', example: 'Rice is a staple food in Vietnam.', topicId: 'food', level: 'A1', hasAudio: true, hasVideo: false, learned: false, favorite: false },
  { id: 'v9', word: 'Mother', phonetic: "/ˈmʌðə/", meaning: 'Mẹ', example: 'My mother is a teacher.', topicId: 'family', level: 'A1', hasAudio: true, hasVideo: true, learned: true, favorite: false },
  { id: 'v10', word: 'Father', phonetic: "/ˈfɑːðə/", meaning: 'Bố', example: 'My father works at a bank.', topicId: 'family', level: 'A1', hasAudio: true, hasVideo: true, learned: true, favorite: false },
  { id: 'v11', word: 'Sister', phonetic: "/ˈsɪstə/", meaning: 'Chị/em gái', example: 'I have one sister.', topicId: 'family', level: 'A1', hasAudio: true, hasVideo: false, learned: false, favorite: false },
  { id: 'v12', word: 'Red', phonetic: '/red/', meaning: 'Màu đỏ', example: 'The apple is red.', topicId: 'color', level: 'A1', hasAudio: true, hasVideo: false, learned: true, favorite: false },
  { id: 'v13', word: 'Blue', phonetic: '/bluː/', meaning: 'Màu xanh dương', example: 'The sky is blue.', topicId: 'color', level: 'A1', hasAudio: true, hasVideo: false, learned: false, favorite: false },
  { id: 'v14', word: 'One', phonetic: '/wʌn/', meaning: 'Số một', example: 'I have one book.', topicId: 'number', level: 'A1', hasAudio: true, hasVideo: false, learned: true, favorite: false },
  { id: 'v15', word: 'Two', phonetic: '/tuː/', meaning: 'Số hai', example: 'She has two cats.', topicId: 'number', level: 'A1', hasAudio: true, hasVideo: false, learned: true, favorite: false },
  { id: 'v16', word: 'Sunny', phonetic: "/ˈsʌni/", meaning: 'Trời nắng', example: 'It is sunny today.', topicId: 'weather', level: 'A2', hasAudio: true, hasVideo: false, learned: false, favorite: false },
  { id: 'v17', word: 'Rainy', phonetic: "/ˈreɪni/", meaning: 'Trời mưa', example: 'I don’t like rainy days.', topicId: 'weather', level: 'A2', hasAudio: true, hasVideo: false, learned: false, favorite: false },
  { id: 'v18', word: 'Teacher', phonetic: "/ˈtiːtʃə/", meaning: 'Giáo viên', example: 'The teacher is kind.', topicId: 'job', level: 'A1', hasAudio: true, hasVideo: true, learned: true, favorite: false },
  { id: 'v19', word: 'Doctor', phonetic: "/ˈdɒktə/", meaning: 'Bác sĩ', example: 'The doctor helped my mother.', topicId: 'job', level: 'A1', hasAudio: true, hasVideo: true, learned: false, favorite: false },
  { id: 'v20', word: 'Book', phonetic: '/bʊk/', meaning: 'Quyển sách', example: 'This book is interesting.', topicId: 'school', level: 'A1', hasAudio: true, hasVideo: false, learned: true, favorite: false },
  { id: 'v21', word: 'Football', phonetic: "/ˈfʊtbɔːl/", meaning: 'Bóng đá', example: 'Boys love playing football.', topicId: 'sport', level: 'A2', hasAudio: true, hasVideo: true, learned: false, favorite: true },
  { id: 'v22', word: 'Bus', phonetic: '/bʌs/', meaning: 'Xe buýt', example: 'We go to school by bus.', topicId: 'transport', level: 'A1', hasAudio: true, hasVideo: false, learned: false, favorite: false },
  { id: 'v23', word: 'Happy', phonetic: "/ˈhæpi/", meaning: 'Vui vẻ', example: 'She feels happy today.', topicId: 'emotion', level: 'A2', hasAudio: true, hasVideo: false, learned: true, favorite: false },
  { id: 'v24', word: 'Hand', phonetic: '/hænd/', meaning: 'Bàn tay', example: 'Wash your hands before eating.', topicId: 'body', level: 'A1', hasAudio: false, hasVideo: false, learned: false, favorite: false },
];

export type SortOption = 'newest' | 'az' | 'za';

export const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Mới nhất',
  az: 'Từ A-Z',
  za: 'Từ Z-A',
};

export const SORT_ORDER: SortOption[] = ['newest', 'az', 'za'];

export type VocabFilterTab = 'all' | 'unlearned' | 'learned' | 'favorite';

export const FILTER_TABS: { id: VocabFilterTab; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'unlearned', label: 'Chưa học' },
  { id: 'learned', label: 'Đã học' },
  { id: 'favorite', label: 'Yêu thích' },
];

// Số liệu minh hoạ tổng hệ thống — không khớp 1-1 với 24 từ mẫu ở VOCAB_ITEMS,
// cùng cách làm đã dùng ở HocLieuManageScreen/HocLieuOrderScreen.
export const TOTAL_VOCAB_COUNT = 256;
export const PRONOUNCED_COUNT = 198;
export const VIDEO_COUNT = 72;
