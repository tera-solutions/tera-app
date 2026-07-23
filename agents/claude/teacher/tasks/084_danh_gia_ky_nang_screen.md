# [084] - Teacher - Bảng đánh giá kỹ năng

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [084] |
| Module | Teacher |
| Screen | Bảng đánh giá kỹ năng |
| Sprint | Sprint 5 |
| Label | Sprint5, Teacher, Frontend, API |
| Mockup | Không có |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Admin cấu hình các mẫu bảng đánh giá kỹ năng học viên (tiêu chí, thang điểm) để giáo viên dùng khi nhận xét học viên. Giáo viên có thể dùng mẫu có sẵn hoặc tự định nghĩa mẫu riêng.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/skill-assessment-templates`
- **Layout:** BasicLayout
- **Breadcrumb:** Cài đặt > Bảng đánh giá kỹ năng

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Bảng đánh giá kỹ năng          [+ Tạo mẫu đánh giá]  │
│           │ Mẫu đánh giá kỹ năng dùng khi nhận xét học viên       │
│           │                                                      │
│           │ [Mẫu hệ thống] [Mẫu của tôi]                         │
│           │ ┌──────────────────────────────────────────────┐    │
│           │ │Tên mẫu│Loại│Số tiêu chí│Áp dụng│              │    │
│           │ ├──────────────────────────────────────────────┤    │
│           │ │Mẫu chuẩn TT│Hệ thống│5 tiêu chí│Tất cả GV│👁│    │
│           │ │Mẫu Speaking│Của tôi │3 tiêu chí│Cá nhân │✏️🗑│    │
│           │ └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 TemplateTabs

- Tab "Mẫu hệ thống" (do admin tạo, dùng chung) và "Mẫu của tôi" (giáo viên tự định nghĩa)

### 5.2 TemplateTable

**Columns:** Tên mẫu, Loại (Hệ thống / Cá nhân), Số tiêu chí, Phạm vi áp dụng, Thao tác (Xem | Sửa | Xóa — chỉ sửa/xóa được mẫu của mình hoặc nếu là admin).

### 5.3 TemplateFormModal

- Tên mẫu
- Danh sách tiêu chí (thêm/xóa động): Tên tiêu chí, Thang điểm (VD: 1–5 hoặc A–D), Mô tả từng mức điểm
- Phạm vi áp dụng (chỉ với mẫu hệ thống): Tất cả giáo viên / Theo khóa học

**Ví dụ tiêu chí:**

| Tiêu chí | Thang điểm |
|----------|-----------|
| Phát âm (Pronunciation) | 1–5 |
| Từ vựng (Vocabulary) | 1–5 |
| Ngữ pháp (Grammar) | 1–5 |
| Nghe hiểu (Listening) | 1–5 |
| Tự tin giao tiếp (Confidence) | 1–5 |

---

## 6. API Integration

### 6.1 API Template List

**Endpoint:** `GET /api/teacher/skill-assessment-templates?type=all`

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Mẫu chuẩn trung tâm",
      "type": "system",
      "criteria_count": 5,
      "scope": "all_teachers"
    },
    {
      "id": 2,
      "name": "Mẫu Speaking",
      "type": "personal",
      "criteria_count": 3,
      "owner_id": 5
    }
  ]
}
```

---

### 6.2 API Template Detail

**Endpoint:** `GET /api/teacher/skill-assessment-templates/{id}`

**Response (200):**
```json
{
  "id": 1,
  "name": "Mẫu chuẩn trung tâm",
  "criteria": [
    { "id": 1, "name": "Phát âm", "scale": "1-5", "descriptions": { "1": "Yếu", "5": "Xuất sắc" } }
  ]
}
```

---

### 6.3 API Create/Update Template

**Endpoint:** `POST /api/teacher/skill-assessment-templates` (tạo) / `PUT /api/teacher/skill-assessment-templates/{id}` (sửa)

**Request body:**
```json
{
  "name": "Mẫu Speaking",
  "criteria": [
    { "name": "Phát âm", "scale": "1-5" },
    { "name": "Tự tin giao tiếp", "scale": "1-5" }
  ]
}
```

**Response (201/200):** `{ "id": 2 }`

---

### 6.4 API Delete Template

**Endpoint:** `DELETE /api/teacher/skill-assessment-templates/{id}`

**Response (200):** `{ "success": true }`

---

## 7. State Management

```typescript
skillTemplateStore.setTab('system' | 'personal')
skillTemplateStore.setList(templates)
skillTemplateStore.openFormModal(template?)
skillTemplateStore.addCriterion()
skillTemplateStore.removeCriterion(index)
```

---

## 8. Validation

| Field | Rule | Thông báo |
|-------|------|-----------|
| name | required, unique trong phạm vi | "Tên mẫu đã tồn tại" |
| criteria | min 1 | "Vui lòng thêm ít nhất 1 tiêu chí" |
| criteria.name | required | "Vui lòng nhập tên tiêu chí" |

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị 2 tab mẫu hệ thống/cá nhân |
| 2 | Giáo viên tạo mẫu riêng | Xuất hiện ở tab "Mẫu của tôi" |
| 3 | Admin tạo mẫu hệ thống | Hiển thị cho tất cả giáo viên |
| 4 | Sửa mẫu không phải của mình | Bị chặn (trừ admin) |
| 5 | Xóa mẫu đang được dùng trong nhận xét HV | Cảnh báo hoặc chặn |
| 6 | Thêm/xóa tiêu chí động | UI cập nhật đúng |
