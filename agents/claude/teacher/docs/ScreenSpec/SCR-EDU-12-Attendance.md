# Screen Specification — EDU-12 Attendance (Điểm danh)

> Hana Edu | Version 1.0 | 2026-07-08 | Teacher App + Web + Parent App
>
> Tham chiếu: `SRS/SRS-EDU-12-Attendance.md`, `UseCase/UC-EDU-12-Attendance.md`

---

## Danh sách màn hình

| ID | Màn hình | Loại | Nền tảng |
|----|----------|------|----------|
| SCR-EDU-12-01 | Điểm danh buổi học | Screen | Teacher App |
| SCR-EDU-12-02 | Ma trận điểm danh lớp | Tab | Web |
| SCR-EDU-12-03 | Báo vắng cho con | Screen | Parent App |
| SCR-EDU-12-04 | Lịch sử chuyên cần học viên | Tab/Screen | Web + Parent App |

---

## SCR-EDU-12-01 — Teacher App: Điểm danh

```
┌────────────────────────────────┐
│ Điểm danh · Buổi 29 · 18:05    │
│ ✓14  ⏰1  📝1  ✕0   [Tất cả ✓] │
├────────────────────────────────┤
│ ◯ Nguyễn Minh An       [✓][⏰][📝][✕]
│ ◯ Trần Bảo Bình  ⚠PH báo vắng  [Xác nhận vắng có phép]
│ ◯ Lê Chi          ✓ 18:02      │
│ ◯ Phạm Dũng       ⏰ 18:10 +note│
│ … (16 học viên)                │
├────────────────────────────────┤
│        [LƯU ĐIỂM DANH]         │
└────────────────────────────────┘
```

### Hành vi

| Element | Hành vi |
|---------|---------|
| 4 nút trạng thái | ✓ present (xanh) / ⏰ late (vàng) / 📝 absent_excused (cam) / ✕ absent (đỏ) — tap chọn, tap lại bỏ |
| [Tất cả ✓] | Fill present toàn bộ, chỉnh lệch từng em |
| Badge "PH báo vắng" | Từ absence_report pending — 1 tap xác nhận → 📝 |
| Note | Long-press học viên → nhập ghi chú |
| Summary bar | Realtime đếm theo trạng thái |
| [Lưu] | 1 request bulk; disable khi còn HV chưa chọn — hiện "Còn 2 HV chưa điểm danh" |
| Offline | Banner vàng; lưu local, sync sau |

Sau lưu: toast "Đã điểm danh 16 HV — thông báo đã gửi phụ huynh".

---

## SCR-EDU-12-02 — Web: Ma trận điểm danh lớp

**Tab trong chi tiết lớp**

```
┌──────────────────────────────────────────────────────────┐
│ Buổi:  ◀ 21–40 ▶                    Chuyên cần TB: 92%   │
├────────────┬──┬──┬──┬──┬──┬──┬──────────────────────────┤
│ Học viên   │27│28│29│30│31│…│ Tỷ lệ                     │
│ Ng.Minh An │✓ │✓ │✓ │  │✕ │ │ 95% ▓▓▓▓▓                │
│ Trần Bình  │✓ │📝│✓ │  │  │ │ 88% ▓▓▓▓                 │
│ Lê Chi     │⏰│✓ │✕ │  │✕h│ │ 79% ▓▓▓ ⚠                │
└────────────┴──┴──┴──┴──┴──┴──┴──────────────────────────┘
```

- Cột phân trang 20 buổi; ô icon màu; ✕h = buổi hủy (không tính).
- Click ô → popover sửa: ≤24h Giáo vụ sửa được; >24h chỉ Manager + lý do (form trong popover, disable theo quyền + tooltip).
- Hàng tỷ lệ < 80% (ngưỡng chứng chỉ) → ⚠ vàng.
- Export xlsx ma trận.

---

## SCR-EDU-12-03 — Parent App: Báo vắng

```
┌──────────────────────────┐
│ Báo vắng · Bé An         │
│ Buổi học sắp tới:        │
│ ◉ T5 10/07 18:00 (buổi 29)│
│ ○ T3 15/07 18:00 (buổi 30)│
│ Lý do *                  │
│ [Bé bị sốt_____________] │
│      [GỬI BÁO VẮNG]      │
├──────────────────────────┤
│ Đã báo: T5 10/07 · chờ GV│
│ xác nhận      [Hủy báo]  │
└──────────────────────────┘
```

- Chỉ buổi tương lai; gửi xong hiện trạng thái pending → confirmed khi GV xác nhận.
- [Hủy báo] chỉ trước giờ học.

---

## SCR-EDU-12-04 — Lịch sử chuyên cần

**Web (tab học viên) + Parent App (tab của con):**

```
│ Donut: 92% chuyên cần (35✓ · 2⏰ · 1📝 · 0✕)              │
│ ───────────────────────────                               │
│ ✓ 08/07 · Buổi 28 · vào lớp 18:02                        │
│ 📝 03/07 · Buổi 27 · vắng có phép (PH báo: bé sốt)        │
│ ⏰ 01/07 · Buổi 26 · muộn 10' (kẹt xe)                    │
```

Parent App nhận notification realtime: "Bé An đã vào lớp lúc 18:02" — tap mở màn này.

---

## Cảnh báo vắng liên tiếp (Web widget)

Dashboard Giáo vụ: card "⚠ Vắng liên tiếp" — danh sách HV chạm ngưỡng 3 buổi, kèm [Gọi PH] (log CRM) + [Xem lịch sử]. Badge số trên menu.

---

## Trạng thái

Roster thay đổi (HV mới ghi danh giữa buổi mở app) → pull-refresh cập nhật. Push PH thất bại → hiển thị trong log Liên lạc (SCR-EDU-02-03) trạng thái retry/fallback.
