# [090] - Student - Ôn luyện

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [090] |
| Module | Student |
| Screen | Ôn luyện |
| Sprint | Sprint 5 |
| Label | Sprint5, Student, Frontend, API |
| Mockup Desktop | screen/desktop/on luyen.png |
| Mockup Mobile | screen/mobile/màn hình ôn luyên.png |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Trang trung tâm ôn luyện: chọn kỹ năng (Từ vựng, Nghe hiểu, Nói theo, Đọc hiểu, Ngữ pháp, Viết), chọn chủ đề để ôn tập, và danh sách bài tập gợi ý theo trình độ học viên.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/practice`
- **Layout:** StudentLayout
- **Breadcrumb:** Ôn luyện

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ [🔍 Tìm bài tập, chủ đề, kỹ năng...]  [🔔][👤 Minh]   │
│           │ ┌────────────────────────────────┐  Tiến độ ôn luyện │
│           │ │ Ôn luyện — Luyện tập mỗi ngày   │  [Donut 70%]      │
│           │ └────────────────────────────────┘  28/40 bài, 350XP │
│           │ [Từ vựng][Nghe hiểu][Nói theo][Đọc hiểu][Ngữ pháp][Viết]│
│           │ Chọn chủ đề để ôn luyện                               │
│           │ [Animals][Food&Drinks][Family][School][Colors][Daily] │
│           │  18/25    15/20        20/25   12/20   10/15   8/15  │
│           │ Bài tập gợi ý cho bạn                                 │
│           │ [Chọn từ phù hợp với hình] Từ vựng  10 câu +15XP [Làm]│
│           │ [Nghe và chọn đáp án đúng] Nghe hiểu 8 câu +12XP [Làm]│
│           │ [Sắp xếp câu thành đoạn HT] Ngữ pháp 12 câu+20XP[Làm] │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 PracticeHeaderBanner

- Tiêu đề "Ôn luyện", mô tả ngắn, minh họa nhân vật

### 5.2 SkillTabBar

- 6 tab kỹ năng: Từ vựng (120 bài), Nghe hiểu (85 bài), Nói theo (60 bài), Đọc hiểu (75 bài), Ngữ pháp (90 bài), Viết (45 bài)
- Chọn tab → lọc danh sách chủ đề/bài tập gợi ý theo kỹ năng

### 5.3 PracticeProgressCard (Panel phải trên)

- Donut % hoàn thành tuần này
- Bài đã làm (x/y), XP nhận được

### 5.4 TopicSelectionCarousel

- Carousel các chủ đề (Animals, Food & Drinks, Family, School, Colors & Shapes, Daily Activities...)
- Mỗi thẻ: ảnh minh họa, tên chủ đề, tiến độ x/y bài, nút `Ôn luyện` → Navigate sang bài tập đầu tiên còn dang dở của chủ đề

### 5.5 SuggestedExerciseList

- Danh sách bài tập gợi ý: ảnh, tên bài, badge loại kỹ năng, số câu hỏi, XP thưởng, nút `Làm bài`
- Click `Làm bài` → Navigate tới đúng màn hình bài tập tương ứng (091–099 tùy loại)
- Link "Xem tất cả bài tập"

### 5.6 WeeklyAchievementPanel (Panel phải dưới)

- Hoàn thành bài tập (x/y), học liên tục (x/y ngày), XP đạt được, chủ đề đã học (x/y)
- Thông điệp động viên

---

## 6. API Integration

### 6.1 API Practice Overview

**Endpoint:** `GET /api/student/practice`

**Response (200):**
```json
{
  "skills": [
    { "key": "vocabulary", "label": "Từ vựng", "total_exercises": 120 },
    { "key": "listening", "label": "Nghe hiểu", "total_exercises": 85 }
  ],
  "weekly_progress": { "percent": 70, "done": 28, "total": 40, "xp": 350 },
  "topics": [
    { "id": 1, "name": "Animals", "image": "https://...", "done": 18, "total": 25 }
  ],
  "suggested": [
    { "id": 201, "type": "vocabulary_choice", "title": "Chọn từ phù hợp với hình", "skill": "Từ vựng", "questions": 10, "xp": 15 }
  ]
}
```

---

### 6.2 API Topics by Skill

**Endpoint:** `GET /api/student/practice/topics?skill=vocabulary`

**Response (200):**
```json
{ "data": [ { "id": 1, "name": "Animals", "done": 18, "total": 25 } ] }
```

---

### 6.3 API Weekly Achievement

**Endpoint:** `GET /api/student/practice/weekly-achievement`

**Response (200):**
```json
{ "exercises_done": 28, "exercises_total": 40, "streak_days": 5, "streak_target": 7, "xp": 350, "xp_target": 500, "topics_learned": 6, "topics_total": 10 }
```

---

## 7. State Management

```typescript
practiceStore.setActiveSkill(skillKey)
practiceStore.setTopics(topics)
practiceStore.setSuggested(exercises)
practiceStore.setWeeklyProgress(progress)
practiceStore.setWeeklyAchievement(achievement)
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị đầy đủ tab kỹ năng + chủ đề + gợi ý |
| 2 | Chọn tab kỹ năng khác | Danh sách chủ đề/gợi ý cập nhật theo kỹ năng |
| 3 | Click "Ôn luyện" ở 1 chủ đề | Navigate vào bài tập tiếp theo chưa hoàn thành |
| 4 | Click "Làm bài" ở gợi ý | Navigate đúng loại màn hình bài tập |
| 5 | Tìm kiếm bài tập/chủ đề | Trả về đúng kết quả |
| 6 | Chủ đề đã hoàn thành 100% | Hiển thị badge hoàn thành, vẫn cho ôn lại |
