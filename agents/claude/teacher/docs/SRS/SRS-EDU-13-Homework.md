# SRS-EDU-13 — Homework (Giao bài tập)

> Software Requirements Specification — Hana Edu
>
> Version 1.0 | 2026-07-08 | Draft | Tham chiếu: `BRD - Education.md` § EDU-13

---

## 1. Giới thiệu

### 1.1 Mục đích

Đặc tả giao bài tập theo lớp/nhóm học viên: tạo, giao, deadline, template, thông báo. Nộp bài: SRS-EDU-14; chấm: SRS-EDU-15.

### 1.2 Phạm vi

Homework CRUD, assign scope, deadline/extend, close, template GV, push notification, nhắc deadline.

## 2. Mô tả tổng quan

- State machine: `draft → assigned → closed`.
- Loại: text / file / quiz / link; file lưu object storage, presigned URL upload trực tiếp từ app.
- Chủ thể tạo: chỉ GV của lớp (main/assistant theo Setting `edu.homework.assistant_can_assign`).

## 3. Yêu cầu chức năng chi tiết

### FR-01 Tạo & giao

- POST tạo draft: title (≤200), description (rich text sanitized), type, attachments[] (≤10 file, mỗi file ≤20MB: jpg/png/pdf/mp3/mp4), quiz_id?, link?, deadline (mặc định = start_at buổi kế tiếp), allow_late (Setting default), assign_scope (class|selected + student_ids).
- PATCH /assign: chuyển assigned; resolve danh sách học viên (enrollment active tại thời điểm assign); fan-out notification qua queue.
- Học viên ghi danh sau khi assign: **không** tự nhận bài cũ (Giáo vụ/GV thêm tay nếu cần qua update scope).

### FR-02 Cập nhật & gia hạn

- PUT khi draft: tự do. Khi assigned: sửa description/attachments tạo version log, notify học viên "bài tập được cập nhật"; không đổi type.
- PATCH /extend {deadline}: chỉ tăng; notify.

### FR-03 Đóng bài

PATCH /close: dừng nhận nộp; điều kiện chấm hàng loạt. Auto-close: option Setting sau deadline + X ngày.

### FR-04 Template

- POST /templates từ homework có sẵn hoặc tạo mới; scope cá nhân GV (private) hoặc business (Manager duyệt).
- Tạo homework từ template: copy content + attachments (reference cùng file, không duplicate storage).

### FR-05 Danh sách & tiến độ

`GET /classes/{id}/homework`: kèm submission_stats {submitted, graded, missing, late}. Student App: `GET /api/student/homework?status=pending|submitted|graded`.

### FR-06 Nhắc deadline

Scheduler: deadline − 24h và − 2h → push học viên **chưa nộp** (+ Parent App); query anti-join submissions.

## 4. Use Case chính

**UC-01:** Sau buổi học, GV mở Teacher App → "Giao bài" từ màn session → chụp 2 ảnh workbook → deadline mặc định buổi sau → Assign → 18 học viên nhận push.

**UC-02 Giao nhóm:** chọn selected + 3 học viên yếu → chỉ 3 em thấy bài.

## 5. API Specification

| Method | Path | Quyền |
|--------|------|-------|
| GET/POST | /api/edu/classes/{id}/homework | view / GV lớp |
| GET/PUT/DELETE | /api/edu/homework/{id} | view / GV tạo |
| PATCH | /api/edu/homework/{id}/assign · /close · /extend | GV lớp |
| GET/POST | /api/edu/homework-templates | GV |
| GET | /api/student/homework | Student App |
| GET | /api/parent/students/{id}/homework | Parent App |
| POST | /api/edu/uploads/presign | GV/HV (upload file) |

```json
// POST /classes/12/homework — Request
{
  "title": "Workbook trang 24-25",
  "type": "file",
  "attachments": [{ "key": "hw/2026/07/abc.jpg", "name": "trang24.jpg", "size": 812345 }],
  "deadline": "2026-07-10T18:00:00+07:00",
  "assign_scope": "class",
  "allow_late": true
}
```

## 6. Yêu cầu dữ liệu

`homework`: id, business_id, class_id FK, class_session_id FK null, teacher_id FK, title, description mediumtext, type enum(text,file,quiz,link), quiz_id null, link varchar(500) null, attachments json, deadline datetime index, allow_late bool, assign_scope enum(class,selected), status enum(draft,assigned,closed) index, assigned_at, timestamps, deleted_at.

`homework_students`: homework_id FK, student_id FK. Unique cặp. (Chỉ khi selected.)

`homework_templates`: id, business_id, teacher_id null (null=shared), title, content json, status, timestamps.

## 7. Yêu cầu phi chức năng

- Upload: presigned URL, client upload thẳng storage (không qua API server); server verify key khi lưu.
- Fan-out push 40 học viên ≤ 2 phút; queue riêng priority notification.
- Ảnh trong description: sanitize, chỉ cho từ storage nội bộ.

## 8. Mã lỗi

| Code | HTTP | Ý nghĩa |
|------|------|---------|
| E-HWK-01 | 403 | Không phải GV lớp |
| E-HWK-02 | 409 | Xóa bài đã có submission |
| E-HWK-03 | 422 | Deadline quá khứ / extend giảm deadline |
| E-HWK-04 | 422 | File sai loại/quá 20MB/quá 10 file |
| E-HWK-05 | 409 | Assign bài lớp completed/cancelled |
| E-HWK-06 | 422 | selected nhưng student_ids rỗng/ngoài lớp |

## 9. Test scenarios

| # | Scenario | Kỳ vọng |
|---|----------|---------|
| T1 | Assign cả lớp 18 HV | 18 push + 18 bản ghi Parent App ≤ 2 phút |
| T2 | Giao selected 3 em | HV thứ 4 không thấy bài (API student trả rỗng) |
| T3 | Xóa bài có 1 submission | 409 E-HWK-02 |
| T4 | Nhắc deadline −24h | Chỉ HV chưa nộp nhận push |
| T5 | Extend deadline lùi lại | 422 E-HWK-03 |
| T6 | Template có file | Homework mới reference cùng file, storage không nhân đôi |
| T7 | GV lớp khác gọi POST | 403 E-HWK-01 |
