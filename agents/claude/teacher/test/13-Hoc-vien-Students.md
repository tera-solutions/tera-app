# Test Case: Học viên (Students / EDU-01)

> Route: `/students`, chi tiết `/student/:id`
> Loại test: Smoke test + Functional test (đối chiếu BRD EDU-01)
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi (BRD EDU-01) | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào menu "Học viên" | Danh sách + 4 thẻ thống kê (tổng/đang học/đã nghỉ/hoàn thành) + tab trạng thái + filter | Đúng đủ | Pass |
| 2 | Quan sát dữ liệu | "4 Tổng học viên" nhưng "0 Đang học" | **Mâu thuẫn ngay trong cùng trang**: mỗi dòng học viên ghi trạng thái "studying" nhưng thẻ tổng hợp "Đang học" lại = 0 | Fail — lỗi hiển thị/tính toán thống kê |
| 3 | Quan sát cột "Lớp học" của từng học viên | Phải hiển thị tên lớp đang học (theo BR-04 EDU-01) | Tất cả đều để trống "—" | Fail — thiếu liên kết lớp học |
| 4 | Mở chi tiết "Bé An" (STU0001) | Trang chi tiết: hồ sơ, 4 thẻ thống kê, tab Tổng quan/Điểm số/Điểm danh/Bài tập/Lịch sử | Đúng cấu trúc, "Lớp học hiện tại" trống — khớp với lỗi đã ghi nhận | Pass (cấu trúc) / Fail (dữ liệu) |
| 5 | Kiểm tra nút "Ghi danh học viên" | Mở luồng ghi danh (Enrollment) | Có nút, xem test riêng ở file `20-Ghi-danh-Enrollment-Transfer.md` | Pass (điều hướng) |
| 6 | Kiểm tra nút "Chuyển lớp" | Mở luồng chuyển lớp (Transfer) | Có nút, xem test riêng ở file `20-Ghi-danh-Enrollment-Transfer.md` | Pass (điều hướng) |

## Ghi chú / Lỗi phát hiện
- **Bug xác nhận (mức cao):** thẻ thống kê "Đang học: 0" mâu thuẫn với chính bảng dữ liệu bên dưới (toàn bộ 4/4 học viên có trạng thái "studying"). Đây là lỗi tính toán/API thống kê, cần báo cho đội backend.
- **Bug xác nhận (mức cao):** không học viên nào có lớp học được gán dù trạng thái là "studying" — cùng gốc vấn đề với file `03-Lop-hoc-Classroom.md`.
