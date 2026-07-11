# SRS-EDU-08 — Class Management

> Software Requirements Specification — Hana Edu
>
> Version 1.0 | 2026-07-08 | Draft | Tham chiếu: `BRD - Education.md` § EDU-08

---

## 1. Giới thiệu

### 1.1 Mục đích

Đặc tả vòng đời lớp học: mở lớp (wizard), vận hành, chuyển lớp học viên, đóng/hủy lớp — entity trung tâm của Education.

### 1.2 Phạm vi

CRUD lớp, state machine, transfer, close/cancel. Lịch học: SRS-EDU-10; ghi danh: SRS-EDU-09.

## 2. Mô tả tổng quan

- Phụ thuộc: courses (active), classrooms, teachers, enrollments, sessions, scores.
- State machine: `draft → open → ongoing → completed | cancelled` (cancelled từ draft/open, hoặc ongoing với duyệt Manager).
- Scheduler: job mỗi 5 phút chuyển open→ongoing khi buổi 1 bắt đầu.

## 3. Yêu cầu chức năng chi tiết

### FR-01 Danh sách

Filter: status, course_id, branch_id, teacher_id, sắp kết thúc (còn ≤ N buổi). Output: code, name, course, GV chính, sĩ số `enrolled/max`, tiến độ `completed_sessions/total`, ngày khai giảng, status.

### FR-02 Tạo lớp (wizard 3 bước)

1. **Thông tin:** course_id → auto fill total_sessions, duration; name (auto từ template, editable), min/max_students, start_date.
2. **Lịch tuần:** slots[] → preview buổi (SRS-EDU-10).
3. **Giáo viên:** main + assistants (SRS-EDU-07 FR-03).

Hoàn tất wizard: tạo class (draft) + schedules + generate sessions + class_teachers trong 1 transaction; sau đó PATCH open để mở tuyển.

Sinh code: `{course_code}-{YY}{MM}-{seq}` — seq per (course, tháng khai giảng).

### FR-03 Chi tiết lớp

Aggregate: info, teachers, students (enrollments), sessions + progress, attendance summary, homework list, score board. Mỗi tab 1 API riêng (lazy load).

### FR-04 Chuyển lớp học viên

- Input: student_id, to_class_id, reason.
- Validate: enrollment active tại lớp nguồn; lớp đích open/ongoing, cùng course_id hoặc course cùng level_id, còn chỗ.
- Transaction: đếm used_sessions (attendance present/late + absent theo policy) → enrollment nguồn status=transferred → tạo enrollment đích total_sessions = còn lại, source=transfer → insert class_transfers.
- Học viên vào danh sách điểm danh lớp đích từ buổi kế tiếp.

### FR-05 Đóng lớp

- Precondition checklist API `GET /{id}/close-checklist`: (a) 100% session completed/cancelled-có-bù-hoàn-thành; (b) attendance đủ mọi buổi completed; (c) score finalize được (đủ điểm bắt buộc — gọi ScoreService).
- POST /close: transaction — finalize scores (SRS-EDU-17) → enrollment active→completed → student status recalculate (completed nếu không còn lớp khác) → class completed, actual_end_date=now → events (`ClassClosed`, `ScoreFinalized`) → trigger certificate eligibility (SRS-EDU-18).

### FR-06 Hủy lớp

- Từ draft/open: nhập lý do, yêu cầu 0 enrollment active (đã chuyển/hoàn hết) → cancelled.
- Từ ongoing: thêm bước Manager approve (approval record).
- Enrollment còn lại → wizard xử lý: chọn từng học viên chuyển lớp nào / hoàn phí (tạo yêu cầu Finance).

## 4. Use Case chính

**UC-04 Đóng lớp:** Giáo vụ bấm Đóng lớp → checklist báo thiếu điểm final 2 HV → GV bổ sung qua EDU-16 → checklist pass → Manager confirm → hệ thống chạy chuỗi FR-05 → phụ huynh nhận phiếu điểm + thông báo xét chứng chỉ.

## 5. API Specification

| Method | Path | Quyền |
|--------|------|-------|
| GET/POST | /api/edu/classes | view / create |
| GET/PUT/DELETE | /api/edu/classes/{id} | view / update |
| PATCH | /api/edu/classes/{id}/status | update |
| GET | /api/edu/classes/{id}/students · /sessions · /scores | view |
| POST | /api/edu/classes/{id}/transfer | transfer-student |
| GET | /api/edu/classes/{id}/close-checklist | close |
| POST | /api/edu/classes/{id}/close | close |
| POST | /api/edu/classes/{id}/cancel | cancel |

```json
// GET /close-checklist — Response
{
  "success": true,
  "data": {
    "can_close": false,
    "checks": [
      { "key": "sessions_done", "pass": true, "detail": "48/48" },
      { "key": "attendance_complete", "pass": true },
      { "key": "scores_complete", "pass": false, "missing": [{ "student_id": 7, "component": "final" }] }
    ]
  }
}
```

## 6. Yêu cầu dữ liệu

`classes`: id, business_id, branch_id, course_id FK, code varchar(30) unique(business), name, min_students/max_students tinyint, start_date date, expected_end_date date, actual_end_date null, status enum(draft,open,ongoing,completed,cancelled) index, cancel_reason null, cancel_approved_by null, timestamps, deleted_at.

`class_transfers`: id, student_id, from_class_id, to_class_id, from_enrollment_id, to_enrollment_id, sessions_learned smallint, sessions_transferred smallint, reason, approved_by, created_at.

## 7. Yêu cầu phi chức năng

- Close chạy transaction + queue phần notification/PDF; timeout 30s; nếu fail bước nào rollback DB, log chi tiết.
- Chuyển ongoing bởi scheduler: idempotent, sai số ≤ 5 phút.
- Sĩ số kiểm soát bằng `SELECT ... FOR UPDATE` trên class khi tạo enrollment (SRS-EDU-09).

## 8. Mã lỗi

| Code | HTTP | Ý nghĩa |
|------|------|---------|
| E-CLS-01 | 422 | Course không active / dữ liệu sai |
| E-CLS-02 | 409 | Lớp đích đầy khi transfer |
| E-CLS-03 | 422 | Transfer khác course/level |
| E-CLS-04 | 422 | Close checklist chưa pass (kèm checks) |
| E-CLS-05 | 409 | Cancel khi còn enrollment chưa xử lý |
| E-CLS-06 | 403 | Cancel lớp ongoing không có approval |

## 9. Test scenarios

| # | Scenario | Kỳ vọng |
|---|----------|---------|
| T1 | Wizard hoàn tất | Class + schedules + 48 sessions + teachers trong 1 transaction; fail bước nào rollback hết |
| T2 | Transfer HV học 18/48 buổi | Enrollment mới 30 buổi; tổng bảo toàn 48 |
| T3 | Transfer vào lớp đầy | 409 E-CLS-02 |
| T4 | Close khi 1 buổi chưa completed | 422 E-CLS-04 checks nêu rõ |
| T5 | Cancel lớp còn 2 enrollment | 409 E-CLS-05; sau khi chuyển hết 2 em → OK |
| T6 | Buổi 1 bắt đầu 18:00 | Lớp ongoing ≤ 18:05 |
| T7 | Code lớp | Đúng format, unique khi tạo song song |
