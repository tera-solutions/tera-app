# Test Case: Phòng học (Room — tương đương EDU-06 "Classroom" trong BRD)

> Route: `/rooms`
> Loại test: Smoke test
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi (BRD EDU-06) | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào "Khác" → "Phòng học" | Danh sách phòng + 6 thẻ thống kê (tổng/đang dùng/trống/bảo trì/học viên/online) + tab trạng thái + filter loại phòng/tầng | Đúng đủ | Pass |
| 2 | Quan sát dữ liệu | Danh sách phòng vật lý của chi nhánh | "Không tìm thấy phòng học phù hợp" (0 phòng) — khớp với "Phòng học: —" đã thấy ở chi tiết lớp học | Pass (nhất quán, dù thiếu dữ liệu) |

## Ghi chú / Lỗi phát hiện
Không phát hiện lỗi kỹ thuật. Dữ liệu rỗng nhất quán với các trang khác (chưa có phòng học nào được tạo trong tài khoản demo).
