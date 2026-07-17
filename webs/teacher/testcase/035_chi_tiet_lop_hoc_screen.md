# Test Case: [035] Chi tiết lớp học

> Module: Teacher | Screen: Chi tiết lớp học | Route: `/classroom/{id}` | Task ID: 035
> Nguồn: `tasks/035_chi_tiet_lop_hoc_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Đã đăng nhập với tài khoản role Teacher và được phân công phụ trách lớp học có id tương ứng. Truy cập màn hình `/classroom/{id}` (BasicLayout, breadcrumb: Lớp học > Chi tiết lớp học).

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-035-01 | Load trang chi tiết lớp học thành công | Functional | High | GV được phân công lớp id=10 | 1. Truy cập `/classroom/10` | GET /api/teacher/classrooms/10 trả 200 | Hiển thị đầy đủ thông tin lớp: ảnh bìa, tên lớp, cấp độ, phòng, lịch học, thời gian, sỹ số 24/25, trạng thái, GV phụ trách |
| TC-035-02 | Hiển thị đúng 4 chỉ số StatisticRow | Functional | High | classroom.stats có dữ liệu | 1. Truy cập `/classroom/10`<br>2. Quan sát StatisticRow | attendance_rate=85.2, homework_completion=80, avg_score=8.2, lesson_plan_progress=90 | Hiển thị đúng 4 chỉ số: Tỷ lệ chuyên cần, Hoàn thành bài tập, Điểm trung bình, Tiến độ giáo án |
| TC-035-03 | Click tên học viên trong StudentList | Functional | High | Danh sách học viên có dữ liệu | 1. Chuyển tab "Học viên"<br>2. Click vào tên 1 học viên | student id=1 | Điều hướng sang route `/student/{id}` |
| TC-035-04 | Tìm kiếm học viên theo tên | Functional | Medium | Danh sách học viên có nhiều bản ghi | 1. Nhập từ khóa vào ô tìm kiếm, ví dụ "Nguyễn" | search=Nguyễn | Danh sách chỉ hiển thị học viên có tên khớp từ khóa |
| TC-035-05 | Lọc học viên theo trạng thái | Functional | Medium | Có học viên ở nhiều trạng thái | 1. Chọn filter trạng thái "Đang học" (active) | status=active | Chỉ hiển thị học viên có status=active |
| TC-035-06 | Xuất Excel danh sách học viên | Functional | Medium | Danh sách học viên có dữ liệu | 1. Click nút "Xuất Excel" | N/A | File Excel danh sách học viên được tải về thành công |
| TC-035-07 | Truy cập lớp không tồn tại | Error-Handling | High | id lớp không tồn tại trong hệ thống | 1. Truy cập `/classroom/99999` | GET /api/teacher/classrooms/99999 trả 404 | Hiển thị trang lỗi 404 hoặc redirect |
| TC-035-08 | Truy cập lớp không được phân công | Permission | High | GV không được phân công lớp id=20 | 1. Đăng nhập tài khoản GV khác<br>2. Truy cập `/classroom/20` | HTTP 403/404 | Bị chặn truy cập, hiển thị 404 hoặc redirect, không lộ dữ liệu lớp |
| TC-035-09 | Click tab "Bài tập" | Functional | Medium | Đang ở trang chi tiết lớp | 1. Click tab "Bài tập" | N/A | Hiển thị danh sách bài tập của lớp |
| TC-035-10 | Click "Nhận xét" cho 1 học viên | Functional | Medium | Đang ở tab Học viên | 1. Trong hàng học viên, click action "Nhận xét" | N/A | Mở form nhận xét học viên |
| TC-035-11 | Click tab "Tổng quan" (mặc định) | Functional | Medium | Đang ở trang chi tiết lớp | 1. Truy cập trang, kiểm tra tab active mặc định | N/A | Tab "Tổng quan" active, hiển thị thông tin lớp + StatisticRow |
| TC-035-12 | Click tab "Lịch học" | Functional | Medium | Đang ở trang chi tiết lớp | 1. Click tab "Lịch học" | N/A | Hiển thị lịch học riêng của lớp này |
| TC-035-13 | Click tab "Điểm số" | Functional | Medium | Đang ở trang chi tiết lớp | 1. Click tab "Điểm số" | N/A | Hiển thị bảng điểm của học viên trong lớp |
| TC-035-14 | AttendanceSummary hiển thị đúng thống kê | Functional | Medium | API attendance-summary trả dữ liệu | 1. Truy cập `/classroom/10`<br>2. Quan sát AttendanceSummary | present_avg=85, absent_avg=10, late_avg=5 | Hiển thị đúng thống kê tổng Có mặt / Vắng / Muộn |
| TC-035-15 | AttendanceSummary hiển thị học viên thường xuyên vắng | Edge-Case | Medium | at_risk_students có dữ liệu | 1. Quan sát mục cảnh báo trong AttendanceSummary | at_risk_students: [{id:3, name:"Trần Văn B", absent_count:5}] | Hiển thị danh sách cảnh báo (warning list) học viên vắng nhiều |
| TC-035-16 | Sidebar phải hiển thị Lịch học sắp tới | Functional | Low | Có lịch học sắp tới cho lớp | 1. Quan sát panel phải mục "Lịch học sắp tới" | N/A | Hiển thị tối đa 5 buổi học tiếp theo |
| TC-035-17 | Sidebar phải hiển thị Thông báo lớp học | Functional | Low | Có thông báo liên quan lớp | 1. Quan sát panel phải mục "Thông báo lớp học" | N/A | Hiển thị các thông báo gần nhất liên quan lớp này |
| TC-035-18 | Phân trang danh sách học viên | Functional | Medium | Số học viên > limit=20 | 1. Chuyển tab Học viên khi lớp có > 20 học viên<br>2. Click sang trang 2 | page=2, limit=20 | Load và hiển thị danh sách học viên trang tiếp theo |
| TC-035-19 | API chi tiết lớp học lỗi | Error-Handling | High | Giả lập lỗi server | 1. Giả lập GET /api/teacher/classrooms/{id} trả 500<br>2. Truy cập `/classroom/10` | HTTP 500 | Hiển thị thông báo lỗi, trang không crash |
| TC-035-20 | Danh sách học viên rỗng | Edge-Case | Medium | Lớp chưa có học viên nào | 1. Truy cập lớp không có học viên<br>2. Chuyển tab Học viên | data: [] | Hiển thị "Không có học viên" |
