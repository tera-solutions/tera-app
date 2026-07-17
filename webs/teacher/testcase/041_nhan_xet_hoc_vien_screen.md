# Test Case: [041] Nhận xét học viên

> Module: Teacher | Screen: Nhận xét & Đánh giá học viên | Route: `/feedback` hoặc `/classroom/{id}/feedback` | Task ID: 041
> Nguồn: `tasks/041_nhan_xet_hoc_vien_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Người dùng đã đăng nhập với tài khoản giáo viên có lớp được phân công. Breadcrumb: Lớp học > Nhận xét & Đánh giá. API `GET /api/teacher/feedbacks` và `POST /api/teacher/feedbacks` hoạt động bình thường trừ khi ghi chú khác.

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-041-01 | Load trang Nhận xét & Đánh giá | Functional | High | Lớp có 18 HV, đã có 124 nhận xét | 1. Truy cập `/classroom/10/feedback`<br>2. Quan sát StatHeader và bảng danh sách | class_id=10 | Gọi `GET /api/teacher/feedbacks?class_id=10`; StatHeader hiển thị đúng Số HV=18, % đánh giá=86%, Tổng nhận xét=124, Sao TB=4.8, % hài lòng=98%; bảng hiển thị danh sách HV kèm điểm TB, nhận xét gần nhất |
| TC-041-02 | Click học viên trong bảng để xem chi tiết | Functional | High | Bảng đã có dữ liệu HV "Minh Anh" | 1. Click vào dòng HV "Minh Anh" trong StudentFeedbackTable | student_id=1 | Panel phải (StudentDetailPanel) load đúng dữ liệu kỹ năng (skill bars, radar chart) và nhận xét mới nhất của "Minh Anh"; dòng HV được highlight |
| TC-041-03 | Click "+ Thêm nhận xét" mở modal FeedbackForm | Functional | High | Đã chọn 1 học viên ở panel phải | 1. Click nút "+ Thêm nhận xét" | — | Mở modal FeedbackForm với các field: Đánh giá tổng thể (star), Nghe/Nói/Đọc/Viết (number), Nội dung nhận xét (textarea), Kỳ đánh giá (select) |
| TC-041-04 | Submit nhận xét hợp lệ với đầy đủ thông tin | Functional | High | Modal FeedbackForm đang mở | 1. Chọn rating=4 sao<br>2. Nhập listening_score=6.2, speaking_score=5.5, reading_score=7.0, writing_score=4.8<br>3. Nhập content="Học viên cần cải thiện Speaking..."<br>4. Chọn period="2025-05"<br>5. Click Lưu | student_id=1, class_id=10, rating=4, content hợp lệ | Gọi `POST /api/teacher/feedbacks`; response 201 trả về id, content, created_at; modal đóng, danh sách/nhận xét mới nhất cập nhật; hiển thị thông báo lưu thành công |
| TC-041-05 | Submit thiếu nội dung nhận xét | UI-Validation | High | Modal FeedbackForm đang mở | 1. Bỏ trống field "Nội dung nhận xét"<br>2. Click Lưu | content="" | Hiển thị lỗi "Vui lòng nhập nội dung nhận xét" ngay dưới field, không gọi API, modal không đóng |
| TC-041-06 | Nội dung nhận xét dưới 10 ký tự | UI-Validation | High | Modal FeedbackForm đang mở | 1. Nhập content="Tốt" (3 ký tự)<br>2. Click Lưu | content="Tốt" | Hiển thị lỗi "Vui lòng nhập nội dung nhận xét" (không đạt min 10 ký tự), không submit form |
| TC-041-07 | Không chọn đánh giá tổng thể (rating) | UI-Validation | High | Modal FeedbackForm đang mở | 1. Bỏ qua chọn số sao rating<br>2. Nhập content hợp lệ<br>3. Click Lưu | rating=null | Hiển thị lỗi "Vui lòng chọn đánh giá", không gọi API |
| TC-041-08 | Nhập điểm kỹ năng ngoài khoảng 0-10 | UI-Validation | High | Modal FeedbackForm đang mở | 1. Nhập listening_score=12<br>2. Nhập content, rating hợp lệ<br>3. Click Lưu | listening_score=12 | Hiển thị lỗi "Điểm không hợp lệ" cho field Nghe, không submit form |
| TC-041-09 | Sửa nhận xét đã tồn tại | Functional | Medium | HV đã có nhận xét trước đó với id=50 | 1. Mở nhận xét đã có để chỉnh sửa<br>2. Thay đổi content<br>3. Click Lưu | feedback_id=50 | Gọi `PUT /api/teacher/feedbacks/50` với dữ liệu mới, nhận xét được cập nhật trong danh sách và panel chi tiết |
| TC-041-10 | Radar chart hiển thị đúng 4 trục kỹ năng | UI-Validation | Medium | skills: listening=62, speaking=55, reading=70, writing=48 | 1. Chọn HV "Minh Anh"<br>2. Quan sát radar chart | — | Radar chart vẽ đúng 4 trục Listening/Speaking/Reading/Writing với giá trị 62/55/70/48 |
| TC-041-11 | Skill bars hiển thị đúng phần trăm | UI-Validation | Medium | Cùng dữ liệu skills như trên | 1. Quan sát khu vực "Kỹ năng" dạng horizontal bar | — | Bar Listening=62%, Speaking=55%, Reading=70%, Writing=48% hiển thị đúng độ dài tương ứng |
| TC-041-12 | Lọc danh sách theo lớp | Functional | Medium | GV phụ trách nhiều lớp | 1. Chọn lớp khác trong bộ lọc lớp | class_id=11 | Gọi lại `GET /api/teacher/feedbacks?class_id=11`, bảng chỉ hiển thị HV thuộc lớp đã chọn |
| TC-041-13 | Click "Xem tất cả" điều hướng sang chi tiết học viên | Functional | Medium | Đã chọn 1 HV ở panel phải | 1. Click "Xem tất cả" | student_id=1 | Điều hướng tới `/student/1` với tab nhận xét được active |
| TC-041-14 | StatHeader hiển thị đúng 5 chỉ số | UI-Validation | Low | summary đầy đủ | 1. Load trang, đối chiếu StatHeader | — | 5 card: Số HV=18, % đánh giá=86%, Tổng nhận xét=124, Sao TB=4.8★, % hài lòng=98% hiển thị chính xác |
| TC-041-15 | Highlight học viên đang được chọn | UI-Validation | Low | — | 1. Click chọn 1 HV trong bảng | — | Dòng HV được chọn có style highlight khác biệt so với các dòng còn lại |
| TC-041-16 | Phân trang danh sách học viên nhận xét | Functional | Medium | Danh sách nhiều hơn 20 HV (limit mặc định) | 1. Chuyển sang trang 2 | page=2, limit=20 | Gọi API với `page=2&limit=20`, bảng cập nhật danh sách HV trang 2 |
| TC-041-17 | Xếp loại hiển thị đúng theo điểm trung bình | Functional | Medium | HV avg_score=8.5 -> rank="Giỏi" | 1. Quan sát cột "Xếp loại" của HV trong bảng | — | Cột Xếp loại hiển thị đúng giá trị "rank" trả về từ API (Xuất sắc/Giỏi/Khá/TB) |
| TC-041-18 | Danh sách tiêu chí đánh giá hiển thị đúng | Functional | Low | — | 1. Quan sát khu vực "Tiêu chí đánh giá" phía dưới bảng | — | Hiển thị danh sách criteria đánh giá tương ứng với học viên đang chọn |
| TC-041-19 | Lỗi khi tạo nhận xét | Error-Handling | Medium | API `POST /api/teacher/feedbacks` trả lỗi 500 | 1. Điền form hợp lệ<br>2. Click Lưu khi server lỗi | — | Hiển thị Toast báo lỗi, modal không đóng, dữ liệu đã nhập được giữ nguyên |
| TC-041-20 | Lớp không có học viên nào | Edge-Case | Low | class_id trỏ tới lớp trống | 1. Chọn lớp không có HV nào | — | Bảng StudentFeedbackTable hiển thị EmptyState phù hợp, StatHeader hiển thị giá trị 0 |
