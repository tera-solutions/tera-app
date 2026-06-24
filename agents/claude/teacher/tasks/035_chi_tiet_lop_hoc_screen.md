# [035] - Teacher - Chi tiết lớp học

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [035] |
| Module | Teacher |
| Screen | Chi tiết lớp học |
| Sprint | Sprint 2 |
| Label | Sprint2, Teacher, Frontend |
| Trello | https://trello.com/c/Jq52e0HU/70-035-teacher-chi-tiết-lớp-học |
| Mockup | https://drive.google.com/file/d/1NiKe_LPPEth3v2sxIsd6fcNIlmusteKR/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Hiển thị đầy đủ thông tin chi tiết một lớp học: thông tin lớp, thống kê học tập, danh sách học viên, lịch học sắp tới và thông báo liên quan.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập; giáo viên được phân công lớp này
- **Route:** `/classroom/{id}`
- **Layout:** BasicLayout
- **Breadcrumb:** Lớp học > Chi tiết lớp học

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Lớp học > Chi tiết lớp học                           │
│           │                                                      │
│           │ ┌──────────────────────┐  ┌────────────────────────┐│
│           │ │ [Book cover image]   │  │ Tiếng Anh A2 - (2,4,6) ││
│           │ │                      │  │ A2 - Ca Tối            ││
│           │ │                      │  │ Cấp độ: Pre-Intermediate││
│           │ │                      │  │ Phòng: Phòng 01        ││
│           │ │                      │  │ Lịch: T2, T4, T6       ││
│           │ │                      │  │ Thời gian: 08:00-09:30 ││
│           │ │                      │  │ Sỹ số: 24/25           ││
│           │ │                      │  │ Trạng thái: Đang học   ││
│           │ └──────────────────────┘  └────────────────────────┘│
│           │                                                      │
│           │ [85.2%] [80%] [90%] [Các chỉ số khác...]            │
│           │                                                      │
│           │ Danh sách học viên           [Xuất Excel] [Lọc]     │
│           │ ┌──────────────────────────────────────────────┐    │
│           │ │ STT │ Ảnh │ Họ tên │ Email │ SĐT │ Trạng thái│    │
│           │ ├──────────────────────────────────────────────┤    │
│           │ │  1  │ [a] │ Nguyễn │ ...  │ ... │ Đang học  │    │
│           │ │  2  │ [a] │ Trần   │ ...  │ ... │ Đang học  │    │
│           │ └──────────────────────────────────────────────┘    │
│           │                                [Sidebar phải]       │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 ClassroomInfoCard

**Hiển thị:**
- Ảnh bìa giáo trình (book cover)
- Tên lớp + cấp độ (badge)
- Phòng học
- Lịch học (ngày trong tuần)
- Thời gian học
- Sỹ số hiện tại / tối đa
- Trạng thái lớp (Đang học / Kết thúc / Tạm nghỉ)
- Giáo viên phụ trách

---

### 5.2 StatisticRow

**Chỉ số:**

| Chỉ số | Mô tả |
|--------|-------|
| Tỷ lệ chuyên cần | % học viên đi học đủ |
| Hoàn thành bài tập | % bài tập đã nộp |
| Điểm trung bình | Điểm TB của lớp |
| Tiến độ giáo án | % giáo án đã dạy |

---

### 5.3 StudentList

**Columns:**
- STT
- Ảnh đại diện
- Họ và tên (link → `/student/{id}`)
- Ngày sinh
- Email
- Điện thoại
- Trạng thái (Đang học / Bảo lưu / Nghỉ)
- Thao tác: Xem chi tiết | Nhận xét

**Features:**
- Tìm kiếm theo tên
- Lọc theo trạng thái
- Xuất Excel
- Pagination

---

### 5.4 AttendanceSummary

**Hiển thị:**
- Thống kê tổng: Có mặt / Vắng / Muộn
- Học viên thường xuyên vắng (warning list)

---

### 5.5 Sidebar phải

**Sections:**
- **Lịch học sắp tới:** danh sách 5 buổi tiếp theo
- **Thông báo lớp học:** thông báo gần nhất liên quan lớp này
- **Tài liệu:** link tài liệu lớp

---

## 6. Tab Navigation

Màn hình có thể có các tab:
- **Tổng quan** — thông tin + stats
- **Học viên** — danh sách học viên
- **Lịch học** — lịch của lớp này
- **Bài tập** — bài tập của lớp
- **Điểm số** — điểm học viên

---

## 7. API Integration

### 7.1 API Classroom Detail

**Endpoint:** `GET /api/teacher/classrooms/{id}`

**Response (200):**
```json
{
  "id": 10,
  "name": "Tiếng Anh A2 - Ca Tối",
  "level": "Pre-Intermediate",
  "room": "Phòng 01",
  "schedule_days": "Thứ 2, 4, 6",
  "start_time": "08:00",
  "end_time": "09:30",
  "student_count": 24,
  "max_students": 25,
  "status": "active",
  "cover_image": "https://...",
  "stats": {
    "attendance_rate": 85.2,
    "homework_completion": 80,
    "avg_score": 8.2,
    "lesson_plan_progress": 90
  }
}
```

---

### 7.2 API Student List (của lớp)

**Endpoint:** `GET /api/teacher/classrooms/{id}/students`

**Query params:**
```
search=Nguyễn
status=active     # active | suspended | dropped
page=1
limit=20
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Nguyễn Thị A",
      "dob": "2010-05-10",
      "email": "a@example.com",
      "phone": "0901234567",
      "avatar": "https://...",
      "status": "active",
      "attendance_rate": 90
    }
  ],
  "meta": { "total": 24, "per_page": 20 }
}
```

---

### 7.3 API Attendance Summary

**Endpoint:** `GET /api/teacher/classrooms/{id}/attendance-summary`

**Response (200):**
```json
{
  "total_sessions": 20,
  "present_avg": 85,
  "absent_avg": 10,
  "late_avg": 5,
  "at_risk_students": [
    { "id": 3, "name": "Trần Văn B", "absent_count": 5 }
  ]
}
```

---

## 8. State Management

```typescript
classroomDetailStore.setDetail(classroom)
classroomDetailStore.setStudents(students)
classroomDetailStore.setAttendanceSummary(summary)
classroomDetailStore.setActiveTab(tab)
```

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị đầy đủ info lớp |
| 2 | Click tên học viên | Navigate /student/{id} |
| 3 | Tìm kiếm học viên | Filter trong danh sách |
| 4 | Lọc trạng thái | Chỉ hiện đúng trạng thái |
| 5 | Xuất Excel | Download file ds học viên |
| 6 | Lớp không tồn tại / không có quyền | 404 / redirect |
| 7 | Click tab "Bài tập" | Hiển thị ds bài tập của lớp |
| 8 | Click "Nhận xét" | Mở form nhận xét học viên |
