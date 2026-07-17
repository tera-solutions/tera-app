# Test Case: Giáo án (LessonPlan / EDU-11 Session hỗ trợ)

> Route: `/lesson-plans`, tạo mới `/lesson-plans/new`
> Loại test: Smoke test + Functional test
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Tiền điều kiện
Chưa có giáo án nào trong tài khoản.

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào menu "Giáo án" | Danh sách giáo án + 4 thẻ thống kê + tab trạng thái (Tất cả/Đang soạn/Chờ duyệt/Đang sử dụng/Ngừng sử dụng) | Đúng, hiển thị "Chưa có giáo án nào" (0 giáo án) | Pass |
| 2 | Bấm "Soạn giáo án" | Mở wizard nhiều bước | Đúng — wizard 4 bước: Tạo giáo án → Tạo bài học mẫu → Upload tài liệu → Xem lại | Pass |
| 3 | Xem form bước 1 | Các trường: Mã giáo án, Tên giáo án, Khóa học, Cấp độ, Mô tả | Đầy đủ, có validate required (*) cho Mã/Tên/Khóa học | Pass |
| 4 | Bấm "Tiếp tục" khi chưa nhập gì | Chặn và báo lỗi validate | Chưa test trực tiếp (out of scope smoke, nhưng form có đánh dấu * required nên khả năng cao có validate) | Not tested |

## Ghi chú / Lỗi phát hiện
Không phát hiện lỗi kỹ thuật. Chưa test hết toàn bộ wizard 4 bước (tạo bài học mẫu, upload tài liệu) do cần nhập dữ liệu đầy đủ để đi hết luồng — khuyến nghị test sâu hơn ở lượt sau nếu cần xác nhận toàn bộ luồng tạo giáo án hoạt động end-to-end.
