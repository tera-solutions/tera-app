# Admin Module Business Flow

## 1. Admin Login Flow

### Step 1. Đăng nhập hệ thống

- Admin nhập email và mật khẩu
- Hệ thống xác thực tài khoản
- Kiểm tra trạng thái tài khoản
- Kiểm tra phân quyền và chi nhánh

Kết quả:

- Dashboard tổng quan
- Menu theo phân quyền
- Dữ liệu theo chi nhánh được cấp

---

### Step 2. Đăng ký tài khoản

- Điền thông tin cá nhân
- Điền thông tin doanh nghiệp
- Chấp nhận điều khoản
- Xác nhận OTP

Kết quả:

```text
Pending
↓
Approved
↓
Active
```

---

## 2. Student Management Flow

### Step 3. Tiếp nhận học viên mới

Admin nhận thông tin:

- Họ tên học viên
- Ngày sinh
- Thông tin phụ huynh
- Nhu cầu học

Tạo hồ sơ học viên.

---

### Step 4. Kiểm tra đầu vào

Mục đích xếp cấp độ phù hợp:

```text
Bài kiểm tra đầu vào
↓
Chấm điểm
↓
Xếp cấp độ
```

Kết quả:

- Starter
- Movers
- Flyers
- KET
- PET

---

### Step 5. Tuyển sinh & Ghi danh

Admin thực hiện:

- Chọn khóa học phù hợp
- Chọn lớp học (theo cấp độ, lịch học)
- Tạo Enrollment
- Thu học phí

Trạng thái Enrollment:

```text
Pending
↓
Processing
↓
Enrolled
```

---

### Step 6. Xếp lớp & Quản lý sỹ số

Hệ thống kiểm tra:

- Sỹ số tối đa của lớp
- Lịch học phù hợp với học viên
- Giáo viên phụ trách

Thao tác:

- Ghi danh vào lớp
- Chuyển lớp (nếu đầy hoặc lịch không phù hợp)

---

### Step 7. Theo dõi học tập

Admin theo dõi:

- Điểm danh theo tuần
- Điểm số theo kỳ
- Bài tập đã nộp
- Nhận xét của giáo viên

---

### Step 8. Đánh giá & Lên cấp

Chu kỳ đánh giá:

- 4 tuần / 8 tuần / cuối khóa

Kết quả:

```text
Excellent
Good
Average
Need Improvement
```

Đề xuất lên cấp:

```text
Starter 1 → Starter 2 → Movers → Flyers → KET → PET
```

---

### Step 9. Hoàn thành khóa học

Hệ thống:

- Đóng Enrollment
- Cấp chứng chỉ hoàn thành
- Lưu lịch sử học tập
- Đề xuất khóa tiếp theo

---

## 3. Teacher Management Flow

### Step 10. Tạo hồ sơ giáo viên

Admin nhập:

- Thông tin cá nhân
- Chứng chỉ giảng dạy
- Kinh nghiệm
- Thông tin hợp đồng

---

### Step 11. Phân công lớp học

Admin thực hiện:

- Xem lịch trống của giáo viên
- Gán giáo viên vào lớp
- Xác nhận thời khóa biểu

Hệ thống kiểm tra:

- Không trùng lịch
- Phù hợp cấp độ giảng dạy
- Tải trọng giờ dạy hợp lý

---

### Step 12. Quản lý công & Lương

Hàng tháng:

```text
Ghi nhận giờ dạy
↓
Tính bảng chấm công
↓
Tính lương (lương cơ bản + giờ dạy + thưởng KPI)
↓
Duyệt lương
↓
Xuất phiếu lương
```

---

### Step 13. KPI & Khen thưởng

Tiêu chí KPI:

- Tỷ lệ chuyên cần học viên
- Kết quả đánh giá học viên
- Phản hồi phụ huynh
- Số giờ dạy

Kết quả:

```text
Đạt KPI → Khen thưởng
Không đạt KPI → Cảnh báo / Xem xét
```

---

### Step 14. Xử lý kỷ luật

Quy trình:

```text
Ghi nhận vi phạm
↓
Xem xét mức độ
↓
Nhắc nhở / Cảnh cáo / Tạm đình chỉ
↓
Lưu hồ sơ kỷ luật
```

---

## 4. Course Management Flow

### Step 15. Tạo khóa học

Admin thiết lập:

- Tên khóa học
- Cấp độ
- Số buổi học
- Học phí
- Giáo trình sử dụng

---

### Step 16. Thiết lập chương trình học

```text
Chương trình học
↓
Khóa học (theo cấp độ)
↓
Bài học (theo buổi)
↓
Giáo trình / Tài liệu
```

---

### Step 17. Mở lớp học

Admin thực hiện:

- Tạo lớp học
- Gán khóa học
- Phân công giáo viên
- Thiết lập lịch học
- Thiết lập sĩ số tối đa

Trạng thái lớp:

```text
Preparing
↓
Open (Đang tuyển sinh)
↓
In Progress (Đang học)
↓
Completed
```

---

### Step 18. Quản lý đề thi

Admin thiết lập kho đề thi:

- Ngân hàng câu hỏi theo cấp độ
- Tạo đề thi từ ngân hàng câu hỏi
- Gán đề thi cho kỳ kiểm tra

---

## 5. System Management Flow

### Step 19. Quản lý doanh nghiệp & Chi nhánh

Cấu trúc:

```text
Doanh Nghiệp (Trung tâm)
└── Chi nhánh 1
│   └── Nhân sự
│   └── Lớp học
│   └── Học viên
└── Chi nhánh 2
    └── ...
```

---

### Step 20. Phân quyền hệ thống

Cấp quyền theo vai trò:

- Super Admin: toàn bộ hệ thống
- Admin: theo doanh nghiệp
- Manager: theo chi nhánh
- Staff: theo chức năng

---

## 6. End-to-End Workflow

```text
Admin Login
        ↓
Dashboard Overview
        ↓
Tiếp nhận học viên mới
        ↓
Kiểm tra đầu vào
        ↓
Ghi danh & Xếp lớp
        ↓
Phân công giáo viên
        ↓
Khai giảng lớp học
        ↓
Theo dõi điểm danh & Bài tập
        ↓
Đánh giá định kỳ
        ↓
Chấm công & Tính lương GV
        ↓
Kết thúc khóa học
        ↓
Cấp chứng chỉ
        ↓
Đề xuất khóa tiếp theo
        ↓
Lên cấp & Ghi danh mới
```
