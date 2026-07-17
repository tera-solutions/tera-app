# Test Case: Nhận xét & Đánh giá (Evaluation)

> Route: `/evaluation`
> Loại test: Smoke test + Functional test
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào menu "Đánh giá" | Danh sách học viên + thẻ thống kê | Đúng, hiển thị đủ 4 học viên (Bé An, Bé Bình, Bé Chi, Bé Dũng) | Pass |
| 2 | Chọn học viên "Bé An" | Panel chi tiết bên phải: điểm TB, xếp hạng, xếp loại, kỹ năng 4 nhóm (Nghe/Nói/Đọc/Viết), nhận xét | Đúng đủ, tất cả = 0.0/chưa có nhận xét (hợp lý vì chưa từng đánh giá) | Pass |
| 3 | Kiểm tra tab "Đánh giá chi tiết" | Form nhập 9 tiêu chí (kiến thức, phát âm, từ vựng, ngữ pháp, giao tiếp, chuyên cần, tương tác, kỷ luật, bài tập), mỗi tiêu chí 1-5 điểm | Chưa click sâu vào tab (out of scope smoke), nhưng cấu trúc tab tồn tại | Not tested sâu |
| 4 | Đối chiếu 4 học viên ở đây với sĩ số lớp (0/20 mỗi lớp) | Học viên đánh giá được phải thuộc lớp GV phụ trách | Không khớp — cùng vấn đề dữ liệu đã ghi nhận ở file `03-Lop-hoc-Classroom.md`: 4 học viên "studying" nhưng không lớp nào hiển thị sĩ số > 0 | Fail — liên quan bug dữ liệu enrollment |

## Ghi chú / Lỗi phát hiện
Chức năng hoạt động đúng về mặt giao diện. Vấn đề cốt lõi là dữ liệu liên kết học viên–lớp học không nhất quán trên toàn hệ thống (xem thêm file thống kê tổng hợp).
