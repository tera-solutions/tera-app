# Teacher Module Structure

## 1. Overview

Teacher Module là phân hệ dành cho giáo viên nhằm hỗ trợ toàn bộ quy trình giảng dạy, quản lý lớp học, theo dõi học viên, đánh giá kết quả học tập và tương tác với phụ huynh.

Module này chỉ hiển thị dữ liệu thuộc các lớp mà giáo viên được phân công.

---

## 2. Objectives

- Quản lý công việc giảng dạy hàng ngày
- Theo dõi tiến độ học tập của học viên
- Điểm danh và đánh giá học viên
- Quản lý giáo án và bài tập
- Tương tác với học viên và phụ huynh
- Theo dõi thu nhập và công việc cá nhân

---

## 3. Menu Structure

### Dashboard

#### Trang chủ

Hiển thị:

- Số lớp đang dạy
- Số học viên
- Lịch dạy hôm nay
- Bài tập cần chấm
- Thông báo mới

---

### Teaching

#### Lớp học

Chức năng:

- Danh sách lớp
- Chi tiết lớp
- Danh sách học viên
- Lịch học
- Tài liệu lớp học

#### Lịch dạy

Hiển thị:

- Ngày
- Tuần
- Tháng

Thông tin:

- Lớp học
- Phòng học
- Thời gian
- Số học viên

#### Giáo án

Chức năng:

- Xem giáo án
- Tạo giáo án
- Chỉnh sửa giáo án
- Đính kèm tài liệu

#### Buổi học

Chức năng:

- Bắt đầu buổi học
- Ghi chú nội dung giảng dạy
- Ghi chú lớp học
- Kết thúc buổi học

---

### Homework

#### Bài tập

Chức năng:

- Tạo bài tập
- Giao bài tập
- Đính kèm file
- Thiết lập hạn nộp

Trạng thái:

- Draft
- Published
- Closed

#### Chấm bài

Chức năng:

- Chấm điểm
- Nhận xét
- Đính kèm feedback

Trạng thái:

- Pending
- Reviewed

---

### Attendance

#### Điểm danh

Chức năng:

- Điểm danh lớp học
- Điểm danh nhanh
- Điểm danh hàng loạt

Trạng thái:

- Present
- Late
- Absent
- Excused

#### Báo cáo chuyên cần

Hiển thị:

- Tỷ lệ chuyên cần
- Danh sách nghỉ học
- Danh sách đi muộn

---

### Student Management

#### Học viên

Chức năng:

- Danh sách học viên
- Hồ sơ học viên
- Lịch sử học tập
- Kết quả học tập

Thông tin:

- Mã học viên
- Họ tên
- Ngày sinh
- Cấp độ
- Phụ huynh

#### Nhận xét

Chức năng:

- Nhận xét buổi học
- Nhận xét định kỳ
- Nhận xét cuối khóa

#### Đánh giá học tập

Chức năng:

- Đánh giá kỹ năng
- Đánh giá cuối khóa
- Đề xuất lên cấp

Kỹ năng:

- Listening
- Speaking
- Reading
- Writing

---

### Assessment

#### Kiểm tra đầu vào

Chức năng:

- Tạo bài kiểm tra
- Nhập điểm
- Xếp cấp độ

Kết quả:

- Starter
- Movers
- Flyers
- KET
- PET

#### Kỳ thi

Chức năng:

- Danh sách kỳ thi
- Chấm thi
- Kết quả thi

---

### Communication

#### Tin nhắn

Chức năng:

- Gửi tin nhắn
- Trao đổi với phụ huynh
- Trao đổi với học viên

#### Thông báo

Chức năng:

- Xem thông báo
- Xác nhận đã đọc

---

### Personal

#### Ví cá nhân

- Xem số dư
- Lịch sử giao dịch

#### Bảng công

- Xem giờ dạy
- Xem số buổi dạy

#### Bảng lương

- Xem lương
- Xem chi tiết tính lương

#### Gói đã đăng ký

- Xem gói giáo viên
- Xem quyền lợi

#### Hồ sơ cá nhân

- Cập nhật thông tin
- Đổi mật khẩu
- Cập nhật avatar

---

## 4. Folder Structure

```text
webs/teacher/
├── src/
│   ├── _common/
│   ├── pages/
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── Teaching/
│   │   │   ├── Classroom/
│   │   │   ├── Schedule/
│   │   │   ├── LessonPlan/
│   │   │   └── Lesson/
│   │   ├── Homework/
│   │   │   ├── Assignment/
│   │   │   └── Review/
│   │   ├── Attendance/
│   │   ├── Student/
│   │   ├── Assessment/
│   │   ├── Communication/
│   │   ├── Wallet/
│   │   ├── Payroll/
│   │   └── Profile/
│   ├── routers/
│   └── states/
```

---

## 5. Page Structure Convention

```text
pages/
└── <FeatureName>/
    ├── index.tsx
    ├── router.tsx
    ├── url.ts
    ├── _api/
    ├── containers/
    ├── components/
    ├── hooks/
    └── types/
```

---

## 6. Main Entities

### Teacher

- Teacher Profile
- Teacher Assignment
- Teaching Schedule

### Classroom

- ClassRoom
- Student
- Enrollment

### Lesson

- Lesson Plan
- Lesson
- Lesson Session

### Attendance

- Attendance Record

### Homework

- Homework
- Homework Submission
- Homework Review

### Evaluation

- Skill Evaluation
- Progress Evaluation
- Final Evaluation

### Assessment

- Placement Test
- Exam
- Exam Result

### Communication

- Notification
- Message

### Personal

- Wallet
- Wallet Transaction
- Payroll
- Timesheet