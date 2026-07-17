# Test Case: Điểm danh (Attendance / EDU-12)

> Route: `/attendance?class_id=`
> Loại test: Smoke test + Functional test (đối chiếu BRD EDU-12)
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Tiền điều kiện
2 lớp học đều chưa có buổi học nào được sinh ra (trạng thái "Nháp").

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi (theo BRD EDU-12) | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào menu "Điểm danh" | Hiển thị danh sách lớp để chọn + khu vực điểm danh | Đúng, mặc định chọn "Lớp Mover 1" | Pass |
| 2 | Xem khu vực điểm danh khi lớp chưa có buổi học | Theo luồng, cần có buổi học (session) trước khi điểm danh (EDU-11 → EDU-12) | Hiển thị đúng thông báo "Lớp học này chưa có buổi học nào" — chặn hợp lý | Pass |
| 3 | Bấm "Đổi lớp", chọn "Lớp Starters 1" | Chuyển ngữ cảnh sang lớp khác | Đúng, URL đổi `class_id=1`, vẫn báo chưa có buổi học | Pass |
| 4 | Kiểm tra chức năng điểm danh offline (mất mạng) | Theo BRD, điểm danh phải hoạt động offline và đồng bộ sau | Không thể test trực tiếp qua UI (cần giả lập mất mạng) — dựa trên rà soát mã nguồn trước đó: không tìm thấy cơ chế offline (localStorage/service worker) | Not tested trực tiếp / Nghi ngờ thiếu (theo review code) |
| 5 | Kiểm tra nút "Xuất báo cáo" | Xuất file báo cáo điểm danh | Nút hiển thị dạng disable (màu xám) khi chưa có dữ liệu — hành vi hợp lý | Pass |

## Ghi chú / Lỗi phát hiện
- Không test được đầy đủ vòng đời điểm danh thật (chọn trạng thái từng học viên, lưu, xem thông báo phụ huynh) do **không có buổi học nào** ở cả 2 lớp trong tài khoản demo — đây là hạn chế của dữ liệu test, không phải lỗi ứng dụng.
- Đề xuất: cần một lớp ở trạng thái "Đang hoạt động"/"ongoing" có ít nhất 1 buổi học "scheduled" hoặc "ongoing" để test đầy đủ chức năng điểm danh (chọn trạng thái, lưu hàng loạt, "Tất cả có mặt", thông báo phụ huynh realtime).
