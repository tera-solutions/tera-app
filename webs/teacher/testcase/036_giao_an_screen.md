# Test Case: [036] Giáo án

> Module: Teacher | Screen: Giáo án | Route: `/lesson-plan` (hoặc `/classroom/{id}/lesson-plan`) | Task ID: 036
> Nguồn: `tasks/036_giao_an_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Đã đăng nhập với tài khoản role Teacher, có ít nhất 1 lớp được phân công và lớp đó có giáo án. Truy cập màn hình Giáo án (BasicLayout).

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-036-01 | Load trang giáo án thành công | Functional | High | Lớp có giáo án | 1. Truy cập trang Giáo án của lớp Starters 2A | GET /api/teacher/lesson-plans?class_id=10 trả stats: total=24, completed=16, in_progress=6, completion_rate=66.7 | Hiển thị danh sách giáo án và 4 stats card: Tổng giáo án 24, Đã giảng 16, Đang giảng 6, Tổng % 66.7% |
| TC-036-02 | Lọc "Đã giảng" | Functional | High | Có giáo án ở nhiều trạng thái | 1. Chọn dropdown filter "Đã giảng" | status=completed | Chỉ hiển thị các bài đã dạy (status=completed) |
| TC-036-03 | Lọc "Đang giảng" | Functional | Medium | Có giáo án ở nhiều trạng thái | 1. Chọn dropdown filter "Đang giảng" | status=in_progress | Chỉ hiển thị các bài đang trong quá trình giảng |
| TC-036-04 | Lọc "Tới đây" | Functional | Medium | Có giáo án ở nhiều trạng thái | 1. Chọn dropdown filter "Tới đây" | status=upcoming | Chỉ hiển thị các bài chưa giảng (upcoming) |
| TC-036-05 | Lọc theo đơn vị (unit_group) | Functional | Medium | Có nhiều nhóm unit | 1. Chọn 1 giá trị trong dropdown "đơn vị" | unit_group=... | Danh sách chỉ hiển thị giáo án thuộc nhóm unit đã chọn |
| TC-036-06 | Click "Thêm bài mới" | Functional | High | Đang ở trang giáo án | 1. Click nút "Thêm bài mới" | N/A | Mở LessonPlanForm ở chế độ tạo mới (modal/drawer) với các field trống |
| TC-036-07 | Tạo giáo án mới thành công | Functional | High | Form tạo mới đang mở, dữ liệu hợp lệ | 1. Điền đủ title, unit_number, objectives, status<br>2. Click Lưu | POST /api/teacher/lesson-plans, body: {class_id:10, unit_number:7, title:"Unit 07 - Hobbies", objectives:"Students will learn...", status:"upcoming"} | API trả 201, giáo án mới xuất hiện trong danh sách |
| TC-036-08 | Sửa giáo án thành công | Functional | High | Có giáo án đã tồn tại, form sửa đang mở | 1. Click "Sửa" trên 1 giáo án<br>2. Thay đổi thông tin và Lưu | PUT /api/teacher/lesson-plans/{id} | Cập nhật thành công, danh sách hiển thị thông tin mới |
| TC-036-09 | Click tên bài học (row) để xem chi tiết | Functional | High | Danh sách giáo án có dữ liệu | 1. Click vào 1 row trong LessonPlanTable | id giáo án | Điều hướng sang route `/lesson/{id}` |
| TC-036-10 | Upload tài liệu vượt quá 10MB | Error-Handling | Medium | Form đang mở, mục UploadMaterial | 1. Chọn file đính kèm có kích thước > 10MB<br>2. Thực hiện upload | File > 10MB | Hiển thị lỗi "File quá lớn", file không được upload |
| TC-036-11 | Upload tài liệu sai định dạng | Error-Handling | Medium | Form đang mở, mục UploadMaterial | 1. Chọn file không thuộc pdf/doc/docx/ppt/pptx/jpg/png (ví dụ .exe)<br>2. Thực hiện upload | File .exe | Hiển thị lỗi định dạng không được hỗ trợ, file không được upload |
| TC-036-12 | Xóa giáo án | Functional | High | Có giáo án tồn tại trong danh sách | 1. Click action "Xóa" trên 1 giáo án<br>2. Xác nhận trong confirm dialog | N/A | Hiển thị confirm dialog trước khi xóa; sau khi xác nhận, giáo án bị xóa khỏi danh sách |
| TC-036-13 | Validation - bỏ trống title | UI-Validation | High | Form tạo/sửa giáo án đang mở | 1. Để trống field "Tiêu đề bài học"<br>2. Click Lưu | title="" | Hiển thị lỗi "Vui lòng nhập tiêu đề bài học", không submit |
| TC-036-14 | Validation - unit_number không hợp lệ | UI-Validation | High | Form tạo/sửa giáo án đang mở | 1. Để trống hoặc nhập unit_number <= 0<br>2. Click Lưu | unit_number=0 hoặc rỗng | Hiển thị lỗi "Số unit không hợp lệ", không submit |
| TC-036-15 | Validation - bỏ trống objectives | UI-Validation | High | Form tạo/sửa giáo án đang mở | 1. Để trống field "Mục tiêu bài học"<br>2. Click Lưu | objectives="" | Hiển thị lỗi "Vui lòng nhập mục tiêu bài học", không submit |
| TC-036-16 | Validation - không chọn status | UI-Validation | High | Form tạo/sửa giáo án đang mở | 1. Không chọn field "Trạng thái"<br>2. Click Lưu | status=null | Hiển thị lỗi "Vui lòng chọn trạng thái", không submit |
| TC-036-17 | LessonPlanTable hiển thị đúng rating, tags, số tài liệu | UI-Validation | Medium | Giáo án có rating, tags, material_count | 1. Quan sát 1 row trong bảng | rating=4, tags:["Vocabulary","Speaking"], material_count=3 | Hiển thị đúng star rating (4 sao), các tags, và số tài liệu đính kèm (3) |
| TC-036-18 | ProgressSidebar hiển thị đúng donut chart | Functional | Medium | stats.completion_rate=66.7 | 1. Quan sát ProgressSidebar panel phải | completion_rate=66.7 | Donut chart và số liệu "Tiến độ: 66.7%" hiển thị đúng |
| TC-036-19 | API danh sách giáo án lỗi | Error-Handling | High | Giả lập lỗi server | 1. Giả lập GET /api/teacher/lesson-plans trả 500<br>2. Truy cập trang Giáo án | HTTP 500 | Hiển thị thông báo lỗi, trang không crash |
| TC-036-20 | Danh sách giáo án rỗng | Edge-Case | Medium | Lớp chưa có giáo án nào | 1. Truy cập trang Giáo án của lớp chưa có giáo án | data: [] | Hiển thị trạng thái rỗng (empty state) thay vì bảng trống |
| TC-036-21 | Không có lớp được phân công / chưa đăng nhập | Permission | High | Chưa đăng nhập hoặc GV không có lớp | 1. Xóa token hoặc dùng tài khoản không có lớp<br>2. Truy cập trang Giáo án | N/A | Không truy cập được màn hình, bị redirect hoặc hiển thị thông báo không có quyền |
