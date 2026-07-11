# Screen Specification — EDU-07 Teacher (Hồ sơ & Phân công)

> Hana Edu | Version 1.0 | 2026-07-08 | Web Admin + Teacher App
>
> Tham chiếu: `SRS/SRS-EDU-07-Teacher.md`, `UseCase/UC-EDU-07-Teacher.md`

---

## Danh sách màn hình

| ID | Màn hình | Loại | Nền tảng |
|----|----------|------|----------|
| SCR-EDU-07-01 | Danh sách giáo viên | Page | Web |
| SCR-EDU-07-02 | Hồ sơ giáo viên | Page (tabs) | Web |
| SCR-EDU-07-03 | Dialog phân công lớp | Dialog | Web |
| SCR-EDU-07-04 | Dialog dạy thay | Dialog | Web |
| SCR-EDU-07-05 | Lịch dạy của tôi | Screen | Teacher App |

---

## SCR-EDU-07-01 — Danh sách giáo viên

**Quyền:** `edu.teacher.view` | View: card grid

```
┌────────────────────────────────────────────────────┐
│ Giáo viên            [🔍] [Loại ▾] [Môn ▾] [+ Tạo] │
├────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│ │  ◯ ảnh  │ │  ◯ ảnh  │ │  ◯ ảnh  │               │
│ │ Ms. Lan │ │ Mr. John│ │ Ms. Hoa │               │
│ │ [VN]    │ │ [Native]│ │ [TG]    │               │
│ │ CAM,PHO │ │ CAM     │ │ PHO     │               │
│ │ 3 lớp   │ │ 2 lớp   │ │ 4 lớp   │               │
│ └─────────┘ └─────────┘ └─────────┘               │
└────────────────────────────────────────────────────┘
```

Badge loại: VN=xanh, Native=tím, TG (trợ giảng)=xám.

---

## SCR-EDU-07-02 — Hồ sơ giáo viên

**Route:** /edu/teachers/:id

| Tab | Nội dung |
|-----|----------|
| Hồ sơ | Thông tin chuyên môn: loại, bằng cấp, chứng chỉ (list file có preview pdf), môn dạy (chips), bio; link hồ sơ nhân sự HR (nếu có quyền) |
| Lớp phụ trách | Bảng lớp đang dạy: vai trò (chính/TG), từ ngày, tiến độ lớp; lịch sử lớp cũ collapse |
| Lịch dạy | Calendar tuần: block buổi (lớp, phòng); badge "thay" với buổi dạy thay |
| Giờ dạy | Chọn tháng → tổng giờ + breakdown theo lớp + nút Export (quyền teaching-hours) |

Form sửa: certificates upload (pdf/jpg ≤5MB), môn dạy ≥1 (chips chọn từ subject active).

---

## SCR-EDU-07-03 — Dialog phân công lớp

Mở từ chi tiết lớp hoặc wizard bước 3:

```
Lớp: CAM1-2608-01 (Cambridge Starters · T3/T5 18:00)
GV chính *:  [Ms. Lan ▾]   ← chỉ hiện GV dạy môn CAM, active
Trợ giảng:   [+ chọn]
─────────────────────────────
✓ Ms. Lan rảnh toàn bộ 48 buổi
  (hoặc)
✕ Trùng lịch 3 buổi với lớp PHO2-2606-02:
  · 15/07 18:00 · 17/07 18:00 · 22/07 18:00
  [Chọn GV khác]  [Xem lịch GV]
─────────────────────────────
Lý do thay đổi: [_________] (hiện khi đổi GV giữa khóa)
                     [Hủy] [Phân công]
```

Check trùng chạy ngay khi chọn GV (async) — kết quả inline, nút Phân công disable khi conflict.

---

## SCR-EDU-07-04 — Dialog dạy thay

```
Buổi: #15 · 15/07 18:00–19:30 · P.101 · CAM1-2608-01
GV hiện tại: Ms. Lan
GV dạy thay *: [Mr. John ▾]  ✓ rảnh khung giờ này
   (danh sách chỉ gồm GV cùng môn, kèm trạng thái rảnh/bận)
Lý do *: [GV chính nghỉ ốm_______]
                     [Hủy] [Xác nhận]
```

Sau xác nhận: buổi hiện badge "Dạy thay: Mr. John"; push 2 GV + Parent App.

---

## SCR-EDU-07-05 — Teacher App: Lịch dạy của tôi

```
┌──────────────────────────┐
│ Lịch dạy      [Tuần|Tháng]│
│ ◀ 06–12/07 ▶             │
│ ────────────────────────  │
│ T3 08/07                  │
│ ┌──────────────────────┐  │
│ │18:00 CAM1 · P.101    │  │
│ │Buổi 12/48 · 18 HV    │  │
│ └──────────────────────┘  │
│ T5 10/07                  │
│ ┌──────────────────────┐  │
│ │18:00 CAM1 · P.101 [thay]│
│ └──────────────────────┘  │
│ ────────────────────────  │
│ Giờ dạy tháng 7: 24h     │
└──────────────────────────┘
```

- Card buổi tap → màn buổi học (SCR-EDU-11-02).
- Buổi được nhờ dạy thay: badge cam [thay].
- Pull-to-refresh; giờ dạy tháng ở footer.

---

## Trạng thái & phân quyền

Employee nghỉ việc → banner đỏ trên hồ sơ "Đã nghỉ việc — inactive" + danh sách lớp cần bàn giao. Nút phân công chỉ hiện với `edu.teacher.assign`. GV chỉ xem được hồ sơ + lịch + giờ dạy của mình trên app.
