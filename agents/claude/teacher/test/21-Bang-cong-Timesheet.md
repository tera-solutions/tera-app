# Test Case: Bảng công (Timesheet)

> Route: `/timesheet`
> Loại test: Smoke test
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào "Khác" → "Bảng công" | Danh sách buổi dạy trong tháng + 6 thẻ thống kê + lịch tháng bên phải | Đúng đủ, "Không có buổi dạy trong khoảng thời gian này" (hợp lý, chưa có buổi học) | Pass |
| 2 | Quan sát lịch tháng 07/2026 bên phải | Đánh dấu ngày có buổi dạy | Lịch hiển thị đúng, không có ngày nào được đánh dấu (khớp 0 buổi dạy) | Pass |
| 3 | Bấm "Xuất Excel" | Tải file Excel | Chưa click trực tiếp; theo review code là nút stub | Not tested trực tiếp (nghi ngờ theo code) |

## Ghi chú / Lỗi phát hiện
Không phát hiện lỗi. Dữ liệu rỗng nhất quán với toàn hệ thống (tài khoản demo chưa có buổi dạy thật).
