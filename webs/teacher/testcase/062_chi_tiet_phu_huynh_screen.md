# Test Case: [062] Chi tiết phụ huynh

> Module: Teacher | Screen: Chi tiết phụ huynh | Route: `/parent/{id}` | Task ID: 062
> Nguồn: `tasks/062_chi_tiet_phu_huynh_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Giáo viên đã đăng nhập và có lớp chứa con của phụ huynh này. Dữ liệu lấy từ `GET /api/teacher/parents/{id}`, hiển thị thông tin con đang học, lịch học, tài liệu, thống kê và thông báo.

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-062-01 | Load trang chi tiết phụ huynh | Functional | High | Đã đăng nhập, GV có lớp chứa con của PH id=1 | 1. Truy cập /parent/1 | id=1 | Gọi GET /api/teacher/parents/1; hiển thị "Xin chào, {teacher_name}", 2 stat card (Con đang học=2, Buổi học tháng này=28), thông tin con, lịch học, tài liệu, thống kê, thông báo |
| TC-062-02 | Phụ huynh có nhiều con - Dropdown chọn con | Functional | High | Phụ huynh id=1 có 2 con trở lên | 1. Mở Dropdown chọn con ở RecentScheduleCard<br>2. Chọn con khác | selectedChild=Minh Anh -> con thứ 2 | Danh sách lịch học và thống kê cập nhật theo đúng con vừa chọn (parentDetailStore.setSelectedChild) |
| TC-062-03 | Hiển thị đúng lịch học theo con đang chọn | Functional | High | Đã chọn 1 con trong dropdown | 1. Quan sát RecentScheduleCard sau khi chọn con | child_name=Minh Anh | Danh sách buổi học hiển thị đúng giờ + ngày trong tuần của con đã chọn (VD 08:00-09:30 Thứ 2) |
| TC-062-04 | Tải tài liệu học tập | Functional | High | Có ít nhất 1 tài liệu trong materials | 1. Click nút Download tại 1 tài liệu | Tài liệu Unit 5.pdf | File được tải xuống thành công từ URL tương ứng |
| TC-062-05 | Click vào thông báo | Functional | High | Có thông báo chưa đọc (read=false) | 1. Click vào 1 thông báo trong NotificationList | notification id=1 | Thông báo được đánh dấu đã đọc (read=true) và hiển thị chi tiết thông báo |
| TC-062-06 | Thống kê học viên hiển thị đúng chỉ số | UI-Validation | High | Con id=10 có dữ liệu stats | 1. Quan sát StudentStatSidebar | attendance_rate=92, avg_score=8.5, homework_completion=95 | Hiển thị đúng % Chuyên cần, Điểm TB, % Bài tập hoàn thành khớp dữ liệu API |
| TC-062-07 | Phụ huynh không có con trong lớp giáo viên phụ trách | Permission | High | GV không dạy lớp nào có con của PH này | 1. Truy cập /parent/{id} với id không hợp lệ với GV hiện tại | id=999 | Redirect hoặc hiển thị thông báo không có quyền truy cập / không tìm thấy dữ liệu |
| TC-062-08 | Stat card "Con đang học" và "Buổi học tháng này" hiển thị đúng | UI-Validation | Medium | Dữ liệu trả về từ API | 1. Quan sát 2 stat card đầu trang | children.length=2, sessions_this_month=28 | Card hiển thị đúng số con và tổng buổi học tháng này |
| TC-062-09 | Danh sách tài liệu rỗng | Edge-Case | Medium | materials=[] | 1. Truy cập chi tiết phụ huynh không có tài liệu chia sẻ | materials=[] | Hiển thị Empty state cho khu vực Tài liệu học tập, không lỗi |
| TC-062-10 | Danh sách thông báo rỗng | Edge-Case | Medium | notifications=[] | 1. Truy cập chi tiết phụ huynh không có thông báo | notifications=[] | Hiển thị Empty state cho khu vực Thông báo mới nhất |
| TC-062-11 | Chỉ có 1 con - ẩn hoặc disable dropdown chọn con | Edge-Case | Low | children.length=1 | 1. Truy cập chi tiết PH chỉ có 1 con | children=[Minh Anh] | Dropdown chọn con không hiển thị hoặc chỉ có 1 lựa chọn duy nhất, mặc định hiển thị con đó |
| TC-062-12 | Phần Liên hệ hiển thị đúng SĐT/Email/Vai trò | UI-Validation | Medium | Dữ liệu parent trả về đầy đủ | 1. Quan sát thông tin liên hệ phụ huynh trên trang | phone=0901234567, email=an@example.com, relation=Mẹ | Hiển thị đúng SĐT, email, vai trò liên hệ của phụ huynh |
| TC-062-13 | Lỗi tải dữ liệu chi tiết (API lỗi 5xx/404) | Error-Handling | Medium | API GET /api/teacher/parents/{id} trả lỗi | 1. Truy cập /parent/{id} khi API lỗi | id=1 | Hiển thị thông báo lỗi, không crash trang, có tùy chọn thử lại hoặc quay lại danh sách |
| TC-062-14 | Breadcrumb điều hướng | UI-Validation | Low | Đang ở /parent/{id} | 1. Click vào "Phụ huynh" trên breadcrumb | N/A | Điều hướng quay về /parents |