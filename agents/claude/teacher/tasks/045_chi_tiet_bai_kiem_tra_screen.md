# [045] - Teacher - Chi tiết bài kiểm tra

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [045] |
| Module | Teacher |
| Screen | Chi tiết bài kiểm tra |
| Sprint | Sprint 3 |
| Label | Sprint3, Teacher, Frontend |
| Trello | https://trello.com/c/yOPbT6lY |
| Mockup | https://drive.google.com/file/d/1nJm3bNdYOTfDLMoRjczrcfJhSMXCFxcQ/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Hiển thị chi tiết toàn diện về một bài kiểm tra: thông tin cơ bản, thống kê kết quả, phân bố điểm và danh sách kết quả từng học viên.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập; giáo viên có quyền xem bài kiểm tra này
- **Route:** `/exam/{id}`
- **Layout:** BasicLayout
- **Breadcrumb:** Bài kiểm tra > Chi tiết bài kiểm tra

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Bài kiểm tra > Chi tiết                              │
│           │                                                      │
│           ├─────────────────────────┬────────────────────────────┤
│           │  [Ảnh bìa bài KT]       │  Danh sách loại bài KT    │
│           │  AT-A2-0000             │  ┌────────────────────┐   │
│           │  Tiếng Anh A2           │  │ ○ Kiểm tra đầu vào │   │
│           │  Lớp: Starters 2A       │  │ ● KT giữa kỳ       │   │
│           │  GV: Cô Ngọc            │  │ ○ KT cuối kỳ       │   │
│           │                         │  └────────────────────┘   │
│           │  ┌──────┐┌──────┐┌──────┐│                          │
│           │  │  18  ││  16  ││ 7.63 ││  Hoạt động gần đây      │
│           │  │  HV  ││ ngày ││ ĐTB  ││  ─────────────────────  │
│           │  └──────┘└──────┘└──────┘│  ✓ Nhập điểm - An       │
│           │  ┌──────┐┌──────┐┌──────┐│  ✓ Nhập điểm - Lan      │
│           │  │ 9.8  ││83.3% ││ 3.2% ││  ✓ Tạo bài KT           │
│           │  │ Cao  ││  Đạt ││ Rớt  ││                          │
│           │  └──────┘└──────┘└──────┘│                          │
│           │                          │                          │
│           │  Phân bố điểm:           │                          │
│           │  [Donut chart]           │                          │
│           │                          │                          │
│           │  Kết quả học viên:       │                          │
│           │  ┌──────────────────────┐│                          │
│           │  │ Tên │ Điểm │ Kết quả ││                          │
│           │  └──────────────────────┘│                          │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 ExamCoverCard (Panel trái - trên)

**Hiển thị:**
- Ảnh bìa bài kiểm tra
- Mã bài kiểm tra (AT-A2-0000)
- Tên khóa học/cấp độ (Tiếng Anh A2)
- Tên lớp
- Tên giáo viên

---

### 5.2 ExamStatGrid (×6 cards)

| Card | Giá trị |
|------|---------|
| Số HV | Tổng số học viên tham gia |
| Ngày | Số ngày từ khi tạo bài KT |
| Điểm TB | Điểm trung bình (7.63) |
| Điểm cao nhất | Điểm cao nhất (9.8) |
| Tỷ lệ đạt | % HV đạt (83.3%) |
| Tỷ lệ rớt | % HV không đạt (3.2%) |

---

### 5.3 ScoreDistributionChart

- Donut chart phân bố điểm theo dải (0–4, 5–6, 7–8, 9–10)
- Chú thích màu cho từng dải điểm

---

### 5.4 StudentResultTable

**Columns:**
- STT
- Tên học viên (avatar + tên)
- Điểm số
- Kết quả (Đạt / Không đạt)
- Hành động: Xem chi tiết

**Features:**
- Tìm kiếm
- Sắp xếp theo điểm
- Lọc theo kết quả (Đạt / Rớt)

---

### 5.5 ExamTypeSidebar (Panel phải - trên)

Danh sách các loại bài kiểm tra liên quan:
- Kiểm tra đầu vào
- Kiểm tra giữa kỳ (đang xem — active)
- Kiểm tra cuối kỳ

**Click** → Navigate sang chi tiết bài KT tương ứng

---

### 5.6 ActivityTimeline (Panel phải - dưới)

- Timeline các hoạt động gần đây liên quan bài KT
- Hiển thị: icon + mô tả + thời gian

---

## 6. API Integration

### 6.1 API Exam Detail

**Endpoint:** `GET /api/teacher/exams/{id}`

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
  "code": "AT-A2-0000",
  "title": "Kiểm tra giữa kỳ - Unit 5",
  "class_id": 10,
  "class_name": "Starters 2A",
  "teacher_name": "Cô Ngọc",
  "cover_image": "https://...",
  "created_days_ago": 16,
  "stats": {
    "total_students": 18,
    "avg_score": 7.63,
    "highest_score": 9.8,
    "pass_rate": 83.3,
    "fail_rate": 3.2
  },
  "score_distribution": {
    "0_4": 1,
    "5_6": 2,
    "7_8": 8,
    "9_10": 7
  }
}
```

---

### 6.2 API Student Results

**Endpoint:** `GET /api/teacher/exams/{id}/results`

**Query params:**
```
search=
result=all    # all | pass | fail
sort=score    # score | name
order=desc
page=1
limit=20
```

**Response (200):**
```json
{
  "data": [
    {
      "student_id": 1,
      "name": "Nguyễn Minh An",
      "avatar": "https://...",
      "score": 8.5,
      "result": "pass"
    }
  ],
  "meta": { "total": 18 }
}
```

---

### 6.3 API Exam Types (related)

**Endpoint:** `GET /api/teacher/exams/{id}/related-types`

**Response (200):**
```json
{
  "types": [
    { "id": 1, "label": "Kiểm tra đầu vào", "active": false },
    { "id": 2, "label": "Kiểm tra giữa kỳ", "active": true },
    { "id": 3, "label": "Kiểm tra cuối kỳ", "active": false }
  ]
}
```

---

### 6.4 API Activity Log

**Endpoint:** `GET /api/teacher/exams/{id}/activities`

**Response (200):**
```json
{
  "activities": [
    { "action": "grade", "student_name": "Minh An", "at": "2025-05-18T10:00:00Z" }
  ]
}
```

---

## 7. State Management

```typescript
examDetailStore.setExam(exam)
examDetailStore.setResults(results)
examDetailStore.setRelatedTypes(types)
examDetailStore.setActivities(activities)
examDetailStore.setFilter({ search, result, sort })
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị đủ thông tin + stats |
| 2 | Donut chart | Render phân bố điểm đúng |
| 3 | Click loại KT khác | Navigate sang bài KT đó |
| 4 | Lọc "Không đạt" | Chỉ hiện HV rớt |
| 5 | Sắp xếp theo điểm | Sort đúng |
| 6 | Tìm kiếm HV | Filter theo tên |
| 7 | Click "Xem chi tiết" HV | Navigate chi tiết bài làm |
| 8 | Timeline activities | Hiển thị đúng thứ tự thời gian |
