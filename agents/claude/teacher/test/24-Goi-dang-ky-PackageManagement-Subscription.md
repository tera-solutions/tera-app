# Test Case: Gói đăng ký (PackageManagement) & Gói đã đăng ký (Subscription)

> Route: `/package-management` (menu "Gói đăng ký"), `/subscription` (menu "Gói đã đăng ký")
> Loại test: Smoke test + Functional test
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào "Khác" → "Gói đăng ký" (`/package-management`) | Trạng thái gói hiện tại + danh sách gói nâng cấp + lịch sử hóa đơn | Hiển thị: "Bạn chưa đăng ký gói dịch vụ nào", 3 gói nâng cấp (Cơ bản 149k / Nâng cao 299k / Toàn diện 499k) | Pass |
| 2 | Vào "Khác" → "Gói đã đăng ký" (`/subscription`) | Cùng một loại thông tin gói đăng ký của tài khoản | Hiển thị: "Gói hiện tại: Miễn phí, Đang sử dụng, bắt đầu 15/05/2025", 4 gói khác (Miễn phí/Cơ bản 99k/Nâng cao 199k/Premium 299k), có cả lịch sử thanh toán | **Fail — mâu thuẫn trực tiếp** với bước 1 |
| 3 | So sánh 2 trang | Phải là 1 nguồn dữ liệu thống nhất về gói dịch vụ của tài khoản | 2 trang cho 2 kết quả khác nhau hoàn toàn: một nói "chưa đăng ký gói nào", một nói "đang dùng gói Miễn phí từ 15/05/2025"; giá & tên các gói nâng cấp cũng khác nhau hoàn toàn giữa 2 trang | Fail — hai hệ thống gói dịch vụ trùng lặp, không đồng bộ |

## Ghi chú / Lỗi phát hiện
**Bug xác nhận (mức cao, ưu tiên xử lý sớm):** ứng dụng có 2 trang quản lý gói dịch vụ độc lập, không đồng bộ dữ liệu và hiển thị thông tin mâu thuẫn nhau ngay trong menu "Khác" của cùng 1 tài khoản. Đây rất có thể là 1 trang cũ (Subscription, dùng mock) chưa được gỡ bỏ sau khi trang mới (PackageManagement, dùng API thật) được xây dựng thay thế. Khuyến nghị gỡ bỏ hoặc ẩn hẳn trang `/subscription` khỏi menu để tránh gây nhầm lẫn nghiêm trọng cho người dùng thật.
