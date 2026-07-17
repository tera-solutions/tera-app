# Thống kê tổng hợp — Test trên môi trường thật (teacher.anhnguhana.com)

> Tài khoản test: demo1@terasolutions.vn (role Teacher) | Ngày: 2026-07-17
> Phương pháp: dùng trình duyệt thật (Claude in Chrome) đăng nhập và thao tác trực tiếp trên từng màn hình, đối chiếu với BRD/SRS đã đọc trước đó. Chi tiết từng chức năng nằm trong các file `00` → `29` cùng thư mục.

---

## 1. Thống kê chung

| Chỉ số | Số lượng |
|---|---:|
| Tổng số màn hình/chức năng đã smoke test | 30 |
| Pass hoàn toàn (đúng như tài liệu, không lỗi) | 15 |
| Pass giao diện nhưng dữ liệu/hành vi có vấn đề | 9 |
| Fail rõ ràng (bug xác nhận được) | 6 nhóm lỗi lớn (chi tiết mục 4) |
| Bị chặn có chủ đích (permission / chờ tích hợp) | 3 |
| Chưa test được do thiếu dữ liệu (0 buổi học, 0 bài nộp) | ~8 luồng con |

---

## 2. Danh sách toàn bộ chức năng nhìn thấy trên màn hình (theo menu thật)

**Menu chính (sidebar):** Trang chủ, Lịch dạy, Lớp học, Điểm danh, Giáo án, Tài liệu, Ngân hàng câu hỏi, Bài tập, Bài kiểm tra, Kiểm tra đầu vào, Đánh giá, Học viên, Khác.

**Menu "Khác":** Khóa học, Trình độ, Thành tích, Xếp hạng, Phụ huynh, Phòng học, Báo cáo, Bảng công, Bảng lương, Đơn xin nghỉ, Gói đăng ký, Ví cá nhân, Hóa đơn, Gói đã đăng ký, Cài đặt.

**Icon header:** Tìm kiếm nhanh, Ngày hiện tại, Thông báo (chuông), Tin nhắn (bubble), Avatar → Thông tin cá nhân / Đăng xuất.

**Không thấy trên menu (dù có route trong code):** Superadmin (đúng — bị ẩn cho role Teacher, đã test chặn ở file 29), Subject/Môn học (không tồn tại ở đâu cả — thiếu tính năng thật sự, không phải bị ẩn theo quyền).

Tổng cộng **29 màn hình chức năng** có thể truy cập được bằng tài khoản Teacher, khớp gần như hoàn toàn với bản kiểm kê mã nguồn trước đó (file `01-Thong-ke-chuc-nang-da-lam.md`).

---

## 3. Phần không cần thiết / dư thừa

| Hạng mục | Vấn đề |
|---|---|
| **"Gói đã đăng ký" (Subscription) trùng "Gói đăng ký" (PackageManagement)** | Hai trang riêng biệt trong menu "Khác", cùng chức năng quản lý gói dịch vụ, nhưng dữ liệu mâu thuẫn nhau hoàn toàn (một nói "chưa đăng ký gói nào", một nói "đang dùng gói Miễn phí"). Đây là dư thừa gây nhầm lẫn nghiêm trọng — khuyến nghị **gỡ bỏ 1 trong 2** (giữ PackageManagement vì dùng API thật). |
| **Nút "Tạo thư mục" (Tài liệu), "Tạo hóa đơn" (Hóa đơn), "Tải bảng lương PDF" (Bảng lương)** | Hiển thị như chức năng khả dụng nhưng bấm vào không có phản hồi gì (không mở modal, không thông báo lỗi/"đang phát triển"). Về UX, thà ẩn nút này đi hoặc disable kèm ghi chú rõ ràng (giống cách làm tốt ở nút "Nạp tiền"/"Rút tiền" trong Ví cá nhân — có ghi chú "Chờ tích hợp cổng thanh toán"/"Chờ backend hỗ trợ"). |
| **Icon "xem trước" (👁) trên Tài liệu, "Bài kiểm tra" placement test tab Ngân hàng câu hỏi** | Nghi ngờ chỉ là điều hướng/placeholder — cần rà soát thêm, chưa xác nhận đầy đủ trong lượt test này. |

---

## 4. Chức năng bị block (kèm nguyên nhân)

### 4.1 Block có chủ đích (đúng thiết kế, không phải lỗi)
| Chức năng | Lý do block | Đánh giá |
|---|---|---|
| Nạp tiền vào Ví (`/wallet/deposit`) | "Chờ tích hợp cổng thanh toán" — nút bị disable kèm ghi chú rõ | Tốt, xử lý đúng cách |
| Rút tiền từ Ví (`/wallet/withdraw`) | "Chờ backend hỗ trợ rút tiền" — nút bị disable kèm ghi chú rõ | Tốt, xử lý đúng cách |
| Truy cập `/superadmin` bằng role Teacher | Phân quyền route-level, trả về trang 403 Forbidden | Tốt, bảo mật đúng |
| Ghi danh học viên vào lớp "Nháp" (chưa mở tuyển) | Đúng theo BR-02 EDU-09: chỉ lớp open/ongoing mới nhận ghi danh | Đúng nghiệp vụ, không phải lỗi |
| Điểm danh khi lớp chưa có buổi học | Đúng luồng: phải có session (EDU-11) trước khi điểm danh (EDU-12) | Đúng nghiệp vụ, không phải lỗi |

### 4.2 Block do thiếu dữ liệu môi trường test (không phải lỗi ứng dụng, nhưng cản trở việc test sâu)
Tài khoản demo hiện có: 2 lớp học (đều "Nháp", 0 buổi học), 4 học viên (status "studying" nhưng không gắn lớp nào), 0 phụ huynh, 0 phòng học, 1 bài tập nháp (0 lượt nộp), 1 câu hỏi trong ngân hàng, không có hồ sơ giảng dạy (Teacher/HR profile) liên kết với tài khoản. Vì vậy **không thể test sâu** các luồng sau:
- Điểm danh thực tế (chọn trạng thái từng học viên, lưu, thông báo phụ huynh realtime).
- Giao bài → học viên nộp → chấm bài (annotate, ghi âm, thang điểm) — vì 0 bài nộp.
- Tổ chức kỳ thi thật (nhập điểm theo kỹ năng, thi bù, publish).
- Ghi danh/chuyển lớp thành công (vì không có lớp nào ở trạng thái "open").

### 4.3 Lỗi thật (fail xác nhận) — xem chi tiết đầy đủ trong từng file test tương ứng
| # | Lỗi | Mức độ | File chi tiết |
|---|---|---|---|
| 1 | Trang "Học viên": thẻ thống kê "Đang học: 0" mâu thuẫn với chính bảng dữ liệu (4/4 học viên status "studying") | Cao | `13-Hoc-vien-Students.md` |
| 2 | Học viên "studying" không gắn với lớp nào, cả 2 lớp đều 0/20 sĩ số | Cao | `03-Lop-hoc-Classroom.md`, `13-Hoc-vien-Students.md` |
| 3 | 0 phụ huynh tồn tại dù có học viên "studying" — vi phạm BR-02 EDU-01/02 | Cao | `17-Phu-huynh-Parents.md` |
| 4 | "Gói đăng ký" và "Gói đã đăng ký" hiển thị dữ liệu mâu thuẫn nhau hoàn toàn | Cao | `24-Goi-dang-ky-PackageManagement-Subscription.md` |
| 5 | Trang Bảng lương hiển thị tên nhân viên khác ("Cô Ngọc") so với tài khoản đang đăng nhập ("Cô Hạ") — xác nhận dữ liệu mock hoàn toàn | Trung bình (đã biết trước qua review code, nay xác nhận trên môi trường thật) | `22-Bang-luong-Payroll.md` |
| 6 | Panel "Đánh giá học viên" trên trang Thành tích báo lỗi tải dữ liệu ("Không tải được dữ liệu") thay vì trạng thái rỗng | Trung bình | `15-Thanh-tich-Achievement.md` |
| 7 | Wizard Ghi danh hiển thị sẵn học phí/tổng tiền mặc định (250.000đ/buổi, 6.000.000đ) trước khi chọn lớp | Trung bình | `19-Ghi-danh-Enrollment-Transfer.md` |
| 8 | Tin nhắn gửi đi không được lưu trữ, mất khi tải lại trang | Cao (nếu đưa vào dùng thật) | `28-Thong-bao-va-Tin-nhan.md` |
| 9 | Thông báo & tin nhắn hiển thị nội dung tham chiếu tới lớp/phụ huynh không tồn tại trong tài khoản (dữ liệu mock tĩnh) | Cao (nếu đưa vào dùng thật) | `28-Thong-bao-va-Tin-nhan.md` |
| 10 | Các nút "Tạo thư mục", "Tạo hóa đơn", "Tải bảng lương PDF" không phản hồi khi bấm | Trung bình | `06-, 26-, 22-` |

---

## 5. Kết luận nhanh

Về mặt **smoke test** (ứng dụng có chạy được không): **Đạt** — 29/29 màn hình truy cập được đều tải thành công, không có màn hình nào crash hay trắng trang, không phát hiện lỗi JavaScript nghiêm trọng trên console trong quá trình test.

Về mặt **functional test theo tài liệu**: phát hiện 2 nhóm vấn đề cần ưu tiên xử lý trước khi có thể coi là "hoàn thiện":
1. **Tính toàn vẹn dữ liệu enrollment** (học viên ↔ lớp ↔ phụ huynh ↔ giáo viên) đang bị đứt gãy trên tài khoản demo — cần xác minh đây là vấn đề riêng của tài khoản test này hay là lỗi hệ thống chung, bằng cách thử tạo 1 luồng ghi danh mới hoàn chỉnh từ đầu.
2. **Các màn hình còn dùng dữ liệu mock/tĩnh** (Thông báo, Tin nhắn, Bảng lương, Đơn xin nghỉ, Gói đã đăng ký) cần được hoàn thiện kết nối backend thật hoặc gắn nhãn rõ ràng "Sắp ra mắt" để tránh người dùng hiểu nhầm là tính năng đã sẵn sàng.
