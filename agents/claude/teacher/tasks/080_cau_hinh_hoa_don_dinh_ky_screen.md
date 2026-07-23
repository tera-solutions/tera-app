# [080] - Teacher - Cấu hình hóa đơn định kỳ

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [080] |
| Module | Teacher |
| Screen | Cấu hình hóa đơn định kỳ |
| Sprint | Sprint 5 |
| Label | Sprint5, Teacher, Frontend, API |
| Mockup | Không có |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Admin cấu hình chức năng tự động tạo hóa đơn học phí hàng tháng: ngày xuất hóa đơn, hạn thanh toán, phí trễ hạn, mẫu thông báo và trạng thái học viên khi chưa thanh toán.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập, quyền Admin
- **Route:** `/settings/invoice-config`
- **Layout:** BasicLayout
- **Breadcrumb:** Cài đặt > Cấu hình hóa đơn

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Cấu hình hóa đơn định kỳ                    [Lưu]    │
│           │                                                      │
│           │ Tự động tạo hóa đơn hàng tháng    [Bật ●───]         │
│           │                                                      │
│           │ Ngày xuất hóa đơn trong tháng     [Ngày 01 ▼]        │
│           │ Số ngày cho phép thanh toán       [7 ngày]           │
│           │ Phí trễ hạn                        [☑] 2% / ngày trễ │
│           │                                                      │
│           │ Trạng thái học viên khi chưa TT   [Tạm ngưng ▼]      │
│           │  (Đang học / Tạm ngưng / Chờ thanh toán)             │
│           │                                                      │
│           │ Thông báo nhắc thanh toán                            │
│           │  [☑] Gửi trước hạn 3 ngày                            │
│           │  [☑] Gửi khi quá hạn                                 │
│           │  Kênh gửi: [☑ App] [☑ SMS] [☐ Email]                │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 AutoInvoiceToggle

- Công tắc bật/tắt tự động tạo hóa đơn hàng tháng
- Khi tắt, các field bên dưới bị disable

### 5.2 InvoiceScheduleForm

| Field | Label | Type |
|-------|-------|------|
| billing_day | Ngày xuất hóa đơn (1–28) | select |
| due_days | Số ngày cho phép thanh toán | number |
| late_fee_enabled | Bật phí trễ hạn | checkbox |
| late_fee_percent | % phí trễ hạn / ngày | number |

### 5.3 UnpaidStatusSelect

- Chọn trạng thái học viên tự động áp dụng khi hóa đơn quá hạn chưa thanh toán: Đang học / Tạm ngưng / Chờ thanh toán

### 5.4 ReminderNotificationForm

- Checkbox: Gửi nhắc trước hạn (nhập số ngày), Gửi khi quá hạn
- Chọn kênh gửi: App / SMS / Email

---

## 6. API Integration

### 6.1 API Get Invoice Config

**Endpoint:** `GET /api/admin/invoice-config`

**Response (200):**
```json
{
  "auto_generate": true,
  "billing_day": 1,
  "due_days": 7,
  "late_fee_enabled": true,
  "late_fee_percent": 2,
  "unpaid_student_status": "suspended",
  "reminder": { "before_due_days": 3, "on_overdue": true, "channels": ["app", "sms"] }
}
```

---

### 6.2 API Update Invoice Config

**Endpoint:** `PUT /api/admin/invoice-config`

**Request body:** giống response ở 6.1

**Response (200):** `{ "success": true }`

---

### 6.3 API Manual Trigger (chạy thử ngay)

**Endpoint:** `POST /api/admin/invoice-config/generate-now`

**Response (200):** `{ "invoices_created": 48, "period": "07/2026" }`

---

## 7. State Management

```typescript
invoiceConfigStore.setConfig(config)
invoiceConfigStore.updateField(key, value)
invoiceConfigStore.save()
invoiceConfigStore.triggerNow()
```

---

## 8. Validation

| Field | Rule | Thông báo |
|-------|------|-----------|
| billing_day | 1–28 | "Ngày xuất hóa đơn không hợp lệ" |
| due_days | ≥ 1 | "Số ngày thanh toán phải lớn hơn 0" |
| late_fee_percent | 0–100 khi bật phí trễ hạn | "Phần trăm phí trễ hạn không hợp lệ" |

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị cấu hình hiện tại |
| 2 | Tắt tự động tạo hóa đơn | Các field liên quan bị disable |
| 3 | Lưu cấu hình | Toast thành công, dữ liệu persist |
| 4 | Chạy thử ngay | Tạo hóa đơn cho kỳ hiện tại |
| 5 | Nhập ngày xuất hóa đơn không hợp lệ | Validation error |
| 6 | Đổi trạng thái học viên khi chưa TT | Lưu đúng giá trị đã chọn |
