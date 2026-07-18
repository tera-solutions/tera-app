import {
  ArrowDownUp,
  Disc3,
  Grid3x3,
  ListChecks,
  LucideIcon,
  PenLine,
  PersonStanding,
  Puzzle,
  Search,
} from 'lucide-react-native';

// Bước 1/4 ("Cấu hình") của luồng tạo Mini Game từ vựng. Không có API mini
// game thật (cùng lý do đã ghi ở VocabularyScreen/constants.ts — chưa có
// vocabulary/game API nào). Danh sách từ vựng chọn được lấy từ đúng
// VOCAB_ITEMS dùng chung với màn Danh sách từ vựng — đây là dữ liệu thật của
// app (không phải bản sao riêng).
export type Difficulty = 'easy' | 'medium' | 'hard';

export const DIFFICULTY_OPTIONS: Difficulty[] = ['easy', 'medium', 'hard'];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Dễ',
  medium: 'Trung bình',
  hard: 'Khó',
};

export interface GameType {
  id: string;
  label: string;
  sublabel: string;
  icon: LucideIcon;
}

export const GAME_TYPES: GameType[] = [
  {
    id: 'choose-answer',
    label: 'Chọn đáp án đúng',
    sublabel: 'Chọn từ đúng với hình ảnh/âm thanh',
    icon: ListChecks,
  },
  {
    id: 'matching',
    label: 'Ghép đôi',
    sublabel: 'Ghép từ với hình ảnh hoặc nghĩa',
    icon: Puzzle,
  },
  {
    id: 'fill-blank',
    label: 'Điền vào chỗ trống',
    sublabel: 'Điền từ còn thiếu vào câu',
    icon: PenLine,
  },
  {
    id: 'arrange',
    label: 'Sắp xếp',
    sublabel: 'Sắp xếp từ thành câu hoàn chỉnh',
    icon: ArrowDownUp,
  },
  {
    id: 'guess-word',
    label: 'Đoán từ',
    sublabel: 'Đoán từ theo gợi ý (hình ảnh, nghĩa...)',
    icon: Search,
  },
  {
    id: 'bingo',
    label: 'Bingo',
    sublabel: 'Tìm từ theo bảng Bingo',
    icon: Grid3x3,
  },
  {
    id: 'obstacle',
    label: 'Vượt chướng ngại vật',
    sublabel: 'Trả lời đúng để vượt chướng ngại vật',
    icon: PersonStanding,
  },
  {
    id: 'spin-reward',
    label: 'Quay thưởng',
    sublabel: 'Quay và trả lời để nhận phần thưởng',
    icon: Disc3,
  },
];

export const TIME_PER_QUESTION_OPTIONS = ['10 giây', '15 giây', '20 giây', '30 giây', '45 giây', '60 giây'];

export const QUESTION_COUNT_OPTIONS = ['5 câu', '10 câu', '15 câu', '20 câu', 'Tất cả từ đã chọn'];

export const POINTS_PER_QUESTION_OPTIONS = ['5 điểm', '10 điểm', '15 điểm', '20 điểm'];
