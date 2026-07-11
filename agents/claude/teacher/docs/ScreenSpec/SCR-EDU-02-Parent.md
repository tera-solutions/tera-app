# Screen Specification — EDU-02 Parent Management

> Hana Edu | Version 1.0 | 2026-07-08 | Web Admin + Parent App
>
> Tham chiếu: `SRS/SRS-EDU-02-Parent.md`, `UseCase/UC-EDU-02-Parent.md`

---

## Danh sách màn hình

| ID | Màn hình | Loại | Nền tảng |
|----|----------|------|----------|
| SCR-EDU-02-01 | Danh sách phụ huynh | Page | Web |
| SCR-EDU-02-02 | Tạo/Sửa phụ huynh | Dialog | Web |
| SCR-EDU-02-03 | Chi tiết phụ huynh | Page (tabs) | Web |
| SCR-EDU-02-04 | Liên kết học viên | Dialog | Web |
| SCR-EDU-02-05 | Gộp hồ sơ (merge) | Dialog 2 bước | Web |
| SCR-EDU-02-06 | Hồ sơ của tôi | Screen | Parent App |

---

## SCR-EDU-02-01 — Danh sách phụ huynh

**Quyền:** `edu.parent.view`

```
┌────────────────────────────────────────────────────────┐
│ Phụ huynh                                  [+ Tạo mới] │
│ [🔍 Tên/SĐT/email] [Chi nhánh ▾] [TK App: ⚪Tất cả ▾]  │
├────────────────────────────────────────────────────────┤
│ Họ tên       | SĐT        | Email | Số con | App      │
│ Nguyễn Văn B | 0903111222 | ...   |  2 👶  | ✓ Đã KH  │
├────────────────────────────────────────────────────────┤
│ Pagination                                             │
└────────────────────────────────────────────────────────┘
```

- SĐT: hiển thị đầy đủ nếu có `edu.parent.view-phone`, ngược lại mask `090***222`.
- Cột "Số con": chip đếm, hover hiện tên các con.
- Cột App: ✓ Đã kích hoạt / ○ Chưa tạo / ◐ Chờ OTP.
- Search SĐT hỗ trợ 4 số cuối.

---

## SCR-EDU-02-02 — Dialog Tạo/Sửa

| Trường | Control | Validation hiển thị |
|--------|---------|---------------------|
| SĐT * | Text + async check | Đang nhập: spinner; trùng → alert vàng "SĐT đã tồn tại: Nguyễn Văn B [Mở hồ sơ]" |
| Họ tên * | Text | 2–100 |
| Email | Text | Format email |
| Nghề nghiệp, Địa chỉ, Ghi chú | Text | — |

Check trùng chạy trước — nếu trùng thì disable nút Lưu, hướng người dùng mở hồ sơ có sẵn.

---

## SCR-EDU-02-03 — Chi tiết phụ huynh

```
┌──────────────────────────────────────────────────────┐
│ Nguyễn Văn B · 0903111222        [Sửa] [Tạo TK App]  │
├──────────────────────────────────────────────────────┤
│ [Hồ sơ] [Con (2)] [Thanh toán] [Liên lạc]            │
└──────────────────────────────────────────────────────┘
```

| Tab | Nội dung |
|-----|----------|
| Hồ sơ | Thông tin + trạng thái tài khoản app (nút Reset OTP — disable + countdown khi rate limit) |
| Con | Bảng: tên, lớp, trạng thái, quan hệ, cờ PH chính (radio — đổi tại chỗ); nút [+ Liên kết học viên] → SCR-04; nút hủy liên kết (disable nếu là PH duy nhất — tooltip) |
| Thanh toán | Read-only invoices/payments từ Finance, tổng công nợ nổi bật |
| Liên lạc | Log notification đã gửi (kênh, trạng thái, thời gian) |

---

## SCR-EDU-02-04 — Dialog Liên kết học viên

```
Học viên *: [🔍 tìm theo tên/mã________]  → chọn từ dropdown kết quả
Quan hệ *:  [Bố ▾]   ☑ Đặt làm phụ huynh chính
⚠ Bé An đang có PH chính là Trần Thị C — sẽ chuyển sang người này
                                  [Hủy] [Liên kết]
```

Cảnh báo swap primary hiển thị động khi tick checkbox và student đã có primary.

---

## SCR-EDU-02-05 — Dialog Merge (2 bước)

**Bước 1 — So sánh:** 2 cột side-by-side (tên, SĐT, email, số con, TK app, ngày tạo); radio chọn "Hồ sơ giữ lại".

**Bước 2 — Xác nhận:** tóm tắt hành động ("Chuyển 2 liên kết con, giữ TK app của hồ sơ A, xóa hồ sơ B") + input gõ lại SĐT hồ sơ bị xóa để xác nhận → [Gộp hồ sơ].

Kết quả: toast + redirect về hồ sơ target; nếu bước Finance async lỗi → banner vàng trong chi tiết "Đang đồng bộ thanh toán…".

---

## SCR-EDU-02-06 — Parent App: Hồ sơ của tôi

```
┌──────────────────────────┐
│ ◯ Nguyễn Văn B           │
│ 0903111222               │
│ ──────────────────────── │
│ Con của tôi              │
│ ┌──────┐ ┌──────┐        │
│ │◯ An  │ │◯ Bình│        │
│ │CAM1..│ │PHO2..│        │
│ └──────┘ └──────┘        │
│ ──────────────────────── │
│ ✎ Sửa thông tin          │
│ 🔒 Đổi mật khẩu           │
│ 🔔 Cài đặt thông báo      │
└──────────────────────────┘
```

- Card con: tap → dashboard của con đó (context switch toàn app).
- Sửa thông tin: chỉ email/địa chỉ (SĐT khóa — liên hệ trung tâm).

---

## Trạng thái chung & Responsive

Loading skeleton, empty state, error banner như SCR-EDU-01. Mobile web: bảng → card. Parent App: thiết kế mobile-first, màu chủ đạo #0066CC.
