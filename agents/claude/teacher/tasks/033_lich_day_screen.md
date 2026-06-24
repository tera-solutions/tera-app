# [033] - Teacher - Lịch dạy

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [033] |
| Module | Teacher |
| Screen | Lịch dạy |
| Sprint | Sprint 2 |
| Label | Sprint2, Teacher, Frontend |
| Trello | https://trello.com/c/pDHPSEdY/69-033-teacher-lịch-dạy |
| Mockup | https://drive.google.com/file/d/1juFBWKfXsFRLibH5vx_dFO9YRiNHOTam/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Hiển thị lịch dạy của giáo viên theo ngày, tuần và tháng. Cho phép xem chi tiết từng buổi học, lọc theo lớp và tìm kiếm theo ngày.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/schedule`
- **Layout:** BasicLayout

---

## 4. UI Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Sidebar] │  Lịch dạy                              [Thêm lịch dạy] │
│           │  Quản lý lịch dạy hết theo tuần hoặc tháng             │
│           │                                                         │
│           │  [← 18/05/2025 - 18/05/2025 →]  [Tuần] [Tháng]        │
│           │  Tìm kiếm lớp...                                        │
│           ├────────────────────────────────┬────────────────────────┤
│           │  TUẦN HIỆN TẠI                 │  Lịch tháng 5/2025     │
│           │  T2   T3   T4   T5  T6  T7  CN│  [mini calendar]       │
│           │  ─────────────────────────────│                        │
│           │  08:00 [Starters 2A]           │  Lớp chủ nhiệm: 3      │
│           │  09:45 [Movers 1B ]            │  Học viên: 72          │
│           │  11:00 [Flyers 2A ]            │                        │
│           │  15:00 [KET 1A    ]            │  Lịch dạy thứ này      │
│           │                               │  [chart / stats]       │
│           │  ─────────────────────────────│                        │
│           │  Lớp chủ nhiệm   Học viên     │                        │
│           │       3              72       │                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 ScheduleToolbar

**Nội dung:**
- Nút điều hướng: `← [khoảng ngày] →`
- Tabs chế độ xem: **Tuần** | **Tháng**
- Ô tìm kiếm lớp
- Nút "Thêm lịch dạy" (nếu có quyền)

---

### 5.2 WeekCalendar (Chế độ Tuần)

**Hiển thị:**
- Cột: Thứ 2 → Chủ nhật (7 cột)
- Hàng: Khung giờ 30 phút (07:00 → 21:00)
- Mỗi buổi học là một block có màu theo lớp:
  - Tên lớp + cấp độ
  - Phòng học
  - Thời gian
  - Trạng thái (Sắp tới / Đang diễn ra / Đã xong)
- Click block → mở ScheduleDetailDrawer

---

### 5.3 MonthCalendar (Chế độ Tháng)

**Hiển thị:**
- Lưới tháng (7 cột × ~6 hàng)
- Mỗi ô ngày: tối đa 3 buổi học (hiển thị tên lớp rút gọn)
- "Xem thêm +N" nếu vượt 3 buổi
- Click ngày → mở DayView sidebar

---

### 5.4 ScheduleDetailDrawer

**Hiển thị khi click vào buổi học:**
- Tên lớp + cấp độ
- Phòng học
- Thời gian bắt đầu – kết thúc
- Giáo án buổi đó (nếu có)
- Số học viên
- Nút "Bắt đầu buổi học" → `/lesson/{id}`
- Nút "Xem chi tiết lớp" → `/classroom/{id}`

---

### 5.5 ScheduleSidebar (Panel phải)

**Sections:**
- **Lớp chủ nhiệm:** số lớp
- **Học viên:** tổng số
- **Lịch dạy thứ này:** biểu đồ thanh theo ngày
- **Lịch tháng:** mini calendar với highlight ngày có lịch

---

## 6. API Integration

### 6.1 API Schedule List

**Endpoint:** `GET /api/teacher/schedules`

**Query params:**
```
view=week             # week | month | day
date=2025-05-18       # ngày bắt đầu của tuần/tháng
class_id=             # filter theo lớp (optional)
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "class_id": 10,
      "class_name": "Starters 2A",
      "level": "Beginner",
      "room": "Phòng 01",
      "date": "2025-05-18",
      "start_time": "08:00",
      "end_time": "09:30",
      "status": "upcoming",
      "lesson_plan_id": 5,
      "student_count": 24
    }
  ],
  "summary": {
    "total_classes": 3,
    "total_students": 72,
    "lessons_this_week": 9
  }
}
```

---

### 6.2 API Schedule Detail

**Endpoint:** `GET /api/teacher/schedules/{id}`

**Response (200):**
```json
{
  "id": 1,
  "class_name": "Starters 2A",
  "level": "Beginner",
  "room": "Phòng 01",
  "date": "2025-05-18",
  "start_time": "08:00",
  "end_time": "09:30",
  "status": "upcoming",
  "lesson_plan": {
    "id": 5,
    "title": "Unit 01 - Hello! Getting to know you"
  },
  "student_count": 24,
  "attendance_done": false
}
```

---

## 7. State Management

```typescript
scheduleStore.setView('week' | 'month')
scheduleStore.setCurrentDate(date)
scheduleStore.setSchedules(data)
scheduleStore.setSelectedSchedule(schedule)
scheduleStore.setSummary(summary)
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị tuần hiện tại với lịch dạy |
| 2 | Chuyển sang tháng | Hiển thị lưới tháng |
| 3 | Click nút ← | Lùi về tuần/tháng trước |
| 4 | Click nút → | Tiến đến tuần/tháng sau |
| 5 | Click block buổi học | Mở ScheduleDetailDrawer |
| 6 | Nhấn "Bắt đầu buổi học" | Navigate /lesson/{id} |
| 7 | Ngày không có lịch | Block rỗng, không crash |
| 8 | Tìm kiếm lớp | Filter chỉ hiện lịch của lớp đó |
| 9 | Responsive mobile | Hiển thị Day view |
