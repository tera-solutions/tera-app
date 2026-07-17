# Test Case: [043] Chấm bài

> Module: Teacher | Screen: Chấm bài | Route: `/homework/{id}/grade` | Task ID: 043
> Nguồn: `tasks/043_cham_bai_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Người dùng đã đăng nhập với tài khoản giáo viên và là chủ sở hữu bài tập cần chấm. Breadcrumb: Giáo án > Chấm bài. API `GET /api/teacher/homeworks/{id}/submissions`, `POST /api/teacher/homeworks/{id}/submissions/{student_id}/grade` hoạt động bình thường trừ khi ghi chú khác.

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-043-01 | Load màn hình chấm bài | Functional | High | Bài tập id=1 "Writing - Unit 5" có 24 HV, 18 đã nộp, 10 đã chấm | 1. Truy cập `/homework/1/grade`<br>2. Quan sát 3 panel | homework_id=1 | Gọi `GET /api/teacher/homeworks/1/submissions`; hiển thị tiêu đề "Chấm bài: Writing - Unit 5", panel phải hiển thị danh sách 24 HV với trạng thái đúng, thống kê Đã chấm=10/Chưa chấm=8 |
| TC-043-02 | Click học viên đã nộp bài | Functional | High | HV "Minh Anh" (student_id=1) đã nộp và đã chấm | 1. Click HV "Minh Anh" trong StudentSubmissionList | student_id=1 | Gọi `GET /api/teacher/homeworks/1/submissions/1`; panel trái hiển thị content bài nộp + attachments + submitted_at; panel giữa tự động điền điểm cũ (score=8.5, coherence=8, grammar=9, vocabulary=8, task_achievement=9, comment) |
| TC-043-03 | Click học viên chưa nộp bài | Functional | High | HV có submitted=false | 1. Click HV chưa nộp bài trong danh sách | student_id=99 | Hiển thị thông báo "Học viên chưa nộp bài" tại panel trái, GradingForm không cho nhập điểm (hoặc disabled) |
| TC-043-04 | Nhập điểm hợp lệ và lưu | Functional | High | Đã chọn HV đã nộp bài, chưa chấm | 1. Nhập score=8.5, coherence=8, grammar=9, vocabulary=8, task_achievement=9<br>2. Nhập nhận xét "Bài viết tốt, cần cải thiện Vocabulary"<br>3. Click "Lưu điểm" | score=8.5 | Gọi `POST /api/teacher/homeworks/1/submissions/{student_id}/grade`; response 200 `{success:true, score:8.5}`; Toast thành công; trạng thái HV trong danh sách chuyển thành ★ Đã chấm; stats "Đã chấm" tăng 1 |
| TC-043-05 | Nhập điểm tổng lớn hơn 10 | UI-Validation | High | GradingForm đang mở | 1. Nhập score=12<br>2. Click "Lưu điểm" | score=12 | Hiển thị lỗi "Điểm phải từ 0 đến 10", không gọi API |
| TC-043-06 | Nhập điểm tổng nhỏ hơn 0 | UI-Validation | High | GradingForm đang mở | 1. Nhập score=-1<br>2. Click "Lưu điểm" | score=-1 | Hiển thị lỗi "Điểm phải từ 0 đến 10", không gọi API |
| TC-043-07 | Nhập điểm tiêu chí ngoài khoảng 0-10 | UI-Validation | High | GradingForm đang mở | 1. Nhập coherence=15<br>2. Điền các field khác hợp lệ<br>3. Click "Lưu điểm" | coherence=15 | Hiển thị lỗi "Điểm tiêu chí không hợp lệ" cho tiêu chí Coherence, không gọi API |
| TC-043-08 | Click "AI tóm tắt" hiển thị phân tích | Functional | Medium | Đã chọn HV có bài nộp | 1. Click nút "AI tóm tắt" tại SubmissionViewer | student_id=1 | Gọi `POST /api/teacher/homeworks/1/submissions/1/ai-summary`; AISummaryPanel hiển thị strengths, weaknesses và suggested_score=8.5 |
| TC-043-09 | Phân bố điểm chart hiển thị đúng | UI-Validation | Medium | Đã có 10 HV được chấm với các điểm khác nhau | 1. Quan sát bar chart "Phân bố điểm" ở panel phải | — | Bar chart render đúng số lượng HV theo từng khoảng điểm đã chấm |
| TC-043-10 | Bài nộp có hình ảnh đính kèm | Functional | Medium | Submission của HV có attachments type="image" | 1. Chọn HV có bài nộp kèm hình ảnh | student_id=1 | Panel trái hiển thị đúng hình ảnh đính kèm cùng nội dung bài viết |
| TC-043-11 | Bài nộp có file đính kèm không phải hình ảnh | Functional | Low | Submission có attachment type khác "image" (ví dụ file audio/document) | 1. Chọn HV có bài nộp kèm file không phải ảnh | — | Panel trái hiển thị link/icon file đính kèm tương ứng, không cố hiển thị như ảnh |
| TC-043-12 | Thống kê lớp Đã chấm/Chưa chấm hiển thị đúng | UI-Validation | Medium | stats: total=24, submitted=18, graded=10 | 1. Load trang, quan sát khu vực "Thống kê lớp" | — | Hiển thị đúng Đã chấm=10, Chưa chấm=8 (submitted - graded), phù hợp dữ liệu API |
| TC-043-13 | Sửa lại điểm đã chấm trước đó | Functional | Medium | HV đã có điểm cũ score=8.5 | 1. Chọn HV đã chấm<br>2. Sửa score thành 9.0<br>3. Click "Lưu điểm" | score=9.0 | Gọi lại API grade với score mới, điểm cập nhật thành 9.0 trong danh sách và panel |
| TC-043-14 | Lưu điểm thất bại | Error-Handling | High | API `POST .../grade` trả lỗi 500 | 1. Nhập điểm hợp lệ<br>2. Click "Lưu điểm" khi server lỗi | — | Hiển thị Toast error, trạng thái HV trong danh sách KHÔNG chuyển thành Đã chấm, dữ liệu form giữ nguyên |
| TC-043-15 | Danh sách học viên hiển thị đúng trạng thái | UI-Validation | Medium | students có submitted/graded khác nhau | 1. Load trang, quan sát icon trạng thái từng HV | — | HV chưa nộp hiển thị ○, đã nộp chưa chấm hiển thị ✓, đã chấm hiển thị ★ đúng theo dữ liệu API |
| TC-043-16 | Chuyển đổi giữa các học viên trong danh sách | Functional | Medium | Danh sách có nhiều HV | 1. Click HV A, quan sát panel trái/giữa<br>2. Click HV B, quan sát lại panel trái/giữa | student_id=1, student_id=2 | Mỗi lần click, panel trái và giữa load đúng dữ liệu (bài nộp, điểm) tương ứng của HV vừa chọn, không giữ lại dữ liệu HV trước |
| TC-043-17 | Nhận xét (comment) được lưu cùng điểm | Functional | Medium | GradingForm đang mở | 1. Nhập nhận xét vào textarea<br>2. Nhập điểm hợp lệ<br>3. Click "Lưu điểm" | comment="Bài viết tốt..." | Request POST grade chứa đúng field `comment`; khi xem lại submission, nhận xét hiển thị đúng nội dung đã lưu |
| TC-043-18 | Truy cập chấm bài tập không sở hữu | Permission | High | Bài tập id=99 thuộc GV khác | 1. Truy cập `/homework/99/grade` | homework_id=99 | Hệ thống chặn truy cập (403/redirect), không hiển thị dữ liệu bài nộp của HV |
| TC-043-19 | Lỗi khi gọi AI tóm tắt | Error-Handling | Low | API `POST .../ai-summary` trả lỗi 500 | 1. Click "AI tóm tắt" khi server lỗi | — | Hiển thị Toast báo lỗi, AISummaryPanel không hiển thị dữ liệu sai lệch |
| TC-043-20 | Bài tập chưa có học viên nào nộp bài | Edge-Case | Low | stats: submitted=0 | 1. Truy cập màn hình chấm bài của bài tập chưa ai nộp | — | StudentSubmissionList hiển thị toàn bộ HV ở trạng thái ○ Chưa nộp, panel trái/giữa hiển thị EmptyState khi chưa chọn HV nào có bài |
