# [076] - Teacher - Cấp chứng nhận học viên

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [076] |
| Module | Teacher |
| Screen | Cấp chứng nhận học viên |
| Sprint | Sprint 5 |
| Label | Sprint5, Teacher, Frontend, API |
| Mockup | Không có |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Cho phép giáo viên/admin cấp chứng nhận hoàn thành khóa học cho học viên: chọn mẫu chứng nhận, chọn học viên đủ điều kiện, xuất PDF và lưu lịch sử đã cấp.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/certificates`
- **Layout:** BasicLayout
- **Breadcrumb:** Học viên > Chứng nhận

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Chứng nhận học viên            [+ Cấp chứng nhận]    │
│           │                                                      │
│           │ ┌──────┐ ┌──────┐ ┌──────┐                          │
│           │ │  120 │ │  8   │ │  3   │                          │
│           │ │Đã cấp│ │Chờ   │ │Mẫu   │                          │
│           │ │      │ │duyệt │ │CN    │                          │
│           │ └──────┘ └──────┘ └──────┘                          │
│           │                                                      │
│           │ [Tất cả mẫu ▼] [Tất cả khóa ▼] [🔍 Tìm học viên]     │
│           │ ┌──────────────────────────────────────────────┐    │
│           │ │Học viên│Khóa học│Mẫu CN│Ngày cấp│Trạng thái│  │    │
│           │ ├──────────────────────────────────────────────┤    │
│           │ │Minh    │Starters│Mẫu A │20/07   │Đã cấp  │📄│    │
│           │ │Lan     │Movers  │Mẫu B │—       │Chờ duyệt│  │    │
│           │ └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 CertificateStatRow (×3)

| Card | Giá trị |
|------|---------|
| Đã cấp | 120 |
| Chờ duyệt | 8 |
| Mẫu chứng nhận | 3 |

### 5.2 CertificateTable

**Columns:** Học viên (avatar + tên), Khóa học, Mẫu chứng nhận, Ngày cấp, Trạng thái (Chờ duyệt / Đã cấp), Thao tác (Xem PDF | Tải xuống | Thu hồi).

### 5.3 IssueCertificateModal

**Bước 1:** Chọn khóa học → chỉ hiện học viên đã hoàn thành ≥ ngưỡng % (mặc định 100%, có thể tùy chỉnh).
**Bước 2:** Chọn học viên (multi-select) đủ điều kiện.
**Bước 3:** Chọn mẫu chứng nhận (preview trước khi cấp).
**Nút:** `Cấp chứng nhận` → gọi API, sinh PDF, chuyển trạng thái "Đã cấp".

### 5.4 CertificateTemplateManager

- Danh sách mẫu chứng nhận (tên, ảnh preview)
- Upload/chỉnh sửa mẫu chứng nhận (placeholder: tên HV, tên khóa, ngày cấp, chữ ký)

---

## 6. API Integration

### 6.1 API Certificate List

**Endpoint:** `GET /api/teacher/certificates`

**Query params:** `template_id=, course_id=, status=all, search=, page=1, limit=20`

**Response (200):**
```json
{
  "summary": { "issued": 120, "pending": 8, "templates": 3 },
  "data": [
    {
      "id": 1,
      "student": { "id": 40, "name": "Nguyễn Minh An" },
      "course": "Starters 2A",
      "template": "Mẫu A",
      "issued_at": "2026-07-20",
      "status": "issued",
      "pdf_url": "https://..."
    }
  ]
}
```

---

### 6.2 API Eligible Students

**Endpoint:** `GET /api/teacher/certificates/eligible-students?course_id={id}`

**Response (200):**
```json
{
  "data": [
    { "id": 40, "name": "Nguyễn Minh An", "completion_rate": 100 }
  ]
}
```

---

### 6.3 API Issue Certificates

**Endpoint:** `POST /api/teacher/certificates`

**Request body:**
```json
{ "course_id": 1, "student_ids": [40, 41], "template_id": 1 }
```

**Response (201):**
```json
{ "issued_count": 2, "certificate_ids": [201, 202] }
```

---

### 6.4 API Revoke Certificate

**Endpoint:** `DELETE /api/teacher/certificates/{id}`

**Response (200):** `{ "success": true }`

---

## 7. State Management

```typescript
certificateStore.setSummary(summary)
certificateStore.setList(data)
certificateStore.setFilter({ templateId, courseId, status, search })
certificateStore.openIssueModal()
certificateStore.setEligibleStudents(students)
```

---

## 8. Validation

| Field | Rule | Thông báo |
|-------|------|-----------|
| course_id | required | "Vui lòng chọn khóa học" |
| student_ids | min 1 | "Vui lòng chọn ít nhất 1 học viên" |
| template_id | required | "Vui lòng chọn mẫu chứng nhận" |

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị danh sách + stats |
| 2 | Chọn khóa học ở bước 1 | Chỉ hiện học viên đủ điều kiện |
| 3 | Cấp chứng nhận | Trạng thái chuyển "Đã cấp", sinh PDF |
| 4 | Tải PDF | Tải đúng file chứng nhận |
| 5 | Thu hồi chứng nhận | Xóa khỏi danh sách, cập nhật stats |
| 6 | Lọc theo mẫu/khóa học | Kết quả đúng bộ lọc |
