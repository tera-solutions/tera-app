# [042] - Teacher - Bài tập

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [042] |
| Module | Teacher |
| Screen | Bài tập |
| Sprint | Sprint 3 |
| Label | Sprint3, Teacher, Frontend |
| Trello | https://trello.com/c/gBYg9VEm |
| Mockup | https://drive.google.com/file/d/1PSxbSb38xlfkhIzBufAV8YKNFEfPwwIW/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Quản lý danh sách bài tập của giáo viên. Hiển thị thống kê tổng quan, cho phép tạo mới, lọc và theo dõi tình trạng nộp bài.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/homework`
- **Layout:** BasicLayout
- **Breadcrumb:** Bài tập

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Bài tập                         [+ Tạo bài tập]      │
│           │                                                      │
│           │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────────────────┐ │
│           │ │  20  │ │   8  │ │   3  │ │     156 / 240        │ │
│           │ │ Tổng │ │ Đã   │ │ Chưa │ │      Nộp bài         │ │
│           │ │      │ │ giao │ │ giao │ │                      │ │
│           │ └──────┘ └──────┘ └──────┘ └──────────────────────┘ │
│           │                                                      │
│           ├─────────────────────────────┬────────────────────────┤
│           │  Danh sách bài tập           │  Bộ lọc               │
│           │                             │  Lớp: [Tất cả ▼]      │
│           │  ┌──────────────────────────┤  Hạng thứ: [Tất cả ▼] │
│           │  │Tên BT │Lớp│Hạn│HV│Nộp  ││                       │
│           │  ├────────────────────────── │  Thống kê hoàn thành  │
│           │  │Write. │2A │5/20│24│18   ││  [Donut chart]        │
│           │  │missing│   │   │  │     ││                       │
│           │  │letters│   │   │  │     ││  Hoàn thành: 75%      │
│           │  ├────────────────────────── │  Chưa nộp: 25%       │
│           │  │Listen │1B │5/22│20│15   ││                       │
│           │  │& choos│   │   │  │     ││                       │
│           │  ├────────────────────────── │                       │
│           │  │Fill in│2A │5/25│24│20   ││                       │
│           │  │blanks │   │   │  │     ││                       │
│           │  └──────────────────────────┘                       │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 HomeworkStatRow (×4)

| Card | Mô tả |
|------|-------|
| Tổng bài tập | Tổng số bài tập đã tạo |
| Đã giao | Số bài đã publish/giao cho HV |
| Chưa giao | Số bài ở trạng thái draft |
| Nộp bài | X/Y học viên đã nộp (tổng cộng) |

---

### 5.2 HomeworkTable (Panel trái)

**Columns:**
- Tên bài tập
- Lớp
- Hạng thứ (Starters / Movers / Flyers)
- Thời gian (deadline)
- Số HV
- Số đã nộp
- Thao tác: Chấm bài | Xem | Sửa | Xóa

**Sample data:**
- Write the missing letters — Starters 2A
- Listen and choose — Movers 1B
- Fill in the blanks — Flyers 2A

---

### 5.3 HomeworkFilterSidebar (Panel phải)

**Filters:**
- Dropdown Lớp (Tất cả / Starters 2A / Movers 1B / Flyers 2A)
- Dropdown Hạng thứ (Tất cả / Starters / Movers / Flyers)

**Thống kê hoàn thành:**
- Donut chart: % đã nộp vs chưa nộp

---

### 5.4 HomeworkForm (Modal/Drawer)

**Tạo/sửa bài tập:**

| Field | Label | Type | Required |
|-------|-------|------|----------|
| title | Tên bài tập | text | ✓ |
| class_ids | Lớp áp dụng | multi-select | ✓ |
| description | Mô tả/yêu cầu | rich text | ✓ |
| due_date | Hạn nộp | datetime | ✓ |
| level | Hạng thứ | select | — |
| attachments | Tài liệu đính kèm | file upload | — |
| max_score | Điểm tối đa | number | — |

---

## 6. API Integration

### 6.1 API Homework List

**Endpoint:** `GET /api/teacher/homeworks`

**Headers:**
```
Authorization: Bearer {access_token}
Device-code: {device_code}
Accept: application/json
```

**Query params:**
```
class_id=
level=
page=1
limit=20
```

**Response (200):**
```json
{
  "summary": {
    "total": 20,
    "assigned": 8,
    "draft": 3,
    "total_submitted": 156,
    "total_expected": 240
  },
  "data": [
    {
      "id": 1,
      "title": "Write the missing letters",
      "class_name": "Starters 2A",
      "class_id": 10,
      "level": "Starters",
      "due_date": "2025-05-20",
      "student_count": 24,
      "submitted_count": 18,
      "status": "assigned"
    }
  ],
  "meta": { "total": 20, "per_page": 20, "current_page": 1 }
}
```

---

### 6.2 API Create Homework

**Endpoint:** `POST /api/teacher/homeworks`

**Request body:**
```json
{
  "title": "Write the missing letters",
  "class_ids": [10],
  "description": "<p>Hoàn thành các từ còn thiếu...</p>",
  "due_date": "2025-05-20T23:59:00Z",
  "level": "Starters",
  "max_score": 10
}
```

**Response (201):**
```json
{
  "id": 21,
  "title": "Write the missing letters",
  "status": "draft"
}
```

---

### 6.3 API Update Homework

**Endpoint:** `PUT /api/teacher/homeworks/{id}`

---

### 6.4 API Delete Homework

**Endpoint:** `DELETE /api/teacher/homeworks/{id}`

**Response (200):**
```json
{ "success": true }
```

---

## 7. State Management

```typescript
homeworkStore.setSummary(summary)
homeworkStore.setList(data)
homeworkStore.setFilter({ class_id, level })
homeworkStore.setFormOpen(bool)
homeworkStore.setEditingItem(item | null)
```

---

## 8. Validation

| Field | Rule | Thông báo |
|-------|------|-----------|
| title | required | "Vui lòng nhập tên bài tập" |
| class_ids | required, min 1 | "Vui lòng chọn ít nhất một lớp" |
| description | required | "Vui lòng nhập mô tả bài tập" |
| due_date | required, future date | "Hạn nộp phải là ngày trong tương lai" |

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Danh sách bài tập + summary stats |
| 2 | Click "+ Tạo bài tập" | Mở form modal |
| 3 | Tạo bài tập hợp lệ | Thêm vào danh sách |
| 4 | Lọc theo lớp | Chỉ hiện bài tập của lớp đó |
| 5 | Click "Chấm bài" | Navigate sang màn hình chấm bài |
| 6 | Xóa bài tập | Confirm dialog, xóa khỏi list |
| 7 | Donut chart | Hiển thị % nộp bài đúng |
| 8 | Bài tập quá hạn | Highlight màu đỏ deadline |
