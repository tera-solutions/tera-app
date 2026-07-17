# Test Case: Bảng lương (Payroll)

> Route: `/payroll`, chi tiết `/payroll/:id`
> Loại test: Smoke test + Functional test
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào "Khác" → "Bảng lương" | Danh sách kỳ lương + 6 thẻ thống kê + biểu đồ thu nhập 6 tháng + lịch thanh toán | Hiển thị đầy đủ, có dữ liệu (5 kỳ lương 01/2025-05/2025, tổng thu nhập 11.300.000đ/kỳ gần nhất) | Pass (giao diện) |
| 2 | Mở chi tiết kỳ lương 05/2025 | Trang chi tiết: thu nhập, khấu trừ, thực nhận, lịch sử thanh toán | Đúng cấu trúc, nhưng **tên nhân viên hiển thị "Cô Ngọc" (mã GV00123)** trong khi tài khoản đang đăng nhập là "Cô Hạ" | Fail — **xác nhận dữ liệu hoàn toàn là mock, không phải dữ liệu thật của tài khoản đang đăng nhập** |
| 3 | Bấm "Tải bảng lương (PDF)" | Tải file PDF | Không có phản ứng gì khi bấm (không tải file, không thông báo) | Fail — chức năng chưa hoạt động (stub) |
| 4 | Bấm "In bảng lương" | Mở hộp thoại in | Chưa test (để tránh mở hộp thoại in hệ thống ngoài tầm kiểm soát) | Not tested |

## Ghi chú / Lỗi phát hiện
**Xác nhận quan trọng:** toàn bộ trang Bảng lương hiển thị dữ liệu KHÔNG liên quan đến tài khoản đang đăng nhập (tên nhân viên khác hẳn — "Cô Ngọc" thay vì "Cô Hạ"). Đây là bằng chứng trực tiếp, rõ ràng nhất cho thấy đây là màn hình demo/UI-only, số liệu hoàn toàn tĩnh, không có kết nối dữ liệu thật theo tài khoản. Cần cảnh báo người dùng cuối/khách hàng nếu trang này được xem là "đã hoàn thành" trong bất kỳ báo cáo tiến độ nào.
