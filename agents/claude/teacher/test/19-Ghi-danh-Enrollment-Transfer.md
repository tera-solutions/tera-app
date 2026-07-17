# Test Case: Ghi danh & Chuyển lớp (Enrollment / Transfer — EDU-09)

> Route: `/enrollment/new`, `/transfer`
> Loại test: Smoke test + Functional test (đối chiếu BRD EDU-09)
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi (BR-02 EDU-09: chỉ lớp open/ongoing còn chỗ mới nhận ghi danh) | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Từ trang Học viên, bấm "Ghi danh học viên" | Mở wizard 4 bước: Chọn lớp → Học phí → Học viên → Xác nhận | Đúng, wizard hiển thị đủ 4 bước | Pass |
| 2 | Xem bước 1 "Chọn lớp" | Danh sách lớp đang mở tuyển (open/ongoing) | "Không có lớp học phù hợp" — **đúng theo business rule** vì cả 2 lớp hiện có đều ở trạng thái "Nháp" (draft), chưa "open" | Pass (đúng luật nghiệp vụ) |
| 3 | Quan sát khung "Tóm tắt" bên phải khi chưa chọn lớp | Học phí/Tổng thanh toán nên để trống hoặc 0 khi chưa chọn lớp | **Lỗi**: hiển thị sẵn "Học phí: 250.000đ/buổi" và "Tổng thanh toán: 6.000.000đ" dù "Lớp: Chưa chọn" và "Số HV: 0" | Fail — hiển thị số liệu mặc định sai ngữ cảnh (dữ liệu rác/giá trị khởi tạo không được reset) |
| 4 | Từ trang Học viên, bấm "Chuyển lớp" | Mở wizard 3 bước: Chọn học viên → Lớp đích → Xác nhận | Chưa test trực tiếp trong lượt này (dự kiến tương tự Enrollment, cũng có thể bị chặn do không có lớp "open") | Not tested |

## Ghi chú / Lỗi phát hiện
- **Bug xác nhận:** khung tóm tắt học phí ở bước 1 của wizard Ghi danh hiển thị số tiền mặc định (250.000đ/buổi, tổng 6.000.000đ) trước khi người dùng chọn lớp — có thể gây hiểu nhầm nghiêm trọng nếu người dùng vô tình bỏ qua bước chọn lớp. Cần reset các giá trị này về rỗng/0 cho tới khi có lớp được chọn thực sự.
- Việc chặn ghi danh vào lớp "Nháp" là đúng theo BRD, không phải lỗi.
