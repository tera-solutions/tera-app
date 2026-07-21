# [092] - Student - Bài tập lật thẻ bài

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [092] |
| Module | Student |
| Screen | Bài tập lật thẻ bài |
| Sprint | Sprint 5 |
| Label | Sprint5, Student, Frontend, API |
| Mockup Desktop | screen/desktop/bai tap lat the bai.png |
| Mockup Mobile | screen/mobile/bai tap lat the bai.png |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Trò chơi ghi nhớ (memory matching game): học viên lật thẻ để tìm cặp từ vựng và hình ảnh giống nhau, giúp ghi nhớ từ vựng theo chủ đề.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/practice/flashcard-match/{id}`
- **Layout:** StudentLayout
- **Breadcrumb:** Ôn luyện > Từ vựng > Bài tập lật thẻ bài

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ ← Bài tập lật thẻ bài             [🔔][👤 Minh]      │
│           │ [Avatar] Chủ đề: Fruits  ███░ 6/10  [⭐150XP]        │
│           │ ┌──────────────────────────────────────────────┐    │
│           │ │ [apple][ ? ][apple][ ? ][banana]               │   │
│           │ │ [ ? ][banana][grapes][grapes][ ? ]             │   │
│           │ └──────────────────────────────────────────────┘    │
│           │ [Làm lại]              [Kiểm tra]                    │
│           │ [← Bài trước][💡 Gợi ý(2)][Bài tiếp theo →]          │
│           │                                    💡 Gợi ý          │
│           │                                    🎯 Mục tiêu: 6 cặp│
│           │                                    ⭐ Đã tìm: 2 cặp  │
│           │                                    ⏱ Thời gian 01:15│
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 ExerciseHeader

- Chủ đề, progress x/10, XP thưởng

### 5.2 CardGrid

- Lưới thẻ 2 cột x N hàng, mỗi thẻ có 2 mặt: mặt úp (dấu ?) và mặt ngửa (hình + từ)
- Click thẻ → lật; lật đúng 2 thẻ cùng cặp → giữ mở + hiệu ứng; sai → tự lật úp lại sau 1s

### 5.3 ActionBar

- `Làm lại` (reset trò chơi), `Kiểm tra` (xác nhận hoàn thành khi đã tìm đủ cặp)

### 5.4 LessonNavigator

- Bài trước / Gợi ý (số lượt còn lại) / Bài tiếp theo

### 5.5 HintPanel (Panel phải trên)

- Gợi ý cách chơi, nút "Đọc từ" (phát âm gợi ý)

### 5.6 GameStatsPanel (Panel phải dưới)

- Mục tiêu (tìm N cặp), số cặp đã tìm, thời gian chơi (đồng hồ đếm)

---

## 6. API Integration

### 6.1 API Flashcard Exercise Detail

**Endpoint:** `GET /api/student/practice/flashcard-match/{id}`

**Response (200):**
```json
{
  "topic": "Fruits",
  "position": 6,
  "total": 10,
  "xp": 150,
  "target_pairs": 6,
  "cards": [
    { "id": 1, "pair_id": 1, "type": "image", "value": "apple.png" },
    { "id": 2, "pair_id": 1, "type": "word", "value": "apple" }
  ]
}
```

---

### 6.2 API Submit Result

**Endpoint:** `POST /api/student/practice/flashcard-match/{id}/complete`

**Request body:** `{ "time_seconds": 95, "hints_used": 1, "attempts": 8 }`

**Response (200):** `{ "xp_earned": 150, "stars": 3, "next_id": 7 }`

---

## 7. State Management

```typescript
flashcardStore.setCards(cards)
flashcardStore.flipCard(id)
flashcardStore.setMatchedPairs(count)
flashcardStore.setTimer(seconds)
flashcardStore.resetGame()
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load bài | Hiển thị lưới thẻ úp toàn bộ |
| 2 | Lật 2 thẻ đúng cặp | Giữ mở, cập nhật "Đã tìm" |
| 3 | Lật 2 thẻ sai cặp | Tự lật lại sau ~1s |
| 4 | Tìm đủ số cặp mục tiêu | Nút "Kiểm tra" active, cho phép hoàn thành |
| 5 | Làm lại | Reset toàn bộ thẻ + thời gian |
| 6 | Dùng gợi ý | Giảm số lượt gợi ý còn lại |
| 7 | Hoàn thành bài | Ghi nhận XP + sao, điều hướng bài tiếp theo |
