# Test Case: Bài kiểm tra (ExamSession / ExamDetail — EDU-16 Examination)

> Route: `/exam`
> Loại test: Smoke test
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi (BRD EDU-16) | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào menu "Bài kiểm tra" | Danh sách kỳ thi + thẻ thống kê + tab trạng thái (Đã lên lịch/Đang diễn ra/Đã đóng) + filter lớp/ngày | Đúng đủ, "Chưa có lịch kiểm tra nào" (0 dữ liệu) | Pass |
| 2 | Bấm "Tạo bài kiểm tra" | Mở form tạo kỳ thi | Chưa test (tránh tạo dữ liệu rác) | Not tested |
| 3 | Kiểm tra thi bù cho học viên vắng | BR-05 EDU-16 | Không có dữ liệu để test; theo review code trước đó không tìm thấy action tạo lượt thi bù | Not confirmed trực tiếp |
| 4 | Kiểm tra bước publish/duyệt điểm trước khi phụ huynh xem | BR-03/FR-05 EDU-16 | Không có dữ liệu để test; theo review code không tìm thấy nút publish riêng | Not confirmed trực tiếp |

## Ghi chú / Lỗi phát hiện
Trang danh sách hoạt động ổn định, không lỗi. Cần tạo 1 kỳ thi mẫu với dữ liệu học viên để kiểm chứng đầy đủ chấm điểm theo kỹ năng, thi bù, và bước publish.
