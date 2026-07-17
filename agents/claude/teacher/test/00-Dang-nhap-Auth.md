# Test Case: Đăng nhập (Auth)

> Route: `/auth/login` | Trang đích sau đăng nhập: `/dashboard`
> Loại test: Smoke test
> Ngày test: 2026-07-17 | Môi trường: https://teacher.anhnguhana.com/ | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Tiền điều kiện
Không cần đăng nhập trước đó.

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Truy cập `https://teacher.anhnguhana.com/` | Hiển thị trang landing + form đăng nhập | Đúng — hiển thị trang giới thiệu Hana Edu bên trái, form đăng nhập bên phải | Pass |
| 2 | Nhập email `demo1@terasolutions.vn` + mật khẩu `12345678`, bấm "Đăng nhập" | Đăng nhập thành công, chuyển vào Dashboard | Đúng — chuyển tới `/dashboard`, hiển thị "Xin chào, Cô Hạ" | Pass |
| 3 | Quan sát góc trên phải sau đăng nhập | Hiển thị tên, vai trò, avatar người dùng | Đúng — "Cô Hạ / Teacher" | Pass |
| 4 | Quan sát các nút đăng nhập mạng xã hội (Google, Microsoft) và "Đăng ký ngay" | Có mặt trên UI (không bắt buộc test luồng OAuth thật) | Hiển thị đầy đủ, chưa test luồng thật (rủi ro cần tài khoản OAuth) | Not tested |

## Ghi chú / Lỗi phát hiện
Không phát hiện lỗi. Luồng đăng nhập cơ bản hoạt động ổn định, không có lỗi console khi tải trang.
