# [078] - Teacher - Đóng học phí

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [078] |
| Module | Teacher |
| Screen | Đóng học phí |
| Sprint | Sprint 5 |
| Label | Sprint5, Teacher, Frontend, API |
| Mockup | Không có |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Trang cho phép xem danh sách hóa đơn học phí của học viên (đã thanh toán / chưa thanh toán) và thực hiện thanh toán trực tiếp bằng chuyển khoản ngân hàng (kèm mã QR).

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/tuition/payment`
- **Layout:** BasicLayout
- **Breadcrumb:** Học phí > Đóng học phí

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Đóng học phí                                         │
│           │ Danh sách hóa đơn và thanh toán học phí               │
│           │                                                      │
│           │ ┌──────┐ ┌──────┐ ┌──────┐                          │
│           │ │  5   │ │  2   │ │12.4tr│                          │
│           │ │Hóa đơn│ │Quá   │ │Tổng  │                          │
│           │ │chưa TT│ │hạn   │ │nợ    │                          │
│           │ └──────┘ └──────┘ └──────┘                          │
│           │                                                      │
│           ├─────────────────────────────┬────────────────────────┤
│           │  Danh sách hóa đơn           │  Thanh toán            │
│           │ ┌───────────────────────┐   │  ───────────────────  │
│           │ │☐│HV│Kỳ│Số tiền│Hạn│TT│   │  Hóa đơn: #INV-0056    │
│           │ ├───────────────────────┤   │  Học viên: Minh An     │
│           │ │☑│Minh│07/26│2.4tr│25/07│Chưa│  Số tiền: 2,400,000đ│
│           │ │☐│Lan │07/26│2.4tr│20/07│Quá hạn│                  │
│           │ └───────────────────────┘   │  [QR code ngân hàng]  │
│           │                             │  STK: 123456789        │
│           │                             │  NH: Vietcombank       │
│           │                             │  [Xác nhận đã CK]      │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 InvoiceStatRow (×3)

| Card | Giá trị |
|------|---------|
| Hóa đơn chưa thanh toán | 5 |
| Quá hạn | 2 |
| Tổng nợ | 12,400,000đ |

### 5.2 InvoiceTable (Panel trái)

**Columns:** Checkbox, Học viên, Kỳ thanh toán, Số tiền, Hạn thanh toán, Trạng thái (Chưa thanh toán / Quá hạn / Đã thanh toán).

**Click dòng** → hiển thị chi tiết hóa đơn ở panel phải.

### 5.3 PaymentPanel (Panel phải)

- Thông tin hóa đơn: mã hóa đơn, học viên, số tiền
- Mã QR VietQR sinh tự động theo tài khoản ngân hàng đã cấu hình + số tiền + nội dung chuyển khoản (mã hóa đơn)
- Thông tin tài khoản ngân hàng (STK, tên NH, chủ TK) để chuyển khoản thủ công
- Nút `Xác nhận đã chuyển khoản` → gửi yêu cầu đối soát cho admin, hoặc `Đánh dấu đã thanh toán` (dành cho admin/teacher xác nhận trực tiếp)

### 5.4 BulkPaymentBar

- Khi chọn nhiều hóa đơn → hiện thanh tổng tiền + nút "Xuất QR tổng"

---

## 6. API Integration

### 6.1 API Invoice List

**Endpoint:** `GET /api/teacher/tuition-invoices`

**Query params:** `student_id=, status=all, period=, page=1, limit=20`

**Response (200):**
```json
{
  "summary": { "unpaid": 5, "overdue": 2, "total_due": 12400000 },
  "data": [
    {
      "id": 56,
      "code": "INV-0056",
      "student": { "id": 40, "name": "Nguyễn Minh An" },
      "period": "07/2026",
      "amount": 2400000,
      "due_date": "2026-07-25",
      "status": "unpaid"
    }
  ]
}
```

---

### 6.2 API Invoice QR

**Endpoint:** `GET /api/teacher/tuition-invoices/{id}/qr`

**Response (200):**
```json
{
  "qr_image": "data:image/png;base64,...",
  "bank_account": { "bank": "Vietcombank", "account_no": "123456789", "account_name": "TT ANH NGU HANA" },
  "amount": 2400000,
  "content": "INV-0056 Nguyen Minh An"
}
```

---

### 6.3 API Confirm Payment

**Endpoint:** `POST /api/teacher/tuition-invoices/{id}/confirm-payment`

**Request body:** `{ "method": "bank_transfer", "note": "Đã CK qua Vietcombank" }`

**Response (200):** `{ "id": 56, "status": "pending_review" }`

---

### 6.4 API Mark Paid (admin/teacher)

**Endpoint:** `POST /api/teacher/tuition-invoices/{id}/mark-paid`

**Response (200):** `{ "id": 56, "status": "paid", "paid_at": "2026-07-21T10:00:00Z" }`

---

## 7. State Management

```typescript
tuitionPaymentStore.setSummary(summary)
tuitionPaymentStore.setInvoices(data)
tuitionPaymentStore.setSelectedInvoice(invoice)
tuitionPaymentStore.setSelectedIds(ids)
tuitionPaymentStore.setQrData(qr)
```

---

## 8. Validation

| Field | Rule | Thông báo |
|-------|------|-----------|
| invoice | phải tồn tại và chưa thanh toán | "Hóa đơn không hợp lệ hoặc đã thanh toán" |
| confirm-payment | cần chọn phương thức | "Vui lòng chọn phương thức thanh toán" |

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị danh sách hóa đơn + stats |
| 2 | Click hóa đơn | Hiện QR + thông tin thanh toán |
| 3 | Xác nhận đã chuyển khoản | Trạng thái → "Chờ đối soát" |
| 4 | Admin đánh dấu đã thanh toán | Trạng thái → "Đã thanh toán", stats cập nhật |
| 5 | Hóa đơn quá hạn | Badge đỏ "Quá hạn" |
| 6 | Chọn nhiều hóa đơn | Hiện thanh tổng tiền |
| 7 | Lọc theo học viên | Chỉ hiện hóa đơn của học viên đó |
