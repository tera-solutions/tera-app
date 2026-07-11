# SRS-EDU-10 — Timetable

> Software Requirements Specification — Hana Edu
>
> Version 1.0 | 2026-07-08 | Draft | Tham chiếu: `BRD - Education.md` § EDU-10

---

## 1. Giới thiệu

### 1.1 Mục đích

Đặc tả thiết lập lịch tuần của lớp, thuật toán sinh buổi học (né ngày lễ, chống xung đột phòng/GV), đổi lịch và calendar tổng.

### 1.2 Phạm vi

class_schedules (slot tuần), generate/regenerate sessions, reschedule 1 buổi, holidays, calendar view. Session runtime: SRS-EDU-11.

## 2. Mô tả tổng quan

- Input nghiệp vụ: slots tuần + start_date + total_sessions → output: danh sách class_sessions ngày giờ cụ thể.
- Bất biến: không có 2 session giao thời gian cùng phòng physical hoặc cùng GV (kể cả substitute).
- Nguyên tắc generate: all-or-nothing.

## 3. Yêu cầu chức năng chi tiết

### FR-01 Slot tuần

PUT `/classes/{id}/timetable` [{day_of_week 1–7, start_time, end_time, classroom_id, teacher_id}]. Validate: end > start ≥ 30'; slot không tự trùng nhau trong lớp.

### FR-02 Thuật toán preview/generate

```
date = start_date; count = 0; sessions = []
while count < total_sessions:
    if dayOfWeek(date) ∈ slots:
        slot = slots[dayOfWeek(date)]
        if isHoliday(date): skipped.push(date)
        else:
            sessions.push({date, slot, session_number: ++count})
    date++
```
- Sau khi dựng danh sách: batch check conflict phòng + GV (2 query gộp theo khoảng thời gian) → nếu ≥1 conflict trả toàn bộ danh sách conflict, không ghi gì.
- Generate: bulk insert `class_sessions` trong transaction có `FOR UPDATE` các hàng session xung khắc tiềm năng (khóa theo classroom + teacher + khoảng ngày).
- Preview trả về cả `skipped_holidays[]` để FE hiển thị.

### FR-03 Regenerate (sửa lịch tuần giữa khóa)

- Chỉ tác động session `scheduled` tương lai (status scheduled AND start_at > now AND chưa có attendance/homework gắn).
- Xóa các buổi đó, generate lại từ buổi kế tiếp với slot mới, giữ liên tục session_number.
- Buổi có dữ liệu gắn (đã điểm danh trước, có homework) → liệt kê, yêu cầu xử lý tay.

### FR-04 Reschedule 1 buổi

PUT `/sessions/{id}/reschedule` {start_at, end_at, classroom_id?, teacher_id?, reason}. Validate: buổi scheduled; conflict check; notify phụ huynh + GV trước tối thiểu Setting `edu.timetable.min_notice_hours`.

### FR-05 Holidays

CRUD `/api/edu/holidays` {date, name, is_recurring}. Job đêm: phát hiện session scheduled rơi vào holiday mới thêm → alert Giáo vụ xác nhận dời (không tự dời).

### FR-06 Calendar tổng

GET `/api/edu/timetable?branch=&from=&to=&classroom_id?&teacher_id?&class_id?` → sessions dạng calendar event. Giới hạn khoảng ≤ 62 ngày.

## 4. Use Case chính

**UC-01:** Lớp T3/T5 18:00–19:30, khai giảng 04/08/2026 (T3), 48 buổi; lễ 02/09 (T4 — không ảnh hưởng): preview 48 buổi kết thúc ~15/01/2027; nếu 1 buổi rơi lễ → dời toàn chuỗi 1 slot về sau.

**UC-02:** Đổi lịch từ tháng 10 sang T2/T4: 28 buổi đã học giữ nguyên; 20 buổi scheduled bị xóa và sinh lại theo slot mới, số thứ tự 29–48 liên tục.

## 5. API Specification

| Method | Path | Quyền |
|--------|------|-------|
| GET/PUT | /api/edu/classes/{id}/timetable | view / manage |
| POST | /api/edu/classes/{id}/timetable/preview | manage |
| POST | /api/edu/classes/{id}/timetable/generate | manage |
| POST | /api/edu/classes/{id}/timetable/regenerate | manage |
| PUT | /api/edu/sessions/{id}/reschedule | manage |
| GET | /api/edu/timetable | view |
| GET/POST/DELETE | /api/edu/holidays | manage (System Setting) |

```json
// POST /timetable/preview — Response
{
  "success": true,
  "data": {
    "sessions": [{ "session_number": 1, "date": "2026-08-04", "start": "18:00", "end": "19:30", "classroom": "P.101", "teacher": "Ms. Lan" }],
    "skipped_holidays": [{ "date": "2026-09-02", "name": "Quốc khánh" }],
    "conflicts": []
  }
}
```

## 6. Yêu cầu dữ liệu

`class_schedules`: id, class_id FK, day_of_week tinyint, start_time time, end_time time, classroom_id FK, teacher_id FK, timestamps.

`holidays`: id, business_id, date date, name, is_recurring bool. Unique (business_id, date).

Index phục vụ conflict: `class_sessions (classroom_id, start_at)`, `(teacher_id, start_at)`.

## 7. Yêu cầu phi chức năng

- Preview/generate 500 buổi < 5s; conflict check gộp ≤ 4 query.
- Transaction generate serializable với phạm vi khóa hẹp (theo classroom/teacher + date range) để tránh chặn toàn hệ thống.
- Reschedule notify: enqueue ngay, kênh theo Setting; ghi notification log.

## 8. Mã lỗi

| Code | HTTP | Ý nghĩa |
|------|------|---------|
| E-TTB-01 | 422 | Slot không hợp lệ / tự trùng |
| E-TTB-02 | 409 | Conflict phòng/GV (kèm danh sách) |
| E-TTB-03 | 422 | start_date không khớp slot nào |
| E-TTB-04 | 409 | Regenerate đụng buổi có dữ liệu |
| E-TTB-05 | 422 | Reschedule buổi đã diễn ra |
| E-TTB-06 | 422 | Notice time < cấu hình tối thiểu |

## 9. Test scenarios

| # | Scenario | Kỳ vọng |
|---|----------|---------|
| T1 | Generate 48 buổi có 1 lễ | 48 buổi, bỏ ngày lễ, dời bù; preview = generate 100% |
| T2 | Conflict 1 buổi giữa chuỗi | Không insert buổi nào, trả conflict |
| T3 | Regenerate giữ session_number liên tục | 1..48 không đứt/trùng |
| T4 | Reschedule sang giờ GV bận | 409 E-TTB-02 |
| T5 | Thêm holiday sau generate | Alert liệt kê đúng buổi ảnh hưởng |
| T6 | Calendar 90 ngày | 422 (giới hạn 62) |
| T7 | 2 lớp generate song song cùng phòng | Không sinh cặp buổi trùng |
