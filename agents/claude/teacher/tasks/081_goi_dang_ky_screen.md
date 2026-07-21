# [081] - Teacher - Gói đăng ký

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [081] |
| Module | Teacher |
| Screen | Gói đăng ký |
| Sprint | Sprint 5 |
| Label | Sprint5, Teacher, Frontend, API |
| Mockup | Không có |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Hiển thị danh sách các gói đăng ký học phí do admin tạo (theo buổi / theo tháng / theo kỳ / tùy chỉnh) để áp dụng khi ghi danh học viên.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập, quyền Admin
- **Route:** `/subscription-packages`
- **Layout:** BasicLayout
- **Breadcrumb:** Cài đặt > Gói đăng ký

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Gói đăng ký                    [+ Thêm gói đăng ký]   │
│           │ Quản lý các gói học phí áp dụng cho ghi danh          │
│           │                                                      │
│           │ ┌──────┐ ┌──────┐ ┌──────┐                          │
│           │ │  6   │ │  5   │ │  1   │                          │
│           │ │Tổng  │ │Đang  │ │Ngừng │                          │
│           │ │gói   │ │dùng  │ │dùng  │                          │
│           │ └──────┘ └──────┘ └──────┘                          │
│           │                                                      │
│           │ ┌──────────────────────────────────────────────┐    │
│           │ │Tên gói│Loại│Giá│Áp dụng khóa│Trạng thái│      │    │
│           │ ├──────────────────────────────────────────────┤    │
│           │ │Gói buổi│Session│94.000đ│Tất cả│Đang dùng│✏️🗑│    │
│           │ │Gói tháng│Month│2.400.000đ│Starters│Đang dùng│✏️🗑│  │
│           │ │Gói kỳ  │Term │3.000.000đ│Tất cả│Ngừng dùng│✏️🗑│    │
│           │ └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 PackageStatRow (×3)

| Card | Giá trị |
|------|---------|
| Tổng gói | 6 |
| Đang dùng | 5 |
| Ngừng dùng | 1 |

### 5.2 PackageTable

**Columns:** Tên gói, Loại (Theo buổi / Theo tháng / Theo kỳ / Tùy chỉnh), Giá, Khóa học áp dụng, Trạng thái (Đang dùng / Ngừng dùng), Thao tác (Sửa | Bật-tắt | Xóa).

**Click tên gói** → Navigate `/subscription-packages/{id}`.

### 5.3 QuickAddPackageModal

Form thêm nhanh: Tên gói, Loại, Giá — sau khi tạo điều hướng sang trang cấu hình chi tiết `082`.

---

## 6. API Integration

### 6.1 API Package List

**Endpoint:** `GET /api/admin/subscription-packages`

**Query params:** `status=all, type=all, page=1, limit=20`

**Response (200):**
```json
{
  "summary": { "total": 6, "active": 5, "inactive": 1 },
  "data": [
    { "id": 1, "name": "Gói buổi", "type": "session", "price": 94000, "applicable_courses": "all", "status": "active" },
    { "id": 2, "name": "Gói tháng", "type": "month", "price": 2400000, "applicable_courses": "Starters", "status": "active" }
  ]
}
```

---

### 6.2 API Create Package (quick)

**Endpoint:** `POST /api/admin/subscription-packages`

**Request body:** `{ "name": "Gói kỳ", "type": "term", "price": 3000000 }`

**Response (201):** `{ "id": 3 }`

---

### 6.3 API Toggle Status

**Endpoint:** `PATCH /api/admin/subscription-packages/{id}/toggle`

**Response (200):** `{ "id": 3, "status": "inactive" }`

---

### 6.4 API Delete Package

**Endpoint:** `DELETE /api/admin/subscription-packages/{id}`

**Response (200):** `{ "success": true }`
**Response (409) nếu đang được học viên sử dụng:** `{ "error": "package_in_use" }`

---

## 7. State Management

```typescript
packageListStore.setSummary(summary)
packageListStore.setList(data)
packageListStore.setFilter({ status, type })
packageListStore.toggleStatus(id)
```

---

## 8. Validation

| Field | Rule | Thông báo |
|-------|------|-----------|
| name | required, unique | "Tên gói đã tồn tại" |
| type | required | "Vui lòng chọn loại gói" |
| price | required, > 0 (trừ loại tùy chỉnh) | "Giá không hợp lệ" |
| delete | không cho xóa nếu đang được sử dụng | "Gói đang được sử dụng, không thể xóa" |

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị danh sách + stats |
| 2 | Thêm gói mới | Xuất hiện trong danh sách, điều hướng sang trang cấu hình |
| 3 | Bật/tắt trạng thái | Cập nhật badge trạng thái |
| 4 | Xóa gói đang dùng | Bị chặn, hiện cảnh báo |
| 5 | Click tên gói | Navigate `/subscription-packages/{id}` |
| 6 | Lọc theo loại gói | Kết quả đúng bộ lọc |
