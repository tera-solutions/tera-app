# SRS-EDU-14 — Homework Submission (Nộp bài)

> Software Requirements Specification — Hana Edu
>
> Version 1.0 | 2026-07-08 | Draft | Tham chiếu: `BRD - Education.md` § EDU-14

---

## 1. Giới thiệu

### 1.1 Mục đích

Đặc tả nộp bài từ Student App (text/ảnh/audio/quiz), nộp hộ bởi GV, version khi nộp lại, cờ muộn, flow redo.

### 1.2 Phạm vi

Submission lifecycle: submitted → graded → redo → submitted. Chấm điểm: SRS-EDU-15.

## 2. Mô tả tổng quan

- 1 submission chính thức / (homework, student); nộp lại = version++ (archive bản cũ).
- is_late = submitted_at > deadline; chặn nếu allow_late=false hoặc homework closed.
- Upload presigned URL; audio ghi âm ≤ 5 phút.

## 3. Yêu cầu chức năng chi tiết

### FR-01 Nộp bài (Student App)

- Precondition: homework assigned, student trong scope, chưa graded (hoặc đang redo).
- Input ≥ 1 trong: content text, attachments[] (≤10, ≤20MB), audio {key, duration}, quiz_result (khi type=quiz — payload từ Quiz engine).
- Xử lý: upsert theo (homework_id, student_id); nếu tồn tại → snapshot bản cũ vào versions, version++; set is_late; status=submitted.
- Push GV: gộp thông minh — tối đa 1 push/15 phút/homework ("5 bài mới").

### FR-02 Nộp hộ (Teacher App)

POST với student_id + ảnh chụp; submitted_by=teacher. Cho phép cả sau deadline (GV chủ động).

### FR-03 Redo

- PATCH /redo {comment}: chỉ GV lớp, từ graded → redo; giữ điểm cũ trong grade record (reference), submission mở lại cho nộp.
- HV nộp lại → version++, status=submitted → chấm lại (grade mới ghi đè, log lần chấm cũ).

### FR-04 Theo dõi nộp (Teacher App)

`GET /homework/{id}/submissions?filter=submitted|missing|late`: đếm 3 phân đoạn; missing = scope − submitted. POST /remind: push nhóm missing (rate limit 1 lần/6h).

### FR-05 Xem bài của mình / của con

Student App: submission + version history + grade. Parent App: read-only.

## 4. Use Case chính

**UC-01:** HV mở bài → chụp 2 trang → preview → Nộp → upload 2 ảnh presigned (retry/resume) → POST submission → badge "Đã nộp"; GV nhận push gộp.

**UC-04 Redo:** GV chấm thấy sai đề → Redo + comment → HV nhận push → nộp bản mới → GV chấm lại.

## 5. API Specification

| Method | Path | Quyền |
|--------|------|-------|
| POST | /api/student/homework/{id}/submission | Student (scope) |
| GET | /api/student/homework/{id}/submission | Student |
| POST | /api/edu/homework/{id}/submissions | GV lớp (nộp hộ) |
| GET | /api/edu/homework/{id}/submissions | GV lớp |
| GET | /api/edu/submissions/{id} | GV/HV/PH theo scope |
| PATCH | /api/edu/submissions/{id}/redo | GV lớp |
| POST | /api/edu/homework/{id}/remind | GV lớp |
| GET | /api/parent/students/{id}/submissions | Parent App |

```json
// POST /api/student/homework/55/submission — Request
{
  "content": "Em đã làm xong ạ",
  "attachments": [{ "key": "sub/2026/07/x1.jpg", "name": "trang24.jpg" }],
  "audio": null,
  "client_request_id": "uuid-..."
}
// Response 201
{ "success": true, "data": { "id": 901, "version": 1, "is_late": false, "status": "submitted" } }
```

## 6. Yêu cầu dữ liệu

`homework_submissions`: id, business_id, homework_id FK, student_id FK, version smallint default 1, content text null, attachments json, audio json null, quiz_result json null, is_late bool, submitted_by enum(student,teacher), status enum(submitted,graded,redo) index, submitted_at, client_request_id null, timestamps. Unique (homework_id, student_id).

`homework_submission_versions`: id, submission_id FK, version, snapshot json, created_at.

## 7. Yêu cầu phi chức năng

- Ảnh nén client ~1MB; upload resume (multipart); mất mạng giữa chừng giữ draft local.
- Idempotent theo client_request_id (retry không tạo version thừa).
- Version cũ giữ 12 tháng (policy dọn storage).

## 8. Mã lỗi

| Code | HTTP | Ý nghĩa |
|------|------|---------|
| E-SUB-01 | 422 | Bài đã đóng |
| E-SUB-02 | 422 | Nộp muộn khi allow_late=false |
| E-SUB-03 | 403 | Ngoài scope được giao |
| E-SUB-04 | 409 | Nộp lại khi đã graded (chưa redo) |
| E-SUB-05 | 422 | Nội dung rỗng / file không hợp lệ |

## 9. Test scenarios

| # | Scenario | Kỳ vọng |
|---|----------|---------|
| T1 | Nộp trước deadline | is_late=false; GV thấy trong "Đã nộp" |
| T2 | Nộp sau deadline (allow_late) | is_late=true, phân đoạn "Muộn" |
| T3 | Nộp sau deadline (không allow) | 422 E-SUB-02 |
| T4 | Nộp lại 2 lần trước deadline | version=3, 2 bản archive |
| T5 | Nộp lại sau graded | 409 E-SUB-04 |
| T6 | Redo → nộp → chấm lại | Grade mới hiển thị, log grade cũ |
| T7 | Retry request cùng client_request_id | Không tăng version |
| T8 | HV ngoài scope selected | 403 E-SUB-03 |
