# Phân tích Note Demo Web Teacher (19/07/2026)

Tổng hợp và phân loại các ghi chú/yêu cầu từ buổi demo thành các nhóm chức năng, kèm mức độ ưu tiên đề xuất.

## 1. Quản lý Lead / Tiềm năng

- Teacher chưa có module lead + khách hàng tiềm năng.

## 2. Học viên & Phụ huynh

- Bỏ required ngày sinh khi tạo học viên.
- Bỏ required chi nhánh khi thêm phụ huynh.
- Trong hồ sơ học viên cần hiển thị danh sách người giám hộ, và ngược lại (hồ sơ phụ huynh hiển thị danh sách học viên).
- Thêm tab "lịch sử trình độ" trong chi tiết học viên.
- Thêm tab "bài kiểm tra" trong chi tiết học viên.
- Thiếu chức năng chuyển lớp cho học viên.
- Chưa có chức năng cấp chứng nhận cho học viên.
- Trình độ (level) dùng chung cho toàn bộ 1 business (không theo từng khóa/lớp riêng lẻ).

## 3. Khóa học & Giáo án

- Mã khóa học: backend tự sinh, nhưng vẫn cho phép nhập tay.
- Thêm title/loại học phí cho khóa học.
- Sửa docs số 6 và 7: bổ sung phần giáo án vào giữa.
- Thêm nút Nháp / Xuất bản khi tạo giáo án.
- Cần thêm chức năng chỉnh sửa lại bài học.
- 1 buổi học có thể có nhiều giáo án; bài học đi theo giáo án.
- Khi bắt đầu bài học, giáo viên được chọn giáo án để bắt đầu.
- Buổi học không bắt buộc phải có giáo án (vì có thể là ngày kiểm tra hoặc sự kiện khác).

## 4. Lịch dạy & Lớp học

- Lịch dạy còn thiếu danh sách thời khóa biểu.
- Lớp học phải đi theo lịch học đã thiết lập.

## 5. Bài tập & Bài kiểm tra

- Cần giao được bài tập ngay trong lớp học.
- Xem lại (review) phần chấm bài.
- Bài kiểm tra phải xác định rõ: loại bài kiểm tra, phòng thi, buổi học liên quan.
- Tạo bài kiểm tra xong, giáo viên có thể gắn vào buổi học cụ thể.
- Bài kiểm tra cần hỗ trợ nhiều dạng: trắc nghiệm, tự luận, hoặc upload đề giấy/PDF...

## 6. Hóa đơn & Thanh toán

- Admin cần nơi cấu hình chức năng tạo hóa đơn hàng tháng (tự động).
- Học viên chưa thanh toán hóa đơn phải chuyển sang trạng thái khác "đang học".
- Tạo chức năng thêm tài khoản ngân hàng để nhận thanh toán hóa đơn.
- Thêm mã QR cho thanh toán ngân hàng.
- Thiếu trang đóng học phí (cho học viên/phụ huynh).

## 7. Gói đăng ký (Subscription)

- Admin cần tạo được danh sách các gói đăng ký.
- Admin cần cấu hình được chi tiết từng gói đăng ký.

## 8. Quản lý Giáo viên & Lương

- Admin cần thêm chức năng trả lương cho giáo viên.
- Admin cần chức năng cập nhật số dư cho giáo viên.
- Admin cần bảng đánh giá kỹ năng: có thể dùng bảng có sẵn hoặc để giáo viên tự định nghĩa (self-define).

---

## Nhận xét chung

Các yêu cầu tập trung vào 4 trục chính:

1. **Quan hệ dữ liệu** — liên kết hai chiều giữa học viên, phụ huynh, lớp, giáo án, bài kiểm tra (hiện đang thiếu nhiều liên kết ngược và các tab chi tiết).
2. **Vận hành tài chính** — hóa đơn, thanh toán, gói đăng ký, lương giáo viên là mảng lớn còn thiếu gần như toàn bộ, nên cần ưu tiên cao vì ảnh hưởng trực tiếp đến vận hành trung tâm.
3. **Nghiệp vụ giảng dạy** — giáo án, bài học, bài kiểm tra, chấm bài cần được thiết kế linh hoạt (không required cứng, hỗ trợ nhiều giáo án/buổi học).
4. **Cấu hình linh hoạt cho Admin** — nhiều mục yêu cầu admin có "nơi cấu hình" (hóa đơn, gói đăng ký, đánh giá kỹ năng), cho thấy cần một khu vực Settings/Admin Console tổng hợp thay vì rải rác.

**Đề xuất ưu tiên:**
- Cao: hóa đơn/thanh toán, trạng thái học viên theo thanh toán, liên kết học viên-phụ huynh.
- Trung bình: giáo án/bài học, bài kiểm tra, lịch dạy/thời khóa biểu.
- Thấp hơn: chứng nhận, đánh giá kỹ năng, lead/tiềm năng (module mới hoàn toàn, cần scope riêng).
