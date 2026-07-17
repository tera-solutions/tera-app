# Test Case: [034] Lớp học

> Module: Teacher | Screen: Lớp học | Route: `/classroom` | Task ID: 034
> Nguồn: `tasks/034_lop_hoc_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Đã đăng nhập với tài khoản role Teacher. Tài khoản có ít nhất 1 lớp học được phân công để test đầy đủ (một số case yêu cầu 0 lớp để test empty state).

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-034-01 | Load trang danh sách lớp học | Functional | High | Có ≥1 lớp được phân công | 1. Truy cập `/classroom` | — | Gọi `GET /api/teacher/classrooms`, hiển thị danh sách lớp + 4 thẻ thống kê (Lớp chủ nhiệm/Học viên tổng/Lớp đang hoạt động/Tỷ lệ hoàn thành) đúng theo `summary` trả về |
| TC-034-02 | Tìm kiếm theo tên lớp | Functional | High | Có nhiều lớp với tên khác nhau | 1. Nhập từ khóa vào ô "Tìm tên lớp, học viên..."<br>2. Quan sát danh sách | search="Starters" | Gọi API kèm `search=Starters`, danh sách lọc realtime chỉ còn lớp khớp |
| TC-034-03 | Lọc theo trường (school) | Functional | Medium | Có nhiều trường/chi nhánh | 1. Chọn 1 giá trị trong dropdown "Tất cả trường" | school_id=X | Danh sách chỉ hiển thị lớp thuộc trường đã chọn |
| TC-034-04 | Lọc theo lớp | Functional | Medium | Có dropdown "Tất cả lớp" với danh sách lớp | 1. Chọn 1 lớp cụ thể trong dropdown "Tất cả lớp" | class_id=X | Danh sách được lọc đúng theo `class_id` |
| TC-034-05 | Click card lớp để xem chi tiết | Functional | High | Có ≥1 lớp | 1. Click vào 1 ClassroomCard (không trúng action button) | — | Điều hướng sang `/classroom/{id}` |
| TC-034-06 | Click action "Xem chi tiết" | Functional | High | Có ≥1 lớp | 1. Click nút "Xem chi tiết" trên card | — | Navigate `/classroom/{id}` |
| TC-034-07 | Click action "Điểm danh" | Functional | High | Có ≥1 lớp | 1. Click nút "Điểm danh" trên card | — | Navigate `/attendance` kèm `class_id` tương ứng |
| TC-034-08 | Click action "Giáo án" | Functional | Medium | Có ≥1 lớp | 1. Click nút "Giáo án" trên card | — | Điều hướng sang màn Giáo án liên quan tới lớp đó |
| TC-034-09 | Click action "Bài tập" | Functional | Medium | Có ≥1 lớp | 1. Click nút "Bài tập" trên card | — | Điều hướng sang màn Bài tập liên quan tới lớp đó |
| TC-034-10 | Toggle sang chế độ xem Grid | UI-Validation | Medium | — | 1. Click icon Grid (⊞) trong toolbar | viewMode=grid | `classroomStore.setViewMode('grid')`, danh sách hiển thị dạng lưới 2-3 cột (ảnh, tên, % tiến độ) |
| TC-034-11 | Toggle lại chế độ xem List | UI-Validation | Low | Đang ở Grid view | 1. Click icon List (≡) | viewMode=list | Danh sách trở lại dạng list card đầy đủ thông tin |
| TC-034-12 | Không có lớp nào được phân công | Edge-Case | Medium | Tài khoản Teacher chưa được phân công lớp nào | 1. Truy cập `/classroom` với tài khoản không có lớp | — | Hiển thị EmptyState: icon + "Bạn chưa được phân công lớp nào" |
| TC-034-13 | Phân trang / load thêm | Functional | Medium | Số lớp > `limit` mặc định (20) | 1. Cuộn xuống cuối danh sách hoặc bấm nút phân trang | page=2 | Gọi API với `page=2`, load thêm dữ liệu tương ứng |
| TC-034-14 | Kiểm tra donut chart % tiến độ trên card | UI-Validation | Low | Lớp có `completion_rate` | 1. Quan sát card của 1 lớp cụ thể | completion_rate=95 | Donut chart hiển thị đúng giá trị % (VD 95%) |
| TC-034-15 | Kiểm tra thông tin hiển thị trên card đầy đủ | UI-Validation | Medium | Có ≥1 lớp | 1. Quan sát 1 card: ảnh, tên lớp, badge cấp độ, phòng học, ca học, số học viên | — | Đầy đủ đúng field: name, level (badge), room, schedule_days + start_time-end_time, student_count/max_students |
| TC-034-16 | Thẻ thống kê "Lớp chủ nhiệm" khớp dữ liệu | Functional | Medium | — | 1. Đối chiếu số trên thẻ với `summary.total_classes_managed` trả về từ API | — | Giá trị hiển thị đúng bằng `summary.total_classes_managed` |
| TC-034-17 | Thẻ thống kê "Học viên tổng" khớp dữ liệu | Functional | Medium | — | 1. Đối chiếu số trên thẻ với `summary.total_students` | — | Khớp đúng `summary.total_students` |
| TC-034-18 | Thẻ thống kê "Lớp đang hoạt động" khớp dữ liệu | Functional | Medium | — | 1. Đối chiếu với `summary.active_classes` | — | Khớp đúng `summary.active_classes` |
| TC-034-19 | Thẻ thống kê "Tỷ lệ hoàn thành" khớp dữ liệu | Functional | Medium | — | 1. Đối chiếu với `summary.avg_completion_rate` | — | Khớp đúng `summary.avg_completion_rate`, hiển thị dạng % |
| TC-034-20 | Lỗi API khi tải danh sách lớp | Error-Handling | Medium | Giả lập lỗi server/network khi gọi `GET /api/teacher/classrooms` | 1. Truy cập `/classroom` trong lúc API lỗi | — | Hiển thị trạng thái lỗi hợp lý (toast/error state), không crash trang |
| TC-034-21 | Kết hợp search + filter trường + filter lớp cùng lúc | Edge-Case | Low | Có đủ dữ liệu đa dạng | 1. Nhập search<br>2. Chọn filter trường<br>3. Chọn filter lớp | search + school_id + class_id | Tất cả điều kiện lọc được áp dụng đồng thời (AND), danh sách kết quả đúng |
