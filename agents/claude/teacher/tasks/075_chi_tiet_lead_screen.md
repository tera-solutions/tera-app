# [075] - Teacher - Chi tiết Lead

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [075] |
| Module | Teacher |
| Screen | Chi tiết Lead |
| Sprint | Sprint 5 |
| Label | Sprint5, Teacher, Frontend, API |
| Mockup | Không có |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Xem và cập nhật thông tin chi tiết một lead: lịch sử chăm sóc (ghi chú, cuộc gọi, hẹn tư vấn) và thao tác chuyển đổi thành học viên.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/leads/{id}`
- **Layout:** BasicLayout
- **Breadcrumb:** Lead / Tiềm năng > Chi tiết lead

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Lead / Tiềm năng > Nguyễn Thị Lan     [Sửa] [Chuyển đổi]│
│           │                                                      │
│           ├──────────────────────────────┬───────────────────────┤
│           │  Thông tin lead              │  Lịch sử chăm sóc     │
│           │  ─────────────────────────── │  ─────────────────── │
│           │  Họ tên: Nguyễn Thị Lan       │  [+ Thêm ghi chú]     │
│           │  SĐT: 0901234567             │                       │
│           │  Nguồn: Facebook              │  ● 20/07 - Gọi tư vấn │
│           │  Trạng thái: [Đang CS ▼]     │    "Quan tâm khóa..." │
│           │  Người phụ trách: Trần Văn A  │  ● 18/07 - Tạo lead   │
│           │  Ngày tạo: 15/07/2026         │    Nguồn: Facebook Ads│
│           │  Quan tâm: Khóa Starters      │                       │
│           │                              │  Hẹn tư vấn tiếp theo: │
│           │                              │  22/07/2026 - 14:00   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 LeadInfoCard (Panel trái)

- Thông tin cơ bản: họ tên, SĐT, nguồn, người phụ trách, ngày tạo, khóa học quan tâm
- Dropdown đổi trạng thái ngay tại trang (Mới / Đang chăm sóc / Đã hẹn tư vấn / Đã ghi danh / Không tiềm năng)
- Nút `Sửa` mở form chỉnh sửa thông tin
- Nút `Chuyển đổi` → mở ChuyểnĐổiModal

### 5.2 CareHistoryTimeline (Panel phải)

- Danh sách log chăm sóc theo thời gian: loại (ghi chú / cuộc gọi / hẹn tư vấn / đổi trạng thái), nội dung, người thực hiện, thời gian
- Nút `+ Thêm ghi chú` mở form nhập nhanh (loại tương tác + nội dung + ngày hẹn tiếp theo nếu có)

### 5.3 ConvertToStudentModal

- Xác nhận thông tin trước khi tạo học viên: họ tên, SĐT, khóa học dự kiến, lớp dự kiến
- Nút `Xác nhận chuyển đổi` → gọi API convert, sau đó điều hướng sang `/enrollment/new` với dữ liệu pre-fill

---

## 6. API Integration

### 6.1 API Lead Detail

**Endpoint:** `GET /api/teacher/leads/{id}`

**Response (200):**
```json
{
  "id": 1,
  "name": "Nguyễn Thị Lan",
  "phone": "0901234567",
  "source": "facebook",
  "status": "caring",
  "assignee": { "id": 5, "name": "Trần Văn A" },
  "interested_course": "Starters",
  "created_at": "2026-07-15",
  "next_appointment": "2026-07-22T14:00:00Z"
}
```

---

### 6.2 API Care History

**Endpoint:** `GET /api/teacher/leads/{id}/histories`

**Response (200):**
```json
{
  "data": [
    {
      "id": 10,
      "type": "call",
      "content": "Gọi tư vấn, quan tâm khóa Starters",
      "created_by": "Trần Văn A",
      "created_at": "2026-07-20T09:00:00Z"
    }
  ]
}
```

---

### 6.3 API Add Care Log

**Endpoint:** `POST /api/teacher/leads/{id}/histories`

**Request body:**
```json
{ "type": "note", "content": "Đã gửi bảng giá qua Zalo", "next_appointment": "2026-07-22T14:00:00Z" }
```

**Response (201):** `{ "id": 11, "created_at": "2026-07-20T10:00:00Z" }`

---

### 6.4 API Update Lead Status

**Endpoint:** `PATCH /api/teacher/leads/{id}`

**Request body:** `{ "status": "consulting" }`

**Response (200):** `{ "id": 1, "status": "consulting" }`

---

### 6.5 API Convert Lead

**Endpoint:** `POST /api/teacher/leads/{id}/convert`

**Response (200):** `{ "lead_id": 1, "student_id": 205 }`

---

## 7. State Management

```typescript
leadDetailStore.setLead(lead)
leadDetailStore.setHistories(histories)
leadDetailStore.addHistory(entry)
leadDetailStore.updateStatus(status)
leadDetailStore.openConvertModal()
```

---

## 8. Validation

| Field | Rule | Thông báo |
|-------|------|-----------|
| content (ghi chú) | required | "Vui lòng nhập nội dung" |
| status | thuộc danh sách trạng thái hợp lệ | "Trạng thái không hợp lệ" |

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị thông tin + lịch sử chăm sóc |
| 2 | Thêm ghi chú | Xuất hiện đầu timeline |
| 3 | Đổi trạng thái | Cập nhật badge, ghi log tự động |
| 4 | Chuyển đổi thành học viên | Điều hướng sang ghi danh, pre-fill dữ liệu |
| 5 | Lead không tồn tại | Hiển thị 404 |
| 6 | Sửa thông tin lead | Cập nhật thành công, toast xác nhận |
