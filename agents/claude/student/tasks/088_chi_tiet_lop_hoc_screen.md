# [088] - Student - Chi tiết lớp học

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [088] |
| Module | Student |
| Screen | Chi tiết lớp học |
| Sprint | Sprint 5 |
| Label | Sprint5, Student, Frontend, API |
| Mockup Desktop | screen/desktop/chi tiet lop hoc.png |
| Mockup Mobile | screen/mobile/chi tiet lop hoc.png |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Hiển thị chi tiết một lớp học/khóa học: danh sách bài học theo trạng thái khóa/mở, kết quả đánh giá kỹ năng, bảng xếp hạng lớp, bài học hiện tại và bài tập về nhà.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/class/{id}`
- **Layout:** StudentLayout
- **Breadcrumb:** Lớp học > {Tên lớp}

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ ← [Ảnh] Animals Adventure          [★ Yêu thích]     │
│           │   Cô Hana · Giáo viên AI    [XP][Streak][#Hạng][Bài] │
│           │   Lesson 5/20 ████░░░░ 25%                           │
│           ├──────────────────────────────┬───────────────────────┤
│           │ [Nhân vật AI + thoại chào]    │ Bài học hiện tại      │
│           │       [Tiếp tục học]          │ Bài 5: Farm Animals   │
│           ├───────────────┬──────────────┤ [Tiếp tục]             │
│           │ Danh sách bài │ Kết quả       │ Bài tập về nhà         │
│           │ 1 Alphabet ✓  │ đánh giá      │ Worksheet: Farm Animals│
│           │ 2 Colors ✓    │ Quiz Nói Nghe │ [Đã nộp] [Làm bài tập] │
│           │ 3 Numbers ✓   │ Đọc (4 vòng %)│ Danh sách bài học      │
│           │ 4 My Family ✓ │ [Xem chi tiết]│ [Donut 25%]            │
│           │ 5 Farm ▶      │ Bảng xếp hạng │ Hoạt động gần đây      │
│           │ 6 Wild 🔒     │ Top 5 HV + XP │ [Timeline log]         │
│           │ 7 Fruits 🔒   │ [Xem tất cả]  │                        │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 ClassHeader

- Ảnh bìa, tên lớp, giáo viên (badge "Giáo viên AI" nếu là GV ảo)
- 4 chỉ số nhanh: Tổng XP, Ngày streak, Xếp hạng, Số bài đã học
- Progress bar tổng: Lesson x/20
- Nút `Yêu thích` (bookmark lớp)

### 5.2 AiCharacterBanner

- Nhân vật AI chào theo bài học hiện tại + nút `Tiếp tục học` → Navigate `/lesson/{id}`

### 5.3 LessonListPanel (Panel trái dưới)

- Danh sách bài học dạng stepper dọc: số thứ tự, tên bài, icon trạng thái (✓ hoàn thành / ▶ đang học / 🔒 khóa)
- Click bài đã mở khóa → Navigate `/lesson/{id}`; bài khóa không click được

### 5.4 SkillResultPanel

- 4 chỉ số tròn %: Quiz, Nói, Nghe, Đọc
- Nút `Xem chi tiết` → mở báo cáo đánh giá kỹ năng chi tiết

### 5.5 LeaderboardPanel

- Top 5 học viên trong lớp: thứ hạng (huy chương 1-3), avatar, tên, XP
- Highlight dòng của học viên hiện tại
- Nút `Xem tất cả` → Navigate `/class/{id}/leaderboard`

### 5.6 CurrentLessonCard (Panel phải trên)

- Ảnh, tên bài học hiện tại, thời lượng, trạng thái, nút `Tiếp tục`

### 5.7 HomeworkCard

- Tên worksheet, hạn nộp, trạng thái (Đã nộp / Chưa nộp), nút `Làm bài tập`

### 5.8 LessonProgressDonut

- Donut % số bài đã học / tổng số bài, thông điệp động viên

### 5.9 RecentActivityTimeline

- Log hoạt động gần đây: hoàn thành bài, làm bài tập, đạt streak — kèm XP nhận được

---

## 6. API Integration

### 6.1 API Class Detail

**Endpoint:** `GET /api/student/classes/{id}`

**Response (200):**
```json
{
  "id": 1,
  "name": "Animals Adventure",
  "cover_image": "https://...",
  "teacher": { "name": "Cô Hana", "is_ai": true },
  "lesson_progress": "5/20",
  "completion_percent": 25,
  "stats": { "xp": 1250, "streak": 12, "rank": 8, "lessons_done": 5 },
  "current_lesson": { "id": 5, "title": "Farm Animals", "duration_minutes": 15, "status": "in_progress" },
  "homework": { "id": 30, "title": "Worksheet: Farm Animals", "due_date": "2026-05-25", "status": "submitted" }
}
```

---

### 6.2 API Lesson List

**Endpoint:** `GET /api/student/classes/{id}/lessons`

**Response (200):**
```json
{
  "data": [
    { "id": 1, "order": 1, "title": "Alphabet", "status": "completed" },
    { "id": 5, "order": 5, "title": "Farm Animals", "status": "in_progress" },
    { "id": 6, "order": 6, "title": "Wild Animals", "status": "locked" }
  ]
}
```

---

### 6.3 API Skill Result

**Endpoint:** `GET /api/student/classes/{id}/skill-result`

**Response (200):**
```json
{ "quiz": 90, "speaking": 88, "listening": 92, "reading": 85 }
```

---

### 6.4 API Leaderboard

**Endpoint:** `GET /api/student/classes/{id}/leaderboard?limit=5`

**Response (200):**
```json
{ "data": [ { "rank": 1, "name": "Emma", "xp": 1850 }, { "rank": 2, "name": "Minh", "xp": 1720, "is_me": true } ] }
```

---

### 6.5 API Recent Activities

**Endpoint:** `GET /api/student/classes/{id}/activities`

**Response (200):**
```json
{ "data": [ { "action": "lesson_completed", "description": "Hoàn thành bài 4: My Family", "xp": 50, "created_at": "2026-05-19T16:30:00Z" } ] }
```

---

## 7. State Management

```typescript
classDetailStore.setClass(classData)
classDetailStore.setLessons(lessons)
classDetailStore.setSkillResult(result)
classDetailStore.setLeaderboard(list)
classDetailStore.setActivities(activities)
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị đầy đủ header, danh sách bài, panel phải |
| 2 | Click bài học đã mở khóa | Navigate `/lesson/{id}` |
| 3 | Click bài học đang khóa | Không cho vào, hiện tooltip "Hoàn thành bài trước" |
| 4 | Click "Tiếp tục học" | Navigate đúng bài học hiện tại |
| 5 | Xem bảng xếp hạng | Highlight đúng dòng học viên hiện tại |
| 6 | Click "Làm bài tập" | Navigate sang màn hình bài tập về nhà |
| 7 | Đánh dấu yêu thích | Icon chuyển trạng thái, lưu API |
