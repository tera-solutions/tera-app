# [091] - Student - Bài tập luyện nghe Story

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [091] |
| Module | Student |
| Screen | Bài tập luyện nghe Story |
| Sprint | Sprint 5 |
| Label | Sprint5, Student, Frontend, API |
| Mockup Desktop | screen/desktop/luyen nghe story.png |
| Mockup Mobile | screen/mobile/luyen nghe story.png |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Bài tập luyện nghe theo dạng câu chuyện có video minh họa: học viên nghe/xem story, đọc theo phụ đề từng câu, học từ vựng xuất hiện trong story.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/practice/listening-story/{id}`
- **Layout:** StudentLayout (ẩn sidebar phụ, giữ sidebar chính)
- **Breadcrumb:** Ôn luyện > Nghe hiểu > Bài tập luyện nghe Story

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ ← Bài tập luyện nghe Story        [?][🔔][👤 Minh]   │
│           │ [Avatar] Chủ đề: At the Park  ███░ 3/8   [⭐120XP]   │
│           │ ┌──────────────────────────────┐  Từ vựng đã học     │
│           │ │      [Video player 00:07/41] │  park, ball, happy, │
│           │ └──────────────────────────────┘  play, together,    │
│           │ ● Tom is at the park.  🔊 ⭐      beautiful (nghĩa+🔊)│
│           │ ○ He has a ball.        🔊         Tiến độ bài học   │
│           │ ○ The dog is happy.     🔊         [Nghe][Độ chính   │
│           │ ○ They play together.   🔊          xác][Điểm XP]    │
│           │ ○ What a beautiful day! 🔊         Bài học            │
│           │ [Từ vựng đã học trong story ▾]     [← Trước][3/8][Sau→]│
│           │ [Nghe lại][⏸ Pause][Dịch tất cả]   💡 Gợi ý           │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 ExerciseHeader

- Chủ đề bài tập, progress x/8, XP thưởng

### 5.2 StoryVideoPlayer

- Video minh họa story (play/pause, timeline, fullscreen)
- Đồng bộ highlight câu phụ đề đang phát (dot xanh ở timeline câu)

### 5.3 SubtitleTimeline

- Danh sách câu thoại story: câu tiếng Anh (highlight từ khóa theo màu), nghĩa tiếng Việt, icon loa phát âm riêng câu, ngôi sao đánh dấu câu quan trọng
- Câu đang phát được highlight khung xanh

### 5.4 ControlBar

- `Nghe lại`, `Pause/Play`, `Dịch tất cả`

### 5.5 LearnedVocabularyPanel (Panel phải)

- Danh sách từ vựng xuất hiện trong story: hình minh họa nhỏ, từ, loại từ, nghĩa, nút phát âm

### 5.6 LessonProgressStats

- Thời gian nghe, độ chính xác %, điểm XP

### 5.7 LessonNavigator

- Bài trước / vị trí x/8 / Bài tiếp theo

### 5.8 HintBox

- Gợi ý cách luyện nghe hiệu quả, số lượt gợi ý còn lại

---

## 6. API Integration

### 6.1 API Story Exercise Detail

**Endpoint:** `GET /api/student/practice/listening-story/{id}`

**Response (200):**
```json
{
  "topic": "At the Park",
  "position": 3,
  "total": 8,
  "xp": 120,
  "video_url": "https://...",
  "sentences": [
    { "en": "Tom is at the park.", "vi": "Tom đang ở công viên.", "highlight_word": "park", "audio_url": "https://..." }
  ],
  "vocabulary": [ { "word": "park", "type": "n", "meaning": "công viên", "image": "https://..." } ]
}
```

---

### 6.2 API Submit Progress

**Endpoint:** `POST /api/student/practice/listening-story/{id}/complete`

**Request body:** `{ "listening_time_seconds": 341, "accuracy": 85 }`

**Response (200):** `{ "xp_earned": 120, "next_id": 4 }`

---

## 7. State Management

```typescript
storyExerciseStore.setData(exercise)
storyExerciseStore.setCurrentSentenceIndex(index)
storyExerciseStore.setPlaying(bool)
storyExerciseStore.setTranslateAll(bool)
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load bài | Video + phụ đề + từ vựng hiển thị đúng |
| 2 | Video phát | Câu phụ đề tương ứng được highlight |
| 3 | Click loa từng câu | Phát audio đúng câu đó |
| 4 | Dịch tất cả | Hiện nghĩa tiếng Việt toàn bộ câu |
| 5 | Click từ vựng | Phát âm từ đó |
| 6 | Hoàn thành bài | Ghi nhận XP, điều hướng bài tiếp theo |
| 7 | Bài trước/sau | Điều hướng đúng, giữ tiến độ |
