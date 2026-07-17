# Test Case: [031] Trang chủ (Dashboard)

> Module: Teacher | Screen: Trang chủ (Dashboard) | Route: `/dashboard` | Task ID: 031
> Nguồn: `tasks/031_trang_chu_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Đã đăng nhập với tài khoản role Teacher, có ít nhất 1 lớp học được phân công. Truy cập màn hình sau khi login sẽ được redirect mặc định tới `/dashboard` (BasicLayout có sidebar + header).

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-031-01 | Load dashboard thành công | Functional | High | Đã đăng nhập, GV có tên hiển thị | 1. Truy cập `/dashboard`<br>2. Quan sát DashboardHeader | GET /api/teacher/dashboard/summary trả 200 | Hiển thị "Xin chào, {tên giáo viên}" và subtitle "Đây là nhật ký ngày học hôm nay, hãy quan sát những điều thú vị!" |
| TC-031-02 | Hiển thị đủ 4 StatisticCard | Functional | High | API summary trả đủ field stats | 1. Truy cập `/dashboard`<br>2. Kiểm tra 4 card: Phụ vào, Lớp đang đợi, Buổi dạy hôm nay, Tỷ lệ hoàn thành | stats.active_classes=12, stats.lessons_today=3, stats.completion_rate=85 | 4 card hiển thị đúng label và value tương ứng dữ liệu API |
| TC-031-03 | ScheduleWidget có lịch hôm nay | Functional | High | schedule_today có dữ liệu | 1. Truy cập `/dashboard`<br>2. Quan sát widget Lịch dạy hôm nay | schedule_today gồm 1 item Starters 2A 08:00-09:30 | Hiển thị tối đa 5 buổi học với thời gian, tên lớp + cấp độ, phòng, trạng thái |
| TC-031-04 | ScheduleWidget không có lịch hôm nay | Edge-Case | Medium | schedule_today rỗng | 1. Truy cập `/dashboard` khi không có buổi dạy nào hôm nay | schedule_today: [] | Hiển thị thông báo "Không có lịch dạy hôm nay" |
| TC-031-05 | HomeworkWidget có bài chờ chấm | Functional | High | homework_pending có dữ liệu | 1. Truy cập `/dashboard`<br>2. Quan sát widget Bài tập cần chấm | homework_pending gồm Unit 01 - Homework, pending_count=5 | Hiển thị tên bài tập, lớp, số bài cần chấm (tối đa 5 mục) |
| TC-031-06 | HomeworkWidget không có bài chờ chấm | Edge-Case | Medium | homework_pending rỗng | 1. Truy cập `/dashboard` khi không còn bài chờ chấm | homework_pending: [] | Widget hiển thị trạng thái rỗng, không lỗi |
| TC-031-07 | NotificationWidget hiển thị thông báo mới | Functional | High | API notifications trả dữ liệu | 1. Truy cập `/dashboard`<br>2. Quan sát widget Thông báo mới | notifications_unread=3 | Hiển thị tối đa 5 thông báo với icon loại, tiêu đề, thời gian và badge số chưa đọc = 3 |
| TC-031-08 | AttendanceWidget hiển thị điểm danh | Functional | Medium | Có lớp học hôm nay | 1. Truy cập `/dashboard`<br>2. Quan sát widget Điểm danh | Avatar học viên lớp hôm nay | Hiển thị avatar học viên và thống kê nhanh Có mặt / Vắng / Muộn |
| TC-031-09 | ProgressWidget hiển thị tiến độ học tập | Functional | Medium | Có dữ liệu tiến độ lớp | 1. Truy cập `/dashboard`<br>2. Quan sát widget Tiến độ học tập | Danh sách lớp + % tiến độ | Hiển thị progress bar hoặc donut chart theo từng lớp |
| TC-031-10 | LessonPlanWidget hiển thị giáo án gần đây | Functional | Medium | Có giáo án gần đây | 1. Truy cập `/dashboard`<br>2. Quan sát widget Giáo án gần đây | Tối đa 3 giáo án | Hiển thị tên unit, lớp, % đã giảng cho tối đa 3 giáo án gần nhất |
| TC-031-11 | Nhấn "Xem tất cả" ở Lịch dạy hôm nay | Functional | High | ScheduleWidget hiển thị bình thường | 1. Truy cập `/dashboard`<br>2. Click link "Xem tất cả" trong ScheduleWidget | N/A | Điều hướng sang route `/schedule` |
| TC-031-12 | Nhấn "Xem tất cả" ở Thông báo | Functional | High | NotificationWidget hiển thị bình thường | 1. Truy cập `/dashboard`<br>2. Click link "Xem tất cả" trong NotificationWidget | N/A | Điều hướng sang route `/notifications` |
| TC-031-13 | Nhấn "Xem chi tiết" ở AttendanceWidget | Functional | Medium | AttendanceWidget hiển thị bình thường | 1. Truy cập `/dashboard`<br>2. Click "Xem chi tiết" | N/A | Điều hướng sang route `/attendance` |
| TC-031-14 | Nhấn "Xem tất cả" ở HomeworkWidget | Functional | Medium | HomeworkWidget hiển thị bình thường | 1. Truy cập `/dashboard`<br>2. Click "Xem tất cả" trong HomeworkWidget | N/A | Điều hướng sang route `/homework/review` |
| TC-031-15 | API dashboard summary lỗi | Error-Handling | High | Server trả lỗi cho GET /api/teacher/dashboard/summary | 1. Giả lập API summary trả 500<br>2. Truy cập `/dashboard` | HTTP 500 | Các widget phụ thuộc summary hiển thị icon lỗi + nút "Thử lại", các widget khác vẫn hoạt động, trang không crash |
| TC-031-16 | API notifications lỗi | Error-Handling | Medium | Server trả lỗi cho GET /api/teacher/notifications | 1. Giả lập API notifications trả 500<br>2. Truy cập `/dashboard` | HTTP 500 | NotificationWidget hiển thị icon lỗi + nút "Thử lại", không ảnh hưởng các widget khác |
| TC-031-17 | Nhấn nút "Thử lại" trên widget lỗi | Error-Handling | Medium | Widget đang ở trạng thái lỗi | 1. Sau khi widget hiển thị lỗi, click nút "Thử lại" | N/A | Widget gọi lại đúng API tương ứng, hiển thị dữ liệu nếu thành công |
| TC-031-18 | Refresh trang dashboard | Functional | Medium | Đã load trang dashboard | 1. Truy cập `/dashboard`<br>2. Nhấn F5 hoặc reload trình duyệt | N/A | Toàn bộ API (summary, notifications) được gọi lại (re-fetch) |
| TC-031-19 | Truy cập /dashboard khi chưa đăng nhập | Permission | High | Chưa đăng nhập / token hết hạn | 1. Xóa token đăng nhập<br>2. Truy cập `/dashboard` | N/A | Bị chuyển hướng về trang đăng nhập, không hiển thị nội dung dashboard |
| TC-031-20 | Trạng thái loading khi đang tải dữ liệu | UI-Validation | Low | Network chậm hoặc giả lập delay | 1. Truy cập `/dashboard`<br>2. Quan sát các widget trong lúc đang fetch API | N/A | Mỗi widget hiển thị skeleton loader cho đến khi có dữ liệu |
