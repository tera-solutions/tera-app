# Test Case: Đơn xin nghỉ (LeaveRequest)

> Route: `/leave-request`
> Loại test: Smoke test + Functional test
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào "Khác" → "Đơn xin nghỉ" | Form tạo đơn + thống kê phép + lịch nghỉ + lịch sử đơn | Hiển thị đầy đủ, có dữ liệu mẫu (15 ngày phép/năm, đã dùng 4, còn 11, lịch sử 2 đơn: 1 từ chối, 1 chờ duyệt) | Pass (giao diện) |
| 2 | Chọn "Loại nghỉ" = Nghỉ ốm | Dropdown hoạt động | Đúng, chọn được, hiển thị đúng label với icon | Pass |
| 3 | Nhập lý do, bỏ trống ngày, bấm "Gửi đơn xin nghỉ" | Chặn submit, báo lỗi validate ngày | Đúng — hiển thị "Vui lòng chọn ngày bắt đầu" / "Vui lòng chọn ngày kết thúc" | Pass (validate phía client hoạt động) |
| 4 | Kiểm tra xem lịch sử đơn có phải dữ liệu thật của tài khoản demo không | Đơn xin nghỉ phải phản ánh đúng lịch sử tài khoản đang đăng nhập | Chưa xác nhận 100% qua UI, nhưng theo review mã nguồn trước đó đây là dữ liệu mock tĩnh từ `_mock.ts`, nút submit cuối cùng chỉ hiện thông báo demo chứ không gọi API thật | Fail (theo review code) — cần xác nhận thêm bằng cách gửi đơn hợp lệ và reload trang |

## Ghi chú / Lỗi phát hiện
Form có validate phía client hoạt động tốt (điểm cộng), nhưng theo rà soát mã nguồn, việc gửi đơn thực tế không được lưu vào backend — khuyến nghị test bổ sung: điền đầy đủ form hợp lệ, gửi, sau đó tải lại trang để xác nhận đơn có xuất hiện trong "Lịch sử đơn xin nghỉ" hay không (nếu không xuất hiện thì xác nhận 100% đây là mock).
