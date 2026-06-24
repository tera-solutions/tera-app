# [038] - Teacher - Điểm danh

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [038] |
| Module | Teacher |
| Screen | Điểm danh |
| Sprint | Sprint 2 |
| Label | Sprint2, Teacher, Frontend |
| Trello | https://trello.com/c/ns0yn2PN/75-038-teacher-điểm-danh |
| Mockup | https://drive.google.com/file/d/1C13k0uAmqT8x2QXSwU9kqkf7FcZfwACD/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Cho phép giáo viên thực hiện điểm danh học viên theo buổi học. Hỗ trợ điểm danh nhanh từng học viên, điểm danh hàng loạt và xem thống kê chuyên cần.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/attendance` hoặc `/classroom/{id}/attendance`
- **Layout:** BasicLayout

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │  Điểm danh                         [Xuất báo cáo]   │
│           │  Quản lý điểm danh theo buổi học                    │
│           │                                                      │
│           │  [Avatar lớp] Starters 2A                           │
│           │  Phòng 01 · Thứ 2, 4, 6 · 08:00 · 24 học viên      │
│           │                                                      │
│           │  Buổi học: [Thứ 4, 15/05/2025 ▼]                    │
│           │                                                      │
│           │  ┌────┐ ┌────┐ ┌────┐ ┌─────────────────────────┐   │
│           │  │ 20 │ │  2 │ │  2 │ │      24 (donut)          │   │
│           │  │Có  │ │Vắng│ │Muộn│ │                         │   │
│           │  │mặt │ │    │ │    │ │                         │   │
│           │  └────┘ └────┘ └────┘ └─────────────────────────┘   │
│           │                                                      │
│           │  [✓ Đánh dấu có mặt tất cả]                         │
│           │                                                      │
│           │  ┌──────┬──────┬──────┬──────┬──────┬──────┐        │
│           │  │[Ảnh] │[Ảnh] │[Ảnh] │[Ảnh] │[Ảnh] │[Ảnh] │        │
│           │  │ Tên  │ Tên  │ Tên  │ Tên  │ Tên  │ Tên  │        │
│           │  │[P][A]│[P][A]│[P][L]│      │      │      │        │
│           │  └──────┴──────┴──────┴──────┴──────┴──────┘        │
│           │                                                      │
│           │ [✓ Điểm danh cả lớp] [Lưu điểm danh]                │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 AttendanceHeader

**Hiển thị:**
- Avatar + tên lớp
- Phòng học, ngày học trong tuần, giờ học, sỹ số
- Dropdown chọn buổi học (date)
- Nút xuất báo cáo

---

### 5.2 AttendanceSummary (Stats)

| Stat | Icon | Mô tả |
|------|------|-------|
| Có mặt | ✓ xanh | Số HV đã điểm danh có mặt |
| Vắng | ✗ đỏ | Số HV vắng |
| Muộn | ⏰ vàng | Số HV đi muộn |
| Tổng | donut | Tổng sỹ số |

Donut chart hiển thị tỷ lệ có mặt / vắng / muộn.

---

### 5.3 AttendanceTable (Grid avatar)

**Hiển thị mỗi học viên:**
- Ảnh đại diện (tròn)
- Họ tên rút gọn
- Nút trạng thái (toggle):
  - **P** (Present) — Có mặt → xanh
  - **A** (Absent) — Vắng → đỏ
  - **L** (Late) — Muộn → vàng
  - **E** (Excused) — Phép → tím

**Hành vi:**
- Click avatar/tên → mở StudentAttendanceDetail
- Click nút trạng thái → toggle trực tiếp (optimistic update)
- Trạng thái mặc định: Present

---

### 5.4 BulkAttendance

**Nút "✓ Đánh dấu có mặt tất cả":**
- Đặt tất cả HV = Present
- Nút "Reset" để về trạng thái mặc định

---

### 5.5 QuickAttendance

**Tìm kiếm nhanh theo tên** để chấm điểm danh cá nhân khi lớp đông.

---

### 5.6 SaveAttendanceButton

- Nút "Lưu điểm danh" ở cuối trang
- Disabled nếu chưa điểm danh ai
- Confirm nếu còn HV chưa được chấm

---

### 5.7 Sidebar phải

**Sections:**
- **Thống kê các lớp:** tổng quan điểm danh các lớp hôm nay
- **Danh sách vắng mặt:** HV vắng của lớp này
- **Ghi chú điểm danh:** textarea ghi chú buổi học

---

## 6. Trạng thái điểm danh

| Code | Label | Màu | Mô tả |
|------|-------|-----|-------|
| present | Có mặt | Xanh lá | Đến đúng giờ |
| late | Muộn | Vàng | Đến trễ |
| absent | Vắng | Đỏ | Không có mặt |
| excused | Phép | Tím | Vắng có phép |

---

## 7. API Integration

### 7.1 API Attendance List (lấy danh sách HV + trạng thái buổi)

**Endpoint:** `GET /api/teacher/attendance`

**Query params:**
```
class_id=10
date=2025-05-15
session_id=101      # nếu có session cụ thể
```

**Response (200):**
```json
{
  "session": {
    "id": 101,
    "class_id": 10,
    "class_name": "Starters 2A",
    "date": "2025-05-15",
    "start_time": "08:00",
    "room": "Phòng 01"
  },
  "students": [
    {
      "id": 1,
      "name": "Nguyễn Thị Phương",
      "avatar": "https://...",
      "status": "present"
    },
    {
      "id": 2,
      "name": "Trần Thị Bích",
      "avatar": "https://...",
      "status": null
    }
  ],
  "summary": {
    "present": 20,
    "absent": 2,
    "late": 2,
    "total": 24
  }
}
```

---

### 7.2 API Save Attendance

**Endpoint:** `POST /api/teacher/attendance`

**Request body:**
```json
{
  "class_id": 10,
  "session_id": 101,
  "date": "2025-05-15",
  "records": [
    { "student_id": 1, "status": "present" },
    { "student_id": 2, "status": "absent" },
    { "student_id": 3, "status": "late" }
  ],
  "note": "Lớp học tốt, 2 em vắng không phép"
}
```

**Response (200):**
```json
{
  "success": true,
  "saved_count": 24
}
```

---

### 7.3 API Attendance Summary

**Endpoint:** `GET /api/teacher/attendance/summary?class_id=10&month=5&year=2025`

**Response (200):**
```json
{
  "total_sessions": 20,
  "attendance_rate": 85,
  "by_student": [
    { "student_id": 1, "name": "Nguyễn A", "present": 18, "absent": 2, "late": 0 }
  ]
}
```

---

## 8. State Management

```typescript
attendanceStore.setSession(session)
attendanceStore.setStudents(students)
attendanceStore.setSummary(summary)
attendanceStore.updateStudentStatus(studentId, status)
attendanceStore.markAllPresent()
attendanceStore.setNote(note)
```

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Danh sách HV + trạng thái buổi hôm nay |
| 2 | Click trạng thái HV | Toggle P/A/L/E, cập nhật stats ngay |
| 3 | Nhấn "Đánh dấu có mặt tất cả" | Tất cả = Present |
| 4 | Lưu điểm danh thành công | Toast "Lưu thành công", lock form |
| 5 | Chọn buổi học khác | Load lại trạng thái của buổi đó |
| 6 | Còn HV chưa chấm + nhấn Lưu | Confirm dialog |
| 7 | Xuất báo cáo | Download file báo cáo điểm danh |
| 8 | Tìm kiếm HV | Filter trong grid |
| 9 | Điểm danh đã lưu (buổi cũ) | Hiển thị trạng thái read-only |
