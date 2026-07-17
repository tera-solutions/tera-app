# Test Case: Lịch dạy (Schedule / EDU-10 Timetable)

> Route: `/schedule`
> Loại test: Smoke test + Functional test (đối chiếu BRD EDU-10)
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Tiền điều kiện
Tài khoản có 2 lớp học ("Lớp Mover 1", "Lớp Starters 1"), cả hai đang ở trạng thái "Nháp" (draft), chưa sinh buổi học.

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi (theo BRD EDU-10) | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào menu "Lịch dạy" | Hiển thị trang lịch với 4 chế độ xem: Danh sách/Ngày/Tuần/Tháng | Đúng, đủ 4 tab chế độ xem | Pass |
| 2 | Quan sát bộ lọc bên phải | Lọc lớp học, trạng thái (sắp diễn ra/đang diễn ra/đã hoàn thành/đã hủy), theo ngày, theo cơ sở | Đầy đủ | Pass |
| 3 | Xem lịch tuần hiện tại (13/07 - 19/07) | Hiển thị buổi học nếu có | "Không có lịch dạy trong tuần" — đúng vì lớp chưa sinh buổi | Pass (theo đúng dữ liệu hiện có) |
| 4 | Tìm nơi thiết lập lịch tuần mới (thêm slot thứ/giờ/phòng/GV) cho lớp | Theo BRD EDU-10 FR-01, phải có UI thiết lập lịch tuần khi tạo lớp (wizard) | Không tìm thấy trên trang `/schedule` — trang này chỉ có chức năng XEM lịch, không có form tạo/sửa lịch tuần | Fail / Thiếu tính năng |
| 5 | Tìm chức năng preview buổi sinh ra + cảnh báo trùng phòng/GV | Theo BRD EDU-10 FR-02, FR-06 | Không có trên trang này (có thể nằm trong wizard tạo lớp — cần test riêng ở "Lớp học") | Not found here |

## Ghi chú / Lỗi phát hiện
- Trang `/schedule` chỉ đóng vai trò xem lịch (read-only calendar), không có chức năng thiết lập lịch tuần/kiểm tra xung đột như BRD mô tả cho EDU-10. Xem thêm file `03-Lop-hoc-Classroom.md` để kiểm tra xem chức năng này có nằm trong wizard tạo lớp không.
- Không phát hiện lỗi kỹ thuật (console/network) trên trang này.
