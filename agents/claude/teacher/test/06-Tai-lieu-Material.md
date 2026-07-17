# Test Case: Tài liệu (Material)

> Route: `/materials`
> Loại test: Smoke test + Functional test
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Tiền điều kiện
Tài khoản có sẵn 2 tài liệu ("giáo an 1", "avatar.png").

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào menu "Tài liệu" | Danh sách tài liệu thật + thống kê theo loại (Giáo án/Bài giảng/Đề kiểm tra/Phiếu bài tập/Khác) | Đúng, hiển thị 2 tài liệu thật với dung lượng, ngày cập nhật | Pass |
| 2 | Bấm "Tạo thư mục" | Mở modal/form tạo thư mục mới | **Không có phản ứng gì khi bấm** — không mở modal, không có thông báo | Fail — chức năng chưa hoạt động (stub) |
| 3 | Bấm "Tải tài liệu lên" | Mở modal upload | Chưa test (để tránh tạo dữ liệu rác trên môi trường thật) | Not tested |
| 4 | Bấm icon xem (👁) trên 1 tài liệu | Xem trước nội dung | Chưa test | Not tested |

## Ghi chú / Lỗi phát hiện
- **Bug xác nhận:** nút "Tạo thư mục" không hoạt động (không phản hồi khi click) — khớp với phát hiện từ rà soát mã nguồn trước đó (nút gọi `notification.warning("Tính năng đang được phát triển")` nhưng trên thực tế không thấy cả thông báo này xuất hiện, cần kiểm tra thêm liệu toast có bị ẩn hay thực sự không có phản hồi).
