# [096] - Student - Bài tập luyện viết

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [096] |
| Module | Student |
| Screen | Bài tập luyện viết |
| Sprint | Sprint 5 |
| Label | Sprint5, Student, Frontend, API |
| Mockup Desktop | screen/desktop/bai tap luyen viet.png |
| Mockup Mobile | screen/mobile/bai tap luyen viet.png |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Bài tập luyện viết chữ: học viên nhìn tranh và viết/tô theo từ mẫu (tracing), có gợi ý nét chữ và kiểm tra kết quả.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/practice/writing/{id}`
- **Layout:** StudentLayout
- **Breadcrumb:** Ôn luyện > Viết > Bài tập luyện viết

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Practice > Writing Exercise    [⭐1250][🔥12][🔔][Minh]│
│           │ [Avatar] Chủ đề: Animals ████░ 40%      [⭐120XP]     │
│           │ Nhìn tranh và viết từ                    Từ mẫu       │
│           │ ┌──────────────────────────────┐  [cat🔊][dog🔊]      │
│           │ │        [Ảnh con mèo]          │  [bird🔊][fish🔊]    │
│           │ └──────────────────────────────┘  [cow🔊][elephant🔊] │
│           │ [🔊 Listen]                       AI Teacher: "Nhớ    │
│           │ ┌ - - - c a t - - - ┐  (tracing)   chữ 't' cao hơn"   │
│           │ 💡 Gợi ý: c bắt đầu từ đường kẻ...  Tiến độ kỹ năng   │
│           │ [Xóa]              [Kiểm tra]      [5 thanh %]        │
│           │ ✅ Làm tốt lắm! Bạn đã viết đúng.   +10XP  Phần thưởng│
│           │                        [← Bài trước][Bài tiếp theo →] │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 ExerciseHeader

- Chủ đề, progress %, XP thưởng

### 5.2 PromptImage

- Ảnh minh họa đối tượng cần viết + nút `Listen` phát âm từ

### 5.3 TracingCanvas

- Khu vực viết/tô chữ theo mẫu nét đứt (canvas hỗ trợ vẽ bằng chuột/bút cảm ứng)
- Nút `Xóa` (reset nét vẽ), nút `Kiểm tra` (so khớp nét viết với mẫu)

### 5.4 HintText

- Gợi ý cách viết từng chữ cái (VD: "c bắt đầu từ đường kẻ ngang giữa")

### 5.5 ResultFeedbackBanner

- Thông báo kết quả (đúng/gần đúng/sai) + XP nhận được

### 5.6 SampleWordGrid (Panel phải trên)

- Các từ mẫu khác trong chủ đề, mỗi từ có icon + nút phát âm (tham khảo nhanh)

### 5.7 AiTeacherTipCard (Panel phải giữa)

- Gợi ý từ AI Teacher (nhân vật) + nút "Hỏi Hana AI"

### 5.8 SkillProgressBars (Panel phải)

- 5 thanh tiến độ kỹ năng: Vocabulary, Listening, Speaking, Reading, Writing

### 5.9 TodayRewardCard (Panel phải dưới)

- XP, ngày streak, huy hiệu đạt được hôm nay

### 5.10 NavigationBar

- Bài trước / Bài tiếp theo

---

## 6. API Integration

### 6.1 API Writing Exercise Detail

**Endpoint:** `GET /api/student/practice/writing/{id}`

**Response (200):**
```json
{
  "topic": "Animals",
  "progress_percent": 40,
  "xp": 120,
  "image": "https://...",
  "target_word": "cat",
  "audio_url": "https://...",
  "hint": "c bắt đầu từ đường kẻ ngang giữa, a viết tròn, t cao hơn kẻ ngang giữa.",
  "sample_words": [ { "word": "cat", "audio_url": "https://..." }, { "word": "dog", "audio_url": "https://..." } ],
  "skill_progress": { "vocabulary": 82, "listening": 75, "speaking": 70, "reading": 80, "writing": 60 }
}
```

---

### 6.2 API Submit Writing

**Endpoint:** `POST /api/student/practice/writing/{id}/submit`

**Request body:** `{ "strokes_data": "...", "typed_answer": "cat" }`

**Response (200):** `{ "correct": true, "xp_earned": 10, "message": "Bạn đã viết đúng." }`

---

## 7. State Management

```typescript
writingExerciseStore.setData(exercise)
writingExerciseStore.setCanvasStrokes(strokes)
writingExerciseStore.clearCanvas()
writingExerciseStore.setResult(result)
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load bài | Hiển thị ảnh + khung tracing + từ mẫu |
| 2 | Click "Listen" | Phát âm từ mục tiêu |
| 3 | Viết đúng theo mẫu | Banner "Làm tốt lắm" + XP |
| 4 | Viết sai | Hiện gợi ý sửa, cho viết lại |
| 5 | Click "Xóa" | Xóa toàn bộ nét đã viết |
| 6 | Xem từ mẫu khác | Phát âm đúng từ được chọn |
| 7 | Bài tiếp theo | Điều hướng đúng, giữ tiến độ % |
