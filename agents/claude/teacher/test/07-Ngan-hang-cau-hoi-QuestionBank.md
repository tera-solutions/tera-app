# Test Case: Ngân hàng câu hỏi (QuestionBank)

> Route: `/question-bank`
> Loại test: Smoke test
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào menu "Ngân hàng câu hỏi" | Danh sách câu hỏi + thống kê (tổng/của tôi/dễ/khó) + filter môn học/dạng câu hỏi/độ khó | Đúng đủ, hiển thị 1 câu hỏi thật ("test", Ngữ pháp, Một đáp án, Dễ) | Pass |
| 2 | Chuyển tab "Câu hỏi của tôi" | Lọc câu hỏi do chính GV tạo | Chưa test click (nhưng cấu trúc UI có sẵn) | Not tested |
| 3 | Kiểm tra liên kết với Bài tập (loại quiz) | Theo đề xuất, Homework nên cho phép chọn câu hỏi từ ngân hàng này | Không thấy liên kết ở trang Bài tập (đã xác nhận riêng ở file `08-Bai-tap-Assignment.md`) | Fail — thiếu liên kết tính năng |

## Ghi chú / Lỗi phát hiện
Trang hoạt động ổn định, không lỗi kỹ thuật. Vấn đề chính là ngân hàng câu hỏi chưa được liên kết với luồng giao bài tập (assignment) — xem thêm đề xuất trong file thống kê tổng hợp.
