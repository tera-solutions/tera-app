# Test Case: [046] Thành tích

> Module: Teacher | Screen: Thành tích | Route: `/achievement` | Task ID: 046
> Nguồn: `tasks/046_thanh_tich_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Người dùng đã đăng nhập với tài khoản giáo viên. API base: `https://api.anhnguhana.com/api`.

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-046-01 | Load trang Thành tích thành công | Functional | High | Đã đăng nhập | 1. Truy cập `/achievement`<br>2. Chờ trang tải xong | GET `/api/teacher/achievements` trả 200 | Hiển thị TeacherProfileCard (avatar, tên "Cô Ngọc", vai trò, ngày tham gia), CareerStatRow (100 lớp, 250 giờ, 50 HV, 90% rating), OverviewStatRow (4.8★, 96.5%, 28 buổi, 12 lớp) |
| TC-046-02 | Line chart tiến trình render đúng dữ liệu | Functional | High | Đã load trang | 1. Quan sát khu vực "Tiến trình" | GET `/api/teacher/achievements/progress?period=month` trả chart_data gồm các điểm theo tháng | Line chart hiển thị đúng các điểm dữ liệu (rating, students, sessions) theo trục X là tháng |
| TC-046-03 | Chuyển period biểu đồ sang "Tuần" | Functional | Medium | Đã load trang | 1. Chọn bộ lọc period = week | GET `/progress?period=week` | Chart cập nhật lại dữ liệu theo tuần, achievementStore.setChartPeriod('week') |
| TC-046-04 | Chuyển period biểu đồ sang "Năm" | Functional | Medium | Đã load trang | 1. Chọn bộ lọc period = year | GET `/progress?period=year` | Chart cập nhật lại dữ liệu theo năm |
| TC-046-05 | Danh sách đánh giá học viên hiển thị đúng | Functional | High | Có dữ liệu review | 1. Quan sát khu vực "Đánh giá học viên" | GET `/api/teacher/achievements/reviews` trả danh sách review | Hiển thị avatar, tên HV, nội dung đánh giá, số sao, ngày đánh giá cho từng review |
| TC-046-06 | Achievement cards hiển thị top tháng/tuần | Functional | Medium | Có dữ liệu thành tích nổi bật | 1. Quan sát khu vực "Top tháng / Top tuần" | — | Hiển thị card với icon, tiêu đề, mô tả ngắn cho thành tích nổi bật trong tháng và tuần |
| TC-046-07 | Bảng thống kê lớp học hiển thị đúng số liệu | Functional | Medium | GV đang dạy nhiều lớp | 1. Quan sát khu vực "Thống kê lớp học" | — | Bảng hiển thị đúng tên lớp, số HV, rating lớp, trạng thái cho từng lớp |
| TC-046-08 | Giáo viên mới chưa có dữ liệu (empty state) | Edge-Case | Medium | Tài khoản GV mới tạo, chưa có lớp/giờ dạy | 1. Truy cập `/achievement` | API trả các số liệu = 0 hoặc rỗng | Hiển thị empty state phù hợp thay vì lỗi hoặc số liệu NaN/undefined |
| TC-046-09 | Lỗi tải dữ liệu thành tích (server lỗi) | Error-Handling | High | Đã đăng nhập | 1. Truy cập `/achievement` trong lúc API `/achievements` trả lỗi 500 | GET trả 500 | Hiển thị thông báo lỗi tải dữ liệu, không crash trang |
| TC-046-10 | Lỗi tải dữ liệu biểu đồ tiến trình | Error-Handling | Medium | Đã load trang | 1. API `/achievements/progress` trả lỗi 500 khi đổi period | GET trả 500 | ProgressChart hiển thị trạng thái lỗi/không có dữ liệu thay vì crash |
| TC-046-11 | Lỗi tải danh sách đánh giá học viên | Error-Handling | Medium | Đã load trang | 1. API `/achievements/reviews` trả lỗi 500 | GET trả 500 | StudentReviewList hiển thị thông báo lỗi thay vì danh sách trống không rõ nguyên nhân |
| TC-046-12 | Chưa đăng nhập truy cập trang Thành tích | Permission | High | Chưa đăng nhập / token hết hạn | 1. Truy cập `/achievement` khi chưa đăng nhập | — | Hệ thống điều hướng (redirect) về trang đăng nhập |
| TC-046-13 | Danh sách đánh giá rỗng | Edge-Case | Low | GV chưa có đánh giá nào từ học viên | 1. Quan sát khu vực "Đánh giá học viên" | GET `/reviews` trả `{data: []}` | Hiển thị empty state "Chưa có đánh giá" |
| TC-046-14 | Rating trung bình hiển thị đúng định dạng | UI-Validation | Low | Đã load trang | 1. Quan sát OverviewStatRow card "Đánh giá sao" | avg_rating = 4.8 | Hiển thị đúng "4.8★" |
