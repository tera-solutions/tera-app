# Test Case: Cài đặt (Settings) & Thông tin cá nhân (MyInfo)

> Route: `/settings`, `/profile`
> Loại test: Smoke test
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào "Khác" → "Cài đặt" | 5 mục: Hồ sơ cá nhân/Đổi mật khẩu/Thông báo/Tùy chọn chung/Giao diện | Đúng đủ, tab "Hồ sơ cá nhân" hiển thị đúng dữ liệu thật: tên "Cô Hạ", email demo1@terasolutions.vn | Pass |
| 2 | Vào avatar góc phải → "Thông tin cá nhân" (`/profile`) | Trang hồ sơ cá nhân + hồ sơ giảng dạy + lịch dạy học | Đúng cấu trúc, nhưng khu vực "Hồ sơ giảng dạy" báo "Chưa có hồ sơ giảng dạy cho tài khoản này" | Fail (dữ liệu) — tài khoản demo chưa được liên kết với hồ sơ Teacher/HR, giải thích cho các trường "Giáo viên: —" thấy ở nhiều trang khác |
| 3 | Kiểm tra "Lịch dạy học" trên trang này | Hiển thị lịch dạy sắp tới | "Không có buổi dạy nào trong khoảng thời gian này" — hợp lý, khớp dữ liệu toàn hệ thống | Pass |

## Ghi chú / Lỗi phát hiện
Phát hiện quan trọng: tài khoản test `demo1@terasolutions.vn` tuy đăng nhập được với vai trò Teacher nhưng **không có hồ sơ giảng dạy (Teacher/HR profile) được liên kết**. Đây có thể là nguyên nhân gốc rễ của hàng loạt vấn đề dữ liệu rỗng/không khớp đã ghi nhận xuyên suốt các file test khác (lớp không có giáo viên, học viên không có lớp, không phòng học, v.v.). Khuyến nghị dùng tài khoản demo đã được setup đầy đủ hồ sơ + dữ liệu liên kết hoàn chỉnh (giáo viên ↔ lớp ↔ học viên ↔ phụ huynh ↔ phòng học) cho các đợt test chức năng sâu hơn.
