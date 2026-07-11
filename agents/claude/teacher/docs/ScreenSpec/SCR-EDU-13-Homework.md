# Screen Specification — EDU-13 Homework (Giao bài tập)

> Hana Edu | Version 1.0 | 2026-07-08 | Teacher App + Student App + Web
>
> Tham chiếu: `SRS/SRS-EDU-13-Homework.md`, `UseCase/UC-EDU-13-Homework.md`

---

## Danh sách màn hình

| ID | Màn hình | Loại | Nền tảng |
|----|----------|------|----------|
| SCR-EDU-13-01 | Giao bài tập | Screen | Teacher App |
| SCR-EDU-13-02 | Danh sách bài tập của lớp | Screen/Tab | Teacher App + Web |
| SCR-EDU-13-03 | Bài tập của tôi | Screen | Student App |
| SCR-EDU-13-04 | Bài tập của con | Screen | Parent App |
| SCR-EDU-13-05 | Thư viện template | Screen | Teacher App |

---

## SCR-EDU-13-01 — Teacher App: Giao bài

Mở từ: màn hoàn tất buổi (CTA) hoặc tab Homework.

```
┌────────────────────────────────┐
│ Giao bài · CAM1-2607-01        │
│ Tiêu đề *                      │
│ [Workbook trang 24-25________] │
│ Mô tả                          │
│ [__________________________]  │
│ Đính kèm                       │
│ [📷 Chụp] [🖼 Thư viện] [📎 File]│
│ ┌────┐ ┌────┐                  │
│ │IMG │ │IMG │  (preview, xóa)  │
│ └────┘ └────┘                  │
│ Hạn nộp: [T3 15/07 18:00 ▾]    │
│   (mặc định: trước buổi sau)   │
│ Giao cho: ◉ Cả lớp ○ Chọn HV   │
│ ☑ Cho phép nộp muộn            │
│ [Lưu nháp]  [GIAO BÀI]         │
│ [📋 Dùng template]              │
└────────────────────────────────┘
```

- "Chọn HV" → bottom sheet danh sách tick.
- Ảnh nén client ~1MB; tối đa 10 file, hiện dung lượng.
- Giao xong: toast "Đã giao cho 18 HV — thông báo đã gửi".

---

## SCR-EDU-13-02 — Danh sách bài tập lớp

**Teacher App + Web tab:**

```
│ ● Workbook tr.24-25 · hạn 15/07 18:00                    │
│   Nộp ▓▓▓▓░░ 12/18 · 1 muộn        [Nhắc 6 HV] [⋮]      │
│ ● Luyện nói Unit 7 (audio) · hạn 17/07                   │
│   Nộp ▓░░░░░ 3/18                  [Nhắc] [⋮]            │
│ ○ (nháp) Quiz Unit 7               [Giao] [✎] [✕]        │
│ ◌ (đã đóng) Workbook tr.20 · chấm 18/18 ✓                │
```

- Progress nộp; tap → màn theo dõi nộp (SCR-EDU-14-02).
- Menu ⋮: Sửa (log version), Gia hạn, Đóng bài, Lưu thành template.
- [Nhắc]: rate limit 1 lần/6h → disable + countdown.

---

## SCR-EDU-13-03 — Student App: Bài tập của tôi

```
┌────────────────────────────┐
│ Bài tập    [Chưa nộp][Đã nộp][Đã chấm]
│ ⚠ Sắp hết hạn               │
│ ┌────────────────────────┐ │
│ │ Workbook tr.24-25      │ │
│ │ CAM1 · hạn còn 5 giờ ⏳ │ │
│ │        [LÀM BÀI]       │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │ Luyện nói Unit 7  🎤   │ │
│ │ hạn 17/07              │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```

- 3 segment; card sắp hết hạn nổi lên đầu + đếm ngược.
- Badge trên tab bar = số bài chưa nộp.
- Tap card → chi tiết bài + nộp (SCR-EDU-14-01).

---

## SCR-EDU-13-04 — Parent App: Bài tập của con

Read-only: danh sách bài + trạng thái của con (chưa nộp/đã nộp/muộn/đã chấm kèm điểm). Bài chưa nộp gần deadline → highlight + notification đã nhận. Tap bài đã chấm → xem điểm + nhận xét + annotation (SCR-EDU-15).

---

## SCR-EDU-13-05 — Thư viện template

```
│ 🔍 tìm template                   │
│ ── Của tôi ──                     │
│ 📋 Workbook Unit 5 · dùng 8 lần   │
│ 📋 Luyện nói mẫu · dùng 3 lần     │
│ ── Trung tâm (shared) ──          │
│ 📋 Quiz cuối Unit (Manager duyệt) │
```

Tap → pre-fill form giao bài; nút "Lưu thành template" từ bài đã tạo.

---

## Trạng thái

Upload lỗi → retry từng file, giữ form. Giao bài khi lớp completed → nút disable + tooltip. Empty student: "Chưa có bài tập nào 🎉".
