# [077] - Teacher - Quản lý trình độ

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [077] |
| Module | Teacher |
| Screen | Quản lý trình độ |
| Sprint | Sprint 5 |
| Label | Sprint5, Teacher, Frontend, API |
| Mockup | Không có |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Cho phép admin cấu hình danh sách trình độ (level) dùng chung cho toàn bộ business, áp dụng thống nhất cho khóa học và học viên thay vì định nghĩa riêng lẻ theo từng khóa.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập, quyền Admin
- **Route:** `/levels`
- **Layout:** BasicLayout
- **Breadcrumb:** Cài đặt > Quản lý trình độ

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Quản lý trình độ               [+ Thêm trình độ]      │
│           │ Danh sách trình độ dùng chung cho toàn bộ trung tâm  │
│           │                                                      │
│           │ ┌──────────────────────────────────────────────┐    │
│           │ │≡│Thứ tự│Tên trình độ│Mã│Khóa áp dụng│Học viên│    │
│           │ ├──────────────────────────────────────────────┤    │
│           │ │≡│  1   │Starters    │ST│3 khóa      │48      │✏️🗑│
│           │ │≡│  2   │Movers      │MV│2 khóa      │30      │✏️🗑│
│           │ │≡│  3   │Flyers      │FL│1 khóa      │12      │✏️🗑│
│           │ └──────────────────────────────────────────────┘    │
│           │  (kéo thả ≡ để sắp xếp thứ tự trình độ)              │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 LevelTable

**Columns:** Kéo-thả sắp xếp, Thứ tự, Tên trình độ, Mã trình độ, Số khóa học áp dụng, Số học viên đang ở trình độ, Thao tác (Sửa | Xóa).

**Kéo-thả (drag & drop)** để thay đổi thứ tự trình độ (ảnh hưởng đến logic "lên trình độ tiếp theo").

### 5.2 LevelFormModal

| Field | Label | Type | Required |
|-------|-------|------|----------|
| name | Tên trình độ | text | ✓ |
| code | Mã trình độ | text | ✓ |
| description | Mô tả | textarea | — |
| order | Thứ tự | number (auto, có thể kéo thả) | ✓ |

### 5.3 DeleteLevelConfirm

- Nếu trình độ đang được khóa học/học viên sử dụng → cảnh báo và chặn xóa, gợi ý gộp/di chuyển sang trình độ khác trước.

---

## 6. API Integration

### 6.1 API Level List

**Endpoint:** `GET /api/teacher/levels`

**Response (200):**
```json
{
  "data": [
    { "id": 1, "name": "Starters", "code": "ST", "order": 1, "courses_count": 3, "students_count": 48 },
    { "id": 2, "name": "Movers", "code": "MV", "order": 2, "courses_count": 2, "students_count": 30 }
  ]
}
```

---

### 6.2 API Create Level

**Endpoint:** `POST /api/teacher/levels`

**Request body:** `{ "name": "Flyers", "code": "FL", "description": "Trình độ nâng cao" }`

**Response (201):** `{ "id": 3, "name": "Flyers", "order": 3 }`

---

### 6.3 API Update Level / Reorder

**Endpoint:** `PATCH /api/teacher/levels/{id}`

**Request body:** `{ "name": "Flyers", "order": 2 }`

**Response (200):** `{ "id": 3, "order": 2 }`

**Endpoint reorder hàng loạt:** `POST /api/teacher/levels/reorder`
```json
{ "order": [2, 1, 3] }
```

---

### 6.4 API Delete Level

**Endpoint:** `DELETE /api/teacher/levels/{id}`

**Response (200):** `{ "success": true }`
**Response (409) nếu đang sử dụng:** `{ "error": "level_in_use", "courses_count": 3, "students_count": 48 }`

---

## 7. State Management

```typescript
levelStore.setList(levels)
levelStore.reorder(newOrder)
levelStore.openFormModal(level?)
levelStore.removeLevel(id)
```

---

## 8. Validation

| Field | Rule | Thông báo |
|-------|------|-----------|
| name | required, unique | "Tên trình độ đã tồn tại" |
| code | required, unique | "Mã trình độ đã tồn tại" |
| delete | không cho xóa nếu đang được sử dụng | "Trình độ đang được sử dụng, không thể xóa" |

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị danh sách trình độ theo thứ tự |
| 2 | Thêm trình độ mới | Xuất hiện cuối danh sách |
| 3 | Kéo thả đổi thứ tự | Cập nhật order, lưu lại đúng |
| 4 | Sửa tên trình độ | Cập nhật thành công |
| 5 | Xóa trình độ đang dùng | Bị chặn, hiện cảnh báo |
| 6 | Xóa trình độ không dùng | Xóa thành công |
| 7 | Trùng mã trình độ | Validation error |
