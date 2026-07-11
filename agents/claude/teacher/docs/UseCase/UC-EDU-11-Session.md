# Use Case — EDU-11 Session (Buổi học)

> Hana Edu | Version 1.0 | 2026-07-08 | Tham chiếu: `BRD - Education.md` § EDU-11, `SRS/SRS-EDU-11-Session.md`

---

## Danh mục Use Case

| ID | Tên | Actor chính |
|----|-----|-------------|
| UC-EDU-11-01 | Giáo viên vận hành buổi học (start → complete) | Teacher |
| UC-EDU-11-02 | Hủy buổi & sinh buổi bù | Giáo vụ |
| UC-EDU-11-03 | Hủy hàng loạt (nghỉ đột xuất toàn chi nhánh) | Manager |
| UC-EDU-11-04 | Điểm danh offline & đồng bộ | Teacher |

## Sơ đồ Actor – Use Case

```
Teacher (App) ────► UC-01, UC-04
Giáo vụ ────► UC-02
Manager ────► UC-03
System ────► scheduler chuyển ongoing, nhắc GV quên điểm danh, sinh make-up
Parent ────► nhận thông báo hủy/bù/nhắc lịch
```

---

## UC-EDU-11-01 — Vận hành buổi học

| Thuộc tính | Nội dung |
|-----------|----------|
| Actor chính | Teacher (GV chính hoặc substitute của buổi) |
| Trigger | Đến giờ dạy; buổi hiện trên "Buổi hôm nay" của Teacher App |
| Precondition | Session ongoing (scheduler tự chuyển đúng giờ) |
| Postcondition | Buổi completed; used_sessions cập nhật; giờ dạy ghi nhận |

**Luồng chính**

| Bước | Actor | Hệ thống |
|------|-------|----------|
| 1 | Mở app trước giờ dạy | Hiển thị buổi + nội dung syllabus buổi này |
| 2 | Bấm "Bắt đầu" | Validate GV + khung giờ → started_at |
| 3 | Điểm danh từng học viên (UC-EDU-12-01) | Ghi attendance, push phụ huynh |
| 4 | Ghi chú nội dung thực dạy | Lưu teacher_note |
| 5 | Bấm "Hoàn tất" | Validate 100% điểm danh → completed → used_sessions +1 (present/late), event giờ dạy HR, tiến độ lớp +1 |

**Luồng thay thế:** A1 (bước 2): GV quên bấm start quá 30' → hệ thống push nhắc GV + cảnh báo Giáo vụ.

**Luồng ngoại lệ**

- E1 (bước 5): thiếu điểm danh → 422 E-SES-02 kèm danh sách học viên thiếu.
- E2: GV khác bấm → 403 E-SES-01.
- E3 (bước 2): ngoài khung ±X phút → 422 E-SES-03 (Giáo vụ hỗ trợ trên web).

**BR liên quan:** BR-02, BR-04, BR-06.

---

## UC-EDU-11-02 — Hủy buổi & sinh buổi bù

| Thuộc tính | Nội dung |
|-----------|----------|
| Trigger | GV ốm không tìm được dạy thay / sự cố phòng |
| Precondition | Buổi scheduled/ongoing, chưa có attendance |
| Postcondition | Buổi cancelled; make-up sinh cuối chuỗi; tổng buổi lớp không đổi |

**Luồng chính**

1. Giáo vụ /cancel + lý do (≥10 ký tự).
2. Hệ thống sinh make-up: slot kế tiếp sau buổi cuối lớp, is_makeup=true, check conflict như thường.
3. Push Parent App + SMS: buổi hủy + lịch buổi bù.

**Luồng thay thế:** A1: thay vì hủy, gán dạy thay (UC-EDU-07-03) — ưu tiên khuyến nghị trên UI.

**Ngoại lệ:** make-up conflict → 409 E-SES-05 kèm đề xuất slot trống gần nhất; buổi đã completed → 409 E-SES-04.

**BR liên quan:** BR-05.

---

## UC-EDU-11-03 — Hủy hàng loạt

| Thuộc tính | Nội dung |
|-----------|----------|
| Trigger | Bão, cúp điện, sự kiện bất khả kháng |
| Postcondition | Mọi buổi trong ngày của chi nhánh cancelled; buổi bù sinh cho từng lớp; thông báo gộp |

**Luồng chính**

1. Manager /bulk-cancel {chi nhánh, ngày, lý do} → xác nhận danh sách 12 buổi ảnh hưởng.
2. Queue xử lý từng buổi (như UC-02); tổng hợp buổi bù theo lớp.
3. Thông báo GỘP mỗi phụ huynh 1 tin (kể cả có 2 con học 2 lớp), kèm lịch bù.
4. Dashboard Giáo vụ: danh sách 12 buổi bù chờ rà soát lịch.

**Ngoại lệ:** một số make-up conflict → các buổi đó ở trạng thái chờ xếp, Giáo vụ xử lý tay.

---

## UC-EDU-11-04 — Điểm danh offline & đồng bộ

| Thuộc tính | Nội dung |
|-----------|----------|
| Trigger | Mất mạng tại phòng học |
| Precondition | App đã pre-fetch buổi hôm nay + roster |
| Postcondition | Dữ liệu sync đầy đủ, đúng thứ tự, không nhân bản |

**Luồng chính**

1. GV thao tác bình thường (start → điểm danh → note → complete) — app ghi local queue kèm client_request_id.
2. Có mạng lại → app sync batch theo thứ tự.
3. Server xử lý idempotent → trả kết quả từng item → app xóa queue, cập nhật UI.
4. Notification phụ huynh gửi tại thời điểm sync (đánh dấu thời gian thực tế thao tác).

**Ngoại lệ:** conflict với dữ liệu server (Giáo vụ đã sửa trên web) → server-wins, app hiển thị diff cảnh báo GV; retry sync → không nhân bản (idempotency).
