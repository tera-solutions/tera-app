# [039] - Teacher - Học viên

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [039] |
| Module | Teacher |
| Screen | Học viên |
| Sprint | Sprint 2 |
| Label | Sprint2, Teacher, Frontend |
| Trello | https://trello.com/c/lH9fAckT/77-039-teacher-học-viên |
| Mockup | https://drive.google.com/file/d/12dHrtPkN3mGtIL_1j8iDgAaNj6yX90Ex/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Hiển thị danh sách học viên thuộc các lớp giáo viên phụ trách. Hỗ trợ tìm kiếm, lọc đa tiêu chí, xem thông tin học tập cơ bản và điều hướng đến hồ sơ chi tiết.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/students`
- **Layout:** BasicLayout

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │  Học viên                       [Thêm học viên]     │
│           │  Quản lý thông tin học tập của học viên              │
│           │                                                      │
│           ├──────────────────────────────┬───────────────────────┤
│           │  ┌────┐ ┌────┐ ┌────┐ ┌────┐│  Lớp học ▼           │
│           │  │ 72 │ │ 68 │ │  3 │ │  3 ││                       │
│           │  │Tổng│ │Đang│ │Đã  │ │Mới ││  Cấp độ              │
│           │  │    │ │học │ │nghỉ│ │    ││  □ Starters           │
│           │  └────┘ └────┘ └────┘ └────┘│  □ Movers            │
│           │                              │  □ Flyers            │
│           │  [Tìm kiếm...]               │  □ KET               │
│           │                              │                       │
│           │  Bảng danh sách học viên     │  Trạng thái ▼        │
│           │  ┌────────────────────────┐  │                       │
│           │  │STT│Ảnh│Họ tên│Lớp│...│  │  Ngày nhập học        │
│           │  ├────────────────────────┤  │  Từ: [date]          │
│           │  │ 1 │[a]│Nguyễn│2A │...│  │  Đến: [date]         │
│           │  │ 2 │[a]│Trần  │2A │...│  │                       │
│           │  │ 3 │[a]│Lê    │1B │...│  │  [Lọc lại]           │
│           │  └────────────────────────┘  │                       │
│           │  [1][2][3]...[8]  72 học viên│                       │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 StudentToolbar

**Nội dung:**
- Search input: "Tìm kiếm học viên..."
- Nút "Thêm học viên" (nếu có quyền)

---

### 5.2 StatisticRow (×4)

| Card | Mô tả |
|------|-------|
| Tổng học viên | Tổng số HV thuộc lớp GV phụ trách |
| Đang học | Số HV status = active |
| Đã nghỉ | Số HV status = dropped |
| Mới | Số HV enrolled trong 30 ngày gần nhất |

---

### 5.3 StudentTable

**Columns:**

| Cột | Nội dung |
|-----|---------|
| STT | Số thứ tự |
| Ảnh | Avatar tròn |
| Họ và tên | Link → `/students/{id}` |
| Ngày sinh | DD/MM/YYYY |
| Lớp học | Tên lớp + badge cấp độ |
| Điện thoại | SĐT học viên / phụ huynh |
| Điểm TB | Điểm trung bình |
| Thao tác | Xem hồ sơ \| Nhận xét \| Nhắn tin |

**Features:**
- Sắp xếp theo: Tên / Ngày nhập học / Điểm TB
- Highlight hàng khi hover

---

### 5.4 StudentFilter (Sidebar phải)

**Filters:**
- **Lớp học:** dropdown chọn lớp
- **Cấp độ:** checkboxes (Starters / Movers / Flyers / KET / PET)
- **Trạng thái:** dropdown (Tất cả / Đang học / Bảo lưu / Đã nghỉ)
- **Ngày nhập học:** date range (Từ — Đến)
- Nút "Lọc lại" — apply filter
- Nút "Xóa bộ lọc" — reset

---

### 5.5 Pagination

- Hiển thị: "Hiển thị 1-20 / 72 học viên"
- Nút Previous / Next + số trang
- Dropdown chọn số item/trang: 20 / 50 / 100

---

## 6. API Integration

### 6.1 API Student List

**Endpoint:** `GET /api/teacher/students`

**Query params:**
```
search=Nguyễn
class_id=10
level=starters,movers      # comma-separated
status=active              # active | suspended | dropped
date_from=2025-01-01
date_to=2025-05-31
sort_by=name               # name | enrollment_date | avg_score
sort_dir=asc
page=1
limit=20
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Nguyễn Thị Phương",
      "dob": "2012-05-10",
      "avatar": "https://...",
      "class_name": "Starters 2A",
      "class_id": 10,
      "level": "Beginner",
      "phone": "0901234567",
      "avg_score": 8.5,
      "status": "active",
      "enrolled_at": "2025-01-15"
    }
  ],
  "summary": {
    "total": 72,
    "active": 68,
    "dropped": 3,
    "new_this_month": 3
  },
  "meta": {
    "total": 72,
    "per_page": 20,
    "current_page": 1,
    "last_page": 4
  }
}
```

---

### 6.2 API Student Detail (preview)

**Endpoint:** `GET /api/teacher/students/{id}`

Dùng cho tooltip/hover preview hoặc điều hướng sang màn hình chi tiết học viên ([040]).

---

## 7. State Management

```typescript
studentListStore.setStudents(data)
studentListStore.setSummary(summary)
studentListStore.setFilters({
  search,
  class_id,
  level,
  status,
  date_from,
  date_to,
  sort_by,
  sort_dir
})
studentListStore.setPage(page)
studentListStore.resetFilters()
```

---

## 8. URL Sync

Filter được đồng bộ với URL query string:

```
/students?class_id=10&level=starters&status=active&page=1
```

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Danh sách 20 HV đầu + stats |
| 2 | Tìm kiếm tên | Filter realtime, reset page về 1 |
| 3 | Lọc theo cấp độ | Chỉ hiện HV thuộc cấp đó |
| 4 | Lọc theo trạng thái | Chỉ hiện HV đúng trạng thái |
| 5 | Lọc theo ngày nhập học | Filter theo khoảng ngày |
| 6 | Click tên HV | Navigate /students/{id} |
| 7 | Click "Nhận xét" | Mở form nhận xét HV |
| 8 | Click "Nhắn tin" | Mở cửa sổ tin nhắn |
| 9 | Phân trang | Load trang tiếp theo |
| 10 | Sắp xếp cột | Sắp xếp ASC/DESC |
| 11 | Xóa bộ lọc | Reset về danh sách đầy đủ |
| 12 | Không có HV | Hiển thị EmptyState |
