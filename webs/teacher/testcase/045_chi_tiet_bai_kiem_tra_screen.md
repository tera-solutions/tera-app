# Test Case: [045] Chi tiết bài kiểm tra

> Module: Teacher | Screen: Chi tiết bài kiểm tra | Route: `/exam/{id}` | Task ID: 045
> Nguồn: `tasks/045_chi_tiet_bai_kiem_tra_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Người dùng đã đăng nhập với tài khoản giáo viên có quyền xem bài kiểm tra tương ứng. Bài kiểm tra tồn tại với id hợp lệ. API base: `https://api.anhnguhana.com/api`.

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-045-01 | Load trang chi tiết bài kiểm tra thành công | Functional | High | Bài KT id=1 tồn tại | 1. Truy cập `/exam/1`<br>2. Chờ trang tải xong | GET `/api/teacher/exams/1` trả 200 | Hiển thị ExamCoverCard (mã AT-A2-0000, tên khóa, lớp, GV), 6 ExamStatGrid (18 HV, 16 ngày, ĐTB 7.63, cao nhất 9.8, đạt 83.3%, rớt 3.2%) |
| TC-045-02 | Donut chart phân bố điểm render đúng dữ liệu | Functional | High | Đã load trang | 1. Quan sát khu vực "Phân bố điểm" | score_distribution: {0_4:1, 5_6:2, 7_8:8, 9_10:7} | Donut chart hiển thị đúng 4 dải điểm với chú thích màu tương ứng, tổng = 18 |
| TC-045-03 | Click loại bài kiểm tra khác trong ExamTypeSidebar | Functional | High | Sidebar có 3 loại: đầu vào, giữa kỳ (active), cuối kỳ | 1. Click "Kiểm tra đầu vào" trong ExamTypeSidebar | GET `/api/teacher/exams/{id}/related-types` id mới | Điều hướng (navigate) sang trang chi tiết bài KT "Kiểm tra đầu vào" tương ứng, cập nhật trạng thái active |
| TC-045-04 | Lọc kết quả "Không đạt" trong StudentResultTable | Functional | High | Bảng có cả HV đạt/không đạt | 1. Chọn filter "Không đạt" (result=fail) | GET `/results?result=fail` | Chỉ hiển thị các học viên có result = fail |
| TC-045-05 | Lọc kết quả "Đạt" | Functional | Medium | Bảng có cả HV đạt/không đạt | 1. Chọn filter "Đạt" (result=pass) | GET `/results?result=pass` | Chỉ hiển thị các học viên có result = pass |
| TC-045-06 | Sắp xếp bảng kết quả theo điểm | Functional | Medium | Bảng có nhiều học viên | 1. Chọn sort=score, order=desc<br>2. Đổi order=asc | GET `/results?sort=score&order=desc` | Danh sách sắp xếp đúng theo điểm giảm dần rồi tăng dần |
| TC-045-07 | Sắp xếp bảng kết quả theo tên | Functional | Medium | Bảng có nhiều học viên | 1. Chọn sort=name | GET `/results?sort=name` | Danh sách sắp xếp theo tên học viên (A-Z) |
| TC-045-08 | Tìm kiếm học viên trong StudentResultTable | Functional | Medium | Bảng có nhiều học viên | 1. Nhập từ khóa tên vào ô tìm kiếm | GET `/results?search=An` | Chỉ hiển thị học viên có tên khớp từ khóa "An" |
| TC-045-09 | Tìm kiếm không có kết quả | Edge-Case | Medium | Bảng có nhiều học viên | 1. Nhập từ khóa không tồn tại | GET `/results?search=zzz` | Hiển thị empty state "Không tìm thấy học viên" |
| TC-045-10 | Click "Xem chi tiết" của một học viên | Functional | High | Bảng có ít nhất 1 học viên | 1. Click icon/hành động "Xem chi tiết" ở dòng học viên | student_id=1 | Điều hướng sang trang chi tiết bài làm của học viên đó |
| TC-045-11 | Phân trang danh sách kết quả học viên | Functional | Medium | Số học viên > limit (20) | 1. Chuyển sang trang 2 của bảng kết quả | GET `/results?page=2&limit=20` | Hiển thị đúng nhóm học viên trang 2, meta.total không đổi |
| TC-045-12 | Timeline hoạt động gần đây hiển thị đúng thứ tự | Functional | Medium | Có nhiều activity log | 1. Quan sát ActivityTimeline ở panel phải | GET `/api/teacher/exams/1/activities` | Danh sách activity hiển thị icon + mô tả + thời gian, sắp xếp theo thời gian gần nhất trước |
| TC-045-13 | Timeline rỗng khi chưa có hoạt động | Edge-Case | Low | Bài KT vừa tạo | 1. Load ActivityTimeline | GET `/activities` trả `{activities: []}` | Hiển thị empty state phù hợp cho khu vực hoạt động gần đây |
| TC-045-14 | Giáo viên không có quyền xem bài kiểm tra | Permission | High | Tài khoản GV khác không có quyền với bài KT id=1 | 1. Đăng nhập GV không có quyền<br>2. Truy cập `/exam/1` | GET `/api/teacher/exams/1` trả 403 | Không hiển thị dữ liệu bài KT, hiển thị thông báo không có quyền truy cập |
| TC-045-15 | Truy cập bài kiểm tra không tồn tại | Error-Handling | High | id không tồn tại trong hệ thống | 1. Truy cập `/exam/99999` | GET `/api/teacher/exams/99999` trả 404 | Hiển thị trang/thông báo lỗi "không tìm thấy bài kiểm tra" |
| TC-045-16 | Lỗi tải dữ liệu chi tiết bài kiểm tra (server lỗi) | Error-Handling | High | Bài KT id=1 tồn tại | 1. Truy cập `/exam/1` trong lúc API trả lỗi 500 | GET trả 500 | Hiển thị thông báo lỗi, không crash trang |
| TC-045-17 | Lỗi tải danh sách kết quả học viên | Error-Handling | Medium | Bài KT id=1 tồn tại | 1. Load trang, API `/results` trả lỗi 500 | GET `/results` trả 500 | StudentResultTable hiển thị thông báo lỗi thay vì bảng rỗng vô nghĩa |
| TC-045-18 | Kết hợp đồng thời tìm kiếm, lọc kết quả và sắp xếp | Functional | Medium | Bảng có nhiều học viên đa dạng | 1. Nhập search "Lan"<br>2. Chọn result=pass<br>3. Chọn sort=score order=desc | GET `/results?search=Lan&result=pass&sort=score&order=desc` | Kết quả trả về thỏa đồng thời cả 3 điều kiện lọc/sắp xếp |
