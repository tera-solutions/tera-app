# SRS-EDU-05 — Level Management

> Software Requirements Specification — Hana Edu
>
> Version 1.0 | 2026-07-08 | Draft | Tham chiếu: `BRD - Education.md` § EDU-05

---

## 1. Giới thiệu

### 1.1 Mục đích

Đặc tả quản lý cấp độ đào tạo (Starters/Movers/Flyers...) với chuỗi lộ trình `next_level` phục vụ gợi ý học tiếp và placement.

### 1.2 Phạm vi

CRUD level, thứ bậc, next_level chain. Consumer: courses, gợi ý tái ghi danh, placement test (SRS-EDU-16).

## 2. Mô tả tổng quan

- User: Admin/Manager (manage); role đào tạo (view).
- Ràng buộc chính: chuỗi next_level không được tạo vòng lặp (validate đồ thị DAG).

## 3. Yêu cầu chức năng chi tiết

### FR-01 Danh sách

GET toàn bộ sort theo sort_order (thứ bậc thấp→cao), kèm courses_count, next_level {id, name}.

### FR-02 CRUD

Input: name (unique, 2–100), code, description?, age_from/to (3–18, from ≤ to), next_level_id? (≠ self), sort_order, status.

**Validate vòng lặp:** khi set next_level_id, duyệt chain tối đa 20 bước; gặp lại node xuất phát → `E-LVL-02`.

### FR-03 Sắp xếp thứ bậc

PATCH /sort như SRS-EDU-04.

### FR-04 Gợi ý lộ trình (service nội bộ)

`LevelService::nextCoursesFor(student)` — khi enrollment completed: lấy level khóa vừa xong → next_level → danh sách course active thuộc level đó → đẩy cho CRM/Notification tư vấn tái ghi danh.

## 4. Use Case chính

**UC-01:** Thiết lập Starters → Movers → Flyers; đặt tuổi khuyến nghị 6-8/8-10/9-11.

**UC-02:** Bé hoàn thành khóa Starters → hệ thống sinh gợi ý 2 khóa Movers active → Sales nhận task tư vấn.

## 5. API Specification

| Method | Path | Quyền |
|--------|------|-------|
| GET/POST | /api/edu/levels | view / manage |
| GET/PUT/DELETE | /api/edu/levels/{id} | view / manage |
| PATCH | /api/edu/levels/sort | manage |
| GET | /api/edu/levels/{id}/next-courses | view |

```json
// PUT /levels/5 — Request set next level
{ "name": "Movers", "next_level_id": 6, "age_from": 8, "age_to": 10 }
// 422 nếu vòng lặp
{ "success": false, "errors": { "code": "E-LVL-02", "chain": [5, 6, 5] } }
```

## 6. Yêu cầu dữ liệu

`levels`: id, business_id, code varchar(30), name varchar(100), description null, age_from/age_to tinyint, next_level_id FK self null (on delete set null), sort_order smallint, status enum(active,inactive), timestamps, deleted_at. Unique (business_id, name).

## 7. Yêu cầu phi chức năng

Cache như subjects. Validate chain chạy trong service, độ phức tạp O(n) với n ≤ 20.

## 8. Mã lỗi

| Code | HTTP | Ý nghĩa |
|------|------|---------|
| E-LVL-01 | 422 | Trùng tên / age range sai |
| E-LVL-02 | 422 | next_level tạo vòng lặp |
| E-LVL-03 | 409 | Xóa level đang được course dùng |

## 9. Test scenarios

| # | Scenario | Kỳ vọng |
|---|----------|---------|
| T1 | A→B→C→A | 422 E-LVL-02 |
| T2 | next_level = chính nó | 422 |
| T3 | Xóa level giữa chuỗi (không có course) | OK; level trước có next_level_id = null |
| T4 | Hoàn thành khóa Starters | Gợi ý trả về course thuộc Movers, chỉ course active |
| T5 | Xóa level có course | 409 E-LVL-03 |
