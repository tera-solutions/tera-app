# [087] - Student - Danh sách lớp học

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [087] |
| Module | Student |
| Screen | Danh sách lớp học |
| Sprint | Sprint 5 |
| Label | Sprint5, Student, Frontend, API |
| Mockup Desktop | screen/desktop/lop hoc.png |
| Mockup Mobile | screen/mobile/lop hoc.png |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Hiển thị danh sách các lớp học/khóa học học viên đang tham gia, tiến độ từng lớp, lịch học trong tháng và thống kê học tập tổng quan.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/classes`
- **Layout:** StudentLayout
- **Breadcrumb:** Bài học

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Danh sách lớp học                                    │
│           │ [🔍 Tìm kiếm lớp học...]        [+ Tạo lớp học mới]  │
│           │ [Tất cả][Hôm nay][Sắp tới][Đã hoàn thành]            │
│           ├─────────────────────────────────┬──────────────────── │
│           │  Lớp học│GV│Ngày│Giờ│Tiến độ│TT│  Lịch học của bạn   │
│           │ ┌────────────────────────────┐  │ [Calendar tháng 5]  │
│           │ │Animals Adventure│Cô Hana│25%│  │                     │
│           │ │ABC Phonics      │Cô Hana│40%│  │ Thống kê học tập    │
│           │ │My Family        │Cô Mai │5% │  │ 20/20 bài hoàn thành│
│           │ │Colors & Shapes  │Cô Mai │60%│  │ 12 bài tập đã làm   │
│           │ │Daily Conversation│Thầy Nam│100%│ 6h30m thời gian học │
│           │ └────────────────────────────┘  │ 320 XP kinh nghiệm  │
│           │                                 │ [Hana AI luôn ở đây]│
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 SearchAndFilterBar

- Ô tìm kiếm theo tên lớp
- Tab lọc: Tất cả / Hôm nay / Sắp tới / Đã hoàn thành
- Nút `+ Tạo lớp học mới` (dành cho tự học/ghi danh thêm)

### 5.2 ClassTable

**Columns:** Ảnh + tên lớp, Lesson x/y (kèm progress bar nhỏ), Giáo viên (avatar + tên), Ngày học, Thời gian, Tiến độ (donut % nhỏ), Trạng thái (Hôm nay / Đang học / Sắp tới / Đã hoàn thành), mũi tên xem chi tiết.

**Click dòng** → Navigate `/class/{id}`.

**Badge trạng thái màu:** Hôm nay (xanh lá), Đang học (đỏ/cam), Sắp tới (cam nhạt), Đã hoàn thành (xanh lá đậm, thanh full).

### 5.3 MiniCalendar (Panel phải trên)

- Lịch tháng, điều hướng tháng trước/sau
- Highlight ngày hiện tại và ngày có lịch học

### 5.4 StudyStatsPanel (Panel phải giữa)

- Bài học đã hoàn thành (x/y)
- Bài tập đã làm
- Thời gian học
- Điểm kinh nghiệm (XP)

### 5.5 HanaAiPromptCard (Panel phải dưới)

- Nhắc nhở/gợi ý từ AI, nút "Trò chuyện ngay"

---

## 6. API Integration

### 6.1 API Class List

**Endpoint:** `GET /api/student/classes`

**Query params:** `filter=all, search=, page=1, limit=20`

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Animals Adventure",
      "thumbnail": "https://...",
      "lesson_progress": "5/20",
      "teacher": { "name": "Cô Hana", "avatar": "https://..." },
      "date": "2026-05-27",
      "time": "16:00-16:45",
      "completion_percent": 25,
      "status": "today"
    }
  ]
}
```

---

### 6.2 API Calendar

**Endpoint:** `GET /api/student/schedule?month=2026-07`

**Response (200):**
```json
{ "days_with_class": ["2026-07-06", "2026-07-08", "2026-07-13"] }
```

---

### 6.3 API Study Stats

**Endpoint:** `GET /api/student/stats/summary`

**Response (200):**
```json
{ "lessons_completed": 20, "lessons_total": 20, "exercises_done": 12, "study_time_minutes": 390, "xp": 320 }
```

---

## 7. State Management

```typescript
classListStore.setList(data)
classListStore.setFilter(tab)
classListStore.setSearch(keyword)
classListStore.setCalendarDays(days)
classListStore.setStats(stats)
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị danh sách lớp + lịch + stats |
| 2 | Tìm kiếm tên lớp | Lọc đúng kết quả |
| 3 | Chuyển tab "Đã hoàn thành" | Chỉ hiện lớp progress 100% |
| 4 | Click dòng lớp học | Navigate `/class/{id}` |
| 5 | Chuyển tháng lịch | Cập nhật ngày highlight |
| 6 | Không có lớp học nào | Hiển thị empty state gợi ý tham gia lớp |
