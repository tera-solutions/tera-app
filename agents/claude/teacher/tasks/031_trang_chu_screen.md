# [031] - Teacher - Trang chủ

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [031] |
| Module | Teacher |
| Screen | Trang chủ (Dashboard) |
| Sprint | Sprint 2 |
| Label | Sprint2, Teacher, Frontend |
| Trello | https://trello.com/c/l6VwczpF/68-031-teacher-trang-chủ |
| Mockup | https://drive.google.com/file/d/1Sz1naNpIZ1b_ip9F3Yp_6dfdw4swBtWH/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Hiển thị tổng quan công việc giảng dạy của giáo viên trong ngày: thống kê nhanh, lịch dạy hôm nay, điểm danh, bài tập cần chấm, thông báo mới và tiến độ học tập của học viên.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập (authenticated)
- **Route:** `/dashboard`
- **Layout:** BasicLayout (có sidebar menu + header)
- **Default route sau login:** Redirect đến `/dashboard`

---

## 4. UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  Xin chào, Cô Ngọc 👋                         │
│            │  Đây là nhật ký ngày học hôm nay...            │
│            │                                                 │
│            │  ┌──────┐ ┌──────┐ ┌──────────┐ ┌──────────┐  │
│            │  │ Phụ  │ │ Lớp  │ │ Buổi dạy │ │  Hoàn    │  │
│            │  │ vào  │ │ đang │ │ hôm nay  │ │  thành   │  │
│            │  │  --  │ │  12  │ │    28    │ │   85%    │  │
│            │  └──────┘ └──────┘ └──────────┘ └──────────┘  │
│            │                                                 │
│            │  ┌─────────────┐ ┌────────────┐ ┌──────────┐  │
│            │  │ Lịch dạy    │ │ Điểm danh  │ │ Bài tập  │  │
│            │  │ hôm nay     │ │            │ │ cần chấm │  │
│            │  │  [list]     │ │  [avatars] │ │  [list]  │  │
│            │  └─────────────┘ └────────────┘ └──────────┘  │
│            │                                                 │
│            │  ┌─────────────┐ ┌────────────┐ ┌──────────┐  │
│            │  │ Thông báo   │ │ Tiến độ    │ │ Giáo án  │  │
│            │  │ mới         │ │ học tập    │ │ gần đây  │  │
│            │  └─────────────┘ └────────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 DashboardHeader

**Nội dung:**
- Lời chào cá nhân: "Xin chào, {tên giáo viên} 👋"
- Subtitle: "Đây là nhật ký ngày học hôm nay, hãy quan sát những điều thú vị!"
- Ngày hiện tại (header)

---

### 5.2 StatisticCard (×4)

**Props:**
- `icon: ReactNode`
- `label: string`
- `value: string | number`
- `color?: string`

**Cards hiển thị:**

| Card | Label | Nguồn dữ liệu |
|------|-------|----------------|
| 1 | Phụ vào | Dashboard summary |
| 2 | Lớp đang đợi | Dashboard summary |
| 3 | Buổi dạy hôm nay | Schedule summary |
| 4 | Tỷ lệ hoàn thành | Dashboard summary |

---

### 5.3 ScheduleWidget — Lịch dạy hôm nay

**Hiển thị:**
- Tiêu đề + link "Xem tất cả" → `/schedule`
- Danh sách buổi học hôm nay (tối đa 5):
  - Thời gian: HH:mm
  - Tên lớp + cấp độ
  - Phòng học
  - Trạng thái (Sắp tới / Đang diễn ra / Đã xong)

---

### 5.4 AttendanceWidget — Điểm danh

**Hiển thị:**
- Avatar học viên của lớp hôm nay
- Thống kê nhanh: Có mặt / Vắng / Muộn
- Link "Xem chi tiết" → `/attendance`

---

### 5.5 HomeworkWidget — Bài tập cần chấm

**Hiển thị:**
- Danh sách bài tập chưa chấm (tối đa 5)
- Tên bài tập, lớp, số bài cần chấm
- Link "Xem tất cả" → `/homework/review`

---

### 5.6 NotificationWidget — Thông báo mới

**Hiển thị:**
- Danh sách thông báo mới nhất (tối đa 5)
- Icon loại thông báo, tiêu đề, thời gian
- Số thông báo chưa đọc (badge)
- Link "Xem tất cả" → `/notifications`

---

### 5.7 ProgressWidget — Tiến độ học tập

**Hiển thị:**
- Danh sách lớp + % tiến độ
- Progress bar hoặc donut chart

---

### 5.8 LessonPlanWidget — Giáo án gần đây

**Hiển thị:**
- Danh sách giáo án gần nhất (tối đa 3)
- Tên unit, lớp, % đã giảng

---

## 6. API Integration

### 6.1 API Dashboard Summary

**Endpoint:** `GET /api/teacher/dashboard/summary`

**Headers:**
```
Authorization: Bearer {access_token}
Device-code: {device_code}
Accept: application/json
```

**Response (200):**
```json
{
  "stats": {
    "students_enrolled": 72,
    "active_classes": 12,
    "lessons_today": 3,
    "completion_rate": 85
  },
  "schedule_today": [
    {
      "id": 1,
      "class_name": "Starters 2A",
      "level": "Beginner",
      "room": "Phòng 01",
      "start_time": "08:00",
      "end_time": "09:30",
      "status": "upcoming"
    }
  ],
  "homework_pending": [
    {
      "id": 1,
      "title": "Unit 01 - Homework",
      "class_name": "Starters 2A",
      "pending_count": 5,
      "deadline": "2025-05-20"
    }
  ],
  "notifications_unread": 3
}
```

---

### 6.2 API Notification Summary

**Endpoint:** `GET /api/teacher/notifications?limit=5&unread=true`

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Họp phụ huynh tháng 5",
      "content": "...",
      "type": "meeting",
      "is_read": false,
      "created_at": "2025-05-15T10:00:00Z"
    }
  ],
  "unread_count": 3
}
```

---

## 7. State Management

```typescript
dashboardStore.setSummary(summary)
dashboardStore.setScheduleToday(scheduleToday)
dashboardStore.setHomeworkPending(homeworkPending)
notificationStore.setUnreadCount(unread_count)
```

---

## 8. Loading & Error State

- Mỗi widget hiển thị skeleton loader khi đang fetch
- Nếu API lỗi: hiển thị icon lỗi + nút "Thử lại" trong widget
- Không block toàn trang nếu một widget lỗi

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load dashboard | Hiển thị lời chào + tên giáo viên |
| 2 | Có lịch hôm nay | ScheduleWidget hiển thị danh sách buổi học |
| 3 | Không có lịch hôm nay | ScheduleWidget hiển thị "Không có lịch dạy hôm nay" |
| 4 | Có bài chờ chấm | HomeworkWidget hiển thị số lượng |
| 5 | Nhấn "Xem tất cả" ở Lịch dạy | Navigate /schedule |
| 6 | Nhấn "Xem tất cả" ở Thông báo | Navigate /notifications |
| 7 | API lỗi | Widget riêng lẻ hiển thị lỗi, không crash trang |
| 8 | Refresh trang | Re-fetch tất cả API |
