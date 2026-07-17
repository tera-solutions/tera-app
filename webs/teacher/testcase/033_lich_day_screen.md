# Test Case: [033] Lịch dạy

> Module: Teacher | Screen: Lịch dạy | Route: `/schedule` | Task ID: 033
> Nguồn: `tasks/033_lich_day_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Đã đăng nhập với tài khoản role Teacher, có ít nhất 1 lớp học và lịch dạy được phân công trong tuần/tháng hiện tại. Truy cập màn hình `/schedule` (BasicLayout).

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-033-01 | Load trang lịch dạy mặc định (tuần) | Functional | High | Có lịch dạy trong tuần hiện tại | 1. Truy cập `/schedule` | GET /api/teacher/schedules?view=week&date=2025-05-18 trả 200 | Hiển thị WeekCalendar của tuần hiện tại với các buổi học đã có |
| TC-033-02 | Chuyển sang chế độ xem Tháng | Functional | High | Đang ở chế độ Tuần | 1. Click tab "Tháng" trên ScheduleToolbar | view=month | Hiển thị MonthCalendar dạng lưới 7 cột x ~6 hàng |
| TC-033-03 | Điều hướng lùi (nút ←) | Functional | Medium | Đang ở chế độ Tuần hoặc Tháng | 1. Click nút "←" | N/A | Lùi về tuần/tháng trước, danh sách lịch cập nhật theo khoảng ngày mới |
| TC-033-04 | Điều hướng tiến (nút →) | Functional | Medium | Đang ở chế độ Tuần hoặc Tháng | 1. Click nút "→" | N/A | Tiến tới tuần/tháng sau, danh sách lịch cập nhật theo khoảng ngày mới |
| TC-033-05 | Click vào block buổi học | Functional | High | Có ít nhất 1 buổi học trong lịch | 1. Click vào 1 block buổi học trong WeekCalendar | GET /api/teacher/schedules/{id} trả 200 | Mở ScheduleDetailDrawer hiển thị tên lớp, cấp độ, phòng, thời gian, giáo án, số học viên |
| TC-033-06 | Nhấn "Bắt đầu buổi học" trong Drawer | Functional | High | ScheduleDetailDrawer đang mở | 1. Click nút "Bắt đầu buổi học" | id buổi học | Điều hướng sang route `/lesson/{id}` |
| TC-033-07 | Nhấn "Xem chi tiết lớp" trong Drawer | Functional | Medium | ScheduleDetailDrawer đang mở | 1. Click nút "Xem chi tiết lớp" | class_id | Điều hướng sang route `/classroom/{id}` |
| TC-033-08 | Ngày không có lịch dạy | Edge-Case | Medium | Ngày/khung giờ trống lịch | 1. Truy cập tuần không có buổi học nào | data: [] | Các ô/khung giờ hiển thị rỗng, không gây lỗi hiển thị |
| TC-033-09 | Tìm kiếm lớp trong Schedule | Functional | Medium | Có nhiều lớp trong lịch | 1. Nhập tên lớp vào ô "Tìm kiếm lớp..." | Ví dụ "Starters 2A" | Chỉ hiển thị các buổi học thuộc lớp có tên khớp từ khóa tìm kiếm |
| TC-033-10 | Responsive trên mobile | UI-Validation | Low | Truy cập bằng màn hình mobile | 1. Truy cập `/schedule` trên viewport mobile | N/A | Hiển thị chế độ Day view thay vì Week/Month view |
| TC-033-11 | Xem thêm khi ngày có nhiều hơn 3 buổi học (Tháng) | Functional | Medium | Ngày có > 3 buổi học trong MonthCalendar | 1. Chuyển sang chế độ Tháng<br>2. Quan sát ô ngày có nhiều buổi học | Ngày có 4+ buổi | Ô ngày hiển thị tối đa 3 buổi + link "Xem thêm +N" |
| TC-033-12 | Click vào ngày trong MonthCalendar | Functional | Medium | Đang ở chế độ Tháng | 1. Click vào 1 ô ngày | N/A | Mở DayView sidebar hiển thị chi tiết các buổi học của ngày đó |
| TC-033-13 | ScheduleSidebar hiển thị đúng số liệu tổng quan | Functional | Medium | API schedules trả summary | 1. Truy cập `/schedule`<br>2. Quan sát panel phải | summary.total_classes=3, summary.total_students=72 | Hiển thị đúng "Lớp chủ nhiệm: 3" và "Học viên: 72" |
| TC-033-14 | Mini calendar highlight ngày có lịch | UI-Validation | Low | Có lịch dạy trong tháng | 1. Quan sát mini calendar trong ScheduleSidebar | N/A | Các ngày có buổi dạy được highlight trên mini calendar |
| TC-033-15 | Nút "Thêm lịch dạy" chỉ hiển thị khi có quyền | Permission | Medium | Tài khoản không có quyền thêm lịch | 1. Đăng nhập tài khoản không có quyền tạo lịch<br>2. Truy cập `/schedule` | N/A | Nút "Thêm lịch dạy" không hiển thị trên ScheduleToolbar |
| TC-033-16 | API danh sách lịch dạy lỗi | Error-Handling | High | Giả lập lỗi server | 1. Giả lập GET /api/teacher/schedules trả 500<br>2. Truy cập `/schedule` | HTTP 500 | Hiển thị thông báo lỗi, trang không crash |
| TC-033-17 | API chi tiết buổi học lỗi/không tồn tại | Error-Handling | Medium | id buổi học không hợp lệ | 1. Click vào 1 block, giả lập GET schedules/{id} trả 404 | HTTP 404 | Drawer hiển thị thông báo lỗi thay vì dữ liệu trống hoặc crash |
| TC-033-18 | Hiển thị đúng trạng thái buổi học | UI-Validation | Medium | Có buổi học ở các trạng thái khác nhau | 1. Quan sát các block có status khác nhau (upcoming/ongoing/done) | status=upcoming/ongoing/done | Hiển thị đúng nhãn Sắp tới / Đang diễn ra / Đã xong tương ứng |
| TC-033-19 | Truy cập /schedule khi chưa đăng nhập | Permission | High | Chưa đăng nhập / token hết hạn | 1. Xóa token đăng nhập<br>2. Truy cập `/schedule` | N/A | Bị chuyển hướng về trang đăng nhập |
| TC-033-20 | Lọc theo class_id qua URL | Functional | Low | Truy cập URL có query class_id | 1. Truy cập `/schedule?class_id=10` | class_id=10 | Chỉ hiển thị lịch dạy của lớp có id=10 |
