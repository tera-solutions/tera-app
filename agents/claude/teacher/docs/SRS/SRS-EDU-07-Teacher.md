# SRS-EDU-07 — Teacher (Hồ sơ & Phân công)

> Software Requirements Specification — Hana Edu
>
> Version 1.0 | 2026-07-08 | Draft | Tham chiếu: `BRD - Education.md` § EDU-07

---

## 1. Giới thiệu

### 1.1 Mục đích

Đặc tả hồ sơ chuyên môn giáo viên và phân công giảng dạy (lớp/buổi), tách biệt hồ sơ nhân sự (HR).

### 1.2 Phạm vi

Hồ sơ chuyên môn, môn được dạy, phân công lớp (chính/trợ giảng), dạy thay theo buổi, lịch dạy, giờ dạy. Không gồm: hợp đồng/lương (HR).

## 2. Mô tả tổng quan

- Nguồn: `employees` (HR) — 1 employee : 1 teacher profile.
- Consumer: classes, class_sessions, Teacher App, HR Payroll (giờ dạy).
- Ràng buộc chính: không trùng lịch dạy; đúng môn được phép dạy.

## 3. Yêu cầu chức năng chi tiết

### FR-01 Danh sách

Filter: type (vietnamese/native/assistant), subject_id, branch_id (theo employee), status; kèm classes_count đang dạy.

### FR-02 CRUD hồ sơ chuyên môn

Input: employee_id (unique), type, degree, certificates[] ({name, file_url, issued_date}), subject_ids[] (≥1), bio, avatar. File pdf/jpg ≤ 5MB.

### FR-03 Phân công lớp

- POST `/api/edu/classes/{id}/teachers` {teacher_id, role: main|assistant, from_date}.
- Validate: teacher active; subject của course lớp ∈ teacher_subjects; check trùng lịch toàn bộ session tương lai của lớp (gọi `TeacherService::isAvailable` từng buổi).
- 1 lớp đúng 1 main tại một thời điểm; gán main mới → main cũ set to_date, ghi change_reason.
- Update `class_sessions.teacher_id` các buổi tương lai.

### FR-04 Dạy thay theo buổi

PUT `/api/edu/sessions/{id}/teacher` {substitute_teacher_id, reason} — chỉ buổi scheduled/ongoing; check trùng lịch GV thay; giữ nguyên teacher_id gốc, ghi substitute.

### FR-05 Lịch dạy & giờ dạy

- `GET /teachers/{id}/schedule?from=&to=` — session thuộc GV (kể cả dạy thay).
- `GET /teachers/{id}/teaching-hours?month=` — tổng giờ = Σ duration buổi completed mà GV thực dạy (substitute ưu tiên); breakdown theo lớp; export cho HR.

### FR-06 Service check trùng lịch (nội bộ)

```
TeacherService::isAvailable(teacher_id, start_at, end_at, exclude_session_id?)
```
Giao thời gian với session ≠ cancelled mà GV là teacher hoặc substitute → false.

## 4. Use Case chính

**UC-03 Dạy thay:** GV chính báo ốm → Giáo vụ mở buổi 15/07 → chọn GV B → hệ thống check lịch B rảnh → lưu → push Teacher App cho B (nhận buổi) và A (được thay), Parent App thông báo đổi GV.

## 5. API Specification

| Method | Path | Quyền |
|--------|------|-------|
| GET/POST | /api/edu/teachers | view / manage |
| GET/PUT/DELETE | /api/edu/teachers/{id} | view / manage |
| GET | /api/edu/teachers/{id}/schedule | view (self hoặc quản lý) |
| GET | /api/edu/teachers/{id}/teaching-hours | teaching-hours |
| POST | /api/edu/classes/{id}/teachers | edu.teacher.assign |
| DELETE | /api/edu/classes/{id}/teachers/{tid} | edu.teacher.assign |
| PUT | /api/edu/sessions/{id}/teacher | edu.teacher.assign |
| GET | /api/teacher/me/schedule?date= | Teacher App (self) |

```json
// POST /classes/12/teachers — Response 409 trùng lịch
{
  "success": false,
  "errors": {
    "code": "E-TCH-02",
    "conflicts": [{ "session_id": 501, "start_at": "2026-07-15 18:00", "with_class": "PHO2-2606-02" }]
  }
}
```

## 6. Yêu cầu dữ liệu

`teachers`: id, business_id, employee_id FK unique, type enum, degree varchar(100), certificates json, bio text, avatar, status enum(active,inactive), timestamps, deleted_at.

`teacher_subjects`: teacher_id FK, subject_id FK. Unique cặp.

`class_teachers`: id, class_id FK, teacher_id FK, role enum(main,assistant), from_date, to_date null, change_reason varchar(255) null, timestamps. Index (teacher_id, class_id).

Trên `class_sessions`: teacher_id, substitute_teacher_id (SRS-EDU-11).

## 7. Yêu cầu phi chức năng

- Check trùng lịch cho phân công lớp 48 buổi < 1s (1 query gộp thay vì 48 query).
- Giờ dạy tính từ dữ liệu session completed — job đối soát hàng đêm với HR.
- Employee inactive (HR event `EmployeeTerminated`) → auto inactive teacher + alert danh sách lớp đang phụ trách.

## 8. Mã lỗi

| Code | HTTP | Ý nghĩa |
|------|------|---------|
| E-TCH-01 | 422 | Sai môn được dạy |
| E-TCH-02 | 409 | Trùng lịch dạy (kèm conflicts) |
| E-TCH-03 | 422 | employee_id đã có teacher profile |
| E-TCH-04 | 409 | Đổi GV lớp đã completed |
| E-TCH-05 | 422 | Dạy thay buổi đã completed/cancelled |

## 9. Test scenarios

| # | Scenario | Kỳ vọng |
|---|----------|---------|
| T1 | Phân công GV trùng 3 buổi với lớp khác | 409 kèm 3 conflicts |
| T2 | Phân công GV không dạy môn của course | 422 E-TCH-01 |
| T3 | Gán main mới | Main cũ có to_date, sessions tương lai đổi GV, buổi đã học giữ nguyên |
| T4 | Dạy thay 1 buổi | Chỉ buổi đó đổi; teaching-hours tháng tính cho GV thay |
| T5 | Employee nghỉ việc | Teacher inactive, alert lớp đang dạy |
| T6 | Giờ dạy tháng | = Σ duration buổi completed thực dạy, khớp export HR |
