# [074] - Teacher - Lead / Tiềm năng

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [074] |
| Module | Teacher |
| Screen | Lead / Tiềm năng |
| Sprint | Sprint 5 |
| Label | Sprint5, Teacher, Frontend, API |
| Mockup | Không có |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Quản lý danh sách khách hàng tiềm năng (lead) chưa ghi danh: nguồn lead, trạng thái chăm sóc, người phụ trách. Hỗ trợ lọc, tìm kiếm và chuyển đổi lead thành học viên.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/leads`
- **Layout:** BasicLayout
- **Breadcrumb:** Lead / Tiềm năng

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Lead / Tiềm năng               [+ Thêm lead]         │
│           │ Quản lý khách hàng tiềm năng                         │
│           │                                                      │
│           │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │
│           │ │  86  │ │  32  │ │  20  │ │  14  │ │  20  │        │
│           │ │Tổng  │ │Mới   │ │Đang  │ │Đã    │ │Đã    │        │
│           │ │lead  │ │      │ │CS    │ │hẹn TV│ │ghi danh│      │
│           │ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘        │
│           │                                                      │
│           ├─────────────────────────────┬────────────────────────┤
│           │  Danh sách lead              │  Bộ lọc               │
│           │ [🔍 Tìm theo tên/SĐT]        │                        │
│           │ ┌───────────────────────┐   │  Nguồn: [▼]            │
│           │ │#│Tên│SĐT│Nguồn│Trạng │   │  Trạng thái: [▼]       │
│           │ │ │   │   │     │thái  │   │  Người PT: [▼]         │
│           │ ├───────────────────────┤   │  Ngày tạo: [▼]         │
│           │ │1│Lan│09xx│FB   │Mới   │   │                        │
│           │ │2│Nam│09xx│Web  │Đang CS│  │  [Áp dụng lọc]         │
│           │ │3│Hoa│09xx│G.thiệu│Hẹn TV│ │                        │
│           │ └───────────────────────┘   │                        │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 LeadStatRow (×5)

| Card | Giá trị |
|------|---------|
| Tổng lead | 86 |
| Mới | 32 |
| Đang chăm sóc | 20 |
| Đã hẹn tư vấn | 14 |
| Đã ghi danh | 20 |

### 5.2 LeadTable (Panel trái)

**Columns:** STT, Họ tên, SĐT, Nguồn (Facebook / Website / Giới thiệu / Khác), Trạng thái, Người phụ trách, Ngày tạo, Thao tác.

**Badge trạng thái:** Mới (xanh dương) / Đang chăm sóc (cam) / Đã hẹn tư vấn (tím) / Đã ghi danh (xanh lá) / Không tiềm năng (xám).

**Click dòng** → Navigate `/leads/{id}`.

**Thao tác nhanh:** Gọi điện | Ghi chú | Chuyển thành học viên.

### 5.3 LeadFilterSidebar (Panel phải)

- Dropdown Nguồn lead
- Dropdown Trạng thái
- Dropdown Người phụ trách
- Date range Ngày tạo
- Nút "Áp dụng lọc"

### 5.4 AddLeadModal

Form thêm lead nhanh: Họ tên, SĐT, Nguồn, Ghi chú, Người phụ trách.

---

## 6. API Integration

### 6.1 API Lead List

**Endpoint:** `GET /api/teacher/leads`

**Headers:**
```
Authorization: Bearer {access_token}
Device-code: {device_code}
Accept: application/json
```

**Query params:**
```
search=
source=all        # all | facebook | website | referral | other
status=all        # all | new | caring | consulting | enrolled | not_potential
assignee_id=
date_from=
date_to=
page=1
limit=20
```

**Response (200):**
```json
{
  "summary": {
    "total": 86,
    "new": 32,
    "caring": 20,
    "consulting": 14,
    "enrolled": 20
  },
  "data": [
    {
      "id": 1,
      "name": "Nguyễn Thị Lan",
      "phone": "0901234567",
      "source": "facebook",
      "status": "new",
      "assignee": { "id": 5, "name": "Trần Văn A" },
      "created_at": "2026-07-15"
    }
  ],
  "meta": { "total": 86, "per_page": 20, "current_page": 1 }
}
```

---

### 6.2 API Create Lead

**Endpoint:** `POST /api/teacher/leads`

**Request body:**
```json
{
  "name": "Nguyễn Thị Lan",
  "phone": "0901234567",
  "source": "facebook",
  "note": "Quan tâm khóa Starters",
  "assignee_id": 5
}
```

**Response (201):**
```json
{ "id": 87, "name": "Nguyễn Thị Lan", "status": "new" }
```

---

### 6.3 API Convert Lead to Student

**Endpoint:** `POST /api/teacher/leads/{id}/convert`

**Response (200):**
```json
{ "lead_id": 1, "student_id": 205, "status": "enrolled" }
```

---

## 7. State Management

```typescript
leadListStore.setSummary(summary)
leadListStore.setList(data)
leadListStore.setFilter({ search, source, status, assigneeId, dateFrom, dateTo })
leadListStore.setPage(page)
leadListStore.openAddModal()
```

---

## 8. Validation

| Field | Rule | Thông báo |
|-------|------|-----------|
| name | required | "Vui lòng nhập họ tên" |
| phone | required, đúng định dạng SĐT | "Số điện thoại không hợp lệ" |
| source | required | "Vui lòng chọn nguồn lead" |

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị danh sách + stats |
| 2 | Thêm lead mới | Xuất hiện trong danh sách, stats cập nhật |
| 3 | Lọc theo nguồn | Chỉ hiện lead đúng nguồn |
| 4 | Lọc theo trạng thái | Chỉ hiện lead đúng trạng thái |
| 5 | Tìm kiếm theo SĐT | Trả về đúng kết quả |
| 6 | Chuyển đổi thành học viên | Lead chuyển trạng thái "Đã ghi danh", tạo học viên mới |
| 7 | Click dòng lead | Navigate `/leads/{id}` |
| 8 | Phân trang | Load page tiếp theo |
