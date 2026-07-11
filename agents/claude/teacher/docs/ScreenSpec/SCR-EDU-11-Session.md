# Screen Specification — EDU-11 Session (Buổi học)

> Hana Edu | Version 1.0 | 2026-07-08 | Web Admin + Teacher App (#0066CC)
>
> Tham chiếu: `SRS/SRS-EDU-11-Session.md`, `UseCase/UC-EDU-11-Session.md`

---

## Danh sách màn hình

| ID | Màn hình | Loại | Nền tảng |
|----|----------|------|----------|
| SCR-EDU-11-01 | Timeline buổi học (tab Lịch học) | Tab | Web |
| SCR-EDU-11-02 | Buổi học hôm nay | Screen | Teacher App |
| SCR-EDU-11-03 | Chi tiết buổi + vận hành | Screen | Teacher App |
| SCR-EDU-11-04 | Dialog hủy buổi / bulk hủy | Dialog | Web |

---

## SCR-EDU-11-01 — Timeline buổi (Web, tab trong chi tiết lớp)

```
│ ✓ #27 · T5 03/07 · P.101 · Ms.Lan · 16/16 ✓hoàn tất       │
│ ✓ #28 · T3 08/07 · P.101 · Ms.Lan · 15/16 (1 vắng)        │
│ ▶ #29 · T5 10/07 · P.101 · Ms.Lan · đang diễn ra          │
│ ○ #30 · T3 15/07 · P.101 · Mr.John [thay] · [⋮]           │
│ ✕ #31 · T5 17/07 · đã hủy (bão) → bù #49                  │
│ ○ #49 · T3 20/01/27 · buổi bù [makeup]                    │
```

- Icon trạng thái: ✓ completed / ▶ ongoing / ○ scheduled / ✕ cancelled.
- Menu ⋮ (buổi scheduled): Dời buổi (SCR-EDU-10-04), Dạy thay (SCR-EDU-07-04), Hủy buổi (SCR-04).
- Click buổi → drawer: nội dung syllabus, note GV, điểm danh, bài tập buổi đó.

---

## SCR-EDU-11-02 — Teacher App: Buổi học hôm nay (Dashboard block)

```
┌────────────────────────────┐
│ Hôm nay · T5 10/07         │
│ ┌────────────────────────┐ │
│ │ 🕕 18:00–19:30          │ │
│ │ CAM1-2607-01 · P.101   │ │
│ │ Buổi 29/48 · 16 HV     │ │
│ │ Unit 7: My Family      │ │
│ │ ┌────────────────────┐ │ │
│ │ │   ▶ BẮT ĐẦU BUỔI   │ │ │
│ │ └────────────────────┘ │ │
│ └────────────────────────┘ │
│ (không có buổi: "Hôm nay   │
│  bạn không có lịch dạy 🎉") │
└────────────────────────────┘
```

- Nút Bắt đầu: enable trong khung ±X phút (ngoài khung: disable + đếm ngược).
- Đã pre-fetch roster để điểm danh offline.

---

## SCR-EDU-11-03 — Teacher App: Vận hành buổi (flow 3 bước)

```
Step bar:  [① Bắt đầu] ─ [② Điểm danh] ─ [③ Hoàn tất]

② Điểm danh → SCR-EDU-12-01

③ Hoàn tất:
┌────────────────────────────┐
│ Điểm danh: 15 ✓ · 1 vắng   │
│ Nội dung buổi học           │
│ [Unit 7: My Family_______] │
│ Ghi chú thực dạy            │
│ [Đã dạy hết trang 45______]│
│ ┌────────────────────────┐ │
│ │    ✓ HOÀN TẤT BUỔI     │ │
│ └────────────────────────┘ │
│ (thiếu điểm danh → nút     │
│  disable + "Còn 2 HV chưa  │
│  điểm danh [→ điểm danh]") │
└────────────────────────────┘
```

- Offline: banner vàng "Ngoại tuyến — dữ liệu sẽ đồng bộ khi có mạng"; mọi nút vẫn hoạt động.
- Sau hoàn tất: màn tổng kết + CTA "Giao bài tập cho buổi này" (SCR-EDU-13-01).

---

## SCR-EDU-11-04 — Dialog hủy buổi / Bulk hủy (Web)

**Hủy 1 buổi:**

```
Buổi #31 · 17/07 18:00 · CAM1-2607-01
Lý do *: [Bão — nghỉ theo thông báo____] (≥10 ký tự)
Buổi bù dự kiến: T3 20/01/2027 18:00 · P.101 ✓ trống
⚠ PH sẽ nhận thông báo hủy + lịch bù ngay
                  [Hủy bỏ] [Xác nhận hủy buổi]
```

**Bulk hủy (Manager):**

```
Chi nhánh: [Q12 ▾]  Ngày: [20/07/2026]
12 buổi sẽ bị hủy: (danh sách thu gọn, expand xem)
Lý do *: [___________]
☑ Tự sinh buổi bù cuối chuỗi từng lớp
☑ Gửi thông báo gộp cho phụ huynh
                  [Hủy bỏ] [Xác nhận hủy 12 buổi]
```

Sau xác nhận: progress từng buổi; buổi bù conflict → đánh dấu "chờ xếp" vào danh sách nhắc việc.

---

## Trạng thái đặc biệt

| Tình huống | Hiển thị |
|-----------|----------|
| GV quên điểm danh 30' | Push GV + badge đỏ trên card buổi (Giáo vụ dashboard) |
| Sync offline thất bại item | Màn "Chờ đồng bộ" trong app: danh sách thao tác pending + retry |
| Conflict server-wins | Dialog diff "Giáo vụ đã sửa dữ liệu buổi này" |
