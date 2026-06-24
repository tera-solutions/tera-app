# [034] - Teacher - Lớp học

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [034] |
| Module | Teacher |
| Screen | Lớp học |
| Sprint | Sprint 2 |
| Label | Sprint2, Teacher, Frontend |
| Trello | https://trello.com/c/uVTfFbOa/71-034-teacher-lớp-học |
| Mockup | https://drive.google.com/file/d/1eDrt2-pgoX8hOpYnP3Nw6qe4ppmQS6zI/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Hiển thị danh sách lớp học được phân công cho giáo viên. Hỗ trợ tìm kiếm, lọc theo trường/lớp và xem nhanh thống kê từng lớp.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/classroom`
- **Layout:** BasicLayout

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────┐
│ [Sidebar] │  Lớp học                                         │
│           │  Quản lý các lớp học đang phụ trách              │
│           │                                                  │
│           │  [Tìm tên lớp, học viên...]  [Tất cả trường ▼]  │
│           │                              [Tất cả lớp ▼]     │
│           │                                                  │
│           │  ┌──────┐ ┌──────┐ ┌──────────┐ ┌──────────┐   │
│           │  │  3   │ │  72  │ │    12    │ │   92%    │   │
│           │  │ Lớp  │ │ HV   │ │  Lớp    │ │  Hoàn    │   │
│           │  │ chủ  │ │ tổng │ │  đang   │ │  thành   │   │
│           │  │ nhiệm│ │      │ │  HĐ     │ │          │   │
│           │  └──────┘ └──────┘ └──────────┘ └──────────┘   │
│           │                                                  │
│           │  Danh sách lớp học            [Xem dạng: ≡ ⊞]  │
│           │                                                  │
│           │  ┌────────────────────────────────────────────┐  │
│           │  │ [Avatar] Starters 2A      08:00-09:30      │  │
│           │  │ Beginner · Phòng 2/1     95%  [actions]   │  │
│           │  ├────────────────────────────────────────────┤  │
│           │  │ [Avatar] Movers 1B        14:00-15:30      │  │
│           │  │ Elementary · Phòng 01    80%  [actions]   │  │
│           │  ├────────────────────────────────────────────┤  │
│           │  │ [Avatar] Flyers 2A        17:00-18:30      │  │
│           │  │ Pre-intermediate         90%  [actions]   │  │
│           │  └────────────────────────────────────────────┘  │
│           │  [+ Tạo lớp học mới]                            │
└──────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 ClassroomToolbar

**Nội dung:**
- Search input: "Tìm tên lớp, học viên..."
- Dropdown "Tất cả trường"
- Dropdown "Tất cả lớp"
- Toggle view: List (≡) | Grid (⊞)

---

### 5.2 StatisticCard (×4)

| Card | Giá trị |
|------|---------|
| Lớp chủ nhiệm | Số lớp đang dạy |
| Học viên tổng | Tổng học viên các lớp |
| Lớp đang hoạt động | Số lớp status=active |
| Tỷ lệ hoàn thành | % trung bình các lớp |

---

### 5.3 ClassroomCard (List view)

**Mỗi card hiển thị:**
- Ảnh đại diện lớp (book cover)
- Tên lớp + cấp độ (badge)
- Phòng học + ca học
- Thời gian học (ngày trong tuần + giờ)
- Số học viên
- Donut chart % tiến độ hoàn thành
- Action buttons: Xem chi tiết | Điểm danh | Giáo án | Bài tập

**Click card** → Navigate `/classroom/{id}`

---

### 5.4 ClassroomGrid (Grid view)

- Layout 2–3 cột
- Mỗi ô: ảnh lớp, tên, % tiến độ

---

### 5.5 EmptyState

- Khi không có lớp nào: icon + "Bạn chưa được phân công lớp nào"

---

## 6. API Integration

### 6.1 API Classroom List

**Endpoint:** `GET /api/teacher/classrooms`

**Query params:**
```
search=Starters
school_id=
class_id=
page=1
limit=20
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 10,
      "name": "Starters 2A",
      "level": "Beginner",
      "room": "Phòng 2/1",
      "schedule_days": "Thứ 2, 4, 6",
      "start_time": "08:00",
      "end_time": "09:30",
      "student_count": 24,
      "max_students": 25,
      "completion_rate": 95,
      "status": "active",
      "cover_image": "https://..."
    }
  ],
  "summary": {
    "total_classes_managed": 3,
    "total_students": 72,
    "active_classes": 12,
    "avg_completion_rate": 92
  },
  "meta": {
    "total": 3,
    "per_page": 20,
    "current_page": 1
  }
}
```

---

## 7. State Management

```typescript
classroomStore.setList(data)
classroomStore.setSummary(summary)
classroomStore.setViewMode('list' | 'grid')
classroomStore.setFilters({ search, school_id, class_id })
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị danh sách lớp + stats |
| 2 | Tìm kiếm tên lớp | Filter realtime |
| 3 | Lọc theo trường | Chỉ hiện lớp thuộc trường đó |
| 4 | Click "Xem chi tiết" | Navigate /classroom/{id} |
| 5 | Click "Điểm danh" | Navigate /attendance với class_id |
| 6 | Toggle sang Grid view | Hiển thị dạng lưới |
| 7 | Không có lớp | Hiển thị EmptyState |
| 8 | Phân trang | Load thêm khi scroll/click |
