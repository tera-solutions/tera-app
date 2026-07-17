# Test Case: [047] Bảng xếp hạng học tập

> Module: Teacher | Screen: Bảng xếp hạng học tập | Route: `/ranking` | Task ID: 047
> Nguồn: `tasks/047_bang_xep_hang_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Người dùng đã đăng nhập với tài khoản giáo viên. API base: `https://api.anhnguhana.com/api`.

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-047-01 | Load trang Bảng xếp hạng thành công | Functional | High | Đã đăng nhập | 1. Truy cập `/ranking`<br>2. Chờ trang tải xong | GET `/api/teacher/ranking?month=2025-05&tab=overall` trả 200 | Hiển thị RankingStatRow (44 HV, ĐTB 8.25, 26 lớp, điểm danh TB 0.75) và RankingTable với danh sách xếp hạng |
| TC-047-02 | Top3Cards hiển thị đúng 3 card nổi bật | Functional | High | Đã load trang | 1. Quan sát panel phải "Top 3" | top3: rank 1 Nguyễn Minh An 9.8, rank 2 Lan Anh 9.5, rank 3 Tuấn 9.2 | Hiển thị 3 card với avatar lớn, tên, điểm số, huy hiệu vị trí đúng thứ hạng |
| TC-047-03 | Badge xếp loại hiển thị đúng màu theo rank_label | UI-Validation | Medium | Dữ liệu HV có rank_label khác nhau (Xuất sắc/Giỏi/Khá/TB) | 1. Quan sát cột "Xếp loại" trong RankingTable | rank_label = "Xuất sắc" | Badge hiển thị đúng nhãn và màu tương ứng với từng loại xếp hạng |
| TC-047-04 | Top 3 trong RankingTable được highlight đặc biệt | UI-Validation | Medium | Bảng có ít nhất 3 học viên | 1. Quan sát 3 dòng đầu bảng xếp hạng | rank 1,2,3 | 3 dòng đầu được highlight màu vàng/bạc/đồng tương ứng thứ hạng |
| TC-047-05 | Sparkline tiến bộ hiển thị đúng dữ liệu từng học viên | Functional | Medium | Học viên có mảng progress | 1. Quan sát cột "Tiến bộ" của một học viên | progress: [8.5, 9.0, 9.5, 9.8] | Mini sparkline chart vẽ đúng xu hướng tăng/giảm theo mảng progress |
| TC-047-06 | Đổi bộ lọc tháng cập nhật toàn bộ bảng | Functional | High | Đã load trang với month=2025-05 | 1. Chọn tháng khác trong MonthFilter, ví dụ 2025-04 | GET `/ranking?month=2025-04` | Toàn bộ RankingStatRow, Top3Cards, RankingTable, ScoreHistogram cập nhật theo dữ liệu tháng mới |
| TC-047-07 | Click tab "Tiến lớp" hiển thị học viên tiến bộ nhiều nhất | Functional | High | Đã load trang | 1. Click tab "Tiến lớp" | GET `/ranking?tab=progress` | Hiển thị bảng với cột Tên, Điểm kỳ trước, Điểm kỳ này, % tăng, sắp xếp theo % tăng giảm dần |
| TC-047-08 | Click tab "Chọn nhóm" tạo nhóm so sánh tùy chỉnh | Functional | Medium | Đã load trang | 1. Click tab "Chọn nhóm"<br>2. Chọn một số học viên vào nhóm<br>3. Xác nhận tạo nhóm | GET `/ranking?tab=group` | Hiển thị bảng xếp hạng chỉ giới hạn trong nhóm học viên đã chọn |
| TC-047-09 | Click tab "Đánh giá" | Functional | Medium | Đã load trang | 1. Click tab "Đánh giá" | GET `/ranking?tab=evaluation` | Tab được kích hoạt (active), nội dung tab "Đánh giá" hiển thị không lỗi |
| TC-047-10 | ScoreHistogram render đúng phân bố điểm | Functional | Medium | Đã load trang | 1. Quan sát khu vực "Thống kê điểm" | score_distribution: {0_4:0, 5_6:3, 7_8:20, 9_10:21} | Bar chart hiển thị đúng số học viên theo từng dải điểm 0-4, 5-6, 7-8, 9-10 |
| TC-047-11 | Scroll để load thêm dữ liệu (infinite scroll/phân trang) | Functional | Medium | Tổng số HV (44) vượt quá limit trang đầu (50 nhưng meta.total kiểm chứng) | 1. Cuộn xuống cuối RankingTable | GET `/ranking?page=2&limit=50` | Tải thêm dữ liệu học viên tiếp theo và nối vào bảng hiện tại, không trùng lặp |
| TC-047-12 | Chưa đăng nhập truy cập trang Bảng xếp hạng | Permission | High | Chưa đăng nhập / token hết hạn | 1. Truy cập `/ranking` khi chưa đăng nhập | — | Hệ thống điều hướng (redirect) về trang đăng nhập |
| TC-047-13 | Lỗi tải dữ liệu bảng xếp hạng (server lỗi) | Error-Handling | High | Đã đăng nhập | 1. Truy cập `/ranking` trong lúc API trả lỗi 500 | GET trả 500 | Hiển thị thông báo lỗi tải dữ liệu, không crash trang |
| TC-047-14 | Không có học viên nào trong tháng được chọn | Edge-Case | Medium | Tháng lọc chưa có dữ liệu xếp hạng | 1. Chọn tháng chưa có dữ liệu | GET `/ranking?month=2020-01` trả `{data: [], top3: [], meta:{total:0}}` | Hiển thị empty state cho RankingTable và Top3Cards, RankingStatRow hiển thị 0 |
| TC-047-15 | Chọn nhóm không có học viên nào được chọn | UI-Validation | Low | Đang ở tab "Chọn nhóm" | 1. Không chọn học viên nào<br>2. Bấm xác nhận tạo nhóm | — | Hệ thống không cho tạo nhóm rỗng hoặc hiển thị thông báo yêu cầu chọn ít nhất 1 học viên |
| TC-047-16 | Tổng học viên (RankingStatRow) khớp với meta.total | Functional | Low | Đã load trang | 1. So sánh giá trị card "Tổng HV" với meta.total trong response | summary.total_students=44, meta.total=44 | Giá trị hiển thị trên card khớp với dữ liệu trả về từ API |
