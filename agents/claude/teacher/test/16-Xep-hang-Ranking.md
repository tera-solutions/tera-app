# Test Case: Xếp hạng (Ranking)

> Route: `/ranking`
> Loại test: Smoke test
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào "Khác" → "Xếp hạng" | Bảng xếp hạng học viên theo điểm đánh giá + 4 tab (Bảng tổng hợp/Tiến bộ lớp/Chọn nhóm/Đánh giá) | Đúng đủ, thẻ thống kê "4 Tổng HV, — Điểm TB, 2 Tổng lớp, 0% Tỷ lệ khá giỏi" | Pass |
| 2 | Xem bảng xếp hạng | Danh sách học viên có điểm | "Chưa có dữ liệu đánh giá để xếp hạng" — hợp lý vì chưa đánh giá học viên nào (khớp file `12-Danh-gia-Evaluation.md`) | Pass |
| 3 | Chuyển tab "Đánh giá" | Nội dung liên quan xếp hạng theo đánh giá | Theo review code trước đó, tab này chỉ redirect sang trang Evaluation, không có nội dung riêng — chưa xác nhận trực tiếp qua click | Not confirmed trực tiếp |

## Ghi chú / Lỗi phát hiện
Không phát hiện lỗi kỹ thuật. Trạng thái rỗng hợp lý và nhất quán với trang Đánh giá (chưa có dữ liệu đánh giá nào được nhập).
