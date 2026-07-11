# SRS-EDU-09 — Enrollment

> Software Requirements Specification — Hana Edu
>
> Version 1.0 | 2026-07-08 | Draft | Tham chiếu: `BRD - Education.md` § EDU-09

---

## 1. Giới thiệu

### 1.1 Mục đích

Đặc tả ghi danh học viên vào lớp gắn điều kiện thanh toán (Finance), quản lý số buổi được hưởng và vòng đời enrollment.

### 1.2 Phạm vi

Tạo/hủy/bảo lưu/kích hoạt enrollment; auto-enrollment từ event thanh toán; đồng bộ used_sessions. Chuyển lớp: SRS-EDU-08 FR-04.

## 2. Mô tả tổng quan

- State machine: `active → completed | transferred | reserved | cancelled`; reserved → active (lớp mới).
- Điều kiện vào học: invoice đạt ngưỡng % thanh toán (Setting `edu.enrollment.min_paid_percent`, mặc định theo đợt 1 trả góp).
- Idempotency: auto-enrollment theo invoice_id.

## 3. Yêu cầu chức năng chi tiết

### FR-01 Tạo enrollment (manual)

- Input: student_id, class_id, invoice_id?, total_sessions (mặc định = course.total_sessions), start_date.
- Validate chain: student tồn tại & ≥1 parent; class open/ongoing; chưa có enrollment active trùng; sĩ số (lock class row); payment check qua `FinanceClient::checkInvoice(invoice_id)` → {paid_percent, is_eligible}.
- Transaction: insert enrollment → student.status=studying → event `EnrollmentCreated`.

### FR-02 Auto-enrollment

Listener event `PaymentConfirmed {invoice_id, student_id, class_id?, sessions}`:
- Có class_id → chạy FR-01 flow (bỏ qua payment check — đã confirm); unique theo invoice_id.
- Không có class_id → tạo record `pending_placements` + task Giáo vụ "Chờ xếp lớp".

### FR-03 Hủy enrollment

- PATCH /cancel {reason}: chỉ từ active; tính remaining = total_sessions − used_sessions → gọi Finance tạo refund request {enrollment_id, remaining_sessions} → status=cancelled → nếu không còn enrollment active nào, student.status theo policy (pending/dropped chọn bởi Giáo vụ).

### FR-04 Bảo lưu / kích hoạt lại

- /reserve {reason, expected_return_date}: active→reserved; loại khỏi attendance các buổi sau.
- /activate {class_id}: validate như FR-01 (không check payment lại); total_sessions mới = remaining; reserved→transferred(sang enrollment mới active).

### FR-05 Đồng bộ used_sessions

Listener `SessionCompleted`: với mỗi attendance present/late (và absent theo policy Setting `edu.attendance.deduct_on_absent`) → `used_sessions += 1`. Recalculate on-demand: đếm lại từ attendance (nguồn sự thật) — dùng khi sửa điểm danh.

### FR-06 Cảnh báo sắp hết buổi

Job hàng ngày: enrollment active có remaining ≤ Setting (`edu.enrollment.renewal_alert_sessions`, mặc định 5) → event cho CRM (task tư vấn tái ghi danh) + Parent App.

## 4. Use Case chính

**UC-04 Hủy giữa khóa:** Phụ huynh xin nghỉ sau 5 buổi → Giáo vụ /cancel → hệ thống trả remaining=43 → Finance nhận refund request tính tiền hoàn theo chính sách → phụ huynh nhận thông báo 2 bước (ghi nhận + kết quả hoàn).

## 5. API Specification

| Method | Path | Quyền |
|--------|------|-------|
| GET/POST | /api/edu/enrollments | view / create |
| GET | /api/edu/enrollments/{id} | view |
| PATCH | /api/edu/enrollments/{id}/cancel | cancel |
| PATCH | /api/edu/enrollments/{id}/reserve | reserve |
| PATCH | /api/edu/enrollments/{id}/activate | reserve |
| POST | /api/edu/enrollments/{id}/recalculate | admin |
| GET | /api/edu/students/{id}/enrollments · /api/edu/classes/{id}/enrollments | view |

```json
// POST /enrollments — 422 chưa đủ thanh toán
{
  "success": false,
  "errors": {
    "code": "E-ENR-01",
    "paid_percent": 20,
    "required_percent": 50,
    "invoice_url": "/fin/invoices/889"
  }
}
```

## 6. Yêu cầu dữ liệu

`enrollments`: id, business_id, student_id FK, class_id FK, invoice_id FK null unique, total_sessions smallint, used_sessions smallint default 0, start_date, status enum(active,completed,transferred,reserved,cancelled) index, status_reason, expected_return_date null, source enum(manual,auto,transfer), created_by, timestamps, deleted_at.

Constraint: unique (student_id, class_id, status) áp dụng logic active tại service + unique index phụ trợ; `used_sessions ≤ total_sessions` (check ở service).

`pending_placements`: id, student_id, invoice_id, sessions, status(waiting,placed), created_at.

## 7. Yêu cầu phi chức năng

- Chống vượt sĩ số: `SELECT id FROM classes WHERE id=? FOR UPDATE` trước khi count enrollment active — bắt buộc mọi đường ghi (manual, auto, transfer, activate).
- Auto-enrollment idempotent: unique invoice_id; event retry an toàn.
- FinanceClient: timeout 3s, circuit breaker; Finance down → manual enrollment báo lỗi rõ, auto-enrollment vào queue retry.

## 8. Mã lỗi

| Code | HTTP | Ý nghĩa |
|------|------|---------|
| E-ENR-01 | 422 | Chưa đạt ngưỡng thanh toán |
| E-ENR-02 | 409 | Lớp đầy |
| E-ENR-03 | 409 | Enrollment active trùng |
| E-ENR-04 | 422 | Student thiếu phụ huynh liên kết |
| E-ENR-05 | 409 | Thao tác sai trạng thái (VD cancel enrollment completed) |
| E-ENR-06 | 503 | Finance không phản hồi |

## 9. Test scenarios

| # | Scenario | Kỳ vọng |
|---|----------|---------|
| T1 | Ghi danh invoice trả 20%, ngưỡng 50% | 422 E-ENR-01 |
| T2 | 2 request tranh chỗ cuối | 1 thành công, 1 E-ENR-02 |
| T3 | PaymentConfirmed retry 3 lần | 1 enrollment duy nhất |
| T4 | Cancel sau 5 buổi (2 vắng có phép, policy trừ) | remaining đúng theo policy |
| T5 | Reserve rồi activate lớp mới | Enrollment mới total = remaining cũ |
| T6 | used_sessions sau sửa điểm danh | Recalculate khớp lại attendance |
| T7 | Remaining chạm 5 | CRM nhận task + Parent App nhận nhắc tái ghi danh |
