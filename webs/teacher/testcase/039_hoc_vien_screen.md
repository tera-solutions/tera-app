# Test Case: [039] Học viên

> Module: Teacher | Screen: Học viên | Route: `/students` | Task ID: 039
> Nguồn: `tasks/039_hoc_vien_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Người dùng đã đăng nhập với tài khoản giáo viên đang phụ trách ít nhất một lớp có học viên. API `GET /api/teacher/students` hoạt động bình thường trừ khi ghi chú khác.

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-039-01 | Load trang danh sách học viên mặc định | Functional | High | GV có 72 HV thuộc các lớp phụ trách | 1. Truy cập `/students`<br>2. Quan sát bảng và stats | — | Gọi `GET /api/teacher/students?page=1&limit=20`; hiển thị 20 HV đầu tiên, 4 statistic card Tổng=72, Đang học=68, Đã nghỉ=3, Mới=3 khớp `summary` |
| TC-039-02 | Tìm kiếm học viên theo tên | Functional | High | Danh sách đã load | 1. Nhập "Nguyễn" vào ô tìm kiếm<br>2. Quan sát kết quả | search=Nguyễn | Gọi API kèm `search=Nguyễn`, danh sách filter realtime chỉ hiện HV có tên khớp, trang hiện tại reset về page=1 |
| TC-039-03 | Lọc theo lớp học | Functional | Medium | Có nhiều lớp trong dropdown | 1. Chọn lớp "Starters 2A" ở filter Lớp học<br>2. Click "Lọc lại" | class_id=10 | Chỉ hiển thị HV thuộc class_id=10, URL cập nhật `?class_id=10` |
| TC-039-04 | Lọc theo cấp độ (multi-checkbox) | Functional | Medium | Filter Cấp độ có Starters/Movers/Flyers/KET/PET | 1. Tick "Starters" và "Movers"<br>2. Click "Lọc lại" | level=starters,movers | Gọi API với `level=starters,movers`, chỉ hiển thị HV thuộc 2 cấp độ đã chọn |
| TC-039-05 | Lọc theo trạng thái học viên | Functional | Medium | Dropdown trạng thái có Tất cả/Đang học/Bảo lưu/Đã nghỉ | 1. Chọn "Đang học"<br>2. Click "Lọc lại" | status=active | Chỉ hiển thị HV có status=active, statistic "Đang học" vẫn phản ánh tổng toàn lớp (không đổi theo filter) |
| TC-039-06 | Lọc theo khoảng ngày nhập học | Functional | Medium | Filter có date range Từ - Đến | 1. Chọn Từ 01/01/2025, Đến 31/05/2025<br>2. Click "Lọc lại" | date_from=2025-01-01, date_to=2025-05-31 | Chỉ hiển thị HV có enrolled_at nằm trong khoảng đã chọn |
| TC-039-07 | Kết hợp nhiều bộ lọc cùng lúc | Functional | Medium | — | 1. Chọn lớp + cấp độ + trạng thái cùng lúc<br>2. Click "Lọc lại" | class_id=10, level=starters, status=active | Request chứa đầy đủ các query param đã chọn, kết quả thỏa mãn đồng thời tất cả điều kiện (AND) |
| TC-039-08 | Xóa bộ lọc | Functional | Medium | Đang áp dụng ít nhất 1 filter | 1. Click "Xóa bộ lọc" | — | Toàn bộ filter reset về mặc định, danh sách hiển thị lại đầy đủ 72 HV, URL query string được xóa |
| TC-039-09 | Click tên học viên điều hướng sang chi tiết | Functional | High | — | 1. Click vào tên một HV trong bảng, ví dụ "Nguyễn Thị Phương" (id=1) | student_id=1 | Điều hướng tới `/students/1` (màn hình [040] Chi tiết học viên) |
| TC-039-10 | Click "Nhận xét" mở form nhận xét học viên | Functional | Medium | — | 1. Click nút "Nhận xét" ở cột Thao tác của một HV | student_id=1 | Mở form/modal nhận xét cho HV được chọn |
| TC-039-11 | Click "Nhắn tin" mở cửa sổ tin nhắn | Functional | Medium | — | 1. Click nút "Nhắn tin" ở cột Thao tác của một HV | student_id=1 | Mở cửa sổ/panel nhắn tin với HV hoặc phụ huynh tương ứng |
| TC-039-12 | Phân trang - chuyển trang tiếp theo | Functional | Medium | Có 72 HV, 4 trang với limit=20 | 1. Click nút trang 2 hoặc "Next" | page=2 | Gọi API với `page=2`, bảng hiển thị HV thứ 21-40, phân trang hiển thị "Hiển thị 21-40/72 học viên" |
| TC-039-13 | Đổi số lượng item mỗi trang | Functional | Medium | — | 1. Chọn dropdown số item/trang = 50 | limit=50 | Gọi API với `limit=50`, bảng hiển thị tối đa 50 HV/trang, phân trang cập nhật lại số trang |
| TC-039-14 | Sắp xếp theo cột | Functional | Medium | — | 1. Click header cột "Điểm TB" để sắp xếp<br>2. Click lại để đảo chiều | sort_by=avg_score, sort_dir=asc/desc | Gọi API với `sort_by=avg_score&sort_dir=asc`, danh sách sắp xếp tăng dần; click lần 2 chuyển `sort_dir=desc` |
| TC-039-15 | Không có học viên thỏa điều kiện lọc | Edge-Case | Medium | Bộ lọc dẫn tới kết quả rỗng | 1. Lọc theo tổ hợp không tồn tại HV nào, ví dụ level=pet + status=dropped | level=pet, status=dropped | Bảng hiển thị EmptyState với thông báo phù hợp, không lỗi trang trắng |
| TC-039-16 | Đồng bộ bộ lọc với URL query string | Functional | Medium | — | 1. Áp dụng filter class_id=10, level=starters, status=active, page=1<br>2. Kiểm tra URL trình duyệt | — | URL hiển thị `/students?class_id=10&level=starters&status=active&page=1`; reload trang với URL này khôi phục đúng bộ lọc |
| TC-039-17 | Click "Thêm học viên" (có quyền) | Permission | Medium | Tài khoản GV có quyền thêm HV | 1. Click nút "Thêm học viên" ở góc trên phải | — | Mở form/màn hình thêm học viên mới |
| TC-039-18 | Ẩn nút "Thêm học viên" khi không có quyền | Permission | Medium | Tài khoản GV không có quyền thêm HV | 1. Truy cập `/students` với tài khoản không có quyền | — | Nút "Thêm học viên" không hiển thị trên toolbar |
| TC-039-19 | Statistic card hiển thị đúng số liệu tổng quan | UI-Validation | Low | summary trả về total=72, active=68, dropped=3, new_this_month=3 | 1. Load trang, đối chiếu 4 statistic card | — | Các card Tổng học viên/Đang học/Đã nghỉ/Mới hiển thị đúng giá trị 72/68/3/3 |
| TC-039-20 | Lỗi khi tải danh sách học viên | Error-Handling | Medium | API `GET /api/teacher/students` trả lỗi 500 | 1. Truy cập `/students` khi API lỗi | — | Hiển thị thông báo lỗi tải dữ liệu, không crash trang, có phương án thử lại |
