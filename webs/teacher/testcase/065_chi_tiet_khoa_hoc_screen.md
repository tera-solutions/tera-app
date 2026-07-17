# Test Case: [065] Chi tiết khóa học

> Module: Teacher | Screen: Chi tiết khóa học | Route: `/course/{id}` | Task ID: 065
> Nguồn: `tasks/065_chi_tiet_khoa_hoc_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Giáo viên đã đăng nhập, truy cập `/course/{id}` (BasicLayout). Dữ liệu lấy từ 3 API: Course Detail, Course Curriculum, Course Activities. Hiển thị thông tin khóa học, chương trình học tập (curriculum tree), thống kê và hoạt động gần đây.

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-065-01 | Load trang chi tiết khóa học | Functional | High | Khóa học id=1 tồn tại | 1. Truy cập /course/1 | id=1 | Gọi GET /api/teacher/courses/1, /curriculum, /activities; hiển thị CourseInfoCard, 4 CourseStatRow (48/42/8470/95%), LessonPlanTree, ActivityTimeline |
| TC-065-02 | Progress bar mỗi bài học render đúng % | UI-Validation | High | Curriculum có nhiều bài học với completion_rate khác nhau | 1. Quan sát progress bar từng bài trong LessonPlanTree | Bài 1.1: 90%, Bài 1.2: 85%, Bài 2.1: 50%, Bài 2.2: 10% | Progress bar hiển thị đúng % và đúng màu: ≥80% xanh lá (Bài 1.1, 1.2), 50-79% cam (Bài 2.1), <50% xám/đỏ (Bài 2.2) |
| TC-065-03 | Click vào bài học điều hướng | Functional | High | LessonPlanTree có bài học | 1. Click vào "Bài 1.1 Vocabulary" | lesson id=101 | Điều hướng sang /lesson/101 |
| TC-065-04 | Click "Bắt đầu học" | Functional | High | Đang ở trang chi tiết khóa học | 1. Click nút "Bắt đầu học" | N/A | Điều hướng sang buổi học tiếp theo của khóa học |
| TC-065-05 | Click "Xem giáo án" | Functional | Medium | Đang ở trang chi tiết khóa học | 1. Click nút "Xem giáo án" | N/A | Điều hướng sang lesson plan (Giáo án) của khóa học |
| TC-065-06 | Expand/collapse module trong curriculum | Functional | Medium | Curriculum có nhiều module | 1. Click vào tiêu đề "Module 1: Foundations" để thu gọn<br>2. Click lại để mở rộng | module id=1 | Danh sách bài học trong module được ẩn/hiện tương ứng (courseDetailStore.setExpandedModule) |
| TC-065-07 | Activity timeline hiển thị đúng thứ tự | UI-Validation | Medium | Có nhiều activity với created_at khác nhau | 1. Quan sát ActivityTimeline | activities=[lesson_completed, ...] | Các hoạt động được sắp xếp theo thứ tự thời gian (mới nhất trước), hiển thị icon + mô tả + thời gian tương đối |
| TC-065-08 | Stats cards khớp dữ liệu khóa học | UI-Validation | High | API trả về stats đầy đủ | 1. Quan sát 4 CourseStatRow | students=48, completed_students=42, total_hours=8470, completion_rate=95 | Card "Học viên"=48, "Đã hoàn thành"=42, "Tổng giờ học"=8,470, "Tỷ lệ"=95% khớp đúng dữ liệu API |
| TC-065-09 | Khóa học không tồn tại | Error-Handling | High | id khóa học không tồn tại trong hệ thống | 1. Truy cập /course/99999 | id=99999 | API trả về lỗi 404; trang hiển thị thông báo "Không tìm thấy khóa học" (404 page) |
| TC-065-10 | Progress bar tổng thể khóa học (ProgressBar component) | UI-Validation | Medium | overall_completion=95 | 1. Quan sát Progress bar phía panel phải | overall_completion=95 | Hiển thị "95% hoàn thành" đúng label và độ dài thanh progress |
| TC-065-11 | Click "Chia sẻ" khóa học | Functional | Low | Đang ở trang chi tiết khóa học | 1. Click nút Chia sẻ ở góc trên | N/A | Mở popup/hộp thoại chia sẻ khóa học (link hoặc mạng xã hội) |
| TC-065-12 | Click "Sửa" khóa học | Functional | Medium | Đang ở trang chi tiết khóa học | 1. Click nút Sửa ở góc trên | N/A | Mở form chỉnh sửa thông tin khóa học |
| TC-065-13 | Curriculum rỗng (khóa học chưa có module nào) | Edge-Case | Medium | modules=[] | 1. Truy cập khóa học chưa có chương trình học | modules=[] | Hiển thị Empty state cho khu vực Chương trình học tập, không lỗi |
| TC-065-14 | Activity list rỗng | Edge-Case | Low | activities=[] | 1. Truy cập khóa học chưa có hoạt động nào | activities=[] | Hiển thị Empty state cho khu vực Hoạt động gần đây |
| TC-065-15 | Lỗi tải Course Curriculum (API lỗi riêng lẻ) | Error-Handling | Medium | API /curriculum trả lỗi 5xx trong khi Course Detail thành công | 1. Truy cập /course/1 khi API curriculum lỗi | N/A | CourseInfoCard vẫn hiển thị bình thường; khu vực LessonPlanTree hiển thị lỗi tải dữ liệu riêng, không crash toàn trang |