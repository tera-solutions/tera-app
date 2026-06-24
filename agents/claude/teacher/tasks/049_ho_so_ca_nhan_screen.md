# [049] - Teacher - Hồ sơ cá nhân

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [049] |
| Module | Teacher |
| Screen | Hồ sơ cá nhân |
| Sprint | Sprint 3 |
| Label | Sprint3, Teacher, Frontend |
| Trello | https://trello.com/c/YBAPsqUb |
| Mockup | https://drive.google.com/file/d/1vcSCpvGWO2RTKXrfC6Wvc4ljA9Hatsx8/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Hiển thị và cho phép chỉnh sửa hồ sơ cá nhân của giáo viên: thông tin cơ bản, hồ sơ giảng dạy, lịch làm việc, hồ sơ học thuật và quản lý tài khoản.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/profile`
- **Layout:** BasicLayout
- **Breadcrumb:** Trang chủ > Cá nhân > Thông tin cá nhân

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Trang chủ > Cá nhân > Thông tin cá nhân              │
│           │                                                      │
│           ├──────────────────┬────────────────┬──────────────────┤
│           │  Thông tin tài   │  Hồ sơ GV      │  Tài khoản      │
│           │  khoản           │                │                  │
│           │                  │  [Table hồ sơ] │  [Mini calendar  │
│           │  [Avatar]        │                │   tạo tài khoản] │
│           │  Cô Ngọc         │  Lịch làm việc │                  │
│           │  ● Online        │  [Mini calendar│  Quản lý tài khoản│
│           │                  │   lịch dạy]    │  • Đổi mật khẩu  │
│           │  Email: ...      │                │  • Cập nhật email│
│           │  Ngày sinh: ...  │  Hồ sơ học     │  • Xác thực 2FA  │
│           │  Giới tính: ...  │  thuật:        │  • Đăng xuất     │
│           │  Địa chỉ: ...    │  📄 CV.pdf     │                  │
│           │  SĐT: ...        │  📄 Bằng cấp   │  Lịch dạy học   │
│           │                  │  📄 Chứng chỉ  │  [Mini calendar  │
│           │  [Chỉnh sửa]     │                │   theo tháng]   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 AccountInfoCard (Panel trái)

**Hiển thị:**
- Avatar (upload/thay đổi được)
- Họ tên (Cô Ngọc)
- Trạng thái online (● Online)
- Email
- Ngày sinh
- Giới tính
- Địa chỉ
- Số điện thoại

**Nút:** `Chỉnh sửa thông tin`

---

### 5.2 ProfileEditForm (Modal/Inline khi click Chỉnh sửa)

| Field | Label | Type | Required |
|-------|-------|------|----------|
| avatar | Ảnh đại diện | image upload | — |
| full_name | Họ tên | text | ✓ |
| dob | Ngày sinh | date | — |
| gender | Giới tính | select (Nam/Nữ/Khác) | — |
| address | Địa chỉ | text | — |
| phone | Số điện thoại | tel | — |

---

### 5.3 TeacherProfileTable (Panel giữa - trên)

Bảng thông tin hồ sơ giảng dạy:

| Trường | Nội dung |
|--------|----------|
| Chuyên môn | Tiếng Anh |
| Cấp dạy | A1 – C1 |
| Kinh nghiệm | 5 năm |
| Trung tâm | Hana Edu |
| Ngày vào làm | 01/09/2022 |

---

### 5.4 WorkScheduleCalendar (Panel giữa - giữa)

- Mini calendar hiển thị lịch làm việc trong tuần/tháng
- Màu sắc theo buổi sáng/chiều/tối

---

### 5.5 AcademicProfile (Panel giữa - dưới)

Danh sách hồ sơ học thuật (file):
- CV (PDF)
- Bằng cấp (PDF/Image)
- Chứng chỉ (PDF)

**Nút Upload:** Thêm file mới

---

### 5.6 AccountSidebar (Panel phải - trên)

- Mini calendar hiển thị ngày tạo tài khoản

**Quản lý tài khoản (links):**
- Đổi mật khẩu
- Cập nhật email
- Xác thực 2 lớp (2FA)
- Đăng xuất

---

### 5.7 TeachScheduleCalendar (Panel phải - dưới)

- Mini calendar tháng hiển thị lịch dạy học
- Click ngày → xem buổi dạy trong ngày đó

---

## 6. API Integration

### 6.1 API Get Profile

**Endpoint:** `GET /api/teacher/profile`

**Headers:**
```
Authorization: Bearer {access_token}
Device-code: {device_code}
Accept: application/json
```

**Response (200):**
```json
{
  "id": 1,
  "full_name": "Cô Ngọc",
  "avatar": "https://...",
  "email": "ngoc@example.com",
  "dob": "1990-03-15",
  "gender": "female",
  "address": "TP. Hồ Chí Minh",
  "phone": "0901234567",
  "is_online": true,
  "teaching_profile": {
    "specialty": "Tiếng Anh",
    "levels": "A1 – C1",
    "experience_years": 5,
    "center": "Hana Edu",
    "joined_at": "2022-09-01"
  },
  "academic_files": [
    { "id": 1, "name": "CV.pdf", "url": "https://...", "type": "pdf" }
  ],
  "account_created_at": "2022-09-01"
}
```

---

### 6.2 API Update Profile

**Endpoint:** `PUT /api/teacher/profile`

**Request body:**
```json
{
  "full_name": "Cô Ngọc",
  "dob": "1990-03-15",
  "gender": "female",
  "address": "TP. Hồ Chí Minh",
  "phone": "0901234567"
}
```

**Response (200):**
```json
{ "success": true, "message": "Cập nhật thành công" }
```

---

### 6.3 API Upload Avatar

**Endpoint:** `POST /api/teacher/profile/avatar`

**Request body (multipart/form-data):**
```
avatar=<file>
```

**Response (200):**
```json
{ "avatar_url": "https://..." }
```

---

### 6.4 API Upload Academic File

**Endpoint:** `POST /api/teacher/profile/academic-files`

**Request body (multipart/form-data):**
```
file=<file>
label=CV
```

**Response (201):**
```json
{ "id": 5, "name": "CV.pdf", "url": "https://..." }
```

---

### 6.5 API Work Schedule

**Endpoint:** `GET /api/teacher/profile/schedule`

**Query params:**
```
month=2025-05
```

**Response (200):**
```json
{
  "schedule": [
    { "date": "2025-05-20", "sessions": ["08:00-09:30", "14:00-15:30"] }
  ]
}
```

---

## 7. State Management

```typescript
profileStore.setProfile(profile)
profileStore.setEditMode(bool)
profileStore.setFormData(data)
profileStore.setAcademicFiles(files)
profileStore.setSchedule(schedule)
profileStore.setUploading(bool)
```

---

## 8. Validation

| Field | Rule | Thông báo |
|-------|------|-----------|
| full_name | required, min 2 ký tự | "Vui lòng nhập họ tên" |
| phone | valid VN phone | "Số điện thoại không hợp lệ" |
| avatar | max 5MB, jpg/png | "Ảnh quá lớn hoặc định dạng không hỗ trợ" |
| academic file | max 10MB, pdf/doc/jpg | "File không hỗ trợ hoặc quá lớn" |

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị đủ thông tin profile |
| 2 | Click "Chỉnh sửa" | Chuyển sang edit mode |
| 3 | Lưu thông tin hợp lệ | Toast "Cập nhật thành công" |
| 4 | Upload avatar | Preview ngay + lưu |
| 5 | Upload file học thuật | Hiện trong danh sách |
| 6 | Click "Đổi mật khẩu" | Navigate sang màn đổi MK |
| 7 | Click "Đăng xuất" | Confirm → logout |
| 8 | Lịch dạy học | Calendar hiển thị đúng ngày có lịch |
