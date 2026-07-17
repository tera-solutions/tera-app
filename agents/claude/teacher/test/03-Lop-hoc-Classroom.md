# Test Case: Lớp học (Classroom → tương đương EDU-08 Class trong BRD)

> Route: `/classroom`, chi tiết `/classroom/:id`
> Loại test: Smoke test + Functional test (đối chiếu BRD EDU-08)
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)
> Lưu ý thuật ngữ: trong code, "Classroom" = lớp học (BRD gọi là "Class"/EDU-08); phòng học vật lý nằm ở trang riêng "Phòng học" (`/rooms`, tương đương EDU-06 "Classroom" trong BRD). Xem ghi chú ở file `19-Phong-hoc-Room.md`.

## Tiền điều kiện
Đã đăng nhập.

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi (theo BRD EDU-08) | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào menu "Lớp học" | Danh sách lớp + 4 thẻ thống kê + filter + tab trạng thái | Đúng: hiển thị "2 Lớp chủ nhiệm", filter khóa học/ca học/ngày khai giảng, tab Tất cả/Nháp/Sắp khai giảng/Đang hoạt động/Tạm ngưng/Đã kết thúc | Pass |
| 2 | Quan sát 2 lớp trong danh sách | Card lớp hiển thị mã lớp, sĩ số x/max, giáo viên, lịch học | Cả 2 lớp đều status "Nháp", sĩ số hiển thị "0/20" | Pass (hiển thị đúng dữ liệu) |
| 3 | Mở chi tiết "Lớp Mover 1" | Trang chi tiết với header info + 6-7 tab (học viên/điểm danh/lịch học/bài tập/điểm số/nhận xét/tài liệu) | Đúng đủ tab. Header hiển thị: Giáo viên "—", Phòng học "—", Giáo án "—", Sĩ số 0/20 | Pass (cấu trúc), nhưng dữ liệu thiếu liên kết (xem mục lỗi) |
| 4 | Xem tab "Bài tập" trong chi tiết lớp | Danh sách bài tập của lớp | Hiển thị đúng 1 bài "test", trạng thái Soạn thảo, hạn 21/07/2026 | Pass |
| 5 | Tìm nút/luồng thiết lập lịch tuần khi tạo lớp mới (wizard) | Theo BRD EDU-08 FR-02 + EDU-10, wizard tạo lớp phải có bước chọn slot lịch tuần | Chưa test luồng tạo lớp mới đầy đủ (rủi ro tạo dữ liệu rác trên môi trường thật) — cần xác nhận thêm ở lượt test sau | Not tested |
| 6 | Đối chiếu "Sĩ số 0/20 học viên" của lớp với dữ liệu ở trang "Học viên" (4 học viên trạng thái "studying") | Học viên trạng thái studying phải thuộc về 1 lớp cụ thể (theo BR-04 EDU-01 + BR EDU-09) | **Không khớp**: có 4 học viên status "studying" nhưng không lớp nào hiển thị họ trong sĩ số (cả 2 lớp đều 0/20) | Fail — lỗi dữ liệu/liên kết enrollment |

## Ghi chú / Lỗi phát hiện
- **Bug nghi vấn (mức độ cao):** 4 học viên có trạng thái "studying" (Bé An, Bé Bình, Bé Chi, Bé Dũng) nhưng không được liên kết với bất kỳ lớp nào — cả "Lớp Mover 1" và "Lớp Starters 1" đều hiển thị 0/20 học viên. Theo BR-04 (EDU-01) trạng thái "studying" chỉ nên có sau khi ghi danh vào lớp (EDU-09). Cần kiểm tra lại dữ liệu enrollment hoặc API trả sĩ số lớp.
- Header lớp thiếu liên kết Giáo viên/Phòng học/Giáo án dù đã có UI hiển thị — có thể do lớp đang "Nháp" nên các trường này chưa được gán, hoặc do chính tài khoản demo chưa có hồ sơ giáo viên (xem file `28-Cai-dat-Settings.md`, mục "Hồ sơ giảng dạy" trống).
- Không phát hiện lỗi console/crash khi thao tác.
