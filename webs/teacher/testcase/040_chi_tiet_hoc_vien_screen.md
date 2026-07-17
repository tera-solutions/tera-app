# Test Case: [040] Chi tiết học viên

> Module: Teacher | Screen: Chi tiết học viên | Route: `/student/{id}` | Task ID: 040
> Nguồn: `tasks/040_chi_tiet_hoc_vien_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Người dùng đã đăng nhập với tài khoản giáo viên, có lớp chứa học viên cần xem chi tiết. Breadcrumb: Học viên > Chi tiết học viên. API `GET /api/teacher/students/{id}` và các API con hoạt động bình thường trừ khi ghi chú khác.

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-040-01 | Load trang chi tiết học viên hợp lệ | Functional | High | HV id=1 "Nguyễn Minh An" thuộc lớp GV phụ trách | 1. Truy cập `/student/1`<br>2. Quan sát profile card + 5 stat card | student_id=1 | Gọi `GET /api/teacher/students/1`; hiển thị đúng tên, avatar, lớp "Starters 2A", trạng thái "Đang học" |
| TC-040-02 | Stat card hiển thị đúng 5 chỉ số | UI-Validation | High | stats trả về attendance_rate=85, avg_score=8.2, homework_completion=98, total_sessions=12, points=5 | 1. Load trang, đối chiếu 5 card | — | Card Chuyên cần=85%, Điểm TB=8.2, Bài tập=98%, Buổi học=12, Điểm=5 hiển thị đúng |
| TC-040-03 | Tab "Tổng quan" active mặc định khi vào trang | Functional | Medium | — | 1. Truy cập `/student/1` lần đầu | — | Tab "Tổng quan" được active mặc định, hiển thị đầy đủ các section: tiến độ, kỹ năng, lịch học, nhận xét, thành tích |
| TC-040-04 | Click tab "Điểm số" | Functional | High | — | 1. Click tab "Điểm số" | — | `studentDetailStore.setActiveTab('score')` được gọi, hiển thị bảng điểm của học viên |
| TC-040-05 | Click tab "Bài tập" | Functional | High | — | 1. Click tab "Bài tập" | — | Hiển thị danh sách bài tập của học viên (đã giao/đã nộp/điểm) |
| TC-040-06 | Click tab "Tài liệu" | Functional | Medium | — | 1. Click tab "Tài liệu" | — | Hiển thị danh sách tài liệu học tập đã chia sẻ cho học viên |
| TC-040-07 | Line chart tiến độ học tập render đúng dữ liệu | UI-Validation | Medium | API progress trả `chart_data` 2 điểm: Tuần 1=7.5, Tuần 2=8.0 | 1. Ở tab Tổng quan, quan sát chart "Tiến độ học tập" | — | Gọi `GET /api/teacher/students/1/progress`; line chart vẽ đúng 2 điểm dữ liệu theo trục tuần |
| TC-040-08 | Bar chart kỹ năng hiển thị đúng 4 kỹ năng | UI-Validation | Medium | skills: listening=82, speaking=70, reading=78, writing=65 | 1. Quan sát khu vực "Kỹ năng" | — | Hiển thị đúng 4 horizontal bar: Listening 82%, Speaking 70%, Reading 78%, Writing 65% |
| TC-040-09 | Lịch học tiếp theo hiển thị đúng buổi sắp tới | Functional | Medium | API schedule trả 1 session ngày 20/05/2025 | 1. Quan sát bảng "Lịch học tiếp theo" | — | Gọi `GET /api/teacher/students/1/schedule`; bảng hiển thị đúng Ngày 20/05/2025, Giờ 08:00-09:30, Lớp Starters 2A, Phòng 01 |
| TC-040-10 | Nhận xét gần đây hiển thị đúng | Functional | Medium | API comments trả về danh sách nhận xét | 1. Quan sát mục "Nhận xét gần đây" | — | Gọi `GET /api/teacher/students/1/comments`; hiển thị 3-5 nhận xét gần nhất, mỗi item có nội dung, ngày, tên GV |
| TC-040-11 | Thành tích & Huy hiệu hiển thị đúng badges | Functional | Medium | API achievements trả về badges | 1. Quan sát mục "Thành tích & Huy hiệu" | — | Gọi `GET /api/teacher/students/1/achievements`; hiển thị grid badge icon + mô tả + ngày đạt được |
| TC-040-12 | Tài liệu học tập hiển thị danh sách file | Functional | Low | — | 1. Quan sát mục "Tài liệu học tập" | — | Hiển thị danh sách file tài liệu đã chia sẻ với học viên (nếu có) |
| TC-040-13 | Click nút "Nhận xét" mở form tạo nhận xét | Functional | High | — | 1. Click nút "Nhận xét" trên StudentProfileCard | — | Mở form tạo nhận xét cho học viên hiện tại (liên kết màn hình [041]) |
| TC-040-14 | Click nút "Nhắn tin" | Functional | Medium | — | 1. Click nút "Nhắn tin" trên StudentProfileCard | — | Mở cửa sổ/luồng nhắn tin với học viên hoặc phụ huynh |
| TC-040-15 | Click nút "Ghi chú" | Functional | Medium | — | 1. Click nút "Ghi chú" trên StudentProfileCard | — | Mở khu vực nhập/xem ghi chú riêng của giáo viên về học viên |
| TC-040-16 | Truy cập học viên không tồn tại | Error-Handling | High | id không tồn tại trong hệ thống | 1. Truy cập `/student/99999` | student_id=99999 | Hiển thị trang/khối 404 "Học viên không tồn tại" |
| TC-040-17 | Truy cập học viên không thuộc quyền quản lý | Permission | High | HV thuộc lớp GV khác không phụ trách | 1. Truy cập `/student/{id}` của HV không thuộc lớp mình | — | Hệ thống redirect người dùng về trang danh sách học viên `/students` |
| TC-040-18 | Lỗi khi tải thông tin học viên | Error-Handling | High | API `GET /api/teacher/students/{id}` trả lỗi 500 | 1. Truy cập `/student/1` khi API lỗi | — | Hiển thị Toast "Không thể tải thông tin học viên" |
| TC-040-19 | Không có lịch học sắp tới | Edge-Case | Low | API schedule trả về sessions rỗng | 1. Truy cập trang HV không có buổi học sắp tới | — | Bảng "Lịch học tiếp theo" hiển thị EmptyState phù hợp, không lỗi |
| TC-040-20 | Không có nhận xét nào | Edge-Case | Low | API comments trả về data rỗng | 1. Truy cập trang HV chưa có nhận xét nào | — | Mục "Nhận xét gần đây" hiển thị EmptyState phù hợp |
