# Test Case: [049] Hồ sơ cá nhân

> Module: Teacher | Screen: Hồ sơ cá nhân | Route: `/profile` | Task ID: 049
> Nguồn: `tasks/049_ho_so_ca_nhan_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Người dùng đã đăng nhập với tài khoản giáo viên. API base: `https://api.anhnguhana.com/api`.

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-049-01 | Load trang Hồ sơ cá nhân thành công | Functional | High | Đã đăng nhập | 1. Truy cập `/profile`<br>2. Chờ trang tải xong | GET `/api/teacher/profile` trả 200 | Hiển thị đủ AccountInfoCard (avatar, tên "Cô Ngọc", trạng thái Online, email, ngày sinh, giới tính, địa chỉ, SĐT), TeacherProfileTable, WorkScheduleCalendar, AcademicProfile, AccountSidebar, TeachScheduleCalendar |
| TC-049-02 | Click "Chỉnh sửa thông tin" chuyển sang edit mode | Functional | High | Đã load trang | 1. Click nút "Chỉnh sửa thông tin" | — | Hiển thị ProfileEditForm với các trường avatar, full_name, dob, gender, address, phone, profileStore.setEditMode(true) |
| TC-049-03 | Lưu thông tin hợp lệ thành công | Functional | High | Đang ở edit mode | 1. Nhập đầy đủ thông tin hợp lệ: full_name="Cô Ngọc", dob="1990-03-15", gender="female", address="TP. Hồ Chí Minh", phone="0901234567"<br>2. Click Lưu | PUT `/api/teacher/profile` trả 200 `{success:true, message:"Cập nhật thành công"}` | Hiển thị toast "Cập nhật thành công", thoát edit mode, thông tin trên AccountInfoCard cập nhật đúng |
| TC-049-04 | Bỏ trống họ tên khi lưu | UI-Validation | High | Đang ở edit mode | 1. Xóa trống trường "Họ tên"<br>2. Click Lưu | full_name = "" | Hiển thị lỗi validation "Vui lòng nhập họ tên", không gọi API PUT |
| TC-049-05 | Nhập họ tên chỉ 1 ký tự | UI-Validation | High | Đang ở edit mode | 1. Nhập full_name = "A"<br>2. Click Lưu | full_name = "A" (< 2 ký tự) | Hiển thị lỗi validation "Vui lòng nhập họ tên" (không thỏa min 2 ký tự), không gọi API PUT |
| TC-049-06 | Nhập số điện thoại không hợp lệ | UI-Validation | High | Đang ở edit mode | 1. Nhập phone = "12345"<br>2. Click Lưu | phone = "12345" | Hiển thị lỗi validation "Số điện thoại không hợp lệ", không gọi API PUT |
| TC-049-07 | Nhập số điện thoại hợp lệ | Functional | Medium | Đang ở edit mode | 1. Nhập phone = "0901234567"<br>2. Click Lưu | phone = "0901234567" | Không có lỗi validation, gọi API PUT thành công |
| TC-049-08 | Upload avatar hợp lệ | Functional | High | Đang ở AccountInfoCard hoặc edit mode | 1. Click chọn ảnh đại diện<br>2. Chọn file avatar.png dung lượng 2MB | POST `/api/teacher/profile/avatar` multipart avatar=avatar.png trả 200 `{avatar_url:"https://..."}` | Preview ảnh mới hiển thị ngay lập tức, avatar được lưu, profileStore.setUploading(false) |
| TC-049-09 | Upload avatar vượt quá 5MB | UI-Validation | High | Đang thao tác upload avatar | 1. Chọn file avatar 8MB | avatar file size = 8MB | Hiển thị lỗi "Ảnh quá lớn hoặc định dạng không hỗ trợ", không gọi API upload |
| TC-049-10 | Upload avatar sai định dạng | UI-Validation | High | Đang thao tác upload avatar | 1. Chọn file avatar.gif hoặc avatar.bmp | avatar file type không phải jpg/png | Hiển thị lỗi "Ảnh quá lớn hoặc định dạng không hỗ trợ", không gọi API upload |
| TC-049-11 | Upload file học thuật hợp lệ | Functional | High | Đang ở khu vực AcademicProfile | 1. Click nút Upload<br>2. Chọn file CV.pdf 3MB, label="CV" | POST `/api/teacher/profile/academic-files` multipart file=CV.pdf&label=CV trả 201 `{id:5, name:"CV.pdf", url:"https://..."}` | File mới hiển thị trong danh sách hồ sơ học thuật |
| TC-049-12 | Upload file học thuật vượt quá 10MB | UI-Validation | High | Đang ở khu vực AcademicProfile | 1. Chọn file 15MB | academic file size = 15MB | Hiển thị lỗi "File không hỗ trợ hoặc quá lớn", không gọi API upload |
| TC-049-13 | Upload file học thuật sai định dạng | UI-Validation | High | Đang ở khu vực AcademicProfile | 1. Chọn file .exe hoặc .zip | academic file type không phải pdf/doc/jpg | Hiển thị lỗi "File không hỗ trợ hoặc quá lớn", không gọi API upload |
| TC-049-14 | Click "Đổi mật khẩu" | Functional | Medium | Đã load trang | 1. Click link "Đổi mật khẩu" trong AccountSidebar | — | Điều hướng sang màn hình đổi mật khẩu |
| TC-049-15 | Click "Cập nhật email" | Functional | Medium | Đã load trang | 1. Click link "Cập nhật email" trong AccountSidebar | — | Điều hướng sang màn hình cập nhật email |
| TC-049-16 | Click "Xác thực 2 lớp (2FA)" | Functional | Medium | Đã load trang | 1. Click link "Xác thực 2 lớp" trong AccountSidebar | — | Điều hướng sang màn hình cài đặt xác thực 2 lớp |
| TC-049-17 | Click "Đăng xuất" | Functional | High | Đã load trang | 1. Click link "Đăng xuất" trong AccountSidebar<br>2. Xác nhận trong hộp thoại confirm | — | Hiển thị hộp thoại xác nhận, sau khi xác nhận thì đăng xuất và điều hướng về trang đăng nhập |
| TC-049-18 | Lịch dạy học (TeachScheduleCalendar) hiển thị đúng ngày có lịch | Functional | Medium | GV có lịch dạy trong tháng | 1. Quan sát mini calendar "Lịch dạy học" | GET `/api/teacher/profile/schedule?month=2025-05` trả `{schedule:[{date:"2025-05-20", sessions:["08:00-09:30","14:00-15:30"]}]}` | Ngày 20/05/2025 được đánh dấu có lịch dạy trên calendar |
| TC-049-19 | Click vào ngày có lịch dạy xem chi tiết buổi dạy | Functional | Medium | Calendar có ngày được đánh dấu | 1. Click vào ngày 20/05/2025 trên TeachScheduleCalendar | date = "2025-05-20" | Hiển thị danh sách buổi dạy trong ngày đó (08:00-09:30, 14:00-15:30) |
| TC-049-20 | Lỗi khi lưu cập nhật hồ sơ (server lỗi) | Error-Handling | High | Đang ở edit mode, dữ liệu hợp lệ | 1. Nhập thông tin hợp lệ<br>2. Click Lưu trong lúc API PUT trả lỗi 500 | PUT trả 500 | Hiển thị thông báo lỗi, vẫn ở edit mode, dữ liệu chưa được cập nhật trên AccountInfoCard |
| TC-049-21 | Lỗi tải dữ liệu hồ sơ cá nhân (server lỗi) | Error-Handling | High | Đã đăng nhập | 1. Truy cập `/profile` trong lúc API GET `/profile` trả lỗi 500 | GET trả 500 | Hiển thị thông báo lỗi tải dữ liệu, không crash trang |
| TC-049-22 | Chưa đăng nhập truy cập trang Hồ sơ cá nhân | Permission | High | Chưa đăng nhập / token hết hạn | 1. Truy cập `/profile` khi chưa đăng nhập | — | Hệ thống điều hướng (redirect) về trang đăng nhập |
