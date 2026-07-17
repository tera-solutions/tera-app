# Test Case: Kiểm tra đầu vào (PlacementTest)

> Route: `/placement-test`
> Loại test: Smoke test
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào menu "Kiểm tra đầu vào" | 3 tab: Danh sách bài kiểm tra / Ngân hàng câu hỏi / Kết quả học viên | Đúng đủ 3 tab, thẻ thống kê (0 bài kiểm tra, 0 lượt làm, 0% hoàn thành) | Pass |
| 2 | Chuyển tab "Ngân hàng câu hỏi" | Hiển thị câu hỏi dùng cho placement test | Chưa xác nhận nội dung cụ thể (theo review code trước đây tab này chỉ redirect sang trang QuestionBank chung, không có UI riêng) | Not confirmed trực tiếp |
| 3 | Bấm "Tạo bài kiểm tra mới" | Mở form tạo | Chưa test (tránh tạo dữ liệu rác) | Not tested |

## Ghi chú / Lỗi phát hiện
Không phát hiện lỗi kỹ thuật khi tải trang. Cần test sâu hơn tab "Ngân hàng câu hỏi" để xác nhận có nội dung thật hay chỉ là liên kết sang trang khác.
