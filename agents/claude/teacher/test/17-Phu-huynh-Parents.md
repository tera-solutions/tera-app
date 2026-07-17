# Test Case: Phụ huynh (Parents / EDU-02)

> Route: `/parents`
> Loại test: Smoke test + Functional test (đối chiếu BRD EDU-02)
> Ngày test: 2026-07-17 | Tài khoản: demo1@terasolutions.vn (role Teacher)

## Các bước test & kết quả

| # | Bước | Kết quả mong đợi (BRD EDU-02) | Kết quả thực tế | Trạng thái |
|---|------|------|------|------|
| 1 | Vào "Khác" → "Phụ huynh" | Danh sách phụ huynh + 3 thẻ thống kê + filter theo lớp | Đúng cấu trúc | Pass |
| 2 | Quan sát dữ liệu | Theo BR-02 EDU-01/EDU-02, học viên phải có ≥1 phụ huynh liên kết trước khi ghi danh | "Không có phụ huynh phù hợp" (0 phụ huynh) — dù có 4 học viên trạng thái "studying" | Fail — vi phạm business rule (học viên "studying" nhưng không có phụ huynh liên kết) |

## Ghi chú / Lỗi phát hiện
**Bug xác nhận (mức cao):** 0 phụ huynh tồn tại trong hệ thống trong khi có 4 học viên đã ở trạng thái "studying" — vi phạm trực tiếp BR-02 của EDU-01 ("Học viên phải có ít nhất 1 phụ huynh liên kết trước khi ghi danh vào lớp"). Đây là bằng chứng thêm cho thấy dữ liệu demo có vấn đề nhất quán ở tầng enrollment/liên kết, nhất quán với các phát hiện ở file `03-Lop-hoc-Classroom.md` và `13-Hoc-vien-Students.md`.
