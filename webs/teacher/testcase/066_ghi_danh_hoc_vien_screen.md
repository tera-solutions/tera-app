# Test Case: [066] Ghi danh học viên

> Module: Teacher | Screen: Ghi danh học viên | Route: `/enrollment/new` | Task ID: 066
> Nguồn: `tasks/066_ghi_danh_hoc_vien_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Giáo viên đã đăng nhập, truy cập `/enrollment/new` (BasicLayout). Quy trình 4 bước: (1) Chọn lớp, (2) Chọn gói học phí, (3) Nhập thông tin học viên, (4) Xác nhận & thanh toán. SummarySidebar hiển thị realtime tổng thanh toán và thống kê học viên lớp trong suốt quy trình.

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-066-01 | Load Bước 1 - danh sách lớp học | Functional | High | Đã đăng nhập, truy cập /enrollment/new | 1. Truy cập /enrollment/new | N/A | Gọi GET /api/teacher/classrooms?status=active; hiển thị danh sách lớp dạng radio với tên lớp, lịch học, phòng, sỹ số hiện tại/tối đa; StepIndicator ở Bước 1 |
| TC-066-02 | Bước 1: không chọn lớp mà nhấn Tiếp theo | UI-Validation | High | Đang ở Bước 1, chưa chọn lớp | 1. Không chọn radio lớp nào<br>2. Nhấn Tiếp theo | N/A | Hiển thị lỗi "Vui lòng chọn lớp học"; không chuyển sang Bước 2 |
| TC-066-03 | Bước 1: chọn lớp đã đầy (sỹ số = tối đa) | Functional | High | Có lớp với student_count = max_students | 1. Quan sát radio của lớp đã đầy | student_count=25, max_students=25 | Radio của lớp đã đầy bị disable/không cho chọn, hiển thị thông báo lớp đã đầy chỗ |
| TC-066-04 | Bước 1: chọn lớp hợp lệ và Tiếp theo | Functional | High | Đang ở Bước 1 | 1. Chọn radio "Starters 2A"<br>2. Nhấn Tiếp theo | class_id=10 | Chuyển sang Bước 2; SummarySidebar cập nhật "Lớp: Starters 2A", thống kê "Đã đăng ký: 12, Chỗ trống: 13" |
| TC-066-05 | Bước 1: tìm kiếm/lọc lớp | Functional | Medium | Đang ở Bước 1, danh sách lớp có nhiều dòng | 1. Nhập từ khóa vào ô tìm kiếm lớp | search=Starters | Danh sách lớp lọc realtime theo tên khớp từ khóa |
| TC-066-06 | Load Bước 2 - danh sách gói học phí | Functional | High | Đã hoàn thành Bước 1 | 1. Ở Bước 2, quan sát danh sách gói | class_id=10 | Gọi GET /api/teacher/tuition-packages?class_id=10; hiển thị 4 gói: Theo buổi 94.000đ, Theo tháng 2.400.000đ, Theo kỳ 3.000.000đ, Tùy chỉnh |
| TC-066-07 | Bước 2: không chọn gói mà nhấn Tiếp theo | UI-Validation | High | Đang ở Bước 2, chưa chọn gói | 1. Không chọn radio gói nào<br>2. Nhấn Tiếp theo | N/A | Hiển thị lỗi "Vui lòng chọn gói học phí"; không chuyển sang Bước 3 |
| TC-066-08 | Bước 2: chọn gói học phí cập nhật tổng tiền | Functional | High | Đang ở Bước 2 | 1. Chọn radio "Gói 2: Theo tháng 2.400.000đ" | package_id=2 | SummarySidebar cập nhật "Học phí: 2.400.000đ/tháng"; Tổng thanh toán tính lại realtime |
| TC-066-09 | Bước 2: chọn gói Tùy chỉnh (Gói 4) | Functional | Medium | Đang ở Bước 2 | 1. Chọn radio "Gói 4: Tùy chỉnh"<br>2. Nhập số buổi | package_id=4, số buổi=10 | Cho phép nhập số buổi tùy chỉnh; tổng tiền tính theo số buổi nhập vào |
| TC-066-10 | Load Bước 3 - form thêm học viên | Functional | High | Đã hoàn thành Bước 1, 2 | 1. Chuyển sang Bước 3 | N/A | Hiển thị form thêm học viên (name, dob, gender, email, phone, parent_name, parent_phone) và bảng danh sách học viên đã thêm (rỗng ban đầu) |
| TC-066-11 | Bước 3: thêm học viên thiếu tên | UI-Validation | High | Đang ở Bước 3 | 1. Để trống Họ tên học viên<br>2. Nhập dob hợp lệ<br>3. Nhấn nút Thêm | name=(rỗng) | Hiển thị lỗi "Vui lòng nhập tên học viên"; không thêm vào danh sách |
| TC-066-12 | Bước 3: thêm học viên thiếu/ sai ngày sinh | UI-Validation | High | Đang ở Bước 3 | 1. Nhập tên hợp lệ<br>2. Để trống hoặc nhập ngày sinh không hợp lệ<br>3. Nhấn Thêm | dob=(rỗng hoặc invalid) | Hiển thị lỗi "Ngày sinh không hợp lệ"; không thêm vào danh sách |
| TC-066-13 | Bước 3: thêm học viên hợp lệ vào danh sách | Functional | High | Đang ở Bước 3 | 1. Nhập đầy đủ name, dob hợp lệ<br>2. Nhấn Thêm | name=Nguyễn Minh An, dob=2015-03-10 | Học viên xuất hiện trong bảng danh sách kèm tên, ngày sinh, lớp (Starters 2A), email; SummarySidebar cập nhật "Số HV" và Tổng thanh toán |
| TC-066-14 | Bước 3: xóa học viên khỏi danh sách | Functional | Medium | Danh sách đã có ít nhất 1 học viên | 1. Nhấn nút Xóa ở dòng học viên vừa thêm | N/A | Học viên bị xóa khỏi bảng; Tổng thanh toán và Số HV trong SummarySidebar cập nhật giảm tương ứng |
| TC-066-15 | Bước 3: nhấn Tiếp theo khi danh sách học viên rỗng | UI-Validation | High | Đang ở Bước 3, chưa thêm học viên nào | 1. Không thêm học viên<br>2. Nhấn Tiếp theo | students=[] | Hiển thị lỗi "Vui lòng thêm ít nhất 1 học viên"; không chuyển sang Bước 4 |
| TC-066-16 | Load Bước 4 - xác nhận tóm tắt | Functional | High | Đã hoàn thành Bước 1, 2, 3 với ít nhất 1 học viên | 1. Chuyển sang Bước 4 | N/A | Hiển thị tóm tắt: tên lớp, gói học phí đã chọn, danh sách học viên, Tổng thanh toán 2,400,000đ |
| TC-066-17 | Bước 4: xác nhận ghi danh thành công | Functional | High | Đang ở Bước 4 với dữ liệu hợp lệ | 1. Nhấn nút "Xác nhận ghi danh" | class_id=10, package_id=2, students=[...] | Gọi POST /api/teacher/enrollments, trả 201 với enrollment_id, students_enrolled, total_amount; hiển thị toast thành công |
| TC-066-18 | Quay lại bước trước giữ nguyên dữ liệu | Functional | Medium | Đang ở Bước 2, 3 hoặc 4 | 1. Nhấn nút "Quay lại"<br>2. Kiểm tra dữ liệu bước trước | N/A | Quay về bước trước, lớp/gói/học viên đã chọn/nhập vẫn được giữ nguyên |
| TC-066-19 | Lỗi khi submit API Enroll Students (5xx) | Error-Handling | Medium | Đang ở Bước 4, API enrollments trả lỗi server | 1. Nhấn "Xác nhận ghi danh" khi API lỗi | N/A | Hiển thị toast/thông báo lỗi, không mất dữ liệu form, cho phép thử lại |
| TC-066-20 | SummarySidebar cập nhật realtime khi thêm nhiều học viên | Functional | Medium | Đang ở Bước 3, đã chọn gói Theo buổi 94.000đ | 1. Thêm 3 học viên liên tiếp<br>2. Quan sát Tổng thanh toán | 3 học viên x gói theo buổi | Tổng thanh toán trong sidebar cập nhật đúng theo công thức số HV x đơn giá gói (nếu áp dụng theo logic hệ thống) |