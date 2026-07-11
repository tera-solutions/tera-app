# Screen Specification — EDU-06 Classroom Management

> Hana Edu | Version 1.0 | 2026-07-08 | Web Admin
>
> Tham chiếu: `SRS/SRS-EDU-06-Classroom.md`, `UseCase/UC-EDU-06-Classroom.md`

---

## Danh sách màn hình

| ID | Màn hình | Loại |
|----|----------|------|
| SCR-EDU-06-01 | Danh mục phòng học | Tab trong "Danh mục đào tạo" |
| SCR-EDU-06-02 | Tạo/Sửa phòng | Dialog |
| SCR-EDU-06-03 | Lịch sử dụng phòng | Page (weekly calendar) |
| SCR-EDU-06-04 | Đặt bảo trì | Dialog |

---

## SCR-EDU-06-01 — Danh mục phòng học

**Route:** /edu/catalog?tab=classrooms | Filter: chi nhánh (bắt buộc chọn 1)

```
┌───────────────────────────────────────────────────────────┐
│ Chi nhánh: [Quận 12 ▾]              [Lịch phòng] [+ Thêm] │
├───────────────────────────────────────────────────────────┤
│ P.101 | Vật lý  | 15 chỗ | TV,AC     | 12 buổi/tuần | ●  ✎│
│ P.102 | Vật lý  | 12 chỗ | TV        | 🔧 bảo trì 14–20/7 │
│ Zoom1 | Online  |   —    | —         |  4 buổi/tuần | ●  ✎│
└───────────────────────────────────────────────────────────┘
```

- Cột "buổi/tuần" = sessions tuần hiện tại — click mở SCR-03 filter phòng đó.
- Icon 🔧 kèm khoảng bảo trì; hover hiện lý do.

---

## SCR-EDU-06-02 — Dialog Tạo/Sửa

| Trường | Control | Validation |
|--------|---------|-----------|
| Tên * | Text | Unique per chi nhánh |
| Loại * | Radio: Vật lý / Online | Online → ẩn capacity |
| Sức chứa * | Number | 1–100 (bắt buộc với vật lý) |
| Thiết bị | Multi-select chips | TV, Projector, AC, Whiteboard… |
| Ghi chú | Textarea | — |

---

## SCR-EDU-06-03 — Lịch sử dụng phòng

**Route:** /edu/classrooms/schedule?branch=&week=

```
┌────────────────────────────────────────────────────────────┐
│ ◀ Tuần 28 (06–12/07) ▶       [Chi nhánh ▾] [Phòng: Tất cả]│
├──────┬─────────┬─────────┬─────────┬────────┬─────────────┤
│      │ T2      │ T3      │ T4      │ T5     │ T6  T7  CN  │
│P.101 │         │▓CAM1 18h│         │▓CAM1   │             │
│      │         │▓PHO2 19h│         │▓PHO2   │             │
│P.102 │░bảo trì░│░░░░░░░░░│░░░░░░░░░│░░░░░░░░│             │
│Zoom1 │         │         │▓GT1 20h │        │             │
├──────┴─────────┴─────────┴─────────┴────────┴─────────────┤
│ Occupancy tuần: P.101 62% · P.102 — · Zoom1 15%           │
└────────────────────────────────────────────────────────────┘
```

- Block màu theo lớp; click → popover chi tiết buổi (lớp, GV, sĩ số) + link lớp.
- Vùng bảo trì tô sọc xám; ô trống click → gợi ý "Mở lớp khung này?" (link wizard).
- Footer occupancy % (giờ dùng / giờ mở cửa cấu hình).

---

## SCR-EDU-06-04 — Dialog Đặt bảo trì

```
Phòng: P.102 — Quận 12
Từ *: [14/07/2026 ▾]   Đến *: [20/07/2026 ▾]
Lý do: [Thay điều hòa___________]
⚠ 6 buổi học bị ảnh hưởng trong khoảng này:
  · 15/07 18:00 CAM1-2607-01     · 17/07 18:00 CAM1-2607-01
  · ... (xem tất cả)
Các buổi này cần được đổi phòng thủ công sau khi xác nhận.
                              [Hủy] [Xác nhận bảo trì]
```

Sau xác nhận: banner nhắc trong tab phòng + notification Giáo vụ kèm danh sách buổi; mỗi buổi có nút nhanh "Đổi phòng" (mở reschedule SCR-EDU-10-04 pre-fill).

---

## Trạng thái

Empty theo chi nhánh: "Chi nhánh chưa có phòng". Xóa phòng còn lịch tương lai → disable + tooltip (E-ROM-02). Calendar loading: skeleton grid.
