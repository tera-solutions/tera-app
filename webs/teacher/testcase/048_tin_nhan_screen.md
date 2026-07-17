# Test Case: [048] Tin nhắn

> Module: Teacher | Screen: Tin nhắn | Route: `/messages` | Task ID: 048
> Nguồn: `tasks/048_tin_nhan_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Người dùng đã đăng nhập với tài khoản giáo viên. API base: `https://api.anhnguhana.com/api`. Các test case dưới đây bám theo đặc tả (spec mong muốn) trong tài liệu, bao gồm cả phần Real-time (WebSocket/Polling).

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-048-01 | Load trang Tin nhắn hiển thị danh sách hội thoại | Functional | High | Đã đăng nhập, có ít nhất 1 hội thoại | 1. Truy cập `/messages`<br>2. Chờ trang tải xong | GET `/api/teacher/messages/conversations?tab=all` trả 200 | InboxSidebar hiển thị danh sách hội thoại gồm avatar, tên, preview tin nhắn cuối, thời gian, badge unread nếu có |
| TC-048-02 | Click chọn một hội thoại tải nội dung chat | Functional | High | Đang ở danh sách hội thoại | 1. Click vào hội thoại "Phụ huynh Minh Anh" | GET `/api/teacher/messages/conversations/1` trả 200 | ChatWindow hiển thị đúng lịch sử tin nhắn của hội thoại, ContactInfoPanel hiển thị thông tin liên hệ tương ứng |
| TC-048-03 | Gửi tin nhắn văn bản thành công | Functional | High | Đang mở một hội thoại | 1. Nhập nội dung vào MessageInput<br>2. Click nút gửi (➤) | POST `/api/teacher/messages/conversations/1/send` content="Chào anh/chị" trả 201 | Tin nhắn hiển thị ngay trong ChatWindow (bubble căn phải, màu xanh), messageStore.appendMessage được gọi, tự động scroll xuống cuối |
| TC-048-04 | Chuyển tab "Chưa đọc" chỉ hiện hội thoại có tin chưa đọc | Functional | High | Có hội thoại với unread_count > 0 và = 0 | 1. Click tab "Chưa đọc" | GET `/conversations?tab=unread` | Chỉ hiển thị các hội thoại có unread_count > 0 |
| TC-048-05 | Chuyển tab "Đang trả lời" | Functional | Medium | — | 1. Click tab "Đang trả lời" | GET `/conversations?tab=pending` | Danh sách hội thoại cập nhật theo tab pending, tab được active đúng |
| TC-048-06 | Tìm kiếm hội thoại theo tên/nội dung | Functional | Medium | Có nhiều hội thoại | 1. Nhập từ khóa vào ô tìm kiếm "🔍 Tìm..." | GET `/conversations?search=Minh Anh` | Danh sách hội thoại lọc theo tên người liên hệ hoặc nội dung khớp từ khóa |
| TC-048-07 | Tìm kiếm hội thoại không có kết quả | Edge-Case | Medium | Có nhiều hội thoại | 1. Nhập từ khóa không tồn tại | GET `/conversations?search=zzz123` | Hiển thị empty state "Không tìm thấy hội thoại phù hợp" |
| TC-048-08 | Đính kèm file và gửi thành công | Functional | High | Đang mở một hội thoại | 1. Click nút đính kèm (📎)<br>2. Chọn file BaiTap.pdf<br>3. Click gửi | POST `/conversations/1/send` multipart content + attachments[]=BaiTap.pdf trả 201 | File được upload và gửi thành công, hiển thị trong bubble tin nhắn kèm biểu tượng file |
| TC-048-09 | Badge số tin chưa đọc cập nhật khi nhận tin mới | Functional | High | Đang ở danh sách hội thoại, không mở hội thoại đó | 1. Nhận sự kiện `new_message` từ WebSocket cho hội thoại chưa mở | WS event new_message {conversation_id, message} | Badge unread_count của hội thoại tương ứng tăng lên, preview tin nhắn cuối cập nhật |
| TC-048-10 | Nhận tin nhắn mới realtime khi đang mở đúng hội thoại | Functional | High | Đang mở hội thoại 1 | 1. Nhận sự kiện `new_message` cho conversation_id=1 | WS event new_message | Tin nhắn mới tự động xuất hiện trong ChatWindow, auto-scroll xuống cuối, không cần reload |
| TC-048-11 | Đánh dấu đã đọc (read receipt) qua WebSocket | Functional | Medium | Đang mở hội thoại có tin chưa đọc | 1. Mở hội thoại có unread_count > 0 | WS event read_receipt {conversation_id, message_id} | Badge unread của hội thoại được xóa/giảm về 0 |
| TC-048-12 | Cập nhật trạng thái online của người liên hệ | Functional | Medium | Đang mở hoặc xem danh sách hội thoại | 1. Nhận sự kiện `online_status` | WS event online_status {user_id, is_online:true} | Chấm xanh trạng thái online của người liên hệ cập nhật realtime trong InboxSidebar và ChatWindow header |
| TC-048-13 | Fallback long-polling khi WebSocket không khả dụng | Functional | Medium | WebSocket kết nối thất bại | 1. Giả lập kết nối WS lỗi/không khả dụng<br>2. Chờ 5 giây | Long-polling mỗi 5s theo đặc tả | Hệ thống tự động chuyển sang cơ chế long-polling để cập nhật tin nhắn mới |
| TC-048-14 | Tải tài liệu đính kèm trong ContactInfoPanel | Functional | Medium | Hội thoại có tài liệu đính kèm | 1. Click nút download trên 1 file trong danh sách "Tài liệu đính kèm" | GET `/conversations/1/attachments` trả danh sách file | Tải file thành công về máy |
| TC-048-15 | Danh sách tài liệu đính kèm rỗng | Edge-Case | Low | Hội thoại chưa có file nào được chia sẻ | 1. Mở hội thoại chưa từng gửi file | GET `/attachments` trả `{attachments: []}` | ContactInfoPanel hiển thị empty state cho khu vực "Tài liệu đính kèm" |
| TC-048-16 | Gửi tin nhắn thất bại do lỗi server | Error-Handling | High | Đang mở một hội thoại | 1. Nhập nội dung và gửi trong lúc API `/send` trả lỗi 500 | POST trả 500 | Hiển thị trạng thái lỗi cho tin nhắn (ví dụ đánh dấu gửi thất bại), tin nhắn không được thêm như đã gửi thành công |
| TC-048-17 | Lỗi tải danh sách hội thoại (server lỗi) | Error-Handling | High | Đã đăng nhập | 1. Truy cập `/messages` trong lúc API `/conversations` trả lỗi 500 | GET trả 500 | Hiển thị thông báo lỗi tải dữ liệu, không crash trang |
| TC-048-18 | Chưa đăng nhập truy cập trang Tin nhắn | Permission | High | Chưa đăng nhập / token hết hạn | 1. Truy cập `/messages` khi chưa đăng nhập | — | Hệ thống điều hướng (redirect) về trang đăng nhập |
| TC-048-19 | Timestamp tin nhắn hiển thị theo nhóm ngày | UI-Validation | Low | Hội thoại có tin nhắn trải dài nhiều ngày | 1. Cuộn qua các tin nhắn thuộc nhiều ngày khác nhau | messages nhiều ngày | Timestamp được nhóm và hiển thị phân tách theo ngày trong MessageList |
