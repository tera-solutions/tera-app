# [062] - Teacher - Chi tiết phụ huynh

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [062] |
| Module | Teacher |
| Screen | Chi tiết phụ huynh |
| Sprint | Sprint 3 |
| Label | Sprint3, Teacher, Frontend |
| Trello | https://trello.com/c/RIIs72E6 |
| Mockup | https://drive.google.com/file/d/1SZwWKyXwjyMUXuRNHHpw7tEGsU6wKBNU/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Hiển thị chi tiết thông tin phụ huynh: con đang học, lịch học, tài liệu học tập, thống kê học viên và thông báo mới nhất liên quan.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập; giáo viên có lớp chứa con của phụ huynh này
- **Route:** `/parent/{id}`
- **Layout:** BasicLayout
- **Breadcrumb:** Phụ huynh > Chi tiết phụ huynh

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Xin chào, Cô Ngọc                                    │
│           │ Tổng quan về phụ huynh, lịch học và tài liệu         │
│           │                                                      │
│           │ ┌──────┐ ┌──────┐                                   │
│           │ │  2   │ │  28  │                                   │
│           │ │ Con  │ │ Buổi │                                   │
│           │ │ đang │ │ học  │                                   │
│           │ │ học  │ │tháng │                                   │
│           │ └──────┘ └──────┘                                   │
│           │                                                      │
│           ├──────────────────────────┬───────────────────────────┤
│           │  Lịch học gần đây        │  Thống kê học viên        │
│           │  [Tên con: Minh Anh]     │  [Summary cards per con] │
│           │  ┌──────────────────┐    │                           │
│           │  │08:00-09:30 │ T2  │    │  Thông báo mới nhất      │
│           │  │14:00-15:30 │ T4  │    │  ────────────────────     │
│           │  │17:00-18:30 │ T6  │    │  📢 Thông báo 1           │
│           │  └──────────────────┘    │  📢 Thông báo 2           │
│           │                          │                           │
│           │  Tài liệu học tập        │                           │
│           │  📄 File 1               │                           │
│           │  📄 File 2               │                           │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 PageHeader

**Hiển thị:**
- "Xin chào, {teacher_name}" (greeting)
- Mô tả ngắn: "Tổng quan về phụ huynh, lịch học và tài liệu học tập"

---

### 5.2 ParentStatRow (×2)

| Card | Giá trị |
|------|---------|
| Con đang học | Số con đang theo học (2) |
| Buổi học tháng này | Tổng buổi học của các con trong tháng (28) |

---

### 5.3 RecentScheduleCard (Panel trái - trên)

**Hiển thị lịch học gần đây của con:**
- Tên con (Minh Anh)
- Danh sách buổi học: Giờ + Ngày trong tuần

**Dropdown chọn con** nếu có nhiều con học

---

### 5.4 StudyMaterialList (Panel trái - dưới)

Danh sách tài liệu học tập được chia sẻ với phụ huynh:
- Icon + Tên file
- Ngày chia sẻ
- Nút Download

---

### 5.5 StudentStatSidebar (Panel phải - trên)

Thống kê học tập từng con của phụ huynh này:

| Chỉ số | Giá trị |
|--------|---------|
| Chuyên cần | % |
| Điểm TB | điểm |
| Bài tập | % hoàn thành |

---

### 5.6 NotificationList (Panel phải - dưới)

Danh sách thông báo mới nhất liên quan đến con:
- Icon 📢 + tiêu đề thông báo
- Thời gian
- Trạng thái (đã đọc / chưa đọc)

---

## 6. API Integration

### 6.1 API Parent Detail

**Endpoint:** `GET /api/teacher/parents/{id}`

**Headers:**
```
Authorization: Bearer {access_token}
Device-code: {device_code}
Accept: application/json
```

**Response (200):**
```json
{
  "parent": {
    "id": 1,
    "name": "Trần Thị An",
    "phone": "0901234567",
    "email": "an@example.com",
    "relation": "Mẹ"
  },
  "children": [
    {
      "id": 10,
      "name": "Minh Anh",
      "class_name": "Starters 2A",
      "stats": {
        "attendance_rate": 92,
        "avg_score": 8.5,
        "homework_completion": 95
      }
    }
  ],
  "sessions_this_month": 28,
  "recent_schedule": [
    { "child_name": "Minh Anh", "time": "08:00-09:30", "day": "Thứ 2" }
  ],
  "materials": [
    { "id": 1, "name": "Tài liệu Unit 5.pdf", "url": "https://...", "shared_at": "2025-05-10" }
  ],
  "notifications": [
    { "id": 1, "title": "Lịch kiểm tra giữa kỳ", "created_at": "2025-05-15", "read": false }
  ]
}
```

---

## 7. State Management

```typescript
parentDetailStore.setParent(parent)
parentDetailStore.setChildren(children)
parentDetailStore.setSchedule(schedule)
parentDetailStore.setMaterials(materials)
parentDetailStore.setNotifications(notifications)
parentDetailStore.setSelectedChild(child)
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị thông tin PH + con |
| 2 | Nhiều con | Dropdown chọn con hoạt động đúng |
| 3 | Lịch học | Hiển thị đúng buổi học theo con |
| 4 | Tải tài liệu | Download file thành công |
| 5 | Click thông báo | Đánh dấu đã đọc + xem chi tiết |
| 6 | Thống kê HV | Hiển thị đúng chỉ số học tập |
| 7 | PH không có con trong lớp | Redirect hoặc hiển thị thông báo |
