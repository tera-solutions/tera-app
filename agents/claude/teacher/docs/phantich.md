# Báo cáo đối chiếu tính nhất quán — Module Education (Hana Edu)

> Phạm vi: đối chiếu chéo 4 loại tài liệu cho 18 chức năng EDU-01 → EDU-18:
> `BRD - Education.md`, `SRS/SRS-EDU-xx.md`, `UseCase/UC-EDU-xx.md`, `ScreenSpec/SCR-EDU-xx.md`
>
> Ngày kiểm tra: 2026-07-17

---

## 1. Tóm tắt

Tài liệu nhìn chung khá đầy đủ và có cấu trúc thống nhất (mỗi chức năng đều theo đúng 20 mục chuẩn BA). Tuy nhiên rà soát chéo phát hiện một số nhóm vấn đề lặp lại nhiều lần, đáng chú ý nhất là:

1. **Bảng Permissions trong BRD nhiều nơi mâu thuẫn với chính phần Actors/Business Rules của BRD**, và SRS/UseCase/ScreenSpec đều đi theo hướng "đúng" hơn — tức là BRD gốc có lỗi soạn thảo cần sửa lại cho khớp.
2. **Đặt tên field/enum lệch giữa BRD và SRS** ở nhiều bảng dữ liệu (Score, Certificate) — cùng một khái niệm nhưng gọi tên khác nhau.
3. **ScreenSpec chưa phủ hết**: 3 chức năng cuối (EDU-16 Examination, EDU-17 Score, EDU-18 Certificate) hoàn toàn chưa có đặc tả màn hình dù BRD mô tả UI khá phức tạp cho cả ba.
4. Một vài **state machine (workflow)** được vẽ khác nhau giữa sơ đồ trong BRD và mô tả chi tiết trong SRS (đường chuyển trạng thái thiếu hoặc sai hướng).

---

## 2. Danh sách mâu thuẫn/thiếu sót theo chức năng

### EDU-01 Student
- Độ tuổi học viên không nhất quán: mô tả nghiệp vụ ghi "4–10 tuổi" (BRD tổng quan, SRS thuật ngữ) nhưng Validation Rules/UseCase/ScreenSpec đều quy định 3–16 tuổi.
- Trạng thái `dropped` bị gọi là "terminal" trong SRS nhưng SRS lại mô tả có thể quay lại `studying` — tự mâu thuẫn, và khác sơ đồ workflow của BRD (chỉ cho `reserved` quay lại, không cho `dropped`).
- Định dạng avatar: BRD FR-03 ghi "jpg/png ≤2MB", còn Validation Rules và SRS cho phép thêm "webp".
- Kênh gửi tài khoản Student App: BRD liệt kê "SMS/Email/Zalo", UseCase chỉ nhắc "SMS/Zalo" (thiếu Email).

### EDU-02 Parent
- Actor "Sales/CRM (tạo từ Lead)" có trong BRD nhưng không có use case/luồng tương ứng nào ở SRS/UseCase — thiếu hoàn toàn.
- Permission `edu.parent.view-phone` (ẩn/hiện SĐT) xuất hiện ở SRS và ScreenSpec nhưng không có trong bảng Permissions của BRD.
- BRD gộp quyền "delete/merge" làm 1 dòng, SRS tách thành 2 permission key riêng (`edu.parent.delete`, `edu.parent.merge`).

### EDU-03 Course
- State machine tái kích hoạt khóa học khác nhau: BRD vẽ `inactive → draft`, SRS mô tả `inactive → active` (quay thẳng, không qua draft).
- BR-01 của BRD cho phép sinh mã tự động `KH{số}`, nhưng SRS/UseCase/ScreenSpec chỉ mô tả nhập tay + check unique, không có cơ chế auto-generate.

### EDU-04 Subject
Nhất quán. Chỉ có 1 điểm nhỏ: SRS nhắc tới bảng `teacher_subjects` như hệ quả liên quan mà ERD của BRD không thể hiện.

### EDU-05 Level
Nhất quán tốt (chuỗi next_level, chống vòng lặp, permission đều khớp).

### EDU-06 Classroom
- Mã lỗi dùng tiền tố `E-ROM-xx` trong khi các module khác đặt theo tên module (E-STU, E-PAR, E-CRS...) — không nhất quán quy ước đặt tên.
- UseCase thêm giới hạn "khoảng xem lịch phòng > 62 ngày" không được BRD/SRS đề cập.

### EDU-07 Teacher
Nhất quán tốt. SRS bổ sung 2 endpoint (`DELETE /classes/{id}/teachers/{tid}`, `GET /teacher/me/schedule`) không có trong BRD — là bổ sung hợp lý, không mâu thuẫn nhưng nên cập nhật ngược lại BRD.

### EDU-08 Class
- BRD tự mâu thuẫn: phần Actors ghi "Giáo vụ (CRUD, chuyển/đóng lớp)" nhưng bảng Permissions lại từ chối Giáo vụ quyền `edu.class.close` (chỉ Admin/Manager). SRS/UseCase/ScreenSpec đều đi theo bảng Permissions (đúng) — cần sửa lại câu mô tả Actor trong BRD.
- Sơ đồ workflow BRD thiếu nhánh `ongoing → cancelled` (hủy lớp giữa chừng có phê duyệt Manager), dù BR-07 và SRS đều mô tả rõ trường hợp này.

### EDU-09 Enrollment
- Cùng pattern EDU-08: Actors BRD ngụ ý Giáo vụ được hủy ghi danh, nhưng Permissions từ chối `edu.enrollment.cancel` cho Giáo vụ. ScreenSpec/UseCase xác nhận chỉ Manager có quyền.
- Cơ chế "bảo lưu → kích hoạt lại": sơ đồ BRD vẽ như 1 transition trên cùng bản ghi, nhưng SRS mô tả thực tế là tạo enrollment mới với status `active`, còn bản ghi cũ chuyển sang `transferred` — tái dùng giá trị `transferred` vốn dành cho luồng chuyển lớp, gây chồng nghĩa.

### EDU-10 Timetable
Nhất quán tốt giữa cả 4 tài liệu, kể cả với mô hình dữ liệu của EDU-11 (session).

### EDU-11 Session
- BRD cấp quyền `edu.session.start/complete` cho Admin, nhưng SRS/UseCase giới hạn chỉ GV được phân công buổi đó (hoặc GV dạy thay) mới được thao tác, có mã lỗi riêng khi vi phạm — không có ngoại lệ cho Admin như BRD ghi.

### EDU-12 Attendance
- Mâu thuẫn rõ nhất trong nhóm: BR-02 của BRD nói "Giáo vụ/Manager được sửa điểm danh sau khi buổi completed", nhưng bảng Permissions của chính BRD lại từ chối hoàn toàn quyền sửa cho Giáo vụ. SRS/UseCase/ScreenSpec đi theo đúng BR-02 (Giáo vụ sửa được trong 24h đầu, sau đó cần Manager).
- Enum `absence_reports.status`: BRD chỉ định nghĩa `pending, confirmed`; SRS bổ sung thêm `rejected` chưa được phản ánh ngược lại BRD.
- Cùng pattern với EDU-11: quyền `edu.attendance.take` cấp cho Admin trong BRD nhưng SRS chỉ chấp nhận GV của buổi.

### EDU-13 Homework
Nhất quán (state machine, loại bài, giới hạn file, deadline mặc định đều khớp).

### EDU-14 Homework Submission
Nhất quán cơ bản. FR "nhắc deadline 24h/2h" bị khai trùng ở cả BRD-13 và BRD-14 nhưng chỉ được đặc tả triển khai 1 lần (ở SRS-13) — cần làm rõ FR này thuộc quyền sở hữu module nào để tránh làm 2 lần hoặc bỏ sót.

### EDU-15 Assignment/Grading
Nhất quán tốt. Có schema drift nhỏ: SRS thêm cột `scheme enum(score_10,letter,stars)` vào bảng `submission_grades` mà BRD không có.

### EDU-16 Examination
Nhất quán tốt (state machine, cấu trúc skills, permission, quy tắc thi bù 14 ngày đều khớp).

### EDU-17 Score
Trọng số mặc định và ngưỡng xếp loại khớp hoàn toàn giữa BRD/SRS/UseCase. Có 3 điểm lệch tên field:
- Khóa ngoại trong bảng `scores`: BRD gọi `component_id`, SRS gọi `structure_id` — cùng ý nghĩa, khác tên.
- Trường `max_score` có trong `score_structures` của BRD nhưng SRS thay bằng `is_required`, bỏ `max_score`.
- Action `recalculate` không có permission key chuẩn trong BRD (SRS chỉ ghi chung "admin/manager") — nên bổ sung `edu.score.recalculate`.

### EDU-18 Certificate
- BRD tự mâu thuẫn nội bộ: DB Design chỉ định nghĩa enum `status(issued,revoked)`, nhưng phần Exception Handling của chính BRD lại nhắc trạng thái `pending-render` không nằm trong enum đó. SRS đã sửa đúng thành `enum(pending_render,issued,revoked)`.
- Field tự tham chiếu bản cấp lại đặt tên/hướng ngược nhau: BRD dùng `replaced_by_id` (bản cũ trỏ tới bản mới), SRS dùng `replaces_certificate_id` (bản mới trỏ về bản cũ) — cùng ý nghĩa, hướng tham chiếu ngược nhau, cần thống nhất.
- SRS bổ sung field `verify_code` riêng cho QR (không mã hoá trực tiếp số hiệu chứng chỉ) — cải tiến bảo mật hợp lý nhưng chưa được cập nhật ngược lại BRD.

---

## 3. Khoảng trống tài liệu

**ScreenSpec chưa có cho EDU-16, EDU-17, EDU-18.** Thư mục `ScreenSpec/` chỉ có tới `SCR-EDU-15-Grading.md`. Trong khi đó BRD mô tả UI khá phức tạp cho cả 3 chức năng còn lại: bảng nhập điểm dạng spreadsheet cho Examination, bảng điểm spreadsheet + phiếu điểm PDF cho Score, trình thiết kế template kéo-thả + trang xác thực public cho Certificate. Đây là phần cần bổ sung trước khi bắt tay thiết kế UI/dev front-end cho 3 module này.

---

## 4. Nhóm vấn đề lặp lại (root cause)

| Nhóm vấn đề | Các module bị ảnh hưởng | Đề xuất xử lý |
|---|---|---|
| Bảng Permissions trong BRD mâu thuẫn với phần Actors/Business Rules trong chính BRD | EDU-08, EDU-09, EDU-11, EDU-12 | Rà soát lại BRD gốc, đồng bộ theo đúng bảng Permissions (SRS/UseCase/ScreenSpec đã đi theo hướng đúng, chỉ cần sửa BRD) |
| Field/tên cột lệch giữa BRD và SRS (không sai logic, chỉ khác tên) | EDU-17, EDU-18 | Chọn 1 nguồn chuẩn (khuyến nghị: SRS, vì chi tiết hơn) rồi đồng bộ ngược lại BRD |
| State machine vẽ thiếu nhánh hoặc khác hướng giữa sơ đồ BRD và mô tả SRS | EDU-01, EDU-03, EDU-08, EDU-09 | Vẽ lại toàn bộ sơ đồ trạng thái trong BRD dựa trên mô tả chi tiết của SRS, review cùng lúc |
| BRD tự mâu thuẫn nội bộ (enum không khớp giữa DB Design và Exception Handling) | EDU-18 | Sửa enum trong DB Design của BRD theo SRS |
| Thiếu ScreenSpec | EDU-16, EDU-17, EDU-18 | Bổ sung 3 file ScreenSpec còn thiếu |

---

## 5. Ghi chú

Báo cáo này được tổng hợp từ 3 lượt rà soát song song (EDU-01→06, EDU-07→12, EDU-13→18), mỗi lượt đối chiếu trực tiếp nội dung BRD (theo số dòng cụ thể) với các file SRS/UseCase/ScreenSpec tương ứng. Các phát hiện trên là mâu thuẫn/khoảng trống thực tế phát hiện qua đọc trực tiếp tài liệu, chưa bao gồm việc kiểm tra chéo với mã nguồn (vì hệ thống đang ở giai đoạn tài liệu BA, chưa có code tương ứng để đối chiếu thêm).
