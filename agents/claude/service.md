# Tera App — Đặc tả Service & API

## Tổng quan

Tất cả API đều dùng base URL từ biến môi trường:
- Web (Vite): `VITE_TERA_API`
- Mobile (Expo): `EXPO_PUBLIC_API_URL`

Các endpoint prefix được định nghĩa trong `services/api/src/_endpoint.ts`:

| Biến | Giá trị |
|---|---|
| `endpoint` | `{BASE_API}/v1` |
| `portalEndpoint` | `{BASE_API}/api/portal` |
| `authEndpoint` | `{BASE_API}/api/auth` |
| `adminEndpoint` | `{BASE_API}/api/admin` |

Mọi service đều dùng `endpoint` (`/v1`) làm prefix. Mỗi API module cung cấp các hàm chuẩn: `getList`, `getDetail`, `create`, `update`, `delete`, và tuỳ domain có thêm `export`, `suspend`, `restore`.

---

## 1. SYSTEM — Hệ thống

### 1.1 Auth — Xác thực
**Service:** `system/auth/auth.service.ts` | **API:** `system/auth/auth.api.ts`

Quản lý thông tin xác thực tài khoản hệ thống (credentials, sessions).

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/system/auth/list` | Danh sách auth |
| GET | `/v1/system/auth/detail/:id` | Chi tiết auth |
| POST | `/v1/system/auth/create` | Tạo auth |
| PUT | `/v1/system/auth/update/:id` | Cập nhật auth |
| DELETE | `/v1/system/auth/delete/:id` | Xoá auth |
| POST | `/v1/system/auth/export` | Xuất dữ liệu |

---

### 1.2 User — Người dùng
**Service:** `system/user/user.service.ts` | **API:** `system/user/user.api.ts`

Quản lý tài khoản người dùng trong hệ thống (admin, staff, teacher).

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/sys/user/list` | Danh sách user |
| GET | `/v1/sys/user/detail/:id` | Chi tiết user |
| POST | `/v1/sys/user/create` | Tạo user |
| PUT | `/v1/sys/user/update/:id` | Cập nhật user |
| DELETE | `/v1/sys/user/delete/:id` | Xoá user |
| POST | `/v1/sys/user/export` | Xuất dữ liệu |

---

### 1.3 Profile — Hồ sơ người dùng
**Service:** `system/user/profile.service.ts` | **API:** `system/user/profile.api.ts`

Quản lý thông tin cá nhân chi tiết của user (avatar, thông tin liên hệ...).

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/system/profile/list` | Danh sách profile |
| GET | `/v1/system/profile/detail/:id` | Chi tiết profile |
| POST | `/v1/system/profile/create` | Tạo profile |
| PUT | `/v1/system/profile/update/:id` | Cập nhật profile |
| DELETE | `/v1/system/profile/delete/:id` | Xoá profile |

---

### 1.4 Business — Doanh nghiệp / Trung tâm
**Service:** `system/business/business.service.ts` | **API:** `system/business/business.api.ts`

Quản lý thông tin trung tâm/doanh nghiệp (tên, logo, thông tin pháp lý).

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/sys/business/list` | Danh sách business |
| GET | `/v1/sys/business/detail/:id` | Chi tiết business |
| POST | `/v1/sys/business/create` | Tạo business |
| PUT | `/v1/sys/business/update/:id` | Cập nhật business |
| DELETE | `/v1/sys/business/delete/:id` | Xoá business |
| POST | `/v1/sys/business/export` | Xuất dữ liệu |

---

### 1.5 Branch — Chi nhánh
**Service:** `system/branch/branch.service.ts` | **API:** `system/branch/branch.api.ts`

Quản lý các chi nhánh của trung tâm (địa chỉ, liên hệ, trạng thái).

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/sys/branch/list` | Danh sách chi nhánh |
| GET | `/v1/sys/branch/detail/:id` | Chi tiết chi nhánh |
| POST | `/v1/sys/branch/create` | Tạo chi nhánh |
| PUT | `/v1/sys/branch/update/:id` | Cập nhật chi nhánh |
| DELETE | `/v1/sys/branch/delete/:id` | Xoá chi nhánh |

---

### 1.6 Role — Vai trò
**Service:** `system/role/role.service.ts` | **API:** `system/role/role.api.ts`

Quản lý vai trò phân quyền (admin, manager, teacher, staff...).

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/system/role/list` | Danh sách role |
| GET | `/v1/system/role/detail/:id` | Chi tiết role |
| POST | `/v1/system/role/create` | Tạo role |
| PUT | `/v1/system/role/update/:id` | Cập nhật role |
| DELETE | `/v1/system/role/delete/:id` | Xoá role |
| POST | `/v1/system/role/export` | Xuất dữ liệu |

---

### 1.7 Permission — Quyền hạn
**Service:** `system/permission/permission.service.ts` | **API:** `system/permission/permission.api.ts`

Quản lý quyền hạn chi tiết gán cho vai trò (CRUD từng module).

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/system/permission/list` | Danh sách permission |
| GET | `/v1/system/permission/detail/:id` | Chi tiết permission |
| POST | `/v1/system/permission/create` | Tạo permission |
| PUT | `/v1/system/permission/update/:id` | Cập nhật permission |
| DELETE | `/v1/system/permission/delete/:id` | Xoá permission |
| POST | `/v1/system/permission/export` | Xuất dữ liệu |

---

### 1.8 Setting — Cài đặt hệ thống
**Service:** `system/setting/setting.service.ts` | **API:** `system/setting/setting.api.ts`

Cấu hình hệ thống (múi giờ, ngôn ngữ, thông số vận hành trung tâm).

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/system/setting/list` | Danh sách setting |
| GET | `/v1/system/setting/detail/:id` | Chi tiết setting |
| POST | `/v1/system/setting/create` | Tạo setting |
| PUT | `/v1/system/setting/update/:id` | Cập nhật setting |
| DELETE | `/v1/system/setting/delete/:id` | Xoá setting |
| POST | `/v1/system/setting/export` | Xuất dữ liệu |

---

### 1.9 Audit — Nhật ký hệ thống
**Service:** `system/audit/audit.service.ts` | **API:** `system/audit/audit.api.ts`

Ghi lại toàn bộ hành động của người dùng trong hệ thống (ai, làm gì, khi nào).

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/system/audit/list` | Danh sách audit log |
| GET | `/v1/system/audit/detail/:id` | Chi tiết audit log |
| POST | `/v1/system/audit/create` | Tạo audit log |
| PUT | `/v1/system/audit/update/:id` | Cập nhật audit log |
| DELETE | `/v1/system/audit/delete/:id` | Xoá audit log |
| POST | `/v1/system/audit/export` | Xuất dữ liệu |

---

## 2. CRM — Quản lý quan hệ khách hàng

### 2.1 Lead — Tiềm năng
**Service:** `crm/lead/lead.service.ts` | **API:** `crm/lead/lead.api.ts`

Quản lý khách hàng tiềm năng đang trong pipeline tư vấn (tên, nguồn, trạng thái, ghi chú).

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/crm/lead/list` | Danh sách lead |
| GET | `/v1/crm/lead/detail/:id` | Chi tiết lead |
| POST | `/v1/crm/lead/create` | Tạo lead |
| PUT | `/v1/crm/lead/update/:id` | Cập nhật lead |
| DELETE | `/v1/crm/lead/delete/:id` | Xoá lead |
| POST | `/v1/crm/lead/export` | Xuất dữ liệu |

> Các service bổ sung: `lead-pipeline.service.ts` (quản lý giai đoạn pipeline), `lead-activity.service.ts` (lịch sử hoạt động tư vấn).

---

### 2.2 Enrollment — Đăng ký học
**Service:** `crm/enrollment/enrollment.service.ts` | **API:** `crm/enrollment/enrollment.api.ts`

Quản lý quá trình đăng ký học của học viên (từ lead → học viên chính thức).

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/crm/enrollment/list` | Danh sách đăng ký |
| GET | `/v1/crm/enrollment/detail/:id` | Chi tiết đăng ký |
| POST | `/v1/crm/enrollment/create` | Tạo đăng ký |
| PUT | `/v1/crm/enrollment/update/:id` | Cập nhật đăng ký |
| DELETE | `/v1/crm/enrollment/delete/:id` | Xoá đăng ký |
| POST | `/v1/crm/enrollment/export` | Xuất dữ liệu |

---

### 2.3 Parent — Phụ huynh
**Service:** `crm/parent/parent.service.ts` | **API:** `crm/parent/parent.api.ts`

Quản lý thông tin phụ huynh / người giám hộ học viên.

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/crm/parent/list` | Danh sách phụ huynh |
| GET | `/v1/crm/parent/detail/:id` | Chi tiết phụ huynh |
| POST | `/v1/crm/parent/create` | Tạo phụ huynh |
| PUT | `/v1/crm/parent/update/:id` | Cập nhật phụ huynh |
| DELETE | `/v1/crm/parent/delete/:id` | Xoá phụ huynh |
| POST | `/v1/crm/parent/export` | Xuất dữ liệu |
| POST | `/v1/crm/parent/suspend/:id` | Tạm ngưng tài khoản |
| POST | `/v1/crm/parent/restore/:id` | Khôi phục tài khoản |

---

### 2.4 Parent-Student — Liên kết Phụ huynh - Học viên
**Service:** `crm/parent-student/parent-student.service.ts` | **API:** `crm/parent-student/parent-student.api.ts`

Quản lý mối quan hệ giữa phụ huynh và học viên (cha, mẹ, ông bà, người giám hộ).

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/crm/parent-student/list` | Danh sách liên kết |
| GET | `/v1/crm/parent-student/detail/:id` | Chi tiết liên kết |
| POST | `/v1/crm/parent-student/create` | Tạo liên kết (body: `parent_id`, `student_id`, `relation`) |
| PUT | `/v1/crm/parent-student/update/:id` | Cập nhật liên kết |
| DELETE | `/v1/crm/parent-student/delete/:id` | Xoá liên kết |

---

## 3. EDUCATION — Quản lý đào tạo

### 3.1 Student — Học viên
**Service:** `education/student/student.service.ts` | **API:** `education/student/student.api.ts`

Quản lý hồ sơ học viên (thông tin cá nhân, trạng thái học tập).

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/edu/student/list` | Danh sách học viên |
| GET | `/v1/edu/student/detail/:id` | Chi tiết học viên |
| POST | `/v1/edu/student/create` | Tạo học viên |
| PUT | `/v1/edu/student/update/:id` | Cập nhật học viên |
| DELETE | `/v1/edu/student/delete/:id` | Xoá học viên |
| POST | `/v1/edu/student/export` | Xuất dữ liệu |
| POST | `/v1/edu/student/suspend/:id` | Tạm ngưng học viên |
| POST | `/v1/edu/student/restore/:id` | Khôi phục học viên |

> Service bổ sung: `student-profile.service.ts` (`/v1/education/student-profile`), `student-level.service.ts` (`/v1/edu/student-level`), `student-status.service.ts` (`/v1/education/student-status`), `student-document.service.ts` (`/v1/education/student-document`), `student-history.service.ts` (`/v1/education/student-history`).

---

### 3.2 Level — Trình độ
**Service:** `education/level/level.service.ts` | **API:** `education/level/level.api.ts`

Danh mục trình độ học viên (Beginner, Elementary, Intermediate, Advanced...).

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/edu/level/list` | Danh sách trình độ |
| GET | `/v1/edu/level/detail/:id` | Chi tiết trình độ |
| POST | `/v1/edu/level/create` | Tạo trình độ |
| PUT | `/v1/edu/level/update/:id` | Cập nhật trình độ |
| POST | `/v1/edu/level/suspend/:id` | Tạm ngưng trình độ |
| POST | `/v1/edu/level/restore/:id` | Khôi phục trình độ |

---

### 3.3 Course — Khoá học
**Service:** `education/course/course.service.ts` | **API:** `education/course/course.api.ts`

Quản lý khoá học (tên, mô tả, thời lượng, trình độ, chương trình học).

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/edu/course/list` | Danh sách khoá học |
| GET | `/v1/edu/course/detail/:id` | Chi tiết khoá học |
| POST | `/v1/edu/course/create` | Tạo khoá học |
| PUT | `/v1/edu/course/update/:id` | Cập nhật khoá học |
| DELETE | `/v1/edu/course/delete/:id` | Xoá khoá học |
| POST | `/v1/edu/course/export` | Xuất dữ liệu |

> Service bổ sung: `course-level.service.ts` (`/v1/education/course-level`), `course-pricing.service.ts` (`/v1/education/course-pricing`), `curriculum.service.ts` (`/v1/education/curriculum`).

---

### 3.4 Class Room — Lớp học
**Service:** `education/class-room/class-room.service.ts` | **API:** `education/class-room/class-room.api.ts`

Quản lý lớp học (tên lớp, khoá học, giáo viên, sĩ số, trạng thái).

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/edu/class-room/list` | Danh sách lớp học |
| GET | `/v1/edu/class-room/detail/:id` | Chi tiết lớp học |
| POST | `/v1/edu/class-room/create` | Tạo lớp học |
| PUT | `/v1/edu/class-room/update/:id` | Cập nhật lớp học |
| DELETE | `/v1/edu/class-room/delete/:id` | Xoá lớp học |
| POST | `/v1/edu/class-room/export` | Xuất dữ liệu |
| POST | `/v1/edu/class-room/suspend/:id` | Tạm ngưng lớp |
| POST | `/v1/edu/class-room/restore/:id` | Khôi phục lớp |

> Service bổ sung: `class-schedule.service.ts` (lịch học của lớp — list/create lồng `edu/class-room/:classId/schedule/*`, detail/update/delete tại `/v1/edu/class-schedule/*`), `class-enrollment.service.ts` (`/v1/education/class-enrollment`), `class-session.service.ts` (`/v1/education/class-session`), `class-capacity.service.ts` (`/v1/education/class-capacity`).

---

### 3.5 Lesson Plan — Giáo án
**Service:** `education/lesson-plan/lesson-plan.service.ts` | **API:** `education/lesson-plan/lesson-plan.api.ts`

Quản lý kế hoạch giảng dạy theo khoá học / lớp học.

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/edu/lesson-plan/list` | Danh sách giáo án |
| GET | `/v1/edu/lesson-plan/detail/:id` | Chi tiết giáo án |
| POST | `/v1/edu/lesson-plan/create` | Tạo giáo án |
| PUT | `/v1/edu/lesson-plan/update/:id` | Cập nhật giáo án |
| DELETE | `/v1/edu/lesson-plan/delete/:id` | Xoá giáo án |
| POST | `/v1/edu/lesson-plan/export` | Xuất dữ liệu |

---

### 3.6 Lesson — Buổi học
**Service:** `education/lesson/lesson.service.ts` | **API:** `education/lesson/lesson.api.ts`

Quản lý từng buổi học cụ thể (nội dung, tài liệu, tiến độ).

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/edu/lesson/list` | Danh sách buổi học |
| GET | `/v1/edu/lesson/detail/:id` | Chi tiết buổi học |
| POST | `/v1/edu/lesson/create` | Tạo buổi học |
| PUT | `/v1/edu/lesson/update/:id` | Cập nhật buổi học |
| DELETE | `/v1/edu/lesson/delete/:id` | Xoá buổi học |
| POST | `/v1/edu/lesson/export` | Xuất dữ liệu |

> Service bổ sung: `lesson-material.service.ts` (tài liệu — `/v1/education/lesson-material`), `lesson-progress.service.ts` (tiến độ học — `/v1/education/lesson-progress`).

---

### 3.7 Attendance — Điểm danh
**Service:** `education/attendance/attendance.service.ts` | **API:** `education/attendance/attendance.api.ts`

Ghi nhận và quản lý điểm danh học viên theo từng buổi học.

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/edu/attendance/list` | Danh sách điểm danh |
| GET | `/v1/edu/attendance/detail/:id` | Chi tiết điểm danh |
| POST | `/v1/edu/attendance/create` | Ghi điểm danh |
| PUT | `/v1/edu/attendance/update/:id` | Cập nhật điểm danh |
| DELETE | `/v1/edu/attendance/delete/:id` | Xoá bản ghi |
| POST | `/v1/edu/attendance/export` | Xuất dữ liệu |

> Service bổ sung: `absence-reason.service.ts` (lý do vắng mặt — `/v1/education/absence-reason`), `attendance-session.service.ts` (phiên điểm danh — `/v1/education/attendance-session`).

---

### 3.8 Homework — Bài tập về nhà
**Service:** `education/lesson/homework.service.ts` | **API:** `education/homework/homework.api.ts`

Quản lý bài tập giao cho học viên sau mỗi buổi học.

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/education/homework/list` | Danh sách bài tập |
| GET | `/v1/education/homework/detail/:id` | Chi tiết bài tập |
| POST | `/v1/education/homework/create` | Tạo bài tập |
| PUT | `/v1/education/homework/update/:id` | Cập nhật bài tập |
| DELETE | `/v1/education/homework/delete/:id` | Xoá bài tập |

---

### 3.9 Evaluation — Đánh giá
**Service:** `education/evaluation/evaluation.service.ts` | **API:** `education/evaluation/evaluation.api.ts`

Quản lý kết quả đánh giá học viên (định kỳ hoặc cuối kỳ).

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/edu/evaluation/list` | Danh sách đánh giá |
| GET | `/v1/edu/evaluation/detail/:id` | Chi tiết đánh giá |
| POST | `/v1/edu/evaluation/create` | Tạo đánh giá |
| PUT | `/v1/edu/evaluation/update/:id` | Cập nhật đánh giá |
| DELETE | `/v1/edu/evaluation/delete/:id` | Xoá đánh giá |
| POST | `/v1/edu/evaluation/export` | Xuất dữ liệu |

> Service bổ sung: `exam.service.ts` (bài kiểm tra — `/v1/education/exam`), `score.service.ts` (điểm số — `/v1/education/score`), `skill-assessment.service.ts` (đánh giá kỹ năng — `/v1/education/skill-assessment`), `test.service.ts` (bài test — `/v1/education/test`), `progress-report.service.ts` (báo cáo tiến độ học — `/v1/education/progress-report`).

---

## 4. HR — Nhân sự

### 4.1 Teacher — Giáo viên
**Service:** `hr/teacher/teacher.service.ts` | **API:** `hr/teacher/teacher.api.ts`

Quản lý hồ sơ giáo viên, chứng chỉ, trạng thái làm việc.

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/hr/teacher/list` | Danh sách giáo viên |
| GET | `/v1/hr/teacher/detail/:id` | Chi tiết giáo viên |
| POST | `/v1/hr/teacher/create` | Tạo giáo viên |
| PUT | `/v1/hr/teacher/update/:id` | Cập nhật giáo viên |
| DELETE | `/v1/hr/teacher/delete/:id` | Xoá giáo viên |
| POST | `/v1/hr/teacher/export` | Xuất dữ liệu |
| POST | `/v1/hr/teacher/suspend/:id` | Tạm ngưng |
| POST | `/v1/hr/teacher/restore/:id` | Khôi phục |
| POST | `/v1/hr/teacher/resign/:id` | Ghi nhận nghỉ việc |
| GET | `/v1/hr/teacher/certificate/list/:id` | Danh sách chứng chỉ |
| POST | `/v1/hr/teacher/certificate/create/:id` | Thêm chứng chỉ |
| PUT | `/v1/hr/teacher/certificate/update/:id` | Cập nhật chứng chỉ |
| DELETE | `/v1/hr/teacher/certificate/delete/:id` | Xoá chứng chỉ |

> Service bổ sung: `teacher-profile.service.ts` (`/v1/hr/teacher-profile`), `teacher-schedule.service.ts` (`/v1/hr/teacher-schedule`), `teacher-salary.service.ts` (`/v1/hr/teacher-salary`), `teacher-performance.service.ts` (`/v1/hr/teacher-performance`).

---

### 4.2 Staff — Nhân viên
**Service:** `hr/staff/staff.service.ts` | **API:** `hr/staff/staff.api.ts`

Quản lý nhân viên hành chính, tư vấn, nhân sự không giảng dạy.

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/hr/staff/list` | Danh sách nhân viên |
| GET | `/v1/hr/staff/detail/:id` | Chi tiết nhân viên |
| POST | `/v1/hr/staff/create` | Tạo nhân viên |
| PUT | `/v1/hr/staff/update/:id` | Cập nhật nhân viên |
| DELETE | `/v1/hr/staff/delete/:id` | Xoá nhân viên |
| POST | `/v1/hr/staff/export` | Xuất dữ liệu |

> Service bổ sung: `department.service.ts` (phòng ban — `/v1/hr/department`), `job-role.service.ts` (vị trí công việc — `/v1/hr/job-role`), `work-schedule.service.ts` (lịch làm việc — `/v1/hr/work-schedule`).

---

## 5. FINANCE — Tài chính

### 5.1 Invoice — Hoá đơn
**Service:** `finance/invoice/invoice.service.ts` | **API:** `finance/invoice/invoice.api.ts`

Quản lý hoá đơn học phí, thu tiền học viên.

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/fin/invoice/list` | Danh sách hoá đơn |
| GET | `/v1/fin/invoice/detail/:id` | Chi tiết hoá đơn |
| POST | `/v1/fin/invoice/create` | Tạo hoá đơn |
| PUT | `/v1/fin/invoice/update/:id` | Cập nhật hoá đơn |
| DELETE | `/v1/fin/invoice/delete/:id` | Xoá hoá đơn |
| POST | `/v1/fin/invoice/export` | Xuất dữ liệu |

> Service bổ sung: `invoice-item.service.ts` (dòng mục hoá đơn — `/v1/finance/invoice-item`), `invoice-status.service.ts` (trạng thái hoá đơn — `/v1/finance/invoice-status`), `invoice-adjustment.service.ts` (điều chỉnh hoá đơn — `/v1/finance/invoice-adjustment`).

---

### 5.2 Payment — Thanh toán
**Service:** `finance/payment/payment.service.ts` | **API:** `finance/payment/payment.api.ts`

Ghi nhận các khoản thanh toán của học viên.

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/fin/payment/list` | Danh sách thanh toán |
| GET | `/v1/fin/payment/detail/:id` | Chi tiết thanh toán |
| POST | `/v1/fin/payment/create` | Tạo thanh toán |
| PUT | `/v1/fin/payment/update/:id` | Cập nhật thanh toán |
| DELETE | `/v1/fin/payment/delete/:id` | Xoá thanh toán |
| POST | `/v1/fin/payment/export` | Xuất dữ liệu |

> Service bổ sung: `payment-method.service.ts` (phương thức thanh toán — `/v1/finance/payment-method`), `payment-transaction.service.ts` (giao dịch — `/v1/finance/payment-transaction`).

---

### 5.3 Refund — Hoàn tiền
**Service:** `finance/refund/refund.service.ts` | **API:** `finance/refund/refund.api.ts`

Quản lý các yêu cầu hoàn tiền học phí.

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/fin/refund/list` | Danh sách hoàn tiền |
| GET | `/v1/fin/refund/detail/:id` | Chi tiết hoàn tiền |
| POST | `/v1/fin/refund/create` | Tạo yêu cầu hoàn tiền |
| PUT | `/v1/fin/refund/update/:id` | Cập nhật |
| DELETE | `/v1/fin/refund/delete/:id` | Xoá |
| POST | `/v1/fin/refund/export` | Xuất dữ liệu |

---

### 5.4 Debt — Công nợ
**Service:** `finance/debt/debt.service.ts` | **API:** `finance/debt/debt.api.ts`

Theo dõi công nợ học phí chưa thanh toán của học viên.

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/fin/debt/list` | Danh sách công nợ |
| GET | `/v1/fin/debt/detail/:id` | Chi tiết công nợ |
| POST | `/v1/fin/debt/create` | Tạo công nợ |
| PUT | `/v1/fin/debt/update/:id` | Cập nhật |
| DELETE | `/v1/fin/debt/delete/:id` | Xoá |
| POST | `/v1/fin/debt/export` | Xuất dữ liệu |

> Service bổ sung: `debt-aging.service.ts` (phân tích tuổi nợ — `/v1/finance/debt-aging`), `debt-reminder.service.ts` (nhắc nợ — `/v1/finance/debt-reminder`).

---

### 5.5 Discount — Giảm giá
**Service:** `finance/discount/discount.service.ts` | **API:** `finance/discount/discount.api.ts`

Quản lý chương trình giảm giá học phí.

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/fin/discount/list` | Danh sách giảm giá |
| GET | `/v1/fin/discount/detail/:id` | Chi tiết giảm giá |
| POST | `/v1/fin/discount/create` | Tạo giảm giá |
| PUT | `/v1/fin/discount/update/:id` | Cập nhật |
| DELETE | `/v1/fin/discount/delete/:id` | Xoá |
| POST | `/v1/fin/discount/export` | Xuất dữ liệu |

> Service bổ sung: `discount-rule.service.ts` (quy tắc giảm giá — `/v1/finance/discount-rule`), `coupon.service.ts` (mã giảm giá — `/v1/finance/coupon`), `promotion-campaign.service.ts` (chiến dịch khuyến mãi — `/v1/finance/promotion-campaign`).

---

## 6. WALLET — Ví điện tử

### 6.1 Wallet — Ví
**Service:** `wallet/wallet/wallet.service.ts` | **API:** `wallet/wallet/wallet.api.ts`

Quản lý ví điện tử của học viên / phụ huynh (số dư, trạng thái).

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/fin/wallet/list` | Danh sách ví |
| GET | `/v1/fin/wallet/detail/:id` | Chi tiết ví |
| POST | `/v1/fin/wallet/create` | Tạo ví |
| PUT | `/v1/fin/wallet/update/:id` | Cập nhật ví |
| DELETE | `/v1/fin/wallet/delete/:id` | Xoá ví |
| POST | `/v1/fin/wallet/export` | Xuất dữ liệu |

---

### 6.2 Wallet Transaction — Giao dịch ví
**Service:** `wallet/wallet-transaction/wallet-transaction.service.ts` | **API:** `wallet/wallet-transaction/wallet-transaction.api.ts`

Ghi nhận mọi giao dịch nạp/rút/trừ tiền từ ví.

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/fin/wallet-transaction/list` | Danh sách giao dịch |
| GET | `/v1/fin/wallet-transaction/detail/:id` | Chi tiết giao dịch |
| POST | `/v1/fin/wallet-transaction/create` | Tạo giao dịch |
| PUT | `/v1/fin/wallet-transaction/update/:id` | Cập nhật |
| DELETE | `/v1/fin/wallet-transaction/delete/:id` | Xoá |
| POST | `/v1/fin/wallet-transaction/export` | Xuất dữ liệu |

> Service bổ sung trong `wallet/transaction/`: `wallet-topup.service.ts` (nạp tiền), `wallet-deduction.service.ts` (trừ tiền), `wallet-refund.service.ts` (hoàn tiền vào ví).

---

## 7. NOTIFICATION — Thông báo

### 7.1 Notification — Thông báo
**Service:** `notification/notification/notification.service.ts` | **API:** `notification/notification/notification.api.ts`

Gửi và quản lý thông báo đến học viên, phụ huynh, giáo viên.

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/sys/notification/list` | Danh sách thông báo |
| GET | `/v1/sys/notification/detail/:id` | Chi tiết thông báo |
| POST | `/v1/sys/notification/create` | Tạo thông báo |
| PUT | `/v1/sys/notification/update/:id` | Cập nhật thông báo |
| DELETE | `/v1/sys/notification/delete/:id` | Xoá thông báo |
| POST | `/v1/sys/notification/export` | Xuất dữ liệu |

> Service bổ sung: `notification-queue.service.ts` (hàng đợi gửi — `/v1/notification/notification-queue`), `notification-read.service.ts` (trạng thái đã đọc — `/v1/notification/notification-read`).

---

### 7.2 Template — Mẫu thông báo
**Service:** `notification/template/template.service.ts` | **API:** `notification/template/template.api.ts`

Quản lý mẫu nội dung thông báo (SMS, email, push notification).

| Phương thức | URL | Mô tả |
|---|---|---|
| GET | `/v1/sys/template/list` | Danh sách mẫu |
| GET | `/v1/sys/template/detail/:id` | Chi tiết mẫu |
| POST | `/v1/sys/template/create` | Tạo mẫu |
| PUT | `/v1/sys/template/update/:id` | Cập nhật mẫu |
| DELETE | `/v1/sys/template/delete/:id` | Xoá mẫu |
| POST | `/v1/sys/template/export` | Xuất dữ liệu |

> Service bổ sung: `notification-template.service.ts` (gán template cho loại thông báo — `/v1/notification/notification-template`), `notification-channel.service.ts` (kênh gửi — `/v1/notification/notification-channel`).

---

## 8. REPORTING — Báo cáo

Tất cả báo cáo đều dùng prefix `/v1/report/` và cung cấp đầy đủ CRUD + export.

| Service | URL prefix | Mô tả nghiệp vụ |
|---|---|---|
| `attendance-report.service.ts` | `/v1/report/attendance-report` | Báo cáo chuyên cần học viên |
| `revenue-report.service.ts` | `/v1/report/revenue-report` | Báo cáo doanh thu |
| `lead-conversion-report.service.ts` | `/v1/report/lead-conversion-report` | Báo cáo tỷ lệ chuyển đổi lead → học viên |
| `student-progress-report.service.ts` | `/v1/report/student-progress-report` | Báo cáo tiến độ học tập học viên |
| `class-utilization-report.service.ts` | `/v1/report/class-utilization-report` | Báo cáo hiệu suất sử dụng lớp học |
| `teacher-performance-report.service.ts` | `/v1/report/teacher-performance-report` | Báo cáo hiệu suất giảng dạy giáo viên |

---

## Ghi chú về URL prefix

Có hai nhóm prefix khác nhau trong codebase (do lịch sử phát triển):

| Nhóm | Prefix dùng | Ví dụ |
|---|---|---|
| Core (chính) | `/v1/{domain-short}/` | `/v1/edu/`, `/v1/hr/`, `/v1/fin/`, `/v1/sys/` |
| Extended (mở rộng) | `/v1/{domain-full}/` | `/v1/education/`, `/v1/finance/`, `/v1/notification/` |

Các API ở nhóm **Core** (có `edu/`, `fin/`, `hr/`, `sys/`) là những nghiệp vụ chính, đầy đủ hơn (có `export`, `suspend`, `restore`). Các API nhóm **Extended** thường là sub-entity hoặc chức năng phụ trợ.
