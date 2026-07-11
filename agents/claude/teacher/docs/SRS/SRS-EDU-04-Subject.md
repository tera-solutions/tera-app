# SRS-EDU-04 — Subject Management

> Software Requirements Specification — Hana Edu
>
> Version 1.0 | 2026-07-08 | Draft | Tham chiếu: `BRD - Education.md` § EDU-04

---

## 1. Giới thiệu

### 1.1 Mục đích

Đặc tả quản lý danh mục môn học/chương trình (Cambridge, Jolly Phonics, Giao tiếp...) — dimension phân loại cho course và báo cáo.

### 1.2 Phạm vi

CRUD subject, sắp xếp thứ tự, trạng thái. Master data đơn giản, không workflow.

## 2. Mô tả tổng quan

- User: Admin/Manager (manage); mọi role đào tạo (view).
- Phụ thuộc: không (bảng gốc). Consumer: courses, teacher_subjects, Reporting, Website.
- Ràng buộc: cache Redis; xóa bị chặn khi có course tham chiếu.

## 3. Yêu cầu chức năng chi tiết

### FR-01 Danh sách

GET trả toàn bộ (không phân trang — dữ liệu nhỏ), sort theo sort_order; kèm courses_count. Filter status.

### FR-02 CRUD

- Input: name (unique per business, 2–100), code (unique, không dấu, auto-slug từ name nếu bỏ trống), description?, icon (chọn từ icon set), color (hex), status.
- Delete: soft delete; chặn khi courses_count > 0 (`E-SBJ-02`).
- Inactive: ẩn khỏi dropdown tạo mới; course cũ giữ hiển thị tên bình thường.

### FR-03 Sắp xếp

`PATCH /sort` nhận mảng id theo thứ tự mới → cập nhật sort_order bulk. Áp dụng cho dropdown + thứ tự hiển thị Website.

## 4. Use Case chính

**UC-01:** Admin tạo "Jolly Phonics" (icon 🔤, màu #0066CC) → xuất hiện ngay trong form tạo course.

**UC-02:** Kéo Cambridge lên đầu → Website đổi thứ tự chương trình sau invalidate cache.

## 5. API Specification

| Method | Path | Quyền |
|--------|------|-------|
| GET | /api/edu/subjects | edu.subject.view |
| POST | /api/edu/subjects | edu.subject.manage |
| GET/PUT/DELETE | /api/edu/subjects/{id} | view / manage |
| PATCH | /api/edu/subjects/sort | edu.subject.manage |

```json
// PATCH /sort — Request
{ "ids": [3, 1, 2] }
// Response
{ "success": true, "data": [{ "id": 3, "sort_order": 0 }, { "id": 1, "sort_order": 1 }, { "id": 2, "sort_order": 2 }] }
```

## 6. Yêu cầu dữ liệu

`subjects`: id, business_id FK, code varchar(30), name varchar(100), description text null, icon varchar(50) null, color char(7) null, sort_order smallint default 0, status enum(active,inactive) default active, timestamps, deleted_at. Unique (business_id, name), (business_id, code).

## 7. Yêu cầu phi chức năng

Cache `subjects:{business_id}` invalidate mọi thao tác ghi; response list < 100ms (cache hit).

## 8. Mã lỗi

| Code | HTTP | Ý nghĩa |
|------|------|---------|
| E-SBJ-01 | 422 | Trùng tên/code |
| E-SBJ-02 | 409 | Xóa subject đang có course |

## 9. Test scenarios

| # | Scenario | Kỳ vọng |
|---|----------|---------|
| T1 | Tạo trùng tên | 422 E-SBJ-01 |
| T2 | Xóa subject có 3 course | 409 kèm count |
| T3 | Inactive | Biến mất khỏi dropdown course mới; course cũ vẫn hiển thị đúng |
| T4 | Sort mới | Thứ tự giữ đúng sau reload + trên Website |
