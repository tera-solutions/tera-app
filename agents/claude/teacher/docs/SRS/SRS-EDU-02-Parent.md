# SRS-EDU-02 — Parent Management

> Software Requirements Specification — Hana Edu
>
> Version 1.0 | 2026-07-08 | Draft | Tham chiếu: `BRD - Education.md` § EDU-02

---

## 1. Giới thiệu

### 1.1 Mục đích

Đặc tả chức năng quản lý phụ huynh và quan hệ Parent–Student (n–n), nền tảng cho liên lạc, thanh toán và Parent App.

### 1.2 Phạm vi

CRUD phụ huynh, liên kết học viên, phụ huynh chính, merge hồ sơ, tài khoản Parent App. Không bao gồm: thanh toán (Finance), nội dung Parent App (SRS riêng của App).

## 2. Mô tả tổng quan

### 2.1 User Classes

Admin/Manager/Giáo vụ (CRUD); Teacher (read, SĐT mask); Parent (tự sửa thông tin cơ bản).

### 2.2 Ràng buộc thiết kế

- SĐT là định danh duy nhất per business — mọi flow tạo phải check trước.
- Parent App đăng nhập bằng SĐT + OTP; 1 tài khoản thấy tất cả con.

### 2.3 Phụ thuộc

SRS-EDU-01 (students); System (users, OTP service); Notification (SMS).

## 3. Yêu cầu chức năng chi tiết

### FR-01 Danh sách phụ huynh

Input: keyword (tên/SĐT/email), branch_id, has_app_account; phân trang. Output: id, full_name, phone (mask theo quyền), email, children_count, app_status. Search SĐT: exact + suffix match (4 số cuối).

### FR-02 CRUD + check trùng SĐT realtime

- `GET /check-phone?phone=` trả `{exists, parent?}` — FE gọi debounce 400ms khi nhập.
- Tạo: full_name, phone (unique), email?, address?, job?, note?.
- Trùng → 422 `E-PAR-01` kèm hồ sơ trùng để FE mở nhanh.

### FR-03 Liên kết học viên

- POST link: {student_id, relationship, is_primary}. Nếu is_primary=true → transaction bỏ cờ primary cũ của student đó.
- DELETE unlink: chặn nếu là phụ huynh duy nhất của student (`E-PAR-03`).
- Ràng buộc: unique (parent_id, student_id).

### FR-04 Chi tiết

Tab data: hồ sơ; children[] (kèm lớp, trạng thái); payment history (proxy Finance `GET /api/fin/payments?payer_parent_id=`); communication log (Notification).

### FR-05 Tài khoản Parent App

POST account → tạo user role Parent (username=phone), gửi OTP kích hoạt qua SMS; reset gửi lại OTP. Rate limit 3 OTP/15 phút.

### FR-06 Merge hồ sơ trùng

- Input: source_id, target_id. Chuyển toàn bộ parent_student, cập nhật payer trên invoice (Finance API), chuyển user app nếu target chưa có; soft delete source, ghi `parent_merge_logs`.
- Chạy transaction + queue bước gọi Finance (saga, có compensating log).

## 4. Use Case chính

### UC-02 Liên kết con thứ hai

1. Giáo vụ mở học viên mới → tab Phụ huynh → "Liên kết phụ huynh có sẵn".
2. Nhập SĐT → hệ thống tìm thấy → chọn relationship=mother, is_primary=true.
3. Hệ thống bỏ primary cũ (nếu có), tạo liên kết, push Parent App "Đã liên kết bé B".

**Exception:** SĐT không tồn tại → gợi ý tạo mới inline.

## 5. API Specification

| # | Method | Path | Quyền |
|---|--------|------|-------|
| 1 | GET | /api/edu/parents | edu.parent.view |
| 2 | POST | /api/edu/parents | edu.parent.create |
| 3 | GET | /api/edu/parents/check-phone | edu.parent.create |
| 4 | GET/PUT/DELETE | /api/edu/parents/{id} | view/update/delete |
| 5 | POST | /api/edu/parents/{id}/students | edu.parent.link-student |
| 6 | DELETE | /api/edu/parents/{id}/students/{sid} | edu.parent.link-student |
| 7 | POST | /api/edu/parents/{id}/account | edu.parent.update |
| 8 | POST | /api/edu/parents/merge | edu.parent.merge |

**Ví dụ — POST /{id}/students**

```json
// Request
{ "student_id": 101, "relationship": "mother", "is_primary": true }
// Response 200
{ "success": true, "data": { "parent_id": 55, "student_id": 101, "is_primary": true } }
```

## 6. Yêu cầu dữ liệu

`parents`: id, business_id, branch_id, full_name varchar(100), phone varchar(15) unique per business, email null, address, job, note, user_id FK null, timestamps, deleted_at. Index: (business_id, phone), fulltext full_name.

`parent_student`: id, parent_id FK, student_id FK, relationship enum(father,mother,grandparent,guardian), is_primary bool, timestamps. Unique (parent_id, student_id). Partial constraint: mỗi student chỉ 1 is_primary=true (enforce ở service + unique index (student_id) WHERE is_primary — MySQL: kiểm tra transaction).

`parent_merge_logs`: source_id, target_id, moved_links json, performed_by, created_at.

## 7. Yêu cầu phi chức năng

- SĐT mask `093***1234` với role không có `edu.parent.view-phone`.
- OTP: 6 số, TTL 5 phút, hash trong DB.
- Merge: atomic phần Education; bước Finance async có retry + báo lỗi thủ công nếu fail.

## 8. Mã lỗi

| Code | HTTP | Ý nghĩa |
|------|------|---------|
| E-PAR-01 | 422 | SĐT đã tồn tại |
| E-PAR-02 | 409 | Không thể xóa — còn con đang học/công nợ |
| E-PAR-03 | 409 | Không thể hủy liên kết — phụ huynh duy nhất |
| E-PAR-04 | 422 | Merge chính nó / hồ sơ đã xóa |
| E-PAR-05 | 429 | Quá giới hạn gửi OTP |

## 9. Test scenarios

| # | Scenario | Kỳ vọng |
|---|----------|---------|
| T1 | Tạo 2 phụ huynh cùng SĐT | Cái sau 422 E-PAR-01 |
| T2 | Set is_primary con đã có primary khác | Primary cũ bị bỏ, chỉ còn 1 |
| T3 | Unlink phụ huynh duy nhất | 409 E-PAR-03 |
| T4 | Merge 2 hồ sơ cùng liên kết 1 student | Sau merge chỉ 1 liên kết |
| T5 | Teacher xem chi tiết phụ huynh | phone dạng mask |
| T6 | Gửi OTP lần 4 trong 15' | 429 E-PAR-05 |
| T7 | Đăng nhập Parent App | Thấy đủ tất cả con liên kết |
