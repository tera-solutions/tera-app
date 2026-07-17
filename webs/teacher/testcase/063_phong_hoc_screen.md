# Test Case: [063] Phòng học

> Module: Teacher | Screen: Phòng học | Route: `/rooms` | Task ID: 063
> Nguồn: `tasks/063_phong_hoc_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Giáo viên đã đăng nhập, truy cập `/rooms` (BasicLayout). Dữ liệu lấy từ `GET /api/teacher/rooms`, hiển thị danh sách phòng học kèm bộ lọc loại phòng, trạng thái, tầng, sức chứa.

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-063-01 | Load trang danh sách phòng học | Functional | High | Đã đăng nhập | 1. Truy cập /rooms | N/A | Gọi GET /api/teacher/rooms; hiển thị 6 stat card (Tổng phòng=24, Đang dùng=18, Bảo trì=2, Trống=4, Học viên=480, Phòng trực tuyến=6) và bảng danh sách phòng |
| TC-063-02 | Lọc trạng thái "Trống" | Functional | High | Đang ở trang /rooms | 1. Chọn Dropdown Trạng thái = Trống<br>2. Nhấn Áp dụng lọc | status=empty | Gọi API với status=empty; bảng chỉ hiển thị phòng có status=empty |
| TC-063-03 | Lọc trạng thái "Bảo trì" | Functional | High | Đang ở trang /rooms | 1. Chọn Dropdown Trạng thái = Bảo trì<br>2. Nhấn Áp dụng lọc | status=maintenance | Gọi API với status=maintenance; bảng chỉ hiển thị phòng đang bảo trì |
| TC-063-04 | Lọc theo loại phòng | Functional | Medium | Đang ở trang /rooms | 1. Chọn Dropdown Loại phòng = Thực hành<br>2. Nhấn Áp dụng lọc | type=practice | Gọi API với type=practice; bảng chỉ hiển thị đúng loại phòng đã chọn |
| TC-063-05 | Lọc theo tầng | Functional | Medium | Đang ở trang /rooms | 1. Chọn Dropdown Tầng = 1<br>2. Nhấn Áp dụng lọc | floor=1 | Gọi API với floor=1; bảng chỉ hiển thị phòng thuộc tầng 1 |
| TC-063-06 | Lọc theo sức chứa | Functional | Medium | Đang ở trang /rooms | 1. Chọn Dropdown Sức chứa = 11-20<br>2. Nhấn Áp dụng lọc | capacity=11-20 | Gọi API với capacity tương ứng; bảng chỉ hiển thị phòng có sức chứa trong khoảng đã chọn |
| TC-063-07 | Kết hợp nhiều bộ lọc cùng lúc | Edge-Case | Medium | Đang ở trang /rooms | 1. Chọn đồng thời Loại phòng, Trạng thái, Tầng<br>2. Nhấn Áp dụng lọc | type=theory, status=in_use, floor=2 | Kết quả trả về thỏa mãn đồng thời cả 3 điều kiện lọc |
| TC-063-08 | Click tên phòng | Functional | High | Bảng có dữ liệu | 1. Click vào tên phòng "Phòng 01" | id=1 | Điều hướng sang /room/1 (Chi tiết phòng học) |
| TC-063-09 | Click "Xem chi tiết" | Functional | Medium | Bảng có dữ liệu | 1. Click nút Xem chi tiết ở cột Thao tác | id=1 | Điều hướng sang /room/1 |
| TC-063-10 | Click "Đặt phòng" | Functional | High | Bảng có dữ liệu, phòng đang Trống | 1. Click nút Đặt phòng ở cột Thao tác của phòng trạng thái Trống | id=2 | Mở form đặt phòng |
| TC-063-11 | Click "Báo bảo trì" | Functional | Medium | Bảng có dữ liệu | 1. Click nút Báo bảo trì ở cột Thao tác | id=1 | Mở form/xác nhận báo bảo trì cho phòng |
| TC-063-12 | Màu badge trạng thái hiển thị đúng | UI-Validation | Medium | Bảng có phòng ở cả 3 trạng thái | 1. Quan sát màu badge trạng thái của từng dòng | Đang dùng, Trống, Bảo trì | Đang dùng: badge xanh lá; Trống: badge xám; Bảo trì: badge đỏ/cam |
| TC-063-13 | Phân trang - chuyển trang tiếp theo | Functional | Medium | Danh sách có nhiều hơn 20 phòng | 1. Nhấn nút chuyển trang kế tiếp | page=2 | Gọi API với page=2, limit=20; bảng cập nhật danh sách trang 2 |
| TC-063-14 | Nhấn "+ Thêm phòng học" | Functional | Medium | Đang ở trang /rooms | 1. Nhấn nút "+ Thêm phòng học" | N/A | Mở form thêm phòng học mới |
| TC-063-15 | Danh sách rỗng sau khi lọc không khớp | Edge-Case | Medium | Bộ lọc không có kết quả | 1. Chọn tổ hợp lọc không có phòng nào khớp (VD tầng 99) | floor=99 | Hiển thị Empty state "Không có phòng học phù hợp", không lỗi |
| TC-063-16 | Cột "Lịch đặt / Ngày đặt gần nhất" hiển thị đúng | UI-Validation | Low | Phòng có latest_booking_date | 1. Quan sát cột Lịch đặt của 1 dòng | latest_booking_date=2025-05-20 | Hiển thị đúng ngày đặt phòng gần nhất |
| TC-063-17 | Lỗi tải dữ liệu (API lỗi 5xx) | Error-Handling | Medium | API GET /api/teacher/rooms trả lỗi server | 1. Truy cập /rooms khi API lỗi | N/A | Hiển thị thông báo lỗi tải dữ liệu, không crash trang |