# Screen Specification — EDU-14 Homework Submission (Nộp bài)

> Hana Edu | Version 1.0 | 2026-07-08 | Student App + Teacher App
>
> Tham chiếu: `SRS/SRS-EDU-14-Homework-Submission.md`, `UseCase/UC-EDU-14-Homework-Submission.md`

---

## Danh sách màn hình

| ID | Màn hình | Loại | Nền tảng |
|----|----------|------|----------|
| SCR-EDU-14-01 | Chi tiết bài + Nộp bài | Screen | Student App |
| SCR-EDU-14-02 | Theo dõi nộp bài | Screen | Teacher App + Web |
| SCR-EDU-14-03 | Nộp hộ | Bottom sheet | Teacher App |
| SCR-EDU-14-04 | Bài đã nộp / lịch sử version | Screen | Student App |

---

## SCR-EDU-14-01 — Student App: Nộp bài

```
┌────────────────────────────────┐
│ ← Workbook trang 24-25         │
│ CAM1 · Ms. Lan · hạn 15/07 18:00│
│ ────────────────────────────── │
│ Đề bài: Hoàn thành trang 24-25 │
│ [🖼 đề đính kèm — tap phóng to] │
│ ────────────────────────────── │
│ Bài làm của em                 │
│ [✏️ Nhập text...]               │
│ [📷 Chụp bài] [🎤 Ghi âm ≤5']   │
│ ┌────┐ ┌────┐                  │
│ │tr24│ │tr25│ (preview + xóa)  │
│ └────┘ └────┘                  │
│ ┌────────────────────────────┐ │
│ │         NỘP BÀI            │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

### Hành vi & trạng thái

| Tình huống | Hiển thị |
|-----------|----------|
| Đang upload | Progress từng ảnh; đứt mạng → resume; fail → giữ draft local + banner |
| Quá deadline (allow_late) | Cảnh báo vàng "Nộp muộn sẽ được đánh dấu" — vẫn nộp được |
| Quá deadline (chặn) | Nút disable + "Đã quá hạn — liên hệ giáo viên" |
| Bài quiz | Nút [Làm Quiz] → quiz engine → nộp kết quả tự động |
| Nộp thành công | Animation ✓ + "Đã nộp lúc 20:15" + nút [Nộp lại] (trước hạn) |
| Đã chấm | Khóa nộp; hiển thị điểm + nhận xét (SCR-EDU-15) |
| Bị yêu cầu làm lại | Banner cam "GV yêu cầu làm lại: <nhận xét>" + form nộp mở lại |

---

## SCR-EDU-14-02 — Teacher App: Theo dõi nộp

```
┌────────────────────────────────┐
│ Workbook tr.24-25 · hạn 15/07  │
│ [Đã nộp 12] [Chưa nộp 5] [Muộn 1]
├────────────────────────────────┤
│ (tab Đã nộp)                   │
│ ◯ Bé An · 20:15 · 2 ảnh  [Chấm]│
│ ◯ Bé Chi · 21:02 · 🎤    [Chấm]│
│ (tab Chưa nộp)                 │
│ ◯ Bé Dũng          [Nộp hộ]    │
│ ◯ Bé Em            [Nộp hộ]    │
│ [🔔 Nhắc tất cả chưa nộp]       │
│ (tab Muộn)                     │
│ ◯ Bé Giang · nộp 16/07 ⚠       │
├────────────────────────────────┤
│ [ĐÓNG BÀI & CHẤM TẤT CẢ]       │
└────────────────────────────────┘
```

- Badge số theo segment; item tap → xem bài + chấm ngay (SCR-EDU-15-01).
- [Nhắc tất cả]: disable + countdown khi rate limit 6h.
- Web: cùng dữ liệu dạng bảng, thêm cột version, thời gian nộp.

---

## SCR-EDU-14-03 — Bottom sheet Nộp hộ

```
│ Nộp hộ · Bé Dũng               │
│ [📷 Chụp bài giấy] (nhiều ảnh)  │
│ Ghi chú: [Bài làm trên lớp___] │
│           [NỘP HỘ]             │
```

Kết quả gắn nhãn "GV nộp hộ" trong mọi màn hiển thị; được phép sau deadline.

---

## SCR-EDU-14-04 — Student App: Bài đã nộp & version

```
│ Bài nộp lúc 20:15 (bản 2) ✓    │
│ [tr24] [tr25] [tr26]           │
│ ── Lịch sử ──                  │
│ Bản 2 · 20:15 (hiện tại)       │
│ Bản 1 · 19:40 [xem]            │
│ [NỘP LẠI] (trước hạn)          │
```

Nộp lại sau khi graded → nút ẩn, thay bằng "Đã chấm — không thể nộp lại".

---

## Trạng thái & thông báo

Push GV gộp ("5 bài mới · Workbook tr.24-25") tap → SCR-02. Push HV khi bị redo. Idempotent: double-tap nộp không tạo 2 bản.
