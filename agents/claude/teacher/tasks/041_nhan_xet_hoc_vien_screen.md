# [041] - Teacher - Nhận xét học viên

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [041] |
| Module | Teacher |
| Screen | Nhận xét học viên |
| Sprint | Sprint 3 |
| Label | Sprint3, Teacher, Frontend |
| Trello | https://trello.com/c/kczJCsZE |
| Mockup | https://drive.google.com/file/d/17hZN0UzpXaEB7zQBMBBWdMQvCAqdsbXI/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Cho phép giáo viên viết, xem và quản lý nhận xét & đánh giá học viên. Hiển thị tổng quan đánh giá lớp, chi tiết từng học viên theo kỹ năng và lịch sử nhận xét.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập; giáo viên có lớp được phân công
- **Route:** `/feedback` hoặc `/classroom/{id}/feedback`
- **Layout:** BasicLayout
- **Breadcrumb:** Lớp học > Nhận xét & Đánh giá

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Nhận xét & Đánh giá                                  │
│           │                                                      │
│           │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│           │ │  18  │ │  86% │ │ 124  │ │ 4.8★ │ │  98% │       │
│           │ │  HV  │ │Đánh  │ │Nhận  │ │Đánh  │ │Hài   │       │
│           │ │      │ │giá   │ │xét   │ │giá   │ │lòng  │       │
│           │ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘       │
│           │                                                      │
│           ├─────────────────────────┬────────────────────────────┤
│           │  Danh sách học viên     │  Chi tiết: Minh Anh        │
│           │ ┌───────────────────┐   │                            │
│           │ │Tên │ĐTB│Nhận xét │   │  Kỹ năng:                  │
│           │ │    │   │gần nhất │   │  Listening ██████ 62%      │
│           │ ├───────────────────┤   │  Speaking  █████  55%      │
│           │ │Minh│8.5│Tiến bộ  │   │  Reading   ███████ 70%     │
│           │ │Anh │   │tốt...   │   │  Writing   ████   48%      │
│           │ │Lan │7.2│Cần cố   │   │                            │
│           │ │    │   │gắng...  │   │  Radar chart kỹ năng        │
│           │ └───────────────────┘   │                            │
│           │                         │  Nhận xét mới nhất:        │
│           │  Tiêu chí đánh giá      │  "Cần cải thiện Speaking"  │
│           │  [Danh sách criteria]   │  [Nút: + Thêm nhận xét]   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 StatHeader (×5)

| Stat | Mô tả |
|------|-------|
| Số HV | Tổng học viên trong lớp |
| % đánh giá | Tỷ lệ đã nhận đánh giá |
| Tổng nhận xét | Số lượng nhận xét đã viết |
| Sao TB | Rating trung bình (4.8★) |
| % hài lòng | Tỷ lệ phản hồi tích cực |

---

### 5.2 StudentFeedbackTable (Panel trái)

**Columns:**
- Tên học viên (avatar + tên)
- Điểm TB
- Nhận xét gần nhất (preview text)
- Ngày cập nhật
- Xếp loại (Xuất sắc / Giỏi / Khá / TB)

**Hành vi:**
- Click row → Load chi tiết học viên vào panel phải
- Học viên đang chọn được highlight

---

### 5.3 StudentDetailPanel (Panel phải)

**Sections:**

**Kỹ năng (Skill bars):**
- Listening, Speaking, Reading, Writing dưới dạng horizontal bar %

**Đánh giá kỹ năng (Radar chart):** Spider/radar chart 4 kỹ năng

**Nhận xét mới nhất:** Hiển thị nội dung nhận xét gần nhất

**Hành động:**
- `+ Thêm nhận xét` → Mở modal FeedbackForm
- `Xem tất cả` → Navigate `/student/{id}` tab nhận xét

---

### 5.4 FeedbackForm (Modal)

**Fields:**

| Field | Label | Type | Required |
|-------|-------|------|----------|
| rating | Đánh giá tổng thể | star (1–5) | ✓ |
| listening_score | Nghe | number (0–10) | — |
| speaking_score | Nói | number (0–10) | — |
| reading_score | Đọc | number (0–10) | — |
| writing_score | Viết | number (0–10) | — |
| content | Nội dung nhận xét | textarea | ✓ |
| period | Kỳ đánh giá | select (tháng/quý) | — |

---

### 5.5 EvaluationCriteria

Danh sách tiêu chí đánh giá per học viên, hiển thị dưới bảng danh sách.

---

## 6. API Integration

### 6.1 API Feedback List

**Endpoint:** `GET /api/teacher/feedbacks`

**Query params:**
```
class_id=10
page=1
limit=20
```

**Headers:**
```
Authorization: Bearer {access_token}
Device-code: {device_code}
Accept: application/json
```

**Response (200):**
```json
{
  "summary": {
    "total_students": 18,
    "evaluated_rate": 86,
    "total_comments": 124,
    "avg_rating": 4.8,
    "satisfaction_rate": 98
  },
  "data": [
    {
      "student_id": 1,
      "student_name": "Minh Anh",
      "avatar": "https://...",
      "avg_score": 8.5,
      "latest_comment": "Tiến bộ tốt...",
      "updated_at": "2025-05-15",
      "rank": "Giỏi",
      "skills": {
        "listening": 62,
        "speaking": 55,
        "reading": 70,
        "writing": 48
      }
    }
  ]
}
```

---

### 6.2 API Create Feedback

**Endpoint:** `POST /api/teacher/feedbacks`

**Request body:**
```json
{
  "student_id": 1,
  "class_id": 10,
  "rating": 4,
  "content": "Học viên cần cải thiện Speaking...",
  "listening_score": 6.2,
  "speaking_score": 5.5,
  "reading_score": 7.0,
  "writing_score": 4.8,
  "period": "2025-05"
}
```

**Response (201):**
```json
{
  "id": 50,
  "student_id": 1,
  "content": "Học viên cần cải thiện Speaking...",
  "created_at": "2025-05-18T10:00:00Z"
}
```

---

### 6.3 API Update Feedback

**Endpoint:** `PUT /api/teacher/feedbacks/{id}`

---

## 7. State Management

```typescript
feedbackStore.setSummary(summary)
feedbackStore.setStudentList(data)
feedbackStore.setSelectedStudent(student)
feedbackStore.setFormOpen(bool)
feedbackStore.setEditingFeedback(feedback | null)
```

---

## 8. Validation

| Field | Rule | Thông báo |
|-------|------|-----------|
| content | required, min 10 ký tự | "Vui lòng nhập nội dung nhận xét" |
| rating | required, 1–5 | "Vui lòng chọn đánh giá" |
| skill scores | 0–10 | "Điểm không hợp lệ" |

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị danh sách HV + summary stats |
| 2 | Click học viên trong bảng | Load chi tiết vào panel phải |
| 3 | Click "+ Thêm nhận xét" | Mở FeedbackForm modal |
| 4 | Submit nhận xét hợp lệ | Lưu thành công, đóng modal |
| 5 | Submit thiếu nội dung | Hiển thị lỗi validation |
| 6 | Radar chart | Render đúng 4 trục kỹ năng |
| 7 | Filter theo lớp | Chỉ hiện HV của lớp đó |
| 8 | Xem tất cả nhận xét | Navigate sang chi tiết HV |
