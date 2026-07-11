# Use Case — EDU-06 Classroom Management

> Hana Edu | Version 1.0 | 2026-07-08 | Tham chiếu: `BRD - Education.md` § EDU-06, `SRS/SRS-EDU-06-Classroom.md`

---

## Danh mục Use Case

| ID | Tên | Actor chính |
|----|-----|-------------|
| UC-EDU-06-01 | Tạo phòng học | Manager |
| UC-EDU-06-02 | Đặt lịch bảo trì phòng | Manager |
| UC-EDU-06-03 | Xem công suất phòng (occupancy) | Giáo vụ/Manager |

## Sơ đồ Actor – Use Case

```
Admin/Manager ────► UC-01, UC-02, UC-03
Giáo vụ ────► UC-03; chọn phòng khi xếp lịch (EDU-10)
System ────► check trùng phòng (service nội bộ, gọi từ EDU-10/11)
```

---

## UC-EDU-06-01 — Tạo phòng học

| Thuộc tính | Nội dung |
|-----------|----------|
| Precondition | Chi nhánh tồn tại; tên phòng chưa dùng trong chi nhánh |
| Postcondition | Phòng available, khả dụng khi xếp lịch |

**Luồng chính**

1. Manager mở Danh mục → Phòng học → Thêm.
2. Nhập tên "P.101", loại physical, sức chứa 15, thiết bị (TV, AC, whiteboard).
3. Lưu → phòng xuất hiện trong dropdown xếp lịch chi nhánh.

**Luồng thay thế:** A1: loại online → bỏ qua capacity, phòng không bị check trùng lịch.

**Ngoại lệ:** trùng tên trong chi nhánh → 422 E-ROM-01.

**BR liên quan:** BR-01, BR-02.

---

## UC-EDU-06-02 — Đặt lịch bảo trì phòng

| Thuộc tính | Nội dung |
|-----------|----------|
| Trigger | Sửa chữa, lắp thiết bị |
| Postcondition | Phòng bị chặn xếp lịch trong khoảng bảo trì; buổi đã xếp được liệt kê để xử lý |

**Luồng chính**

1. Manager đặt maintenance 14–20/07.
2. Hệ thống quét session tương lai của phòng trong khoảng → trả danh sách 6 buổi bị ảnh hưởng.
3. Giáo vụ nhận cảnh báo → đổi phòng từng buổi (reschedule EDU-10) → phụ huynh nhận thông báo đổi phòng.
4. Trong khoảng bảo trì: mọi xếp lịch mới vào phòng → chặn E-ROM-03.

**Ngoại lệ:** from ≥ to → 422 E-ROM-04; hệ thống KHÔNG tự đổi phòng các buổi (quyết định thuộc Giáo vụ).

**BR liên quan:** BR-04.

---

## UC-EDU-06-03 — Xem công suất phòng

**Trigger:** Cân nhắc mở thêm lớp / đánh giá hiệu suất mặt bằng.

**Luồng chính**

1. Mở "Lịch phòng" → chọn tuần → calendar hiển thị block buổi học theo phòng (tên lớp, giờ, màu theo lớp).
2. Nhận diện khung trống (VD chiều T7 P.101 trống) → đề xuất mở lớp mới khung đó.
3. Xem báo cáo occupancy rate theo tuần/tháng.

**Ngoại lệ:** khoảng xem > 62 ngày → giới hạn.
