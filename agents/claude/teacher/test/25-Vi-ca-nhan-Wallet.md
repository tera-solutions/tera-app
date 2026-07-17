# Test Case: Ví cá nhân (Wallet / Deposit / Withdraw)

> Route: `/wallet`, `/wallet/deposit`, `/wallet/withdraw`
> Loại test: Smoke test + Functional test
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào "Khác" → "Ví cá nhân" | Số dư, tổng nạp/rút, biểu đồ giao dịch, tài khoản ngân hàng liên kết, lịch sử giao dịch | Hiển thị đầy đủ giao diện, số liệu = 0/rỗng (hợp lý, ví mới) | Pass |
| 2 | Bấm "Nạp tiền" | Mở màn hình nạp tiền, chọn số tiền + phương thức | Đúng, mở `/wallet/deposit`, đủ 5 phương thức (MoMo/ZaloPay/thẻ NH/chuyển khoản/thẻ quốc tế) | Pass (giao diện) |
| 3 | Quan sát nút "Nạp tiền ngay" | Cho phép hoàn tất giao dịch nạp | **Bị khóa (disabled)**, kèm dòng chữ rõ ràng "Chờ tích hợp cổng thanh toán" | Blocked — có chủ đích, thông báo rõ ràng (điểm cộng UX) |
| 4 | Bấm "Rút tiền" từ trang Ví | Mở màn hình rút tiền | Đúng, mở `/wallet/withdraw` | Pass (giao diện) |
| 5 | Quan sát nút "Rút tiền" ở màn hình rút tiền | Cho phép hoàn tất giao dịch rút | **Bị khóa (disabled)**, kèm dòng chữ rõ ràng "Chờ backend hỗ trợ rút tiền" | Blocked — có chủ đích, thông báo rõ ràng (điểm cộng UX) |

## Ghi chú / Lỗi phát hiện
Không phải lỗi — đây là tính năng đang chờ tích hợp, và ứng dụng đã xử lý tốt bằng cách khóa nút + ghi rõ lý do thay vì để nút hoạt động sai hoặc im lặng thất bại. Đây là ví dụ tốt về cách xử lý tính năng chưa hoàn thiện, nên áp dụng cách làm tương tự cho các nút stub khác đang phát hiện ở những trang khác (VD: "Tạo hóa đơn", "Tải bảng lương PDF", "Tạo thư mục" hiện không phản hồi gì khi bấm).
