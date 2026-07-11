# BRD - Module Education (LMS)

> Business Requirements Document — Hana Edu / Hana English
>
> Version: 1.0 | Ngày: 2026-07-08 | Trạng thái: Draft
>
> API Prefix: `edu` | Tham chiếu: `Business Requirement.md` mục 3.3, `readme.md` mục 4 & 9

---

# 0. Tổng quan Module

## 0.1 Mục tiêu

Quản lý toàn bộ vòng đời đào tạo của trung tâm Anh ngữ: từ hồ sơ học viên/phụ huynh, danh mục khóa học, mở lớp, ghi danh, xếp lịch, điểm danh, bài tập, kiểm tra, nhập điểm đến cấp chứng chỉ.

## 0.2 Danh sách chức năng

| Mã | Chức năng | Nhóm |
|------|------------------------|----------------|
| EDU-01 | Student Management | Hồ sơ |
| EDU-02 | Parent Management | Hồ sơ |
| EDU-03 | Course Management | Danh mục |
| EDU-04 | Subject Management | Danh mục |
| EDU-05 | Level Management | Danh mục |
| EDU-06 | Classroom Management | Danh mục |
| EDU-07 | Teacher (hồ sơ & phân công) | Hồ sơ |
| EDU-08 | Class Management | Vận hành lớp |
| EDU-09 | Enrollment | Vận hành lớp |
| EDU-10 | Timetable | Vận hành lớp |
| EDU-11 | Session | Vận hành lớp |
| EDU-12 | Attendance | Học tập |
| EDU-13 | Homework | Học tập |
| EDU-14 | Homework Submission | Học tập |
| EDU-15 | Assignment (Chấm bài) | Học tập |
| EDU-16 | Examination | Đánh giá |
| EDU-17 | Score | Đánh giá |
| EDU-18 | Certificate | Đánh giá |

## 0.3 Actors chung

| Actor | Mô tả |
|-------|-------|
| Admin | Toàn quyền hệ thống, mọi chi nhánh |
| Manager | Quản lý trong phạm vi chi nhánh được gán |
| Academic Staff (Giáo vụ) | Vận hành đào tạo: lớp, lịch, ghi danh |
| Teacher | Giáo viên: điểm danh, giao bài, chấm điểm (qua Teacher App / Web) |
| Parent | Phụ huynh: xem tiến độ, điểm, chuyên cần (Parent App) |
| Student | Học viên: học bài, nộp bài, xem điểm (Student App) |
| System | Job tự động: nhắc lịch, sinh buổi học, tính chuyên cần |

## 0.4 ERD tổng thể module

```
courses ──< course_subjects >── subjects
   │                               │
   │        levels ────────────────┤
   ▼                               ▼
classes ──── classrooms      class_sessions ──── attendance
   │  │                            │
   │  └── teachers (class_teachers)│
   ▼                               ▼
enrollments ── students ── parent_student ── parents
                  │
                  ├── homework_submissions ──< homework >── class
                  ├── exam_results ──< examinations
                  ├── scores
                  └── certificates
```

## 0.5 Non-functional Requirements chung (áp dụng mọi chức năng)

- Response API < 500ms (P95), danh sách phân trang mặc định 20 bản ghi.
- Multi-tenant: mọi dữ liệu gắn `business_id`, `branch_id`; user chỉ thấy dữ liệu chi nhánh được phân quyền (Data Permission — module System).
- Mọi thao tác ghi được lưu Audit Log (module System).
- Soft delete cho toàn bộ entity nghiệp vụ (`deleted_at`).
- Chuẩn API: RESTful, response envelope `{ success, data, message, errors }`, xác thực Laravel Passport (Bearer token).
- Timezone: Asia/Ho_Chi_Minh; định dạng ngày `d/m/Y` trên UI, `Y-m-d` trong API.
- Hỗ trợ tiếng Việt có dấu, tìm kiếm không dấu.

---

# EDU-01. Student Management

## 1. Business Objective

Quản lý tập trung hồ sơ học viên (trẻ 4–10 tuổi) làm dữ liệu gốc cho ghi danh, điểm danh, điểm số, học phí; theo dõi trạng thái học trong suốt vòng đời tại trung tâm.

## 2. Business Rules

- BR-01: Mã học viên `student_code` sinh tự động, duy nhất trong business, format `HS{YY}{5 số tăng dần}` (VD: HS2600001), không cho sửa.
- BR-02: Học viên phải có ít nhất 1 phụ huynh liên kết trước khi ghi danh vào lớp.
- BR-03: Học viên có thể được tạo từ CRM (chuyển đổi Customer sau khi thanh toán) hoặc tạo trực tiếp.
- BR-04: Trạng thái học: `pending` (chưa xếp lớp) → `studying` (đang học) → `reserved` (bảo lưu) / `dropped` (nghỉ) / `completed` (hoàn thành). Chuyển trạng thái phải ghi lý do.
- BR-05: Không xóa cứng học viên đã có enrollment/invoice; chỉ soft delete khi chưa phát sinh dữ liệu liên quan.
- BR-06: Một học viên thuộc 1 chi nhánh chính, có thể chuyển chi nhánh (lưu lịch sử).

## 3. Actors

Admin, Manager, Academic Staff (CRUD); Teacher (xem trong lớp mình dạy); Parent/Student (xem hồ sơ của mình).

## 4. Preconditions

- User đã đăng nhập, có quyền `edu.student.*`.
- Chi nhánh đang hoạt động; nếu tạo từ CRM: Customer đã tồn tại.

## 5. Postconditions

- Hồ sơ học viên được tạo/cập nhật, ghi Audit Log.
- Nếu tạo mới: `status = pending`, sẵn sàng ghi danh; bắn event `StudentCreated` cho Notification & Reporting.

## 6. Functional Requirements

| ID | Yêu cầu |
|----|---------|
| FR-01 | Danh sách học viên: tìm kiếm (tên/mã/SĐT phụ huynh), lọc theo chi nhánh, trạng thái, lớp, khóa học; phân trang, sort |
| FR-02 | Tạo học viên: thông tin cá nhân, liên kết phụ huynh (chọn có sẵn hoặc tạo mới inline) |
| FR-03 | Cập nhật hồ sơ, upload avatar (jpg/png ≤ 2MB, crop 1:1) |
| FR-04 | Xem chi tiết: tab Hồ sơ, Lớp học, Điểm danh, Điểm số, Học phí, Lịch sử |
| FR-05 | Đổi trạng thái học (kèm lý do); chuyển chi nhánh |
| FR-06 | Import Excel (template chuẩn, validate từng dòng, báo lỗi chi tiết); Export Excel theo filter |
| FR-07 | Tạo tài khoản đăng nhập Student App (username = student_code) |

## 7. Non-functional Requirements

Theo mục 0.5. Bổ sung: danh sách chịu tải 50.000 học viên/business; import tối đa 1.000 dòng/lần chạy qua Queue.

## 8. Workflow

```
Tạo mới ──► pending ──(ghi danh EDU-09)──► studying
                                   │
              ┌─────────┬──────────┤
              ▼         ▼          ▼
          reserved   dropped   completed
              │ (học lại)
              └────────► studying
```

## 9. Use Cases

- UC-01 Tạo học viên thủ công: Giáo vụ nhập hồ sơ → chọn/tạo phụ huynh → lưu → hệ thống sinh mã.
- UC-02 Chuyển từ CRM: Sales chốt đơn → Finance xác nhận thanh toán → hệ thống tạo Student từ Customer, giữ liên kết `customer_id`.
- UC-03 Bảo lưu: Giáo vụ đổi trạng thái `reserved` kèm ngày dự kiến quay lại → hệ thống loại học viên khỏi điểm danh các buổi sau.
- UC-04 Import danh sách từ trung tâm cũ.

## 10. UI Requirements

- Trang danh sách: Filter (branch, status, course, keyword) + Table (avatar, mã, tên, tuổi, phụ huynh, lớp hiện tại, trạng thái badge màu) + Pagination + nút Tạo/Import/Export.
- Form tạo/sửa dạng Dialog 2 cột; section: Thông tin cá nhân / Phụ huynh / Ghi chú.
- Chi tiết dạng trang riêng có tab; theo UI Convention mục 8 readme.

## 11. Validation Rules

| Trường | Rule |
|--------|------|
| full_name | Bắt buộc, 2–100 ký tự |
| date_of_birth | Bắt buộc, tuổi 3–16 |
| gender | Bắt buộc: male/female/other |
| parent | Bắt buộc ≥ 1 phụ huynh khi ghi danh |
| phone (nếu có) | Format VN 10 số |
| avatar | jpg/png/webp ≤ 2MB |
| status + reason | reason bắt buộc khi chuyển reserved/dropped |

## 12. Permissions

| Permission | Admin | Manager | Giáo vụ | Teacher | Parent/Student |
|------------|:--:|:--:|:--:|:--:|:--:|
| edu.student.view | ✓ | ✓ (chi nhánh) | ✓ | ✓ (lớp mình) | ✓ (bản thân) |
| edu.student.create | ✓ | ✓ | ✓ | – | – |
| edu.student.update | ✓ | ✓ | ✓ | – | – |
| edu.student.delete | ✓ | ✓ | – | – | – |
| edu.student.import | ✓ | ✓ | ✓ | – | – |
| edu.student.change-status | ✓ | ✓ | ✓ | – | – |

## 13. Notifications

- Tạo tài khoản Student App → gửi thông tin đăng nhập cho phụ huynh (SMS/Email/Zalo tùy Setting).
- Đổi trạng thái reserved/dropped → thông báo Manager chi nhánh + Parent App.

## 14. Reports

Student Report (module Reporting): số học viên mới theo tháng, phân bố trạng thái, tỷ lệ dropped, học viên theo chi nhánh/khóa.

## 15. API Mapping

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/edu/students | Danh sách + filter |
| POST | /api/edu/students | Tạo mới |
| GET | /api/edu/students/{id} | Chi tiết |
| PUT | /api/edu/students/{id} | Cập nhật |
| DELETE | /api/edu/students/{id} | Soft delete |
| PATCH | /api/edu/students/{id}/status | Đổi trạng thái |
| POST | /api/edu/students/{id}/avatar | Upload avatar |
| POST | /api/edu/students/import | Import Excel |
| GET | /api/edu/students/export | Export Excel |
| POST | /api/edu/students/{id}/account | Tạo tài khoản app |

## 16. Database Design

`students`

| Cột | Kiểu | Ghi chú |
|-----|------|--------|
| id | bigint PK | |
| business_id / branch_id | bigint FK | index |
| student_code | varchar(20) | unique (business_id, student_code) |
| customer_id | bigint FK null | liên kết CRM |
| user_id | bigint FK null | tài khoản Student App |
| full_name | varchar(100) | index fulltext |
| date_of_birth | date | |
| gender | enum | |
| avatar | varchar(255) null | |
| address / note | text null | |
| status | enum(pending, studying, reserved, dropped, completed) | index |
| status_reason | varchar(255) null | |
| created_by / updated_by | bigint | |
| timestamps, deleted_at | | |

Bảng phụ: `student_status_logs` (student_id, from_status, to_status, reason, changed_by, changed_at); `student_branch_logs` (chuyển chi nhánh).

## 17. Sequence Diagram

```
Giáo vụ      FE            API              DB           Event Bus
  │ nhập form │              │                │               │
  │──────────►│ POST /students│               │               │
  │            │─────────────►│ validate       │               │
  │            │              │──insert────────►               │
  │            │              │──log status────►               │
  │            │              │──publish StudentCreated────────►
  │            │◄──201 data───│                │               │
  │◄─toast+row─│              │                │               │
```

## 18. ERD liên quan

students —< parent_student >— parents; students —< enrollments >— classes; students —< attendance; students —< homework_submissions; students —< scores; students —< certificates; students — customers (CRM); students — users (System).

## 19. Exception Handling

| Tình huống | Xử lý |
|-----------|-------|
| Trùng học viên (tên + ngày sinh + phụ huynh) | Cảnh báo nghi trùng, cho phép xác nhận tạo tiếp |
| Xóa học viên đã có enrollment | 409 — chặn, gợi ý chuyển trạng thái dropped |
| Import lỗi dòng | Bỏ qua dòng lỗi, trả file kết quả kèm lý do từng dòng |
| Upload avatar quá dung lượng/sai định dạng | 422 với message rõ ràng |
| Mất kết nối khi tạo | FE giữ dữ liệu form, retry |

## 20. Acceptance Criteria

- [ ] Tạo học viên thành công sinh mã đúng format, xuất hiện trong danh sách ≤ 2s.
- [ ] Không thể ghi danh học viên chưa có phụ huynh liên kết.
- [ ] Đổi trạng thái bắt buộc lý do với reserved/dropped và lưu lịch sử.
- [ ] Import 1.000 dòng: dòng hợp lệ được tạo, dòng lỗi trả về file báo lỗi.
- [ ] Manager chi nhánh A không thấy học viên chi nhánh B.
- [ ] Mọi thao tác CRUD được ghi Audit Log.

---

# EDU-02. Parent Management

## 1. Business Objective

Quản lý hồ sơ phụ huynh và quan hệ Phụ huynh–Học viên, làm nền tảng cho liên lạc, thanh toán học phí và tài khoản Parent App.

## 2. Business Rules

- BR-01: SĐT phụ huynh là định danh duy nhất trong business (unique); một SĐT = một phụ huynh.
- BR-02: Quan hệ Parent–Student là n–n; mỗi liên kết ghi rõ `relationship` (bố/mẹ/ông/bà/giám hộ) và cờ `is_primary` (người liên hệ chính, duy nhất 1 per student).
- BR-03: Phụ huynh chính (is_primary) nhận thông báo học phí và là người ký nhận chứng từ mặc định.
- BR-04: Không xóa phụ huynh còn liên kết học viên đang học hoặc còn công nợ.
- BR-05: Tài khoản Parent App đăng nhập bằng SĐT, một tài khoản thấy tất cả con liên kết.

## 3. Actors

Admin, Manager, Academic Staff (CRUD); Sales/CRM (tạo từ Lead); Parent (tự cập nhật thông tin cơ bản trên app).

## 4. Preconditions

Đăng nhập, quyền `edu.parent.*`; SĐT chưa tồn tại trong business (khi tạo mới).

## 5. Postconditions

Hồ sơ phụ huynh tạo/cập nhật; liên kết học viên được thiết lập; event `ParentCreated`/`ParentLinked` phát ra.

## 6. Functional Requirements

| ID | Yêu cầu |
|----|---------|
| FR-01 | Danh sách phụ huynh: tìm theo tên/SĐT/email, lọc chi nhánh; hiển thị số con đang học |
| FR-02 | CRUD phụ huynh; check trùng SĐT realtime khi nhập |
| FR-03 | Liên kết / hủy liên kết học viên; đặt quan hệ và phụ huynh chính |
| FR-04 | Xem chi tiết: thông tin, danh sách con, lịch sử thanh toán (đọc từ Finance), lịch sử liên lạc |
| FR-05 | Tạo/reset tài khoản Parent App (OTP qua SMS) |
| FR-06 | Gộp hồ sơ trùng (merge 2 parent, chuyển toàn bộ liên kết) |

## 7. Non-functional Requirements

Theo mục 0.5. SĐT được mask một phần với role không có quyền xem đầy đủ (`093***1234`).

## 8. Workflow

```
Tạo phụ huynh ──► Liên kết học viên (chọn relationship, is_primary)
      │                    │
      ▼                    ▼
Tạo tài khoản app ──► Phụ huynh dùng Parent App theo dõi con
```

## 9. Use Cases

- UC-01 Tạo phụ huynh khi tạo học viên (inline trong form Student).
- UC-02 Liên kết thêm con thứ 2 vào phụ huynh có sẵn (tìm theo SĐT).
- UC-03 Đổi phụ huynh chính khi bố mẹ thay đổi người liên hệ.
- UC-04 Merge 2 hồ sơ trùng do import.

## 10. UI Requirements

Danh sách: Filter + Table (tên, SĐT, email, số con, tài khoản app badge) + Pagination. Form Dialog; block "Học viên liên kết" dạng bảng con có nút thêm/xóa liên kết. Chi tiết có tab: Hồ sơ / Con / Thanh toán / Liên lạc.

## 11. Validation Rules

| Trường | Rule |
|--------|------|
| full_name | Bắt buộc, 2–100 ký tự |
| phone | Bắt buộc, format VN, unique trong business |
| email | Format email, không bắt buộc |
| relationship | Bắt buộc khi liên kết: father/mother/grandparent/guardian |
| is_primary | Mỗi student đúng 1 phụ huynh chính |

## 12. Permissions

| Permission | Admin | Manager | Giáo vụ | Teacher | Parent |
|------------|:--:|:--:|:--:|:--:|:--:|
| edu.parent.view | ✓ | ✓ | ✓ | ✓ (PH lớp mình, mask SĐT) | ✓ (bản thân) |
| edu.parent.create/update | ✓ | ✓ | ✓ | – | ✓ (thông tin cơ bản) |
| edu.parent.delete / merge | ✓ | ✓ | – | – | – |
| edu.parent.link-student | ✓ | ✓ | ✓ | – | – |

## 13. Notifications

Tạo tài khoản app → SMS OTP + hướng dẫn cài đặt. Liên kết con mới → push notification trên Parent App.

## 14. Reports

Số phụ huynh có ≥ 2 con (tiềm năng upsell), tỷ lệ kích hoạt Parent App, phụ huynh theo chi nhánh.

## 15. API Mapping

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/edu/parents | Danh sách |
| POST | /api/edu/parents | Tạo |
| GET | /api/edu/parents/{id} | Chi tiết |
| PUT | /api/edu/parents/{id} | Cập nhật |
| DELETE | /api/edu/parents/{id} | Soft delete |
| POST | /api/edu/parents/{id}/students | Liên kết học viên |
| DELETE | /api/edu/parents/{id}/students/{studentId} | Hủy liên kết |
| POST | /api/edu/parents/{id}/account | Tạo tài khoản app |
| POST | /api/edu/parents/merge | Gộp hồ sơ |

## 16. Database Design

`parents`: id, business_id, branch_id, full_name, phone (unique per business), email, address, note, user_id (FK null), job, timestamps, deleted_at.

`parent_student`: id, parent_id FK, student_id FK, relationship enum, is_primary boolean, timestamps; unique (parent_id, student_id).

## 17. Sequence Diagram

```
Giáo vụ → API: POST /parents (phone)
API → DB: check unique phone ──trùng──► 422 gợi ý mở hồ sơ có sẵn
API → DB: insert parent
Giáo vụ → API: POST /parents/{id}/students {student_id, relationship, is_primary}
API → DB: upsert parent_student; nếu is_primary=true → bỏ cờ primary cũ
API → Notification: push "Liên kết con mới"
```

## 18. ERD liên quan

parents —< parent_student >— students; parents — users; parents —< invoices (Finance, payer); parents — leads/customers (CRM nguồn gốc).

## 19. Exception Handling

| Tình huống | Xử lý |
|-----------|-------|
| Trùng SĐT | 422, trả về hồ sơ trùng để mở nhanh |
| Xóa phụ huynh còn con đang học | 409, chặn |
| Hủy liên kết phụ huynh chính duy nhất | Chặn — student luôn phải có ≥1 phụ huynh |
| Merge 2 hồ sơ có cùng student | Giữ 1 liên kết, không nhân đôi |

## 20. Acceptance Criteria

- [ ] Không thể tạo 2 phụ huynh cùng SĐT trong 1 business.
- [ ] Mỗi học viên có đúng 1 phụ huynh chính tại mọi thời điểm.
- [ ] Merge hồ sơ chuyển đủ liên kết con + không mất lịch sử thanh toán.
- [ ] Parent App hiển thị đủ tất cả con liên kết sau khi đăng nhập.
- [ ] Teacher chỉ thấy SĐT phụ huynh dạng mask.

---

# EDU-03. Course Management

## 1. Business Objective

Quản lý danh mục khóa học (Cambridge, Jolly Phonics, Tiếng Anh giao tiếp...) — đơn vị bán hàng và tổ chức đào tạo, gắn với học phí (Finance Product) và chương trình học.

## 2. Business Rules

- BR-01: Mã khóa `course_code` unique trong business, format tự do nhập tay hoặc auto `KH{số}`.
- BR-02: Khóa học thuộc 1 Subject và 1 Level; có số buổi chuẩn (`total_sessions`), thời lượng buổi (phút), độ tuổi khuyến nghị.
- BR-03: Khóa học có trạng thái `draft` → `active` → `inactive`; chỉ khóa `active` được mở lớp và bán.
- BR-04: Không xóa/inactive khóa đang có lớp `ongoing`; inactive chỉ chặn mở lớp mới.
- BR-05: Giá khóa học quản lý ở Finance (Product); Education chỉ tham chiếu `product_id`.

## 3. Actors

Admin, Manager (CRUD); Giáo vụ (xem, dùng khi mở lớp); Sales (xem để tư vấn); Website (hiển thị public các khóa được đánh dấu `is_published`).

## 4. Preconditions

Subject & Level đã tồn tại; quyền `edu.course.*`.

## 5. Postconditions

Khóa học sẵn sàng để mở lớp (EDU-08) và gắn báo giá (CRM Opportunity).

## 6. Functional Requirements

| ID | Yêu cầu |
|----|---------|
| FR-01 | Danh sách: lọc theo subject, level, trạng thái; tìm theo tên/mã |
| FR-02 | CRUD khóa học: tên, mã, subject, level, số buổi, thời lượng, độ tuổi, mô tả, ảnh, giáo trình đính kèm |
| FR-03 | Gắn syllabus: danh sách chủ đề/bài học theo buổi (course_lessons) |
| FR-04 | Đổi trạng thái draft/active/inactive |
| FR-05 | Đánh dấu is_published để hiển thị lên Website |
| FR-06 | Nhân bản (duplicate) khóa học kèm syllabus |

## 7. Non-functional Requirements

Theo mục 0.5. Ảnh khóa học ≤ 5MB, tự resize thumbnail. Danh mục cache Redis, invalidate khi cập nhật.

## 8. Workflow

```
draft ──(đủ thông tin + duyệt)──► active ──► inactive
  ▲                                            │
  └────────────(kích hoạt lại)─────────────────┘
```

## 9. Use Cases

- UC-01 Tạo khóa "Cambridge Starters – 48 buổi" gắn Subject=Cambridge, Level=Starters.
- UC-02 Nhập syllabus 48 buổi từ file Excel.
- UC-03 Publish khóa lên Website để nhận đăng ký học thử.
- UC-04 Inactive khóa cũ khi thay giáo trình, duplicate thành phiên bản mới.

## 10. UI Requirements

Danh sách dạng Table hoặc Card (ảnh, tên, level badge, số buổi, trạng thái). Form trang riêng 2 tab: Thông tin chung / Syllabus (bảng kéo-thả thứ tự buổi).

## 11. Validation Rules

| Trường | Rule |
|--------|------|
| name | Bắt buộc, 3–150 ký tự |
| course_code | Bắt buộc, unique, a-zA-Z0-9- |
| subject_id, level_id | Bắt buộc, tồn tại |
| total_sessions | Số nguyên 1–500 |
| duration_minutes | 30–300 |
| age_from ≤ age_to | 3–18 |
| is_published | Chỉ được true khi status=active |

## 12. Permissions

| Permission | Admin | Manager | Giáo vụ | Sales |
|------------|:--:|:--:|:--:|:--:|
| edu.course.view | ✓ | ✓ | ✓ | ✓ |
| edu.course.create/update | ✓ | ✓ | – | – |
| edu.course.delete | ✓ | – | – | – |
| edu.course.publish | ✓ | ✓ | – | – |

## 13. Notifications

Không bắt buộc. Tùy chọn: thông báo nội bộ khi khóa mới được active.

## 14. Reports

Số lớp/học viên/doanh thu theo khóa học (join Finance); khóa học bán chạy.

## 15. API Mapping

| Method | Endpoint |
|--------|----------|
| GET | /api/edu/courses |
| POST | /api/edu/courses |
| GET | /api/edu/courses/{id} |
| PUT | /api/edu/courses/{id} |
| DELETE | /api/edu/courses/{id} |
| PATCH | /api/edu/courses/{id}/status |
| POST | /api/edu/courses/{id}/duplicate |
| GET/PUT | /api/edu/courses/{id}/lessons (syllabus) |
| GET | /api/website/courses (public, is_published) |

## 16. Database Design

`courses`: id, business_id, course_code, name, subject_id FK, level_id FK, product_id FK null (Finance), total_sessions int, duration_minutes int, age_from, age_to, description text, image, status enum(draft,active,inactive), is_published bool, timestamps, deleted_at.

`course_lessons`: id, course_id FK, order int, title, objective text, materials text; unique (course_id, order).

## 17. Sequence Diagram

```
Manager → API: POST /courses (draft)
Manager → API: PUT /courses/{id}/lessons (syllabus)
Manager → API: PATCH /courses/{id}/status {active}
API → Cache: invalidate courses
Website → API: GET /website/courses → hiển thị khóa published
```

## 18. ERD liên quan

courses — subjects; courses — levels; courses —< course_lessons; courses —< classes; courses — products (Finance); courses —< opportunities (CRM).

## 19. Exception Handling

| Tình huống | Xử lý |
|-----------|-------|
| Inactive khóa còn lớp ongoing | 409, liệt kê lớp đang chạy |
| Xóa subject/level đang được khóa dùng | Chặn từ EDU-04/05 |
| Trùng mã khóa | 422 |
| Syllabus ít buổi hơn total_sessions | Cảnh báo (warning, không chặn) |

## 20. Acceptance Criteria

- [ ] Chỉ khóa active xuất hiện khi mở lớp mới và trong báo giá CRM.
- [ ] Khóa is_published hiển thị đúng trên Website ≤ 1 phút sau khi bật (cache invalidation).
- [ ] Duplicate tạo bản sao đầy đủ syllabus với mã mới.
- [ ] Không inactive được khóa còn lớp đang chạy.

---

# EDU-04. Subject Management

## 1. Business Objective

Quản lý danh mục môn học/chương trình (Cambridge, Phonics, Giao tiếp...) để phân loại khóa học và báo cáo theo chương trình đào tạo.

## 2. Business Rules

- BR-01: Tên subject unique trong business.
- BR-02: Không xóa subject đang được course tham chiếu; chỉ inactive.
- BR-03: Subject có thứ tự hiển thị (sort_order) dùng cho Website và dropdown.

## 3. Actors

Admin, Manager (CRUD); các role khác chỉ đọc.

## 4. Preconditions

Đăng nhập, quyền `edu.subject.manage`.

## 5. Postconditions

Subject khả dụng trong form tạo Course và filter báo cáo.

## 6. Functional Requirements

| ID | Yêu cầu |
|----|---------|
| FR-01 | Danh sách subject kèm số khóa học đang dùng |
| FR-02 | CRUD subject: tên, mã, mô tả, icon/màu, sort_order, trạng thái |
| FR-03 | Kéo thả sắp xếp thứ tự |

## 7. Non-functional Requirements

Theo mục 0.5; cache danh mục Redis.

## 8. Workflow

`Tạo → active ⇄ inactive` (inactive ẩn khỏi dropdown tạo mới, không ảnh hưởng dữ liệu cũ).

## 9. Use Cases

UC-01 Tạo subject "Jolly Phonics"; UC-02 Inactive subject không còn tuyển sinh; UC-03 Sắp xếp lại thứ tự hiển thị trên Website.

## 10. UI Requirements

Trang cấu hình đơn giản: Table + Dialog CRUD + drag handle sắp xếp. Gộp chung nhóm màn hình "Danh mục đào tạo" với Level, Classroom.

## 11. Validation Rules

name: bắt buộc, 2–100 ký tự, unique; code: unique, không dấu; sort_order: số nguyên ≥ 0.

## 12. Permissions

`edu.subject.view`: mọi role đào tạo; `edu.subject.manage` (create/update/delete): Admin, Manager.

## 13. Notifications

Không có.

## 14. Reports

Thống kê học viên/doanh thu theo subject (dimension trong Reporting).

## 15. API Mapping

GET/POST `/api/edu/subjects`; GET/PUT/DELETE `/api/edu/subjects/{id}`; PATCH `/api/edu/subjects/sort`.

## 16. Database Design

`subjects`: id, business_id, code, name, description, icon, color, sort_order, status enum(active,inactive), timestamps, deleted_at. Unique (business_id, name).

## 17. Sequence Diagram

```
Admin → API: POST /subjects → DB insert → Cache invalidate → 201
```

## 18. ERD liên quan

subjects —< courses.

## 19. Exception Handling

Xóa subject đang có course → 409 kèm số course tham chiếu; trùng tên → 422.

## 20. Acceptance Criteria

- [ ] Subject inactive không xuất hiện trong dropdown tạo course mới nhưng course cũ vẫn hiển thị đúng tên.
- [ ] Không xóa được subject có course tham chiếu.
- [ ] Thứ tự kéo thả được lưu và áp dụng trên Website.

---

# EDU-05. Level Management

## 1. Business Objective

Quản lý cấp độ đào tạo (Starters, Movers, Flyers, Pre-A1...) chuẩn hóa lộ trình học và xếp lớp đúng trình độ.

## 2. Business Rules

- BR-01: Tên level unique trong business; có sort_order thể hiện thứ bậc từ thấp đến cao.
- BR-02: Level có thể gắn `next_level_id` để gợi ý lộ trình học tiếp.
- BR-03: Không xóa level đang được course/class tham chiếu.

## 3. Actors

Admin, Manager (CRUD); role khác chỉ đọc.

## 4. Preconditions

Quyền `edu.level.manage`.

## 5. Postconditions

Level khả dụng khi tạo Course, xếp lớp, gợi ý lộ trình sau khi hoàn thành khóa.

## 6. Functional Requirements

| ID | Yêu cầu |
|----|---------|
| FR-01 | Danh sách level theo thứ bậc, kèm số khóa học sử dụng |
| FR-02 | CRUD level: tên, mã, mô tả, độ tuổi khuyến nghị, next_level |
| FR-03 | Sắp xếp thứ bậc kéo thả |

## 7. Non-functional Requirements

Theo mục 0.5; cache Redis.

## 8. Workflow

`Tạo → active ⇄ inactive`.

## 9. Use Cases

UC-01 Thiết lập chuỗi Starters → Movers → Flyers; UC-02 Hệ thống gợi ý khóa Movers khi học viên hoàn thành khóa Starters (dựa next_level_id).

## 10. UI Requirements

Table + Dialog trong nhóm "Danh mục đào tạo"; cột next level hiển thị dạng chip.

## 11. Validation Rules

name bắt buộc unique 2–100 ký tự; next_level_id ≠ chính nó, không tạo vòng lặp; age range hợp lệ.

## 12. Permissions

`edu.level.view` mọi role; `edu.level.manage` Admin/Manager.

## 13. Notifications

Không có.

## 14. Reports

Phân bố học viên theo level; tỷ lệ lên level (re-enrollment đúng lộ trình).

## 15. API Mapping

GET/POST `/api/edu/levels`; GET/PUT/DELETE `/api/edu/levels/{id}`; PATCH `/api/edu/levels/sort`.

## 16. Database Design

`levels`: id, business_id, code, name, description, age_from, age_to, next_level_id FK null (self), sort_order, status, timestamps, deleted_at.

## 17. Sequence Diagram

```
Admin → API: POST /levels → validate vòng lặp next_level → DB insert → 201
```

## 18. ERD liên quan

levels —< courses; levels — levels (next_level_id self-reference).

## 19. Exception Handling

Vòng lặp next_level (A→B→A) → 422; xóa level đang dùng → 409.

## 20. Acceptance Criteria

- [ ] Không thể cấu hình next_level tạo vòng lặp.
- [ ] Khi học viên completed khóa, hệ thống gợi ý đúng khóa thuộc next_level.
- [ ] Level inactive ẩn khỏi dropdown tạo mới.

---

# EDU-06. Classroom Management

## 1. Business Objective

Quản lý phòng học vật lý (và phòng online) của từng chi nhánh, phục vụ xếp lịch tránh trùng phòng và tối ưu công suất.

## 2. Business Rules

- BR-01: Phòng thuộc 1 chi nhánh; tên phòng unique trong chi nhánh.
- BR-02: Phòng có sức chứa (`capacity`); khi xếp lớp cảnh báo nếu sĩ số lớp > capacity.
- BR-03: Một phòng không được trùng lịch: 2 buổi học giao nhau về thời gian không được cùng phòng (trừ phòng online).
- BR-04: Phòng `maintenance` không được xếp lịch mới trong thời gian bảo trì.

## 3. Actors

Admin, Manager (CRUD phòng chi nhánh mình); Giáo vụ (xem, chọn khi xếp lịch).

## 4. Preconditions

Chi nhánh tồn tại; quyền `edu.classroom.manage`.

## 5. Postconditions

Phòng khả dụng trong bước xếp lịch (EDU-10) với ràng buộc chống trùng.

## 6. Functional Requirements

| ID | Yêu cầu |
|----|---------|
| FR-01 | Danh sách phòng theo chi nhánh: tên, sức chứa, thiết bị, trạng thái |
| FR-02 | CRUD phòng: tên, loại (physical/online), capacity, thiết bị, ghi chú |
| FR-03 | Đặt trạng thái available/maintenance kèm khoảng thời gian |
| FR-04 | Xem lịch sử dụng phòng dạng calendar tuần (occupancy) |

## 7. Non-functional Requirements

Theo mục 0.5. Kiểm tra trùng phòng phải chạy trong transaction xếp lịch (không race condition).

## 8. Workflow

`Tạo phòng → available ⇄ maintenance` ; khi xếp lịch: chọn phòng → hệ thống check trùng → xác nhận.

## 9. Use Cases

UC-01 Tạo phòng "P.101 – 15 chỗ" chi nhánh Quận 12; UC-02 Đặt bảo trì P.102 tuần sau → hệ thống chặn xếp lịch tuần đó; UC-03 Xem calendar công suất phòng để quyết định mở thêm lớp.

## 10. UI Requirements

Table + Dialog; màn "Lịch phòng" dạng weekly calendar, mỗi ô là buổi học (tên lớp, giờ), màu theo lớp.

## 11. Validation Rules

name bắt buộc unique per branch; capacity 1–100; loại online không yêu cầu capacity; khoảng bảo trì from < to.

## 12. Permissions

`edu.classroom.view` role đào tạo; `edu.classroom.manage` Admin/Manager.

## 13. Notifications

Đặt bảo trì trùng buổi học đã xếp → cảnh báo Giáo vụ danh sách buổi cần đổi phòng.

## 14. Reports

Tỷ lệ lấp đầy phòng (occupancy rate) theo tuần/tháng — đầu vào quyết định mở rộng.

## 15. API Mapping

GET/POST `/api/edu/classrooms`; GET/PUT/DELETE `/api/edu/classrooms/{id}`; PATCH `/api/edu/classrooms/{id}/status`; GET `/api/edu/classrooms/{id}/schedule?week=`.

## 16. Database Design

`classrooms`: id, business_id, branch_id, name, type enum(physical,online), capacity int null, equipment text, note, status enum(available,maintenance), maintenance_from/to datetime null, timestamps, deleted_at. Unique (branch_id, name).

## 17. Sequence Diagram

```
Giáo vụ → API: xếp buổi học (EDU-10) chọn classroom_id
API → DB: SELECT sessions WHERE classroom trùng khung giờ FOR UPDATE
  ├─ trùng → 409 kèm buổi xung đột
  └─ trống → insert session
```

## 18. ERD liên quan

classrooms —< class_sessions; classrooms — branches (System).

## 19. Exception Handling

Trùng lịch phòng → 409 nêu rõ lớp/giờ xung đột; xóa phòng còn lịch tương lai → 409; capacity nhỏ hơn sĩ số lớp khi chọn → warning cho phép override (Manager).

## 20. Acceptance Criteria

- [ ] Không thể lưu 2 buổi học trùng giờ cùng phòng physical.
- [ ] Phòng maintenance bị chặn xếp lịch đúng khoảng thời gian bảo trì.
- [ ] Calendar phòng hiển thị đúng occupancy theo tuần.

---

# EDU-07. Teacher (Hồ sơ & Phân công)

## 1. Business Objective

Quản lý hồ sơ chuyên môn giáo viên và phân công giảng dạy (lớp, buổi), đồng bộ với hồ sơ nhân sự (HR) và Teacher App.

## 2. Business Rules

- BR-01: Hồ sơ nhân sự (hợp đồng, lương) thuộc module HR; Education quản lý hồ sơ chuyên môn (bằng cấp, chứng chỉ giảng dạy, môn phụ trách) tham chiếu `employee_id`.
- BR-02: Giáo viên có loại: `vietnamese` / `native` / `assistant`; một lớp có 1 giáo viên chính + n trợ giảng.
- BR-03: Giáo viên không được trùng lịch dạy (2 buổi giao nhau về thời gian).
- BR-04: Phân công lớp phải nằm trong môn (subject) giáo viên được phép dạy.
- BR-05: Đổi giáo viên giữa khóa phải ghi lý do, lưu lịch sử; các buổi tương lai gán giáo viên mới.

## 3. Actors

Admin, Manager (CRUD, phân công); Giáo vụ (phân công theo phân quyền); Teacher (xem hồ sơ & lịch của mình trên app).

## 4. Preconditions

Employee (HR) đã tồn tại và có tài khoản user; quyền `edu.teacher.*`.

## 5. Postconditions

Giáo viên sẵn sàng được gán vào lớp/buổi; lịch dạy hiển thị trên Teacher App.

## 6. Functional Requirements

| ID | Yêu cầu |
|----|---------|
| FR-01 | Danh sách giáo viên: lọc loại, môn dạy, chi nhánh, trạng thái |
| FR-02 | CRUD hồ sơ chuyên môn: bằng cấp, chứng chỉ (IELTS/TESOL...), môn được dạy, giới thiệu, ảnh |
| FR-03 | Phân công giáo viên chính/trợ giảng cho lớp; đổi giáo viên (toàn lớp hoặc từng buổi — dạy thay) |
| FR-04 | Xem lịch dạy giáo viên dạng calendar; kiểm tra trùng lịch tự động |
| FR-05 | Thống kê giờ dạy theo tháng (đầu vào tính lương HR) |

## 7. Non-functional Requirements

Theo mục 0.5. Giờ dạy chốt theo attendance của buổi (trạng thái completed), đảm bảo khớp với payroll.

## 8. Workflow

```
HR tạo Employee ──► Education tạo hồ sơ Teacher (chuyên môn)
                          │
                          ▼
        Phân công lớp (chính/trợ giảng) ──► Lịch dạy ──► Dạy & điểm danh
                          │                                    │
                          ▼                                    ▼
                   Đổi GV/dạy thay                    Tổng hợp giờ dạy → HR Payroll
```

## 9. Use Cases

- UC-01 Tạo hồ sơ giáo viên từ Employee, khai môn được dạy.
- UC-02 Gán GV chính + 1 trợ giảng khi mở lớp.
- UC-03 GV bận đột xuất → Giáo vụ gán GV dạy thay cho 1 buổi, hệ thống check trùng lịch.
- UC-04 Cuối tháng xuất bảng giờ dạy cho HR.

## 10. UI Requirements

Danh sách card/table có ảnh, loại GV badge, môn dạy chips. Chi tiết: tab Hồ sơ / Lớp phụ trách / Lịch dạy (calendar) / Giờ dạy. Dialog phân công có cảnh báo trùng lịch inline.

## 11. Validation Rules

employee_id bắt buộc, unique (1 employee = 1 teacher profile); type bắt buộc; môn dạy ≥ 1; file chứng chỉ pdf/jpg ≤ 5MB; phân công: giáo viên active, đúng subject, không trùng lịch.

## 12. Permissions

| Permission | Admin | Manager | Giáo vụ | Teacher |
|------------|:--:|:--:|:--:|:--:|
| edu.teacher.view | ✓ | ✓ | ✓ | ✓ (mình) |
| edu.teacher.create/update | ✓ | ✓ | – | – |
| edu.teacher.assign | ✓ | ✓ | ✓ | – |
| edu.teacher.teaching-hours | ✓ | ✓ | – | ✓ (mình) |

## 13. Notifications

Phân công lớp mới / dạy thay / hủy phân công → push Teacher App + email. Nhắc lịch dạy trước giờ dạy X phút (Setting).

## 14. Reports

Teacher Report: giờ dạy, số lớp, tỷ lệ điểm danh đúng hạn, đánh giá từ phụ huynh (nếu có Feedback).

## 15. API Mapping

| Method | Endpoint |
|--------|----------|
| GET/POST | /api/edu/teachers |
| GET/PUT/DELETE | /api/edu/teachers/{id} |
| GET | /api/edu/teachers/{id}/schedule |
| GET | /api/edu/teachers/{id}/teaching-hours?month= |
| POST | /api/edu/classes/{id}/teachers (phân công) |
| PUT | /api/edu/sessions/{id}/teacher (dạy thay) |

## 16. Database Design

`teachers`: id, business_id, employee_id FK unique, type enum(vietnamese,native,assistant), degree, certificates json, bio text, avatar, status enum(active,inactive), timestamps, deleted_at.

`teacher_subjects`: teacher_id, subject_id (unique cặp).

`class_teachers`: id, class_id, teacher_id, role enum(main,assistant), from_date, to_date null, change_reason null, timestamps.

## 17. Sequence Diagram

```
Giáo vụ → API: POST /classes/{id}/teachers {teacher_id, role}
API → DB: check teacher_subjects khớp subject của course
API → DB: check trùng lịch các session tương lai của lớp
  ├─ trùng → 409 danh sách buổi xung đột
  └─ OK → insert class_teachers; update sessions tương lai
API → Notification: push Teacher App "Bạn được phân công lớp X"
```

## 18. ERD liên quan

teachers — employees (HR); teachers —< teacher_subjects >— subjects; teachers —< class_teachers >— classes; teachers —< class_sessions (teacher_id per buổi).

## 19. Exception Handling

Trùng lịch dạy → 409 chi tiết buổi; phân công sai môn → 422; đổi GV lớp đã kết thúc → 409; employee nghỉ việc (HR) → auto inactive teacher + cảnh báo lớp đang phụ trách.

## 20. Acceptance Criteria

- [ ] Không thể phân công GV trùng lịch hoặc sai môn.
- [ ] Dạy thay chỉ ảnh hưởng buổi được chọn, các buổi khác giữ GV chính.
- [ ] Giờ dạy tháng khớp với số buổi completed có mặt GV.
- [ ] GV nhận push notification ≤ 1 phút sau khi được phân công.

---

# EDU-08. Class Management (Mở lớp / Chuyển lớp / Đóng lớp)

## 1. Business Objective

Tổ chức lớp học từ khóa học: mở lớp, quản lý sĩ số, chuyển lớp học viên, đóng lớp khi kết thúc — đơn vị vận hành trung tâm của module Education.

## 2. Business Rules

- BR-01: Lớp thuộc 1 khóa học (course) `active` và 1 chi nhánh; mã lớp auto `{course_code}-{YY}{MM}-{số}` (VD: CAM1-2607-01).
- BR-02: Trạng thái lớp: `draft` → `open` (đang tuyển) → `ongoing` (đang học) → `completed` / `cancelled`.
- BR-03: Sĩ số tối thiểu/tối đa cấu hình theo lớp (mặc định theo course); không ghi danh vượt sĩ số tối đa (Manager được override).
- BR-04: Lớp chuyển `ongoing` khi bắt đầu buổi đầu tiên; chỉ lớp `open`/`ongoing` được nhận ghi danh.
- BR-05: Chuyển lớp: học viên chuyển sang lớp cùng course (hoặc course tương đương level), hệ thống tính số buổi đã học, chuyển số buổi còn lại; lưu lịch sử.
- BR-06: Đóng lớp (`completed`) khi hoàn thành đủ buổi; hệ thống kiểm tra điểm danh & điểm số đã đủ trước khi đóng; học viên đủ điều kiện chuyển trạng thái theo EDU-18.
- BR-07: Hủy lớp (`cancelled`) chỉ khi chưa ongoing hoặc có phê duyệt Manager; học viên đã ghi danh được chuyển lớp khác hoặc hoàn phí (Finance).

## 3. Actors

Admin, Manager, Giáo vụ (CRUD, chuyển/đóng lớp); Teacher (xem lớp mình); Parent/Student (xem lớp của con/mình).

## 4. Preconditions

Course active; phòng học & giáo viên khả dụng; quyền `edu.class.*`.

## 5. Postconditions

Lớp có lịch học (EDU-10), danh sách học viên (EDU-09); buổi học được sinh (EDU-11); dữ liệu chảy vào điểm danh/bài tập/điểm.

## 6. Functional Requirements

| ID | Yêu cầu |
|----|---------|
| FR-01 | Danh sách lớp: lọc trạng thái, khóa, chi nhánh, giáo viên; hiển thị sĩ số x/max, tiến độ buổi n/total |
| FR-02 | Tạo lớp: chọn course, đặt sĩ số min/max, ngày khai giảng dự kiến, gán GV, thiết lập lịch tuần (EDU-10) |
| FR-03 | Chi tiết lớp: tab Tổng quan / Học viên / Lịch học / Điểm danh / Bài tập / Điểm số |
| FR-04 | Chuyển lớp học viên: chọn lớp đích, hệ thống tính buổi còn lại, xác nhận |
| FR-05 | Đóng lớp: checklist điều kiện (đủ buổi, đủ điểm danh, đủ điểm) → confirm |
| FR-06 | Hủy lớp: nhập lý do, xử lý học viên đã ghi danh (chuyển lớp/hoàn phí) |

## 7. Non-functional Requirements

Theo mục 0.5. Thao tác đóng lớp chạy transaction: cập nhật enrollment, trạng thái học viên, bắn event; rollback toàn bộ nếu lỗi.

## 8. Workflow

```
draft ──► open ──(buổi 1 bắt đầu)──► ongoing ──(đủ buổi + checklist)──► completed
  │          │
  ▼          ▼ (không đủ sĩ số, có phê duyệt)
cancelled ◄──┘
```

## 9. Use Cases

- UC-01 Mở lớp Cambridge Starters tháng 8: tạo lớp, gán GV, xếp lịch T3-T5 18h, mở tuyển.
- UC-02 Học viên chuyển từ lớp sáng sang lớp tối (cùng course): còn 30/48 buổi → ghi danh lớp mới với 30 buổi.
- UC-03 Lớp chỉ tuyển được 3/8 học viên → Manager phê duyệt hủy, chuyển 3 học viên sang lớp khác.
- UC-04 Đóng lớp cuối khóa: hệ thống báo thiếu điểm cuối kỳ 2 học viên → GV bổ sung → đóng thành công.

## 10. UI Requirements

Danh sách table với progress bar tiến độ buổi, badge trạng thái. Wizard tạo lớp 3 bước: Thông tin → Lịch học → Giáo viên. Chi tiết lớp là màn hình trung tâm với 6 tab. Dialog chuyển lớp hiển thị so sánh lịch 2 lớp và số buổi chuyển.

## 11. Validation Rules

| Trường | Rule |
|--------|------|
| course_id | Bắt buộc, course active |
| name | Tự sinh, cho phép sửa, unique trong branch |
| min_students ≤ max_students | 1–50 |
| start_date | ≥ hôm nay khi tạo |
| Chuyển lớp | Lớp đích open/ongoing, cùng course hoặc cùng level, còn chỗ |
| Đóng lớp | 100% buổi completed/cancelled, điểm danh đầy đủ, đủ đầu điểm bắt buộc |

## 12. Permissions

| Permission | Admin | Manager | Giáo vụ | Teacher |
|------------|:--:|:--:|:--:|:--:|
| edu.class.view | ✓ | ✓ | ✓ | ✓ (lớp mình) |
| edu.class.create/update | ✓ | ✓ | ✓ | – |
| edu.class.transfer-student | ✓ | ✓ | ✓ | – |
| edu.class.close | ✓ | ✓ | – | – |
| edu.class.cancel / override sĩ số | ✓ | ✓ | – | – |

## 13. Notifications

Lớp sắp khai giảng (trước X ngày) → Giáo vụ + GV. Chuyển lớp → Parent App + Teacher App 2 lớp. Lớp đóng → Parent App (kết quả khóa học). Hủy lớp → Manager + Parent (phương án xử lý).

## 14. Reports

Enrollment Report: tỷ lệ lấp đầy lớp, số lớp mở mới theo tháng, tỷ lệ hoàn thành khóa, lớp sắp kết thúc (để tư vấn tái ghi danh).

## 15. API Mapping

| Method | Endpoint |
|--------|----------|
| GET/POST | /api/edu/classes |
| GET/PUT/DELETE | /api/edu/classes/{id} |
| PATCH | /api/edu/classes/{id}/status |
| GET | /api/edu/classes/{id}/students |
| POST | /api/edu/classes/{id}/transfer {student_id, to_class_id} |
| POST | /api/edu/classes/{id}/close |
| POST | /api/edu/classes/{id}/cancel |

## 16. Database Design

`classes`: id, business_id, branch_id, course_id FK, name, code unique, min_students, max_students, start_date, expected_end_date, actual_end_date null, status enum(draft,open,ongoing,completed,cancelled), cancel_reason null, timestamps, deleted_at.

`class_transfers`: id, student_id, from_class_id, to_class_id, sessions_learned, sessions_transferred, reason, approved_by, created_at.

## 17. Sequence Diagram

```
Giáo vụ → API: POST /classes/{id}/transfer {student, to_class}
API → DB: đếm attendance buổi đã học ở lớp cũ
API → DB (tx): update enrollment cũ (transferred)
             insert enrollment mới (remaining_sessions)
             insert class_transfers
API → Notification: Parent + 2 GV
API → Giáo vụ: 200 + summary buổi chuyển
```

## 18. ERD liên quan

classes — courses; classes — branches; classes —< enrollments >— students; classes —< class_sessions; classes —< class_teachers >— teachers; classes —< homework.

## 19. Exception Handling

| Tình huống | Xử lý |
|-----------|-------|
| Ghi danh vượt sĩ số | 409; Manager có quyền override |
| Đóng lớp thiếu điều kiện | 422 kèm checklist thiếu gì (buổi, điểm danh, điểm) |
| Chuyển lớp đích hết chỗ | 409 |
| Hủy lớp còn học viên chưa xử lý | Chặn tới khi 100% học viên được chuyển lớp/hoàn phí |
| 2 giáo vụ cùng ghi danh chỗ cuối | Lock DB, người sau nhận 409 |

## 20. Acceptance Criteria

- [ ] Mã lớp sinh đúng format và unique.
- [ ] Lớp tự chuyển ongoing khi buổi đầu bắt đầu (scheduler).
- [ ] Chuyển lớp bảo toàn tổng số buổi học viên được hưởng.
- [ ] Không đóng được lớp khi còn buổi chưa hoàn thành hoặc thiếu điểm.
- [ ] Hủy lớp bắt buộc xử lý hết học viên trước khi hoàn tất.

---

# EDU-09. Enrollment (Đăng ký học)

## 1. Business Objective

Ghi danh học viên vào lớp, liên kết với gói học phí đã thanh toán (Finance), theo dõi số buổi được hưởng — cầu nối giữa CRM/Finance và vận hành đào tạo.

## 2. Business Rules

- BR-01: Một enrollment = 1 học viên + 1 lớp; unique (student_id, class_id) với trạng thái active.
- BR-02: Điều kiện ghi danh: học viên có phụ huynh liên kết; lớp open/ongoing còn chỗ; đã có invoice thanh toán đủ hoặc đạt ngưỡng cho phép học (Setting: % tối thiểu, mặc định đợt 1 trả góp).
- BR-03: `total_sessions` của enrollment = số buổi mua (theo product Finance) hoặc số buổi còn lại khi chuyển lớp.
- BR-04: Trạng thái: `active` → `completed` / `transferred` / `cancelled` / `reserved`.
- BR-05: Ghi danh vào lớp ongoing: học viên chỉ tính điểm danh từ buổi tham gia; số buổi hưởng vẫn đủ theo gói (học bù/kéo dài sang lớp sau — chính sách theo Setting).
- BR-06: Hủy enrollment phát sinh nghiệp vụ hoàn phí theo số buổi chưa học (Finance xử lý, Education cung cấp số liệu).

## 3. Actors

Giáo vụ, Manager, Admin (ghi danh, hủy); Sales (khởi tạo từ Opportunity); System (auto tạo từ thanh toán thành công).

## 4. Preconditions

Student tồn tại (status ≠ dropped); lớp còn chỗ; invoice đạt điều kiện thanh toán.

## 5. Postconditions

Học viên vào danh sách lớp, xuất hiện trong điểm danh các buổi tương lai; student.status → studying; event `EnrollmentCreated` → Notification, Finance, Reporting.

## 6. Functional Requirements

| ID | Yêu cầu |
|----|---------|
| FR-01 | Ghi danh từ màn hình lớp hoặc màn hình học viên; hiển thị điều kiện thanh toán trước khi xác nhận |
| FR-02 | Danh sách enrollment theo lớp/học viên: buổi đã học/còn lại, trạng thái |
| FR-03 | Hủy ghi danh kèm lý do, tính số buổi chưa học gửi Finance hoàn phí |
| FR-04 | Bảo lưu enrollment (reserved) và kích hoạt lại vào lớp mới |
| FR-05 | Auto-enrollment: khi Finance xác nhận thanh toán đơn đăng ký có chỉ định lớp, hệ thống tự tạo enrollment |

## 7. Non-functional Requirements

Theo mục 0.5. Tạo enrollment và cập nhật sĩ số phải atomic (lock chống vượt sĩ số).

## 8. Workflow

```
Invoice thanh toán đủ điều kiện
        │
        ▼
Ghi danh (chọn lớp) ──► active ──► completed (đủ buổi + lớp đóng)
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
         transferred   reserved   cancelled ──► Finance hoàn phí
                          │
                          └──(lớp mới)──► active
```

## 9. Use Cases

- UC-01 Ghi danh học viên mới vào lớp sắp khai giảng sau khi phụ huynh đóng 100% học phí.
- UC-02 Ghi danh giữa khóa vào lớp ongoing (học viên chuyển từ trung tâm khác, học từ buổi 15).
- UC-03 Phụ huynh xin bảo lưu 2 tháng → reserved → quay lại kích hoạt vào lớp mới cùng level.
- UC-04 Hủy ghi danh sau 5 buổi → hệ thống tính 43 buổi chưa học → Finance tạo phiếu hoàn.

## 10. UI Requirements

Dialog ghi danh: chọn học viên (search) → chọn lớp (hiển thị lịch, sĩ số, GV) → panel điều kiện thanh toán (đọc Finance) → xác nhận. Tab Học viên trong chi tiết lớp: bảng enrollment với cột buổi đã học/còn lại dạng progress.

## 11. Validation Rules

student_id, class_id bắt buộc; không trùng enrollment active; lớp còn chỗ (trừ override); invoice đạt ngưỡng thanh toán; ngày ghi danh ≤ ngày kết thúc lớp; lý do bắt buộc khi hủy/bảo lưu.

## 12. Permissions

| Permission | Admin | Manager | Giáo vụ | Sales |
|------------|:--:|:--:|:--:|:--:|
| edu.enrollment.view | ✓ | ✓ | ✓ | ✓ (KH mình) |
| edu.enrollment.create | ✓ | ✓ | ✓ | – |
| edu.enrollment.cancel | ✓ | ✓ | – | – |
| edu.enrollment.reserve | ✓ | ✓ | ✓ | – |

## 13. Notifications

Ghi danh thành công → Parent App (lịch học, GV, phòng) + Teacher App (học viên mới). Sắp hết buổi (còn ≤ X buổi) → Sales/Giáo vụ để tư vấn tái ghi danh + Parent App.

## 14. Reports

Enrollment Report: ghi danh mới theo tháng, tỷ lệ tái ghi danh (retention), tỷ lệ hủy giữa chừng, số buổi trung bình đã dùng khi hủy.

## 15. API Mapping

| Method | Endpoint |
|--------|----------|
| GET/POST | /api/edu/enrollments |
| GET | /api/edu/enrollments/{id} |
| PATCH | /api/edu/enrollments/{id}/cancel |
| PATCH | /api/edu/enrollments/{id}/reserve |
| PATCH | /api/edu/enrollments/{id}/activate {class_id} |
| GET | /api/edu/students/{id}/enrollments |
| GET | /api/edu/classes/{id}/enrollments |

## 16. Database Design

`enrollments`: id, business_id, student_id FK, class_id FK, invoice_id FK null (Finance), total_sessions int, used_sessions int default 0, start_date, status enum(active,completed,transferred,reserved,cancelled), status_reason null, source enum(manual,auto,transfer), created_by, timestamps, deleted_at. Unique partial (student_id, class_id, status=active).

## 17. Sequence Diagram

```
Finance → Event Bus: PaymentConfirmed {invoice, student, class?}
Event Bus → Education Listener: nếu có class chỉ định
Listener → DB (tx): lock class → check sĩ số → insert enrollment
                    update student.status = studying
Listener → Notification: Parent + Teacher
(Nếu không chỉ định lớp: tạo task "Chờ xếp lớp" cho Giáo vụ)
```

## 18. ERD liên quan

enrollments — students; enrollments — classes; enrollments — invoices (Finance); enrollments —< attendance (gián tiếp qua session + student).

## 19. Exception Handling

| Tình huống | Xử lý |
|-----------|-------|
| Chưa đủ điều kiện thanh toán | 422 kèm số tiền còn thiếu, link invoice |
| Lớp đầy | 409, gợi ý lớp cùng course còn chỗ |
| Enrollment trùng | 409 |
| Event thanh toán đến 2 lần (retry) | Idempotency theo invoice_id — không tạo trùng |
| Hủy enrollment đã completed | 409 |

## 20. Acceptance Criteria

- [ ] Không tạo được enrollment khi invoice chưa đạt ngưỡng thanh toán.
- [ ] Sĩ số lớp không bao giờ vượt max (trừ override có ghi log).
- [ ] Auto-enrollment idempotent với event thanh toán lặp.
- [ ] Hủy ghi danh trả về đúng số buổi chưa học cho Finance.
- [ ] used_sessions tự tăng theo điểm danh buổi completed.

---

# EDU-10. Timetable (Xếp lịch học)

## 1. Business Objective

Thiết lập lịch học lặp theo tuần cho lớp và sinh tự động các buổi học (session), đảm bảo không xung đột phòng/giáo viên, hiển thị lịch cho mọi đối tượng.

## 2. Business Rules

- BR-01: Lịch tuần của lớp gồm n slot: (thứ, giờ bắt đầu, giờ kết thúc, phòng, giáo viên); một lớp tối thiểu 1 slot.
- BR-02: Từ lịch tuần + ngày khai giảng + tổng số buổi, hệ thống sinh đủ `total_sessions` buổi học, tự bỏ qua ngày nghỉ lễ (bảng holidays) và dời về sau.
- BR-03: Không sinh/không sửa slot gây trùng: phòng trùng giờ (BR EDU-06), giáo viên trùng giờ (BR EDU-07).
- BR-04: Sửa lịch tuần giữa khóa chỉ áp dụng cho các buổi tương lai chưa diễn ra; buổi đã completed giữ nguyên.
- BR-05: Đổi lịch 1 buổi riêng lẻ (dời ngày/giờ/phòng) không ảnh hưởng lịch tuần; phải thông báo phụ huynh.

## 3. Actors

Giáo vụ, Manager, Admin (xếp/sửa lịch); Teacher, Parent, Student (xem lịch); System (sinh buổi, check xung đột).

## 4. Preconditions

Lớp ở trạng thái draft/open; phòng và giáo viên đã có; bảng ngày nghỉ đã cấu hình (Setting).

## 5. Postconditions

Toàn bộ buổi học (class_sessions) được sinh với ngày giờ/phòng/GV cụ thể; lịch hiển thị trên các app.

## 6. Functional Requirements

| ID | Yêu cầu |
|----|---------|
| FR-01 | Thiết lập lịch tuần khi tạo lớp (wizard bước 2): thêm nhiều slot, chọn phòng + GV mỗi slot |
| FR-02 | Preview danh sách buổi được sinh (ngày cụ thể, đánh dấu ngày lễ bị bỏ qua) trước khi xác nhận |
| FR-03 | Sinh buổi tự động; sinh lại các buổi tương lai khi sửa lịch tuần |
| FR-04 | Đổi lịch 1 buổi: dời ngày/giờ/phòng/GV, nhập lý do |
| FR-05 | Xem lịch tổng: calendar theo chi nhánh (tuần/tháng), lọc theo phòng/GV/lớp |
| FR-06 | Phát hiện và liệt kê xung đột khi có thay đổi (đổi phòng bảo trì, GV nghỉ) |

## 7. Non-functional Requirements

Theo mục 0.5. Sinh 500 buổi < 5s (chạy sync khi tạo lớp, có thể queue). Check xung đột dùng index (classroom_id, start_at), (teacher_id, start_at).

## 8. Workflow

```
Thiết lập slot tuần ──► Check xung đột ──► Preview buổi ──► Xác nhận ──► Sinh sessions
                                                                        │
Sửa lịch tuần giữa khóa ──► Regenerate buổi tương lai ◄─────────────────┘
Đổi 1 buổi ──► Update session đó + notify
```

## 9. Use Cases

- UC-01 Lớp học T3-T5 18:00-19:30, khai giảng 04/08, 48 buổi → hệ thống sinh 48 buổi, bỏ qua 02/09 (lễ), kết thúc muộn hơn 1 buổi.
- UC-02 Từ tháng 10 lớp đổi sang T2-T4 → regenerate 20 buổi còn lại, giữ 28 buổi đã học.
- UC-03 Buổi 15/09 GV bận → dời sang 16/09 cùng giờ, phụ huynh nhận thông báo.
- UC-04 Giáo vụ xem calendar chi nhánh phát hiện P.101 trống chiều T7 → đề xuất mở lớp mới.

## 10. UI Requirements

Bước lịch trong wizard: bảng slot (thứ, giờ, phòng, GV) + nút preview. Preview: bảng buổi có cột ngày, đánh dấu đỏ ngày lễ bỏ qua. Calendar tổng: view tuần/tháng, block màu theo lớp, click mở chi tiết buổi, filter đa tiêu chí.

## 11. Validation Rules

Slot: giờ kết thúc > giờ bắt đầu, tối thiểu 30 phút; không trùng slot trong cùng lớp; phòng/GV không xung đột; ngày khai giảng khớp với ít nhất 1 thứ trong slot; đổi buổi: chỉ buổi chưa diễn ra, lý do bắt buộc.

## 12. Permissions

`edu.timetable.view`: mọi role (scope theo đối tượng); `edu.timetable.manage`: Admin, Manager, Giáo vụ; đổi buổi đã chốt trong ngày: Manager.

## 13. Notifications

Đổi lịch buổi/lịch tuần → push Parent App + Teacher App + SMS (tùy Setting) trước tối thiểu X giờ. Nhắc lịch học trước buổi (mặc định 2h) → Parent/Student App.

## 14. Reports

Mật độ lịch theo khung giờ (giờ vàng), tỷ lệ buổi bị dời/hủy theo lớp/GV.

## 15. API Mapping

| Method | Endpoint |
|--------|----------|
| GET/PUT | /api/edu/classes/{id}/timetable (slot tuần) |
| POST | /api/edu/classes/{id}/timetable/preview |
| POST | /api/edu/classes/{id}/timetable/generate |
| PUT | /api/edu/sessions/{id}/reschedule |
| GET | /api/edu/timetable?branch=&from=&to=&room=&teacher= |
| GET | /api/edu/holidays · POST /api/edu/holidays |

## 16. Database Design

`class_schedules` (slot tuần): id, class_id FK, day_of_week tinyint(1-7), start_time, end_time, classroom_id FK, teacher_id FK, timestamps.

`holidays`: id, business_id, date, name, is_recurring bool.

(Buổi học cụ thể nằm ở `class_sessions` — EDU-11.)

## 17. Sequence Diagram

```
Giáo vụ → API: POST /timetable/preview {slots, start_date}
API: loop từ start_date, match day_of_week, skip holidays
API → DB: check conflict phòng + GV cho từng buổi dự kiến
API → FE: danh sách buổi + conflicts (nếu có)
Giáo vụ → API: POST /timetable/generate → bulk insert class_sessions
API → Notification: lịch mới cho GV
```

## 18. ERD liên quan

class_schedules — classes/classrooms/teachers; class_sessions — class_schedules (nguồn sinh); holidays — businesses.

## 19. Exception Handling

| Tình huống | Xử lý |
|-----------|-------|
| Xung đột phòng/GV khi generate | Trả danh sách buổi xung đột, không sinh buổi nào (all-or-nothing) |
| Sửa lịch tuần khi có buổi tương lai đã điểm danh trước | Chặn buổi đó, chỉ regenerate buổi chưa có dữ liệu |
| Ngày lễ thêm sau khi đã sinh buổi | Job cảnh báo các buổi rơi vào lễ, Giáo vụ xác nhận dời |
| Đổi buổi sang giờ trùng lịch GV | 409 |

## 20. Acceptance Criteria

- [ ] Sinh đủ đúng total_sessions buổi, bỏ qua ngày lễ và dời bù về sau.
- [ ] Không tồn tại 2 buổi trùng phòng hoặc trùng GV giao nhau về thời gian.
- [ ] Sửa lịch tuần không làm mất dữ liệu buổi đã học.
- [ ] Phụ huynh nhận thông báo đổi lịch trước ≥ X giờ cấu hình.
- [ ] Preview khớp 100% với kết quả generate.

---

# EDU-11. Session (Buổi học)

## 1. Business Objective

Quản lý từng buổi học cụ thể — đơn vị ghi nhận điểm danh, nội dung dạy, bài tập; là nguồn dữ liệu giờ dạy (HR) và tiến độ lớp.

## 2. Business Rules

- BR-01: Buổi học sinh từ Timetable, thuộc 1 lớp, thứ tự `session_number` tăng dần liên tục 1..total_sessions.
- BR-02: Trạng thái: `scheduled` → `ongoing` (đến giờ) → `completed` (GV hoàn tất điểm danh) / `cancelled` (nghỉ, sẽ sinh buổi bù cuối khóa).
- BR-03: Buổi gắn nội dung syllabus tương ứng (course_lessons theo session_number); GV có thể ghi chú nội dung thực dạy.
- BR-04: Buổi `completed` yêu cầu điểm danh 100% học viên active của lớp (EDU-12).
- BR-05: Hủy buổi phải nhập lý do; hệ thống sinh buổi bù (make-up) sau buổi cuối, giữ tổng số buổi.
- BR-06: Buổi đã completed không sửa được ngày giờ; sửa nội dung/ghi chú trong vòng 48h.

## 3. Actors

Giáo vụ (quản lý, hủy buổi); Teacher (bắt đầu, ghi nội dung, hoàn tất buổi qua Teacher App); System (auto chuyển ongoing theo giờ); Parent/Student (xem).

## 4. Preconditions

Lớp có lịch đã generate; buổi ở trạng thái phù hợp với thao tác.

## 5. Postconditions

Buổi completed → tính giờ dạy GV, tăng used_sessions của enrollment có mặt, cập nhật tiến độ lớp.

## 6. Functional Requirements

| ID | Yêu cầu |
|----|---------|
| FR-01 | Danh sách buổi theo lớp: số thứ tự, ngày giờ, phòng, GV, trạng thái, sĩ số có mặt |
| FR-02 | Chi tiết buổi: nội dung syllabus, ghi chú GV, điểm danh, bài tập giao trong buổi |
| FR-03 | GV bắt đầu buổi (check-in), ghi nội dung, hoàn tất buổi từ Teacher App |
| FR-04 | Hủy buổi (nghỉ lễ đột xuất, GV ốm...) → auto sinh buổi bù |
| FR-05 | Scheduler tự chuyển trạng thái ongoing khi đến giờ; nhắc GV điểm danh nếu quá X phút chưa thao tác |

## 7. Non-functional Requirements

Theo mục 0.5. Teacher App hoạt động được khi mạng yếu: cache buổi hôm nay, sync khi có mạng (offline-first cho điểm danh).

## 8. Workflow

```
scheduled ──(đến giờ, scheduler)──► ongoing ──(GV điểm danh xong + hoàn tất)──► completed
    │
    └──(hủy + lý do)──► cancelled ──► sinh buổi bù cuối khóa
```

## 9. Use Cases

- UC-01 GV mở Teacher App trước giờ dạy, xem nội dung buổi 12 (syllabus), bắt đầu buổi.
- UC-02 GV hoàn tất buổi sau khi điểm danh + ghi chú "Đã dạy hết Unit 5".
- UC-03 Trung tâm nghỉ đột xuất do bão → Giáo vụ hủy tất cả buổi trong ngày của chi nhánh (bulk), hệ thống sinh buổi bù + thông báo phụ huynh.
- UC-04 Hệ thống nhắc GV chưa điểm danh sau 30 phút bắt đầu buổi.

## 10. UI Requirements

Web: tab Lịch học trong chi tiết lớp — timeline buổi với trạng thái màu. Teacher App: màn "Buổi hôm nay" nổi bật trên Dashboard (theo thiết kế Teacher App readme mục 6), nút Bắt đầu → Điểm danh → Hoàn tất theo flow 3 bước.

## 11. Validation Rules

Hoàn tất buổi: 100% học viên đã điểm danh; check-in chỉ trong khoảng ±X phút quanh giờ học (Setting); hủy: chỉ buổi scheduled/ongoing, lý do ≥ 10 ký tự; bulk hủy: cùng chi nhánh, cùng ngày.

## 12. Permissions

| Permission | Admin | Manager | Giáo vụ | Teacher |
|------------|:--:|:--:|:--:|:--:|
| edu.session.view | ✓ | ✓ | ✓ | ✓ (buổi mình) |
| edu.session.manage (hủy/đổi) | ✓ | ✓ | ✓ | – |
| edu.session.start/complete | ✓ | – | – | ✓ (buổi mình) |

## 13. Notifications

Buổi bị hủy → Parent App + SMS. Buổi bù mới → Parent App. GV quên điểm danh → push nhắc GV + cảnh báo Giáo vụ. Nhắc buổi học sắp diễn ra → Parent/Student App (2h trước, Setting).

## 14. Reports

Tỷ lệ buổi hoàn thành đúng hạn, buổi hủy theo nguyên nhân, thời gian trung bình GV hoàn tất điểm danh.

## 15. API Mapping

| Method | Endpoint |
|--------|----------|
| GET | /api/edu/classes/{id}/sessions |
| GET | /api/edu/sessions/{id} |
| PATCH | /api/edu/sessions/{id}/start |
| PATCH | /api/edu/sessions/{id}/complete |
| PATCH | /api/edu/sessions/{id}/cancel |
| POST | /api/edu/sessions/bulk-cancel |
| PUT | /api/edu/sessions/{id}/note |
| GET | /api/edu/teachers/me/sessions?date=today (Teacher App) |

## 16. Database Design

`class_sessions`: id, business_id, class_id FK, session_number int, course_lesson_id FK null, classroom_id FK, teacher_id FK, substitute_teacher_id FK null, start_at datetime, end_at datetime, status enum(scheduled,ongoing,completed,cancelled), is_makeup bool default false, cancel_reason null, teacher_note text null, started_at, completed_at, timestamps. Index (classroom_id, start_at), (teacher_id, start_at), (class_id, session_number).

## 17. Sequence Diagram

```
Scheduler → DB: UPDATE sessions SET ongoing WHERE start_at <= now
GV (App) → API: PATCH /sessions/{id}/start → started_at
GV (App) → API: điểm danh từng học viên (EDU-12)
GV (App) → API: PATCH /sessions/{id}/complete
API: validate 100% điểm danh → completed
API → DB: update enrollments.used_sessions (học viên present/late)
API → Event: SessionCompleted → HR giờ dạy, Reporting
```

## 18. ERD liên quan

class_sessions — classes; — classrooms; — teachers; — course_lessons; —< attendance; —< homework (giao trong buổi).

## 19. Exception Handling

| Tình huống | Xử lý |
|-----------|-------|
| Hoàn tất khi chưa điểm danh đủ | 422 danh sách học viên thiếu |
| Hủy buổi đã completed | 409 |
| App offline lúc điểm danh | Lưu local, sync khi online; conflict → bản ghi server thắng, cảnh báo GV |
| Buổi bù trùng lịch | Check xung đột như buổi thường, đề xuất slot trống gần nhất |

## 20. Acceptance Criteria

- [ ] Buổi tự chuyển ongoing đúng giờ (sai số ≤ 1 phút).
- [ ] Không hoàn tất được buổi thiếu điểm danh.
- [ ] Hủy buổi luôn sinh buổi bù giữ nguyên tổng số buổi lớp.
- [ ] used_sessions của enrollment tăng chính xác sau mỗi buổi completed.
- [ ] Teacher App điểm danh được khi offline và sync thành công.

---

# EDU-12. Attendance (Điểm danh)

## 1. Business Objective

Ghi nhận chuyên cần từng học viên mỗi buổi học — dữ liệu gốc cho thông báo phụ huynh, tính buổi đã dùng (enrollment), giờ dạy GV và báo cáo chuyên cần.

## 2. Business Rules

- BR-01: Mỗi (session, student) có đúng 1 bản ghi điểm danh; trạng thái: `present` / `late` / `absent_excused` (có phép) / `absent` (không phép).
- BR-02: Chỉ GV được phân công buổi đó (hoặc GV dạy thay) điểm danh; Giáo vụ/Manager được sửa sau khi buổi completed (có log).
- BR-03: present/late tính là 1 buổi đã dùng (used_sessions); absent có phép/không phép tính theo chính sách Setting (mặc định: absent vẫn trừ buổi, có phép được học bù nếu còn suất bù).
- BR-04: Điểm danh xong từng học viên gửi thông báo realtime cho phụ huynh (đến lớp/vắng).
- BR-05: Sửa điểm danh sau 24h kể từ khi buổi completed cần quyền Manager, ghi lý do.
- BR-06: Học viên vắng liên tiếp ≥ N buổi (Setting, mặc định 3) → cảnh báo Giáo vụ + Sales chăm sóc.

## 3. Actors

Teacher (điểm danh qua app); Giáo vụ/Manager (xem, sửa); Parent (nhận thông báo, xem lịch sử); System (cảnh báo vắng liên tiếp).

## 4. Preconditions

Buổi học ở trạng thái ongoing; danh sách học viên active của lớp có sẵn (kể cả học viên mới ghi danh giữa khóa).

## 5. Postconditions

Bản ghi điểm danh đầy đủ; thông báo phụ huynh đã gửi; used_sessions cập nhật khi buổi completed.

## 6. Functional Requirements

| ID | Yêu cầu |
|----|---------|
| FR-01 | Teacher App: danh sách học viên buổi học với ảnh, tap chọn trạng thái từng em hoặc "Tất cả có mặt" rồi chỉnh lệch |
| FR-02 | Ghi chú theo học viên (VD: về sớm 15') |
| FR-03 | Phụ huynh báo vắng trước qua Parent App → tự đánh dấu absent_excused chờ GV xác nhận |
| FR-04 | Web: xem/sửa điểm danh theo buổi hoặc ma trận lớp (học viên × buổi) |
| FR-05 | Lịch sử chuyên cần từng học viên: tỷ lệ đi học, số buổi vắng |
| FR-06 | Cảnh báo tự động vắng liên tiếp |

## 7. Non-functional Requirements

Theo mục 0.5. Điểm danh 1 lớp 20 học viên hoàn tất < 30 giây thao tác; hỗ trợ offline (EDU-11); thông báo phụ huynh gửi ≤ 1 phút sau khi ghi nhận.

## 8. Workflow

```
Buổi ongoing ──► GV mở danh sách ──► chọn trạng thái từng HV ──► lưu
                                                    │
             Phụ huynh báo vắng trước ──► pending ──┤ GV xác nhận
                                                    ▼
                              Notification phụ huynh (đến lớp / vắng)
                                                    │
                              Buổi completed ──► chốt, cập nhật used_sessions
```

## 9. Use Cases

- UC-01 GV bấm "Tất cả có mặt", chỉnh 2 em vắng, lưu trong 20 giây.
- UC-02 Phụ huynh báo con ốm từ tối hôm trước trên Parent App → sáng GV thấy sẵn trạng thái "báo vắng", xác nhận.
- UC-03 Em A vắng không phép buổi thứ 3 liên tiếp → Sales nhận cảnh báo, gọi phụ huynh.
- UC-04 Giáo vụ phát hiện GV điểm danh nhầm → Manager sửa lại kèm lý do sau 2 ngày.

## 10. UI Requirements

Teacher App: list card học viên (avatar, tên) với 4 nút trạng thái màu (xanh/vàng/cam/đỏ); thanh tổng kết trên cùng (18 có mặt / 2 vắng); nút "Tất cả có mặt". Web: ma trận điểm danh lớp — hàng là học viên, cột là buổi, ô icon trạng thái, click để sửa.

## 11. Validation Rules

Trạng thái bắt buộc ∈ 4 giá trị; chỉ điểm danh học viên có enrollment active tại thời điểm buổi học; không điểm danh buổi scheduled/cancelled; sửa sau chốt: lý do bắt buộc; báo vắng trước: chỉ trước giờ bắt đầu buổi.

## 12. Permissions

| Permission | Admin | Manager | Giáo vụ | Teacher | Parent |
|------------|:--:|:--:|:--:|:--:|:--:|
| edu.attendance.view | ✓ | ✓ | ✓ | ✓ (lớp mình) | ✓ (con mình) |
| edu.attendance.take | ✓ | – | – | ✓ (buổi mình) | – |
| edu.attendance.edit-after-close | ✓ | ✓ | – | – | – |
| edu.attendance.report-absence | – | – | – | – | ✓ |

## 13. Notifications

Realtime cho phụ huynh: "Bé A đã vào lớp lúc 18:02" / "Bé A vắng buổi hôm nay" (kênh: push, fallback SMS/Zalo theo Setting). Cảnh báo vắng liên tiếp → Giáo vụ + Sales. Nhắc GV chưa điểm danh (EDU-11).

## 14. Reports

Attendance Report: tỷ lệ chuyên cần theo lớp/chi nhánh/thời gian, top học viên vắng nhiều, tương quan chuyên cần – kết quả học tập.

## 15. API Mapping

| Method | Endpoint |
|--------|----------|
| GET | /api/edu/sessions/{id}/attendance |
| PUT | /api/edu/sessions/{id}/attendance (bulk upsert) |
| PATCH | /api/edu/attendance/{id} (sửa 1 bản ghi) |
| GET | /api/edu/students/{id}/attendance?from=&to= |
| GET | /api/edu/classes/{id}/attendance-matrix |
| POST | /api/parent/students/{id}/absence-report (Parent App) |

## 16. Database Design

`attendance`: id, business_id, class_session_id FK, student_id FK, enrollment_id FK, status enum(present,late,absent_excused,absent), note varchar(255) null, reported_by_parent bool default false, taken_by FK users, taken_at, edited_by null, edit_reason null, timestamps. Unique (class_session_id, student_id).

`absence_reports` (báo vắng trước): id, student_id, class_session_id, reason, reported_by (parent user), status enum(pending,confirmed), created_at.

## 17. Sequence Diagram

```
GV (App) → API: PUT /sessions/{id}/attendance [{student, status}...]
API → DB: bulk upsert (unique session+student)
API → Queue: AttendanceRecorded per student
Queue → Notification: push Parent "đến lớp/vắng"
Queue → Rule Engine: đếm vắng liên tiếp ≥ N → alert Giáo vụ/Sales
(buổi complete) API → DB: enrollments.used_sessions += 1 (present/late/absent theo policy)
```

## 18. ERD liên quan

attendance — class_sessions; — students; — enrollments; absence_reports — parents/students/sessions.

## 19. Exception Handling

| Tình huống | Xử lý |
|-----------|-------|
| Điểm danh học viên vừa bị hủy enrollment | 422, refresh danh sách |
| Double submit (2 thiết bị) | Upsert theo unique key — bản ghi sau ghi đè, log cả hai |
| Gửi thông báo phụ huynh thất bại | Retry 3 lần, fallback kênh khác, log vào Notification module |
| Sửa điểm danh làm used_sessions âm/vượt | Recalculate lại từ dữ liệu gốc, không cộng dồn tay |

## 20. Acceptance Criteria

- [ ] Mỗi cặp (buổi, học viên) chỉ có 1 bản ghi điểm danh.
- [ ] Phụ huynh nhận thông báo ≤ 1 phút sau khi GV điểm danh.
- [ ] Báo vắng trước của phụ huynh hiển thị sẵn cho GV trước buổi học.
- [ ] Cảnh báo tự động đúng khi vắng liên tiếp đạt ngưỡng cấu hình.
- [ ] Sửa điểm danh sau chốt luôn có log người sửa + lý do.

---

# EDU-13. Homework (Giao bài tập)

## 1. Business Objective

Cho phép giáo viên giao bài tập cho lớp/nhóm học viên theo buổi học, quản lý deadline, làm cơ sở cho nộp bài (EDU-14) và chấm bài (EDU-15), giúp phụ huynh đồng hành việc học ở nhà.

## 2. Business Rules

- BR-01: Bài tập thuộc 1 lớp, có thể gắn với 1 buổi học cụ thể; giao cho cả lớp hoặc chọn học viên.
- BR-02: Loại bài: `text` (mô tả), `file` (đính kèm), `quiz` (liên kết Quiz — Student App), `link` (tài nguyên ngoài).
- BR-03: Deadline mặc định = trước buổi học kế tiếp; GV chỉnh được. Sau deadline vẫn nộp được nhưng đánh dấu `late` (chính sách chặn nộp muộn theo Setting).
- BR-04: Chỉ GV của lớp tạo/sửa/xóa bài tập lớp đó; bài đã có học viên nộp thì không xóa, chỉ đóng.
- BR-05: Trạng thái bài: `draft` → `assigned` → `closed`. Chỉ assigned mới nhận bài nộp.

## 3. Actors

Teacher (tạo, giao, đóng bài); Student (nhận, xem — Student App); Parent (theo dõi — Parent App); Giáo vụ (giám sát).

## 4. Preconditions

Lớp ongoing; GV được phân công lớp; file đính kèm hợp lệ.

## 5. Postconditions

Bài tập đến được học viên được giao; thông báo push đến Student/Parent App; xuất hiện trong danh sách chờ nộp.

## 6. Functional Requirements

| ID | Yêu cầu |
|----|---------|
| FR-01 | Tạo bài tập: tiêu đề, mô tả rich text, đính kèm (ảnh/pdf/audio ≤ 20MB), loại, deadline, phạm vi giao (cả lớp/chọn học viên) |
| FR-02 | Lưu draft; giao bài (assign) từ Teacher App hoặc Web |
| FR-03 | Danh sách bài tập theo lớp: trạng thái nộp x/y học viên, quá hạn |
| FR-04 | Sửa bài đã giao (ghi version); gia hạn deadline |
| FR-05 | Đóng bài: không nhận nộp thêm, chuyển sang chấm |
| FR-06 | Template bài tập tái sử dụng (thư viện cá nhân GV) |

## 7. Non-functional Requirements

Theo mục 0.5. File lưu object storage (S3-compatible), URL ký thời hạn; ảnh nén tự động; push đến 100% thiết bị được giao ≤ 2 phút.

## 8. Workflow

```
GV tạo (draft) ──► giao bài (assigned) ──► HV nộp (EDU-14) ──► GV đóng bài (closed) ──► chấm (EDU-15)
                        │                                            ▲
                        └────────── gia hạn deadline ────────────────┘
```

## 9. Use Cases

- UC-01 Sau buổi 12, GV giao bài "Workbook trang 24-25" kèm ảnh, deadline trước buổi 13.
- UC-02 GV giao bài phụ đạo riêng cho 3 học viên yếu.
- UC-03 GV dùng lại template bài tập của khóa trước.
- UC-04 Quá deadline, GV gia hạn thêm 2 ngày cho cả lớp.

## 10. UI Requirements

Teacher App: form giao bài tối giản (tiêu đề, ảnh chụp nhanh từ camera, deadline picker mặc định buổi sau); list bài với progress nộp. Student App: tab Homework — thẻ bài tập với badge trạng thái (chưa nộp/đã nộp/đã chấm/muộn). Parent App: read-only kèm trạng thái của con.

## 11. Validation Rules

title bắt buộc ≤ 200 ký tự; deadline > thời điểm giao; file: jpg/png/pdf/mp3/mp4 ≤ 20MB, tối đa 10 file; phạm vi giao ≥ 1 học viên active; quiz_id hợp lệ khi loại quiz.

## 12. Permissions

| Permission | Admin | Manager | Giáo vụ | Teacher | Student/Parent |
|------------|:--:|:--:|:--:|:--:|:--:|
| edu.homework.view | ✓ | ✓ | ✓ | ✓ (lớp mình) | ✓ (bài của mình/con) |
| edu.homework.create/update/assign | – | – | – | ✓ (lớp mình) | – |
| edu.homework.close/extend | – | – | ✓ | ✓ (lớp mình) | – |

## 13. Notifications

Giao bài → push Student App + Parent App. Nhắc deadline (trước 24h và 2h nếu chưa nộp) → Student + Parent. Gia hạn → Student + Parent.

## 14. Reports

Tỷ lệ nộp bài đúng hạn theo lớp/học viên; số bài giao theo GV (giám sát chất lượng giảng dạy).

## 15. API Mapping

| Method | Endpoint |
|--------|----------|
| GET/POST | /api/edu/classes/{id}/homework |
| GET/PUT/DELETE | /api/edu/homework/{id} |
| PATCH | /api/edu/homework/{id}/assign |
| PATCH | /api/edu/homework/{id}/close |
| PATCH | /api/edu/homework/{id}/extend {deadline} |
| GET | /api/student/homework (Student App) |
| GET | /api/parent/students/{id}/homework (Parent App) |

## 16. Database Design

`homework`: id, business_id, class_id FK, class_session_id FK null, teacher_id FK, title, description text, type enum(text,file,quiz,link), quiz_id null, attachments json, deadline datetime, allow_late bool, assign_scope enum(class,selected), status enum(draft,assigned,closed), assigned_at, timestamps, deleted_at.

`homework_students` (khi assign_scope=selected): homework_id, student_id.

## 17. Sequence Diagram

```
GV (App) → API: POST /classes/{id}/homework (draft) [+ upload files]
GV (App) → API: PATCH /homework/{id}/assign
API → DB: resolve danh sách học viên được giao
API → Queue: HomeworkAssigned per student
Queue → Notification: push Student App + Parent App
Scheduler: deadline - 24h/2h → nhắc học viên chưa nộp
```

## 18. ERD liên quan

homework — classes; — class_sessions; — teachers; —< homework_students >— students; —< homework_submissions (EDU-14).

## 19. Exception Handling

| Tình huống | Xử lý |
|-----------|-------|
| Xóa bài đã có bài nộp | 409 — chỉ cho đóng |
| Upload file quá giới hạn | 422 trước khi upload (check client) + server |
| Giao bài cho lớp đã completed | 409 |
| Push notification thất bại một phần | Retry, hiển thị trạng thái gửi trong chi tiết bài |

## 20. Acceptance Criteria

- [ ] Học viên được giao nhận push ≤ 2 phút; học viên ngoài phạm vi không thấy bài.
- [ ] Không xóa được bài đã có submission.
- [ ] Nhắc deadline gửi đúng học viên chưa nộp, không gửi học viên đã nộp.
- [ ] Template dùng lại giữ nguyên file đính kèm.

---

# EDU-14. Homework Submission (Nộp bài)

## 1. Business Objective

Học viên nộp bài tập qua Student App (hoặc GV nộp hộ bài giấy), theo dõi trạng thái nộp, đảm bảo dữ liệu đầu vào cho chấm bài và báo cáo học tập.

## 2. Business Rules

- BR-01: Mỗi (homework, student) có tối đa 1 submission chính thức; nộp lại trước deadline sẽ ghi đè (lưu version).
- BR-02: Nộp sau deadline: đánh dấu `is_late = true`; nếu bài không cho phép nộp muộn (`allow_late = false`) → chặn.
- BR-03: Học viên chỉ nộp bài được giao cho mình, khi bài ở trạng thái `assigned`.
- BR-04: GV được nộp hộ (bài làm giấy chụp ảnh) — ghi rõ `submitted_by_teacher`.
- BR-05: Sau khi GV đã chấm, học viên không nộp lại được (trừ khi GV yêu cầu làm lại — trạng thái `redo`).

## 3. Actors

Student (nộp qua app); Teacher (nộp hộ, yêu cầu làm lại); Parent (xem trạng thái); System (đánh dấu muộn, nhắc).

## 4. Preconditions

Bài tập assigned và trong phạm vi giao; học viên đăng nhập Student App (hoặc GV thao tác hộ).

## 5. Postconditions

Submission ghi nhận với timestamp; GV nhận thông báo có bài mới; trạng thái bài của học viên chuyển `submitted`.

## 6. Functional Requirements

| ID | Yêu cầu |
|----|---------|
| FR-01 | Nộp bài: text trả lời, ảnh chụp (camera/gallery), file, audio ghi âm (luyện nói), kết quả quiz |
| FR-02 | Nộp lại trước deadline (giữ lịch sử version) |
| FR-03 | Danh sách trạng thái nộp cho GV: đã nộp/chưa nộp/muộn, lọc nhanh |
| FR-04 | GV nộp hộ với ảnh chụp bài giấy |
| FR-05 | GV yêu cầu làm lại (redo) kèm nhận xét → học viên nộp lại |
| FR-06 | Nhắc tự động học viên chưa nộp (trước deadline 24h/2h) |

## 7. Non-functional Requirements

Theo mục 0.5. Upload ảnh nén client-side (~1MB/ảnh); ghi âm tối đa 5 phút; hỗ trợ resume upload mạng yếu.

## 8. Workflow

```
assigned ──► HV nộp ──► submitted ──► GV chấm (EDU-15) ──► graded
   │            ▲                          │
   │            └──── redo (làm lại) ◄─────┘
   └── quá deadline chưa nộp ──► missing (GV thấy danh sách)
```

## 9. Use Cases

- UC-01 Học viên chụp 2 trang workbook, nộp trong 1 phút trên Student App.
- UC-02 Học viên ghi âm đoạn hội thoại luyện nói và nộp.
- UC-03 GV thu bài giấy trên lớp, chụp nộp hộ 5 em chưa có thiết bị.
- UC-04 GV thấy bài làm sai yêu cầu → bấm "Làm lại" kèm nhận xét → em nộp lại bản mới.

## 10. UI Requirements

Student App: màn chi tiết bài tập có nút nộp lớn, hỗ trợ chụp nhiều ảnh, preview trước khi gửi, trạng thái upload. Teacher App: tab theo dõi nộp bài — 3 phân đoạn (Đã nộp / Chưa nộp / Muộn) với đếm số; bulk nhắc học viên chưa nộp.

## 11. Validation Rules

Nội dung nộp ≥ 1 trong (text, file, audio, quiz_result); file jpg/png/pdf/mp3/m4a ≤ 20MB, ≤ 10 file; không nộp khi homework closed; redo chỉ từ trạng thái graded bởi GV lớp.

## 12. Permissions

| Permission | Teacher | Student | Parent |
|------------|:--:|:--:|:--:|
| edu.submission.view | ✓ (lớp mình) | ✓ (bài mình) | ✓ (bài của con, read-only) |
| edu.submission.create | ✓ (nộp hộ) | ✓ | – |
| edu.submission.request-redo | ✓ | – | – |

Admin/Manager/Giáo vụ: view toàn bộ theo scope.

## 13. Notifications

Nộp bài → push GV ("5/18 đã nộp"). Nhắc chưa nộp → Student + Parent. Yêu cầu làm lại → Student + Parent kèm nhận xét.

## 14. Reports

Tỷ lệ nộp đúng hạn theo học viên/lớp; nằm trong Student Report gửi phụ huynh định kỳ.

## 15. API Mapping

| Method | Endpoint |
|--------|----------|
| POST | /api/student/homework/{id}/submission (Student App) |
| GET | /api/student/homework/{id}/submission |
| POST | /api/edu/homework/{id}/submissions (GV nộp hộ, {student_id}) |
| GET | /api/edu/homework/{id}/submissions (GV xem danh sách) |
| PATCH | /api/edu/submissions/{id}/redo |
| POST | /api/edu/homework/{id}/remind (bulk nhắc) |

## 16. Database Design

`homework_submissions`: id, business_id, homework_id FK, student_id FK, version int default 1, content text null, attachments json, audio_url null, quiz_result json null, is_late bool, submitted_by enum(student,teacher), status enum(submitted,graded,redo), submitted_at, timestamps. Unique (homework_id, student_id).

`homework_submission_versions`: lưu bản cũ khi nộp lại (submission_id, version, snapshot json, created_at).

## 17. Sequence Diagram

```
HV (App) → Storage: upload ảnh (presigned URL)
HV (App) → API: POST /homework/{id}/submission {attachments}
API → DB: upsert submission (version++ nếu nộp lại, archive bản cũ)
API → DB: check deadline → is_late
API → Notification: push GV
GV chấm → EDU-15
```

## 18. ERD liên quan

homework_submissions — homework; — students; — homework_submission_versions; — assignments/grading (EDU-15).

## 19. Exception Handling

| Tình huống | Xử lý |
|-----------|-------|
| Nộp khi bài đã closed | 422 "Bài đã đóng, liên hệ giáo viên" |
| Nộp muộn khi allow_late=false | 422 |
| Upload đứt giữa chừng | Resume; nếu thất bại giữ draft local |
| Nộp lại sau khi đã graded | 409, hướng dẫn chờ GV yêu cầu redo |
| 2 thiết bị nộp đồng thời | Version tăng tuần tự theo DB lock, bản sau là chính thức |

## 20. Acceptance Criteria

- [ ] Học viên nộp bài thành công với ảnh/audio; GV thấy ngay trong danh sách.
- [ ] Nộp sau deadline gắn đúng cờ muộn; chặn đúng khi không cho nộp muộn.
- [ ] Nộp lại giữ được lịch sử version.
- [ ] GV nộp hộ ghi đúng nguồn submitted_by=teacher.
- [ ] Flow redo hoạt động: graded → redo → nộp lại → chờ chấm.

---

# EDU-15. Assignment — Chấm bài

## 1. Business Objective

Giáo viên chấm bài nộp của học viên: cho điểm, nhận xét, trả bài — phản hồi học tập kịp thời cho học viên và phụ huynh, dữ liệu cho điểm quá trình.

## 2. Business Rules

- BR-01: Chỉ GV của lớp (chính/trợ giảng theo phân quyền) chấm bài lớp đó.
- BR-02: Thang điểm cấu hình theo bài: điểm số (0–10, lẻ 0.25), hoặc mức đánh giá (A/B/C/D), hoặc sticker/sao (1–5) cho trẻ nhỏ — mặc định theo Setting của business.
- BR-03: Chấm xong bắt buộc có ít nhất 1 trong: điểm/mức, nhận xét text, nhận xét audio.
- BR-04: Điểm bài tập có thể được tính vào điểm quá trình (EDU-17) theo trọng số cấu hình của lớp.
- BR-05: Sửa điểm sau khi trả bài: trong 7 ngày, ghi log; sau đó cần Manager duyệt.
- BR-06: GV có thể chấm nhanh hàng loạt (bulk) với cùng mức/nhận xét mẫu.

## 3. Actors

Teacher (chấm, trả bài); Student/Parent (nhận kết quả); Giáo vụ/Manager (giám sát tiến độ chấm).

## 4. Preconditions

Submission trạng thái `submitted`; GV có quyền với lớp.

## 5. Postconditions

Submission → `graded`; điểm + nhận xét lưu; học viên/phụ huynh nhận thông báo; điểm đổ vào điểm quá trình nếu cấu hình.

## 6. Functional Requirements

| ID | Yêu cầu |
|----|---------|
| FR-01 | Màn chấm bài: xem nội dung nộp (ảnh zoom, audio player), nhập điểm/mức, nhận xét text, ghi âm nhận xét |
| FR-02 | Vẽ/đánh dấu trực tiếp lên ảnh bài làm (annotation) |
| FR-03 | Chấm lần lượt: nút "Lưu & bài tiếp theo" |
| FR-04 | Bulk chấm với nhận xét mẫu (thư viện câu nhận xét) |
| FR-05 | Yêu cầu làm lại (redo — liên kết EDU-14 FR-05) |
| FR-06 | Dashboard tiến độ chấm cho Giáo vụ: bài chưa chấm > X ngày |

## 7. Non-functional Requirements

Theo mục 0.5. Ảnh annotation lưu thành layer riêng không phá ảnh gốc; audio nhận xét ≤ 3 phút.

## 8. Workflow

```
submitted ──► GV mở bài ──► chấm (điểm + nhận xét ± annotation) ──► graded
                                    │                                 │
                                    └──► redo (làm lại) ──► EDU-14    └──► Notification HV/PH
                                                                      └──► Điểm quá trình (EDU-17)
```

## 9. Use Cases

- UC-01 GV chấm 18 bài workbook trong 15 phút bằng flow "Lưu & tiếp theo".
- UC-02 GV khoanh lỗi sai trên ảnh bài làm và ghi âm nhận xét 30 giây cho phụ huynh nghe.
- UC-03 Chấm sticker 5 sao cho lớp mẫu giáo.
- UC-04 Giáo vụ nhắc GV còn 12 bài chưa chấm quá 3 ngày.

## 10. UI Requirements

Teacher App: màn chấm split — trên là bài nộp (swipe ảnh, pinch zoom), dưới là thanh điểm nhanh (chips 5/6/7/8/9/10 hoặc sao) + ô nhận xét + micro; nút lớn "Lưu & tiếp". Web: bảng chấm dạng grid cho GV thích chấm trên máy tính.

## 11. Validation Rules

Điểm trong thang cấu hình (0–10 bước 0.25 / A-D / 1-5 sao); ≥ 1 loại phản hồi bắt buộc; annotation chỉ trên file ảnh; sửa điểm quá 7 ngày → yêu cầu approval.

## 12. Permissions

| Permission | Admin | Manager | Giáo vụ | Teacher |
|------------|:--:|:--:|:--:|:--:|
| edu.grading.grade | – | – | – | ✓ (lớp mình) |
| edu.grading.view-progress | ✓ | ✓ | ✓ | ✓ (mình) |
| edu.grading.edit-after-7d | ✓ | ✓ (duyệt) | – | đề xuất |

## 13. Notifications

Trả bài → push Student App + Parent App (điểm + nhận xét). Bài chưa chấm quá hạn → nhắc GV, cảnh báo Giáo vụ.

## 14. Reports

Thời gian chấm trung bình theo GV; phân bố điểm bài tập theo lớp; nằm trong Teacher Report & Student Report.

## 15. API Mapping

| Method | Endpoint |
|--------|----------|
| GET | /api/edu/homework/{id}/grading (danh sách chờ chấm) |
| PUT | /api/edu/submissions/{id}/grade {score, comment, audio, annotations} |
| POST | /api/edu/submissions/bulk-grade |
| GET | /api/edu/grading/pending?teacher= (dashboard) |
| PUT | /api/edu/submissions/{id}/grade-revision (sửa sau 7 ngày → pending approval) |

## 16. Database Design

`submission_grades`: id, business_id, submission_id FK unique, graded_by FK teachers, score decimal(4,2) null, grade_label varchar(5) null, stars tinyint null, comment text null, audio_comment_url null, annotations json null, graded_at, revised_by/revised_at/revise_reason null, timestamps.

Cấu hình thang điểm: trường `grading_scheme` trên homework hoặc class (json).

## 17. Sequence Diagram

```
GV (App) → API: GET /homework/{id}/grading → hàng đợi bài submitted
GV (App) → API: PUT /submissions/{id}/grade
API → DB: insert submission_grades; update submission.status=graded
API → EDU-17: nếu lớp cấu hình tính điểm quá trình → ghi score_component
API → Notification: push HV + PH
FE: auto load bài kế tiếp
```

## 18. ERD liên quan

submission_grades — homework_submissions; — teachers; → scores (EDU-17, điểm quá trình).

## 19. Exception Handling

| Tình huống | Xử lý |
|-----------|-------|
| Chấm bài đã graded (double) | 409, hiển thị điểm hiện tại, chuyển sang mode sửa |
| Điểm ngoài thang | 422 |
| Audio nhận xét quá dài | Chặn client 3 phút |
| Sửa điểm sau 7 ngày | Tạo yêu cầu chờ Manager duyệt, điểm cũ giữ nguyên tới khi duyệt |

## 20. Acceptance Criteria

- [ ] GV chấm được 1 bài (điểm + nhận xét) trong ≤ 3 thao tác chính.
- [ ] Annotation hiển thị đúng trên Student/Parent App, ảnh gốc không đổi.
- [ ] Điểm bài tập đổ đúng vào điểm quá trình theo trọng số lớp.
- [ ] Sửa điểm quá 7 ngày bắt buộc qua duyệt Manager, có log đầy đủ.
- [ ] Dashboard tiến độ chấm chính xác số bài pending theo GV.

---

# EDU-16. Examination (Kiểm tra)

## 1. Business Objective

Tổ chức các kỳ kiểm tra/đánh giá định kỳ của lớp (giữa khóa, cuối khóa, kiểm tra đầu vào, mock test Cambridge) — chuẩn hóa cấu trúc đề, lịch thi và kết nối vào bảng điểm.

## 2. Business Rules

- BR-01: Kỳ kiểm tra thuộc 1 lớp (hoặc kiểm tra đầu vào thuộc chi nhánh, không gắn lớp), có loại: `placement` (đầu vào), `midterm`, `final`, `mock`, `other`.
- BR-02: Cấu trúc điểm theo kỹ năng: Listening / Speaking / Reading / Writing (bật/tắt từng kỹ năng theo level — trẻ nhỏ có thể chỉ Listening + Speaking); mỗi kỹ năng có điểm tối đa.
- BR-03: Kỳ thi có trạng thái: `planned` → `ongoing` → `grading` → `published`. Điểm chỉ hiển thị cho phụ huynh khi `published`.
- BR-04: Mỗi lớp bắt buộc có tối thiểu các kỳ thi theo cấu hình course (mặc định: 1 midterm + 1 final) — điều kiện đóng lớp (EDU-08).
- BR-05: Học viên vắng thi được xếp thi bù trong X ngày; quá hạn ghi `absent` và không đủ điều kiện xét chứng chỉ trừ khi Manager duyệt ngoại lệ.
- BR-06: Sửa điểm sau khi published cần Manager duyệt, có log.

## 3. Actors

Giáo vụ (lập kế hoạch thi); Teacher (coi thi, nhập điểm); Manager (duyệt công bố, ngoại lệ); Student/Parent (xem kết quả sau publish).

## 4. Preconditions

Lớp ongoing; danh sách học viên active; cấu trúc kỹ năng đã thiết lập.

## 5. Postconditions

Kết quả thi lưu theo kỹ năng từng học viên; đổ vào bảng điểm tổng hợp (EDU-17); phụ huynh nhận kết quả khi published.

## 6. Functional Requirements

| ID | Yêu cầu |
|----|---------|
| FR-01 | Tạo kỳ thi: tên, loại, lớp, ngày giờ, phòng, cấu trúc kỹ năng + điểm tối đa, GV chấm |
| FR-02 | Nhập điểm theo kỹ năng: bảng nhập nhanh (hàng = học viên, cột = kỹ năng), hỗ trợ nhập trên Teacher App |
| FR-03 | Import điểm từ Excel |
| FR-04 | Nhận xét tổng theo học viên (comment + đề xuất lộ trình) |
| FR-05 | Publish kết quả (Manager duyệt nếu Setting yêu cầu) → thông báo phụ huynh |
| FR-06 | Thi bù: tạo lượt thi bù cho học viên vắng |
| FR-07 | Kiểm tra đầu vào (placement): không gắn lớp, kết quả gợi ý level phù hợp — dùng cho CRM tư vấn |

## 7. Non-functional Requirements

Theo mục 0.5. Bảng nhập điểm autosave mỗi 10s, không mất dữ liệu khi đứt mạng; publish là thao tác nguyên tử (tất cả học viên cùng lúc).

## 8. Workflow

```
planned ──(đến ngày thi)──► ongoing ──(thi xong)──► grading ──(nhập đủ điểm + duyệt)──► published
                                                       │                                   │
                                              thi bù cho HV vắng                 Notification PH + đổ điểm EDU-17
```

## 9. Use Cases

- UC-01 Giáo vụ tạo kỳ Final cho lớp Starters: 4 kỹ năng, mỗi kỹ năng 25 điểm, thi 2 buổi (viết + nói).
- UC-02 GV nhập điểm Speaking ngay trong giờ thi trên tablet.
- UC-03 2 học viên ốm ngày thi → xếp thi bù thứ 7; 1 em quá hạn → Manager duyệt ngoại lệ xét theo điểm quá trình.
- UC-04 Placement test cho khách mới → kết quả gợi ý level Movers → Sales tư vấn khóa tương ứng.

## 10. UI Requirements

Danh sách kỳ thi theo lớp với badge trạng thái. Màn nhập điểm dạng spreadsheet: điều hướng phím mũi tên/Tab, validate ngay trên ô, tổng tự tính. Kết quả trên Parent App: card điểm theo kỹ năng dạng radar/bar chart + nhận xét GV.

## 11. Validation Rules

Điểm mỗi kỹ năng: 0 → max_score kỹ năng đó, lẻ 0.25; publish yêu cầu 100% học viên có đủ điểm hoặc đánh dấu absent; ngày thi trong khoảng thời gian lớp; ngày thi bù > ngày thi chính, ≤ X ngày cấu hình.

## 12. Permissions

| Permission | Admin | Manager | Giáo vụ | Teacher | Parent/Student |
|------------|:--:|:--:|:--:|:--:|:--:|
| edu.exam.view | ✓ | ✓ | ✓ | ✓ (lớp mình) | ✓ (published, của mình/con) |
| edu.exam.create/update | ✓ | ✓ | ✓ | – | – |
| edu.exam.enter-score | ✓ | – | – | ✓ (được phân công) | – |
| edu.exam.publish | ✓ | ✓ | (theo Setting) | – | – |
| edu.exam.edit-published | ✓ | ✓ (duyệt) | – | đề xuất | – |

## 13. Notifications

Lịch thi → Parent/Student App trước X ngày + nhắc trước 1 ngày. Kết quả published → Parent App (điểm + nhận xét). Lịch thi bù → phụ huynh học viên liên quan.

## 14. Reports

Phân bố điểm theo kỹ năng/lớp/level; so sánh giữa các lớp cùng course; tỷ lệ đạt (theo ngưỡng course); tiến bộ học viên qua các kỳ (midterm → final).

## 15. API Mapping

| Method | Endpoint |
|--------|----------|
| GET/POST | /api/edu/examinations |
| GET/PUT/DELETE | /api/edu/examinations/{id} |
| GET/PUT | /api/edu/examinations/{id}/scores (bảng điểm kỹ năng) |
| POST | /api/edu/examinations/{id}/scores/import |
| PATCH | /api/edu/examinations/{id}/publish |
| POST | /api/edu/examinations/{id}/makeup {student_ids, date} |
| GET | /api/parent/students/{id}/exam-results |

## 16. Database Design

`examinations`: id, business_id, branch_id, class_id FK null (null = placement), name, type enum(placement,midterm,final,mock,other), exam_date, classroom_id null, skills json ([{skill, max_score}]), status enum(planned,ongoing,grading,published), published_at/by, timestamps, deleted_at.

`exam_results`: id, examination_id FK, student_id FK, skill_scores json ({listening: 22, speaking: 20, ...}), total decimal, comment text, is_absent bool, is_makeup bool, entered_by, timestamps. Unique (examination_id, student_id).

## 17. Sequence Diagram

```
Giáo vụ → API: POST /examinations (planned)
Scheduler → status ongoing (đến giờ)
GV → API: PUT /examinations/{id}/scores (autosave từng phần)
Giáo vụ → API: PATCH /examinations/{id}/publish
API: validate đủ điểm → (Manager approve nếu Setting) → published
API → EDU-17: ghi score components từ exam_results
API → Notification: push kết quả cho từng PH
```

## 18. ERD liên quan

examinations — classes/branches/classrooms; exam_results — examinations/students; exam_results → scores (EDU-17); placement results → leads/customers (CRM).

## 19. Exception Handling

| Tình huống | Xử lý |
|-----------|-------|
| Publish khi thiếu điểm | 422 danh sách học viên thiếu kỹ năng nào |
| Nhập điểm vượt max kỹ năng | 422 ngay trên ô nhập |
| Sửa điểm sau published | Flow duyệt Manager; phụ huynh nhận thông báo điều chỉnh |
| Học viên chuyển lớp giữa 2 kỳ thi | Kết quả giữ theo lớp đã thi; bảng điểm tổng hợp gom theo học viên |
| Autosave conflict 2 GV cùng nhập | Lock theo ô (optimistic), người sau thấy cảnh báo |

## 20. Acceptance Criteria

- [ ] Không publish được khi còn học viên chưa có điểm và chưa đánh dấu vắng.
- [ ] Phụ huynh chỉ thấy điểm sau khi published.
- [ ] Điểm theo kỹ năng hiển thị đúng biểu đồ trên Parent App.
- [ ] Thi bù cập nhật kết quả vào đúng kỳ thi gốc với cờ is_makeup.
- [ ] Placement test trả về gợi ý level đúng theo bảng quy đổi cấu hình.

---

# EDU-17. Score (Nhập điểm / Bảng điểm tổng hợp)

## 1. Business Objective

Tổng hợp mọi đầu điểm của học viên trong lớp (điểm quá trình từ bài tập, điểm chuyên cần, điểm kiểm tra) thành bảng điểm cuối khóa theo công thức trọng số — căn cứ xét hoàn thành khóa và cấp chứng chỉ.

## 2. Business Rules

- BR-01: Cấu trúc điểm của lớp kế thừa từ course, gồm các thành phần (component) có trọng số, tổng = 100%. Mặc định: Quá trình 30% (trung bình điểm bài tập), Chuyên cần 10% (tỷ lệ present+late), Giữa khóa 20%, Cuối khóa 40%.
- BR-02: Điểm thành phần tự động tổng hợp từ nguồn (EDU-12/15/16); GV chỉ nhập tay các component loại manual.
- BR-03: Điểm tổng kết thang 10, làm tròn 1 chữ số thập phân; xếp loại theo ngưỡng cấu hình (VD: ≥ 8.5 Giỏi, ≥ 7 Khá, ≥ 5 Đạt, < 5 Chưa đạt).
- BR-04: Bảng điểm chốt (`finalized`) khi đóng lớp; sau chốt chỉ Manager sửa (log + thông báo lại phụ huynh).
- BR-05: Học viên "Đạt" trở lên đủ điều kiện điểm để cấp chứng chỉ (EDU-18) — kết hợp điều kiện chuyên cần tối thiểu (Setting, mặc định ≥ 80%).

## 3. Actors

System (tự tổng hợp); Teacher (nhập điểm manual, review); Giáo vụ (theo dõi); Manager (chốt/sửa sau chốt); Parent/Student (xem).

## 4. Preconditions

Lớp có cấu trúc điểm; các nguồn điểm thành phần đã có dữ liệu.

## 5. Postconditions

Bảng điểm tổng hợp cập nhật realtime trong khóa; chốt khi đóng lớp; kết quả xếp loại làm đầu vào EDU-18.

## 6. Functional Requirements

| ID | Yêu cầu |
|----|---------|
| FR-01 | Cấu hình cấu trúc điểm theo course/lớp: thêm/bớt component, trọng số, nguồn (auto: homework/attendance/exam; manual) |
| FR-02 | Bảng điểm lớp: hàng = học viên, cột = component + tổng + xếp loại; giá trị auto có icon nguồn, click xem chi tiết |
| FR-03 | Nhập/sửa điểm manual component |
| FR-04 | Recalculate: nút tính lại khi dữ liệu nguồn thay đổi (kèm job tự động hàng đêm) |
| FR-05 | Chốt bảng điểm (finalize) — thường trong flow đóng lớp |
| FR-06 | Xuất bảng điểm PDF/Excel; phiếu điểm từng học viên (gửi phụ huynh) |

## 7. Non-functional Requirements

Theo mục 0.5. Tổng hợp điểm lớp 30 học viên × 10 component < 2s; công thức tính đặt tại service duy nhất (single source of truth) dùng chung web/app/report.

## 8. Workflow

```
Trong khóa: nguồn điểm (HW/Attendance/Exam) ──► auto tổng hợp ──► bảng điểm realtime
                                                                        │
Đóng lớp (EDU-08) ──► validate đủ điểm ──► finalize ──► xếp loại ──► EDU-18 xét chứng chỉ
                                                        │
                                                 Phiếu điểm → Parent App
```

## 9. Use Cases

- UC-01 Giữa khóa, phụ huynh mở Parent App xem điểm quá trình của con đang 7.8.
- UC-02 GV nhập điểm component manual "Dự án cuối khóa" cho 18 học viên.
- UC-03 Đóng lớp: hệ thống báo 2 học viên thiếu điểm final → bổ sung → finalize → 15 Đạt, 3 Chưa đạt.
- UC-04 Sau chốt phát hiện nhầm điểm 1 em → Manager sửa → phiếu điểm mới tự gửi lại phụ huynh.

## 10. UI Requirements

Bảng điểm dạng spreadsheet read-only với cột manual editable; màu xếp loại; footer trung bình lớp. Phiếu điểm học viên: layout đẹp in được (PDF) — logo trung tâm, điểm kỹ năng, nhận xét GV, xếp loại. Parent App: tab Score với biểu đồ tiến bộ qua thời gian.

## 11. Validation Rules

Tổng trọng số = 100%; điểm manual 0–10 (0.1); finalize yêu cầu 100% học viên đủ điểm mọi component bắt buộc (hoặc đánh dấu miễn có lý do); sửa sau chốt: quyền Manager + lý do.

## 12. Permissions

| Permission | Admin | Manager | Giáo vụ | Teacher | Parent/Student |
|------------|:--:|:--:|:--:|:--:|:--:|
| edu.score.view | ✓ | ✓ | ✓ | ✓ (lớp mình) | ✓ (mình/con) |
| edu.score.config | ✓ | ✓ | – | – | – |
| edu.score.enter-manual | – | – | – | ✓ (lớp mình) | – |
| edu.score.finalize | ✓ | ✓ | – | – | – |
| edu.score.edit-finalized | ✓ | ✓ | – | – | – |

## 13. Notifications

Phiếu điểm chốt → Parent App + email PDF. Điểm sửa sau chốt → phụ huynh nhận bản điều chỉnh. Cảnh báo học viên nguy cơ Chưa đạt (điểm quá trình < ngưỡng khi còn X buổi) → Giáo vụ + GV.

## 14. Reports

Phân bố xếp loại theo lớp/course/chi nhánh; điểm trung bình theo GV (chất lượng giảng dạy); tương quan chuyên cần – điểm.

## 15. API Mapping

| Method | Endpoint |
|--------|----------|
| GET/PUT | /api/edu/classes/{id}/score-structure |
| GET | /api/edu/classes/{id}/scores (bảng điểm) |
| PUT | /api/edu/classes/{id}/scores/manual {student, component, value} |
| POST | /api/edu/classes/{id}/scores/recalculate |
| POST | /api/edu/classes/{id}/scores/finalize |
| GET | /api/edu/students/{id}/scores (lịch sử các lớp) |
| GET | /api/edu/students/{id}/report-card/{class_id} (PDF) |

## 16. Database Design

`score_structures`: id, class_id FK, component varchar, source enum(homework,attendance,exam_midterm,exam_final,manual), weight decimal(5,2), max_score, sort_order. (Tổng weight = 100 validate ở service.)

`scores`: id, business_id, class_id FK, student_id FK, component_id FK, value decimal(4,2), source_detail json (trace: từ exam nào, bao nhiêu bài HW...), is_exempt bool, entered_by null (manual), timestamps. Unique (class_id, student_id, component_id).

`score_finals`: id, class_id, student_id, total decimal(4,2), grade enum(excellent,good,pass,fail), finalized_at/by, revised log json. Unique (class_id, student_id).

## 17. Sequence Diagram

```
Event (SubmissionGraded / SessionCompleted / ExamPublished) → Queue
Queue → ScoreService: recalculate component liên quan (class, student)
ScoreService → DB: upsert scores + tổng tạm
─────
Đóng lớp → API: POST /scores/finalize
ScoreService: validate đủ điểm → tính total + grade → insert score_finals
API → PDF Service: sinh phiếu điểm → gửi Parent App/email
API → EDU-18: danh sách học viên đủ điều kiện
```

## 18. ERD liên quan

score_structures — classes; scores — students/classes/components; score_finals — classes/students; nguồn: submission_grades, attendance, exam_results.

## 19. Exception Handling

| Tình huống | Xử lý |
|-----------|-------|
| Tổng trọng số ≠ 100% | 422 khi lưu cấu trúc |
| Finalize thiếu điểm | 422 liệt kê học viên + component thiếu |
| Nguồn điểm thay đổi sau finalize (sửa điểm thi) | Không tự đổi score_finals; cảnh báo Manager quyết định re-finalize |
| Chia 0 (lớp chưa có bài tập nào cho component homework) | Component đó tính theo policy: bỏ qua & chia lại trọng số, hoặc = 0 (Setting) |

## 20. Acceptance Criteria

- [ ] Điểm thành phần auto khớp 100% dữ liệu nguồn (kiểm chứng bằng recalculate).
- [ ] Tổng điểm và xếp loại đúng công thức trọng số ở mọi nơi hiển thị (web, app, PDF).
- [ ] Không finalize được khi thiếu điểm bắt buộc.
- [ ] Phiếu điểm PDF sinh đúng, gửi đến phụ huynh sau khi chốt.
- [ ] Sửa điểm sau chốt có log và tự gửi lại phiếu điều chỉnh.

---

# EDU-18. Certificate (Cấp chứng chỉ)

## 1. Business Objective

Cấp chứng chỉ hoàn thành khóa học cho học viên đạt điều kiện, quản lý mẫu chứng chỉ, số hiệu, tra cứu xác thực — chạm điểm kết thúc hành trình đào tạo và tạo giá trị thương hiệu trung tâm.

## 2. Business Rules

- BR-01: Điều kiện cấp: bảng điểm chốt đạt loại `pass` trở lên VÀ chuyên cần ≥ ngưỡng (mặc định 80%) VÀ hoàn thành nghĩa vụ học phí (Finance không còn công nợ khóa đó). Manager được duyệt ngoại lệ (log).
- BR-02: Số hiệu chứng chỉ duy nhất toàn business, format `{business_code}/{YYYY}/{số tăng dần 5 chữ số}` (VD: HANA/2026/00123), không tái sử dụng kể cả khi thu hồi.
- BR-03: Chứng chỉ sinh từ template theo course (nền, chữ ký, con dấu số hóa); xuất PDF chuẩn in A4 ngang.
- BR-04: Chứng chỉ có mã QR trỏ đến trang xác thực public (không cần đăng nhập) hiển thị: tên học viên, khóa, xếp loại, ngày cấp, trạng thái hiệu lực.
- BR-05: Trạng thái: `issued` → `revoked` (thu hồi khi phát hiện sai sót/gian lận, ghi lý do); cấp lại bản điều chỉnh với số hiệu mới, bản cũ revoked.
- BR-06: Cấp theo lô khi đóng lớp (auto đề xuất danh sách đủ điều kiện) hoặc cấp lẻ.

## 3. Actors

System (đề xuất danh sách); Giáo vụ (soạn cấp phát); Manager/Admin (ký duyệt, thu hồi); Parent/Student (nhận, tải, chia sẻ); Người ngoài (xác thực QR).

## 4. Preconditions

Lớp completed, score_finals đã chốt; template chứng chỉ của course đã cấu hình; dữ liệu công nợ từ Finance.

## 5. Postconditions

Chứng chỉ phát hành với số hiệu + PDF + QR; hiển thị trong Parent/Student App; tra cứu xác thực hoạt động; student.status → completed.

## 6. Functional Requirements

| ID | Yêu cầu |
|----|---------|
| FR-01 | Quản lý template chứng chỉ: upload nền, kéo thả vị trí trường (tên, khóa, xếp loại, ngày, số hiệu, QR), preview |
| FR-02 | Khi đóng lớp: auto sinh danh sách đủ/không đủ điều kiện kèm lý do từng em |
| FR-03 | Duyệt & phát hành theo lô: sinh số hiệu + PDF hàng loạt |
| FR-04 | Cấp lẻ / cấp ngoại lệ (Manager duyệt) |
| FR-05 | Thu hồi kèm lý do; cấp lại bản điều chỉnh |
| FR-06 | Trang xác thực public qua QR/số hiệu |
| FR-07 | Học viên/phụ huynh xem & tải PDF trên app; lịch sử chứng chỉ theo học viên |

## 7. Non-functional Requirements

Theo mục 0.5. Sinh PDF lô 30 chứng chỉ < 30s (queue); trang xác thực public chịu tải, cache CDN, không lộ thông tin nhạy cảm (không SĐT, không ngày sinh đầy đủ); file PDF có watermark chống sửa.

## 8. Workflow

```
Lớp completed ──► Hệ thống lọc điều kiện (điểm + chuyên cần + học phí)
                        │
        ┌───────────────┴────────────────┐
        ▼                                ▼
   Đủ điều kiện                  Không đủ ──► Manager duyệt ngoại lệ? ──► có ──┐
        │                                │ không                               │
        ▼                                ▼                                     │
  Giáo vụ trình duyệt ◄────────────────────────────────────────────────────────┘
        │
        ▼
  Manager duyệt ──► phát hành (số hiệu + PDF + QR) ──► Notification PH ──► App hiển thị
        │
        ▼ (khi cần)
     Thu hồi ──► cấp lại bản mới
```

## 9. Use Cases

- UC-01 Đóng lớp 18 học viên: 15 đủ điều kiện, 2 thiếu chuyên cần, 1 còn công nợ → cấp 15, Manager duyệt thêm 1 ngoại lệ chuyên cần 78%.
- UC-02 Phụ huynh tải PDF chứng chỉ từ Parent App, chia sẻ Facebook (ảnh preview đẹp).
- UC-03 Trường tiểu học quét QR xác thực chứng chỉ Cambridge Starters của bé.
- UC-04 Phát hiện sai tên học viên → thu hồi, cấp lại số hiệu mới trong 5 phút.

## 10. UI Requirements

Trình thiết kế template: canvas kéo thả field lên ảnh nền, font/size/màu tùy chỉnh, preview với dữ liệu mẫu. Màn phát hành lô: bảng học viên với cột điều kiện (✓/✗ + lý do), chọn phát hành. Trang xác thực public: tối giản, logo trung tâm, thông tin chứng chỉ, trạng thái hiệu lực nổi bật.

## 11. Validation Rules

Template đủ field bắt buộc (tên, khóa, số hiệu, QR); phát hành: học viên qua bộ lọc điều kiện hoặc có approval; thu hồi: lý do ≥ 10 ký tự; số hiệu sinh tuần tự, không nhảy/trùng (sequence DB).

## 12. Permissions

| Permission | Admin | Manager | Giáo vụ | Parent/Student |
|------------|:--:|:--:|:--:|:--:|
| edu.certificate.view | ✓ | ✓ | ✓ | ✓ (của mình/con) |
| edu.certificate.template | ✓ | ✓ | – | – |
| edu.certificate.issue | ✓ | ✓ (duyệt) | ✓ (trình) | – |
| edu.certificate.revoke | ✓ | ✓ | – | – |
| Xác thực public | Không cần đăng nhập | | | |

## 13. Notifications

Phát hành → Parent App + email kèm PDF. Thu hồi/cấp lại → phụ huynh. Danh sách chờ duyệt → Manager.

## 14. Reports

Số chứng chỉ cấp theo course/kỳ; tỷ lệ học viên hoàn thành có chứng chỉ; lượt xác thực QR (mức độ sử dụng).

## 15. API Mapping

| Method | Endpoint |
|--------|----------|
| GET/POST/PUT | /api/edu/certificate-templates |
| GET | /api/edu/classes/{id}/certificate-eligibility |
| POST | /api/edu/classes/{id}/certificates/issue (lô) |
| POST | /api/edu/certificates (cấp lẻ) |
| PATCH | /api/edu/certificates/{id}/revoke |
| GET | /api/edu/students/{id}/certificates |
| GET | /api/public/certificates/verify/{code} (public, không auth) |

## 16. Database Design

`certificate_templates`: id, business_id, course_id FK null (null = mặc định), name, background_url, fields json (vị trí/kiểu), status, timestamps.

`certificates`: id, business_id, certificate_no varchar unique, student_id FK, class_id FK, course_id FK, template_id FK, grade, issued_date, issued_by, approved_by, pdf_url, qr_code, status enum(issued,revoked), revoke_reason/revoked_at null, replaced_by_id FK null (self), exception_approved_by null, timestamps.

`certificate_sequences`: business_id, year, last_number (sinh số hiệu atomic).

## 17. Sequence Diagram

```
Đóng lớp (EDU-08) → API: GET /certificate-eligibility
API → ScoreService + Attendance + Finance: check 3 điều kiện từng học viên
Giáo vụ → API: POST /certificates/issue {student_ids}
API → DB: sequence → sinh certificate_no (atomic, tx)
API → Queue: render PDF từng chứng chỉ (template + data + QR)
Queue → Storage: lưu PDF → update pdf_url
Queue → Notification: push + email phụ huynh
─────
Người ngoài quét QR → GET /public/certificates/verify/{code} → thông tin + trạng thái
```

## 18. ERD liên quan

certificates — students/classes/courses/templates; — score_finals (điều kiện); — invoices (Finance, điều kiện công nợ); certificates — certificates (replaced_by self-reference).

## 19. Exception Handling

| Tình huống | Xử lý |
|-----------|-------|
| Cấp cho học viên không đủ điều kiện, không có duyệt | 422 kèm lý do thiếu |
| Trùng số hiệu (race khi cấp lô song song) | Sequence DB atomic — không thể trùng; test concurrency |
| Render PDF lỗi giữa lô | Retry từng cái; chứng chỉ lỗi ở trạng thái pending-render, không mất số hiệu |
| Xác thực mã không tồn tại | Trang public: "Không tìm thấy chứng chỉ" — không tiết lộ thêm |
| Thu hồi chứng chỉ đã chia sẻ | Trang xác thực hiển thị "Đã thu hồi" ngay lập tức (cache invalidate) |

## 20. Acceptance Criteria

- [ ] Chỉ học viên qua đủ 3 điều kiện (điểm, chuyên cần, học phí) hoặc có duyệt ngoại lệ mới được cấp.
- [ ] Số hiệu duy nhất tuyệt đối kể cả khi cấp lô đồng thời.
- [ ] QR xác thực trả kết quả đúng < 2s, hoạt động không cần đăng nhập.
- [ ] Thu hồi có hiệu lực ngay trên trang xác thực; bản cấp lại liên kết bản cũ.
- [ ] PDF đúng template, đúng dữ liệu, tải được từ Parent/Student App.

---

# Phụ lục

## A. Ma trận phụ thuộc giữa các chức năng

| Chức năng | Phụ thuộc |
|-----------|-----------|
| EDU-01 Student | System (User), CRM (Customer) |
| EDU-02 Parent | EDU-01 |
| EDU-03 Course | EDU-04, EDU-05, Finance (Product) |
| EDU-07 Teacher | HR (Employee), EDU-04 |
| EDU-08 Class | EDU-03, EDU-06, EDU-07 |
| EDU-09 Enrollment | EDU-01, EDU-08, Finance (Invoice) |
| EDU-10 Timetable | EDU-06, EDU-07, EDU-08 |
| EDU-11 Session | EDU-10 |
| EDU-12 Attendance | EDU-09, EDU-11 |
| EDU-13/14/15 Homework chain | EDU-08, EDU-11 |
| EDU-16 Examination | EDU-08 |
| EDU-17 Score | EDU-12, EDU-15, EDU-16 |
| EDU-18 Certificate | EDU-17, Finance (Debt) |

## B. Thứ tự triển khai đề xuất (theo phụ thuộc)

1. **Phase 1 — Nền tảng:** EDU-04, 05, 06 (danh mục) → EDU-03 (Course) → EDU-01, 02 (Student/Parent) → EDU-07 (Teacher).
2. **Phase 2 — Vận hành lớp:** EDU-08 (Class) → EDU-10 (Timetable) → EDU-11 (Session) → EDU-09 (Enrollment) → EDU-12 (Attendance).
3. **Phase 3 — Học tập & đánh giá:** EDU-13, 14, 15 (Homework chain) → EDU-16 (Examination) → EDU-17 (Score) → EDU-18 (Certificate).

## C. Event nghiệp vụ phát ra (tích hợp module khác)

| Event | Consumer |
|-------|----------|
| StudentCreated / StatusChanged | Notification, Reporting, CRM |
| EnrollmentCreated / Cancelled | Finance (hoàn phí), Notification, Reporting |
| SessionCompleted | HR (giờ dạy), Reporting |
| AttendanceRecorded | Notification (PH), Reporting |
| SubmissionGraded / ExamPublished | Score Service, Notification |
| ScoreFinalized | Certificate, Reporting |
| CertificateIssued | Notification, Reporting |

## D. Open Questions (cần chốt với nghiệp vụ)

1. Chính sách buổi vắng: có phép/không phép có trừ buổi trong gói không? Số suất học bù tối đa?
2. Ghi danh giữa khóa: buổi thừa được bảo lưu sang khóa sau hay hoàn tiền?
3. Ngưỡng thanh toán tối thiểu để được vào học (trả góp) — % cụ thể?
4. Quy đổi điểm placement test → level: bảng chuẩn nào (Cambridge shields)?
5. Chứng chỉ song ngữ hay chỉ tiếng Việt/tiếng Anh?
6. Trợ giảng có quyền điểm danh và chấm bài không, hay chỉ GV chính?



