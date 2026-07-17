# Test Case: Trang chủ (Dashboard)

> Route: `/dashboard`
> Loại test: Smoke test
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Tiền điều kiện
Đã đăng nhập thành công.

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi (theo BRD mục 6 Teacher App Dashboard) | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào Dashboard sau đăng nhập | Hiển thị Header/Greeting, Quick Action, Today's Activity, Schedule, Todo, Notification | Đủ các widget: Lịch dạy hôm nay, Lịch dạy tuần này, Điểm danh, Bài tập cần chấm, Thông báo mới, Tiến độ học tập, Giáo án gần đây, Lớp học của tôi | Pass |
| 2 | Chờ widget tải xong (loading spinner) | Widget hiển thị dữ liệu hoặc trạng thái rỗng hợp lý | Tất cả widget tải xong, hiển thị "0"/rỗng hợp lý do tài khoản test chưa có buổi học/bài tập phát sinh | Pass |
| 3 | Quan sát widget "Thông báo mới" | Dữ liệu thật từ hệ thống thông báo | Hiển thị 2 thông báo mẫu ("Họp giáo viên tháng 5", "Bài tập mới: Writing - Unit 5") — trùng khớp với dữ liệu mock đã xác nhận ở trang `/notifications` | Fail (mock, không phải dữ liệu thật) |
| 4 | Bấm "Xem tất cả" trên từng widget | Điều hướng sang trang chi tiết tương ứng | Chưa test hết từng nút (out of scope smoke test) | Not tested |

## Ghi chú / Lỗi phát hiện
- Dashboard tổng thể hoạt động tốt, không lỗi console.
- Widget Thông báo dùng dữ liệu mock cứng (đã xác nhận qua code: `MOCK_NOTIFICATIONS`), không phản ánh thông báo thật của tài khoản.
