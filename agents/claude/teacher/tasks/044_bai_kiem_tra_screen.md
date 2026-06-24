# [044] - Teacher - Bài kiểm tra

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [044] |
| Module | Teacher |
| Screen | Bài kiểm tra |
| Sprint | Sprint 3 |
| Label | Sprint3, Teacher, Frontend |
| Trello | https://trello.com/c/Yh0XAVOl |
| Mockup | https://drive.google.com/file/d/1qcXVStB8OiZVypYoykqdowDr2q3MGLgI/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Quản lý bài kiểm tra trong một lớp học. Hiển thị danh sách bài kiểm tra, điểm số học viên, thống kê chi tiết và biểu đồ phân tích kết quả.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập; giáo viên có lớp được phân công
- **Route:** `/exam` hoặc `/classroom/{id}/exam`
- **Layout:** BasicLayout
- **Breadcrumb:** Lớp học > Bài kiểm tra

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Kiểm tra giữa kỳ - Unit 5  [Đã nhập điểm]           │
│           │                                                      │
│           │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│           │ │ 9.8  │ │ 4.2★ │ │  80% │ │83.3% │ │  18★ │       │
│           │ │ ĐTB  │ │ Xếp  │ │  Đạt │ │      │ │      │       │
│           │ │      │ │ loại │ │      │ │      │ │      │       │
│           │ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘       │
│           │  [2 chưa nhập điểm]                                  │
│           │                                                      │
│           │ [Đếm theo HV][Thống kê chi tiết][Biểu đồ][Chi tiết] │
│           │                                                      │
│           ├─────────────────────────────┬────────────────────────┤
│           │  Bảng điểm học viên         │  Thông tin bài KT      │
│           │ ┌─────────────────────────┐ │  Tên: KT giữa kỳ U5   │
│           │ │Tên│T1│T2│T3│T4│TB│Kết  │ │  Lớp: Starters 2A     │
│           │ ├─────────────────────────┤ │  Ngày: 20/05/2025     │
│           │ │An │8 │9 │7 │10│8.5│Đạt │ │                       │
│           │ │Lan│7 │8 │6 │ 9│7.5│Đạt │ │  Hoạt động gần đây    │
│           │ │...|  │  │  │  │   │    │ │  [timeline]           │
│           │ └─────────────────────────┘ │                       │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 ExamStatRow (×5)

| Card | Giá trị |
|------|---------|
| Điểm TB | Điểm trung bình cả lớp |
| Xếp loại | Rating sao (4.2★) |
| Tỷ lệ đạt | % học viên đạt yêu cầu |
| Tỷ lệ % | Phần trăm hoàn thành |
| Tổng HV | Số học viên tham gia |

**Alert:** Badge "X chưa nhập điểm" nếu còn HV chưa có điểm

---

### 5.2 ExamTabNav

**Tabs:**
- Đếm theo HV
- Thống kê chi tiết
- Biểu đồ
- Chi tiết HV

---

### 5.3 Tab: Đếm theo HV (Bảng điểm)

**Columns:**
- Tên học viên
- T1, T2, T3, T4 (điểm từng phần/lần thi)
- Điểm TB
- Kết quả (Đạt / Không đạt)

**Features:**
- Tìm kiếm theo tên HV
- Sắp xếp theo điểm
- Export Excel

---

### 5.4 Tab: Thống kê chi tiết

- Phân tích từng phần thi (T1–T4)
- Min, Max, TB, Median
- Tỷ lệ đạt từng phần

---

### 5.5 Tab: Biểu đồ

- Histogram phân bố điểm
- Pie chart tỷ lệ đạt/không đạt
- Line chart tiến trình so với các kỳ trước

---

### 5.6 Tab: Chi tiết HV

- Bảng chi tiết điểm từng câu hỏi của từng HV
- Click HV → xem chi tiết bài làm

---

### 5.7 ExamSidebar (Panel phải)

**Sections:**
- Thông tin bài kiểm tra (tên, lớp, ngày, GV)
- Hoạt động gần đây (timeline nhập điểm)

---

## 6. API Integration

### 6.1 API Exam List / Detail

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
  "title": "Kiểm tra giữa kỳ - Unit 5",
  "class_id": 10,
  "class_name": "Starters 2A",
  "exam_date": "2025-05-20",
  "status": "graded",
  "stats": {
    "avg_score": 9.8,
    "avg_rating": 4.2,
    "pass_rate": 80,
    "completion_rate": 83.3,
    "total_students": 18,
    "pending_grade": 2
  }
}
```

---

### 6.2 API Exam Student Scores

**Endpoint:** `GET /api/teacher/exams/{id}/scores`

**Response (200):**
```json
{
  "data": [
    {
      "student_id": 1,
      "name": "Nguyễn Minh An",
      "scores": { "t1": 8, "t2": 9, "t3": 7, "t4": 10 },
      "avg": 8.5,
      "result": "pass"
    }
  ]
}
```

---

### 6.3 API Submit Score

**Endpoint:** `POST /api/teacher/exams/{id}/scores`

**Request body:**
```json
{
  "student_id": 1,
  "scores": { "t1": 8, "t2": 9, "t3": 7, "t4": 10 }
}
```

**Response (200):**
```json
{ "success": true, "avg": 8.5 }
```

---

## 7. State Management

```typescript
examStore.setExamDetail(exam)
examStore.setScores(scores)
examStore.setActiveTab(tab)
examStore.setEditingScore(score | null)
examStore.setSubmitting(bool)
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị stats + bảng điểm |
| 2 | Badge "chưa nhập điểm" | Hiển thị số HV chưa có điểm |
| 3 | Click tab "Biểu đồ" | Render histogram phân bố |
| 4 | Nhập điểm cho HV | Lưu thành công, cập nhật TB |
| 5 | Export Excel | Download file điểm |
| 6 | Tìm kiếm HV | Filter realtime |
| 7 | Sắp xếp theo điểm | Sort asc/desc |
| 8 | Click tab "Chi tiết HV" | Hiển thị điểm từng câu |
