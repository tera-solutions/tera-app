# BRD - Hana Edu / Hana English

> Business Requirements Document (BRD)
>
> Version: 1.0

---

# 1. Tổng quan

## Mục tiêu

Xây dựng nền tảng quản lý trung tâm Anh ngữ theo mô hình SaaS, đáp ứng toàn bộ quy trình vận hành từ Marketing → Tuyển sinh → Đào tạo → Thu học phí → Chăm sóc phụ huynh → Báo cáo.

---

# 2. Phạm vi hệ thống

```
System
CRM
Education (LMS)
Finance
HR
Notification
Reporting
Website
Teacher App
Parent App
Student App
```

---

# 3. Danh sách BRD theo Module

# 3.1 System

## User Management

- Đăng nhập
- Đăng xuất
- Refresh Token
- Quản lý User
- Đổi mật khẩu
- Khóa tài khoản
- Hồ sơ cá nhân
- Avatar

---

## Business

- Quản lý công ty
- Quản lý chi nhánh
- Logo
- Thông tin doanh nghiệp

---

## Role

- CRUD Role
- Permission Matrix
- Role Assignment

---

## Permission

- Permission Group
- API Permission
- Menu Permission
- Data Permission

---

## Audit Log

- Login History
- Activity Log
- API Log

---

## Setting

- General Setting
- Email
- SMS
- Payment
- Notification

---

# 3.2 CRM

## Lead

- Tiếp nhận Lead
- Import Lead
- Landing Page
- Facebook Lead
- Website Form

---

## Lead Assignment

- Chia Lead
- Chuyển Sales
- Chuyển Chi nhánh

---

## Follow Up

- Call
- SMS
- Email
- Reminder

---

## Customer

- Chuyển Lead thành Customer

---

## Opportunity

- Báo giá
- Đăng ký khóa học

---

# 3.3 Education

## Student

- CRUD Student
- Hồ sơ
- Avatar
- Trạng thái học

---

## Parent

- CRUD Parent
- Quan hệ Phụ huynh - Học viên

---

## Course

- Quản lý khóa học

---

## Subject

- Quản lý môn học

---

## Level

- Quản lý cấp độ

---

## Classroom

- Quản lý phòng học

---

## Teacher

- Hồ sơ giáo viên
- Phân công

---

## Class

- Mở lớp
- Chuyển lớp
- Đóng lớp

---

## Enrollment

- Đăng ký học

---

## Timetable

- Xếp lịch học

---

## Session

- Buổi học

---

## Attendance

- Điểm danh

---

## Homework

- Giao bài tập

---

## Homework Submission

- Học viên nộp bài

---

## Assignment

- Chấm bài

---

## Examination

- Kiểm tra

---

## Score

- Nhập điểm

---

## Certificate

- Cấp chứng chỉ

---

# 3.4 Finance

## Product

- Học phí
- Giáo trình
- Dịch vụ

---

## Invoice

- Tạo hóa đơn

---

## Payment

- Thu tiền
- Hoàn tiền

---

## Wallet

- Ví học phí

---

## Promotion

- Khuyến mãi

---

## Discount

- Giảm giá

---

## Installment

- Trả góp học phí

---

## Debt

- Công nợ

---

## Revenue

- Doanh thu

---

# 3.5 HR

## Employee

- Hồ sơ nhân viên

---

## Teacher

- Hồ sơ giáo viên

---

## Contract

- Hợp đồng

---

## Payroll

- Lương

---

## Leave

- Nghỉ phép

---

## Working Schedule

- Lịch làm việc

---

# 3.6 Teacher App

## Dashboard

- Tổng quan

---

## Attendance

- Điểm danh

---

## Lesson

- Giáo án

---

## Homework

- Giao bài

---

## Grade

- Chấm điểm

---

## Timetable

- Lịch dạy

---

## Notification

- Thông báo

---

## Account

- Hồ sơ

---

# 3.7 Parent App

## Dashboard

---

## Student Progress

---

## Attendance

---

## Homework

---

## Score

---

## Tuition

---

## Notification

---

## Feedback

---

# 3.8 Student App

## Dashboard

---

## Lesson

---

## Homework

---

## Online Learning

---

## Quiz

---

## Score

---

## Attendance

---

## Certificate

---

# 3.9 Notification

## Push Notification

---

## Email Notification

---

## SMS Notification

---

## In-App Notification

---

## Announcement

---

# 3.10 Reporting

## Dashboard

---

## Revenue Report

---

## Student Report

---

## Teacher Report

---

## Attendance Report

---

## Enrollment Report

---

## Finance Report

---

## CRM Report

---

# 3.11 Website

## Landing Page

---

## Course

---

## Teacher

---

## News

---

## Contact

---

## Registration

---

## Trial Registration

---

## SEO

---

# 4. Quy trình nghiệp vụ tổng thể

```
Marketing
        │
        ▼
Lead
        │
        ▼
Tư vấn
        │
        ▼
Đăng ký
        │
        ▼
Thu học phí
        │
        ▼
Tạo Student
        │
        ▼
Xếp lớp
        │
        ▼
Học tập
        │
        ▼
Điểm danh
        │
        ▼
Bài tập
        │
        ▼
Thi
        │
        ▼
Chứng chỉ
        │
        ▼
Hoàn thành khóa học
```

---

# 5. Chuẩn tài liệu BRD cho từng chức năng

Mỗi chức năng sẽ được phân tích theo cùng một cấu trúc:

1. Business Objective
2. Business Rules
3. Actors
4. Preconditions
5. Postconditions
6. Functional Requirements
7. Non-functional Requirements
8. Workflow
9. Use Cases
10. UI Requirements
11. Validation Rules
12. Permissions
13. Notifications
14. Reports
15. API Mapping
16. Database Design
17. Sequence Diagram
18. ERD liên quan
19. Exception Handling
20. Acceptance Criteria

---

# 6. Ước lượng quy mô

| Module | Số chức năng chính |
|---------|-------------------:|
| System | ~20 |
| CRM | ~25 |
| Education | ~60 |
| Finance | ~35 |
| HR | ~20 |
| Teacher App | ~20 |
| Parent App | ~15 |
| Student App | ~15 |
| Notification | ~10 |
| Reporting | ~25 |
| Website | ~15 |
| **Tổng cộng** | **~260 chức năng** |