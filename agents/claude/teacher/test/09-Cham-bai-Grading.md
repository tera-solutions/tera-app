# Test Case: Chấm bài (Grading / EDU-15)

> Route: `/grading/:id`
> Loại test: Smoke test + Functional test (đối chiếu BRD EDU-15)
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Tiền điều kiện
Bài tập "test" (ASG000002) chưa có học viên nào nộp bài.

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi (BRD EDU-15) | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Mở `/grading/2` | Màn hình 3 cột: xem bài nộp / chấm bài / danh sách học viên | Đúng cấu trúc 3 cột, đều hiển thị "Chưa có học viên nộp bài" / "Chọn một học viên..." hợp lý | Pass |
| 2 | Kiểm tra thang điểm | BRD yêu cầu hỗ trợ đa dạng: số 0-10/chữ A-D/sao 1-5 | Không thể xác nhận do chưa có bài nộp để mở form chấm; theo review code trước đó chỉ có 1 thang điểm số 0-max | Not confirmed trực tiếp |
| 3 | Kiểm tra annotate ảnh, ghi âm nhận xét, chấm hàng loạt | Theo BRD FR-02/FR-04 | Không thể test do không có bài nộp; theo review code: không có các tính năng này | Not confirmed trực tiếp (nghi thiếu theo code) |

## Ghi chú / Lỗi phát hiện
Không test được sâu do thiếu dữ liệu bài nộp thật (0 học viên nộp bài trong toàn bộ tài khoản demo). Đây là hạn chế dữ liệu test, cần một bài tập có ít nhất 1 học viên đã nộp (kèm ảnh/audio) để kiểm chứng đầy đủ các gap đã nêu trong báo cáo review mã nguồn trước đó (thiếu annotate, ghi âm, chấm hàng loạt, đa thang điểm).
