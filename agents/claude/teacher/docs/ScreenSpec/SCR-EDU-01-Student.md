# Screen Specification — EDU-01 Student Management

> Hana Edu | Version 1.0 | 2026-07-08 | Web Admin (React 19 + Tailwind 4)
>
> Tham chiếu: `SRS/SRS-EDU-01-Student.md`, `UseCase/UC-EDU-01-Student.md` | UI Convention: readme §8

---

## Danh sách màn hình

| ID | Màn hình | Loại | Route |
|----|----------|------|-------|
| SCR-EDU-01-01 | Danh sách học viên | Page | /edu/students |
| SCR-EDU-01-02 | Tạo/Sửa học viên | Dialog | — |
| SCR-EDU-01-03 | Chi tiết học viên | Page (tabs) | /edu/students/:id |
| SCR-EDU-01-04 | Import học viên | Dialog | — |
| SCR-EDU-01-05 | Đổi trạng thái | Dialog | — |

---

## SCR-EDU-01-01 — Danh sách học viên

**Quyền:** `edu.student.view` (scope chi nhánh)

### Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│ Học viên                     [Import] [Export] [+ Tạo mới]  │
├─────────────────────────────────────────────────────────────┤
│ [🔍 Tên/mã/SĐT PH...] [Chi nhánh ▾] [Trạng thái ▾] [Khóa ▾] │
├─────────────────────────────────────────────────────────────┤
│ ☐ | Ảnh | Mã HS     | Họ tên     | Tuổi | PH chính | Lớp   │
│   |  ◯  | HS2600101 | Ng.Minh An |  7   | 090***22 | CAM1..│
│   |     |           |            |      |          |[badge]│
├─────────────────────────────────────────────────────────────┤
│ Hiển thị 1–20 / 1.234        [◀ 1 2 3 … ▶]  [20/trang ▾]   │
└─────────────────────────────────────────────────────────────┘
```

### Thành phần

| Component | Hành vi |
|-----------|---------|
| Search input | Debounce 400ms, tìm không dấu (tên/mã/SĐT PH) |
| Filter selects | branch (theo Data Permission), status (5 badge màu), course, class |
| Table | Sort: tên, mã, ngày tạo; row click → SCR-03; hover hiện quick actions (Sửa/Đổi trạng thái) |
| Status badge | pending=xám, studying=xanh lá, reserved=vàng, dropped=đỏ, completed=xanh dương |
| Bulk select | Checkbox → bulk export |

### Trạng thái màn hình

| Trạng thái | Hiển thị |
|-----------|----------|
| Loading | Skeleton 10 hàng |
| Empty | Illustration + "Chưa có học viên" + nút Tạo mới |
| Empty (filter) | "Không tìm thấy kết quả" + nút Xóa bộ lọc |
| Error | Banner đỏ + Thử lại |

---

## SCR-EDU-01-02 — Dialog Tạo/Sửa học viên

**Quyền:** `edu.student.create` / `edu.student.update` | Kích thước: 720px, 2 cột

### Wireframe

```
┌─ Tạo học viên ──────────────────────────── ✕ ─┐
│ ─ Thông tin cá nhân ─────────────────────────  │
│ Họ tên *        [__________]  Giới tính * (○○○)│
│ Ngày sinh *     [dd/mm/yyyy]  Chi nhánh *  [▾] │
│ Địa chỉ         [____________________________] │
│ ─ Phụ huynh * ───────────────────────────────  │
│ SĐT [__________] → (tìm thấy: Nguyễn Văn B ✓)  │
│ │ Nguyễn Văn B · Bố · ☑ PH chính        [xóa] │
│ [+ Thêm phụ huynh]                             │
│ ─ Ghi chú ───────────────────────────────────  │
│ [____________________________________________] │
│                          [Hủy]  [Lưu học viên] │
└────────────────────────────────────────────────┘
```

### Trường & validation hiển thị

| Trường | Control | Validation (inline, blur) |
|--------|---------|--------------------------|
| Họ tên * | Text | 2–100 ký tự |
| Ngày sinh * | Date picker | Tuổi 3–16 → "Độ tuổi ngoài phạm vi 3–16" |
| Giới tính * | Radio 3 | Bắt buộc |
| Chi nhánh * | Select | Theo quyền user |
| SĐT phụ huynh | Text + async check | Format VN; tìm thấy → card chọn nhanh; không thấy → mở rộng form tạo PH inline (tên*, quan hệ*) |
| PH chính | Checkbox | Đúng 1 trong danh sách |

### Hành vi đặc biệt

- Submit nghi trùng (409 E-STU-02) → dialog con hiển thị hồ sơ trùng: [Mở hồ sơ có sẵn] [Vẫn tạo mới].
- Lưu thành công → toast + prepend row vào table; giữ dialog nếu Shift+Lưu (tạo tiếp).

---

## SCR-EDU-01-03 — Chi tiết học viên

**Route:** /edu/students/:id | Tabs lazy-load

### Wireframe

```
┌───────────────────────────────────────────────────────────┐
│ ◯ HS2600101 · Nguyễn Minh An   [studying]  [Sửa][⋮ menu]  │
│   7 tuổi · Nam · CN Quận 12 · PH: Ng.Văn B (090***222)    │
├───────────────────────────────────────────────────────────┤
│ [Hồ sơ] [Lớp học] [Điểm danh] [Điểm số] [Học phí] [Lịch sử]│
├───────────────────────────────────────────────────────────┤
│                (nội dung tab)                              │
└───────────────────────────────────────────────────────────┘
```

### Tabs

| Tab | Nội dung | Nguồn |
|-----|----------|-------|
| Hồ sơ | Thông tin + avatar upload (crop 1:1, ≤2MB) + danh sách PH (link SCR-EDU-02) | GET /students/{id} |
| Lớp học | Bảng enrollments: lớp, buổi x/y progress, trạng thái; nút Ghi danh/Chuyển lớp | /students/{id}/enrollments |
| Điểm danh | Lịch sử + tỷ lệ chuyên cần (donut) | /students/{id}/attendance |
| Điểm số | Bảng điểm các lớp + link phiếu điểm PDF | /students/{id}/scores |
| Học phí | Read-only từ Finance: invoices, công nợ | FIN API |
| Lịch sử | Timeline status logs + branch logs + audit | logs |

**Menu ⋮:** Đổi trạng thái (SCR-05), Chuyển chi nhánh, Tạo tài khoản app, Xóa (disable nếu có enrollment — tooltip lý do).

---

## SCR-EDU-01-04 — Dialog Import

3 bước: **Tải template** (link xlsx) → **Upload** (drag-drop, validate ≤1.000 dòng) → **Kết quả** (progress bar theo queue; xong: "990 thành công / 10 lỗi" + nút tải file lỗi).

Trạng thái lỗi cấu trúc file → hiển thị ngay bước 2, không cho tiếp tục.

---

## SCR-EDU-01-05 — Dialog Đổi trạng thái

```
Trạng thái hiện tại: [studying]
Chuyển sang *: (chỉ hiện transition hợp lệ)  [reserved ▾]
Lý do *:       [_______________________]  (bắt buộc, hiện khi reserved/dropped)
Ngày dự kiến quay lại: [dd/mm/yyyy]        (chỉ hiện khi reserved)
             [Hủy] [Xác nhận]
```

Sau xác nhận: badge header đổi màu, tab Lịch sử thêm dòng, toast thông báo đã gửi notification.

---

## Responsive

- <1024px: filter thu thành nút "Bộ lọc" mở drawer; table ẩn cột Tuổi, Địa chỉ.
- Mobile: table → card list (ảnh + tên + mã + badge).
