# [040] - Teacher - Chi tiết học viên

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [040] |
| Module | Teacher |
| Screen | Chi tiết học viên |
| Sprint | Sprint 3 |
| Label | Sprint3, Teacher, Frontend |
| Trello | https://trello.com/c/Qk2KLD9i |
| Mockup | https://drive.google.com/file/d/1Q-xFM1Ta4zYRCPFAQXi3fwOs1m0jwsEO/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Hiển thị đầy đủ thông tin chi tiết một học viên: hồ sơ cá nhân, thống kê học tập, tiến độ kỹ năng, lịch học sắp tới, nhận xét gần đây và thành tích.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập; giáo viên có lớp chứa học viên này
- **Route:** `/student/{id}`
- **Layout:** BasicLayout
- **Breadcrumb:** Học viên > Chi tiết học viên

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Học viên > Chi tiết học viên                         │
│           │                                                      │
│           ├─────────────────────────┬────────────────────────────┤
│           │ [Avatar] Nguyễn Minh An │  ┌──────┐┌──────┐┌──────┐ │
│           │ Lớp: Starters 2A        │  │  85% ││ 8.2  ││  98% │ │
│           │ Trạng thái: Đang học    │  │Chuyên││Điểm  ││Bài   │ │
│           │                         │  │ cần  ││ TB   ││ tập  │ │
│           │                         │  └──────┘└──────┘└──────┘ │
│           │                         │  ┌──────┐┌──────┐         │
│           │                         │  │  12  ││   5  │         │
│           │                         │  │Buổi  ││Điểm  │         │
│           │                         │  │ học  ││      │         │
│           │                         │  └──────┘└──────┘         │
│           ├─────────────────────────┴────────────────────────────┤
│           │ [Tổng quan] [Điểm số] [Bài tập] [Tài liệu]          │
│           │                                                      │
│           │  Tiến độ học tập [Line chart]                        │
│           │                                                      │
│           │  Kỹ năng:                                            │
│           │  Listening ██████████ 82%                            │
│           │  Speaking  ████████   70%                            │
│           │  Reading   █████████  78%                            │
│           │  Writing   ███████    65%                            │
│           │                                                      │
│           │  Lịch học tiếp theo                                  │
│           │  ┌──────────────────────────────────────────────┐    │
│           │  │ Ngày      │ Giờ         │ Lớp    │ Phòng    │    │
│           │  └──────────────────────────────────────────────┘    │
│           │                                                      │
│           │  Nhận xét gần đây     Thành tích & Huy hiệu          │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 StudentProfileCard

**Hiển thị:**
- Avatar học viên
- Họ tên đầy đủ (Nguyễn Minh An)
- Tên lớp (Starters 2A)
- Trạng thái học (Đang học / Bảo lưu / Nghỉ)
- Nút: Nhận xét | Nhắn tin | Ghi chú

---

### 5.2 StatRow (×5 cards)

| Card | Giá trị |
|------|---------|
| Chuyên cần | % tỷ lệ đi học |
| Điểm TB | Điểm trung bình |
| Bài tập | % bài tập hoàn thành |
| Buổi học | Tổng số buổi đã học |
| Điểm | Điểm tích lũy/thành tích |

---

### 5.3 TabNavigation

**Tabs:**
- Tổng quan (active mặc định)
- Điểm số
- Bài tập
- Tài liệu

---

### 5.4 Tab Tổng quan

**Sections:**

**Tiến độ học tập:** Line chart theo thời gian (điểm theo tuần/tháng)

**Kỹ năng:** Horizontal bar chart cho 4 kỹ năng:
- Listening
- Speaking
- Reading
- Writing

**Lịch học tiếp theo:** Table các buổi học upcoming
- Ngày, Giờ, Tên lớp, Phòng học

**Nhận xét gần đây:** List 3–5 nhận xét gần nhất của GV

**Thành tích & Huy hiệu:** Grid badge icons + mô tả

**Tài liệu học tập:** List file tài liệu đã chia sẻ

---

## 6. API Integration

### 6.1 API Student Detail

**Endpoint:** `GET /api/teacher/students/{id}`

**Headers:**
```
Authorization: Bearer {access_token}
Device-code: {device_code}
Accept: application/json
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Nguyễn Minh An",
  "avatar": "https://...",
  "class_name": "Starters 2A",
  "class_id": 10,
  "status": "active",
  "stats": {
    "attendance_rate": 85,
    "avg_score": 8.2,
    "homework_completion": 98,
    "total_sessions": 12,
    "points": 5
  }
}
```

---

### 6.2 API Student Progress

**Endpoint:** `GET /api/teacher/students/{id}/progress`

**Response (200):**
```json
{
  "chart_data": [
    { "week": "Tuần 1", "score": 7.5 },
    { "week": "Tuần 2", "score": 8.0 }
  ],
  "skills": {
    "listening": 82,
    "speaking": 70,
    "reading": 78,
    "writing": 65
  }
}
```

---

### 6.3 API Upcoming Schedule

**Endpoint:** `GET /api/teacher/students/{id}/schedule`

**Response (200):**
```json
{
  "sessions": [
    {
      "date": "2025-05-20",
      "time": "08:00-09:30",
      "class_name": "Starters 2A",
      "room": "Phòng 01"
    }
  ]
}
```

---

### 6.4 API Student Comments

**Endpoint:** `GET /api/teacher/students/{id}/comments`

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "content": "Học viên tiến bộ rõ rệt...",
      "created_at": "2025-05-15",
      "teacher_name": "Cô Ngọc"
    }
  ]
}
```

---

### 6.5 API Student Achievements

**Endpoint:** `GET /api/teacher/students/{id}/achievements`

**Response (200):**
```json
{
  "badges": [
    { "id": 1, "name": "Chuyên cần", "icon": "🏅", "earned_at": "2025-04-01" }
  ]
}
```

---

## 7. State Management

```typescript
studentDetailStore.setDetail(student)
studentDetailStore.setProgress(progress)
studentDetailStore.setSchedule(sessions)
studentDetailStore.setComments(comments)
studentDetailStore.setAchievements(badges)
studentDetailStore.setActiveTab(tab)
```

---

## 8. Error Handling

| Trường hợp | Xử lý |
|------------|-------|
| Học viên không tồn tại | Hiển thị 404 |
| Không có quyền xem | Redirect về danh sách |
| API lỗi | Toast "Không thể tải thông tin học viên" |

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị đủ profile + stats |
| 2 | Click tab "Điểm số" | Hiển thị bảng điểm |
| 3 | Click tab "Bài tập" | Hiển thị danh sách bài tập |
| 4 | Chart kỹ năng | Render đúng 4 bars |
| 5 | Lịch học tiếp theo | Hiển thị buổi học sắp tới |
| 6 | Click "Nhận xét" | Mở form tạo nhận xét |
| 7 | Học viên không tồn tại | Hiển thị 404 |
| 8 | Thành tích | Hiển thị badges đã đạt |
