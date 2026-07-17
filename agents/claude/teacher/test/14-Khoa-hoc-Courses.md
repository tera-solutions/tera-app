# Test Case: Khóa học (Courses / EDU-03), Trình độ (Levels / EDU-05)

> Route: `/courses`, `/levels`
> Loại test: Smoke test
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Các bước test & kết quả — Khóa học

| # | Bước | Kết quả mong đợi (BRD EDU-03) | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào "Khác" → "Khóa học" | Danh sách khóa học: tên, thời lượng, học phí/buổi, trạng thái | Đúng, 2 khóa: "khóa đầu năm" (60p, 100.000đ), "Khóa Hè 2026" (90p, 80.000đ), cả 2 "Đang mở" | Pass |
| 2 | Kiểm tra danh mục "Subject" (môn học) riêng | BRD yêu cầu Subject là danh mục độc lập (EDU-04) | Không có menu/route riêng cho Subject — xác nhận đúng như phát hiện ở lượt review mã nguồn trước | Fail — thiếu tính năng (đã biết) |
| 3 | Bấm "Sửa" 1 khóa học | Mở form sửa | Chưa test (tránh thay đổi dữ liệu thật) | Not tested |

## Các bước test & kết quả — Trình độ

| # | Bước | Kết quả mong đợi (BRD EDU-05) | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào "Khác" → "Trình độ" | Danh sách trình độ theo khóa học, thứ tự, CEFR | Đúng, 3 trình độ: A3, Lever 2, Lver 1 (thứ tự 3/2/1) — tên có vẻ là dữ liệu test (lỗi chính tả "Lver"/"Lever"), không phải lỗi ứng dụng | Pass |
| 2 | Kiểm tra cột CEFR | Hiển thị cấp độ CEFR nếu có | Tất cả "—" (chưa cấu hình) | Pass (hợp lý, chưa nhập) |

## Ghi chú / Lỗi phát hiện
Cả 2 trang hoạt động ổn định. Xác nhận lại: không có trang Subject Management độc lập trên giao diện thật, khớp với kết luận review mã nguồn.
