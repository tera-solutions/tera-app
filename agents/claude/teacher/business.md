# Teacher Module Business Flow

## 1. Teacher Workflow

### Step 1. Teacher Login

- Đăng nhập hệ thống
- Kiểm tra trạng thái tài khoản
- Kiểm tra phân công lớp học
- Kiểm tra quyền truy cập

Kết quả:

- Dashboard
- Teaching Schedule
- Notifications
- Pending Tasks

---

### Step 2. View Teaching Schedule

Giáo viên xem:

- Lớp học trong ngày
- Thời gian học
- Phòng học
- Số lượng học viên

Chuẩn bị:

- Giáo án
- Tài liệu
- Homework cần review

---

### Step 3. Open Classroom

Hiển thị:

- Thông tin lớp
- Danh sách học viên
- Trình độ lớp
- Chuyên cần
- Lịch sử học tập

---

## 2. Lesson Teaching Flow

### Step 4. Start Lesson

Tạo Lesson Session.

```text
Scheduled
↓
In Progress
↓
Completed
```

---

### Step 5. Attendance

Điểm danh:

```text
Present
Late
Absent
Excused
```

Hệ thống:

- Lưu Attendance
- Tính chuyên cần
- Gửi thông báo phụ huynh

---

### Step 6. Teaching Activities

Giáo viên ghi nhận:

- Nội dung học
- Hoạt động lớp
- Tiến độ giáo án

Ví dụ:

```text
Unit 4 - Family
Vocabulary
Grammar
Speaking Practice
```

---

### Step 7. Lesson Notes

#### Class Note

```text
Lớp tham gia tốt
Tiến độ đúng kế hoạch
```

#### Student Note

```text
Nguyễn Văn A cần luyện phát âm
Trần Thị B cần cải thiện Speaking
```

---

## 3. Homework Flow

### Step 8. Assign Homework

Tạo bài tập:

- Nội dung
- File đính kèm
- Deadline

Status:

```text
Draft
Published
Closed
```

---

### Step 9. Student Submission

Status:

```text
Submitted
Late
Missing
```

---

### Step 10. Homework Review

Giáo viên:

- Chấm điểm
- Nhận xét
- Feedback

Ví dụ:

```text
Score: 8.5

Good vocabulary.
Need more speaking practice.
```

---

## 4. Learning Progress Tracking

### Step 11. Student Monitoring

Theo dõi:

- Attendance
- Homework Completion
- Participation
- Learning Progress

---

### Step 12. Periodic Evaluation

Chu kỳ:

- 4 tuần
- 8 tuần
- Cuối khóa

Đánh giá:

- Listening
- Speaking
- Reading
- Writing

Kết quả:

```text
Excellent
Good
Average
Need Improvement
```

---

### Step 13. Parent Feedback

Hệ thống tạo báo cáo:

- Attendance
- Homework
- Evaluation
- Teacher Comments

Gửi cho phụ huynh.

---

## 5. Assessment Flow

### Step 14. Mid-term Assessment

Nội dung:

- Vocabulary
- Grammar
- Listening
- Speaking

Lưu vào Evaluation.

---

### Step 15. Final Assessment

Đánh giá:

- Course Completion
- Skill Achievement
- Final Score

---

## 6. Promotion Flow

### Step 16. Promotion Recommendation

Ví dụ:

```text
Starter 1
↓
Starter 2
```

Hoặc:

```text
Movers
↓
Flyers
```

---

### Step 17. Academic Review

Academic Manager xem xét:

- Attendance
- Evaluation
- Teacher Feedback

Kết quả:

```text
Approved
Rejected
Need Review
```

---

### Step 18. Student Completion

```text
Active
↓
Completed
```

Hệ thống:

- Close Enrollment
- Generate Certificate
- Save Learning History

---

### Step 19. Course Transition

```text
Starter 1
↓
Starter 2
↓
Movers
↓
Flyers
↓
KET
↓
PET
```

Tạo Enrollment mới.

---

### Step 20. Learning Journey Archive

Lưu trữ:

- Attendance History
- Homework History
- Evaluation History
- Exam Results
- Teacher Feedback
- Certificates

---

## 7. End-to-End Workflow

```text
Teacher Login
        ↓
View Schedule
        ↓
Open Classroom
        ↓
Start Lesson
        ↓
Attendance
        ↓
Teaching Activities
        ↓
Lesson Notes
        ↓
Assign Homework
        ↓
Homework Submission
        ↓
Homework Review
        ↓
Student Evaluation
        ↓
Parent Feedback
        ↓
Mid-term Assessment
        ↓
Final Assessment
        ↓
Promotion Recommendation
        ↓
Academic Approval
        ↓
Course Completion
        ↓
Next Course Enrollment
```