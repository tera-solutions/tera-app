# Test Case: Kiểm tra phân quyền — khu vực Superadmin

> Route: `/superadmin`
> Loại test: Security / Permission test
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Truy cập trực tiếp URL `/superadmin` bằng tài khoản Teacher (không phải superadmin) | Phải bị chặn, không cho xem dữ liệu quản trị nền tảng | Đúng — tự động chuyển hướng sang trang lỗi "403 FORBIDDEN" với nút quay lại đăng nhập | Pass — phân quyền hoạt động đúng |
| 2 | Kiểm tra menu điều hướng có hiển thị mục Superadmin không | Không nên hiển thị cho role Teacher | Đúng, không thấy mục Superadmin trong menu chính hay menu "Khác" | Pass |

## Ghi chú / Lỗi phát hiện
Không phát hiện lỗi. Đây là điểm tích cực: cơ chế phân quyền route-level (`SuperadminRoute`) hoạt động đúng, chặn triệt để truy cập trái phép ngay cả khi gõ thẳng URL.
