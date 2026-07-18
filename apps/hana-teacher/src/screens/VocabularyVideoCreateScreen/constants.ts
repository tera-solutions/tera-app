// Không có API tạo video từ vựng thật trong repo (cùng lý do đã ghi ở
// VocabularyScreen/constants.ts và FlashcardCreateScreen/constants.ts — chưa
// có vocabulary/video API nào). Màn "Tạo video từ vựng" dưới đây dựng đúng
// giao diện bước 1/4 ("Nội dung") theo mockup; nhập liệu/toggle/sắp xếp/xoá
// từ hoạt động thật ở client, "Lưu nháp"/"Tiếp tục" là stub vì chưa có bước
// 2, 3, 4 và chưa có API render video thật phía sau.
export const AGE_RANGE_OPTIONS = ['2 - 4 tuổi', '4 - 6 tuổi', '6 - 8 tuổi', '8 - 10 tuổi', '10+ tuổi'];

export const TRANSITION_OPTIONS = ['Mềm mại', 'Cắt nhanh', 'Mờ dần', 'Trượt ngang'];

export const DURATION_OPTIONS = ['2 giây', '3 giây', '4 giây', '5 giây'];

export const DISPLAY_ORDER_OPTIONS = ['Theo thứ tự đã sắp xếp', 'Ngẫu nhiên'];

export const REPEAT_OPTIONS = ['1 lần', '2 lần', '3 lần', 'Lặp vô hạn'];

export interface VideoVocabItem {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
}

// Cat/Dog/Rabbit/Elephant/Giraffe khớp đúng 5 từ ở mockup (phonetic/meaning
// Cat, Dog, Rabbit thống nhất với VOCAB_ITEMS bên VocabularyScreen).
export const VIDEO_VOCAB_SEED: VideoVocabItem[] = [
  { id: 'w1', word: 'Cat', phonetic: '/kæt/', meaning: 'Con mèo' },
  { id: 'w2', word: 'Dog', phonetic: '/dɒg/', meaning: 'Con chó' },
  { id: 'w3', word: 'Rabbit', phonetic: '/ˈræbɪt/', meaning: 'Con thỏ' },
  { id: 'w4', word: 'Elephant', phonetic: '/ˈelɪfənt/', meaning: 'Con voi' },
  { id: 'w5', word: 'Giraffe', phonetic: '/dʒəˈrɑːf/', meaning: 'Hươu cao cổ' },
];

export const MAX_VOCAB_IN_VIDEO = 50;
