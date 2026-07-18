// Không có API bộ thẻ Flashcard thật trong repo (cùng lý do đã ghi ở
// VocabularyScreen/constants.ts — chưa có product/vocabulary API nào). Màn
// "Tạo Flashcard" dưới đây dựng đúng giao diện bước 1/3 ("Nội dung") theo
// mockup; các thao tác nhập liệu/toggle/sắp xếp hoạt động thật ở client,
// nhưng "Lưu nháp"/"Tiếp tục" là stub vì chưa có bước 2, 3 và chưa có API lưu
// bộ thẻ thật phía sau.
export const AGE_RANGE_OPTIONS = ['2 - 4 tuổi', '4 - 6 tuổi', '6 - 8 tuổi', '8 - 10 tuổi', '10+ tuổi'];

export const STUDY_MODE_OPTIONS = ['Cả 2 mặt', 'Chỉ mặt trước (từ vựng)', 'Chỉ mặt sau (nghĩa)'];

export const DISPLAY_ORDER_OPTIONS = ['Theo thứ tự tạo', 'Ngẫu nhiên', 'Từ dễ đến khó'];

export const CARD_SORT_OPTIONS = ['Thứ tự tạo', 'A-Z', 'Z-A'];

export interface FlashcardItem {
  id: string;
  word: string;
  phonetic: string;
}

// Bộ thẻ mẫu "Animals – Động vật" — Cat/Dog/Rabbit khớp đúng 3 thẻ đầu ở
// mockup, các thẻ còn lại là từ vựng chủ đề động vật thêm vào cho đủ 12 thẻ.
export const FLASHCARD_SEED: FlashcardItem[] = [
  { id: 'f1', word: 'Cat', phonetic: '/kæt/' },
  { id: 'f2', word: 'Dog', phonetic: '/dɒg/' },
  { id: 'f3', word: 'Rabbit', phonetic: '/ˈræbɪt/' },
  { id: 'f4', word: 'Elephant', phonetic: '/ˈelɪfənt/' },
  { id: 'f5', word: 'Lion', phonetic: '/ˈlaɪən/' },
  { id: 'f6', word: 'Tiger', phonetic: '/ˈtaɪgə/' },
  { id: 'f7', word: 'Bird', phonetic: '/bɜːd/' },
  { id: 'f8', word: 'Fish', phonetic: '/fɪʃ/' },
  { id: 'f9', word: 'Horse', phonetic: '/hɔːs/' },
  { id: 'f10', word: 'Cow', phonetic: '/kaʊ/' },
  { id: 'f11', word: 'Pig', phonetic: '/pɪg/' },
  { id: 'f12', word: 'Duck', phonetic: '/dʌk/' },
];

export const toBracketPhonetic = (phonetic: string) => `[${phonetic.replace(/\//g, '')}]`;
