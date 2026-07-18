// Bước 3/4 ("Cài đặt") của luồng tạo Mini Game từ vựng. Không có API mini
// game thật nên toàn bộ cấu hình chỉ tồn tại ở state cục bộ của màn hình này
// (không có Context/store dùng chung với bước 1 "Cấu hình" / bước 2 "Nội
// dung" — xem giới hạn đã ghi trong index.tsx).
export const TIME_LIMIT_OPTIONS = ['Không giới hạn', '3 phút', '5 phút', '10 phút', '15 phút'];

export const LIVES_OPTIONS = ['Không giới hạn', '1 mạng', '3 mạng', '5 mạng'];

export const PASSING_SCORE_OPTIONS = ['Không yêu cầu', '50%', '70%', '80%', '100%'];

export interface GameplayRuleItem {
  key: 'shuffleQuestions' | 'shuffleAnswers' | 'allowRetry' | 'allowSkip';
  label: string;
  description: string;
}

export const GAMEPLAY_RULES: GameplayRuleItem[] = [
  {
    key: 'shuffleQuestions',
    label: 'Xáo trộn thứ tự câu hỏi',
    description: 'Mỗi lượt chơi câu hỏi sẽ xuất hiện theo thứ tự ngẫu nhiên',
  },
  {
    key: 'shuffleAnswers',
    label: 'Xáo trộn đáp án',
    description: 'Vị trí đáp án đúng/sai thay đổi ngẫu nhiên mỗi lượt',
  },
  {
    key: 'allowRetry',
    label: 'Cho phép làm lại khi sai',
    description: 'Học sinh được chọn lại nếu trả lời sai câu hỏi',
  },
  {
    key: 'allowSkip',
    label: 'Cho phép bỏ qua câu hỏi',
    description: 'Học sinh có thể bỏ qua và quay lại câu hỏi sau',
  },
];

export interface SoundRuleItem {
  key: 'backgroundMusic' | 'soundEffects' | 'vibrateOnWrong';
  label: string;
  description: string;
}

export const SOUND_RULES: SoundRuleItem[] = [
  {
    key: 'backgroundMusic',
    label: 'Nhạc nền',
    description: 'Phát nhạc nền xuyên suốt trong lúc chơi',
  },
  {
    key: 'soundEffects',
    label: 'Hiệu ứng âm thanh',
    description: 'Phát âm thanh khi trả lời đúng/sai',
  },
  {
    key: 'vibrateOnWrong',
    label: 'Rung khi trả lời sai',
    description: 'Thiết bị rung nhẹ để phản hồi khi chọn sai đáp án',
  },
];
