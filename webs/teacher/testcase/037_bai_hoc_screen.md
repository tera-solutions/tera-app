# Test Case: [037] Bài học

> Module: Teacher | Screen: Bài học | Route: `/lesson/{id}` | Task ID: 037
> Nguồn: `tasks/037_bai_hoc_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Đã đăng nhập với tài khoản role Teacher, giáo án (lesson plan) tương ứng id tồn tại và thuộc lớp được phân công. Truy cập màn hình `/lesson/{id}` (BasicLayout, breadcrumb: Giáo án > Bài học).

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-037-01 | Load bài học thành công | Functional | High | id=5 tồn tại | 1. Truy cập `/lesson/5` | GET /api/teacher/lesson-plans/5 trả 200 | Hiển thị đầy đủ breadcrumb, tiêu đề "Hello! - Getting to know you", 4 LessonStatRow, mục tiêu, tài liệu, hoạt động |
| TC-037-02 | Nhấn "Bắt đầu giảng bài" thành công | Functional | High | Chưa có session đang diễn ra cho bài học này | 1. Click nút "Bắt đầu giảng bài" | POST /api/teacher/lesson-sessions, body: {lesson_plan_id:5, class_id:10, scheduled_at:...} trả 201 {session_id:101, status:"in_progress"} | Tạo session thành công, điều hướng sang `/lesson-session/101` |
| TC-037-03 | Nhấn "Bắt đầu giảng bài" thất bại | Error-Handling | High | Giả lập lỗi server khi tạo session | 1. Click nút "Bắt đầu giảng bài"<br>2. Giả lập POST /api/teacher/lesson-sessions trả lỗi (500) | HTTP 500 | Hiển thị Toast error, không điều hướng, không tạo session |
| TC-037-04 | Ghi chú cá nhân auto-save | Functional | High | Tab Tổng quan / LessonSidebar hiển thị | 1. Nhập nội dung vào ô "Ghi chú cá nhân"<br>2. Dừng gõ trong 2 giây | PUT /api/teacher/lesson-plans/5/note, body: {note:"..."} trả 200 {success:true} | Sau 2s không gõ, tự động gọi API lưu, hiển thị chữ "Đã lưu" |
| TC-037-05 | Download tài liệu sử dụng | Functional | Medium | Bài học có tài liệu đính kèm | 1. Trong mục "Tài liệu sử dụng", click nút download 1 file | materials: [{name:"Flashcards.pdf", url:"https://..."}] | File được tải về thành công |
| TC-037-06 | Click tab "Học viên" | Functional | Medium | Đang ở màn hình bài học | 1. Click tab "Học viên" | N/A | Hiển thị danh sách học viên của lớp (student_count=45) |
| TC-037-07 | Click tab "Tài liệu" | Functional | Medium | Đang ở màn hình bài học | 1. Click tab "Tài liệu" | N/A | Hiển thị danh sách file đính kèm |
| TC-037-08 | Bài học không tồn tại | Error-Handling | High | id không tồn tại | 1. Truy cập `/lesson/99999` | GET /api/teacher/lesson-plans/99999 trả 404 | Hiển thị trang lỗi 404 |
| TC-037-09 | Đã có session đang diễn ra | Functional | High | Có session in_progress cho bài học này | 1. Truy cập `/lesson/5` khi đã tồn tại session đang diễn ra | session status=in_progress | Nút hiển thị "Tiếp tục buổi học" thay vì "Bắt đầu giảng bài" |
| TC-037-10 | Click tab "Kiểm tra" | Functional | Low | Đang ở màn hình bài học | 1. Click tab "Kiểm tra" | N/A | Hiển thị nội dung tab Kiểm tra |
| TC-037-11 | Click tab "Điểm" | Functional | Low | Đang ở màn hình bài học | 1. Click tab "Điểm" | N/A | Hiển thị nội dung tab Điểm |
| TC-037-12 | Click tab "Ghi chú" | Functional | Low | Đang ở màn hình bài học | 1. Click tab "Ghi chú" | N/A | Hiển thị nội dung tab Ghi chú |
| TC-037-13 | LessonStatRow hiển thị đúng 4 chỉ số | UI-Validation | Medium | stats trả đủ dữ liệu | 1. Quan sát 4 stat card đầu trang | sessions_done=5, sessions_total=4, student_count=45, completion_rate=80 | Hiển thị đúng: Số buổi đã dạy 5, Số buổi học 4, Học viên 45, % Hoàn thành 80% |
| TC-037-14 | ActivityTimeline hiển thị đúng các hoạt động | Functional | Medium | activities có 4 mục | 1. Quan sát mục "Hoạt động trong bài" | Pronunciation 5 phút, Vocabulary 10 phút, Grammar 10 phút, Speaking Practice 10 phút | Mỗi hoạt động hiển thị icon, tên, thời lượng, nội dung mô tả đúng dữ liệu |
| TC-037-15 | LessonSidebar hiển thị đúng thông tin bài học | UI-Validation | Medium | Dữ liệu class_name, level, start_date, end_date | 1. Quan sát panel phải "Thông tin bài học" | class_name="Starters 2A", level="Beginner", start_date="2025-04-01", end_date="2025-05-30" | Hiển thị đúng lớp, cấp độ, ngày bắt đầu, ngày kết thúc |
| TC-037-16 | Donut chart tiến độ hiển thị đúng % | UI-Validation | Low | completion_rate=80 | 1. Quan sát donut chart "Tiến độ" trong sidebar | completion_rate=80 | Donut chart hiển thị đúng 80% |
| TC-037-17 | API lưu ghi chú thất bại | Error-Handling | Medium | Giả lập lỗi server | 1. Nhập nội dung ghi chú, dừng gõ 2s<br>2. Giả lập PUT /api/teacher/lesson-plans/5/note trả 500 | HTTP 500 | Không hiển thị "Đã lưu", hiển thị thông báo lỗi cho người dùng |
| TC-037-18 | Nút edit chỉ hiển thị khi có quyền | Permission | Medium | Tài khoản không có quyền chỉnh sửa | 1. Đăng nhập tài khoản không có quyền edit<br>2. Truy cập `/lesson/5` | N/A | Nút edit trên LessonHeader không hiển thị |
| TC-037-19 | API lấy chi tiết giáo án lỗi | Error-Handling | High | Giả lập lỗi server | 1. Giả lập GET /api/teacher/lesson-plans/5 trả 500<br>2. Truy cập `/lesson/5` | HTTP 500 | Hiển thị thông báo lỗi, trang không crash |
| TC-037-20 | Không có tài liệu đính kèm | Edge-Case | Low | materials rỗng | 1. Truy cập bài học không có tài liệu<br>2. Click tab "Tài liệu" | materials: [] | Tab Tài liệu hiển thị trạng thái rỗng (empty state) |
