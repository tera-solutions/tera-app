# SRS-EDU-06 — Classroom Management

> Software Requirements Specification — Hana Edu
>
> Version 1.0 | 2026-07-08 | Draft | Tham chiếu: `BRD - Education.md` § EDU-06

---

## 1. Giới thiệu

### 1.1 Mục đích

Đặc tả quản lý phòng học vật lý/online theo chi nhánh, cung cấp ràng buộc chống trùng phòng cho xếp lịch và view công suất.

### 1.2 Phạm vi

CRUD phòng, trạng thái bảo trì, calendar sử dụng phòng. Logic check trùng được gọi từ SRS-EDU-10/11.

## 2. Mô tả tổng quan

- User: Admin/Manager (manage phòng chi nhánh mình); Giáo vụ (view + chọn khi xếp lịch).
- Ràng buộc: phòng physical không được trùng lịch; phòng online bỏ qua check trùng và capacity.

## 3. Yêu cầu chức năng chi tiết

### FR-01 Danh sách

Filter branch_id, type, status; kèm sessions_this_week (đếm buổi tuần hiện tại).

### FR-02 CRUD

Input: name (unique per branch), type enum(physical, online), capacity (1–100, bắt buộc với physical), equipment (multi-select: TV, projector, AC, whiteboard...), note.

### FR-03 Bảo trì

PATCH status: {status: maintenance, maintenance_from, maintenance_to}. Khi set: query các session tương lai của phòng trong khoảng → trả danh sách cần đổi phòng cho Giáo vụ xử lý (không tự đổi).

### FR-04 Lịch phòng

`GET /{id}/schedule?week=2026-W28` → mảng session {class_name, start_at, end_at, teacher}. FE render weekly calendar.

### FR-05 Service check trùng (nội bộ, dùng bởi EDU-10/11)

```
ClassroomService::isAvailable(classroom_id, start_at, end_at, exclude_session_id?)
```
- Phòng online → luôn true.
- Phòng maintenance trong khoảng → false (reason=maintenance).
- Tồn tại session giao thời gian (start < end2 AND end > start2, status ≠ cancelled) → false kèm session xung đột.
- Chạy trong transaction với `SELECT ... FOR UPDATE` khi ghi lịch.

## 4. Use Case chính

**UC-02 Bảo trì:** Manager đặt P.102 maintenance 14–20/07 → hệ thống liệt kê 6 buổi bị ảnh hưởng → Giáo vụ đổi các buổi sang P.103 (qua EDU-10 reschedule) → phụ huynh nhận thông báo đổi phòng.

## 5. API Specification

| Method | Path | Quyền |
|--------|------|-------|
| GET/POST | /api/edu/classrooms | view / manage |
| GET/PUT/DELETE | /api/edu/classrooms/{id} | view / manage |
| PATCH | /api/edu/classrooms/{id}/status | manage |
| GET | /api/edu/classrooms/{id}/schedule | view |

```json
// PATCH status — Response khi có buổi bị ảnh hưởng
{
  "success": true,
  "data": { "status": "maintenance" },
  "message": "6 buổi học cần đổi phòng",
  "affected_sessions": [{ "id": 90, "class": "CAM1-2607-01", "start_at": "2026-07-15 18:00" }]
}
```

## 6. Yêu cầu dữ liệu

`classrooms`: id, business_id, branch_id FK, name varchar(50), type enum(physical,online), capacity tinyint null, equipment json, note, status enum(available,maintenance), maintenance_from/to datetime null, timestamps, deleted_at. Unique (branch_id, name).

Check trùng dựa trên index `class_sessions (classroom_id, start_at)`.

## 7. Yêu cầu phi chức năng

isAvailable < 50ms; race condition được loại trừ bằng row lock ở bước ghi session (SRS-EDU-10 §7).

## 8. Mã lỗi

| Code | HTTP | Ý nghĩa |
|------|------|---------|
| E-ROM-01 | 422 | Trùng tên phòng trong chi nhánh |
| E-ROM-02 | 409 | Xóa phòng còn lịch tương lai |
| E-ROM-03 | 409 | Phòng bận/bảo trì (từ check xếp lịch) |
| E-ROM-04 | 422 | Khoảng bảo trì không hợp lệ |

## 9. Test scenarios

| # | Scenario | Kỳ vọng |
|---|----------|---------|
| T1 | 2 buổi 18:00–19:30 và 19:00–20:30 cùng phòng | Buổi 2 bị chặn E-ROM-03 |
| T2 | 2 buổi liền kề 18:00–19:30 và 19:30–21:00 | OK (không giao nhau) |
| T3 | Phòng online trùng giờ | OK |
| T4 | Xếp lịch vào khoảng maintenance | E-ROM-03 reason=maintenance |
| T5 | Xóa phòng có buổi tuần sau | 409 E-ROM-02 |
| T6 | Concurrency 2 giáo vụ xếp cùng slot | 1 thành công, 1 nhận 409 |
