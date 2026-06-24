# admin-task.md

## Quy ước

### Tiêu đề

```text
[Task ID] - Admin - [Task Title]
```

### Label

```text
[Sprint ID], Admin, Frontend
```

### Cấu trúc Task

```text
- Xây dựng UI
- Tách Components
- Tích hợp API
- Validation
- State Management
- Testing
```

---

# Sprint 1

## [001] - Admin - Đăng nhập

**Label:** Sprint1, Admin, Frontend

### List Task

* Xây dựng UI màn hình đăng nhập
* Xây dựng LoginForm component
* Xây dựng InputEmail component
* Xây dựng InputPassword component
* Xây dựng RememberMe component
* Validation dữ liệu đăng nhập
* Tích hợp API Login
* Tích hợp API Get Profile
* Xử lý lưu Access Token
* Xử lý lưu Refresh Token
* Xử lý Redirect sau đăng nhập
* Kiểm thử chức năng đăng nhập

---

## [002] - Admin - Đăng ký

**Label:** Sprint1, Admin, Frontend

### List Task

* Xây dựng UI màn hình đăng ký
* Xây dựng RegisterForm component
* Xây dựng PersonalForm component
* Xây dựng BusinessForm component
* Xây dựng CheckedRules component
* Xây dựng RegisterSuccess component
* Validation dữ liệu cá nhân
* Validation dữ liệu doanh nghiệp
* Tích hợp API Register
* Tích hợp API Send OTP
* Xử lý Redirect sau đăng ký
* Kiểm thử chức năng đăng ký

---

## [003] - Admin - Quên mật khẩu

**Label:** Sprint1, Admin, Frontend

### List Task

* Xây dựng UI quên mật khẩu
* Xây dựng ForgotPasswordForm component
* Xây dựng ResetPassword component
* Xây dựng SendForgotPasswordSuccess component
* Validation email
* Validation mật khẩu mới
* Tích hợp API Forgot Password
* Tích hợp API Reset Password
* Kiểm thử quên mật khẩu

---

## [004] - Admin - Trang chủ

**Label:** Sprint1, Admin, Frontend

### List Task

* Xây dựng UI Dashboard
* Xây dựng StatisticCard component
* Xây dựng StudentSummary component
* Xây dựng TeacherSummary component
* Xây dựng RevenueSummary component
* Xây dựng RecentActivityList component
* Xây dựng RevenueChart component
* Tích hợp API Dashboard Summary
* Tích hợp API Student Stats
* Tích hợp API Teacher Stats
* Tích hợp API Revenue Stats
* Kiểm thử Dashboard

---

## [005] - Admin - Hồ sơ cá nhân

**Label:** Sprint1, Admin, Frontend

### List Task

* Xây dựng UI hồ sơ cá nhân
* Xây dựng ProfileForm component
* Xây dựng AvatarUpload component
* Xây dựng ModalAddress component
* Validation dữ liệu hồ sơ
* Tích hợp API Get Profile
* Tích hợp API Update Profile
* Tích hợp API Upload Avatar
* Kiểm thử hồ sơ cá nhân

---

## [006] - Admin - Đổi mật khẩu

**Label:** Sprint1, Admin, Frontend

### List Task

* Xây dựng UI đổi mật khẩu
* Xây dựng ChangePasswordForm component
* Validation mật khẩu cũ và mới
* Tích hợp API Change Password
* Kiểm thử đổi mật khẩu

---

# Sprint 2

## [007] - Admin - DS Học viên

**Label:** Sprint2, Admin, Frontend

### List Task

* Xây dựng UI danh sách học viên
* Xây dựng StudentTable component
* Xây dựng StudentFilter component
* Xây dựng StudentFormModal component
* Xây dựng StudentForm component
* Xây dựng SearchBar component
* Xây dựng Pagination component
* Validation dữ liệu học viên
* Tích hợp API Student List
* Tích hợp API Create Student
* Tích hợp API Search & Filter Student
* Xử lý phân trang
* Kiểm thử danh sách học viên

---

## [008] - Admin - Chi tiết học viên

**Label:** Sprint2, Admin, Frontend

### List Task

* Xây dựng UI chi tiết học viên
* Xây dựng StudentProfile component
* Xây dựng StudentForm component (edit)
* Xây dựng ParentInfoSection component
* Xây dựng EnrollmentHistory component
* Xây dựng AttendanceHistory component
* Xây dựng LearningProgress component
* Validation dữ liệu cập nhật
* Tích hợp API Student Detail
* Tích hợp API Update Student
* Tích hợp API Delete Student
* Tích hợp API Enrollment History
* Kiểm thử chi tiết học viên

---

## [009] - Admin - DS Phụ huynh

**Label:** Sprint2, Admin, Frontend

### List Task

* Xây dựng UI danh sách phụ huynh
* Xây dựng ParentTable component
* Xây dựng ParentFilter component
* Xây dựng SearchParent component
* Tích hợp API Parent List
* Tích hợp API Search & Filter Parent
* Xử lý phân trang
* Kiểm thử danh sách phụ huynh

---

## [010] - Admin - Chi tiết phụ huynh

**Label:** Sprint2, Admin, Frontend

### List Task

* Xây dựng UI chi tiết phụ huynh
* Xây dựng ParentProfile component
* Xây dựng StudentLinkedList component
* Xây dựng ContactInfo component
* Tích hợp API Parent Detail
* Tích hợp API Student Linked
* Kiểm thử chi tiết phụ huynh

---

## [011] - Admin - Đăng ký mới (Tuyển sinh)

**Label:** Sprint2, Admin, Frontend

### List Task

* Xây dựng UI đăng ký mới
* Xây dựng AdmissionTable component
* Xây dựng AdmissionForm component
* Xây dựng StudentSelect component
* Xây dựng CourseSelect component
* Xây dựng AdmissionStatus component
* Validation dữ liệu đăng ký
* Tích hợp API Admission List
* Tích hợp API Create Admission
* Tích hợp API Update Admission Status
* Kiểm thử tuyển sinh

---

## [012] - Admin - Kiểm tra đầu vào

**Label:** Sprint2, Admin, Frontend

### List Task

* Xây dựng UI kiểm tra đầu vào
* Xây dựng PlacementTestTable component
* Xây dựng PlacementTestForm component
* Xây dựng TestResultList component
* Xây dựng AssignStudentForm component
* Validation dữ liệu kiểm tra
* Tích hợp API Placement Test List
* Tích hợp API Create Placement Test
* Tích hợp API Test Result
* Kiểm thử kiểm tra đầu vào

---

## [013] - Admin - Điểm danh học viên

**Label:** Sprint2, Admin, Frontend

### List Task

* Xây dựng UI điểm danh học viên
* Xây dựng AttendanceTable component
* Xây dựng AttendanceFilter component
* Xây dựng AttendanceStatus component
* Xây dựng BulkAttendance component
* Tích hợp API Attendance List
* Tích hợp API Save Attendance
* Tích hợp API Attendance Summary
* Kiểm thử điểm danh học viên

---

## [014] - Admin - Bài tập học viên

**Label:** Sprint2, Admin, Frontend

### List Task

* Xây dựng UI bài tập học viên
* Xây dựng HomeworkTable component
* Xây dựng HomeworkFilter component
* Xây dựng HomeworkDetail component
* Xây dựng SubmissionList component
* Tích hợp API Homework List
* Tích hợp API Homework Detail
* Tích hợp API Submission List
* Kiểm thử bài tập học viên

---

## [015] - Admin - Điểm số

**Label:** Sprint2, Admin, Frontend

### List Task

* Xây dựng UI điểm số
* Xây dựng ScoreTable component
* Xây dựng ScoreFilter component
* Xây dựng ScoreEntryForm component
* Xây dựng ScoreSummary component
* Validation dữ liệu điểm số
* Tích hợp API Score List
* Tích hợp API Save Score
* Tích hợp API Score Summary
* Kiểm thử điểm số

---

## [016] - Admin - Nhận xét & Đánh giá học viên

**Label:** Sprint2, Admin, Frontend

### List Task

* Xây dựng UI nhận xét & đánh giá
* Xây dựng EvaluationTable component
* Xây dựng EvaluationFilter component
* Xây dựng EvaluationDetail component
* Xây dựng RatingStars component
* Tích hợp API Evaluation List
* Tích hợp API Evaluation Detail
* Tích hợp API Update Evaluation
* Kiểm thử nhận xét & đánh giá

---

## [017] - Admin - Giới thiệu học viên

**Label:** Sprint2, Admin, Frontend

### List Task

* Xây dựng UI giới thiệu học viên
* Xây dựng ReferralTable component
* Xây dựng ReferralFilter component
* Xây dựng ReferralDetail component
* Tích hợp API Referral List
* Tích hợp API Referral Detail
* Xử lý phân trang
* Kiểm thử giới thiệu học viên

---

# Sprint 3

## [018] - Admin - DS Giáo viên

**Label:** Sprint3, Admin, Frontend

### List Task

* Xây dựng UI danh sách giáo viên
* Xây dựng TeacherTable component
* Xây dựng TeacherFilter component
* Xây dựng TeacherFormModal component
* Xây dựng SearchTeacher component
* Validation dữ liệu giáo viên
* Tích hợp API Teacher List
* Tích hợp API Create Teacher
* Tích hợp API Search & Filter Teacher
* Xử lý phân trang
* Kiểm thử danh sách giáo viên

---

## [019] - Admin - Chi tiết giáo viên

**Label:** Sprint3, Admin, Frontend

### List Task

* Xây dựng UI chi tiết giáo viên
* Xây dựng TeacherProfile component
* Xây dựng TeacherForm component (edit)
* Xây dựng TeacherCertificate component
* Xây dựng CertificateFormFields component
* Xây dựng ClassAssigned component
* Validation dữ liệu cập nhật
* Tích hợp API Teacher Detail
* Tích hợp API Update Teacher
* Tích hợp API Certificate CRUD
* Kiểm thử chi tiết giáo viên

---

## [020] - Admin - DS Trợ giảng

**Label:** Sprint3, Admin, Frontend

### List Task

* Xây dựng UI danh sách trợ giảng
* Xây dựng AssistantTable component
* Xây dựng AssistantFilter component
* Xây dựng AssistantFormModal component
* Validation dữ liệu trợ giảng
* Tích hợp API Assistant List
* Tích hợp API Create Assistant
* Xử lý phân trang
* Kiểm thử danh sách trợ giảng

---

## [021] - Admin - Hợp đồng & Lương giáo viên

**Label:** Sprint3, Admin, Frontend

### List Task

* Xây dựng UI hợp đồng & lương
* Xây dựng ContractTable component
* Xây dựng ContractForm component
* Xây dựng SalaryInfo component
* Validation dữ liệu hợp đồng
* Tích hợp API Contract List
* Tích hợp API Create Contract
* Tích hợp API Update Contract
* Tích hợp API Salary Info
* Kiểm thử hợp đồng & lương

---

## [022] - Admin - Thời khóa biểu giáo viên

**Label:** Sprint3, Admin, Frontend

### List Task

* Xây dựng UI thời khóa biểu
* Xây dựng ScheduleCalendar component
* Xây dựng ScheduleFilter component
* Xây dựng ScheduleDetail component
* Tích hợp API Schedule List
* Tích hợp API Schedule Detail
* Kiểm thử thời khóa biểu

---

## [023] - Admin - Phân công lớp học

**Label:** Sprint3, Admin, Frontend

### List Task

* Xây dựng UI phân công lớp học
* Xây dựng AssignClassTable component
* Xây dựng AssignClassForm component
* Xây dựng TeacherSelect component
* Xây dựng ClassSelect component
* Validation dữ liệu phân công
* Tích hợp API Assign Class List
* Tích hợp API Create Assign
* Tích hợp API Update Assign
* Kiểm thử phân công lớp học

---

## [024] - Admin - Bảng chấm công

**Label:** Sprint3, Admin, Frontend

### List Task

* Xây dựng UI bảng chấm công
* Xây dựng TimesheetTable component
* Xây dựng TimesheetFilter component
* Xây dựng MonthlySummary component
* Tích hợp API Timesheet List
* Tích hợp API Timesheet Summary
* Tích hợp API Export Timesheet
* Kiểm thử bảng chấm công

---

## [025] - Admin - Thống kê giờ dạy

**Label:** Sprint3, Admin, Frontend

### List Task

* Xây dựng UI thống kê giờ dạy
* Xây dựng TeachingHoursTable component
* Xây dựng TeachingHoursFilter component
* Xây dựng TeachingHoursChart component
* Xây dựng TeachingHoursSummary component
* Tích hợp API Teaching Hours List
* Tích hợp API Teaching Hours Summary
* Tích hợp API Export Report
* Kiểm thử thống kê giờ dạy

---

## [026] - Admin - Bảng lương tháng

**Label:** Sprint3, Admin, Frontend

### List Task

* Xây dựng UI bảng lương tháng
* Xây dựng PayrollTable component
* Xây dựng PayrollFilter component
* Xây dựng PayrollDetail component
* Xây dựng SalaryBreakdown component
* Tích hợp API Payroll List
* Tích hợp API Payroll Detail
* Tích hợp API Export Payroll
* Kiểm thử bảng lương tháng

---

## [027] - Admin - Khen thưởng KPI

**Label:** Sprint3, Admin, Frontend

### List Task

* Xây dựng UI khen thưởng KPI
* Xây dựng KPITable component
* Xây dựng KPIForm component
* Xây dựng KPISummary component
* Validation dữ liệu KPI
* Tích hợp API KPI List
* Tích hợp API Create KPI Reward
* Kiểm thử khen thưởng KPI

---

## [028] - Admin - Kỷ luật

**Label:** Sprint3, Admin, Frontend

### List Task

* Xây dựng UI kỷ luật
* Xây dựng DisciplineTable component
* Xây dựng DisciplineForm component
* Xây dựng DisciplineStatus component
* Validation dữ liệu kỷ luật
* Tích hợp API Discipline List
* Tích hợp API Create Discipline
* Tích hợp API Update Discipline Status
* Kiểm thử kỷ luật

---

## [029] - Admin - Phản hồi phụ huynh

**Label:** Sprint3, Admin, Frontend

### List Task

* Xây dựng UI phản hồi phụ huynh
* Xây dựng FeedbackTable component
* Xây dựng FeedbackFilter component
* Xây dựng FeedbackDetail component
* Xây dựng ResponseForm component
* Tích hợp API Feedback List
* Tích hợp API Feedback Detail
* Tích hợp API Reply Feedback
* Kiểm thử phản hồi phụ huynh

---

## [030] - Admin - Đánh giá học viên (GV)

**Label:** Sprint3, Admin, Frontend

### List Task

* Xây dựng UI đánh giá học viên
* Xây dựng StudentReviewTable component
* Xây dựng StudentReviewFilter component
* Xây dựng StudentReviewDetail component
* Xây dựng RatingDisplay component
* Tích hợp API Student Review List
* Tích hợp API Student Review Detail
* Kiểm thử đánh giá học viên

---

# Sprint 4

## [031] - Admin - DS Khóa học

**Label:** Sprint4, Admin, Frontend

### List Task

* Xây dựng UI danh sách khóa học
* Xây dựng CourseTable component
* Xây dựng CourseFilter component
* Xây dựng CourseFormModal component
* Xây dựng CourseForm component
* Validation dữ liệu khóa học
* Tích hợp API Course List
* Tích hợp API Create Course
* Tích hợp API Search & Filter Course
* Xử lý phân trang
* Kiểm thử danh sách khóa học

---

## [032] - Admin - Chi tiết khóa học

**Label:** Sprint4, Admin, Frontend

### List Task

* Xây dựng UI chi tiết khóa học
* Xây dựng CourseInfo component
* Xây dựng CurriculumList component
* Xây dựng LessonList component
* Xây dựng CourseStats component
* Tích hợp API Course Detail
* Tích hợp API Course Curriculum
* Tích hợp API Update Course
* Kiểm thử chi tiết khóa học

---

## [033] - Admin - Chương trình học

**Label:** Sprint4, Admin, Frontend

### List Task

* Xây dựng UI chương trình học
* Xây dựng ProgramTable component
* Xây dựng ProgramForm component
* Xây dựng ProgramFilter component
* Validation dữ liệu chương trình
* Tích hợp API Program List
* Tích hợp API Create Program
* Tích hợp API Update Program
* Kiểm thử chương trình học

---

## [034] - Admin - Cấp độ

**Label:** Sprint4, Admin, Frontend

### List Task

* Xây dựng UI cấp độ
* Xây dựng LevelTable component
* Xây dựng LevelForm component
* Validation dữ liệu cấp độ
* Tích hợp API Level List
* Tích hợp API Create Level
* Tích hợp API Update Level
* Kiểm thử cấp độ

---

## [035] - Admin - Giáo trình

**Label:** Sprint4, Admin, Frontend

### List Task

* Xây dựng UI giáo trình
* Xây dựng CurriculumTable component
* Xây dựng CurriculumForm component
* Xây dựng UploadDocument component
* Validation dữ liệu giáo trình
* Tích hợp API Curriculum List
* Tích hợp API Create Curriculum
* Tích hợp API Upload Document
* Kiểm thử giáo trình

---

## [036] - Admin - DS Lớp học

**Label:** Sprint4, Admin, Frontend

### List Task

* Xây dựng UI danh sách lớp học
* Xây dựng ClassTable component
* Xây dựng ClassFilter component
* Xây dựng ClassFormModal component
* Xây dựng ClassForm component
* Validation dữ liệu lớp học
* Tích hợp API Class List
* Tích hợp API Create Class
* Tích hợp API Search & Filter Class
* Xử lý phân trang
* Kiểm thử danh sách lớp học

---

## [037] - Admin - Chi tiết lớp học

**Label:** Sprint4, Admin, Frontend

### List Task

* Xây dựng UI chi tiết lớp học
* Xây dựng ClassInfo component
* Xây dựng StudentRoster component
* Xây dựng ClassSchedule component
* Xây dựng ClassProgress component
* Tích hợp API Class Detail
* Tích hợp API Student Roster
* Tích hợp API Class Schedule
* Kiểm thử chi tiết lớp học

---

## [038] - Admin - Xếp lớp & Sỹ số

**Label:** Sprint4, Admin, Frontend

### List Task

* Xây dựng UI xếp lớp & sỹ số
* Xây dựng EnrollmentTable component
* Xây dựng EnrollmentForm component
* Xây dựng ClassCapacity component
* Xây dựng TransferStudent component
* Validation dữ liệu xếp lớp
* Tích hợp API Enrollment List
* Tích hợp API Enroll Student
* Tích hợp API Transfer Student
* Tích hợp API Class Capacity
* Kiểm thử xếp lớp & sỹ số

---

## [039] - Admin - Kho đề thi

**Label:** Sprint4, Admin, Frontend

### List Task

* Xây dựng UI kho đề thi
* Xây dựng ExamBankTable component
* Xây dựng ExamBankForm component
* Xây dựng QuestionList component
* Xây dựng QuestionForm component
* Validation dữ liệu đề thi
* Tích hợp API Exam Bank List
* Tích hợp API Create Exam
* Tích hợp API Question CRUD
* Kiểm thử kho đề thi

---

## [040] - Admin - DS Bài học

**Label:** Sprint4, Admin, Frontend

### List Task

* Xây dựng UI danh sách bài học
* Xây dựng LessonTable component
* Xây dựng LessonFilter component
* Xây dựng LessonForm component
* Validation dữ liệu bài học
* Tích hợp API Lesson List
* Tích hợp API Create Lesson
* Tích hợp API Update Lesson
* Tích hợp API Delete Lesson
* Xử lý phân trang
* Kiểm thử danh sách bài học

---

## [041] - Admin - Chi tiết bài học

**Label:** Sprint4, Admin, Frontend

### List Task

* Xây dựng UI chi tiết bài học
* Xây dựng LessonInfo component
* Xây dựng LessonContent component
* Xây dựng AttachmentList component
* Tích hợp API Lesson Detail
* Tích hợp API Update Lesson
* Kiểm thử chi tiết bài học

---

## [042] - Admin - DS Doanh nghiệp

**Label:** Sprint4, Admin, Frontend

### List Task

* Xây dựng UI danh sách doanh nghiệp
* Xây dựng BusinessTable component
* Xây dựng BusinessFilter component
* Xây dựng BusinessFormModal component
* Xây dựng BusinessForm component
* Validation dữ liệu doanh nghiệp
* Tích hợp API Business List
* Tích hợp API Create Business
* Tích hợp API Search & Filter Business
* Xử lý phân trang
* Kiểm thử danh sách doanh nghiệp

---

## [043] - Admin - Chi tiết doanh nghiệp

**Label:** Sprint4, Admin, Frontend

### List Task

* Xây dựng UI chi tiết doanh nghiệp
* Xây dựng BusinessInfo component
* Xây dựng BusinessForm component (edit)
* Xây dựng BranchList component
* Tích hợp API Business Detail
* Tích hợp API Update Business
* Tích hợp API Branch List by Business
* Kiểm thử chi tiết doanh nghiệp

---

## [044] - Admin - DS Chi nhánh

**Label:** Sprint4, Admin, Frontend

### List Task

* Xây dựng UI danh sách chi nhánh
* Xây dựng BranchTable component
* Xây dựng BranchFilter component
* Xây dựng BranchFormModal component
* Xây dựng BranchForm component
* Validation dữ liệu chi nhánh
* Tích hợp API Branch List
* Tích hợp API Create Branch
* Tích hợp API Search & Filter Branch
* Xử lý phân trang
* Kiểm thử danh sách chi nhánh

---

## [045] - Admin - Chi tiết chi nhánh

**Label:** Sprint4, Admin, Frontend

### List Task

* Xây dựng UI chi tiết chi nhánh
* Xây dựng BranchInfo component
* Xây dựng BranchForm component (edit)
* Xây dựng StaffList component
* Tích hợp API Branch Detail
* Tích hợp API Update Branch
* Tích hợp API Staff List by Branch
* Kiểm thử chi tiết chi nhánh

---

## [046] - Admin - Hoàn thiện hệ thống

**Label:** Sprint4, Admin, Frontend

### List Task

* Chuẩn hóa Service Layer
* Chuẩn hóa API Layer
* Chuẩn hóa Query Adapter
* Chuẩn hóa Form Components
* Chuẩn hóa Table Components
* Bổ sung Loading State
* Bổ sung Empty State
* Bổ sung Error State
* Bổ sung Permission Control
* Bổ sung Route Guard
* Kiểm thử Responsive
* Thực hiện UAT
* Sửa lỗi UAT
* Tối ưu hiệu năng
* Chuẩn bị Release Build
