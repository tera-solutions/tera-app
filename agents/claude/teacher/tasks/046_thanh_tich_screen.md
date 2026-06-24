# [046] - Teacher - Thành tích

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [046] |
| Module | Teacher |
| Screen | Thành tích |
| Sprint | Sprint 3 |
| Label | Sprint3, Teacher, Frontend |
| Trello | https://trello.com/c/KhZbACi4 |
| Mockup | https://drive.google.com/file/d/1AocYS7uKvylWbtq5WqWm8gYvn53lw_-b/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Hiển thị tổng hợp thành tích giảng dạy của giáo viên: số lớp, giờ dạy, học viên, rating, tiến trình theo thời gian và đánh giá từ học viên.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/achievement`
- **Layout:** BasicLayout
- **Breadcrumb:** Trang chủ > Thành tích

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Thành tích                                           │
│           │                                                      │
│           ├─────────────────────────┬────────────────────────────┤
│           │  [Avatar] Cô Ngọc       │  ┌──────┐┌──────┐┌──────┐ │
│           │  Giáo viên              │  │  100 ││ 250+ ││  50  │ │
│           │                         │  │ Lớp  ││ Giờ  ││  HV  │ │
│           │                         │  └──────┘└──────┘└──────┘ │
│           │                         │  ┌──────┐                  │
│           │                         │  │  90% ││                 │
│           │                         │  │Rating│                  │
│           │                         │  └──────┘                  │
│           ├─────────────────────────┴────────────────────────────┤
│           │  Tổng quan                                           │
│           │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐               │
│           │  │ 4.8★ │ │96.5% │ │  28  │ │  12  │               │
│           │  │      │ │ Hài  │ │Buổi  │ │ Lớp  │               │
│           │  │      │ │ lòng │ │      │ │      │               │
│           │  └──────┘ └──────┘ └──────┘ └──────┘               │
│           │                                                      │
│           │  Tiến trình [Line chart theo thời gian]             │
│           │                                                      │
│           │  Top tháng / Top tuần [Achievement cards]           │
│           │                                                      │
│           │  Đánh giá học viên [List reviews]                   │
│           │                                                      │
│           │  Thống kê lớp học [Summary table]                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 TeacherProfileCard

**Hiển thị:**
- Avatar giáo viên
- Tên (Cô Ngọc)
- Vai trò (Giáo viên)
- Ngày tham gia

---

### 5.2 CareerStatRow (×4 cards)

| Card | Giá trị |
|------|---------|
| Tổng lớp | Số lớp đã/đang dạy (100) |
| Tổng giờ | Tổng giờ giảng dạy (250+) |
| Học viên | Tổng số HV đã dạy (50) |
| Rating | Tỷ lệ đánh giá tốt (90%) |

---

### 5.3 OverviewStatRow (×4 cards)

| Card | Giá trị |
|------|---------|
| Đánh giá sao | 4.8★ trung bình |
| Hài lòng | 96.5% phản hồi tích cực |
| Buổi dạy | 28 buổi trong kỳ |
| Lớp hiện tại | 12 lớp đang dạy |

---

### 5.4 ProgressChart

- Line chart thể hiện tiến trình theo thời gian
- Trục X: Tháng/Tuần
- Trục Y: Rating / Số học viên / Số buổi

---

### 5.5 AchievementCards

**Top tháng & Top tuần:**
- Card thành tích nổi bật trong tháng/tuần
- Icon + tiêu đề + mô tả ngắn

---

### 5.6 StudentReviewList

- Danh sách đánh giá của học viên
- Avatar HV + tên + nội dung đánh giá + số sao + ngày

---

### 5.7 ClassStatsSummary

- Bảng thống kê các lớp học hiện tại
- Tên lớp, số HV, rating lớp, trạng thái

---

## 6. API Integration

### 6.1 API Teacher Achievement

**Endpoint:** `GET /api/teacher/achievements`

**Headers:**
```
Authorization: Bearer {access_token}
Device-code: {device_code}
Accept: application/json
```

**Response (200):**
```json
{
  "profile": {
    "name": "Cô Ngọc",
    "avatar": "https://...",
    "joined_at": "2022-09-01"
  },
  "career_stats": {
    "total_classes": 100,
    "total_hours": 250,
    "total_students": 50,
    "rating_rate": 90
  },
  "overview": {
    "avg_rating": 4.8,
    "satisfaction_rate": 96.5,
    "sessions_count": 28,
    "active_classes": 12
  }
}
```

---

### 6.2 API Progress Chart Data

**Endpoint:** `GET /api/teacher/achievements/progress`

**Query params:**
```
period=month    # week | month | year
```

**Response (200):**
```json
{
  "chart_data": [
    { "label": "Tháng 1", "rating": 4.5, "students": 45, "sessions": 24 },
    { "label": "Tháng 2", "rating": 4.7, "students": 48, "sessions": 26 }
  ]
}
```

---

### 6.3 API Student Reviews

**Endpoint:** `GET /api/teacher/achievements/reviews`

**Response (200):**
```json
{
  "data": [
    {
      "student_name": "Minh Anh",
      "avatar": "https://...",
      "rating": 5,
      "content": "Cô dạy rất nhiệt tình...",
      "created_at": "2025-05-10"
    }
  ]
}
```

---

## 7. State Management

```typescript
achievementStore.setProfile(profile)
achievementStore.setCareerStats(stats)
achievementStore.setOverview(overview)
achievementStore.setChartData(data)
achievementStore.setReviews(reviews)
achievementStore.setChartPeriod('month' | 'week' | 'year')
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị đủ stats + profile |
| 2 | Line chart | Render đúng dữ liệu tiến trình |
| 3 | Switch period chart | Chart cập nhật theo tuần/tháng/năm |
| 4 | Danh sách review | Hiển thị đánh giá HV |
| 5 | Achievement cards | Hiển thị top tháng/tuần |
| 6 | Bảng thống kê lớp | Hiển thị đúng số liệu lớp học |
| 7 | GV mới chưa có dữ liệu | Hiển thị empty state phù hợp |
