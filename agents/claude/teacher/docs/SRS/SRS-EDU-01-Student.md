# SRS-EDU-01 — Student Management

> Software Requirements Specification — Hana Edu
>
> Version 1.0 | 2026-07-08 | Draft
>
> Tham chiếu: `BRD - Education.md` § EDU-01 | Stack: Laravel 12, React 19, React Native

---

## 1. Giới thiệu

### 1.1 Mục đích

Đặc tả yêu cầu phần mềm cho chức năng quản lý hồ sơ học viên: dữ liệu gốc cho toàn bộ nghiệp vụ đào tạo, tài chính và chăm sóc phụ huynh.

### 1.2 Phạm vi

CRUD học viên, quản lý trạng thái học, liên kết phụ huynh, import/export, tài khoản Student App. Không bao gồm: ghi danh (SRS-EDU-09), điểm danh (SRS-EDU-12).

### 1.3 Thuật ngữ

| Thuật ngữ | Định nghĩa |
|-----------|-----------|
| Student | Học viên, trẻ 4–10 tuổi |
| Student Code | Mã định danh nghiệp vụ, format HS{YY}{NNNNN} |
| Status | Trạng thái vòng đời học: pending/studying/reserved/dropped/completed |

## 2. Mô tả tổng quan

### 2.1 Bối cảnh

Module Education (prefix `edu`), phụ thuộc System (users, branches), CRM (customers). Cung cấp dữ liệu cho Finance, Reporting, Notification, Parent/Student App.

### 2.2 User Classes

| User | Quyền chính |
|------|-------------|
| Admin / Manager / Giáo vụ | CRUD theo scope chi nhánh |
| Teacher | Read-only học viên lớp mình |
| Parent / Student | Read-only hồ sơ bản thân qua app |

### 2.3 Giả định & Phụ thuộc

- Module System đã có phân quyền `edu.student.*` và Data Permission theo branch.
- CRM phát event `CustomerConverted` khi thanh toán thành công.
- Object storage sẵn sàng cho avatar.

## 3. Yêu cầu chức năng chi tiết

### FR-01 Danh sách học viên

- **Input:** keyword (tên/mã/SĐT phụ huynh, tìm không dấu), filter: branch_id, status, class_id, course_id; page, per_page (mặc định 20, max 100), sort.
- **Xử lý:** query scope theo Data Permission; join parent chính; fulltext + unaccent index.
- **Output:** danh sách phân trang: id, student_code, full_name, avatar_thumb, age (tính từ DOB), primary_parent {name, phone}, current_class, status.
- **Hiệu năng:** P95 < 500ms với 50.000 bản ghi.

### FR-02 Tạo học viên

- **Input:** full_name, date_of_birth, gender, branch_id, address?, note?, parents[] ({parent_id} hoặc {full_name, phone, relationship}), is_primary.
- **Xử lý:** transaction — sinh student_code từ sequence per business; tạo/liên kết parent; check nghi trùng (tên + DOB + phone phụ huynh) → trả warning `duplicate_suspected` nếu FE chưa gửi `force=true`.
- **Output:** 201 + object student đầy đủ; event `StudentCreated`.

### FR-03 Cập nhật hồ sơ & Avatar

- PUT cập nhật trường cho phép (không đổi student_code, business_id).
- Avatar: upload multipart ≤ 2MB (jpg/png/webp), server sinh 3 size (原/256/64), lưu URL.

### FR-04 Chi tiết học viên

Trả về hồ sơ + aggregate: danh sách enrollment, tỷ lệ chuyên cần, điểm gần nhất, công nợ (gọi Finance API nội bộ), lịch sử trạng thái.

### FR-05 Đổi trạng thái / Chuyển chi nhánh

- State machine (mục 6.3); reason bắt buộc với reserved/dropped; ghi `student_status_logs`.
- Chuyển chi nhánh: cập nhật branch_id + ghi `student_branch_logs`; enrollment đang active phải xử lý trước (chặn nếu còn lớp ongoing tại chi nhánh cũ).

### FR-06 Import / Export

- Import: file xlsx theo template (tải từ hệ thống); tối đa 1.000 dòng; xử lý qua Queue job; kết quả trả file xlsx đánh dấu từng dòng OK/lỗi + lý do.
- Export: theo filter hiện tại, tối đa 10.000 dòng, queue + link tải.

### FR-07 Tài khoản Student App

POST tạo user (module System) role Student, username = student_code, password random → gửi phụ huynh qua Notification; liên kết `students.user_id`.

## 4. Use Case chính

### UC-01 Tạo học viên thủ công

| Bước | Actor | Hệ thống |
|------|-------|----------|
| 1 | Giáo vụ mở form tạo | Hiển thị dialog |
| 2 | Nhập thông tin + chọn/tạo phụ huynh | Validate realtime; check trùng SĐT phụ huynh |
| 3 | Bấm Lưu | Check nghi trùng học viên |
| 4a | Không trùng | Tạo, sinh mã, toast + thêm dòng vào bảng |
| 4b | Nghi trùng | Hiển thị hồ sơ nghi trùng, chọn "Vẫn tạo" (force) hoặc mở hồ sơ cũ |

**Exception:** mất mạng → FE giữ form; 422 → focus field lỗi.

### UC-02 Auto tạo từ CRM

Event `CustomerConverted {customer_id, student_info, branch_id}` → listener tạo student (idempotent theo customer_id) → status pending → task "Chờ xếp lớp".

## 5. API Specification

Base: `/api/edu/students` — Bearer token (Passport). Envelope: `{success, data, message, errors}`.

| # | Method | Path | Mô tả | Quyền |
|---|--------|------|-------|-------|
| 1 | GET | / | Danh sách | edu.student.view |
| 2 | POST | / | Tạo | edu.student.create |
| 3 | GET | /{id} | Chi tiết | edu.student.view |
| 4 | PUT | /{id} | Cập nhật | edu.student.update |
| 5 | DELETE | /{id} | Soft delete | edu.student.delete |
| 6 | PATCH | /{id}/status | Đổi trạng thái | edu.student.change-status |
| 7 | POST | /{id}/avatar | Upload avatar | edu.student.update |
| 8 | POST | /import · GET /export | Import/Export | edu.student.import |
| 9 | POST | /{id}/account | Tạo tài khoản app | edu.student.update |

**Ví dụ — POST /api/edu/students**

```json
// Request
{
  "full_name": "Nguyễn Minh An",
  "date_of_birth": "2019-05-12",
  "gender": "male",
  "branch_id": 1,
  "parents": [{ "full_name": "Nguyễn Văn B", "phone": "0903111222", "relationship": "father", "is_primary": true }]
}
// Response 201
{
  "success": true,
  "data": { "id": 101, "student_code": "HS2600101", "status": "pending", "...": "..." }
}
```

## 6. Yêu cầu dữ liệu

### 6.1 Bảng `students`

| Cột | Kiểu | Ràng buộc |
|-----|------|-----------|
| id | bigint unsigned | PK, auto |
| business_id, branch_id | bigint | FK, composite index |
| student_code | varchar(20) | unique (business_id, student_code) |
| customer_id, user_id | bigint nullable | FK CRM / System |
| full_name | varchar(100) | fulltext index (kèm cột full_name_unaccent) |
| date_of_birth | date | not null |
| gender | enum(male,female,other) | |
| avatar | varchar(255) null | |
| address, note | text null | |
| status | enum(pending,studying,reserved,dropped,completed) | index, default pending |
| status_reason | varchar(255) null | |
| created_by, updated_by | bigint | |
| created_at, updated_at, deleted_at | timestamp | soft delete |

Bảng phụ: `student_status_logs`, `student_branch_logs`, `student_code_sequences (business_id, year, last_number)`.

### 6.2 State machine trạng thái

```
pending ──enroll──► studying ──► reserved ──reactivate──► studying
                        │──────► dropped   (terminal, có thể quay lại studying qua enroll mới)
                        └──────► completed (khi mọi enrollment completed)
```

Transition không hợp lệ → lỗi `E-STU-05`.

## 7. Yêu cầu phi chức năng

- Bảo mật: mọi query bắt buộc scope business_id + branch permission (global scope Laravel); SĐT phụ huynh mask với role Teacher.
- Audit: middleware ghi Activity Log mọi thao tác ghi.
- Import job: chunk 100 dòng, retry 3, timeout 10 phút.
- API idempotent: POST tạo từ CRM theo customer_id unique.

## 8. Mã lỗi

| Code | HTTP | Ý nghĩa |
|------|------|---------|
| E-STU-01 | 422 | Dữ liệu không hợp lệ (kèm field errors) |
| E-STU-02 | 409 | Nghi trùng học viên (duplicate_suspected) |
| E-STU-03 | 409 | Không thể xóa — đã có enrollment/invoice |
| E-STU-04 | 403 | Ngoài phạm vi chi nhánh |
| E-STU-05 | 422 | Chuyển trạng thái không hợp lệ |
| E-STU-06 | 422 | File import sai template/quá 1.000 dòng |

## 9. Tiêu chí nghiệm thu & Test scenarios

| # | Scenario | Kỳ vọng |
|---|----------|---------|
| T1 | Tạo học viên hợp lệ | 201, mã HS26xxxxx tăng dần, có trong danh sách |
| T2 | Tạo trùng (tên+DOB+SĐT PH) không force | 409 E-STU-02 kèm hồ sơ trùng |
| T3 | Xóa học viên có enrollment | 409 E-STU-03 |
| T4 | Manager branch A xem học viên branch B | 403 / không xuất hiện trong list |
| T5 | Đổi status studying→reserved không reason | 422 |
| T6 | Import 1.000 dòng có 10 dòng lỗi | 990 tạo thành công, file kết quả ghi rõ 10 dòng lỗi |
| T7 | Event CustomerConverted gửi 2 lần | Chỉ tạo 1 student |
| T8 | Concurrency 2 request tạo cùng lúc | student_code không trùng |
