# Test Case: [044] Bài kiểm tra

> Module: Teacher | Screen: Bài kiểm tra | Route: `/exam` hoặc `/classroom/{id}/exam` | Task ID: 044
> Nguồn: `tasks/044_bai_kiem_tra_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Người dùng đã đăng nhập với tài khoản giáo viên có lớp học được phân công. Bài kiểm tra đã tồn tại trong hệ thống với id hợp lệ. API base: `https://api.anhnguhana.com/api`.

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-044-01 | Load trang chi tiết bài kiểm tra thành công | Functional | High | Đã đăng nhập, có quyền xem bài KT id=1 | 1. Truy cập route `/exam` (hoặc `/classroom/{id}/exam`)<br>2. Chờ trang tải xong | GET `/api/teacher/exams/1` trả 200 | Hiển thị đủ 5 ExamStatRow (ĐTB 9.8, Xếp loại 4.2★, Tỷ lệ đạt 80%, Tỷ lệ 83.3%, Tổng HV 18) và bảng điểm học viên |
| TC-044-02 | Badge "chưa nhập điểm" hiển thị đúng số lượng | Functional | Medium | Exam có `pending_grade` = 2 | 1. Load trang chi tiết bài KT | stats.pending_grade = 2 | Hiển thị badge "2 chưa nhập điểm" cạnh nhóm ExamStatRow |
| TC-044-03 | Badge "chưa nhập điểm" ẩn khi tất cả HV đã có điểm | Edge-Case | Medium | Exam có `pending_grade` = 0 | 1. Load trang chi tiết bài KT | stats.pending_grade = 0 | Không hiển thị badge "chưa nhập điểm" |
| TC-044-04 | Chuyển tab "Đếm theo HV" hiển thị bảng điểm | Functional | High | Đã load trang | 1. Click tab "Đếm theo HV" | GET `/api/teacher/exams/1/scores` trả 200 | Hiển thị bảng với cột Tên, T1, T2, T3, T4, Điểm TB, Kết quả (Đạt/Không đạt) |
| TC-044-05 | Chuyển tab "Thống kê chi tiết" | Functional | Medium | Đã load trang | 1. Click tab "Thống kê chi tiết" | — | Hiển thị phân tích Min, Max, TB, Median và tỷ lệ đạt cho từng phần T1–T4 |
| TC-044-06 | Chuyển tab "Biểu đồ" render histogram | Functional | Medium | Đã load trang | 1. Click tab "Biểu đồ" | — | Render histogram phân bố điểm, pie chart tỷ lệ đạt/không đạt và line chart tiến trình |
| TC-044-07 | Chuyển tab "Chi tiết HV" | Functional | Medium | Đã load trang | 1. Click tab "Chi tiết HV" | — | Hiển thị bảng chi tiết điểm từng câu hỏi của từng học viên |
| TC-044-08 | Click học viên trong tab "Chi tiết HV" xem bài làm | Functional | Medium | Đang ở tab "Chi tiết HV" | 1. Click vào 1 học viên trong bảng | student_id = 1 | Mở/điều hướng đến chi tiết bài làm của học viên đó |
| TC-044-09 | Nhập điểm cho học viên thành công | Functional | High | Đang ở tab "Đếm theo HV" | 1. Click ô điểm của học viên "Nguyễn Minh An"<br>2. Nhập t1=8, t2=9, t3=7, t4=10<br>3. Lưu | POST `/api/teacher/exams/1/scores` body `{student_id:1, scores:{t1:8,t2:9,t3:7,t4:10}}` trả 200 `{success:true, avg:8.5}` | Lưu thành công, cập nhật điểm TB = 8.5 trên bảng và badge "chưa nhập điểm" giảm 1 |
| TC-044-10 | Nhập điểm thất bại do lỗi server | Error-Handling | High | Đang sửa điểm học viên | 1. Nhập điểm và lưu trong lúc API `/scores` trả lỗi 500 | POST trả 500 | Hiển thị thông báo lỗi, điểm không được cập nhật trên bảng, examStore.setSubmitting(false) |
| TC-044-11 | Export Excel bảng điểm | Functional | Medium | Đang ở tab "Đếm theo HV", có dữ liệu điểm | 1. Click nút "Export Excel" | — | Hệ thống tải xuống (download) file Excel chứa bảng điểm học viên |
| TC-044-12 | Tìm kiếm học viên theo tên | Functional | Medium | Bảng điểm có nhiều học viên | 1. Nhập từ khóa vào ô tìm kiếm, ví dụ "Lan" | search = "Lan" | Bảng lọc realtime chỉ hiển thị học viên có tên khớp từ khóa |
| TC-044-13 | Tìm kiếm không có kết quả | Edge-Case | Medium | Bảng điểm có nhiều học viên | 1. Nhập từ khóa không tồn tại, ví dụ "zzz123" | search = "zzz123" | Hiển thị empty state "Không tìm thấy học viên phù hợp" |
| TC-044-14 | Sắp xếp bảng điểm theo Điểm TB tăng/giảm dần | Functional | Medium | Bảng điểm có nhiều học viên | 1. Click header cột "Điểm TB" để sort tăng dần<br>2. Click lại để sort giảm dần | — | Danh sách học viên được sắp xếp đúng theo điểm tăng dần rồi giảm dần |
| TC-044-15 | Giáo viên không được phân công lớp truy cập bài KT | Permission | High | Tài khoản GV khác không thuộc lớp chứa bài KT id=1 | 1. Đăng nhập với GV không có quyền<br>2. Truy cập `/exam` hoặc `/classroom/{id}/exam` với id=1 | GET `/api/teacher/exams/1` trả 403 | Không hiển thị dữ liệu bài KT, hiển thị thông báo không có quyền truy cập |
| TC-044-16 | Lỗi tải dữ liệu bài kiểm tra (server lỗi) | Error-Handling | High | Đã đăng nhập hợp lệ | 1. Truy cập trang chi tiết bài KT trong lúc API `/api/teacher/exams/{id}` trả lỗi 500 | GET trả 500 | Hiển thị thông báo lỗi tải dữ liệu, không crash trang, có thể thao tác tải lại |
| TC-044-17 | Bảng điểm rỗng khi lớp chưa có học viên nào có điểm | Edge-Case | Medium | Exam vừa tạo, chưa nhập điểm HV nào | 1. Load tab "Đếm theo HV" | GET `/scores` trả `{data: []}` | Hiển thị empty state phù hợp cho bảng điểm, các ExamStatRow hiển thị giá trị 0/rỗng hợp lý |
