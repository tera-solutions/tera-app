# Test Case: [061] Phụ huynh

> Module: Teacher | Screen: Phụ huynh | Route: `/parents` | Task ID: 061
> Nguồn: `tasks/061_phu_huynh_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Giáo viên đã đăng nhập, truy cập `/parents` (BasicLayout). Màn hình hiển thị danh sách phụ huynh của học viên trong các lớp giáo viên phụ trách, dữ liệu lấy từ `GET /api/teacher/parents`.

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-061-01 | Load trang danh sách phụ huynh | Functional | High | Đã đăng nhập, có dữ liệu phụ huynh | 1. Truy cập /parents | N/A | Gọi GET /api/teacher/parents; hiển thị 5 stat card (Tổng PH=128, Đã tiếp nối=86, Tin nhắn mới=24, Đánh giá=4.8/5, Hoàn thành=98%) và bảng danh sách phụ huynh |
| TC-061-02 | Tìm kiếm theo tên/email/SĐT | Functional | High | Đang ở trang /parents | 1. Nhập từ khóa vào ô Tìm kiếm "Trần Thị An"<br>2. Quan sát kết quả | search=Trần Thị An | Gọi API với query param search=Trần Thị An; bảng chỉ hiển thị phụ huynh khớp tên/email/SĐT |
| TC-061-03 | Lọc theo lớp | Functional | Medium | Đang ở trang /parents | 1. Chọn 1 lớp trong Dropdown "Lọc lớp" | class_id=<id lớp Starters 2A> | Gọi API với query param class_id tương ứng; bảng chỉ hiển thị phụ huynh có con học lớp đó |
| TC-061-04 | Lọc theo trạng thái tiếp cận | Functional | Medium | Đang ở trang /parents | 1. Chọn Dropdown "Lọc trạng thái" = Đã tiếp nối | status=contacted | Gọi API với query param status=contacted; chỉ hiển thị phụ huynh có contact_status=contacted |
| TC-061-05 | Kết hợp tìm kiếm + lọc lớp + lọc trạng thái | Edge-Case | Medium | Đang ở trang /parents | 1. Nhập từ khóa tìm kiếm<br>2. Chọn lớp<br>3. Chọn trạng thái đồng thời | search + class_id + status | Kết quả trả về thỏa mãn đồng thời cả 3 điều kiện lọc |
| TC-061-06 | Click tên phụ huynh | Functional | High | Bảng đã có dữ liệu | 1. Click vào tên 1 phụ huynh trong bảng | id=1 | Điều hướng sang /parent/{id} (Chi tiết phụ huynh) |
| TC-061-07 | Click nút "Nhắn tin" | Functional | High | Bảng đã có dữ liệu | 1. Click icon/nút Nhắn tin ở cột Hành động của 1 dòng | id=1 | Điều hướng sang màn hình Tin nhắn với phụ huynh tương ứng đã được chọn sẵn |
| TC-061-08 | Click nút "Gọi" | Functional | Medium | Bảng đã có dữ liệu, có SĐT | 1. Click nút Gọi ở cột Hành động | phone=0901234567 | Kích hoạt hành động gọi điện (mở app gọi/hiển thị SĐT) tới đúng số của phụ huynh |
| TC-061-09 | Click nút "Xem" | Functional | Medium | Bảng đã có dữ liệu | 1. Click nút Xem ở cột Hành động | id=1 | Điều hướng sang /parent/{id} tương tự click tên |
| TC-061-10 | Xuất Excel | Functional | Medium | Đang ở trang /parents có dữ liệu | 1. Nhấn nút "Xuất Excel" | N/A | Trình duyệt tải xuống file Excel chứa danh sách phụ huynh hiện tại |
| TC-061-11 | Click "+ Thêm phụ huynh" | Functional | Medium | Đang ở trang /parents | 1. Nhấn nút "+ Thêm phụ huynh" | N/A | Mở form/màn hình thêm phụ huynh mới |
| TC-061-12 | Badge tin nhắn mới hiển thị đúng số | UI-Validation | Medium | Có phụ huynh với tin nhắn chưa đọc | 1. Quan sát card "Tin nhắn mới" và badge trên từng dòng nếu có | new_messages=24 | Card hiển thị đúng giá trị summary.new_messages trả về từ API |
| TC-061-13 | Phân trang - chuyển sang trang tiếp theo | Functional | Medium | Danh sách có nhiều hơn 20 phụ huynh (limit=20) | 1. Nhấn nút chuyển trang kế tiếp | page=2 | Gọi API với page=2, limit=20; bảng cập nhật danh sách trang 2, meta.current_page=2 |
| TC-061-14 | Danh sách rỗng - Empty state | Edge-Case | Medium | Bộ lọc không khớp phụ huynh nào (VD search từ khóa không tồn tại) | 1. Nhập search="zzxxyy123"<br>2. Quan sát bảng | search=zzxxyy123 | Hiển thị trạng thái rỗng (Empty state) "Không tìm thấy phụ huynh phù hợp", không lỗi crash |
| TC-061-15 | Avatar và vai trò liên hệ hiển thị đúng | UI-Validation | Low | Bảng có dữ liệu | 1. Quan sát cột Họ tên và Liên hệ của từng dòng | relation=Mẹ | Cột Họ tên hiển thị avatar + tên; cột Liên hệ hiển thị đúng vai trò (Bố/Mẹ/Người thân) |
| TC-061-16 | Lỗi tải dữ liệu (API lỗi 5xx) | Error-Handling | Medium | API GET /api/teacher/parents trả lỗi server | 1. Truy cập /parents khi API lỗi | N/A | Hiển thị thông báo lỗi tải dữ liệu, không crash trang, có tùy chọn thử lại |