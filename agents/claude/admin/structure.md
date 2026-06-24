# Admin Module Structure

## 1. Overview

Admin Module là phân hệ quản trị trung tâm của hệ thống, dành cho nhân viên quản lý và admin vận hành. Module cho phép quản lý toàn diện học viên, giáo viên, khóa học, lớp học, doanh nghiệp và chi nhánh.

Module hiển thị toàn bộ dữ liệu theo phân quyền tài khoản và chi nhánh được cấp phép.

---

## 2. Objectives

- Quản lý thông tin học viên và phụ huynh
- Quản lý tuyển sinh và xếp lớp
- Quản lý giáo viên, trợ giảng và nhân sự
- Quản lý khóa học, giáo trình và lịch học
- Quản lý công, lương và KPI giáo viên
- Quản lý hệ thống doanh nghiệp và chi nhánh

---

## 3. Menu Structure

### Dashboard

#### Trang chủ

Hiển thị:

- Tổng số học viên đang học
- Tổng số giáo viên đang hoạt động
- Doanh thu tháng hiện tại
- Lớp học đang diễn ra
- Biểu đồ doanh thu
- Hoạt động gần đây

---

### Học Viên

#### DS Học Viên

Chức năng:

- Danh sách học viên
- Tìm kiếm, lọc học viên
- Tạo mới học viên
- Xem chi tiết học viên

Thông tin:

- Mã học viên
- Họ tên
- Ngày sinh
- Giới tính
- Cấp độ hiện tại
- Trạng thái học

#### DS Phụ Huynh

Chức năng:

- Danh sách phụ huynh
- Tìm kiếm phụ huynh
- Xem học viên liên kết
- Xem thông tin liên hệ

#### Đăng ký mới (Tuyển sinh)

Chức năng:

- Tiếp nhận đăng ký mới
- Gán học viên vào khóa học
- Theo dõi trạng thái đăng ký

Trạng thái:

- Pending
- Processing
- Enrolled
- Cancelled

#### Kiểm tra đầu vào

Chức năng:

- Tạo bài kiểm tra đầu vào
- Nhập kết quả
- Xếp cấp độ học viên

Kết quả xếp loại:

- Starter
- Movers
- Flyers
- KET
- PET

#### Điểm danh học viên

Chức năng:

- Xem điểm danh theo lớp
- Điểm danh thủ công
- Điểm danh hàng loạt
- Báo cáo chuyên cần

Trạng thái:

- Present
- Late
- Absent
- Excused

#### Bài tập

Chức năng:

- Xem danh sách bài tập
- Xem bài nộp của học viên
- Theo dõi tiến độ hoàn thành

#### Điểm số

Chức năng:

- Xem điểm theo kỳ
- Nhập điểm thủ công
- Thống kê điểm theo lớp
- Xuất báo cáo điểm

#### Nhận xét & Đánh giá

Chức năng:

- Xem nhận xét giáo viên
- Xem đánh giá định kỳ
- Xem đánh giá cuối khóa

#### Giới thiệu học viên

Chức năng:

- Theo dõi học viên giới thiệu
- Xem hoa hồng giới thiệu
- Báo cáo chương trình giới thiệu

---

### Giáo Viên

#### DS Giáo Viên

Chức năng:

- Danh sách giáo viên
- Tìm kiếm, lọc giáo viên
- Tạo mới giáo viên
- Xem chi tiết giáo viên

Thông tin:

- Mã giáo viên
- Họ tên
- Chứng chỉ
- Lớp đang dạy
- Trạng thái

#### DS Trợ giảng

Chức năng:

- Danh sách trợ giảng
- Phân công lớp học
- Theo dõi lịch hỗ trợ

#### Hợp đồng & Lương

Chức năng:

- Quản lý hợp đồng giáo viên
- Thiết lập mức lương
- Xem lịch sử hợp đồng

Loại hợp đồng:

- Cộng tác viên
- Nhân viên chính thức
- Thời vụ

#### Thời khóa biểu giáo viên

Hiển thị:

- Lịch dạy theo ngày/tuần/tháng
- Phòng học
- Lớp học
- Thời gian

#### Phân công lớp học

Chức năng:

- Gán giáo viên vào lớp
- Thay thế giáo viên
- Xem lịch sử phân công

#### Bảng chấm công

Chức năng:

- Xem giờ dạy theo tháng
- Tính số buổi dạy
- Xuất bảng chấm công

#### Thống kê giờ dạy

Chức năng:

- Thống kê giờ dạy theo giáo viên
- Biểu đồ giờ dạy
- Xuất báo cáo

#### Bảng lương tháng

Chức năng:

- Tính lương theo giờ dạy
- Xem chi tiết tính lương
- Xuất phiếu lương

#### Khen thưởng KPI

Chức năng:

- Thiết lập KPI
- Ghi nhận khen thưởng
- Thống kê KPI theo tháng

#### Kỷ luật

Chức năng:

- Ghi nhận vi phạm
- Xử lý kỷ luật
- Theo dõi lịch sử kỷ luật

Mức kỷ luật:

- Nhắc nhở
- Cảnh cáo
- Tạm đình chỉ

#### Phản hồi phụ huynh

Chức năng:

- Xem phản hồi từ phụ huynh
- Phân loại phản hồi
- Phản hồi lại phụ huynh

#### Đánh giá học viên (GV)

Chức năng:

- Xem đánh giá giáo viên dành cho học viên
- Lọc theo lớp / kỳ

---

### Khóa Học

#### DS Khóa học

Chức năng:

- Danh sách khóa học
- Tạo mới khóa học
- Xem chi tiết khóa học

Thông tin:

- Mã khóa học
- Tên khóa học
- Cấp độ
- Học phí
- Số buổi
- Trạng thái

#### Chương trình học

Chức năng:

- Danh sách chương trình
- Tạo chương trình học
- Gán khóa học vào chương trình

#### Cấp độ

Chức năng:

- Quản lý cấp độ
- Thứ tự cấp độ
- Điều kiện lên cấp

Cấp độ mẫu:

- Starter 1 → Starter 2
- Movers → Flyers
- KET → PET

#### Giáo trình

Chức năng:

- Quản lý giáo trình
- Upload tài liệu
- Gán giáo trình cho khóa học

#### DS Lớp học

Chức năng:

- Danh sách lớp học
- Tạo mới lớp học
- Xem học viên trong lớp
- Xem lịch học lớp

Thông tin:

- Mã lớp
- Khóa học
- Giáo viên
- Số học viên / Sĩ số tối đa
- Lịch học
- Trạng thái

#### Xếp lớp & Sỹ số

Chức năng:

- Ghi danh học viên vào lớp
- Chuyển lớp học viên
- Quản lý sĩ số

#### Kho đề thi

Chức năng:

- Quản lý ngân hàng đề thi
- Tạo câu hỏi
- Tạo đề thi theo khóa học / cấp độ

#### DS Bài học

Chức năng:

- Danh sách bài học theo khóa
- Tạo bài học
- Đính kèm tài liệu

---

### Hệ Thống

#### DS Doanh nghiệp

Chức năng:

- Danh sách doanh nghiệp (trung tâm)
- Tạo doanh nghiệp mới
- Xem danh sách chi nhánh

#### DS Chi nhánh

Chức năng:

- Danh sách chi nhánh
- Tạo chi nhánh mới
- Xem nhân sự chi nhánh

---

## 4. Folder Structure

```text
webs/admin/
├── src/
│   ├── _common/
│   │   ├── components/
│   │   │   └── Layout/
│   │   │       ├── BasicLayout/
│   │   │       ├── Header/
│   │   │       ├── Menu/
│   │   │       │   ├── admin.json
│   │   │       │   ├── menus.tsx
│   │   │       │   └── url.ts
│   │   │       ├── PageLayout/
│   │   │       └── UnAuthLayout/
│   │   └── hooks/
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   └── ForgotPassword/
│   │   ├── Dashboard/
│   │   ├── MyInfo/
│   │   ├── ChangePassword/
│   │   ├── Hr/
│   │   │   └── teacher/
│   │   ├── education/
│   │   │   ├── course/
│   │   │   ├── lesson/
│   │   │   └── student/
│   │   └── System/
│   │       ├── branch/
│   │       └── business/
│   ├── routers/
│   └── states/
```

---

## 5. Page Structure Convention

```text
pages/
└── <FeatureName>/
    ├── <Feature>ListPage.tsx
    ├── <Feature>CreatePage.tsx
    ├── <Feature>UpdatePage.tsx
    ├── <Feature>DetailPage.tsx
    ├── <Feature>FormModal.tsx
    ├── _interface.ts
    └── containers/
        ├── <Feature>Table.tsx
        ├── <Feature>Form.tsx
        └── <Feature>Filter.tsx
```

---

## 6. Main Entities

### Student

- Student Profile
- Student Enrollment
- Learning Progress
- Attendance Record

### Parent

- Parent Profile
- Parent-Student Link
- Parent Feedback

### Teacher

- Teacher Profile
- Teacher Certificate
- Teacher Assignment
- Contract & Salary

### Classroom

- Class
- Class Schedule
- Student Roster
- Class Progress

### Course

- Course
- Program
- Level
- Curriculum
- Lesson

### Assessment

- Placement Test
- Exam Bank
- Question
- Exam Result

### Payroll

- Timesheet
- Teaching Hours
- Monthly Payroll
- KPI Reward
- Discipline

### System

- Business
- Branch
- User
- Permission
