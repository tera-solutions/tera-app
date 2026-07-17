# Test Case: Báo cáo (Report)

> Route: `/reports`
> Loại test: Smoke test
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào "Khác" → "Báo cáo" | Tổng quan hoạt động giảng dạy: 6 thẻ thống kê + 6 biểu đồ (kết quả theo lớp, chuyên cần, bài tập theo trạng thái, báo cáo theo thời gian, phân loại điểm, hoạt động học tập) | Đúng đủ, hiển thị đúng 2 lớp trong biểu đồ ("Lớp Starters 1", "Lớp Mover 1"), tất cả số liệu = 0 (hợp lý do chưa có buổi học/bài tập phát sinh) | Pass |
| 2 | Đổi khoảng ngày lọc | Cập nhật lại số liệu | Chưa test thao tác đổi ngày (out of scope smoke) | Not tested |
| 3 | Bấm "Xuất báo cáo" | Tải file báo cáo | Chưa click để tránh tải file không cần thiết trong phiên test; theo review code trước đó đây là nút stub | Not tested trực tiếp (nghi ngờ theo code) |

## Ghi chú / Lỗi phát hiện
Trang tải nhanh, không lỗi console, dữ liệu hiển thị nhất quán với các trang khác (0 hoạt động do tài khoản demo chưa có buổi học/bài tập thật sự diễn ra).
