# Use Case — EDU-10 Timetable

> Hana Edu | Version 1.0 | 2026-07-08 | Tham chiếu: `BRD - Education.md` § EDU-10, `SRS/SRS-EDU-10-Timetable.md`

---

## Danh mục Use Case

| ID | Tên | Actor chính |
|----|-----|-------------|
| UC-EDU-10-01 | Thiết lập lịch tuần & sinh buổi học | Giáo vụ |
| UC-EDU-10-02 | Sửa lịch tuần giữa khóa | Giáo vụ |
| UC-EDU-10-03 | Dời 1 buổi học | Giáo vụ |
| UC-EDU-10-04 | Quản lý ngày nghỉ lễ | Admin |
| UC-EDU-10-05 | Xem calendar tổng chi nhánh | Giáo vụ/Manager |

## Sơ đồ Actor – Use Case

```
Giáo vụ ────► UC-01, UC-02, UC-03, UC-05
Admin ────► UC-04
System ────► sinh buổi, check xung đột, cảnh báo lễ mới
Teacher/Parent/Student ────► xem lịch theo scope; nhận thông báo đổi lịch
```

---

## UC-EDU-10-01 — Thiết lập lịch tuần & sinh buổi

| Thuộc tính | Nội dung |
|-----------|----------|
| Trigger | Bước 2 wizard mở lớp |
| Precondition | Phòng + GV chọn sẵn từng slot |
| Postcondition | Đủ total_sessions buổi, không xung đột, né ngày lễ |

**Luồng chính**

| Bước | Actor | Hệ thống |
|------|-------|----------|
| 1 | Thêm slot: T3 18:00–19:30 P.101; T5 18:00–19:30 P.101 | Validate slot (≥30', không tự trùng) |
| 2 | Bấm Preview | Chạy thuật toán: từ 04/08, match thứ, skip lễ → danh sách 48 buổi + ngày lễ bỏ qua |
| 3 | — | Batch check trùng phòng + GV (2 query gộp) |
| 4 | Xác nhận Generate | Bulk insert 48 sessions (all-or-nothing, transaction + lock) |

**Luồng ngoại lệ**

- E1: ≥1 buổi conflict → 409 E-TTB-02 danh sách đầy đủ, không sinh buổi nào → đổi slot/phòng/GV rồi preview lại.
- E2: start_date không khớp thứ nào trong slot → 422 E-TTB-03.

**BR liên quan:** BR-01, BR-02, BR-03.

---

## UC-EDU-10-02 — Sửa lịch tuần giữa khóa

| Thuộc tính | Nội dung |
|-----------|----------|
| Trigger | Từ tháng 10 lớp đổi sang T2/T4 |
| Postcondition | Buổi đã học giữ nguyên; buổi tương lai theo lịch mới; số thứ tự liên tục |

**Luồng chính**

1. Giáo vụ sửa slots → hệ thống xác định 20 buổi scheduled tương lai chưa có dữ liệu.
2. Preview lịch mới cho phần còn lại → check conflict → xác nhận.
3. Regenerate: xóa 20 buổi cũ, sinh 20 buổi mới, session_number 29–48 liên tục.
4. Thông báo phụ huynh + GV lịch mới (trước ≥ X giờ cấu hình).

**Ngoại lệ:** buổi tương lai đã có điểm danh trước/homework → E-TTB-04, liệt kê, xử lý tay từng buổi.

**BR liên quan:** BR-04.

---

## UC-EDU-10-03 — Dời 1 buổi học

**Trigger:** GV bận, sự kiện chi nhánh.

**Luồng chính:** mở buổi 15/09 → Reschedule → chọn 16/09 cùng giờ (hoặc đổi phòng/GV) + lý do → check conflict → lưu → push Parent App + Teacher App + SMS (theo Setting).

**Ngoại lệ:** buổi đã diễn ra → 422 E-TTB-05; notice < min_notice_hours → 422 E-TTB-06 (Manager override); giờ mới trùng lịch GV → 409.

**BR liên quan:** BR-05.

---

## UC-EDU-10-04 — Quản lý ngày nghỉ lễ

**Luồng chính:** Admin thêm holiday (02/09, is_recurring) → các preview/generate sau tự né → job đêm quét session scheduled rơi vào lễ mới thêm → alert Giáo vụ danh sách buổi cần dời (không tự dời).

---

## UC-EDU-10-05 — Xem calendar tổng

**Luồng chính:** chọn chi nhánh + tuần → calendar block theo lớp (màu), filter phòng/GV/lớp → click block mở chi tiết buổi → phát hiện khung trống hoặc chồng chéo.

**Giới hạn:** khoảng xem ≤ 62 ngày.
