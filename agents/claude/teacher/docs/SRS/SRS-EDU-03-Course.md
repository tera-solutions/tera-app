# SRS-EDU-03 — Course Management

> Software Requirements Specification — Hana Edu
>
> Version 1.0 | 2026-07-08 | Draft | Tham chiếu: `BRD - Education.md` § EDU-03

---

## 1. Giới thiệu

### 1.1 Mục đích

Đặc tả quản lý danh mục khóa học — đơn vị bán hàng và tổ chức đào tạo, kèm syllabus theo buổi.

### 1.2 Phạm vi

CRUD course, syllabus (course_lessons), trạng thái, publish website, duplicate. Giá bán thuộc Finance (chỉ tham chiếu product_id).

## 2. Mô tả tổng quan

- User: Admin/Manager (CRUD, publish); Giáo vụ/Sales (read); Website (public API).
- Phụ thuộc: SRS-EDU-04 (subjects), SRS-EDU-05 (levels), Finance (products), Website module.
- Ràng buộc: chỉ course `active` được mở lớp/báo giá; cache Redis key `courses:{business}` TTL 1h, invalidate khi ghi.

## 3. Yêu cầu chức năng chi tiết

### FR-01 Danh sách

Filter: subject_id, level_id, status, is_published, keyword. Output kèm: classes_count (đang chạy), students_count.

### FR-02 CRUD

Input: name, course_code (unique, `[a-zA-Z0-9-]{2,20}`), subject_id, level_id, total_sessions (1–500), duration_minutes (30–300), age_from/to (3–18), description (rich text, sanitize HTML), image (≤5MB, auto thumbnail), product_id?.

### FR-03 Syllabus

- `PUT /{id}/lessons` nhận mảng [{order, title, objective, materials}] — replace toàn bộ (diff ở FE), transaction.
- Import từ xlsx template; warning nếu số bài < total_sessions.
- Kéo thả đổi order → gửi lại mảng.

### FR-04 Trạng thái

State machine: `draft → active → inactive → active`. Guard: active→inactive chặn khi tồn tại class status=ongoing (`E-CRS-02`); active yêu cầu đủ trường bắt buộc + ≥1 lesson (warning cho phép bỏ qua bởi Admin).

### FR-05 Publish website

`is_published` chỉ set true khi status=active. Public API trả bản rút gọn (không lộ product_id, số nội bộ).

### FR-06 Duplicate

POST /{id}/duplicate → copy course (code mới nhập tay hoặc auto `-v2`) + toàn bộ lessons; status=draft, is_published=false.

## 4. Use Case chính

**UC-01 Tạo & kích hoạt khóa mới:** Manager tạo draft → nhập syllabus 48 buổi (import xlsx) → PATCH active → khóa xuất hiện trong wizard mở lớp và dropdown báo giá CRM.

**UC-04 Thay giáo trình:** duplicate khóa cũ → sửa syllabus → active bản mới → inactive bản cũ (sau khi các lớp ongoing kết thúc).

## 5. API Specification

| Method | Path | Quyền |
|--------|------|-------|
| GET/POST | /api/edu/courses | view / manage |
| GET/PUT/DELETE | /api/edu/courses/{id} | view / manage |
| PATCH | /api/edu/courses/{id}/status | manage |
| POST | /api/edu/courses/{id}/duplicate | manage |
| GET/PUT | /api/edu/courses/{id}/lessons | view / manage |
| POST | /api/edu/courses/{id}/lessons/import | manage |
| GET | /api/website/courses · /{slug} | public |

**Ví dụ — PATCH status**

```json
// Request
{ "status": "inactive" }
// Response 409 khi còn lớp chạy
{ "success": false, "message": "Không thể ngừng khóa học", "errors": { "code": "E-CRS-02", "ongoing_classes": ["CAM1-2607-01"] } }
```

## 6. Yêu cầu dữ liệu

`courses`: id, business_id, course_code unique(business), name, slug unique (SEO), subject_id FK, level_id FK, product_id FK null, total_sessions smallint, duration_minutes smallint, age_from/age_to tinyint, description mediumtext, image, status enum(draft,active,inactive) index, is_published bool index, timestamps, deleted_at.

`course_lessons`: id, course_id FK cascade, order smallint, title varchar(200), objective text, materials text. Unique (course_id, order).

## 7. Yêu cầu phi chức năng

- Public API cache CDN 5 phút; invalidate qua purge hook khi publish/unpublish.
- Sanitize description chống XSS (allowlist tag).
- Ảnh: resize 1200w + 400w thumbnail, WebP.

## 8. Mã lỗi

| Code | HTTP | Ý nghĩa |
|------|------|---------|
| E-CRS-01 | 422 | Trùng course_code / dữ liệu không hợp lệ |
| E-CRS-02 | 409 | Inactive khi còn lớp ongoing |
| E-CRS-03 | 422 | Publish khóa chưa active |
| E-CRS-04 | 409 | Xóa khóa đã có lớp |
| E-CRS-05 | 422 | Syllabus: order trùng |

## 9. Test scenarios

| # | Scenario | Kỳ vọng |
|---|----------|---------|
| T1 | Inactive khóa còn lớp ongoing | 409 E-CRS-02 kèm danh sách lớp |
| T2 | Publish khóa draft | 422 E-CRS-03 |
| T3 | Duplicate | Bản sao đủ lessons, status draft, code mới |
| T4 | Bật is_published | Xuất hiện /api/website/courses ≤ 1 phút |
| T5 | Syllabus 40 bài / 48 buổi | Lưu OK kèm warning |
| T6 | Khóa inactive | Không xuất hiện trong wizard mở lớp |
