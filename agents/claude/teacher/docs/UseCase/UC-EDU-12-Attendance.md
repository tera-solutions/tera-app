# Use Case — EDU-12 Attendance (Điểm danh)

> Hana Edu | Version 1.0 | 2026-07-08 | Tham chiếu: `BRD - Education.md` § EDU-12, `SRS/SRS-EDU-12-Attendance.md`

---

## Danh mục Use Case

| ID | Tên | Actor chính |
|----|-----|-------------|
| UC-EDU-12-01 | Điểm danh nhanh trên Teacher App | Teacher |
| UC-EDU-12-02 | Phụ huynh báo vắng trước | Parent |
| UC-EDU-12-03 | Sửa điểm danh sau chốt | Manager |
| UC-EDU-12-04 | Cảnh báo vắng liên tiếp | System |

## Sơ đồ Actor – Use Case

```
Teacher ────► UC-01 (+ xác nhận báo vắng)
Parent ────► UC-02; nhận thông báo realtime từ UC-01
Manager ────► UC-03
System ────► UC-04; đẩy notification
Giáo vụ/Sales ────► nhận cảnh báo UC-04; xem ma trận chuyên cần
```

---

## UC-EDU-12-01 — Điểm danh nhanh

| Thuộc tính | Nội dung |
|-----------|----------|
| Actor chính | Teacher (GV của buổi) |
| Precondition | Session ongoing; roster = enrollment active tại buổi |
| Postcondition | Mỗi học viên đúng 1 bản ghi; phụ huynh nhận thông báo ≤ 1 phút |

**Luồng chính**

| Bước | Actor | Hệ thống |
|------|-------|----------|
| 1 | Mở màn điểm danh | Load roster (avatar, tên) + badge "báo vắng" nếu có UC-02 |
| 2 | Bấm "Tất cả có mặt" | FE fill present toàn bộ |
| 3 | Chỉnh 2 em: 1 late, 1 absent + note | Đổi trạng thái chip màu |
| 4 | Lưu | PUT bulk 1 request → upsert 20 records |
| 5 | — | Queue: 18 push "đến lớp 18:02", 1 push "đến muộn", 1 push "vắng"; summary bar cập nhật |

**Luồng thay thế:** A1: học viên có báo vắng pending → GV tap xác nhận → absent_excused.

**Luồng ngoại lệ**

- E1: session chưa ongoing → 403 E-ATT-01.
- E2: học viên vừa bị hủy enrollment → 422 E-ATT-02, refresh roster.
- E3: 2 thiết bị cùng ghi → bản sau thắng theo unique key, log cả hai.

**BR liên quan:** BR-01, BR-02, BR-04.

---

## UC-EDU-12-02 — Phụ huynh báo vắng trước

| Thuộc tính | Nội dung |
|-----------|----------|
| Actor chính | Parent (Parent App) |
| Trigger | Con ốm/bận trước buổi học |
| Precondition | Buổi tương lai của con |
| Postcondition | absence_report pending; GV thấy sẵn trên roster |

**Luồng chính**

1. PH mở lịch học của con → chọn buổi mai → "Báo vắng" + lý do.
2. Hệ thống tạo report pending → notify GV lớp.
3. Buổi học: roster hiện badge "PH báo vắng" → GV xác nhận 1 tap → attendance = absent_excused, report = confirmed.

**Ngoại lệ:** báo vắng buổi đã diễn ra → 422 E-ATT-05; PH hủy báo vắng trước giờ học → report xóa, badge biến mất.

**BR liên quan:** BR-01 (absent_excused), FR-03.

---

## UC-EDU-12-03 — Sửa điểm danh sau chốt

| Thuộc tính | Nội dung |
|-----------|----------|
| Actor chính | Manager (>24h); Giáo vụ (≤24h) |
| Trigger | Phát hiện điểm danh nhầm |
| Postcondition | Bản ghi sửa kèm log; used_sessions recalculate; PH nhận đính chính |

**Luồng chính**

1. Mở ma trận điểm danh lớp → click ô sai (absent → present).
2. ≤24h sau buổi completed: Giáo vụ sửa trực tiếp; >24h: chỉ Manager + edit_reason bắt buộc.
3. Hệ thống ghi edited_by/edit_reason → recalculate used_sessions enrollment → nếu đổi nhóm có mặt↔vắng: push đính chính phụ huynh.

**Ngoại lệ:** Giáo vụ sửa sau 24h → 403 E-ATT-03; thiếu lý do → 422 E-ATT-04.

**BR liên quan:** BR-02, BR-05.

---

## UC-EDU-12-04 — Cảnh báo vắng liên tiếp

| Thuộc tính | Nội dung |
|-----------|----------|
| Actor | System (rule engine sau mỗi lần ghi attendance) |
| Postcondition | Giáo vụ + Sales nhận cảnh báo đúng 1 lần cho mỗi chuỗi |

**Luồng chính**

1. Sau mỗi attendance absent (không phép): đếm chuỗi absent liên tiếp gần nhất trong lớp.
2. Chuỗi = 3 (Setting) → event `ConsecutiveAbsenceAlert` → notification Giáo vụ + Sales phụ trách phụ huynh.
3. Sales gọi chăm sóc → ghi kết quả vào CRM (follow-up).
4. Chuỗi tiếp tục tăng (4, 5...) → không lặp cảnh báo; reset khi có buổi present.

**BR liên quan:** BR-06.
