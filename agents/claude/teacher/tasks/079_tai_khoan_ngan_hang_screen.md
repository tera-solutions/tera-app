# [079] - Teacher - Tài khoản ngân hàng

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [079] |
| Module | Teacher |
| Screen | Tài khoản ngân hàng |
| Sprint | Sprint 5 |
| Label | Sprint5, Teacher, Frontend, API |
| Mockup | Không có |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Admin quản lý các tài khoản ngân hàng dùng để nhận thanh toán học phí, cấu hình tài khoản mặc định và tạo mã QR thanh toán (VietQR) cho hóa đơn.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập, quyền Admin
- **Route:** `/settings/bank-accounts`
- **Layout:** BasicLayout
- **Breadcrumb:** Cài đặt > Tài khoản ngân hàng

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Tài khoản ngân hàng          [+ Thêm tài khoản]      │
│           │ Quản lý tài khoản nhận thanh toán học phí             │
│           │                                                      │
│           │ ┌──────────────────────────────────────────────┐    │
│           │ │[VCB] Vietcombank          [Mặc định] ✏️ 🗑    │    │
│           │ │STK: 123456789                                 │    │
│           │ │Chủ TK: TRUNG TAM ANH NGU HANA                 │    │
│           │ │[Xem QR mẫu]                                   │    │
│           │ ├──────────────────────────────────────────────┤    │
│           │ │[TCB] Techcombank                    ✏️ 🗑    │    │
│           │ │STK: 987654321                                 │    │
│           │ │Chủ TK: TRUNG TAM ANH NGU HANA                 │    │
│           │ │[Đặt làm mặc định]  [Xem QR mẫu]                │    │
│           │ └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 BankAccountCard (list)

- Logo ngân hàng, tên ngân hàng
- Số tài khoản, tên chủ tài khoản, chi nhánh
- Badge "Mặc định" nếu là tài khoản đang dùng để sinh QR cho hóa đơn
- Nút "Đặt làm mặc định" (nếu chưa phải mặc định)
- Nút "Xem QR mẫu" → mở preview QR VietQR tĩnh (chưa gắn số tiền)
- Thao tác: Sửa | Xóa

### 5.2 BankAccountFormModal

| Field | Label | Type | Required |
|-------|-------|------|----------|
| bank_code | Ngân hàng | select (danh sách NH hỗ trợ VietQR) | ✓ |
| account_no | Số tài khoản | text | ✓ |
| account_name | Tên chủ tài khoản | text | ✓ |
| branch | Chi nhánh | text | — |
| is_default | Đặt làm mặc định | checkbox | — |

### 5.3 QrPreviewModal

- Hiển thị QR VietQR tĩnh theo tài khoản đã chọn
- Nút tải ảnh QR để in/dán tại quầy

---

## 6. API Integration

### 6.1 API Bank Account List

**Endpoint:** `GET /api/admin/bank-accounts`

**Response (200):**
```json
{
  "data": [
    { "id": 1, "bank_code": "VCB", "bank_name": "Vietcombank", "account_no": "123456789", "account_name": "TRUNG TAM ANH NGU HANA", "is_default": true }
  ]
}
```

---

### 6.2 API Create Bank Account

**Endpoint:** `POST /api/admin/bank-accounts`

**Request body:**
```json
{ "bank_code": "TCB", "account_no": "987654321", "account_name": "TRUNG TAM ANH NGU HANA", "branch": "Chi nhánh Q1", "is_default": false }
```

**Response (201):** `{ "id": 2, "bank_code": "TCB" }`

---

### 6.3 API Set Default

**Endpoint:** `PATCH /api/admin/bank-accounts/{id}/set-default`

**Response (200):** `{ "id": 2, "is_default": true }`

---

### 6.4 API QR Preview

**Endpoint:** `GET /api/admin/bank-accounts/{id}/qr`

**Response (200):** `{ "qr_image": "data:image/png;base64,..." }`

---

### 6.5 API Delete Bank Account

**Endpoint:** `DELETE /api/admin/bank-accounts/{id}`

**Response (200):** `{ "success": true }`
**Response (409) nếu là tài khoản mặc định:** `{ "error": "cannot_delete_default_account" }`

---

## 7. State Management

```typescript
bankAccountStore.setList(accounts)
bankAccountStore.setDefault(id)
bankAccountStore.openFormModal(account?)
bankAccountStore.openQrPreview(id)
```

---

## 8. Validation

| Field | Rule | Thông báo |
|-------|------|-----------|
| bank_code | required | "Vui lòng chọn ngân hàng" |
| account_no | required, chỉ số | "Số tài khoản không hợp lệ" |
| account_name | required | "Vui lòng nhập tên chủ tài khoản" |
| delete | không cho xóa tài khoản mặc định khi còn ≥1 tài khoản khác | "Vui lòng đặt tài khoản khác làm mặc định trước khi xóa" |

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị danh sách tài khoản |
| 2 | Thêm tài khoản mới | Xuất hiện trong danh sách |
| 3 | Đặt làm mặc định | Badge "Mặc định" chuyển sang tài khoản mới |
| 4 | Xem QR mẫu | Hiển thị đúng ảnh QR |
| 5 | Xóa tài khoản mặc định (còn TK khác) | Bị chặn, hiện cảnh báo |
| 6 | Xóa tài khoản không mặc định | Xóa thành công |
