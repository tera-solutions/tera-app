# Tasks

## Attendance

- Complete "Xuất báo cáo" button feature

## ClassroomDetail

- Complete "Tải danh sách lớp" button feature

## ExamDetail

- Complete "Điểm TB" card

## ExamSession

- Redesign UI, use claude-in-chrome to view, zoom in mockup [https://drive.google.com/file/d/1qcXVStB8OiZVypYoykqdowDr2q3MGLgI/view](https://drive.google.com/file/d/1qcXVStB8OiZVypYoykqdowDr2q3MGLgI/view)

## Homework

- Tích hợp API Create Homework (SQLSTATE[23000]: Integrity constraint violation: 1062 Duplicate entry 'ASG000001' for key 'edu_assignments_assignment_code_unique' (Connection: mysql, Host: 127.0.0.1, Port: 3306, Database: db_hana, SQL: insert into `edu_assignments` (`assignment_name`, `assignment_type`, `instruction`, `max_score`, `due_date`, `assignment_code`, `status`, `created_by`, `updated_by`, `updated_at`, `created_at`) values (Bài tập Unit 2, homework, 123123, 10, 2026-07-31 10:42:22, ASG000001, draft, 5, 5, 2026-07-09 10:42:30, 2026-07-09 10:42:30)))
- Validation dữ liệu bài tập

## Messages

- Do we have backend for this?

## Profile

- Use MyInfo page instead of Profile, consider remove Profile page

## StudentDetail

- Complete "Tiến độ học tập" card
- Tích hợp API Learning Progress
- Xây dựng LearningProgress component

## Transfer

- 