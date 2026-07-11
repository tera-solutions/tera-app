# Use Case — EDU-09 Enrollment

> Hana Edu | Version 1.0 | 2026-07-08 | Tham chiếu: `BRD - Education.md` § EDU-09, `SRS/SRS-EDU-09-Enrollment.md`

---

## Danh mục Use Case

| ID | Tên | Actor chính |
|----|-----|-------------|
| UC-EDU-09-01 | Ghi danh thủ công | Giáo vụ |
| UC-EDU-09-02 | Ghi danh tự động sau thanh toán | System |
| UC-EDU-09-03 | Bảo lưu & kích hoạt lại | Giáo vụ |
| UC-EDU-09-04 | Hủy ghi danh & hoàn phí | Manager |
| UC-EDU-09-05 | Cảnh báo sắp hết buổi (tái ghi danh) | System |

## Sơ đồ Actor – Use Case

```
Giáo vụ ────► UC-01, UC-03
Manager ────► UC-04 (+ override sĩ số)
System ────► UC-02 (event thanh toán), UC-05 (job hàng ngày)
Finance (module) ────► điều kiện thanh toán (UC-01/02); refund (UC-04)
Sales ────► nhận task từ UC-05
```

---

## UC-EDU-09-01 — Ghi danh thủ công

| Thuộc tính | Nội dung |
|-----------|----------|
| Precondition | Student có ≥1 phụ huynh; lớp open/ongoing còn chỗ; invoice đạt ngưỡng thanh toán |
| Postcondition | Enrollment active; student → studying; roster lớp cập nhật |

**Luồng chính**

| Bước | Actor | Hệ thống |
|------|-------|----------|
| 1 | Mở dialog ghi danh, chọn học viên | Search học viên |
| 2 | Chọn lớp | Hiển thị lịch, sĩ số, GV các lớp phù hợp |
| 3 | — | Panel điều kiện thanh toán: gọi Finance, hiển thị đã trả x% / ngưỡng y% |
| 4 | Xác nhận | Lock class → check sĩ số → insert enrollment (total_sessions theo gói) |
| 5 | — | Push Parent App (lịch học, GV, phòng) + Teacher App (học viên mới) |

**Luồng thay thế:** A1 (bước 4): lớp đầy → Manager override (log) hoặc gợi ý lớp cùng course còn chỗ.

**Luồng ngoại lệ**

- E1: Chưa đạt ngưỡng → 422 E-ENR-01 kèm số thiếu + link invoice.
- E2: Trùng enrollment active → 409 E-ENR-03.
- E3: Student thiếu phụ huynh → 422 E-ENR-04 (điều hướng UC-EDU-02).
- E4: Finance timeout → 503 E-ENR-06, thử lại.

**BR liên quan:** BR-01, BR-02, BR-03.

---

## UC-EDU-09-02 — Ghi danh tự động sau thanh toán

| Thuộc tính | Nội dung |
|-----------|----------|
| Actor | System (listener `PaymentConfirmed`) |
| Postcondition | Enrollment tạo đúng 1 lần (idempotent theo invoice) |

**Luồng chính**

1. Finance phát `PaymentConfirmed {invoice, student, class?, sessions}`.
2. Có class chỉ định → chạy flow UC-01 bước 4–5 (bỏ check thanh toán).
3. Không có class → tạo `pending_placements` + task Giáo vụ "Chờ xếp lớp".

**Ngoại lệ:** event retry → không tạo trùng; lớp chỉ định đã đầy → fallback thành pending_placement + alert Giáo vụ.

---

## UC-EDU-09-03 — Bảo lưu & kích hoạt lại

**Trigger:** Phụ huynh xin nghỉ 2 tháng (về quê, ốm dài).

**Luồng chính**

1. Giáo vụ /reserve: lý do + ngày dự kiến quay lại → enrollment reserved; loại khỏi roster các buổi sau; student → reserved (nếu không còn enrollment active khác).
2. Học viên quay lại → /activate: chọn lớp mới cùng level còn chỗ → enrollment mới active với total = số buổi còn lại.
3. Thông báo phụ huynh lịch lớp mới.

**Ngoại lệ:** lớp mới đầy → gợi ý lớp khác; quá hạn quay lại dự kiến → job nhắc Giáo vụ gọi chăm sóc.

**BR liên quan:** BR-04.

---

## UC-EDU-09-04 — Hủy ghi danh & hoàn phí

| Thuộc tính | Nội dung |
|-----------|----------|
| Actor chính | Manager |
| Precondition | Enrollment active |
| Postcondition | Enrollment cancelled; refund request tạo bên Finance với số buổi chưa học |

**Luồng chính**

1. Manager /cancel + lý do.
2. Hệ thống tính remaining = total − used (used đếm từ attendance theo policy).
3. Gửi Finance refund request {enrollment, remaining_sessions} → Finance tính tiền hoàn theo chính sách.
4. Thông báo phụ huynh 2 bước: đã ghi nhận hủy → kết quả hoàn phí.
5. Student không còn enrollment active → Giáo vụ chọn trạng thái (pending/dropped).

**Ngoại lệ:** cancel enrollment completed → 409 E-ENR-05.

**BR liên quan:** BR-06.

---

## UC-EDU-09-05 — Cảnh báo sắp hết buổi

**Actor:** System (job hàng ngày).

**Luồng chính:** quét enrollment active có remaining ≤ 5 (Setting) → tạo task Sales "Tư vấn tái ghi danh" (kèm gợi ý level tiếp theo từ UC-EDU-05-02) + push Parent App → Sales gọi tư vấn → chốt → quay lại UC-01/02 cho khóa mới.

**Ngoại lệ:** không gửi lặp — mỗi enrollment chỉ cảnh báo 1 lần/ngưỡng.
