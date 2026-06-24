# Hana English Center Management System

## 1. Overview

Hana English là hệ thống quản lý trung tâm tiếng Anh dành cho trẻ em, bao gồm:

* CRM (Lead, Parent, Enrollment)
* Education (Student, Course, Class, Attendance)
* Finance (Invoice, Payment, Debt)
* HR (Teacher, Staff)
* Notification
* Reporting

Kiến trúc được thiết kế theo Domain-Driven Module Architecture.

---

# 2. Technology Stack

## Backend

* Laravel 12
* PHP 8.2
* MySQL 8+
* Redis
* Queue Jobs
* REST API
* Laravel Policies
* Laravel Events

## Frontend

* React 19
* Typescript
* React Query
* React Hook Form
* MobX
* Vite
* Turbo Monorepo

## App mobile

* React native 0.81+
* Typescript
* React Query
* React Hook Form
* MobX
* Expo 54+
* Turbo Monorepo
---

# 3. Module Architecture

## System (sys)

Các chức năng nền tảng của hệ thống.

### Entities

* Business
* Branch
* User
* Role
* Permission
* Setting
* AuditLog

### Features

* Authentication
* Authorization
* Multi Branch
* Multi Business
* Settings
* Activity Log

---

## CRM (crm)

Quản lý khách hàng tiềm năng.

### Entities

* Parent
* Lead
* Enrollment

### Features

#### Lead Management

* Tạo lead
* Phân công tư vấn
* Theo dõi trạng thái
* Lịch sử chăm sóc

#### Parent Management

* Quản lý phụ huynh
* Liên kết học viên

#### Enrollment

* Tư vấn khóa học
* Đăng ký học
* Chuyển đổi lead thành học viên

---

## Education (edu)

Quản lý đào tạo.

### Entities

* Student
* StudentLevel
* Course
* ClassRoom
* LessonPlan
* Lesson
* Attendance
* Evaluation

### Features

#### Student

* Hồ sơ học viên
* Thông tin học tập
* Phụ huynh liên kết
* Lịch sử học

#### Course

* Quản lý khóa học
* Học phí chuẩn
* Thời lượng

#### ClassRoom

* Tạo lớp học
* Phân giáo viên
* Danh sách học viên

#### Lesson

* Quản lý buổi học
* Nội dung giảng dạy

#### Attendance

* Điểm danh
* Vắng có phép
* Vắng không phép

#### Evaluation

* Đánh giá định kỳ
* Nhận xét giáo viên
* Nâng cấp trình độ

---

## Finance (fin)

Quản lý tài chính.

### Entities

* Invoice
* Payment
* Refund
* Debt
* Discount

### Features

#### Invoice

* Tạo hóa đơn
* Học phí
* Phụ phí

#### Payment

* Thanh toán
* Thu tiền mặt
* Chuyển khoản

#### Debt

* Công nợ học viên
* Theo dõi quá hạn

#### Refund

* Hoàn học phí

#### Discount

* Voucher
* Giảm giá khóa học

---

## Wallet (fin)

Ví điện tử nội bộ.

### Entities

* Wallet
* WalletTransaction

### Features

* Nạp tiền
* Trừ tiền
* Hoàn tiền
* Lịch sử giao dịch

---

## HR (hr)

Quản lý nhân sự.

### Entities

* Teacher
* Staff

### Features

#### Teacher

* Hồ sơ giáo viên
* Chuyên môn
* Lớp phụ trách

#### Staff

* Hồ sơ nhân viên
* Bộ phận

---

## Notification (sys)

Thông báo hệ thống.

### Entities

* Notification
* Template

### Features

* Email
* SMS
* Push Notification
* Zalo OA

---

## Reporting (rpt)

Báo cáo và thống kê.

### Features

#### CRM Reports

* Lead Conversion
* Enrollment Rate

#### Education Reports

* Student Progress
* Attendance Rate

#### Finance Reports

* Revenue
* Debt
* Refund

#### HR Reports

* Teacher Performance

---

# 4. Database Relationship

Business
└── Branch

Branch
├── User
├── Student
├── Parent
├── Teacher
├── Staff
├── Course
├── ClassRoom
└── Invoice

Parent
└── ParentStudent
└── Student

Student
├── Enrollment
├── Attendance
├── Evaluation
├── Invoice
└── Wallet

Course
└── ClassRoom

ClassRoom
├── Teacher
├── Student
└── Lesson

Lesson
└── Attendance

Invoice
├── Payment
├── Refund
└── Debt

Wallet
└── WalletTransaction

---

# 5. Backend Folder Structure

modules/

├── System
├── CRM
├── Education
├── Finance
├── Wallet
├── HR
├── Notification
└── Reporting

Module Structure

Module/

├── Application
│   ├── Commands
│   ├── Queries
│   └── Services
│
├── Domain
│   ├── Entities
│   ├── Repositories
│   ├── Events
│   └── Rules
│
├── Infrastructure
│   ├── Models
│   ├── Repositories
│   └── Providers
│
└── Presentation
├── Controllers
├── Requests
├── Resources
└── Routes

---

# 6. Business Workflow

Lead
↓

Parent
↓

Enrollment
↓

Student
↓

ClassRoom
↓

Attendance
↓

Evaluation

---

# 7. Finance Workflow

Enrollment
↓

Invoice
↓

Payment

Nếu chưa thanh toán

Invoice
↓

Debt

Nếu hoàn tiền

Payment
↓

Refund
