# SRS-EDU-11 — Session (Buổi học)

> Software Requirements Specification — Hana Edu
>
> Version 1.0 | 2026-07-08 | Draft | Tham chiếu: `BRD - Education.md` § EDU-11

---

## 1. Giới thiệu

### 1.1 Mục đích

Đặc tả runtime buổi học: trạng thái, thao tác GV (start/complete), hủy + buổi bù, offline-first cho Teacher App.

### 1.2 Phạm vi

Vòng đời session, teacher note, bulk cancel, scheduler, API Teacher App. Sinh session: SRS-EDU-10; điểm danh: SRS-EDU-12.

## 2. Mô tả tổng quan

- State machine: `scheduled → ongoing → completed`; `scheduled|ongoing → cancelled` (sinh make-up).
- Scheduler (mỗi phút): `scheduled AND start_at ≤ now` → ongoing; nhắc GV nếu ongoing quá X phút chưa điểm danh.
- Nguồn dữ liệu cho: giờ dạy HR, used_sessions, tiến độ lớp.

## 3. Yêu cầu chức năng chi tiết

### FR-01 Danh sách & chi tiết

- `GET /classes/{id}/sessions`: số thứ tự, ngày giờ, phòng, GV (+substitute), status, attendance_summary {present, absent}.
- `GET /sessions/{id}`: + course_lesson (syllabus), teacher_note, homework giao trong buổi.
- Teacher App: `GET /api/teacher/me/sessions?date=today` — payload gọn, kèm danh sách học viên cho điểm danh offline.

### FR-02 Start / Complete (Teacher App)

- PATCH /start: chỉ GV của buổi (teacher/substitute); trong khung `start_at − X'` đến `end_at + X'` (Setting); set started_at.
- PATCH /complete: validate 100% học viên active có attendance → completed, completed_at → chuỗi hậu xử lý (transaction + events): `enrollments.used_sessions` update; event `SessionCompleted` (HR giờ dạy, Reporting); tiến độ lớp.

### FR-03 Teacher note

PUT /note: ghi chú nội dung thực dạy; cho sửa ≤ 48h sau completed_at.

### FR-04 Hủy & buổi bù

- PATCH /cancel {reason ≥ 10 ký tự}: từ scheduled/ongoing (chưa có attendance) → cancelled → tự tạo make-up session: ngày = slot kế tiếp sau buổi cuối của lớp, is_makeup=true, kế thừa session_number của buổi hủy? **Không** — buổi bù nhận số kế tiếp cuối chuỗi, buổi hủy giữ số nhưng loại khỏi đếm tiến độ. Conflict check như thường.
- POST /bulk-cancel {branch_id, date, reason}: hủy mọi buổi scheduled/ongoing trong ngày của chi nhánh (bão, sự kiện) — queue xử lý từng buổi + tổng hợp thông báo.

### FR-05 Offline-first (Teacher App)

- App cache sessions hôm nay + roster khi mở app (hoặc pre-fetch 6h sáng).
- Thao tác start/attendance/complete ghi local queue; sync khi online theo thứ tự; server xử lý idempotent (client_request_id).
- Conflict: server-wins; app hiển thị cảnh báo diff.

## 4. Use Case chính

**UC-03 Nghỉ bão:** Giáo vụ bulk-cancel 12 buổi ngày 20/07 chi nhánh Q12 → 12 make-up sinh cuối chuỗi từng lớp → 1 thông báo gộp/phụ huynh (không spam 12 tin) → dashboard hiển thị 12 buổi bù chờ xác nhận lịch.

## 5. API Specification

| Method | Path | Quyền |
|--------|------|-------|
| GET | /api/edu/classes/{id}/sessions | view |
| GET | /api/edu/sessions/{id} | view |
| PATCH | /api/edu/sessions/{id}/start | session.start (GV buổi) |
| PATCH | /api/edu/sessions/{id}/complete | session.start (GV buổi) |
| PATCH | /api/edu/sessions/{id}/cancel | session.manage |
| POST | /api/edu/sessions/bulk-cancel | session.manage (Manager) |
| PUT | /api/edu/sessions/{id}/note | GV buổi |
| GET | /api/teacher/me/sessions | Teacher App |

```json
// PATCH /complete — 422 thiếu điểm danh
{
  "success": false,
  "errors": { "code": "E-SES-02", "missing_students": [{ "id": 7, "name": "Bé An" }] }
}
```

## 6. Yêu cầu dữ liệu

`class_sessions`: id, business_id, class_id FK, session_number smallint, course_lesson_id FK null, classroom_id FK, teacher_id FK, substitute_teacher_id FK null, start_at datetime, end_at datetime, status enum(scheduled,ongoing,completed,cancelled) index, is_makeup bool, makeup_for_session_id FK null (self), cancel_reason null, teacher_note text null, started_at/completed_at null, client_request_id varchar null (idempotency), timestamps.

Index: (class_id, session_number), (classroom_id, start_at), (teacher_id, start_at), (status, start_at) cho scheduler.

## 7. Yêu cầu phi chức năng

- Scheduler batch update 1 query, chạy mỗi phút, sai số ≤ 1 phút; lock tránh chạy chồng (cache lock).
- Sync offline: endpoint chấp nhận batch tối đa 50 thao tác, xử lý tuần tự, trả kết quả từng item.
- Bulk cancel 50 buổi < 30s (queue), thông báo gộp theo phụ huynh.

## 8. Mã lỗi

| Code | HTTP | Ý nghĩa |
|------|------|---------|
| E-SES-01 | 403 | Không phải GV của buổi |
| E-SES-02 | 422 | Complete khi thiếu điểm danh |
| E-SES-03 | 422 | Start ngoài khung giờ cho phép |
| E-SES-04 | 409 | Cancel buổi completed / đã có attendance |
| E-SES-05 | 409 | Make-up conflict lịch (kèm đề xuất slot) |
| E-SES-06 | 422 | Sửa note quá 48h |

## 9. Test scenarios

| # | Scenario | Kỳ vọng |
|---|----------|---------|
| T1 | Buổi đến giờ | ongoing ≤ 1 phút |
| T2 | Complete thiếu 2 điểm danh | 422 kèm 2 học viên |
| T3 | Cancel buổi 10 | Make-up cuối chuỗi, tổng buổi lớp không đổi |
| T4 | GV khác bấm start | 403 E-SES-01 |
| T5 | Offline: start + điểm danh + complete rồi sync | Server nhận đúng thứ tự, idempotent khi retry |
| T6 | Bulk cancel 12 buổi | 12 make-up + 1 notification gộp/PH |
| T7 | Complete xong | used_sessions +1 đúng học viên present/late; HR nhận event giờ dạy |
