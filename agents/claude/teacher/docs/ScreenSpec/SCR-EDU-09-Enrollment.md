# Screen Specification — EDU-09 Enrollment

> Hana Edu | Version 1.0 | 2026-07-08 | Web Admin + Parent App
>
> Tham chiếu: `SRS/SRS-EDU-09-Enrollment.md`, `UseCase/UC-EDU-09-Enrollment.md`

---

## Danh sách màn hình

| ID | Màn hình | Loại |
|----|----------|------|
| SCR-EDU-09-01 | Dialog ghi danh | Dialog 3 phần |
| SCR-EDU-09-02 | Danh sách chờ xếp lớp | Page |
| SCR-EDU-09-03 | Dialog bảo lưu / kích hoạt lại | Dialog |
| SCR-EDU-09-04 | Dialog hủy ghi danh | Dialog |
| SCR-EDU-09-05 | Thông tin ghi danh của con | Parent App |

---

## SCR-EDU-09-01 — Dialog ghi danh

Mở từ: chi tiết lớp [Ghi danh], chi tiết học viên, hoặc danh sách chờ xếp lớp.

```
┌─ Ghi danh ─────────────────────────────────────┐
│ 1. Học viên *  [🔍 HS2600101 — Ng.Minh An ✓]   │
│    ✓ Có phụ huynh liên kết                      │
│ 2. Lớp *       [CAM1-2608-01 ▾]                 │
│    T3/T5 18:00 · Ms. Hoa · còn 7 chỗ · KG 04/08 │
│ 3. Thanh toán                                   │
│    Invoice #889: đã trả 5.000.000/10.000.000    │
│    ██████░░░░ 50% — ✓ đạt ngưỡng (50%)          │
│    Số buổi theo gói: 48                         │
│                        [Hủy] [Xác nhận ghi danh]│
└─────────────────────────────────────────────────┘
```

### Trạng thái panel thanh toán

| Tình huống | Hiển thị |
|-----------|----------|
| Đủ điều kiện | ✓ xanh + nút enable |
| Chưa đủ | ✕ đỏ "Còn thiếu 3.000.000 để đạt ngưỡng" + [Mở invoice] — nút ghi danh disable |
| Chưa có invoice | Cảnh báo + [Tạo invoice] (link FIN) |
| Finance timeout | Banner "Không kiểm tra được thanh toán" + [Thử lại] |

Lớp đầy → option "(đầy)"; Manager có [Override kèm lý do].

---

## SCR-EDU-09-02 — Danh sách chờ xếp lớp

**Route:** /edu/enrollments/pending — nguồn: auto-enrollment không có lớp chỉ định (pending_placements).

```
│ Học viên   | Đã thanh toán | Số buổi | Chờ từ  | Level gợi ý |     │
│ Bé An      | 100%          | 48      | 3 ngày ⚠| Starters    |[Xếp]│
```

- Cột "Chờ từ" đỏ khi > N ngày (Setting); [Xếp lớp] → mở SCR-01 pre-fill học viên.
- Badge tổng số chờ hiển thị trên menu điều hướng.

---

## SCR-EDU-09-03 — Dialog bảo lưu / kích hoạt lại

**Bảo lưu:** lý do* + ngày dự kiến quay lại* → cảnh báo "HV sẽ rời roster từ buổi kế tiếp; còn lại 30 buổi được bảo lưu".

**Kích hoạt lại:** chọn lớp mới (cùng level, còn chỗ, hiển thị so sánh lịch) → "Enrollment mới với 30 buổi còn lại" → xác nhận.

---

## SCR-EDU-09-04 — Dialog hủy ghi danh

```
Học viên: Bé An — CAM1-2607-01
Đã học: 5 buổi (3 có mặt, 1 muộn, 1 vắng có phép)
Số buổi chưa học: 43 ── gửi Finance tính hoàn phí
Lý do *: [Gia đình chuyển nhà______]
⚠ Thao tác không thể hoàn tác. Yêu cầu hoàn phí sẽ được
  tạo bên Tài chính và xử lý theo chính sách.
                        [Hủy] [Xác nhận hủy ghi danh]
```

Sau xác nhận: nếu HV không còn enrollment active → dialog phụ chọn trạng thái học viên (pending/dropped).

**Quyền:** `edu.enrollment.cancel` (Manager) — Giáo vụ thấy nút disable + tooltip.

---

## SCR-EDU-09-05 — Parent App: Ghi danh của con

```
┌──────────────────────────┐
│ Bé An · Lớp học           │
│ ┌──────────────────────┐ │
│ │ CAM1-2607-01         │ │
│ │ Cambridge Starters   │ │
│ │ T3/T5 18:00 · Ms.Lan │ │
│ │ Buổi: ▓▓▓░ 18/48     │ │
│ │ ⚠ Còn 5 buổi — gia   │ │
│ │   hạn khóa học? [Xem]│ │
│ └──────────────────────┘ │
│ Lịch sử khóa đã học ▾    │
└──────────────────────────┘
```

- Cảnh báo "còn ≤5 buổi" (BF-10) kèm CTA xem khóa gợi ý.
- Lịch sử: các enrollment completed/transferred kèm kết quả.

---

## Trạng thái chung

Mọi thao tác ghi hiển thị confirm 2 bước; lỗi 409 sĩ số (race) → toast "Lớp vừa hết chỗ" + refresh. Idempotent retry ẩn với người dùng.
