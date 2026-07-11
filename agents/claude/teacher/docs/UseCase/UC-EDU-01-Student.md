# Use Case — EDU-01 Student Management

> Hana Edu | Version 1.0 | 2026-07-08 | Tham chiếu: `BRD - Education.md` § EDU-01, `SRS/SRS-EDU-01-Student.md`

---

## Danh mục Use Case

| ID | Tên | Actor chính |
|----|-----|-------------|
| UC-EDU-01-01 | Tạo học viên thủ công | Giáo vụ |
| UC-EDU-01-02 | Tạo học viên tự động từ CRM | System |
| UC-EDU-01-03 | Đổi trạng thái học (bảo lưu/nghỉ) | Giáo vụ |
| UC-EDU-01-04 | Import danh sách học viên | Giáo vụ |
| UC-EDU-01-05 | Tạo tài khoản Student App | Giáo vụ |

## Sơ đồ Actor – Use Case

```
Giáo vụ ────► UC-01, UC-03, UC-04, UC-05
Manager ────► UC-01, UC-03 (+ duyệt ngoại lệ, xem mọi chi nhánh mình quản lý)
System (CRM event) ────► UC-02
Teacher ────► (chỉ xem hồ sơ học viên lớp mình)
Parent/Student ────► (chỉ xem hồ sơ bản thân qua App)
```

---

## UC-EDU-01-01 — Tạo học viên thủ công

| Thuộc tính | Nội dung |
|-----------|----------|
| Actor chính | Giáo vụ (Admin/Manager tương đương) |
| Mô tả | Tạo hồ sơ học viên mới kèm liên kết phụ huynh |
| Trigger | Phụ huynh đăng ký trực tiếp tại trung tâm |
| Precondition | Đăng nhập, quyền `edu.student.create`; chi nhánh hoạt động |
| Postcondition | Học viên status=pending, có mã HS, có ≥1 phụ huynh; Audit Log ghi nhận |

**Luồng chính**

| Bước | Actor | Hệ thống |
|------|-------|----------|
| 1 | Chọn "Tạo học viên" | Mở dialog form |
| 2 | Nhập họ tên, ngày sinh, giới tính | Validate realtime (tuổi 3–16) |
| 3 | Nhập SĐT phụ huynh | Check trùng: có sẵn → gợi ý chọn; chưa có → form tạo mới inline |
| 4 | Chọn relationship + phụ huynh chính | — |
| 5 | Bấm Lưu | Check nghi trùng học viên (tên+DOB+SĐT PH) |
| 6 | — | Không trùng: tạo record, sinh mã HS26xxxxx, đóng dialog, toast + thêm dòng vào bảng |

**Luồng thay thế**

- A1 (bước 3): SĐT đã tồn tại → chọn phụ huynh có sẵn, bỏ qua tạo mới.
- A2 (bước 6): Nghi trùng → hiển thị hồ sơ nghi trùng; Giáo vụ chọn "Vẫn tạo" (gửi force=true) hoặc "Mở hồ sơ có sẵn".

**Luồng ngoại lệ**

- E1: Validate fail → 422, focus field lỗi, không mất dữ liệu đã nhập.
- E2: Mất mạng khi submit → FE giữ form, cho retry.
- E3: Không có quyền chi nhánh → 403.

**BR liên quan:** BR-01 (mã tự sinh), BR-02 (bắt buộc phụ huynh trước ghi danh), BR-06 (thuộc 1 chi nhánh).

---

## UC-EDU-01-02 — Tạo học viên tự động từ CRM

| Thuộc tính | Nội dung |
|-----------|----------|
| Actor chính | System (listener event) |
| Actor phụ | Sales (gián tiếp), Giáo vụ (nhận task) |
| Trigger | Event `CustomerConverted` khi Finance xác nhận thanh toán |
| Precondition | Customer tồn tại với đủ thông tin trẻ |
| Postcondition | Student tạo với customer_id liên kết; task "Chờ xếp lớp" nếu chưa chỉ định lớp |

**Luồng chính**

1. Finance xác nhận thanh toán → CRM phát event `CustomerConverted {customer_id, student_info, branch_id}`.
2. Listener kiểm tra idempotency theo customer_id (đã có student → bỏ qua).
3. Tạo student status=pending, copy thông tin từ customer, liên kết parent từ contact CRM.
4. Phát event `StudentCreated`; tạo task cho Giáo vụ nếu chưa có lớp chỉ định.

**Luồng ngoại lệ**

- E1: Event lặp (retry) → không tạo trùng (idempotent).
- E2: Thiếu thông tin bắt buộc (DOB) → tạo record incomplete + task "Bổ sung hồ sơ" cho Giáo vụ, không fail event.

**BR liên quan:** BR-03.

---

## UC-EDU-01-03 — Đổi trạng thái học

| Thuộc tính | Nội dung |
|-----------|----------|
| Actor chính | Giáo vụ |
| Trigger | Phụ huynh xin bảo lưu / nghỉ học; hoặc hệ thống đề xuất khi lớp đóng |
| Precondition | Quyền `edu.student.change-status`; transition hợp lệ theo state machine |
| Postcondition | Status mới + log lịch sử; ảnh hưởng roster điểm danh các buổi sau |

**Luồng chính**

1. Giáo vụ mở chi tiết học viên → "Đổi trạng thái".
2. Chọn trạng thái đích (chỉ hiển thị transition hợp lệ); nhập lý do (bắt buộc với reserved/dropped); reserved: nhập ngày dự kiến quay lại.
3. Hệ thống lưu, ghi `student_status_logs`, gửi thông báo Manager + Parent App.
4. Nếu reserved/dropped: enrollment active chuyển tương ứng (liên kết UC-EDU-09-03/04).

**Luồng ngoại lệ**

- E1: Transition không hợp lệ (VD completed → pending) → 422 E-STU-05.
- E2: Còn enrollment active chưa xử lý khi dropped → cảnh báo, yêu cầu xử lý enrollment trước.

**BR liên quan:** BR-04, BR-05.

---

## UC-EDU-01-04 — Import danh sách học viên

| Thuộc tính | Nội dung |
|-----------|----------|
| Actor chính | Giáo vụ |
| Trigger | Chuyển dữ liệu từ trung tâm cũ / danh sách offline |
| Precondition | File xlsx đúng template, ≤ 1.000 dòng |
| Postcondition | Dòng hợp lệ tạo thành công; file kết quả ghi lỗi từng dòng |

**Luồng chính**

1. Tải template → điền dữ liệu → upload.
2. Hệ thống validate cấu trúc file → đưa vào Queue.
3. Job xử lý chunk 100 dòng: validate từng dòng (như UC-01), tạo student + parent.
4. Hoàn tất → notification kèm file kết quả (OK/lỗi + lý do từng dòng).

**Luồng ngoại lệ**

- E1: Sai template/quá 1.000 dòng → 422 ngay khi upload.
- E2: Job crash giữa chừng → retry từ chunk chưa xử lý, không tạo trùng (idempotent theo hàng).

---

## UC-EDU-01-05 — Tạo tài khoản Student App

**Luồng chính:** Giáo vụ bấm "Tạo tài khoản" trên hồ sơ → hệ thống tạo user role Student (username = student_code, password random) → gửi thông tin qua kênh phụ huynh chính (SMS/Zalo) → cột trạng thái app đổi "Đã kích hoạt" khi đăng nhập lần đầu.

**Ngoại lệ:** đã có tài khoản → nút chuyển thành "Reset mật khẩu"; gửi SMS fail → retry + fallback kênh khác.
