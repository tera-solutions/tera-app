# Test Case: [067] Chuyển lớp

> Module: Teacher | Screen: Chuyển lớp | Route: `/transfer` | Task ID: 067
> Nguồn: `tasks/067_chuyen_lop_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Giáo viên/admin đã đăng nhập, truy cập `/transfer` (BasicLayout). Quy trình 3 bước: (1) Chọn lớp nguồn + chọn học viên, (2) Chọn lớp đích, (3) Xác nhận chuyển lớp. Panel phải luôn hiển thị lý do chuyển lớp và thống kê chuyển lớp.

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-067-01 | Load Bước 1 - danh sách học viên | Functional | High | Đã đăng nhập, truy cập /transfer | 1. Truy cập /transfer | N/A | Gọi GET /api/teacher/students; hiển thị bảng học viên (checkbox, tên, lớp hiện tại, ngày đăng ký, thời gian học); Gọi GET /api/teacher/transfer/stats hiển thị TransferStatPanel (Tổng chuyển: 12, Tháng này: 5) |
| TC-067-02 | Bước 1: chọn nhiều học viên (multi-select) | Functional | High | Bảng học viên đã có dữ liệu | 1. Tích checkbox học viên Minh<br>2. Tích thêm checkbox học viên Lan | student_ids=[1,2] | Cả 2 học viên được đánh dấu chọn (transferStore.setSelectedStudents([1,2])) |
| TC-067-03 | Bước 1: tìm kiếm học viên | Functional | Medium | Bảng học viên có nhiều dòng | 1. Nhập từ khóa vào ô "Tìm học viên" | search=Minh | Bảng lọc realtime chỉ hiện học viên khớp tên |
| TC-067-04 | Bước 1: lọc theo lớp nguồn | Functional | Medium | Bảng học viên có nhiều lớp | 1. Chọn Dropdown "Tất cả lớp" = Starters 2A | class_id=10 | Gọi API với class_id=10; bảng chỉ hiển thị học viên thuộc lớp Starters 2A |
| TC-067-05 | Bước 1: không chọn học viên nào mà nhấn Bước tới | UI-Validation | High | Đang ở Bước 1, chưa tích chọn học viên nào | 1. Không tích checkbox nào<br>2. Nhấn "Bước tới" | student_ids=[] | Hiển thị lỗi "Vui lòng chọn ít nhất 1 học viên"; không chuyển sang Bước 2 |
| TC-067-06 | Bước 1: chọn học viên hợp lệ và chuyển bước | Functional | High | Đang ở Bước 1 | 1. Tích chọn 1-2 học viên<br>2. Nhấn "Bước tới" | student_ids=[1] | Chuyển sang Bước 2, hiển thị bảng lớp đích |
| TC-067-07 | Load Bước 2 - danh sách lớp đích | Functional | High | Đã hoàn thành Bước 1 với lớp nguồn id=10 | 1. Ở Bước 2, quan sát bảng lớp đích | current_class_id=10 | Gọi GET /api/teacher/classrooms?status=active&exclude_class_id=10; danh sách không chứa lớp nguồn, hiển thị tên lớp, lịch học, phòng, sỹ số, trạng thái |
| TC-067-08 | Bước 2: chọn lớp đích đã đầy (Đầy) | Permission | High | Có lớp đích với available=false hoặc sỹ số đầy | 1. Quan sát radio của lớp đích đã đầy | student_count=25, max_students=25, available=false | Radio bị disable, không cho chọn; badge trạng thái hiển thị "Đầy" |
| TC-067-09 | Bước 2: chọn lớp đích trùng với lớp nguồn | UI-Validation | High | Trường hợp giả lập lớp đích trùng lớp nguồn (bypass exclude) | 1. Chọn lớp đích có id trùng from_class_id | to_class_id=from_class_id=10 | Hiển thị lỗi "Lớp mới phải khác lớp hiện tại"; không cho tiếp tục |
| TC-067-10 | Bước 2: không chọn lớp đích mà nhấn Bước tới | UI-Validation | High | Đang ở Bước 2, chưa chọn lớp đích | 1. Không chọn radio lớp nào<br>2. Nhấn "Bước tới" | target_class=null | Hiển thị lỗi "Vui lòng chọn lớp mới"; không chuyển sang Bước 3 |
| TC-067-11 | Bước 2: chọn lớp đích hợp lệ | Functional | High | Đang ở Bước 2 | 1. Chọn radio "Starters 3C" (còn chỗ)<br>2. Nhấn "Bước tới" | to_class_id=15 | Chuyển sang Bước 3, TransferReasonPanel hiển thị để nhập lý do |
| TC-067-12 | Nhập lý do chuyển lớp - để trống | UI-Validation | High | Đang ở TransferReasonPanel, chưa nhập lý do | 1. Để trống Textarea lý do<br>2. Nhấn "Xác nhận chuyển lớp" | reason=(rỗng) | Hiển thị lỗi "Vui lòng nhập lý do chuyển lớp"; không submit |
| TC-067-13 | Chọn lý do có sẵn từ Dropdown | Functional | Medium | Đang ở TransferReasonPanel | 1. Mở Dropdown lý do có sẵn<br>2. Chọn "Thay đổi lịch" | reason=Thay đổi lịch học | Textarea lý do tự động điền "Thay đổi lịch học" hoặc dropdown chọn lưu vào state |
| TC-067-14 | Load Bước 3 - tóm tắt xác nhận | Functional | High | Đã hoàn thành Bước 1, 2 và nhập lý do | 1. Ở Bước 3, quan sát tóm tắt | student_ids=[1], from=Starters 2A, to=Starters 3C | Hiển thị đúng danh sách học viên được chuyển, lớp nguồn → lớp đích, lý do, ngày có hiệu lực |
| TC-067-15 | Xác nhận chuyển lớp thành công | Functional | High | Đang ở Bước 3 với dữ liệu hợp lệ | 1. Nhấn "Xác nhận chuyển lớp" | student_ids=[1,2], from_class_id=10, to_class_id=15, reason=Thay đổi lịch học, effective_date=2025-06-01 | Gọi POST /api/teacher/transfer, trả 201 với transferred_count, to_class, effective_date; hiển thị toast thành công |
| TC-067-16 | Quay lại bước trước giữ nguyên lựa chọn | Functional | Medium | Đang ở Bước 2 hoặc 3 | 1. Nhấn nút quay lại (breadcrumb/step click)<br>2. Kiểm tra selection | N/A | Học viên đã chọn và lớp đích đã chọn vẫn được giữ nguyên khi quay lại |
| TC-067-17 | Lọc theo lớp áp dụng đúng trong bảng học viên | Functional | Medium | Đang ở Bước 1 | 1. Chọn lọc lớp "Movers 1B" | class_id=11 | Bảng chỉ hiển thị học viên thuộc lớp Movers 1B |
| TC-067-18 | Thống kê chuyển lớp hiển thị đúng số liệu | UI-Validation | Medium | API transfer/stats trả dữ liệu | 1. Quan sát TransferStatPanel | total_transfers=12, this_month=5, by_class=[{Starters 3C:3}] | Hiển thị đúng "Tổng chuyển: 12", "Tháng này: 5", top 3 lớp đích theo by_class |
| TC-067-19 | Lỗi khi submit API Transfer (5xx) | Error-Handling | Medium | Đang ở Bước 3, API transfer trả lỗi server | 1. Nhấn "Xác nhận chuyển lớp" khi API lỗi | N/A | Hiển thị thông báo lỗi, không mất dữ liệu đã chọn, cho phép thử lại |
| TC-067-20 | Danh sách học viên rỗng sau khi lọc | Edge-Case | Low | Lọc lớp không có học viên nào | 1. Chọn lớp nguồn không có học viên | class_id=999 | Hiển thị Empty state "Không có học viên", không lỗi |