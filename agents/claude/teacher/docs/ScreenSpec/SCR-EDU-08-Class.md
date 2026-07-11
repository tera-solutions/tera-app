# Screen Specification — EDU-08 Class Management

> Hana Edu | Version 1.0 | 2026-07-08 | Web Admin
>
> Tham chiếu: `SRS/SRS-EDU-08-Class.md`, `UseCase/UC-EDU-08-Class.md`

---

## Danh sách màn hình

| ID | Màn hình | Loại |
|----|----------|------|
| SCR-EDU-08-01 | Danh sách lớp | Page |
| SCR-EDU-08-02 | Wizard mở lớp (3 bước) | Page |
| SCR-EDU-08-03 | Chi tiết lớp | Page (6 tabs) — màn trung tâm |
| SCR-EDU-08-04 | Dialog chuyển lớp | Dialog |
| SCR-EDU-08-05 | Dialog đóng lớp (checklist) | Dialog |
| SCR-EDU-08-06 | Wizard hủy lớp | Dialog nhiều bước |

---

## SCR-EDU-08-01 — Danh sách lớp

```
┌──────────────────────────────────────────────────────────────┐
│ Lớp học    [🔍] [Trạng thái ▾] [Khóa ▾] [GV ▾] [+ Mở lớp]   │
├──────────────────────────────────────────────────────────────┤
│ Mã lớp        | Khóa      | GV      | Sĩ số | Tiến độ | TT   │
│ CAM1-2607-01  | Starters  | Ms. Lan | 16/16 |▓▓▓░ 28/48|●ong │
│ CAM1-2608-01  | Starters  | Ms. Hoa |  9/16 |░░░░ 0/48 |●open│
│ PHO2-2606-02  | Phonics 2 | Mr. John| 12/12 |▓▓▓▓ 36/36|●comp│
├──────────────────────────────────────────────────────────────┤
│ Quick filter: [Sắp khai giảng] [Sắp kết thúc] [Thiếu sĩ số]  │
└──────────────────────────────────────────────────────────────┘
```

- Sĩ số đỏ khi < min (lớp open sắp khai giảng); tiến độ progress bar.
- Quick filter chips phục vụ vận hành (BF-02, BF-10).

---

## SCR-EDU-08-02 — Wizard mở lớp

**Route:** /edu/classes/new — stepper 3 bước, lưu state giữa bước.

**Bước 1 — Thông tin**

| Trường | Control | Hành vi |
|--------|---------|---------|
| Khóa học * | Select search (course active) | Chọn → auto-fill số buổi, thời lượng, sĩ số đề xuất |
| Tên lớp | Text | Auto từ template, editable |
| Sĩ số min/max * | 2 number | min ≤ max, 1–50 |
| Khai giảng dự kiến * | Date | ≥ hôm nay |

**Bước 2 — Lịch tuần** (embed SCR-EDU-10-01)

```
│ Slot 1: [T3 ▾] [18:00] → [19:30]  Phòng [P.101 ▾]         │
│ Slot 2: [T5 ▾] [18:00] → [19:30]  Phòng [P.101 ▾]  [+slot]│
│                                        [Xem trước 48 buổi] │
│ Preview: bảng 48 buổi · ⚠ 02/09 nghỉ lễ → dời bù          │
│ ✕ Conflict: buổi 12 trùng phòng với PHO2 → đổi slot/phòng  │
```

**Bước 3 — Giáo viên** (embed SCR-EDU-07-03)

Footer: [◀ Quay lại] [Tiếp tục ▶] / bước 3: [Hoàn tất — tạo lớp] → thành công: redirect chi tiết lớp + prompt "Mở tuyển ngay?".

---

## SCR-EDU-08-03 — Chi tiết lớp

**Route:** /edu/classes/:id

```
┌────────────────────────────────────────────────────────────────┐
│ CAM1-2607-01 · Cambridge Starters   [●ongoing]                 │
│ T3/T5 18:00–19:30 · P.101 · Ms. Lan · 16/16 HV · buổi 28/48    │
│                              [Ghi danh] [⋮: Đóng lớp/Hủy/Sửa]  │
├────────────────────────────────────────────────────────────────┤
│ [Tổng quan][Học viên][Lịch học][Điểm danh][Bài tập][Điểm số]   │
└────────────────────────────────────────────────────────────────┘
```

| Tab | Nội dung chính |
|-----|----------------|
| Tổng quan | Cards: tiến độ, chuyên cần TB, bài tập nộp đúng hạn %, buổi kế tiếp; timeline hoạt động gần đây |
| Học viên | Bảng enrollment: HV, buổi dùng x/y, chuyên cần %, trạng thái; actions: Chuyển lớp (SCR-04), Bảo lưu, Hủy |
| Lịch học | Timeline buổi (SCR-EDU-11-01); nút sửa lịch tuần (regenerate) |
| Điểm danh | Ma trận HV × buổi (SCR-EDU-12-02) |
| Bài tập | Danh sách homework + tiến độ nộp/chấm (link EDU-13/15) |
| Điểm số | Bảng điểm tổng hợp (SCR-EDU-17-02) |

Tabs lazy-load; deep-link ?tab=.

---

## SCR-EDU-08-04 — Dialog chuyển lớp

```
Học viên: Nguyễn Minh An — CAM1-2607-01 (đã học 18/48)
Lớp đích *: [CAM1-2607-02 ▾]  ← cùng course/level, còn chỗ
┌───────── So sánh ─────────┐
│           Hiện tại │ Mới  │
│ Lịch      T3/T5 18h│T2/T4 19h
│ GV        Ms. Lan  │Ms. Hoa
│ Sĩ số     16/16    │10/16 │
└───────────────────────────┘
Số buổi chuyển sang lớp mới: 30 buổi
Lý do *: [PH đổi ca làm việc____]
                    [Hủy] [Xác nhận chuyển]
```

Lớp đích đầy → option hiện mờ + "(đầy)"; Manager thấy thêm nút "Vẫn chuyển (override)".

---

## SCR-EDU-08-05 — Dialog đóng lớp

```
┌─ Đóng lớp CAM1-2607-01 ────────────────────┐
│ ✓ Buổi học hoàn tất           48/48        │
│ ✓ Điểm danh đầy đủ                          │
│ ✕ Đầu điểm: thiếu điểm Cuối khóa 2 học viên│
│   · Bé An  · Bé Bình   [→ Nhập điểm]       │
│ ───────────────────────────────────────────│
│ Khi đóng lớp: chốt bảng điểm, gửi phiếu    │
│ điểm PH, chạy xét chứng chỉ.               │
│         [Hủy]  [Đóng lớp] (disable khi ✕)  │
└────────────────────────────────────────────┘
```

Checklist gọi API realtime khi mở; nút link thẳng đến chỗ bổ sung. Sau đóng: progress toast từng bước (chốt điểm → phiếu điểm → chứng chỉ).

---

## SCR-EDU-08-06 — Wizard hủy lớp

Bước 1: lý do + cảnh báo tác động. Bước 2: bảng học viên còn enrollment active — mỗi em chọn [Chuyển lớp ▾] hoặc [Hoàn phí]; hoàn tất 100% mới next. Bước 3: xác nhận (gõ mã lớp) → hủy; lớp ongoing yêu cầu approval Manager (hiển thị trạng thái chờ duyệt).

---

## Trạng thái & phân quyền

| Element | Điều kiện |
|---------|-----------|
| Nút Mở lớp | `edu.class.create` |
| Nút Đóng lớp | `edu.class.close` (Admin/Manager) + status=ongoing |
| Nút Hủy | `edu.class.cancel`; ongoing → thêm approval |
| Ghi danh | Lớp open/ongoing + `edu.enrollment.create` |
| Teacher xem | Chỉ lớp mình, ẩn actions ghi |
