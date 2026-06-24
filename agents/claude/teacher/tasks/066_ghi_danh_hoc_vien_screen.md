# [066] - Teacher - Ghi danh học viên

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [066] |
| Module | Teacher |
| Screen | Ghi danh học viên |
| Sprint | Sprint 3 |
| Label | Sprint3, Teacher, Frontend |
| Trello | https://trello.com/c/vhbqfUZs |
| Mockup | https://drive.google.com/file/d/13DQWN4VlRwsA6RpbU7cXtO6abNnCd4pS/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Quy trình ghi danh học viên vào lớp học gồm nhiều bước: chọn lớp, chọn gói học phí, nhập thông tin học viên và xác nhận. Hiển thị tóm tắt và tổng chi phí.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/enrollment/new`
- **Layout:** BasicLayout
- **Breadcrumb:** Học viên > Ghi danh học viên

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Ghi danh học viên                                    │
│           │ Đăng ký học viên vào lớp học và chọn gói dịch vụ     │
│           │                                                      │
│           │ [Bước 1: Chọn lớp]─[Bước 2: Học phí]─[Bước 3: HV]─[Bước 4: XN]│
│           │                                                      │
│           ├────────────────────────────────┬─────────────────────┤
│           │  Nội dung bước hiện tại         │  Tóm tắt           │
│           │                                │  ─────────────────  │
│           │  1. Chọn lớp học:              │  Lớp: Starters 2A  │
│           │  [Radio] Starters 2A  [Chọn]   │  Học phí: 94đ/dịch │
│           │  [Radio] Movers 1B   [Chọn]    │  Số HV: 5          │
│           │  [Radio] Flyers 2A   [Chọn]    │                     │
│           │                                │  Thống kê HV        │
│           │  2. Chọn gói học phí:          │  ─────────────────  │
│           │  ┌────────────────────────┐    │  Đã đăng ký: 12     │
│           │  │ Gói 1: 94đ/dịch vụ    ○│    │  Chỗ trống: 13      │
│           │  │ Gói 2: 2.4tr/tháng    ○│    │                     │
│           │  │ Gói 3: 3tr/kỳ         ○│    │                     │
│           │  │ Gói 4: Tùy chỉnh      ○│    │                     │
│           │  └────────────────────────┘    │                     │
│           │                                │  Tổng thanh toán:   │
│           │  Danh sách học viên:           │  2,400,000đ         │
│           │  ┌──────────────────────────┐  │                     │
│           │  │Tên│Ngày sinh│Lớp│Email  │  │                     │
│           │  └──────────────────────────┘  │                     │
│           │                                │                     │
│           │  [← Quay lại]   [Tiếp theo →]  │                     │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Luồng đa bước

```
Bước 1: Chọn lớp học
    ↓
Bước 2: Chọn gói học phí
    ↓
Bước 3: Thông tin học viên
    ↓
Bước 4: Xác nhận & Thanh toán
```

---

## 6. Components

### 6.1 StepIndicator

4 bước hiển thị dạng stepper ngang:
- Bước đang active: highlight màu chính
- Bước đã hoàn thành: dấu ✓
- Bước chưa đến: màu xám

---

### 6.2 Step 1: Chọn lớp học

**Hiển thị:**
- Danh sách lớp học hiện có (Radio button)
- Mỗi lớp: tên lớp, lịch học, phòng, sỹ số hiện tại / tối đa
- Tìm kiếm/lọc lớp

---

### 6.3 Step 2: Chọn gói học phí

**4 gói học phí:**

| Gói | Mô tả | Giá |
|-----|-------|-----|
| Gói 1 | Thanh toán theo buổi | 94.000đ/buổi |
| Gói 2 | Thanh toán theo tháng | 2.400.000đ/tháng |
| Gói 3 | Thanh toán theo kỳ | 3.000.000đ/kỳ |
| Gói 4 | Tùy chỉnh | Nhập số buổi |

**Radio button chọn gói**

---

### 6.4 Step 3: Thông tin học viên

**Thêm học viên vào danh sách đăng ký:**

**Form thêm học viên:**

| Field | Label | Type | Required |
|-------|-------|------|----------|
| name | Họ tên học viên | text | ✓ |
| dob | Ngày sinh | date | ✓ |
| gender | Giới tính | select | — |
| email | Email | email | — |
| phone | Số điện thoại | tel | — |
| parent_name | Tên phụ huynh | text | — |
| parent_phone | SĐT phụ huynh | tel | — |

**Bảng danh sách học viên đã thêm:**
- Tên, ngày sinh, lớp (từ bước 1), email
- Nút Xóa từng dòng

---

### 6.5 Step 4: Xác nhận

**Tóm tắt toàn bộ:**
- Tên lớp
- Gói học phí đã chọn
- Danh sách học viên
- Tổng thanh toán: **2,400,000đ**

**Nút:** `Xác nhận ghi danh` → Submit

---

### 6.6 SummarySidebar (Panel phải - persistent)

Luôn hiển thị trong suốt quy trình:
- Thông tin đã chọn ở các bước trước
- Thống kê học viên lớp (đã đăng ký / chỗ trống)
- **Tổng thanh toán** (cập nhật realtime theo gói phí + số HV)

---

## 7. API Integration

### 7.1 API Available Classes

**Endpoint:** `GET /api/teacher/classrooms?status=active`

**Response (200):**
```json
{
  "data": [
    {
      "id": 10,
      "name": "Starters 2A",
      "schedule": "T2, T4, T6 - 08:00",
      "room": "Phòng 01",
      "student_count": 12,
      "max_students": 25
    }
  ]
}
```

---

### 7.2 API Tuition Packages

**Endpoint:** `GET /api/teacher/tuition-packages?class_id={id}`

**Response (200):**
```json
{
  "packages": [
    { "id": 1, "label": "Theo buổi", "price": 94000, "unit": "session" },
    { "id": 2, "label": "Theo tháng", "price": 2400000, "unit": "month" },
    { "id": 3, "label": "Theo kỳ", "price": 3000000, "unit": "term" },
    { "id": 4, "label": "Tùy chỉnh", "price": null, "unit": "custom" }
  ]
}
```

---

### 7.3 API Enroll Students

**Endpoint:** `POST /api/teacher/enrollments`

**Request body:**
```json
{
  "class_id": 10,
  "package_id": 2,
  "students": [
    {
      "name": "Nguyễn Minh An",
      "dob": "2015-03-10",
      "gender": "male",
      "email": "an@example.com",
      "phone": "0901234567",
      "parent_name": "Nguyễn Văn B",
      "parent_phone": "0901234568"
    }
  ]
}
```

**Response (201):**
```json
{
  "enrollment_id": 100,
  "class_name": "Starters 2A",
  "students_enrolled": 1,
  "total_amount": 2400000
}
```

---

## 8. State Management

```typescript
enrollmentStore.setCurrentStep(1 | 2 | 3 | 4)
enrollmentStore.setSelectedClass(classroom)
enrollmentStore.setSelectedPackage(package)
enrollmentStore.setStudents(students)
enrollmentStore.addStudent(student)
enrollmentStore.removeStudent(index)
enrollmentStore.setTotalAmount(amount)
enrollmentStore.setSubmitting(bool)
```

---

## 9. Validation

| Step | Field | Rule | Thông báo |
|------|-------|------|-----------|
| 1 | class | required | "Vui lòng chọn lớp học" |
| 2 | package | required | "Vui lòng chọn gói học phí" |
| 3 | name | required | "Vui lòng nhập tên học viên" |
| 3 | dob | required, valid date | "Ngày sinh không hợp lệ" |
| 3 | students | min 1 | "Vui lòng thêm ít nhất 1 học viên" |

---

## 10. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load bước 1 | Hiển thị danh sách lớp |
| 2 | Chọn lớp + Next | Chuyển sang bước 2 |
| 3 | Chọn gói học phí | Cập nhật tổng tiền trong sidebar |
| 4 | Thêm học viên | Hiện trong bảng danh sách |
| 5 | Xóa học viên | Xóa khỏi danh sách |
| 6 | Xác nhận | API submit, toast thành công |
| 7 | Quay lại bước | Giữ nguyên dữ liệu đã nhập |
| 8 | Lớp đã đầy | Không cho chọn, hiện thông báo |
