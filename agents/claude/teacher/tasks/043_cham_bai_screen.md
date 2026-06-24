# [043] - Teacher - Chấm bài

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [043] |
| Module | Teacher |
| Screen | Chấm bài |
| Sprint | Sprint 3 |
| Label | Sprint3, Teacher, Frontend |
| Trello | https://trello.com/c/P4Z2f8tE |
| Mockup | https://drive.google.com/file/d/18wHwTdvB9hvM1MEy3-EBLc1JntNCIFYR/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Cho phép giáo viên xem bài nộp của học viên, chấm điểm theo tiêu chí và ghi nhận xét. Hỗ trợ xem danh sách học viên đã/chưa nộp bài trong một bài tập cụ thể.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập; giáo viên sở hữu bài tập này
- **Route:** `/homework/{id}/grade`
- **Layout:** BasicLayout
- **Breadcrumb:** Giáo án > Chấm bài

---

## 4. UI Layout

```
┌────────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Giáo án > Chấm bài: Writing - Unit 5                   │
│           │                                                        │
│           ├──────────────────┬──────────────────┬──────────────────┤
│           │  Bài nộp của HV  │  Chấm điểm       │  Danh sách HV   │
│           │                  │                  │                  │
│           │ [Nội dung bài    │ Điểm: [8.5]/10   │  ┌─────────────┐ │
│           │  viết của HV]    │                  │  │ Minh Anh ✓  │ │
│           │                  │ Tiêu chí:        │  │ Lan Anh  ✓  │ │
│           │ [Hình ảnh đính   │ Coherence    /10 │  │ Tuấn     ○  │ │
│           │  kèm nếu có]     │ Grammar      /10 │  │ Hoa      ○  │ │
│           │                  │ Vocabulary   /10 │  └─────────────┘ │
│           │ [AI tóm tắt ▼]   │ Task Achievem/10 │                  │
│           │                  │                  │  Thống kê lớp   │
│           │                  │ Nhận xét:        │  Đã chấm: 10    │
│           │                  │ [textarea]       │  Chưa chấm: 8   │
│           │                  │                  │                  │
│           │                  │ [Lưu điểm]       │  Phân bố điểm:  │
│           │                  │                  │  [Bar chart]    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 SubmissionViewer (Panel trái)

**Hiển thị bài nộp:**
- Nội dung text (bài viết)
- Hình ảnh đính kèm (nếu có)
- File đính kèm
- Thời gian nộp

**AI tóm tắt button:** Gọi AI phân tích bài viết, tóm tắt điểm mạnh/yếu

---

### 5.2 GradingForm (Panel giữa)

**Điểm tổng:** Input số 0–10 (ví dụ 8.5)

**Tiêu chí chấm:**

| Tiêu chí | Điểm tối đa | Input |
|----------|-------------|-------|
| Coherence | 10 | number input |
| Grammar | 10 | number input |
| Vocabulary | 10 | number input |
| Task Achievement | 10 | number input |

**Nhận xét:** Textarea nhận xét của giáo viên

**Nút:** `Lưu điểm` → Submit form

---

### 5.3 StudentSubmissionList (Panel phải)

**Danh sách học viên:**
- Avatar + tên
- Trạng thái: ✓ Đã nộp / ○ Chưa nộp / ★ Đã chấm

**Click học viên** → Load bài nộp vào panel trái + load điểm vào panel giữa

**Thống kê lớp:**
- Số đã chấm / chưa chấm
- Bar chart phân bố điểm

---

### 5.4 AISummaryPanel

**Kích hoạt:** Click "AI tóm tắt"

**Hiển thị:**
- Điểm mạnh của bài viết
- Điểm yếu cần cải thiện
- Gợi ý điểm số

---

## 6. Luồng chấm bài

```
GV chọn bài tập → Màn hình chấm bài mở
        ↓
GV click học viên trong danh sách
        ↓
Load bài nộp (panel trái) + điểm cũ nếu có (panel giữa)
        ↓
GV nhập điểm từng tiêu chí + nhận xét
        ↓
GV click "Lưu điểm"
        ↓
[Thành công] → Cập nhật trạng thái HV trong danh sách
[Thất bại]   → Toast error
```

---

## 7. API Integration

### 7.1 API Homework Submissions

**Endpoint:** `GET /api/teacher/homeworks/{id}/submissions`

**Headers:**
```
Authorization: Bearer {access_token}
Device-code: {device_code}
Accept: application/json
```

**Response (200):**
```json
{
  "homework": {
    "id": 1,
    "title": "Writing - Unit 5",
    "class_name": "Starters 2A"
  },
  "stats": {
    "total": 24,
    "submitted": 18,
    "graded": 10
  },
  "students": [
    {
      "student_id": 1,
      "name": "Minh Anh",
      "avatar": "https://...",
      "submitted": true,
      "graded": true,
      "submitted_at": "2025-05-18T09:00:00Z",
      "score": 8.5
    }
  ]
}
```

---

### 7.2 API Student Submission Detail

**Endpoint:** `GET /api/teacher/homeworks/{id}/submissions/{student_id}`

**Response (200):**
```json
{
  "student_id": 1,
  "content": "My name is Minh Anh...",
  "attachments": [
    { "url": "https://...", "type": "image" }
  ],
  "submitted_at": "2025-05-18T09:00:00Z",
  "grade": {
    "score": 8.5,
    "coherence": 8,
    "grammar": 9,
    "vocabulary": 8,
    "task_achievement": 9,
    "comment": "Bài viết tốt..."
  }
}
```

---

### 7.3 API Grade Submission

**Endpoint:** `POST /api/teacher/homeworks/{id}/submissions/{student_id}/grade`

**Request body:**
```json
{
  "score": 8.5,
  "coherence": 8,
  "grammar": 9,
  "vocabulary": 8,
  "task_achievement": 9,
  "comment": "Bài viết tốt, cần cải thiện Vocabulary"
}
```

**Response (200):**
```json
{
  "success": true,
  "score": 8.5
}
```

---

### 7.4 API AI Summary

**Endpoint:** `POST /api/teacher/homeworks/{id}/submissions/{student_id}/ai-summary`

**Response (200):**
```json
{
  "strengths": ["Cấu trúc câu rõ ràng", "Từ vựng phong phú"],
  "weaknesses": ["Lỗi ngữ pháp ở câu phức"],
  "suggested_score": 8.5
}
```

---

## 8. State Management

```typescript
gradingStore.setHomework(homework)
gradingStore.setStudents(students)
gradingStore.setSelectedStudent(student)
gradingStore.setSubmission(submission)
gradingStore.setGradeForm(form)
gradingStore.setAiSummary(summary)
gradingStore.setSubmitting(bool)
```

---

## 9. Validation

| Field | Rule | Thông báo |
|-------|------|-----------|
| score | 0–10 | "Điểm phải từ 0 đến 10" |
| tiêu chí | 0–10 | "Điểm tiêu chí không hợp lệ" |

---

## 10. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load màn hình | Hiển thị danh sách HV + stats |
| 2 | Click HV đã nộp | Load bài nộp + điểm cũ nếu có |
| 3 | Click HV chưa nộp | Thông báo "Học viên chưa nộp bài" |
| 4 | Nhập điểm hợp lệ + Lưu | Toast thành công, cập nhật trạng thái |
| 5 | Nhập điểm > 10 | Lỗi validation |
| 6 | Click "AI tóm tắt" | Hiển thị phân tích AI |
| 7 | Phân bố điểm chart | Render đúng theo điểm đã chấm |
| 8 | Bài nộp có hình ảnh | Hiển thị hình ảnh đính kèm |
