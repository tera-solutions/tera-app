# Hana Edu / Hana English - Project Summary

> Last Updated: 2026-07
> Stack: Laravel 12 + React 19 + React Native (Expo)

---

# 1. Tổng quan

Hana Edu là hệ sinh thái quản lý trung tâm Anh ngữ Hana English.

Bao gồm:

- Website giới thiệu
- CRM
- Quản lý học viên
- Quản lý học tập
- Quản lý tài chính
- Quản lý nhân sự
- Teacher App
- Parent App (dự kiến)
- Student App (dự kiến)
- Admin Portal

---

# 2. Công nghệ

## Backend

- PHP 8.2
- Laravel 12
- Laravel Passport
- MySQL
- Redis
- Queue
- Scheduler

## Frontend Web

- React 19
- Vite
- TailwindCSS 4
- TanStack Query
- MobX

## Mobile

- React Native
- Expo Router
- FlashList
- MobX

## Monorepo

- pnpm workspace
- Turbo Repo

---

# 3. Kiến trúc

```
apps/
    admin/
    teacher/

packages/
    api/
    commons/
    assets/
    components/
    stores/
    modules/
```

Thiết kế theo hướng Modular.

---

# 4. Backend Modules

## System

- User
- Role
- Permission
- Setting
- Audit Log
- Business

Prefix

```
system
```

---

## CRM

- Lead
- Customer
- Contact
- Campaign

Prefix

```
crm
```

---

## Education

- Course
- Subject
- Level
- Classroom
- Class
- Lesson
- Session
- Homework
- Attendance
- Enrollment
- Score
- Certificate

Prefix

```
edu
```

---

## Finance

- Invoice
- Payment
- Wallet
- Promotion
- Discount

Prefix

```
fin
```

---

## HR

- Employee
- Teacher
- Schedule
- Payroll

Prefix

```
hr
```

---

## Notification

- Push
- Email
- SMS
- In App

Prefix

```
sys
```

---

## Reporting

- Dashboard
- Statistics
- Revenue
- Student
- Teacher

Prefix

```
report
```

---

# 5. Người dùng

## Admin

Toàn quyền hệ thống.

---

## Manager

Quản lý chi nhánh.

---

## Teacher

- Điểm danh
- Giáo án
- Bài tập
- Chấm điểm
- Xem lịch dạy

---

## Parent

- Theo dõi kết quả học
- Thanh toán
- Nhận thông báo

---

## Student

- Bài học
- Homework
- Điểm
- Lịch học

---

# 6. Teacher App

Đã thiết kế nhiều màn hình.

## Dashboard

- Header
- Quick Action
- Today's Activity
- Schedule
- Todo
- Notification

## Modules

- Classes
- Lessons
- Homework
- Attendance
- Achievement
- Timetable
- Account

Màu chủ đạo

```
#0066CC
```

---

# 7. Coding Convention

## API

```
api/domain/entity/entity.api.ts
```

---

## Service

```
domain/entity/entity.service.ts
```

---

## Query

```
["student","list"]

["student","detail",id]
```

---

## Hook

```
useQueryAdapter

useMutationAdapter
```

---

# 8. UI Convention

Danh sách thường gồm

- Filter
- Table
- Pagination
- CRUD Dialog

Một module React thường gồm

```
Page

Table

Filter

Form

Service

API
```

---

# 9. Database (Business Domain)

Các nhóm bảng chính

## System

- users
- roles
- permissions
- businesses
- branches

---

## CRM

- leads
- customers

---

## Education

- students
- parents
- parent_student
- courses
- subjects
- classes
- class_sessions
- enrollments
- attendance
- homework

---

## Finance

- invoices
- payments
- wallets

---

## HR

- employees
- teachers

---

# 10. BA Documentation Standard

Mỗi chức năng thường mô tả theo format

- Overview
- Purpose
- Access
- Input
- Validation
- Business Rules
- Workflow
- Permission
- API
- Database
- Status
- ERD

---

# 11. Marketing (Hana English)

Đối tượng

- Trẻ em 4-10 tuổi

Địa điểm

- Quận 12

Nội dung

- Cambridge
- Phonics
- Tiếng Anh thiếu nhi

Fanpage

- Hana English

Thiết kế banner

- 1200x1200
- 9:16

---

# 12. Website

Website giới thiệu trung tâm.

Thông tin đã sử dụng

Tên

```
Anh Ngữ Hana
```

Nội dung

- Cambridge English
- Jolly Phonics
- Tiếng Anh giao tiếp

---

# 13. Phong cách thiết kế

- Hiện đại
- Màu xanh
- Flat Design
- Dễ sử dụng
- Nhiều icon
- Desktop + Mobile Responsive

---

# 14. Định hướng

Hệ thống hướng tới mô hình SaaS cho trung tâm Anh ngữ.

Các thành phần chính

- Website
- CRM
- ERP
- Education LMS
- Teacher App
- Parent App
- Student App
- Reporting
- Notification
- Finance
- HR

---

# 15. Điểm đã chuẩn hóa

- Modular Architecture
- Service Layer
- API Layer
- Query Layer
- Monorepo
- React Native + React dùng chung package
- Tài liệu BA theo chuẩn
- UI thống nhất
- Module độc lập
- Có khả năng mở rộng nhiều chi nhánh

---

# 16. Trạng thái hiện tại

Đã có:

- Kiến trúc hệ thống
- Chuẩn coding
- Chuẩn BA
- Nhiều UI Desktop
- Nhiều UI Mobile
- Teacher Module tương đối hoàn chỉnh
- Thiết kế ERD nhiều module
- Chuẩn API và Service
- Monorepo React