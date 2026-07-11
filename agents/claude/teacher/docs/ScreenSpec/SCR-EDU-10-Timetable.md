# Screen Specification — EDU-10 Timetable

> Hana Edu | Version 1.0 | 2026-07-08 | Web Admin
>
> Tham chiếu: `SRS/SRS-EDU-10-Timetable.md`, `UseCase/UC-EDU-10-Timetable.md`

---

## Danh sách màn hình

| ID | Màn hình | Loại |
|----|----------|------|
| SCR-EDU-10-01 | Thiết lập lịch tuần + Preview | Component (wizard bước 2 / tab Lịch học) |
| SCR-EDU-10-02 | Calendar tổng chi nhánh | Page |
| SCR-EDU-10-03 | Dialog sửa lịch tuần giữa khóa | Dialog |
| SCR-EDU-10-04 | Dialog dời 1 buổi | Dialog |
| SCR-EDU-10-05 | Quản lý ngày nghỉ lễ | Page (Setting) |

---

## SCR-EDU-10-01 — Thiết lập lịch tuần + Preview

```
┌─ Lịch học hàng tuần ───────────────────────────────────┐
│ Slot 1  [Thứ 3 ▾] [18:00 ▾]→[19:30 ▾] [P.101 ▾] [Ms.Lan▾] ✕
│ Slot 2  [Thứ 5 ▾] [18:00 ▾]→[19:30 ▾] [P.101 ▾] [Ms.Lan▾] ✕
│ [+ Thêm slot]                                          │
│ Khai giảng: 04/08/2026 · Tổng: 48 buổi                 │
│                              [Xem trước danh sách buổi]│
├─ Preview ──────────────────────────────────────────────┤
│ #  | Ngày       | Giờ    | Phòng | GV      | Ghi chú   │
│ 1  | T3 04/08   | 18:00  | P.101 | Ms.Lan  |           │
│ …  |            |        |       |         |           │
│ ⚠  | T4 02/09   | —      | —     | —       | Nghỉ lễ QK│
│ 48 | T5 14/01/27| 18:00  | P.101 | Ms.Lan  | (dời bù)  │
├────────────────────────────────────────────────────────┤
│ ✓ Không có xung đột            [Xác nhận & Sinh buổi]  │
│ (hoặc)                                                 │
│ ✕ 2 xung đột:                                          │
│  · Buổi 12 — P.101 trùng lớp PHO2 (17/09 18:00)        │
│  · Buổi 20 — Ms.Lan trùng lớp GT1 (15/10 18:00)        │
│  → Không thể sinh buổi. Đổi slot/phòng/GV.             │
└────────────────────────────────────────────────────────┘
```

- Selects phòng/GV load theo chi nhánh + môn; validate slot ngay (≥30', không tự trùng).
- Preview scroll virtual (48–500 dòng); dòng lễ nền vàng; dòng dời bù chú thích.
- Conflict: nút sinh disable; click dòng conflict mở popover buổi xung đột.

---

## SCR-EDU-10-02 — Calendar tổng chi nhánh

**Route:** /edu/timetable

```
┌────────────────────────────────────────────────────────────┐
│ ◀ 06–12/07 ▶  [Tuần|Tháng] [CN: Q12 ▾][Phòng ▾][GV ▾][Lớp ▾]│
├────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┤
│    │ T2   │ T3   │ T4   │ T5   │ T6   │ T7   │ CN   │
│8h  │      │      │      │      │      │▓GT-K1│▓GT-K1│
│…   │      │      │      │      │      │      │      │
│18h │▓PHO2 │▓CAM1 │▓PHO2 │▓CAM1 │      │      │      │
│19h │      │▓GT1  │      │▓GT1  │      │      │      │
└────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┘
```

- Block màu theo lớp (hash mã lớp); nội dung: mã lớp, phòng, GV.
- Click block → popover: chi tiết buổi + [Dời buổi] [Dạy thay] [Mở lớp].
- Giới hạn range 62 ngày; view Tháng: dạng mini-block đếm số buổi/ngày.

---

## SCR-EDU-10-03 — Dialog sửa lịch tuần giữa khóa

```
Lớp CAM1-2607-01 — đã học 28/48 buổi
Lịch hiện tại: T3/T5 18:00 → Lịch mới: [T2 ▾][T4 ▾] [19:00]
Áp dụng từ: [01/10/2026 ▾]
────────────────────────────────
Tác động: 20 buổi tương lai sẽ sinh lại theo lịch mới
⚠ 1 buổi không thể tự xử lý (đã có bài tập gắn): buổi 30
   → xử lý thủ công sau khi xác nhận
[Preview 20 buổi mới]  ✓ không xung đột
                     [Hủy] [Xác nhận đổi lịch]
```

Sau xác nhận: progress → hoàn tất → thông báo PH tự gửi; buổi cần xử lý tay vào danh sách nhắc việc.

---

## SCR-EDU-10-04 — Dialog dời 1 buổi

```
Buổi #15 · T3 15/09 18:00–19:30 · P.101 · Ms. Lan
Dời sang *: [16/09/2026] [18:00]→[19:30]
Phòng:      [P.101 ▾] ✓ trống      GV: [giữ nguyên ▾] ✓ rảnh
Lý do *:    [GV bận việc đột xuất____]
⚠ Thông báo sẽ gửi PH ngay (yêu cầu báo trước ≥ 12h — còn 26h ✓)
                     [Hủy] [Xác nhận dời buổi]
```

Check phòng + GV async khi đổi giá trị; vi phạm min_notice → cảnh báo đỏ, chỉ Manager thấy nút [Vẫn dời].

---

## SCR-EDU-10-05 — Ngày nghỉ lễ

**Route:** /settings/holidays (module System, Education tiêu thụ)

```
│ Ngày       | Tên            | Lặp hàng năm |    │
│ 02/09      | Quốc khánh     | ✓            | ✕  │
│ 20/07/2026 | Nghỉ sự kiện   | —            | ✕  │
│ [+ Thêm ngày nghỉ]                              │
```

Thêm ngày mới trùng buổi đã xếp → dialog cảnh báo liệt kê buổi ảnh hưởng (từ job) + link xử lý từng buổi.

---

## Trạng thái

Preview loading: spinner + "Đang kiểm tra 48 buổi…". Calendar empty: "Không có buổi học trong khoảng này". Lỗi generate giữa chừng: toast + không có buổi nào được tạo (all-or-nothing).
