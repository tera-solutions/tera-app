# [036] - Teacher - Giáo án

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [036] |
| Module | Teacher |
| Screen | Giáo án |
| Sprint | Sprint 2 |
| Label | Sprint2, Teacher, Frontend |
| Trello | https://trello.com/c/aRQeKkHl/73-036-teacher-giáo-án |
| Mockup | https://drive.google.com/file/d/14sje42MUbwR9pB_aJw9Zk6Z70DefDysZ/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Quản lý giáo án (lesson plans) của một lớp học. Hiển thị danh sách các unit/bài học, tiến độ giảng dạy, cho phép tạo mới và chỉnh sửa giáo án.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập; có lớp được phân công
- **Route:** `/lesson-plan` hoặc `/classroom/{id}/lesson-plan`
- **Layout:** BasicLayout

---

## 4. UI Layout

```
┌────────────────────────────────────────────────────────────────┐
│ [Sidebar] │  Giáo án                              [Thêm bài]  │
│           │  Starters 2A  [Ngọc | Starters - Beginner]        │
│           │                                                    │
│           │  [Tất cả ▼]  [Đang giảng ▼]  [Đặp vị ▼]          │
│           │                                                    │
│           │  ┌──────┐ ┌──────┐ ┌───────┐ ┌──────────┐         │
│           │  │  24  │ │  16  │ │   6   │ │  66.7%   │         │
│           │  │ Tổng │ │ Đã  │ │ Đang  │ │  Tổng %  │         │
│           │  │ giáo │ │ giảng│ │ giảng │ │          │         │
│           │  └──────┘ └──────┘ └───────┘ └──────────┘         │
│           │                                                    │
│           ├────────────────────────┬───────────────────────────┤
│           │  Danh sách giáo án     │  Bộ lọc                   │
│           │                        │  Tất cả đơn vị ▼          │
│           │  01 Hello! Getting to  │  Tất cả unit ▼            │
│           │     know you    ★★★★   │                           │
│           │  02 Numbers 1-10 ★★★   │  Tiến độ: 66.7%           │
│           │  03 Colors around us   │  [Donut chart]            │
│           │  04 School things      │                           │
│           │  05 This is my family  │                           │
│           │  06 Food and drinks    │                           │
│           │                        │                           │
└────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 LessonPlanToolbar

**Nội dung:**
- Tên lớp + giáo viên + cấp độ
- Dropdown filter: Tất cả / Đã giảng / Đang giảng / Tới đây
- Dropdown đơn vị (unit group)
- Nút "Thêm bài mới"

---

### 5.2 LessonPlanStats (×4)

| Card | Mô tả |
|------|-------|
| Tổng giáo án | Tổng số unit/bài |
| Đã giảng | Số bài đã dạy xong |
| Đang giảng | Số bài đang trong quá trình |
| Tổng % | % hoàn thành giáo án |

---

### 5.3 LessonPlanTable

**Mỗi row hiển thị:**
- Số thứ tự (01, 02...)
- Ảnh thumbnail bài học
- Tên unit/bài học
- Tags (skill: Vocabulary, Grammar...)
- Star rating (1–5 sao đánh giá độ khó / chất lượng)
- Số tài liệu đính kèm
- Trạng thái: Đã giảng (xanh) | Đang giảng (cam) | Tới đây (xám)
- Actions: Xem | Sửa | Xóa

**Click row** → Navigate `/lesson/{id}`

---

### 5.4 LessonPlanForm (Modal/Drawer)

**Khi tạo/sửa giáo án:**

**Fields:**

| Field | Label | Type | Required |
|-------|-------|------|----------|
| title | Tiêu đề bài học | text | ✓ |
| unit_number | Số unit | number | ✓ |
| objectives | Mục tiêu bài học | textarea | ✓ |
| content | Nội dung | rich text | — |
| duration | Thời lượng (phút) | number | — |
| materials | Tài liệu đính kèm | file upload | — |
| status | Trạng thái | select | ✓ |

---

### 5.5 ProgressSidebar (Panel phải)

**Nội dung:**
- Bộ lọc (đơn vị, unit)
- Donut chart: Tiến độ giảng dạy (66.7%)
- Số liệu: Đã giảng / Chưa giảng

---

### 5.6 UploadMaterial

**Mô tả:** Upload file đính kèm cho giáo án.
- Hỗ trợ: pdf, doc, docx, ppt, pptx, jpg, png
- Max: 10MB/file
- Hiển thị danh sách file đã upload

---

## 6. API Integration

### 6.1 API Lesson Plan List

**Endpoint:** `GET /api/teacher/lesson-plans`

**Query params:**
```
class_id=10
status=all          # all | completed | in_progress | upcoming
unit_group=
page=1
limit=50
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 5,
      "unit_number": 1,
      "title": "Hello! - Getting to know you",
      "thumbnail": "https://...",
      "tags": ["Vocabulary", "Speaking"],
      "rating": 4,
      "status": "completed",
      "material_count": 3,
      "duration": 90
    }
  ],
  "stats": {
    "total": 24,
    "completed": 16,
    "in_progress": 6,
    "completion_rate": 66.7
  }
}
```

---

### 6.2 API Create Lesson Plan

**Endpoint:** `POST /api/teacher/lesson-plans`

**Request body:**
```json
{
  "class_id": 10,
  "unit_number": 7,
  "title": "Unit 07 - Hobbies",
  "objectives": "Students will learn...",
  "content": "<p>...</p>",
  "duration": 90,
  "status": "upcoming"
}
```

**Response (201):**
```json
{
  "id": 25,
  "title": "Unit 07 - Hobbies",
  "status": "upcoming"
}
```

---

### 6.3 API Update Lesson Plan

**Endpoint:** `PUT /api/teacher/lesson-plans/{id}`

---

### 6.4 API Upload File (dùng chung)

**Endpoint:** `POST /api/file/upload`

---

## 7. State Management

```typescript
lessonPlanStore.setList(data)
lessonPlanStore.setStats(stats)
lessonPlanStore.setFilter({ status, unit_group })
lessonPlanStore.setFormOpen(bool)
lessonPlanStore.setEditingItem(item | null)
```

---

## 8. Validation

| Field | Rule | Thông báo |
|-------|------|-----------|
| title | required | "Vui lòng nhập tiêu đề bài học" |
| unit_number | required, number > 0 | "Số unit không hợp lệ" |
| objectives | required | "Vui lòng nhập mục tiêu bài học" |
| status | required | "Vui lòng chọn trạng thái" |

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Danh sách giáo án + stats |
| 2 | Lọc "Đã giảng" | Chỉ hiện bài đã dạy |
| 3 | Click "Thêm bài mới" | Mở form tạo mới |
| 4 | Tạo giáo án thành công | Thêm vào danh sách |
| 5 | Sửa giáo án | Cập nhật thành công |
| 6 | Click tên bài học | Navigate /lesson/{id} |
| 7 | Upload tài liệu vượt 10MB | Lỗi "File quá lớn" |
| 8 | Xóa giáo án | Confirm dialog, xóa khỏi list |
