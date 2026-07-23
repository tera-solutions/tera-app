# [093] - Student - Bài tập đoạn hội thoại

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [093] |
| Module | Student |
| Screen | Bài tập đoạn hội thoại |
| Sprint | Sprint 5 |
| Label | Sprint5, Student, Frontend, API |
| Mockup Desktop | screen/desktop/bai tap luyen doan hoi thoai.png |
| Mockup Mobile | screen/mobile/bai tap luyen doan hoi thoai.png |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Bài tập đọc hiểu đoạn hội thoại: học viên đọc đoạn hội thoại có hình minh họa, chọn đáp án phù hợp để hoàn thiện câu trả lời còn thiếu.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/practice/dialogue/{id}`
- **Layout:** StudentLayout
- **Breadcrumb:** Ôn luyện > Đọc hiểu > Bài tập đoạn hội thoại

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ ← Bài tập đoạn hội thoại        [🔔][👤 Minh]        │
│           │ [Avatar] Chủ đề: At the Zoo  ███░ 3/10  [⭐120XP]    │
│           │ Đọc và chọn câu trả lời phù hợp                      │
│           │ ┌──────────────────────────────┐  💡 Gợi ý (2)       │
│           │ │      [Ảnh minh họa hội thoại]│  [Nghe lại][Dịch]   │
│           │ └──────────────────────────────┘                      │
│           │ 🧑 Tom: Look! What animal is that? 🔊                 │
│           │ 👧 Lily: It's a ________. 🔊                          │
│           │ 🧑 Tom: Wow! It's so tall! 🔊                         │
│           │ [🐘 elephant] [🦁 lion]                                │
│           │ [🦒 giraffe ✓] [🐼 panda]                              │
│           │ ✅ Chính xác! Bạn thật tuyệt vời!         +10XP        │
│           │ [← Bài trước]              [Bài tiếp theo →]           │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 ExerciseHeader

- Chủ đề, progress x/10, XP thưởng

### 5.2 DialogueImage

- Ảnh minh họa bối cảnh hội thoại

### 5.3 DialogueBubbleList

- Các câu thoại theo nhân vật (avatar + tên), câu có chỗ trống hiển thị gạch dưới, mỗi câu có nút phát âm

### 5.4 AnswerOptionGrid

- 4 đáp án dạng thẻ (icon + từ), chọn 1 đáp án
- Đáp án đúng: viền xanh + dấu tick; đáp án sai (nếu chọn): viền đỏ

### 5.5 ResultFeedbackBanner

- Thông báo "Chính xác!"/"Chưa đúng, thử lại nhé" kèm XP nhận được

### 5.6 HintPanel (Panel phải)

- Gợi ý nội dung, nút `Nghe lại`, `Dịch nghĩa`

### 5.7 NavigationBar

- Bài trước / Bài tiếp theo (chỉ active sau khi trả lời)

---

## 6. API Integration

### 6.1 API Dialogue Exercise Detail

**Endpoint:** `GET /api/student/practice/dialogue/{id}`

**Response (200):**
```json
{
  "topic": "At the Zoo",
  "position": 3,
  "total": 10,
  "xp": 120,
  "image": "https://...",
  "dialogue": [
    { "speaker": "Tom", "text": "Look! What animal is that?", "audio_url": "https://..." },
    { "speaker": "Lily", "text": "It's a ________.", "is_blank": true },
    { "speaker": "Tom", "text": "Wow! It's so tall!", "audio_url": "https://..." }
  ],
  "options": [
    { "id": 1, "label": "elephant", "icon": "🐘" },
    { "id": 2, "label": "giraffe", "icon": "🦒" }
  ]
}
```

---

### 6.2 API Submit Answer

**Endpoint:** `POST /api/student/practice/dialogue/{id}/answer`

**Request body:** `{ "option_id": 2 }`

**Response (200):** `{ "correct": true, "xp_earned": 10, "correct_option_id": 2 }`

---

## 7. State Management

```typescript
dialogueExerciseStore.setData(exercise)
dialogueExerciseStore.setSelectedOption(id)
dialogueExerciseStore.setResult(result)
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load bài | Hiển thị hội thoại + 4 đáp án |
| 2 | Chọn đáp án đúng | Hiện banner "Chính xác" + XP |
| 3 | Chọn đáp án sai | Hiện phản hồi sai, cho thử lại |
| 4 | Click loa từng câu | Phát audio đúng câu |
| 5 | Click "Dịch nghĩa" | Hiện nghĩa tiếng Việt |
| 6 | Bài tiếp theo | Chỉ active sau khi đã trả lời |
