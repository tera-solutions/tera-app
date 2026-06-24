# [037] - Teacher - Bài học

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [037] |
| Module | Teacher |
| Screen | Bài học |
| Sprint | Sprint 2 |
| Label | Sprint2, Teacher, Frontend |
| Trello | https://trello.com/c/UYlo9DgQ/76-037-teacher-bài-học |
| Mockup | https://drive.google.com/file/d/11ndJq6p14P3-pSOpwTD1p8rO_elJkh4L/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Hiển thị chi tiết một bài học (lesson plan unit): mục tiêu, tài liệu, hoạt động trong bài và tiến độ. Cho phép giáo viên bắt đầu/kết thúc buổi học và ghi chú.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/lesson/{id}`
- **Layout:** BasicLayout
- **Breadcrumb:** Giáo án > Bài học

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Giáo án > Bài học                                    │
│           │                                                      │
│           │ Hello! - Getting to know you                         │
│           │ [breadcrumb context]                                 │
│           │                                                      │
│           │ [Tổng quan][Học viên][Kiểm tra][Điểm][Tài liệu]...  │
│           │                                                      │
│           ├──────────────────────────┬───────────────────────────┤
│           │  ┌───┐ ┌───┐ ┌────┐ ┌──┐│  Thông tin bài học        │
│           │  │ 5 │ │ 4 │ │ 45 │ │80││  Lớp: Starters 2A         │
│           │  │buổi│ │ buổi│ │HV │ │% ││  Cấp: Beginner           │
│           │  └───┘ └───┘ └────┘ └──┘│  Ngày BĐ: ...            │
│           │                          │  Ngày KT: ...            │
│           │  Mục tiêu bài học:       │                           │
│           │  • Học viên biết tự giới │  Tiến độ: 80%            │
│           │  • thiệu bản thân...     │  [Donut chart]           │
│           │                          │                           │
│           │  Tài liệu sử dụng:       │  Ghi chú cá nhân         │
│           │  [file list]             │  [textarea]              │
│           │                          │                           │
│           │  Hoạt động trong bài:    │                           │
│           │  Pronunciation (5 phút)  │                           │
│           │  Vocabulary (10 phút)    │                           │
│           │  Grammar (10 phút)       │                           │
│           │  Speaking (10 phút)      │                           │
│           │                          │                           │
│           │  [Bắt đầu giảng bài →]  │                           │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 LessonHeader

**Hiển thị:**
- Breadcrumb: Giáo án > {tên unit}
- Tiêu đề bài học
- Nút edit (nếu có quyền)

---

### 5.2 LessonStatRow (×4)

| Stat | Mô tả |
|------|-------|
| Số buổi đã dạy | Tổng số session đã diễn ra |
| Số buổi học | Tổng số buổi kế hoạch |
| Học viên | Số HV trong lớp |
| % Hoàn thành | % tiến độ bài học |

---

### 5.3 LessonTabNav

**Tabs:**
- Tổng quan (active mặc định)
- Học viên
- Kiểm tra
- Điểm
- Tài liệu
- Ghi chú

---

### 5.4 Tab: Tổng quan

**Sections:**

**Mục tiêu bài học:**
- Danh sách bullet: Sau bài học, học viên có thể...

**Tài liệu sử dụng:**
- Danh sách file: ảnh thumbnail, tên file, nút download

**Hoạt động trong bài (ActivityTimeline):**

| Hoạt động | Thời lượng |
|-----------|------------|
| Pronunciation | 5 phút |
| Vocabulary | 10 phút |
| Grammar | 10 phút |
| Speaking Practice | 10 phút |

Mỗi activity: icon + tên + thời lượng + nội dung mô tả

**Nút hành động:**
- "Bắt đầu giảng bài" → gọi API Start Lesson → navigate sang lesson session

---

### 5.5 LessonSidebar (Panel phải)

**Sections:**
- **Thông tin bài học:** lớp, cấp độ, ngày bắt đầu/kết thúc
- **Tiến độ:** donut chart % hoàn thành
- **Ghi chú cá nhân:** textarea lưu note riêng của GV

---

### 5.6 LessonNote (Ghi chú cá nhân)

**Hành vi:**
- Auto-save sau 2 giây không gõ (debounce)
- Hiển thị "Đã lưu" khi thành công

---

## 6. Luồng bắt đầu buổi học

```
GV nhấn "Bắt đầu giảng bài"
        ↓
Gọi API Start Lesson Session
        ↓
[Thành công] → Navigate /lesson-session/{session_id}
              (màn hình điểm danh + ghi chú buổi học)
[Thất bại]   → Toast error
```

---

## 7. API Integration

### 7.1 API Lesson Plan Detail

**Endpoint:** `GET /api/teacher/lesson-plans/{id}`

**Response (200):**
```json
{
  "id": 5,
  "unit_number": 1,
  "title": "Hello! - Getting to know you",
  "class_id": 10,
  "class_name": "Starters 2A",
  "level": "Beginner",
  "objectives": [
    "Học viên biết tự giới thiệu bản thân",
    "Học viên biết hỏi thăm người khác"
  ],
  "activities": [
    { "name": "Pronunciation", "duration": 5, "description": "..." },
    { "name": "Vocabulary", "duration": 10, "description": "..." },
    { "name": "Grammar", "duration": 10, "description": "..." },
    { "name": "Speaking Practice", "duration": 10, "description": "..." }
  ],
  "materials": [
    { "id": 1, "name": "Flashcards.pdf", "url": "https://...", "size": "2MB" }
  ],
  "stats": {
    "sessions_done": 5,
    "sessions_total": 4,
    "student_count": 45,
    "completion_rate": 80
  },
  "personal_note": "Nhớ ôn lại từ vựng Unit 1 trước khi vào bài",
  "start_date": "2025-04-01",
  "end_date": "2025-05-30"
}
```

---

### 7.2 API Start Lesson Session

**Endpoint:** `POST /api/teacher/lesson-sessions`

**Request body:**
```json
{
  "lesson_plan_id": 5,
  "class_id": 10,
  "scheduled_at": "2025-05-18T08:00:00Z"
}
```

**Response (201):**
```json
{
  "session_id": 101,
  "status": "in_progress"
}
```

---

### 7.3 API Save Lesson Note

**Endpoint:** `PUT /api/teacher/lesson-plans/{id}/note`

**Request body:**
```json
{ "note": "Nhớ ôn lại từ vựng Unit 1 trước khi vào bài" }
```

**Response (200):**
```json
{ "success": true }
```

---

## 8. State Management

```typescript
lessonDetailStore.setDetail(lesson)
lessonDetailStore.setActiveTab(tab)
lessonDetailStore.setNote(note)
lessonDetailStore.setSessionLoading(bool)
```

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load bài học | Hiển thị đầy đủ thông tin |
| 2 | Nhấn "Bắt đầu giảng bài" | Tạo session, navigate sang lesson session |
| 3 | Ghi chú cá nhân | Auto-save sau 2s, hiện "Đã lưu" |
| 4 | Download tài liệu | Tải file về |
| 5 | Click tab "Học viên" | Hiển thị danh sách HV của lớp |
| 6 | Click tab "Tài liệu" | Hiển thị list file đính kèm |
| 7 | Bài học không tồn tại | Hiển thị 404 |
| 8 | Đã có session đang diễn ra | Nút "Tiếp tục buổi học" thay vì "Bắt đầu" |
