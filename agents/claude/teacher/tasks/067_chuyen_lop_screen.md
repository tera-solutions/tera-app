# [067] - Teacher - Chuyển lớp

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [067] |
| Module | Teacher |
| Screen | Chuyển lớp |
| Sprint | Sprint 3 |
| Label | Sprint3, Teacher, Frontend |
| Trello | https://trello.com/c/Wek6Qchw |
| Mockup | https://drive.google.com/file/d/19gEDq9jsLz5R33XJCBkvQ69o8rfHYfb9/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Cho phép giáo viên/admin chuyển học viên từ lớp hiện tại sang lớp mới. Quy trình 3 bước: chọn lớp nguồn → chọn học viên → chọn lớp đích và xác nhận.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/transfer`
- **Layout:** BasicLayout
- **Breadcrumb:** Học viên > Chuyển lớp

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Chuyển lớp                                           │
│           │ Quản lý & chuyển học viên sang lớp học mới           │
│           │                                                      │
│           │ ┌──────────────────────────────────────────────────┐ │
│           │ │ [①Chọn lớp học]──[②Chọn lớp mới]──[③Học viên] │ │
│           │ │   Chọn lớp học  →  Chọn lớp mới  →  Học viên   │ │
│           │ └──────────────────────────────────────────────────┘ │
│           │                                                      │
│           ├────────────────────────┬─────────────────────────────┤
│           │  Bước 1: Chọn học viên  │  Lý do chuyển lớp          │
│           │  (từ lớp hiện tại)      │  ─────────────────────────  │
│           │                         │  [Textarea: Lý do...]      │
│           │  [🔍 Tìm học viên]       │                            │
│           │  [Tất cả lớp ▼]         │  Thống kê chuyển lớp:      │
│           │                         │  Tổng chuyển: 12           │
│           │  ┌───────────────────┐  │  Tháng này: 5              │
│           │  │☐│Tên│Lớp│Ngày│T.gian│  │  Lớp 3C: 3              │
│           │  ├───────────────────┤  │                            │
│           │  │☑│Minh│2A │...│...  │  │                            │
│           │  │☐│Lan │2A │...│...  │  │                            │
│           │  │☐│Tuấn│1B │...│...  │  │                            │
│           │  └───────────────────┘  │                            │
│           │                         │                            │
│           ├────────────────────────┤                            │
│           │  Bước 2: Chọn lớp mới   │                            │
│           │                         │                            │
│           │  ┌───────────────────┐  │                            │
│           │  │Tên lớp│Lịch│Phòng │  │                            │
│           │  ├───────────────────┤  │                            │
│           │  │Starters 3C│T3,5│P01│  │                            │
│           │  │Movers 2A │T2,4│P02│  │                            │
│           │  └───────────────────┘  │                            │
│           │                         │                            │
│           │     [Bước tới →]        │                            │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Luồng 3 bước

```
Bước 1: Chọn lớp học (nguồn) + Chọn học viên
    ↓
Bước 2: Chọn lớp mới (đích)
    ↓
Bước 3: Xác nhận chuyển lớp
```

---

## 6. Components

### 6.1 StepIndicator

3 bước hiển thị dạng stepper ngang:
- Bước 1: Chọn lớp học
- Bước 2: Chọn lớp mới
- Bước 3: Học viên (xác nhận)

---

### 6.2 Step 1: Chọn học viên (Panel trái - Bảng 1)

**Toolbar:**
- Search input "Tìm học viên..."
- Dropdown "Tất cả lớp" (lọc lớp nguồn)

**Bảng học viên:**

| Cột | Mô tả |
|-----|-------|
| Checkbox | Chọn học viên |
| Tên | Avatar + tên |
| Lớp hiện tại | Tên lớp đang học |
| Ngày đăng ký | Ngày ghi danh |
| Thời gian học | Tổng số buổi đã học |

**Multi-select:** Có thể chọn nhiều học viên cùng lúc

---

### 6.3 Step 2: Chọn lớp mới (Panel trái - Bảng 2)

**Bảng lớp đích:**

| Cột | Mô tả |
|-----|-------|
| Radio | Chọn lớp |
| Tên lớp | Tên lớp mới |
| Lịch học | Ngày + giờ |
| Phòng | Phòng học |
| Sỹ số | X/Y (chỗ trống) |
| Trạng thái | Còn chỗ / Đầy |

---

### 6.4 Step 3: Xác nhận

**Tóm tắt:**
- Danh sách học viên được chuyển
- Lớp nguồn → Lớp đích
- Lý do chuyển lớp
- Ngày có hiệu lực

**Nút:** `Xác nhận chuyển lớp`

---

### 6.5 TransferReasonPanel (Panel phải - trên)

- Textarea nhập lý do chuyển lớp
- Dropdown chọn lý do có sẵn (Thay đổi lịch / Yêu cầu PH / Phù hợp năng lực / Khác)

---

### 6.6 TransferStatPanel (Panel phải - dưới)

**Thống kê chuyển lớp:**
- Tổng số lần chuyển lớp: 12
- Tháng này: 5
- Phân bổ theo lớp đích (top 3)

---

## 7. API Integration

### 7.1 API Students for Transfer

**Endpoint:** `GET /api/teacher/students`

**Headers:**
```
Authorization: Bearer {access_token}
Device-code: {device_code}
Accept: application/json
```

**Query params:**
```
class_id=      # lớp nguồn
search=
page=1
limit=20
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Nguyễn Minh An",
      "avatar": "https://...",
      "current_class": "Starters 2A",
      "current_class_id": 10,
      "enrolled_at": "2025-01-15",
      "total_sessions": 24
    }
  ]
}
```

---

### 7.2 API Available Classes (đích)

**Endpoint:** `GET /api/teacher/classrooms?status=active&exclude_class_id={current_class_id}`

**Response (200):**
```json
{
  "data": [
    {
      "id": 15,
      "name": "Starters 3C",
      "schedule": "T3, T5 - 08:00",
      "room": "Phòng 01",
      "student_count": 10,
      "max_students": 25,
      "available": true
    }
  ]
}
```

---

### 7.3 API Transfer Students

**Endpoint:** `POST /api/teacher/transfer`

**Request body:**
```json
{
  "student_ids": [1, 2],
  "from_class_id": 10,
  "to_class_id": 15,
  "reason": "Thay đổi lịch học",
  "effective_date": "2025-06-01"
}
```

**Response (201):**
```json
{
  "success": true,
  "transferred_count": 2,
  "to_class": "Starters 3C",
  "effective_date": "2025-06-01"
}
```

---

### 7.4 API Transfer Statistics

**Endpoint:** `GET /api/teacher/transfer/stats`

**Response (200):**
```json
{
  "total_transfers": 12,
  "this_month": 5,
  "by_class": [
    { "class_name": "Starters 3C", "count": 3 }
  ]
}
```

---

## 8. State Management

```typescript
transferStore.setCurrentStep(1 | 2 | 3)
transferStore.setStudentList(students)
transferStore.setSelectedStudents(ids)
transferStore.setSourceClass(classroom)
transferStore.setTargetClass(classroom)
transferStore.setReason(reason)
transferStore.setStats(stats)
transferStore.setSubmitting(bool)
```

---

## 9. Validation

| Field | Rule | Thông báo |
|-------|------|-----------|
| students | min 1 chọn | "Vui lòng chọn ít nhất 1 học viên" |
| target_class | required | "Vui lòng chọn lớp mới" |
| target_class | khác lớp nguồn | "Lớp mới phải khác lớp hiện tại" |
| target_class | còn chỗ | "Lớp đã đầy, không thể chuyển" |
| reason | required | "Vui lòng nhập lý do chuyển lớp" |

---

## 10. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load bước 1 | Hiển thị danh sách học viên |
| 2 | Chọn học viên + Next | Chuyển sang bước 2 |
| 3 | Chọn lớp đầy | Disabled, không cho chọn |
| 4 | Chọn lớp nguồn = đích | Validation error |
| 5 | Xác nhận chuyển | API submit, toast thành công |
| 6 | Quay lại bước | Giữ nguyên selection |
| 7 | Lọc theo lớp | Chỉ hiện HV thuộc lớp đó |
| 8 | Thống kê chuyển lớp | Hiển thị đúng số liệu |
