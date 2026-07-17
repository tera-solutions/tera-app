# Test Case: [060] Đăng ký

> Module: Teacher | Screen: Đăng ký | Route: `/auth/register` | Task ID: 060
> Nguồn: `tasks/060_dang_ky_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Người dùng chưa đăng nhập truy cập `/auth/register`. Layout UnAuthLayout với form đăng ký 3 bước (Thông tin cá nhân, Thông tin trường học, Hồ sơ). API base: `https://api.anhnguhana.com/api`.

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-060-01 | Đăng ký thành công với đầy đủ 3 bước | Functional | High | Chưa đăng nhập, truy cập /auth/register | 1. Điền đầy đủ và hợp lệ Bước 1<br>2. Nhấn Tiếp tục<br>3. Điền Bước 2<br>4. Nhấn Tiếp tục<br>5. Điền Bước 3<br>6. Nhấn Hoàn tất | name=Nguyễn Văn A, email=teacher@example.com, phone=0901234567, dob=1990-01-15, password=password123 | Gọi API Device Init rồi POST /api/auth/register trả 201; hiển thị toast "Đăng ký thành công"; redirect về /auth/login |
| TC-060-02 | Đã đăng nhập truy cập /auth/register | Permission | High | Đã đăng nhập | 1. Truy cập URL /auth/register khi đang có session hợp lệ | N/A | Redirect tự động về /dashboard, không hiển thị form đăng ký |
| TC-060-03 | Nhấn Tiếp tục khi Bước 1 để trống toàn bộ | UI-Validation | High | Ở Bước 1, chưa nhập gì | 1. Không nhập field nào<br>2. Nhấn Tiếp tục | Tất cả field rỗng | Hiển thị lỗi từng field: "Vui lòng nhập họ và tên", "Vui lòng chọn giới tính", "Vui lòng nhập email", "Vui lòng nhập số điện thoại", "Vui lòng chọn ngày sinh", "Mật khẩu không được để trống"; không chuyển bước |
| TC-060-04 | Họ tên ít hơn 2 ký tự | UI-Validation | Medium | Ở Bước 1 | 1. Nhập tên "A" vào field Họ và tên<br>2. Điền các field khác hợp lệ<br>3. Nhấn Tiếp tục | name=A | Lỗi "Họ và tên tối thiểu 2 ký tự"; không chuyển bước |
| TC-060-05 | Email sai định dạng | UI-Validation | High | Ở Bước 1 | 1. Nhập email không hợp lệ<br>2. Điền các field khác hợp lệ<br>3. Nhấn Tiếp tục | email=abc@ | Lỗi "Email không hợp lệ"; không chuyển bước |
| TC-060-06 | Số điện thoại sai định dạng | UI-Validation | High | Ở Bước 1 | 1. Nhập SĐT không hợp lệ (không đủ 10 số hoặc không bắt đầu bằng 0)<br>2. Nhấn Tiếp tục | phone=12345 | Lỗi "Số điện thoại không hợp lệ"; không chuyển bước |
| TC-060-07 | Ngày sinh là ngày trong tương lai | UI-Validation | Medium | Ở Bước 1 | 1. Chọn ngày sinh sau ngày hiện tại<br>2. Nhấn Tiếp tục | dob=2099-01-01 | Hiển thị lỗi ngày sinh không hợp lệ (không được là ngày tương lai); không chuyển bước |
| TC-060-08 | Mật khẩu ít hơn 8 ký tự | UI-Validation | High | Ở Bước 1 | 1. Nhập mật khẩu 7 ký tự<br>2. Nhấn Tiếp tục | password=1234567 | Lỗi "Mật khẩu tối thiểu 8 ký tự"; không chuyển bước |
| TC-060-09 | Xác nhận mật khẩu không khớp | UI-Validation | High | Ở Bước 1 | 1. Nhập password=password123<br>2. Nhập confirmPassword=password124<br>3. Nhấn Tiếp tục | password=password123, confirmPassword=password124 | Lỗi "Mật khẩu xác nhận không khớp"; không chuyển bước |
| TC-060-10 | Chưa tích chọn điều khoản | UI-Validation | High | Ở Bước 1, các field khác hợp lệ | 1. Không tích checkbox điều khoản<br>2. Nhấn Tiếp tục | terms=false | Lỗi "Vui lòng đồng ý với điều khoản"; không chuyển bước |
| TC-060-11 | Bước 2 chỉ có field bắt buộc school | Functional | Medium | Đã hoàn thành Bước 1, ở Bước 2 | 1. Chỉ nhập Tên trường/Trung tâm<br>2. Để trống position, experience, subject<br>3. Nhấn Tiếp tục | school=Trung tâm Hana Edu | Chuyển sang Bước 3 thành công vì position/experience/subject không bắt buộc |
| TC-060-12 | Bước 3: upload avatar vượt quá 5MB | UI-Validation | Medium | Ở Bước 3 | 1. Chọn file ảnh > 5MB làm avatar<br>2. Quan sát thông báo lỗi | file avatar 6MB | Lỗi "Ảnh không được vượt quá 5MB"; không cho upload |
| TC-060-13 | Bước 3: bio vượt quá 500 ký tự | UI-Validation | Low | Ở Bước 3 | 1. Nhập nội dung bio dài hơn 500 ký tự vào textarea Giới thiệu bản thân | bio = chuỗi 600 ký tự | Không cho nhập quá 500 ký tự hoặc hiển thị lỗi giới hạn ký tự |
| TC-060-14 | Bỏ qua Bước 3 (các trường optional) vẫn đăng ký thành công | Functional | Medium | Đã hoàn thành Bước 1, 2, ở Bước 3 | 1. Không chọn avatar/certificate, không nhập bio<br>2. Nhấn Hoàn tất | N/A | Gọi API Register thành công (201), không upload avatar; redirect /auth/login |
| TC-060-15 | Email đã tồn tại khi submit | Error-Handling | High | Đã hoàn thành 3 bước với email đã được đăng ký trước đó | 1. Nhấn Hoàn tất ở Bước 3 | email=existing@example.com | API trả 422 với errors.email=["Email đã được sử dụng"]; hiển thị lỗi inline tại field email, ở lại Bước 1 hoặc bước hiện tại |
| TC-060-16 | Số điện thoại đã đăng ký khi submit | Error-Handling | High | Đã hoàn thành 3 bước với SĐT đã được đăng ký trước đó | 1. Nhấn Hoàn tất ở Bước 3 | phone=0901234567 (đã tồn tại) | API trả 422 với errors.phone=["Số điện thoại đã được đăng ký"]; hiển thị lỗi inline tại field phone |
| TC-060-17 | Tài khoản đã tồn tại (409 Duplicate) | Error-Handling | Medium | Submit trùng tài khoản đã tồn tại | 1. Nhấn Hoàn tất | N/A | API trả 409 message "Tài khoản đã tồn tại"; hiển thị lỗi cho người dùng, không redirect |
| TC-060-18 | Device init thất bại | Error-Handling | Medium | Server API Device Init trả lỗi | 1. Nhấn Hoàn tất ở Bước 3 khi API device/init lỗi | N/A | Toast error "Không thể kết nối. Vui lòng thử lại"; nút Hoàn tất trở lại trạng thái enable |
| TC-060-19 | Lỗi server 5xx khi gọi API Register | Error-Handling | Medium | API Register trả lỗi 5xx | 1. Nhấn Hoàn tất | N/A | Toast error "Lỗi kết nối. Vui lòng thử lại"; enable lại nút Hoàn tất, dữ liệu form được giữ nguyên |
| TC-060-20 | Quay lại bước trước giữ nguyên dữ liệu | Functional | Medium | Đang ở Bước 2 hoặc 3 | 1. Nhấn nút Quay lại<br>2. Kiểm tra dữ liệu đã nhập ở bước trước | N/A | Quay về bước trước, các field vẫn giữ nguyên giá trị đã nhập |
| TC-060-21 | Click vào step đã hoàn thành để chỉnh sửa | Functional | Medium | Đã hoàn thành Bước 1 và 2, đang ở Bước 3 | 1. Click vào StepIndicator của Bước 1 | N/A | Quay về Bước 1, dữ liệu vẫn được giữ, có thể chỉnh sửa |
| TC-060-22 | Chuyển sang trang Đăng nhập | Functional | Medium | Đang ở form đăng ký | 1. Nhấn link "Đã có tài khoản? Đăng nhập" | N/A | Điều hướng đến /auth/login |