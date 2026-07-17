# Test Case: [064] Chi tiết phòng học

> Module: Teacher | Screen: Chi tiết phòng học | Route: `/room/{id}` | Task ID: 064
> Nguồn: `tasks/064_chi_tiet_phong_hoc_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Giáo viên đã đăng nhập, truy cập `/room/{id}` (BasicLayout). Dữ liệu lấy từ `GET /api/teacher/rooms/{id}`. Màn hình hiển thị buổi học đang diễn ra (nếu có) với đồng hồ đếm giờ, danh sách học viên hiện diện, tài liệu và thông tin phòng.

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-064-01 | Load phòng đang có lớp học diễn ra | Functional | High | Phòng id=1 status=in_use, có current_session | 1. Truy cập /room/1 | id=1 | Gọi GET /api/teacher/rooms/1; hiển thị tên lớp "Tiếng Anh A2 - Cô Tối", lịch (Thứ 2,4,6), badge "Đang diễn ra", SessionTimer chạy |
| TC-064-02 | Timer đếm tiến liên tục | Functional | High | Phòng đang có session đang diễn ra | 1. Quan sát SessionTimer trong 5-10 giây | start_time=2025-05-20T08:00:00Z | Đồng hồ HH:MM:SS tăng liên tục theo thời gian thực, không dừng/reset |
| TC-064-03 | Click "Dừng lại" để kết thúc buổi học sớm | Functional | High | Timer đang chạy | 1. Click nút Dừng lại<br>2. Xác nhận trong hộp thoại confirm | N/A | Hiển thị confirm dialog; sau xác nhận gọi POST /api/teacher/rooms/1/end-session, timer dừng, trạng thái buổi học cập nhật ended_at |
| TC-064-04 | Hủy xác nhận khi nhấn Dừng lại | Edge-Case | Medium | Đang hiện confirm dialog Dừng lại | 1. Click Dừng lại<br>2. Chọn Hủy trong dialog | N/A | Không gọi API end-session, timer tiếp tục chạy |
| TC-064-05 | Grid học viên hiển thị đúng trạng thái điểm danh | UI-Validation | High | Students có nhiều trạng thái attendance | 1. Quan sát StudentAvatarGrid | attendance=present/absent/late | Badge hiển thị đúng: ✓ Có mặt / ✗ Vắng / ⏱ Trễ tương ứng dữ liệu API |
| TC-064-06 | Click avatar học viên mở popup nhanh | Functional | High | Grid có ít nhất 1 học viên | 1. Click vào avatar 1 học viên | student id=1 | Hiển thị popup thông tin nhanh của học viên (tên, avatar, trạng thái điểm danh) |
| TC-064-07 | Tải tài liệu trong phòng học | Functional | Medium | materials có ít nhất 1 file | 1. Click nút Download tại 1 tài liệu | Giáo trình Unit 5.pdf | File được tải xuống thành công |
| TC-064-08 | Chia sẻ tài liệu với học viên | Functional | Medium | materials có ít nhất 1 file | 1. Click nút Chia sẻ với HV tại 1 tài liệu | N/A | Tài liệu được chia sẻ tới học viên trong lớp (thông báo thành công) |
| TC-064-09 | Phòng đang trống (không có session) | Edge-Case | High | Phòng status=empty, current_session=null | 1. Truy cập /room/{id} của phòng trống | status=empty | Ẩn SessionTimer và thông tin session, hiển thị trạng thái "Trống" |
| TC-064-10 | Click "Báo bảo trì" | Functional | Medium | Đang ở trang chi tiết phòng | 1. Click nút Báo bảo trì<br>2. Nhập ghi chú "Máy chiếu hỏng"<br>3. Xác nhận | note=Máy chiếu hỏng | Gọi PUT /api/teacher/rooms/{id} với status=maintenance; trạng thái phòng cập nhật thành Bảo trì |
| TC-064-11 | Click "Chỉnh sửa" thông tin phòng | Functional | Medium | Đang ở trang chi tiết phòng | 1. Click nút Chỉnh sửa | N/A | Mở form chỉnh sửa thông tin phòng (RoomHeader) |
| TC-064-12 | Click tên lớp học trong RoomInfoSidebar | Functional | Medium | current_session có class_id | 1. Click vào tên lớp trong panel Thông tin lớp học | class_id=10 | Điều hướng sang /classroom/10 |
| TC-064-13 | Thông tin sỹ số hiện tại/tối đa hiển thị đúng | UI-Validation | Medium | current_session có student_count, max_students | 1. Quan sát RoomInfoSidebar | student_count=18, max_students=25 | Hiển thị "Sỹ số: 18/25" đúng dữ liệu |
| TC-064-14 | Danh sách tài liệu rỗng | Edge-Case | Low | materials=[] | 1. Truy cập phòng không có tài liệu | materials=[] | Hiển thị Empty state khu vực Tài liệu, không lỗi |
| TC-064-15 | Lỗi tải dữ liệu chi tiết phòng (API lỗi 5xx/404) | Error-Handling | Medium | API GET /api/teacher/rooms/{id} trả lỗi | 1. Truy cập /room/{id} khi API lỗi | id=999 | Hiển thị thông báo lỗi hoặc trang 404, không crash |