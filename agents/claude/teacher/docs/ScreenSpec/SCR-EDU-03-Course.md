# Screen Specification — EDU-03 Course Management

> Hana Edu | Version 1.0 | 2026-07-08 | Web Admin + Website public
>
> Tham chiếu: `SRS/SRS-EDU-03-Course.md`, `UseCase/UC-EDU-03-Course.md`

---

## Danh sách màn hình

| ID | Màn hình | Loại |
|----|----------|------|
| SCR-EDU-03-01 | Danh sách khóa học | Page |
| SCR-EDU-03-02 | Tạo/Sửa khóa học | Page 2 tab |
| SCR-EDU-03-03 | Tab Syllabus | Tab trong SCR-02 |
| SCR-EDU-03-04 | Khóa học trên Website | Public page |

---

## SCR-EDU-03-01 — Danh sách khóa học

**Quyền:** `edu.course.view` | Toggle view: Table / Card

```
┌────────────────────────────────────────────────────────────┐
│ Khóa học                        [☰|▦]        [+ Tạo mới]   │
│ [🔍] [Môn ▾] [Level ▾] [Trạng thái ▾] [☐ Đã publish]       │
├────────────────────────────────────────────────────────────┤
│ ▦ Card view:                                               │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐                 │
│ │ [ảnh]     │ │ [ảnh]     │ │ [ảnh]     │                 │
│ │ Cambridge │ │ Phonics 1 │ │ Giao tiếp │                 │
│ │ Starters  │ │ [Movers]  │ │ [Pre-A1]  │                 │
│ │ 48 buổi   │ │ 36 buổi   │ │ 24 buổi   │                 │
│ │ ●active 🌐│ │ ●active   │ │ ○draft    │                 │
│ └───────────┘ └───────────┘ └───────────┘                 │
└────────────────────────────────────────────────────────────┘
```

- 🌐 = đã publish website. Card hiện classes_count đang chạy khi hover.
- Menu card: Sửa / Duplicate / Publish–Unpublish / Đổi trạng thái.

---

## SCR-EDU-03-02 — Tạo/Sửa khóa học (Tab 1: Thông tin)

**Route:** /edu/courses/new · /edu/courses/:id/edit

| Trường | Control | Validation |
|--------|---------|-----------|
| Tên * | Text | 3–150 |
| Mã * | Text | a-zA-Z0-9-, unique — check async |
| Môn học * / Level * | Select (từ danh mục active) | Bắt buộc |
| Số buổi * | Number | 1–500 |
| Thời lượng buổi (phút) * | Number | 30–300 |
| Độ tuổi | Range 2 input | 3–18, from ≤ to |
| Sản phẩm giá (Finance) | Select async | Optional, link tạo mới bên FIN |
| Mô tả | Rich text editor | Sanitized |
| Ảnh | Upload + crop 3:2 | ≤5MB |

Footer sticky: [Lưu nháp] [Lưu & Kích hoạt] — nút kích hoạt disable kèm tooltip nếu chưa đủ điều kiện (thiếu trường/syllabus).

---

## SCR-EDU-03-03 — Tab Syllabus

```
┌──────────────────────────────────────────────────┐
│ Syllabus (46/48 buổi)  ⚠ thiếu 2   [Import xlsx] │
├──────────────────────────────────────────────────┤
│ ⠿ 1 | Unit 1: Hello!        | Objective... | ✎ ✕ │
│ ⠿ 2 | Unit 1: Colors        | ...          | ✎ ✕ │
│ [+ Thêm bài]                                     │
└──────────────────────────────────────────────────┘
```

- ⠿ drag handle sắp xếp; đánh lại order tự động.
- Đếm bài / total_sessions; thiếu → warning vàng (không chặn lưu, chặn active trừ Admin).
- Sửa inline (expand row): title, objective, materials.
- Import xlsx: dialog kết quả từng dòng như pattern chung.

---

## SCR-EDU-03-04 — Website public (tham chiếu)

- Trang danh sách khóa: card theo sort_order subject; chỉ khóa is_published.
- Trang chi tiết /khoa-hoc/:slug: ảnh, mô tả, level, độ tuổi, số buổi, form "Đăng ký học thử" (đổ về CRM Lead).
- Không hiển thị: giá nội bộ, product_id, mã khóa.

---

## Trạng thái & phân quyền hiển thị

| Element | Điều kiện hiển thị |
|---------|-------------------|
| Nút Tạo/Sửa/Duplicate | `edu.course.create/update` (Admin, Manager) |
| Nút Publish | `edu.course.publish` + status=active |
| Nút Xóa | `edu.course.delete` (Admin) + chưa có lớp |
| Đổi trạng thái inactive | Disable + tooltip liệt kê lớp ongoing nếu có (E-CRS-02) |
