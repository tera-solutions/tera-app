# Test Case: Thông báo (Notifications) & Tin nhắn (Messages)

> Route: `/notifications`, `/messages`
> Loại test: Smoke test + Functional test
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Các bước test & kết quả — Thông báo

| # | Bước | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Bấm icon chuông ở header | Danh sách thông báo + bộ lọc danh mục/trạng thái/thời gian | Hiển thị 12 thông báo mẫu, đủ filter | Pass (giao diện) |
| 2 | Đối chiếu nội dung thông báo với dữ liệu thật (VD: "Điểm danh lớp Starters 2A") | Tên lớp trong thông báo phải khớp lớp thật của GV | Không khớp — 2 lớp thật của tài khoản là "Lớp Mover 1"/"Lớp Starters 1", nhưng thông báo nhắc tới "Starters 2A", "Movers 1B", "Flyers 3A" — các lớp không tồn tại trong tài khoản | Fail — xác nhận dữ liệu mock tĩnh, không liên quan tài khoản thật |

## Các bước test & kết quả — Tin nhắn

| # | Bước | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 3 | Bấm icon tin nhắn ở header | Hộp thư với danh sách hội thoại | Hiển thị 4 hội thoại mẫu với phụ huynh (Minh Anh, Lan Anh, Tuấn Kiệt, Bảo...) — không khớp tên với 4 học viên thật (Bé An/Bình/Chi/Dũng) | Fail — dữ liệu mock, không liên quan học viên/phụ huynh thật của tài khoản |
| 4 | Gõ tin nhắn "Test message from QA" và gửi | Tin nhắn xuất hiện trong khung chat | Đúng, tin nhắn xuất hiện ngay lập tức, cập nhật cả preview ở sidebar | Pass (UI phản hồi tức thời) |
| 5 | Tải lại trang (F5 / navigate lại `/messages`) | Tin nhắn vừa gửi phải còn tồn tại nếu đã lưu vào backend | **Tin nhắn biến mất hoàn toàn**, khung chat trở về đúng 2 tin nhắn gốc ban đầu | Fail — **xác nhận 100%: tính năng nhắn tin không lưu trữ, chỉ là state cục bộ trên trình duyệt** |

## Ghi chú / Lỗi phát hiện
Cả 2 tính năng đều đã được xác nhận là **hoàn toàn mock, không có backend thật** — khớp chính xác với phát hiện từ rà soát mã nguồn trước đó. Đây là 2 chức năng có mức độ ưu tiên cao cần hoàn thiện vì:
- Thông báo là kênh cảnh báo quan trọng cho GV (nhắc điểm danh, deadline chấm bài...).
- Tin nhắn là kênh liên lạc trực tiếp GV–phụ huynh, nếu người dùng thật gửi tin nhắn tưởng đã đến nơi nhưng thực chất mất ngay khi tải lại trang — rủi ro cao gây mất lòng tin nếu vô tình đưa vào sử dụng thật.
