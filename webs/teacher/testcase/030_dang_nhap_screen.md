# Test Case: [030] Đăng nhập

> Module: Teacher | Screen: Đăng nhập | Route: `/auth/login` | Task ID: 030
> Nguồn: `tasks/030_dang_nhap_screen.md` (đặc tả màn hình đã triển khai)

## Tiền điều kiện chung

Người dùng chưa đăng nhập (unauthenticated). Đã có tài khoản Teacher hợp lệ trong hệ thống để test các case thành công.

## Danh sách test case

| TC ID | Tiêu đề | Loại | Ưu tiên | Tiền điều kiện | Các bước thực hiện | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| TC-030-01 | Đăng nhập thành công bằng email | Functional | High | Chưa đăng nhập, tài khoản hợp lệ | 1. Truy cập `/auth/login`<br>2. Nhập email hợp lệ<br>3. Nhập mật khẩu đúng<br>4. Nhấn "Đăng nhập" | identifier=teacher@example.com, password=đúng | Gọi API Device Init → Login → Get Profile thành công, lưu token, redirect `/dashboard` |
| TC-030-02 | Đăng nhập thành công bằng số điện thoại | Functional | High | Chưa đăng nhập, tài khoản hợp lệ | 1. Truy cập `/auth/login`<br>2. Nhập SĐT hợp lệ vào ô identifier<br>3. Nhập mật khẩu đúng<br>4. Nhấn "Đăng nhập" | identifier=0901234567, password=đúng | Redirect `/dashboard` |
| TC-030-03 | Bỏ trống identifier khi submit | UI-Validation | High | — | 1. Để trống ô email/SĐT<br>2. Nhập mật khẩu<br>3. Nhấn "Đăng nhập" | identifier="" | Hiển thị lỗi "Vui lòng nhập email hoặc số điện thoại", không gọi API |
| TC-030-04 | Bỏ trống mật khẩu khi submit | UI-Validation | High | — | 1. Nhập identifier<br>2. Để trống mật khẩu<br>3. Nhấn "Đăng nhập" | password="" | Hiển thị lỗi "Mật khẩu không được để trống" |
| TC-030-05 | Mật khẩu ngắn hơn 6 ký tự | UI-Validation | Medium | — | 1. Nhập identifier hợp lệ<br>2. Nhập mật khẩu 5 ký tự<br>3. Nhấn "Đăng nhập" | password="12345" | Hiển thị lỗi "Mật khẩu tối thiểu 6 ký tự" |
| TC-030-06 | Sai mật khẩu | Error-Handling | High | Tài khoản tồn tại | 1. Nhập identifier đúng<br>2. Nhập mật khẩu sai<br>3. Nhấn "Đăng nhập" | password=sai | API trả 401, Toast "Email hoặc mật khẩu không đúng", nút Đăng nhập được enable lại |
| TC-030-07 | Tài khoản bị khóa | Error-Handling | High | Tài khoản có trạng thái bị khóa | 1. Đăng nhập với tài khoản đã bị khóa | identifier/password đúng nhưng account locked | API trả 403, Toast "Tài khoản đã bị khóa. Vui lòng liên hệ admin" |
| TC-030-08 | Remember me = true lưu token vào localStorage | Functional | Medium | — | 1. Tick "Ghi nhớ đăng nhập"<br>2. Đăng nhập thành công | rememberMe=true | `access_token`, `refresh_token` được lưu trong `localStorage` |
| TC-030-09 | Remember me = false lưu token vào sessionStorage | Functional | Medium | — | 1. Không tick "Ghi nhớ đăng nhập"<br>2. Đăng nhập thành công | rememberMe=false | Token được lưu trong `sessionStorage` thay vì `localStorage` |
| TC-030-10 | Đã đăng nhập truy cập lại trang login | Functional | Medium | Đã đăng nhập | 1. Truy cập `/auth/login` khi đã có session hợp lệ | — | Tự động redirect về `/dashboard`, không hiển thị form login |
| TC-030-11 | Toggle hiển thị/ẩn mật khẩu | UI-Validation | Low | — | 1. Nhập mật khẩu<br>2. Nhấn icon con mắt 👁 | — | `type` input đổi giữa `password` và `text`, icon đổi trạng thái tương ứng |
| TC-030-12 | Submit form bằng phím Enter | UI-Validation | Low | Form đã điền hợp lệ | 1. Điền đầy đủ identifier + password<br>2. Nhấn Enter trong ô input | — | Form được submit giống như bấm nút "Đăng nhập" |
| TC-030-13 | Điều hướng "Quên mật khẩu?" | Functional | Medium | — | 1. Nhấn link "Quên mật khẩu?" | — | Chuyển hướng đến `/auth/forgot-password` |
| TC-030-14 | Điều hướng "Đăng ký ngay" | Functional | Medium | — | 1. Nhấn link "Đăng ký ngay" | — | Chuyển hướng đến `/auth/register` |
| TC-030-15 | Device Init thất bại (mạng không ổn định) | Error-Handling | Medium | Giả lập lỗi mạng khi gọi API device init | 1. Ngắt/giả lập lỗi mạng<br>2. Nhấn "Đăng nhập" | — | Toast "Không thể kết nối. Vui lòng thử lại", KHÔNG gọi tiếp API Login |
| TC-030-16 | Lỗi server 5xx khi gọi API Login | Error-Handling | Medium | Giả lập lỗi server | 1. Đăng nhập trong lúc backend trả lỗi 5xx | — | Toast "Lỗi kết nối. Vui lòng thử lại", nút Đăng nhập được enable lại |
| TC-030-17 | Timeout khi gọi API | Error-Handling | Low | Giả lập request timeout | 1. Đăng nhập trong điều kiện mạng rất chậm/timeout | — | Toast "Yêu cầu hết thời gian. Vui lòng thử lại" |
| TC-030-18 | Trạng thái loading khi đang gọi API | UI-Validation | Medium | — | 1. Nhấn "Đăng nhập" với dữ liệu hợp lệ<br>2. Quan sát UI trong lúc chờ phản hồi | — | Nút hiển thị spinner + disabled, toàn bộ input bị disabled, không cho submit lại |
| TC-030-19 | Đăng nhập qua Google | Functional | Low | Có tài khoản Google liên kết hoặc hợp lệ | 1. Nhấn nút "Google" | — | Redirect sang luồng OAuth của Google |
| TC-030-20 | Đăng nhập qua Microsoft | Functional | Low | Có tài khoản Microsoft liên kết hoặc hợp lệ | 1. Nhấn nút "Microsoft" | — | Redirect sang luồng OAuth của Microsoft |
| TC-030-21 | Giao diện responsive trên mobile | UI-Validation | Low | Viewport < 768px | 1. Thu nhỏ trình duyệt xuống kích thước mobile<br>2. Quan sát layout | — | Ẩn panel trái marketing, form hiển thị full-width, padding 16px |
| TC-030-22 | Token hết hạn khi đang dùng app | Edge-Case | Medium | Đã đăng nhập, token hết hạn | 1. Chờ/giả lập access_token hết hạn<br>2. Thực hiện 1 thao tác cần gọi API | — | Hệ thống redirect người dùng về `/auth/login` |
