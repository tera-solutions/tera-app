# [082] - Teacher - Chi tiết / Cấu hình gói đăng ký

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [082] |
| Module | Teacher |
| Screen | Chi tiết / Cấu hình gói đăng ký |
| Sprint | Sprint 5 |
| Label | Sprint5, Teacher, Frontend, API |
| Mockup | Không có |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Cấu hình chi tiết một gói đăng ký: giá, số buổi/thời hạn, khóa học áp dụng, quy tắc giảm giá và xem danh sách học viên đang sử dụng gói.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập, quyền Admin
- **Route:** `/subscription-packages/{id}`
- **Layout:** BasicLayout
- **Breadcrumb:** Gói đăng ký > Cấu hình gói

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Gói đăng ký > Gói tháng          [Lưu] [Ngừng dùng]  │
│           │                                                      │
│           ├──────────────────────────────┬───────────────────────┤
│           │  Thông tin gói                │  Học viên đang dùng   │
│           │  ─────────────────────────── │  ─────────────────── │
│           │  Tên gói: Gói tháng            │  Tổng: 32 học viên    │
│           │  Loại: [Theo tháng ▼]         │  ┌───────────────┐   │
│           │  Giá: 2.400.000đ              │  │Minh - Starters │   │
│           │  Số buổi/tháng: 12             │  │Lan  - Movers   │   │
│           │  Thời hạn: 30 ngày             │  └───────────────┘   │
│           │  Khóa học áp dụng: [Starters ▼]│                       │
│           │                                │                       │
│           │  Giảm giá                     │                       │
│           │  ─────────────────────────── │                       │
│           │  [☑] Giảm 10% khi đăng ký 3 tháng│                    │
│           │  [☑] Giảm 5% cho HV thứ 2 trở lên (cùng PH)│           │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 PackageInfoForm (Panel trái)

| Field | Label | Type | Required |
|-------|-------|------|----------|
| name | Tên gói | text | ✓ |
| type | Loại gói | select (session / month / term / custom) | ✓ |
| price | Giá | number | ✓ (trừ custom) |
| sessions_included | Số buổi bao gồm | number | — |
| duration_days | Thời hạn (ngày) | number | ✓ |
| applicable_courses | Khóa học áp dụng | multi-select (hoặc "Tất cả") | ✓ |

### 5.2 DiscountRuleList

- Danh sách quy tắc giảm giá có thể bật/tắt: giảm % theo số kỳ đăng ký, giảm % cho học viên thứ 2 trở lên cùng phụ huynh, mã giảm giá riêng
- Nút `+ Thêm quy tắc`

### 5.3 PackageUsageList (Panel phải)

- Danh sách học viên đang sử dụng gói: tên, khóa học, ngày bắt đầu, ngày hết hạn
- Nút xem chi tiết → Navigate `/student/{id}`

---

## 6. API Integration

### 6.1 API Package Detail

**Endpoint:** `GET /api/admin/subscription-packages/{id}`

**Response (200):**
```json
{
  "id": 2,
  "name": "Gói tháng",
  "type": "month",
  "price": 2400000,
  "sessions_included": 12,
  "duration_days": 30,
  "applicable_courses": ["Starters"],
  "discount_rules": [
    { "id": 1, "type": "multi_term", "value": 10, "condition": "3 tháng", "enabled": true },
    { "id": 2, "type": "sibling", "value": 5, "condition": "HV thứ 2 trở lên", "enabled": true }
  ],
  "status": "active"
}
```

---

### 6.2 API Update Package

**Endpoint:** `PUT /api/admin/subscription-packages/{id}`

**Request body:** giống cấu trúc ở 6.1 (không gồm `id`, `status`)

**Response (200):** `{ "success": true }`

---

### 6.3 API Package Usage (học viên đang dùng)

**Endpoint:** `GET /api/admin/subscription-packages/{id}/usages`

**Response (200):**
```json
{
  "total": 32,
  "data": [
    { "student_id": 40, "student_name": "Nguyễn Minh An", "course": "Starters 2A", "started_at": "2026-07-01", "expires_at": "2026-07-31" }
  ]
}
```

---

### 6.4 API Add/Update Discount Rule

**Endpoint:** `PUT /api/admin/subscription-packages/{id}/discount-rules`

**Request body:**
```json
{ "rules": [ { "type": "multi_term", "value": 10, "condition": "3 tháng", "enabled": true } ] }
```

**Response (200):** `{ "success": true }`

---

## 7. State Management

```typescript
packageDetailStore.setPackage(pkg)
packageDetailStore.updateField(key, value)
packageDetailStore.setDiscountRules(rules)
packageDetailStore.setUsages(usages)
packageDetailStore.save()
```

---

## 8. Validation

| Field | Rule | Thông báo |
|-------|------|-----------|
| name | required | "Vui lòng nhập tên gói" |
| duration_days | ≥ 1 | "Thời hạn phải lớn hơn 0" |
| price | > 0 khi type khác custom | "Giá gói không hợp lệ" |
| discount value | 0–100 | "Phần trăm giảm giá không hợp lệ" |

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị đầy đủ thông tin gói |
| 2 | Sửa giá gói | Lưu thành công |
| 3 | Thêm quy tắc giảm giá | Áp dụng cho ghi danh mới |
| 4 | Ngừng dùng gói | Không hiển thị khi ghi danh mới, nhưng học viên cũ vẫn giữ |
| 5 | Xem học viên đang dùng | Danh sách đúng và điều hướng đúng |
| 6 | Nhập giá âm | Validation error |
