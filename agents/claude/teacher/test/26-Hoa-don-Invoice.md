# Test Case: Hóa đơn (Invoice)

> Route: `/invoices`
> Loại test: Smoke test + Functional test
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào "Khác" → "Hóa đơn" | Danh sách hóa đơn học viên trong lớp GV dạy + 5 thẻ thống kê + tab trạng thái | Hiển thị đầy đủ giao diện, "Không có hóa đơn phù hợp" (hợp lý, chưa có học viên/enrollment thật) | Pass |
| 2 | Bấm "Tạo hóa đơn" | Mở form tạo hóa đơn mới | **Không có phản ứng gì khi bấm** | Fail — chức năng chưa hoạt động (stub) |

## Ghi chú / Lỗi phát hiện
**Bug xác nhận:** nút "Tạo hóa đơn" không hoạt động, khớp hoàn toàn với phát hiện từ rà soát mã nguồn trước đó (`onClick={() => undefined}`).
