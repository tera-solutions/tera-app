# [083] - Teacher - Trả lương giáo viên

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [083] |
| Module | Teacher |
| Screen | Trả lương giáo viên |
| Sprint | Sprint 5 |
| Label | Sprint5, Teacher, Frontend, API |
| Mockup | Không có |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Admin quản lý lương giáo viên: xem số dư hiện tại, cập nhật số dư (cộng/trừ), thực hiện trả lương và xem lịch sử giao dịch.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập, quyền Admin
- **Route:** `/payroll`
- **Layout:** BasicLayout
- **Breadcrumb:** Giáo viên > Trả lương

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Trả lương giáo viên                                  │
│           │ Quản lý số dư và thanh toán lương giáo viên           │
│           │                                                      │
│           │ ┌──────┐ ┌──────┐ ┌──────┐                          │
│           │ │  12  │ │48.5tr│ │  3   │                          │
│           │ │Giáo  │ │Tổng  │ │Chờ   │                          │
│           │ │viên  │ │số dư │ │duyệt │                          │
│           │ └──────┘ └──────┘ └──────┘                          │
│           │                                                      │
│           ├─────────────────────────────┬────────────────────────┤
│           │  Danh sách giáo viên         │  Chi tiết & Trả lương │
│           │ ┌───────────────────────┐   │  ─────────────────── │
│           │ │GV│Số dư│Buổi dạy│TT  │   │  Trần Văn A            │
│           │ ├───────────────────────┤   │  Số dư: 4,200,000đ     │
│           │ │Trần Văn A│4.2tr│24│Chờ│   │  [+ Cập nhật số dư]    │
│           │ │Lê Thị B  │3.8tr│20│OK │   │  [Trả lương]           │
│           │ └───────────────────────┘   │                        │
│           │                             │  Lịch sử giao dịch     │
│           │                             │  20/07 +2,000,000 (dạy)│
│           │                             │  15/07 -1,000,000 (trả)│
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 PayrollStatRow (×3)

| Card | Giá trị |
|------|---------|
| Giáo viên | 12 |
| Tổng số dư | 48.500.000đ |
| Chờ duyệt trả lương | 3 |

### 5.2 TeacherPayrollTable (Panel trái)

**Columns:** Giáo viên, Số dư hiện tại, Số buổi dạy trong kỳ, Trạng thái trả lương (Đã trả / Chờ duyệt), Thao tác.

**Click dòng** → hiện chi tiết ở panel phải.

### 5.3 PayrollDetailPanel (Panel phải)

- Thông tin giáo viên, số dư hiện tại
- Nút `+ Cập nhật số dư` → mở form cộng/trừ số dư thủ công (VD: thưởng, phạt, điều chỉnh)
- Nút `Trả lương` → mở form trả lương (số tiền, kỳ lương, phương thức, ghi chú)
- Danh sách lịch sử giao dịch: ngày, loại (Cộng do dạy / Trừ do trả lương / Điều chỉnh), số tiền, người thực hiện

### 5.4 UpdateBalanceModal

| Field | Label | Type | Required |
|-------|-------|------|----------|
| type | Loại | select (cộng / trừ) | ✓ |
| amount | Số tiền | number | ✓ |
| reason | Lý do | text | ✓ |

### 5.5 PayLaryModal

| Field | Label | Type | Required |
|-------|-------|------|----------|
| amount | Số tiền trả | number | ✓ |
| period | Kỳ lương | text (VD: 07/2026) | ✓ |
| method | Phương thức | select (chuyển khoản / tiền mặt) | ✓ |
| note | Ghi chú | textarea | — |

---

## 6. API Integration

### 6.1 API Teacher Payroll List

**Endpoint:** `GET /api/admin/teacher-payroll`

**Response (200):**
```json
{
  "summary": { "teachers": 12, "total_balance": 48500000, "pending": 3 },
  "data": [
    { "teacher_id": 5, "name": "Trần Văn A", "balance": 4200000, "sessions_taught": 24, "payroll_status": "pending" }
  ]
}
```

---

### 6.2 API Payroll Detail & History

**Endpoint:** `GET /api/admin/teacher-payroll/{teacher_id}`

**Response (200):**
```json
{
  "teacher": { "id": 5, "name": "Trần Văn A" },
  "balance": 4200000,
  "transactions": [
    { "id": 1, "type": "credit_teaching", "amount": 2000000, "created_at": "2026-07-20" },
    { "id": 2, "type": "debit_payout", "amount": -1000000, "created_at": "2026-07-15" }
  ]
}
```

---

### 6.3 API Update Balance

**Endpoint:** `POST /api/admin/teacher-payroll/{teacher_id}/adjust`

**Request body:** `{ "type": "credit", "amount": 500000, "reason": "Thưởng dạy thay" }`

**Response (200):** `{ "new_balance": 4700000 }`

---

### 6.4 API Pay Salary

**Endpoint:** `POST /api/admin/teacher-payroll/{teacher_id}/pay`

**Request body:** `{ "amount": 4200000, "period": "07/2026", "method": "bank_transfer", "note": "" }`

**Response (201):** `{ "id": 20, "new_balance": 500000, "status": "paid" }`

---

## 7. State Management

```typescript
payrollStore.setSummary(summary)
payrollStore.setList(data)
payrollStore.setSelectedTeacher(teacher)
payrollStore.setTransactions(transactions)
payrollStore.openAdjustModal()
payrollStore.openPayModal()
```

---

## 8. Validation

| Field | Rule | Thông báo |
|-------|------|-----------|
| amount (adjust) | > 0 | "Số tiền phải lớn hơn 0" |
| reason | required | "Vui lòng nhập lý do" |
| amount (pay) | ≤ số dư hiện tại | "Số tiền trả vượt quá số dư" |
| period | required | "Vui lòng nhập kỳ lương" |

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị danh sách GV + stats |
| 2 | Click giáo viên | Hiện chi tiết + lịch sử |
| 3 | Cập nhật số dư (cộng) | Số dư tăng, ghi log |
| 4 | Cập nhật số dư (trừ) | Số dư giảm, ghi log |
| 5 | Trả lương đúng số dư | Số dư về 0, trạng thái "Đã trả" |
| 6 | Trả lương vượt số dư | Validation error |
| 7 | Lịch sử giao dịch | Hiển thị đúng thứ tự thời gian |
