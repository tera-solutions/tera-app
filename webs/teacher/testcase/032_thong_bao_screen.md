# Test Case: [032] Thông báo

> Module: Teacher | Screen: Thông báo | Route: `/notifications` | Task ID: 032
> Nguồn: `tasks/032_thong_bao_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Đã đăng nhập với tài khoản role Teacher, có ít nhất 1 thông báo trong hệ thống (tổng 77 thông báo theo dữ liệu mẫu). Truy cập màn hình `/notifications` (BasicLayout).

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-032-01 | Load trang thông báo thành công | Functional | High | Đã đăng nhập | 1. Truy cập `/notifications`<br>2. Quan sát panel giữa và badge | GET /api/teacher/notifications?page=1&limit=20&category=all&status=all trả 200, total=77, unread_count=12 | Hiển thị danh sách thông báo (tối đa 20 item/trang) và badge đếm số chưa đọc = 12 |
| TC-032-02 | Lọc trạng thái "Chưa đọc" | Functional | High | Đang ở trang notifications | 1. Chọn radio "Chưa đọc" trong panel Trạng thái<br>2. Quan sát danh sách | status=unread | Chỉ hiển thị các thông báo có is_read=false |
| TC-032-03 | Lọc trạng thái "Đã đọc" | Functional | Medium | Đang ở trang notifications | 1. Chọn radio "Đã đọc"<br>2. Quan sát danh sách | status=read | Chỉ hiển thị các thông báo có is_read=true |
| TC-032-04 | Click vào 1 thông báo để xem chi tiết | Functional | High | Danh sách có ít nhất 1 thông báo chưa đọc | 1. Click vào 1 item trong NotificationTable<br>2. Quan sát panel phải | GET /api/teacher/notifications/{id}, POST /api/teacher/notifications/{id}/read | Mở NotificationDetail hiển thị tiêu đề, ngày giờ đầy đủ, nội dung HTML, tự động gọi API mark as read, dot chưa đọc biến mất |
| TC-032-05 | Nhấn "Đánh dấu tất cả đã đọc" | Functional | High | Có ít nhất 1 thông báo chưa đọc | 1. Click button "Đánh dấu tất cả đã đọc" ở header | POST /api/teacher/notifications/read-all trả {success:true, updated_count:12} | UI cập nhật ngay (optimistic update): tất cả dot chưa đọc biến mất, badge count về 0 |
| TC-032-06 | Lọc theo danh mục (category) | Functional | Medium | Có nhiều category (meeting, lịch học, bài tập, hệ thống...) | 1. Chọn 1 category trong panel Danh mục, ví dụ "meeting"<br>2. Quan sát danh sách | category=meeting | Chỉ hiển thị thông báo đúng category đã chọn |
| TC-032-07 | Lọc theo khoảng thời gian | Functional | Medium | Có thông báo trải nhiều ngày | 1. Chọn khoảng ngày trong date range picker | date_from=2025-05-01, date_to=2025-05-31 | Chỉ hiển thị thông báo có created_at nằm trong khoảng ngày đã chọn |
| TC-032-08 | Phân trang danh sách thông báo | Functional | Medium | Tổng số thông báo > 20 (total=77, last_page=4) | 1. Cuộn hoặc click sang trang 2 | page=2 | Load và hiển thị 20 thông báo tiếp theo |
| TC-032-09 | Thông báo có nút hành động | Functional | Medium | Thông báo có action_url và action_label | 1. Mở detail 1 thông báo có action_url="/schedule", action_label="Tới đây"<br>2. Click nút hành động | action_url="/schedule" | Nút hành động "Tới đây" hiển thị trong detail, click điều hướng đến /schedule |
| TC-032-10 | Không có thông báo nào | Edge-Case | Medium | Danh sách rỗng sau khi lọc | 1. Áp dụng filter không khớp thông báo nào | data: [] | Hiển thị thông báo "Không có thông báo" |
| TC-032-11 | Đổi filter reset về trang 1 | Functional | Medium | Đang ở trang > 1 | 1. Chuyển sang trang 2<br>2. Đổi filter category hoặc status | N/A | Page tự động reset về 1 và re-fetch danh sách |
| TC-032-12 | URL đồng bộ với filter | UI-Validation | Low | Đang ở trang notifications | 1. Chọn category=meeting và status=unread | N/A | URL cập nhật thành `/notifications?category=meeting&status=unread` |
| TC-032-13 | Filter được giữ khi chuyển tab trong session | Functional | Low | Đã áp dụng filter trước đó | 1. Áp dụng filter category=meeting<br>2. Chuyển sang tab/màn hình khác rồi quay lại `/notifications` trong cùng session | N/A | Filter category=meeting vẫn được giữ nguyên |
| TC-032-14 | Trạng thái hiển thị dot/bold khi chưa đọc | UI-Validation | Low | Có thông báo chưa đọc | 1. Quan sát item chưa đọc trong danh sách | is_read=false | Item hiển thị dot xanh và tiêu đề in đậm (bold) |
| TC-032-15 | NotificationDetail hiển thị ảnh đính kèm | UI-Validation | Low | Thông báo có image_url | 1. Click mở thông báo có image_url | image_url="https://..." | Ảnh đính kèm hiển thị trong panel detail |
| TC-032-16 | API lấy danh sách thông báo lỗi | Error-Handling | High | Giả lập lỗi server | 1. Giả lập GET /api/teacher/notifications trả 500<br>2. Truy cập `/notifications` | HTTP 500 | Hiển thị thông báo lỗi, trang không bị crash |
| TC-032-17 | API mark-all-read thất bại | Error-Handling | Medium | Giả lập lỗi server | 1. Click "Đánh dấu tất cả đã đọc"<br>2. Giả lập POST read-all trả 500 | HTTP 500 | Optimistic update được rollback, hiển thị thông báo lỗi cho người dùng |
| TC-032-18 | Hover vào 1 item trong danh sách | UI-Validation | Low | Danh sách có dữ liệu | 1. Di chuột qua 1 item trong NotificationTable | N/A | Row được highlight |
| TC-032-19 | Truy cập /notifications khi chưa đăng nhập | Permission | High | Chưa đăng nhập / token hết hạn | 1. Xóa token đăng nhập<br>2. Truy cập `/notifications` | N/A | Bị chuyển hướng về trang đăng nhập |
| TC-032-20 | Badge "Tất cả thông báo" hiển thị đúng tổng số | Functional | Low | total=77 theo dữ liệu API | 1. Truy cập `/notifications`<br>2. Quan sát mục "Tất cả thông báo" trong panel Danh mục | total=77 | Badge hiển thị đúng số 77 |
