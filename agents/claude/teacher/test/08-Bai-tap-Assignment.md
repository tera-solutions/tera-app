# Test Case: Bài tập (Assignment / EDU-13, EDU-14)

> Route: `/assignment`, chi tiết `/assignment-detail/:id`
> Loại test: Smoke test + Functional test (đối chiếu BRD EDU-13/14)
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Tiền điều kiện
Có sẵn 2 bài tập tên "test" (ASG000001 không gắn lớp, ASG000002 gắn "Lớp Mover 1"), cả hai trạng thái "Soạn thảo", 0 học viên nộp.

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi (BRD EDU-13) | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào menu "Bài tập" | Danh sách + 4 thẻ thống kê + tab trạng thái (Tất cả/Soạn thảo/Đã giao/Hết hạn) | Đúng đủ | Pass |
| 2 | Mở chi tiết bài "test" (ASG000002) | Trang chi tiết: mô tả, tài liệu đính kèm, danh sách học viên nộp, thống kê | Đúng cấu trúc, "0 Tổng học viên" dù bài gắn với "Lớp Mover 1" — khớp với lỗi sĩ số lớp = 0 đã ghi nhận ở file `03-Lop-hoc-Classroom.md` | Pass (cấu trúc) / liên quan bug đã ghi nhận |
| 3 | Bấm "Chấm bài" | Chuyển sang màn hình chấm bài (Grading) | Đúng, chuyển route `/grading/2`, hiển thị "Chọn học viên để chấm bài" vì chưa có ai nộp | Pass |
| 4 | Kiểm tra loại bài "quiz" liên kết ngân hàng câu hỏi | Theo BRD, `type` có thể là quiz liên kết QuestionBank | Không thấy trường liên kết ngân hàng câu hỏi trong form bài tập (chưa mở form tạo mới để xác nhận 100%, nhưng khớp với review code trước đó) | Not confirmed / nghi thiếu |
| 5 | Kiểm tra giao bài cho từng học viên riêng lẻ | Theo BRD FR "phạm vi giao: cả lớp/chọn học viên" | Chưa test form tạo mới trực tiếp; theo review code, chỉ hỗ trợ phạm vi course/class/lesson/level | Not tested trực tiếp |

## Ghi chú / Lỗi phát hiện
Không phát hiện lỗi crash. Cần dữ liệu học viên đã nộp bài để test đầy đủ luồng theo dõi nộp bài & chấm điểm.
