# Screen Specification — EDU-04 Subject Management

> Hana Edu | Version 1.0 | 2026-07-08 | Web Admin
>
> Tham chiếu: `SRS/SRS-EDU-04-Subject.md`, `UseCase/UC-EDU-04-Subject.md`

---

## Danh sách màn hình

| ID | Màn hình | Loại |
|----|----------|------|
| SCR-EDU-04-01 | Danh mục môn học | Page (trong nhóm "Danh mục đào tạo") |
| SCR-EDU-04-02 | Tạo/Sửa môn học | Dialog |

> Nhóm "Danh mục đào tạo" là 1 page với 3 tab: Môn học / Cấp độ / Phòng học (EDU-04/05/06) — dùng chung layout.

---

## SCR-EDU-04-01 — Danh mục môn học

**Route:** /edu/catalog?tab=subjects | **Quyền:** view mọi role đào tạo; nút ghi chỉ `edu.subject.manage`

```
┌────────────────────────────────────────────────────┐
│ Danh mục đào tạo                                   │
│ [Môn học] [Cấp độ] [Phòng học]                     │
├────────────────────────────────────────────────────┤
│                                     [+ Thêm môn]   │
│ ⠿ | 🔤 | Cambridge      | CAM | 5 khóa | ●active ✎ │
│ ⠿ | 🅿 | Jolly Phonics  | PHO | 3 khóa | ●active ✎ │
│ ⠿ | 💬 | Giao tiếp      | GT  | 2 khóa | ○inactive │
└────────────────────────────────────────────────────┘
```

- Không phân trang (dữ liệu nhỏ); ⠿ kéo thả → PATCH /sort ngay (optimistic UI, revert nếu lỗi).
- Icon + màu hiển thị như chip; cột "khóa" đếm course tham chiếu.
- Toggle trạng thái tại chỗ; xóa: chỉ hiện khi 0 khóa, ngược lại disable + tooltip "Đang dùng bởi 5 khóa học".

---

## SCR-EDU-04-02 — Dialog Tạo/Sửa

| Trường | Control | Validation |
|--------|---------|-----------|
| Tên * | Text | 2–100, unique — báo trùng inline |
| Mã | Text | Auto-slug từ tên, editable, không dấu |
| Icon | Icon picker (grid emoji/lucide) | — |
| Màu | Color palette 12 màu + custom hex | — |
| Mô tả | Textarea | — |

[Hủy] [Lưu] — lưu xong cập nhật row tại chỗ, không reload.

---

## Trạng thái

Empty: "Chưa có môn học — thêm môn đầu tiên để bắt đầu tạo khóa học". Lỗi sort do conflict → toast + reload thứ tự từ server.
