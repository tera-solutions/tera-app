# [086] - Student - Trang chủ

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [086] |
| Module | Student |
| Screen | Trang chủ |
| Sprint | Sprint 5 |
| Label | Sprint5, Student, Frontend, API |
| Mockup Desktop | screen/desktop/trang chu.png |
| Mockup Mobile | screen/mobile/trang chu.png |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Trang chủ chào mừng học viên (trẻ em), gợi ý bài học tiếp theo, lối tắt vào lớp học, tiến trình học tập trong tuần và danh sách bài học sắp tới/đề xuất.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập (tài khoản học viên)
- **Route:** `/home`
- **Layout:** StudentLayout (sidebar + topbar)
- **Breadcrumb:** Không có (trang gốc)

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo Hana] │ Avatar "Chào Minh 👋"      [🔥7][⭐320XP][VN▼][🔔][👤]│
│ [Sidebar]   ├───────────────────────────────────────────────────┤
│ Trang chủ   │  [Banner nhân vật AI] "Xin chào! Hôm nay học về    │
│ Vào lớp học │   Động vật nhé!"  [Cài đặt][Nói][Bạn đồng hành]    │
│ Bài học     ├───────────────┬───────────────┬────────────────────┤
│ Bài tập     │ Tiếp tục học  │ Vào lớp học   │ Tiến trình học tập  │
│ Ôn luyện    │ [ảnh bài 12]  │ Dành cho PH   │ [Donut 65%]         │
│ Thành tích  │ 65% [Tiếp tục]│               │ 13/20 bài, 8/12 BT  │
│ Bạn bè      ├───────────────┴───────────────┤ 6h30m               │
│ Phụ huynh   │ Bài học đề xuất cho bạn        ├─────────────────────┤
│ Cài đặt     │ [4 card bài học "Mới"]         │ Bài học sắp tới     │
│             │                                │ Bài 13 - ngày mai   │
│ [Hana AI]   │                                │ Bài 14 - Thứ 6      │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 TopBar

- Avatar học viên + lời chào "Chào {tên} 👋"
- Streak (🔥 số ngày học liên tiếp)
- XP hiện tại (⭐)
- Chọn ngôn ngữ hiển thị (VN/EN)
- Chuông thông báo, avatar tài khoản (dropdown)

### 5.2 WelcomeBanner

- Nhân vật AI đồng hành (ảnh động), lời chào theo chủ đề bài học hôm nay
- 3 nút nhanh: Cài đặt, Nói (voice), Bạn đồng hành (đổi nhân vật)

### 5.3 ContinueLearningCard

- Ảnh + tên bài học đang dở, số thứ tự bài, thanh tiến độ %, nút `Tiếp tục học` → Navigate `/lesson/{id}`

### 5.4 QuickLinkCard (×2)

- "Vào lớp học" → Navigate `/classes`
- "Dành cho phụ huynh" → Navigate `/parent-dashboard`

### 5.5 LearningProgressCard

- Donut chart % hoàn thành tuần này
- Số liệu: bài học đã hoàn thành (x/y), bài tập đã làm (x/y), thời gian học

### 5.6 UpcomingLessonList

- Danh sách 2 bài học sắp tới: tên bài, thời gian
- Link "Xem tất cả" → Navigate `/schedule`

### 5.7 SuggestedLessonGrid

- Danh sách 4 thẻ bài học đề xuất, badge "Mới", ảnh minh họa, tên bài, thời lượng
- Click thẻ → Navigate `/lesson/{id}`
- Link "Xem tất cả" → Navigate `/lessons`

### 5.8 HanaAiWidget (Sidebar dưới cùng)

- Icon trợ lý AI + nút "Trò chuyện ngay" → mở chat AI

---

## 6. API Integration

### 6.1 API Home Dashboard

**Endpoint:** `GET /api/student/home`

**Headers:**
```
Authorization: Bearer {access_token}
Device-code: {device_code}
Accept: application/json
```

**Response (200):**
```json
{
  "student": { "name": "Minh", "avatar": "https://...", "streak": 7, "xp": 320 },
  "continue_lesson": { "id": 12, "title": "Động vật trong rừng", "progress": 65, "thumbnail": "https://..." },
  "weekly_progress": { "percent": 65, "lessons_completed": 13, "lessons_total": 20, "exercises_done": 8, "exercises_total": 12, "study_time_minutes": 390 },
  "upcoming_lessons": [
    { "id": 13, "title": "Động vật biển", "date": "2026-07-22" },
    { "id": 14, "title": "Chim và côn trùng", "date": "2026-07-24T09:30:00Z" }
  ],
  "suggested_lessons": [
    { "id": 15, "title": "Sinh vật biển", "duration_minutes": 12, "is_new": true, "thumbnail": "https://..." }
  ]
}
```

---

### 6.2 API Notifications Count

**Endpoint:** `GET /api/student/notifications/unread-count`

**Response (200):** `{ "count": 3 }`

---

## 7. State Management

```typescript
homeStore.setStudent(student)
homeStore.setContinueLesson(lesson)
homeStore.setWeeklyProgress(progress)
homeStore.setUpcomingLessons(lessons)
homeStore.setSuggestedLessons(lessons)
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị đầy đủ các khối thông tin |
| 2 | Click "Tiếp tục học" | Navigate đúng sang bài học đang dở |
| 3 | Click thẻ bài học đề xuất | Navigate `/lesson/{id}` |
| 4 | Click "Vào lớp học" | Navigate `/classes` |
| 5 | Donut chart | Hiển thị đúng % theo dữ liệu API |
| 6 | Chưa có bài học đang dở | Ẩn card "Tiếp tục học", hiện gợi ý bắt đầu bài đầu tiên |
| 7 | Đổi ngôn ngữ VN/EN | Giao diện cập nhật ngôn ngữ tương ứng |
