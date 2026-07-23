# [089] - Student - Chi tiết bài học

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [089] |
| Module | Student |
| Screen | Chi tiết bài học |
| Sprint | Sprint 5 |
| Label | Sprint5, Student, Frontend, API |
| Mockup Desktop | screen/desktop/bai hoc.png |
| Mockup Mobile | screen/mobile/bai học.png |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Trang học bài chi tiết: giới thiệu chủ đề, mục tiêu bài học, từ vựng mới, ví dụ câu, các lối tắt tới nội dung liên quan (bài tập về nhà, ôn tập, AI giáo viên/gia sư, luyện nói) và nút bắt đầu học.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/lesson/{id}`
- **Layout:** StudentLayout
- **Breadcrumb:** Lớp học > {Tên lớp} > {Tên bài học}

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ ← [Ảnh] Farm Animals  Bài 5/20 ████░ 45%   [Chào Minh]│
│           ├──────────────────────────────┬───────────────────────┤
│           │ [Nhân vật AI + thoại]         │ Tiến trình học tập    │
│           │      [Tiếp tục học]           │ Từ vựng 60% Nói 40%   │
│           ├──────────────────────────────┤ Nghe 50%  Đọc 30%     │
│           │ Chủ đề hiện tại: Farm Animals │ [Nội dung][Bài tập về │
│           │ Mục tiêu bài học (checklist)  │  nhà][Ôn tập]         │
│           │ Từ vựng mới: cow chicken pig  │ [AI Giáo viên][AI Gia │
│           │  sheep horse (ảnh+phiên âm)   │  sư][Luyện nói]       │
│           │ Ví dụ câu + [Nghe phát âm]    │ Bài học hiện tại       │
│           │      [Bắt đầu học]            │ [ảnh] Bài 5 [Tiếp tục] │
│           ├───────────────┬──────────────┤ Tiến trình tổng quan   │
│           │ Thành tích    │ Bài học tiếp │ Bài 5/20 ████░ 45%     │
│           │ hôm nay       │ theo (khóa)  │                        │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 LessonHeader

- Nút quay lại, ảnh chủ đề, tên bài học, Bài x/20 + progress bar %

### 5.2 AiCharacterIntro

- Nhân vật AI giới thiệu bài học bằng thoại, nút `Tiếp tục học` → vào luồng học chính

### 5.3 LessonObjectiveCard

- Chủ đề hiện tại + thời lượng ước tính
- Checklist mục tiêu bài học (đã hoàn thành = tick xanh)

### 5.4 NewVocabularyGrid

- 5 thẻ từ vựng mới: icon minh họa, từ, phiên âm IPA

### 5.5 ExampleSentenceCard

- Câu ví dụ tiếng Anh + nghĩa tiếng Việt
- Nút `Nghe phát âm` (audio)

### 5.6 StartLearningButton

- Nút chính `Bắt đầu học` → điều hướng vào flow học bài (video/nội dung tương tác)

### 5.7 TodayAchievementCard

- XP nhận được hôm nay, ngày streak, số sao đạt được

### 5.8 NextLessonCard

- Bài học tiếp theo (khóa nếu chưa hoàn thành bài hiện tại), thông báo điều kiện mở khóa

### 5.9 LearningProgressPanel (Panel phải trên)

- 4 chỉ số tròn %: Từ vựng, Nói, Nghe, Đọc

### 5.10 QuickActionGrid (Panel phải giữa)

- 6 ô: Nội dung bài học, Bài tập về nhà, Ôn tập, AI Giáo viên, AI Gia sư, Luyện nói — mỗi ô điều hướng tới màn hình tương ứng

### 5.11 CurrentLessonMiniCard + OverallProgressBar (Panel phải dưới)

---

## 6. API Integration

### 6.1 API Lesson Detail

**Endpoint:** `GET /api/student/lessons/{id}`

**Response (200):**
```json
{
  "id": 5,
  "title": "Farm Animals",
  "order": 5,
  "total_lessons": 20,
  "progress_percent": 45,
  "topic_image": "https://...",
  "duration_minutes": 15,
  "objectives": [
    { "text": "Nhận biết và gọi tên các con vật ở nông trại", "done": true },
    { "text": "Phát âm đúng 5 từ vựng mới", "done": true },
    { "text": "Sử dụng từ vựng trong câu đơn giản", "done": false }
  ],
  "vocabulary": [
    { "word": "cow", "ipa": "/kaʊ/", "image": "https://..." },
    { "word": "chicken", "ipa": "/ˈtʃɪkɪn/", "image": "https://..." }
  ],
  "example_sentence": { "en": "The cow is eating grass.", "vi": "Con bò đang ăn cỏ.", "audio_url": "https://..." },
  "skill_progress": { "vocabulary": 60, "speaking": 40, "listening": 50, "reading": 30 },
  "next_lesson": { "id": 6, "title": "Wild Animals", "locked": true }
}
```

---

### 6.2 API Start Lesson

**Endpoint:** `POST /api/student/lessons/{id}/start`

**Response (200):** `{ "session_id": "abc123", "redirect_url": "/lesson/5/learn" }`

---

### 6.3 API Today Achievement

**Endpoint:** `GET /api/student/lessons/{id}/today-achievement`

**Response (200):** `{ "xp": 120, "streak": 12, "stars": 3 }`

---

## 7. State Management

```typescript
lessonDetailStore.setLesson(lesson)
lessonDetailStore.setSkillProgress(progress)
lessonDetailStore.setTodayAchievement(achievement)
lessonDetailStore.startLesson()
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị đầy đủ nội dung bài học |
| 2 | Click "Bắt đầu học" / "Tiếp tục học" | Điều hướng vào flow học bài |
| 3 | Click "Nghe phát âm" | Phát audio câu ví dụ |
| 4 | Click ô "Bài tập về nhà" | Navigate sang màn hình bài tập |
| 5 | Click ô "AI Giáo viên" | Mở chat AI hỏi đáp |
| 6 | Bài học tiếp theo còn khóa | Không click được, hiện icon khóa |
| 7 | Mục tiêu bài học hoàn thành hết | Hiển thị dấu tick toàn bộ |
