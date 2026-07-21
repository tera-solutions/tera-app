# [104] - Student - Hồ sơ

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [104] |
| Module | Student |
| Screen | Hồ sơ |
| Sprint | Sprint 5 |
| Label | Sprint5, Student, Frontend, API |
| Mockup Desktop | screen/desktop/ho so.png |
| Mockup Mobile | screen/mobile/ho so.png |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Trang hồ sơ cá nhân học viên: thông tin cấp độ/XP, thống kê học tập theo kỹ năng, huy hiệu đạt được, bạn đồng hành hiện tại, hoạt động gần đây và lối tắt tới các chức năng chính.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/profile`
- **Layout:** StudentLayout
- **Breadcrumb:** Hồ sơ

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Hồ sơ của Minh ⭐              [🔔3][⚙][Minh▼]        │
│           ├──────────────────────────────┬───────────────────────┤
│           │ [Avatar✏]Minh  Lv8 Explorer   │ Bạn đồng hành AI      │
│           │ ████░ 1250/1800 XP  [🔥12]    │ Teacher Hana 😊       │
│           │                               │ [Đổi bạn đồng hành]   │
│           │ [48 Bài học][1250 XP][18 Huy  ├───────────────────────┤
│           │  hiệu][12 Ngày streak]        │ Huy hiệu của Minh     │
│           │ Tiến độ học tập                │ [6 icon huy hiệu]     │
│           │ [Từ vựng80%][Nói65%][Nghe75%] │ [Xem tất cả]          │
│           │ [Đọc70%]                      ├───────────────────────┤
│           │ Thành tích hôm nay             │ [Lớp học][Bài tập][Ôn│
│           │ [+120XP][12streak][3sao]       │  tập][Phần thưởng][Báo│
│           │ Hoạt động gần đây (timeline)   │  cáo][Khu vực PH🔒]   │
│           │                               │ Thông tin nhanh        │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 ProfileHeaderCard

- Avatar (nút sửa ảnh), tên, cấp độ + danh hiệu (Level 8 · Explorer)
- Thanh XP hiện tại/mốc tiếp theo
- Badge ngày streak

### 5.2 CompanionCard (Panel phải trên)

- Avatar + tên bạn đồng hành hiện tại, trạng thái cảm xúc
- Nút `Đổi bạn đồng hành` → Navigate `/companion`

### 5.3 StatSummaryRow (×4)

- Bài học đã hoàn thành, Tổng XP, Huy hiệu đã đạt, Ngày học liên tiếp

### 5.4 SkillProgressBars

- 4 thanh kỹ năng: Từ vựng, Nói, Nghe, Đọc — % + màu riêng từng kỹ năng

### 5.5 TodayAchievementCard

- XP hôm nay, streak, số sao đạt được

### 5.6 RecentActivityList

- Log hoạt động: icon loại hoạt động, mô tả, thời gian, XP nhận được

### 5.7 BadgeGrid (Panel phải)

- Lưới huy hiệu đã đạt (icon tròn màu), link "Xem tất cả"

### 5.8 QuickActionGrid (Panel phải)

- 6 ô: Lớp học của tôi, Bài tập của tôi, Ôn tập, Phần thưởng, Báo cáo học tập, Khu vực phụ huynh (khóa 🔒 nếu cần xác thực PH)

### 5.9 QuickInfoList (Panel phải dưới)

- Ngày tham gia, Tổng thời gian học, Bài học đã hoàn thành, Cấp độ hiện tại

---

## 6. API Integration

### 6.1 API Profile

**Endpoint:** `GET /api/student/profile`

**Response (200):**
```json
{
  "name": "Minh",
  "avatar": "https://...",
  "level": 8,
  "title": "Explorer",
  "xp_current": 1250,
  "xp_next_level": 1800,
  "streak_days": 12,
  "stats": { "lessons_completed": 48, "total_xp": 1250, "badges": 18, "streak_days": 12 },
  "skill_progress": { "vocabulary": 80, "speaking": 65, "listening": 75, "reading": 70 },
  "companion": { "id": 1, "name": "Teacher Hana", "mood": "happy", "avatar": "https://..." },
  "joined_at": "2024-06-15",
  "total_study_time_minutes": 1470
}
```

---

### 6.2 API Badges

**Endpoint:** `GET /api/student/profile/badges`

**Response (200):**
```json
{ "data": [ { "id": 1, "name": "Bài học đầu tiên", "icon": "https://...", "earned_at": "2024-06-16" } ] }
```

---

### 6.3 API Recent Activities

**Endpoint:** `GET /api/student/profile/activities`

**Response (200):**
```json
{ "data": [ { "action": "lesson_completed", "description": "Hoàn thành bài học: Farm Animals", "xp": 50, "created_at": "2026-07-21T10:30:00Z" } ] }
```

---

### 6.4 API Update Avatar

**Endpoint:** `POST /api/student/profile/avatar` (multipart/form-data)

**Response (200):** `{ "avatar": "https://..." }`

---

## 7. State Management

```typescript
profileStore.setProfile(profile)
profileStore.setBadges(badges)
profileStore.setActivities(activities)
profileStore.updateAvatar(file)
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị đầy đủ thông tin hồ sơ |
| 2 | Đổi avatar | Ảnh cập nhật, lưu lên server |
| 3 | Click "Đổi bạn đồng hành" | Navigate `/companion` |
| 4 | Click ô "Khu vực phụ huynh" (chưa xác thực) | Yêu cầu xác thực PIN/mật khẩu phụ huynh |
| 5 | Xem tất cả huy hiệu | Navigate/mở đầy đủ danh sách huy hiệu |
| 6 | Thanh kỹ năng | Hiển thị đúng % theo dữ liệu |
| 7 | Hoạt động gần đây | Sắp xếp đúng theo thời gian giảm dần |
