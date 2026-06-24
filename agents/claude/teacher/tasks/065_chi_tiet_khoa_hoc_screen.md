# [065] - Teacher - Chi tiết khóa học

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [065] |
| Module | Teacher |
| Screen | Chi tiết khóa học |
| Sprint | Sprint 3 |
| Label | Sprint3, Teacher, Frontend |
| Trello | https://trello.com/c/NmCgTRsp |
| Mockup | https://drive.google.com/file/d/13btDtVWfhj-gSTNFd_PR-XtZWYiFLXwl/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Hiển thị chi tiết một khóa học: thông tin khóa học, chương trình học tập, danh sách bài học với tiến độ, thống kê học viên và hoạt động gần đây.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/course/{id}`
- **Layout:** BasicLayout
- **Breadcrumb:** Khóa học > Chi tiết khóa học

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Khóa học > Chi tiết khóa học   [Chia sẻ] [Sửa]      │
│           │                                                      │
│           ├──────────────────────────────┬───────────────────────┤
│           │  [Ảnh bìa ENGLISH FOR        │  Tiến trình học tập   │
│           │   BEGINNERS]                 │  ─────────────────── │
│           │  Tiếng Anh A2 - Cơ bản       │  [Progress bar] 95%  │
│           │  ISBN: ...                   │                       │
│           │  Cấp độ: A2                  │  ┌──────┐┌──────┐    │
│           │  Học viên: 48               │  │  48  ││  42  │    │
│           │  Đã hoàn thành: 95%          │  │  HV  ││ Đã   │    │
│           │                              │  │      ││hoàn  │    │
│           │  [Bắt đầu học] [Xem giáo án] │  └──────┘└──────┘    │
│           │                              │  ┌──────┐┌──────┐    │
│           │  Chương trình học tập        │  │8,470 ││  95% │    │
│           │  ─────────────────────────── │  │ Giờ  ││  Tỷ  │    │
│           │  Module 1: Foundations       │  │      ││ lệ   │    │
│           │  ├ Bài 1.1 Vocabulary ████ 90%│  └──────┘└──────┘    │
│           │  ├ Bài 1.2 Grammar    ████ 85%│                       │
│           │  ├ Bài 1.3 Speaking   ███  70%│  Hoạt động gần đây   │
│           │                              │  ─────────────────── │
│           │  Module 2: Intermediate      │  ✓ Hoàn thành Bài 1.1 │
│           │  ├ Bài 2.1 Reading    ██   50%│  ✓ Bắt đầu Bài 1.2   │
│           │  └ Bài 2.2 Writing    ░    10%│  ✓ Ghi danh HV mới   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 CourseInfoCard (Panel trái - trên)

**Hiển thị:**
- Ảnh bìa khóa học (ENGLISH FOR BEGINNERS)
- Tên khóa học (Tiếng Anh A2 - Cơ bản)
- Mã ISBN / mã khóa học
- Cấp độ (A2)
- Số học viên đang theo học
- Tỷ lệ hoàn thành tổng thể

**Nút hành động:**
- `Bắt đầu học` → Navigate sang buổi học tiếp theo
- `Xem giáo án` → Navigate sang lesson plan của khóa

---

### 5.2 CourseStatRow (×4, Panel phải - trên)

| Card | Giá trị |
|------|---------|
| Học viên | 48 (tổng HV đăng ký) |
| Đã hoàn thành | 42 (HV đã hoàn thành khóa) |
| Tổng giờ học | 8,470 giờ |
| Tỷ lệ | 95% (tỷ lệ hoàn thành) |

---

### 5.3 LessonPlanTree (Panel trái - dưới)

**Cây chương trình học:**
- Nhóm theo Module/Chapter
- Mỗi bài học: tên + progress bar + % hoàn thành
- Màu progress bar theo mức độ:
  - ≥ 80%: xanh lá
  - 50–79%: cam
  - < 50%: xám/đỏ

**Click bài học** → Navigate `/lesson/{id}`

---

### 5.4 ProgressBar (Panel phải - trên)

- Progress bar tổng thể khóa học
- Label: "XX% hoàn thành"

---

### 5.5 ActivityTimeline (Panel phải - dưới)

Timeline hoạt động gần đây:
- Icon + mô tả hoạt động
- Thời gian tương đối (2 giờ trước / hôm qua)

---

## 6. API Integration

### 6.1 API Course Detail

**Endpoint:** `GET /api/teacher/courses/{id}`

**Headers:**
```
Authorization: Bearer {access_token}
Device-code: {device_code}
Accept: application/json
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Tiếng Anh A2 - Cơ bản",
  "cover_image": "https://...",
  "isbn": "978-0-XX-XXXXXX-X",
  "level": "A2",
  "total_students": 48,
  "overall_completion": 95,
  "stats": {
    "students": 48,
    "completed_students": 42,
    "total_hours": 8470,
    "completion_rate": 95
  }
}
```

---

### 6.2 API Course Curriculum

**Endpoint:** `GET /api/teacher/courses/{id}/curriculum`

**Response (200):**
```json
{
  "modules": [
    {
      "id": 1,
      "title": "Module 1: Foundations",
      "lessons": [
        {
          "id": 101,
          "title": "Bài 1.1 Vocabulary",
          "completion_rate": 90,
          "status": "completed"
        },
        {
          "id": 102,
          "title": "Bài 1.2 Grammar",
          "completion_rate": 85,
          "status": "in_progress"
        }
      ]
    }
  ]
}
```

---

### 6.3 API Course Activities

**Endpoint:** `GET /api/teacher/courses/{id}/activities`

**Response (200):**
```json
{
  "activities": [
    {
      "action": "lesson_completed",
      "description": "Hoàn thành Bài 1.1",
      "created_at": "2025-05-18T09:00:00Z"
    }
  ]
}
```

---

## 7. State Management

```typescript
courseDetailStore.setCourse(course)
courseDetailStore.setCurriculum(modules)
courseDetailStore.setActivities(activities)
courseDetailStore.setExpandedModule(moduleId)
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị info + curriculum |
| 2 | Progress bars | Render đúng % mỗi bài học |
| 3 | Click bài học | Navigate /lesson/{id} |
| 4 | Click "Bắt đầu học" | Navigate buổi học tiếp theo |
| 5 | Expand/collapse module | Toggle danh sách bài trong module |
| 6 | Activity timeline | Hiển thị đúng thứ tự |
| 7 | Stats cards | Số liệu khớp với dữ liệu khóa học |
| 8 | Khóa học không tồn tại | Hiển thị 404 |
