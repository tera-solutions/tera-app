// Bước 2/4 ("Nội dung") của luồng tạo Mini Game từ vựng. Không có API mini
// game thật nên toàn bộ nội dung câu hỏi chỉ tồn tại ở state cục bộ của màn
// hình này (không có Context/store dùng chung với bước 1 "Cấu hình" — xem
// giới hạn đã ghi trong index.tsx). Danh sách từ vựng minh hoạ lấy từ đúng
// VOCAB_ITEMS dùng chung với màn Danh sách từ vựng.
export interface ContentQuestionItem {
  wordId: string;
  distractorIds: string[];
  hint?: string;
  useImage: boolean;
  useAudio: boolean;
}

export const CONTENT_QUESTIONS_SEED: ContentQuestionItem[] = [
  {
    wordId: 'v1',
    distractorIds: ['v2', 'v25'],
    hint: 'Loài vật nuôi phổ biến, kêu "meo meo".',
    useImage: true,
    useAudio: true,
  },
  { wordId: 'v2', distractorIds: ['v1', 'v3'], useImage: true, useAudio: true },
  { wordId: 'v3', distractorIds: ['v1', 'v2'], useImage: true, useAudio: false },
  { wordId: 'v25', distractorIds: ['v1', 'v3'], useImage: true, useAudio: true },
];

export const HINT_MAX = 120;
