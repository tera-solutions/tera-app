# Use Case — EDU-08 Class Management

> Hana Edu | Version 1.0 | 2026-07-08 | Tham chiếu: `BRD - Education.md` § EDU-08, `SRS/SRS-EDU-08-Class.md`

---

## Danh mục Use Case

| ID | Tên | Actor chính |
|----|-----|-------------|
| UC-EDU-08-01 | Mở lớp mới (wizard) | Giáo vụ |
| UC-EDU-08-02 | Chuyển lớp học viên | Giáo vụ |
| UC-EDU-08-03 | Đóng lớp cuối khóa | Manager |
| UC-EDU-08-04 | Hủy lớp không đủ sĩ số | Manager |

## Sơ đồ Actor – Use Case

```
Giáo vụ ────► UC-01, UC-02
Manager ────► UC-03, UC-04 (+ override sĩ số)
System ────► auto chuyển ongoing khi buổi 1 bắt đầu (scheduler)
Teacher/Parent/Student ────► xem lớp theo scope
```

---

## UC-EDU-08-01 — Mở lớp mới (wizard 3 bước)

| Thuộc tính | Nội dung |
|-----------|----------|
| Precondition | Course active; phòng + GV khả dụng |
| Postcondition | Lớp open kèm đầy đủ sessions + GV; sẵn sàng nhận ghi danh |

**Luồng chính**

| Bước | Actor | Hệ thống |
|------|-------|----------|
| 1 | Chọn course, sĩ số 8–16, khai giảng 04/08 | Auto-fill total_sessions, duration; sinh tên/mã lớp |
| 2 | Thiết lập slot T3/T5 18:00–19:30 + phòng | Preview 48 buổi, đánh dấu ngày lễ bỏ qua; check trùng phòng |
| 3 | Gán GV chính + trợ giảng | Check môn + trùng lịch (UC-EDU-07-02) |
| 4 | Xác nhận | Transaction: class(draft) + schedules + 48 sessions + class_teachers |
| 5 | Bấm "Mở tuyển" | Lớp → open; hiển thị cho Sales/ghi danh |

**Luồng ngoại lệ**

- E1: Conflict ở bước 2/3 → hiển thị chi tiết, không cho qua bước.
- E2: Transaction fail → rollback toàn bộ, không có lớp "nửa vời".

**BR liên quan:** BR-01, BR-02, BR-03.

---

## UC-EDU-08-02 — Chuyển lớp học viên

| Thuộc tính | Nội dung |
|-----------|----------|
| Trigger | Phụ huynh xin đổi ca học |
| Precondition | Enrollment active lớp nguồn; lớp đích cùng course/level, còn chỗ, open/ongoing |
| Postcondition | Tổng số buổi được hưởng bảo toàn; lịch sử transfer ghi nhận |

**Luồng chính**

1. Giáo vụ mở học viên → "Chuyển lớp" → chọn lớp đích (dialog so sánh lịch 2 lớp).
2. Hệ thống tính: đã học 18/48 → chuyển 30 buổi.
3. Xác nhận → transaction: enrollment cũ=transferred, enrollment mới 30 buổi (source=transfer), insert class_transfers.
4. Thông báo: Parent App (lịch mới), 2 GV (roster thay đổi). Học viên vào roster lớp mới từ buổi kế tiếp.

**Luồng ngoại lệ**

- E1: Lớp đích đầy → 409 E-CLS-02; Manager override được (log).
- E2: Khác course và khác level → 422 E-CLS-03.

**BR liên quan:** BR-05.

---

## UC-EDU-08-03 — Đóng lớp cuối khóa

| Thuộc tính | Nội dung |
|-----------|----------|
| Actor chính | Manager (Giáo vụ chuẩn bị) |
| Precondition | Checklist: 100% buổi xong, điểm danh đủ, đủ đầu điểm |
| Postcondition | Lớp completed; bảng điểm finalize; xét chứng chỉ chạy; học viên đổi trạng thái |

**Luồng chính**

1. Giáo vụ mở "Đóng lớp" → hệ thống chạy close-checklist.
2. Checklist pass → Manager confirm.
3. Transaction: finalize scores (EDU-17) → enrollments completed → student status recalculate → class completed.
4. Async: phiếu điểm PDF → phụ huynh; eligibility chứng chỉ (EDU-18); event Reporting.

**Luồng thay thế:** A1: checklist fail (thiếu điểm final 2 em) → hiển thị chính xác thiếu gì → GV bổ sung → chạy lại.

**Luồng ngoại lệ:** E1: lỗi giữa transaction → rollback toàn bộ, lớp giữ ongoing, log chi tiết.

**BR liên quan:** BR-06.

---

## UC-EDU-08-04 — Hủy lớp không đủ sĩ số

| Thuộc tính | Nội dung |
|-----------|----------|
| Trigger | Hết hạn tuyển chỉ đạt 3/8 học viên |
| Precondition | Mọi enrollment đã được xử lý (chuyển/hoàn) |
| Postcondition | Lớp cancelled kèm lý do; sessions scheduled bị hủy |

**Luồng chính**

1. Manager mở "Hủy lớp" → nhập lý do.
2. Hệ thống liệt kê 3 enrollment active → wizard xử lý từng em: chuyển lớp khác (UC-02) hoặc tạo yêu cầu hoàn phí (Finance).
3. Khi 0 enrollment active → xác nhận hủy → sessions scheduled cancelled, phòng/GV được giải phóng lịch.
4. Thông báo phụ huynh phương án đã xử lý.

**Luồng ngoại lệ**

- E1: Còn enrollment chưa xử lý → 409 E-CLS-05, chặn.
- E2: Lớp ongoing → yêu cầu approval Manager cấp cao hơn (E-CLS-06 nếu thiếu).

**BR liên quan:** BR-07.
