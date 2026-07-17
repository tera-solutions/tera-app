# Test Case: Thành tích (Achievement)

> Route: `/achievement`
> Loại test: Smoke test
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào "Khác" → "Thành tích" | Hồ sơ + thành tích giảng dạy của chính giáo viên đăng nhập | Đúng, hiển thị "Cô Hạ / Teacher" + 8 thẻ thống kê (Lớp/Giờ/HV/Rating/Đánh giá TB/Hài lòng/Buổi dạy/Lớp hiện tại), tất cả = 0 (hợp lý, chưa có dữ liệu giảng dạy) | Pass |
| 2 | Xem khu vực "Tiến trình" | Biểu đồ tiến trình theo tuần/tháng/năm | "Chưa có dữ liệu tiến trình" — hợp lý | Pass |
| 3 | Xem khu vực "Đánh giá học viên" | Danh sách nhận xét học viên gửi cho GV | **Lỗi**: hiển thị "Không tải được dữ liệu" kèm nút "Thử lại" — đây là trạng thái lỗi API, không phải "chưa có dữ liệu" | Fail — lỗi tải dữ liệu (API `hr/teacher-review/list`) |
| 4 | Bấm nút "Thử lại" | Tải lại và hiển thị dữ liệu hoặc rỗng hợp lệ | Không test lại nhiều lần để tránh spam API | Not retested |

## Ghi chú / Lỗi phát hiện
**Bug xác nhận:** panel "Đánh giá học viên" trên trang Thành tích báo lỗi tải dữ liệu thay vì trạng thái rỗng bình thường. Cần kiểm tra API `hr/teacher-review/list` phía backend — có thể lỗi 500/CORS/thiếu quyền cho tài khoản demo.
