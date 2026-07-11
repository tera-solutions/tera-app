# SRS-EDU-12 — Attendance (Điểm danh)

> Software Requirements Specification — Hana Edu
>
> Version 1.0 | 2026-07-08 | Draft | Tham chiếu: `BRD - Education.md` § EDU-12

---

## 1. Giới thiệu

### 1.1 Mục đích

Đặc tả ghi nhận chuyên cần theo buổi, thông báo realtime phụ huynh, báo vắng trước, sửa sau chốt và cảnh báo vắng liên tiếp.

### 1.2 Phạm vi

Attendance CRUD (bulk), absence report từ Parent App, ma trận lớp, rule engine cảnh báo. Runtime buổi: SRS-EDU-11.

## 2. Mô tả tổng quan

- 1 bản ghi / (session, student); 4 trạng thái: present, late, absent_excused, absent.
- Roster buổi = enrollment active tại thời điểm buổi (bao gồm ghi danh giữa khóa từ buổi tham gia).
- Notification phụ huynh: realtime per-student sau khi ghi.

## 3. Yêu cầu chức năng chi tiết

### FR-01 Lấy roster + điểm danh bulk

- `GET /sessions/{id}/attendance`: roster kèm trạng thái hiện có + absence_reports pending.
- `PUT /sessions/{id}/attendance` [{student_id, status, note?}]: bulk upsert theo unique key; chỉ GV buổi khi session ongoing; ghi taken_by/taken_at.
- Hỗ trợ idempotency `client_request_id` (offline sync).

### FR-02 Báo vắng trước (Parent App)

- `POST /api/parent/students/{id}/absence-report` {class_session_id, reason}: chỉ buổi tương lai của con; tạo record pending.
- GV thấy badge "báo vắng" trên roster → xác nhận → attendance = absent_excused, report=confirmed.

### FR-03 Sửa sau chốt

- Trong 24h sau session completed: Giáo vụ sửa được; sau 24h: Manager + edit_reason. Mọi sửa ghi log (edited_by, edit_reason) + trigger recalculate used_sessions (SRS-EDU-09 FR-05) + re-notify phụ huynh nếu đổi present↔absent.

### FR-04 Ma trận & lịch sử

- `GET /classes/{id}/attendance-matrix`: rows=students, cols=sessions, cells=status; phân trang cột theo 20 buổi.
- `GET /students/{id}/attendance?from&to`: lịch sử + tỷ lệ chuyên cần = (present+late)/số buổi phải học.

### FR-05 Rule engine cảnh báo

Sau mỗi lần ghi attendance: đếm chuỗi absent (không phép) liên tiếp gần nhất của student trong class → ≥ Setting `edu.attendance.consecutive_absent_alert` (mặc định 3) → event `ConsecutiveAbsenceAlert` → Notification (Giáo vụ + Sales owner của phụ huynh).

### FR-06 Notification phụ huynh

Queue per-record: template "đến lớp lúc {time}" / "vắng mặt buổi {date}" → kênh push, fallback SMS/Zalo theo Setting; log trạng thái gửi; không gửi lại khi GV sửa nhỏ (note), chỉ khi đổi status nhóm (có mặt ↔ vắng).

## 4. Use Case chính

**UC-01 Điểm danh nhanh:** GV bấm "Tất cả có mặt" (FE fill present) → chỉnh 2 em absent → PUT bulk 1 request → 18 push "đến lớp" + 2 push "vắng" trong ≤ 1 phút.

**UC-02 Báo vắng trước:** 21h tối PH gửi báo ốm cho buổi mai → sáng roster hiển thị sẵn → GV confirm 1 tap.

## 5. API Specification

| Method | Path | Quyền |
|--------|------|-------|
| GET | /api/edu/sessions/{id}/attendance | view |
| PUT | /api/edu/sessions/{id}/attendance | attendance.take (GV buổi) |
| PATCH | /api/edu/attendance/{id} | take / edit-after-close |
| GET | /api/edu/classes/{id}/attendance-matrix | view |
| GET | /api/edu/students/{id}/attendance | view (scope) |
| POST | /api/parent/students/{id}/absence-report | Parent App |
| PATCH | /api/edu/absence-reports/{id}/confirm | GV buổi |

```json
// PUT /sessions/501/attendance — Request
{
  "client_request_id": "uuid-...",
  "records": [
    { "student_id": 101, "status": "present" },
    { "student_id": 102, "status": "absent", "note": "PH báo ốm" }
  ]
}
```

## 6. Yêu cầu dữ liệu

`attendance`: id, business_id, class_session_id FK, student_id FK, enrollment_id FK, status enum(present,late,absent_excused,absent), note varchar(255), reported_by_parent bool, taken_by FK users, taken_at, edited_by null, edit_reason null, client_request_id null, timestamps. Unique (class_session_id, student_id). Index (student_id, taken_at), (enrollment_id).

`absence_reports`: id, business_id, student_id, class_session_id, reason varchar(255), reported_by (user parent), status enum(pending,confirmed,rejected), created_at. Unique (class_session_id, student_id).

## 7. Yêu cầu phi chức năng

- Bulk 30 học viên < 500ms; notification enqueue trong cùng transaction (outbox pattern) đảm bảo không mất tin.
- Push ≤ 1 phút; retry 3 lần, fallback kênh 2; log tại Notification module.
- Consecutive check: query window 10 buổi gần nhất, O(1) mỗi student.

## 8. Mã lỗi

| Code | HTTP | Ý nghĩa |
|------|------|---------|
| E-ATT-01 | 403 | Không phải GV buổi / session không ongoing |
| E-ATT-02 | 422 | Student không thuộc roster |
| E-ATT-03 | 403 | Sửa sau 24h không có quyền Manager |
| E-ATT-04 | 422 | Sửa sau chốt thiếu edit_reason |
| E-ATT-05 | 422 | Báo vắng buổi đã diễn ra |

## 9. Test scenarios

| # | Scenario | Kỳ vọng |
|---|----------|---------|
| T1 | Bulk 20 học viên | 1 request, 20 record, 20 notification đúng nội dung |
| T2 | Ghi 2 lần cùng student (2 thiết bị) | 1 bản ghi cuối, có log |
| T3 | HV ghi danh giữa khóa buổi 15 | Có mặt roster từ buổi 15, không xuất hiện buổi 1–14 |
| T4 | Absent không phép 3 buổi liên tiếp | Alert Giáo vụ + Sales đúng 1 lần (không lặp mỗi buổi sau) |
| T5 | Sửa absent→present sau 2 ngày bởi Giáo vụ | 403; Manager + reason → OK, used_sessions recalculated, PH nhận đính chính |
| T6 | Báo vắng trước | Roster hiển thị pending; confirm → absent_excused |
| T7 | Điểm danh khi session scheduled | 403 E-ATT-01 |
