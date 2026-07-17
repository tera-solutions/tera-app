# Test Case: [042] Bài tập

> Module: Teacher | Screen: Bài tập | Route: `/homework` | Task ID: 042
> Nguồn: `tasks/042_bai_tap_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Người dùng đã đăng nhập với tài khoản giáo viên. Breadcrumb: Bài tập. API `GET /api/teacher/homeworks`, `POST /api/teacher/homeworks`, `PUT /api/teacher/homeworks/{id}`, `DELETE /api/teacher/homeworks/{id}` hoạt động bình thường trừ khi ghi chú khác.

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-042-01 | Load trang danh sách bài tập | Functional | High | Có 20 bài tập, 8 đã giao, 3 draft | 1. Truy cập `/homework`<br>2. Quan sát HomeworkStatRow và bảng | — | Gọi `GET /api/teacher/homeworks`; 4 stat card Tổng=20, Đã giao=8, Chưa giao=3, Nộp bài=156/240; bảng hiển thị danh sách bài tập (Write the missing letters, Listen and choose, Fill in the blanks...) |
| TC-042-02 | Click "+ Tạo bài tập" mở form | Functional | High | — | 1. Click nút "+ Tạo bài tập" | — | Mở HomeworkForm (modal/drawer) với các field: Tên bài tập, Lớp áp dụng, Mô tả/yêu cầu, Hạn nộp, Hạng thứ, Tài liệu đính kèm, Điểm tối đa |
| TC-042-03 | Tạo bài tập hợp lệ | Functional | High | Form đang mở | 1. Nhập title="Write the missing letters"<br>2. Chọn class_ids=[10]<br>3. Nhập description<br>4. Chọn due_date tương lai (2025-05-20T23:59:00Z)<br>5. Chọn level="Starters"<br>6. Nhập max_score=10<br>7. Click Lưu | title, class_ids=[10], due_date tương lai | Gọi `POST /api/teacher/homeworks`; response 201 trả id=21, status="draft"; bài tập mới xuất hiện trong danh sách, form đóng, thông báo tạo thành công |
| TC-042-04 | Tạo bài tập thiếu tên bài tập | UI-Validation | High | Form đang mở | 1. Bỏ trống field "Tên bài tập"<br>2. Điền các field khác hợp lệ<br>3. Click Lưu | title="" | Hiển thị lỗi "Vui lòng nhập tên bài tập", không gọi API, form không đóng |
| TC-042-05 | Tạo bài tập không chọn lớp áp dụng | UI-Validation | High | Form đang mở | 1. Bỏ trống field "Lớp áp dụng"<br>2. Điền các field khác hợp lệ<br>3. Click Lưu | class_ids=[] | Hiển thị lỗi "Vui lòng chọn ít nhất một lớp", không gọi API |
| TC-042-06 | Tạo bài tập thiếu mô tả | UI-Validation | High | Form đang mở | 1. Bỏ trống field "Mô tả/yêu cầu"<br>2. Điền các field khác hợp lệ<br>3. Click Lưu | description="" | Hiển thị lỗi "Vui lòng nhập mô tả bài tập", không gọi API |
| TC-042-07 | Hạn nộp là ngày trong quá khứ | UI-Validation | High | Form đang mở | 1. Chọn due_date là ngày đã qua, ví dụ 2025-01-01<br>2. Điền các field khác hợp lệ<br>3. Click Lưu | due_date=2025-01-01 (quá khứ so với 2026-07-17 hiện tại) | Hiển thị lỗi "Hạn nộp phải là ngày trong tương lai", không gọi API |
| TC-042-08 | Sửa bài tập đã tồn tại | Functional | Medium | Bài tập id=1 đã tồn tại | 1. Click "Sửa" ở bài tập "Write the missing letters"<br>2. Thay đổi due_date<br>3. Lưu | homework_id=1 | Gọi `PUT /api/teacher/homeworks/1`, danh sách cập nhật thông tin mới sau khi lưu thành công |
| TC-042-09 | Xóa bài tập | Functional | High | Bài tập id=1 tồn tại | 1. Click "Xóa" ở bài tập cần xóa<br>2. Xác nhận trong Confirm dialog | homework_id=1 | Gọi `DELETE /api/teacher/homeworks/1`; response 200 `{success:true}`; bài tập biến mất khỏi danh sách, stats Tổng giảm 1 |
| TC-042-10 | Hủy xóa bài tập | Edge-Case | Medium | Confirm dialog xóa đang mở | 1. Click "Xóa" ở một bài tập<br>2. Click "Hủy" trong Confirm dialog | — | Không gọi API DELETE, bài tập vẫn còn nguyên trong danh sách |
| TC-042-11 | Lọc bài tập theo lớp | Functional | Medium | HomeworkFilterSidebar có dropdown Lớp | 1. Chọn lớp "Starters 2A" ở filter | class_id=10 | Bảng chỉ hiển thị bài tập thuộc lớp đã chọn |
| TC-042-12 | Lọc bài tập theo hạng thứ | Functional | Medium | HomeworkFilterSidebar có dropdown Hạng thứ | 1. Chọn hạng thứ "Starters" ở filter | level=Starters | Bảng chỉ hiển thị bài tập có level=Starters |
| TC-042-13 | Click "Chấm bài" điều hướng sang màn hình chấm bài | Functional | High | Bài tập id=1 đã có HV nộp bài | 1. Click "Chấm bài" ở bài tập "Write the missing letters" | homework_id=1 | Điều hướng tới `/homework/1/grade` (màn hình [043] Chấm bài) |
| TC-042-14 | Click "Xem" xem chi tiết bài tập | Functional | Medium | — | 1. Click "Xem" ở một bài tập | homework_id=1 | Hiển thị chi tiết đầy đủ nội dung bài tập (mô tả, tài liệu đính kèm, hạn nộp) |
| TC-042-15 | Donut chart thống kê hoàn thành hiển thị đúng | UI-Validation | Medium | 156/240 đã nộp = 75% hoàn thành, 25% chưa nộp | 1. Quan sát donut chart trong sidebar filter | — | Donut chart hiển thị đúng tỷ lệ Hoàn thành 75% / Chưa nộp 25% |
| TC-042-16 | Bài tập quá hạn được highlight | UI-Validation | Medium | Bài tập có due_date đã qua so với ngày hiện tại | 1. Quan sát cột "Thời gian" của bài tập đã quá hạn | — | Deadline của bài tập quá hạn được highlight màu đỏ trong bảng |
| TC-042-17 | HomeworkStatRow hiển thị đúng 4 chỉ số | UI-Validation | Low | summary total=20, assigned=8, draft=3, total_submitted=156, total_expected=240 | 1. Load trang, đối chiếu 4 stat card | — | Card Tổng=20, Đã giao=8, Chưa giao=3, Nộp bài=156/240 hiển thị chính xác |
| TC-042-18 | Upload tài liệu đính kèm khi tạo bài tập | Functional | Low | Form đang mở | 1. Chọn field "Tài liệu đính kèm"<br>2. Chọn 1 file để upload<br>3. Lưu bài tập | attachments=[file.pdf] | File được đính kèm thành công vào bài tập, hiển thị trong chi tiết bài tập sau khi lưu |
| TC-042-19 | Lỗi khi tạo bài tập | Error-Handling | Medium | API `POST /api/teacher/homeworks` trả lỗi 500 | 1. Điền form hợp lệ<br>2. Click Lưu khi server lỗi | — | Hiển thị Toast báo lỗi tạo bài tập, form không đóng, dữ liệu đã nhập được giữ nguyên |
| TC-042-20 | Không có bài tập nào | Edge-Case | Low | Danh sách bài tập rỗng (data=[]) | 1. Truy cập `/homework` khi GV chưa tạo bài tập nào | — | Bảng HomeworkTable hiển thị EmptyState phù hợp, stat card đều = 0 |
