# [099] - Student - Bài tập từ vựng

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [099] |
| Module | Student |
| Screen | Bài tập từ vựng |
| Sprint | Sprint 5 |
| Label | Sprint5, Student, Frontend, API |
| Mockup Desktop | screen/desktop/bai tap tu vung.png |
| Mockup Mobile | screen/mobile/bai tap tu vung.png |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Bài tập trắc nghiệm từ vựng dạng nghe-chọn: học viên nghe từ vựng được đọc và chọn từ đúng khớp với hình ảnh trong 4 lựa chọn.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/practice/vocabulary/{id}`
- **Layout:** StudentLayout
- **Breadcrumb:** Ôn luyện > Từ vựng > Bài tập từ vựng

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Practice > Vocabulary          [⭐1250][🔥12][🔔][Minh]│
│           │ [Avatar] Chủ đề: Animals ████░ 4/10  [⭐120XP]        │
│           │ Nghe và chọn từ đúng                    💡 Gợi ý làm  │
│           │ ┌──────────────────────────────┐  bài                │
│           │ │       [Ảnh con chó]           │  - Nghe từ vựng kỹ │
│           │ └──────────────────────────────┘  - Chọn từ đúng với │
│           │ [cat]           [dog ✓]           hình               │
│           │ [rabbit]        [bird]           - Có thể nghe lại   │
│           │ [💡 Gợi ý(3)][🔊 Nghe lại][⏭ Bỏ qua]  Tiến độ [5 thanh]│
│           │ ✅ Làm tốt lắm! Bạn đã chọn đúng đáp án.     +10XP    │
│           │ [Bài 4/10 ████████░░░░░░░░░░ 🎁]  Thành tích hôm nay │
│           │ [← Bài trước]              [Bài tiếp theo →]          │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 ExerciseHeader

- Chủ đề, progress x/10, XP thưởng

### 5.2 PromptImage

- Ảnh minh họa đối tượng từ vựng

### 5.3 AnswerOptionGrid

- 4 đáp án dạng thẻ chữ (2x2), radio chọn
- Đáp án đúng: viền xanh + dấu tick khi chọn đúng

### 5.4 ActionBar

- `Gợi ý` (số lượt còn lại), `Nghe lại`, `Bỏ qua`

### 5.5 ResultFeedbackBanner

- Thông báo kết quả + XP nhận được

### 5.6 ProgressBarWithMilestone

- Thanh tiến độ bài x/10 với icon rương quà ở cuối (phần thưởng khi hoàn thành hết)

### 5.7 TipsPanel (Panel phải trên)

- Gợi ý làm bài

### 5.8 SkillProgressBars (Panel phải giữa)

- 5 thanh kỹ năng: Từ vựng, Nghe, Nói, Đọc, Viết

### 5.9 TodayAchievementCard (Panel phải dưới)

- XP, streak, huy hiệu, phút học hôm nay

### 5.10 NavigationBar

- Bài trước / Bài tiếp theo

---

## 6. API Integration

### 6.1 API Vocabulary Exercise Detail

**Endpoint:** `GET /api/student/practice/vocabulary/{id}`

**Response (200):**
```json
{
  "topic": "Animals",
  "position": 4,
  "total": 10,
  "xp": 120,
  "image": "https://...",
  "audio_url": "https://...",
  "options": [ { "id": 1, "label": "cat" }, { "id": 2, "label": "dog" }, { "id": 3, "label": "rabbit" }, { "id": 4, "label": "bird" } ]
}
```

---

### 6.2 API Submit Answer

**Endpoint:** `POST /api/student/practice/vocabulary/{id}/answer`

**Request body:** `{ "option_id": 2 }`

**Response (200):** `{ "correct": true, "xp_earned": 10, "message": "Bạn đã chọn đúng đáp án." }`

---

## 7. State Management

```typescript
vocabularyExerciseStore.setData(exercise)
vocabularyExerciseStore.setSelectedOption(id)
vocabularyExerciseStore.setResult(result)
vocabularyExerciseStore.setHintsUsed(count)
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load bài | Hiển thị ảnh + 4 đáp án |
| 2 | Nghe lại | Phát lại âm thanh từ vựng |
| 3 | Chọn đáp án đúng | Banner "Làm tốt lắm" + XP |
| 4 | Chọn đáp án sai | Phản hồi sai, cho chọn lại |
| 5 | Dùng gợi ý | Giảm số lượt gợi ý còn lại |
| 6 | Bỏ qua | Chuyển bài tiếp theo, không tính điểm |
| 7 | Hoàn thành 10/10 bài | Hiện phần thưởng rương quà |
