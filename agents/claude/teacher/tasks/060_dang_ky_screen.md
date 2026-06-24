# [060] - Teacher - Đăng ký

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [060] |
| Module | Teacher |
| Screen | Đăng ký |
| Sprint | Sprint 2 |
| Label | Sprint2, Teacher, Frontend |
| Trello | https://trello.com/c/jWBcb2Tl/74-060-teacher-đăng-ký |
| Mockup | https://drive.google.com/file/d/1f5RhJa01XGm2p_JHenavXe5zkZPBuz8e/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Cho phép giáo viên tạo tài khoản mới trên hệ thống Hana Edu. Form đăng ký gồm 3 bước (tab): Thông tin cá nhân → Thông tin trường học → Hồ sơ. Sau khi hoàn tất, chuyển hướng về màn hình đăng nhập hoặc dashboard.

---

## 3. Điều kiện truy cập

- **Truy cập được:** Người dùng chưa đăng nhập (unauthenticated)
- **Redirect nếu đã đăng nhập:** Chuyển về `/dashboard`
- **Route:** `/auth/register`
- **Layout:** UnAuthLayout (hai cột: marketing panel trái + form panel phải)

---

## 4. UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    HANA EDU                                     │
├───────────────────────────────┬─────────────────────────────────┤
│                               │           Đăng ký               │
│   Đồng hành cùng giáo viên   │   Tạo tài khoản Hana Edu,       │
│   Kiến tạo tương lai tri thức │   dành cho Giáo viên            │
│                               │                                 │
│  [Icon] Quản lý lớp           │  [1] Thông tin  [2] Trường học  │
│  [Icon] Theo dõi học viên     │  cá nhân        [3] Hồ sơ       │
│  [Icon] Đánh giá             │                                 │
│  [Icon] Thu nhập             │  --- STEP 1: Thông tin cá nhân --│
│                               │                                 │
│  [Dashboard illustration]     │  Họ và tên      Giới tính [▼]   │
│                               │  [___________]  [___________]   │
│                               │                                 │
│                               │  Email                          │
│                               │  [_________________________]    │
│                               │                                 │
│                               │  Số điện thoại  Ngày sinh [📅]  │
│                               │  [___________]  [___________]   │
│                               │                                 │
│                               │  Mật khẩu              [👁]     │
│                               │  [_________________________]    │
│                               │                                 │
│                               │  Xác nhận mật khẩu     [👁]     │
│                               │  [_________________________]    │
│                               │                                 │
│                               │  [✓] Tôi đồng ý với Điều khoản │
│                               │      và Chính sách bảo mật      │
│                               │                                 │
│                               │  ┌─────────────────────────┐   │
│                               │  │        Tiếp tục          │   │
│                               │  └─────────────────────────┘   │
│                               │                                 │
│                               │  Đã có tài khoản? Đăng nhập   │
└───────────────────────────────┴─────────────────────────────────┘
```

---

## 5. Luồng đăng ký (Multi-step)

```
Bước 1: Thông tin cá nhân
        ↓ [Tiếp tục]
Bước 2: Thông tin trường học
        ↓ [Tiếp tục]
Bước 3: Hồ sơ
        ↓ [Hoàn tất]
Gọi API Register
        ↓
[Thành công] → Redirect /auth/login (hoặc /dashboard)
[Thất bại]   → Hiển thị lỗi, ở lại bước hiện tại
```

---

## 6. Components

### 6.1 RegisterPage

**Mô tả:** Layout hai cột, cùng cấu trúc với LoginPage.

**Cấu trúc:**
- `LeftPanel` — nội dung marketing, ẩn trên mobile
- `RightPanel` — chứa `RegisterForm` với stepper

---

### 6.2 RegisterForm

**Mô tả:** Container quản lý state toàn bộ form đăng ký và điều hướng giữa các bước.

**State:**
- `currentStep: 1 | 2 | 3` — bước hiện tại
- `formData: RegisterFormData` — dữ liệu toàn bộ form
- `isLoading: boolean`
- `errorMessage: string | null`

**Hành vi:**
- Validate từng bước trước khi chuyển tiếp
- Cho phép quay lại bước trước (dữ liệu không bị mất)
- Submit API chỉ ở bước cuối

---

### 6.3 StepIndicator

**Mô tả:** Hiển thị 3 bước với trạng thái active/completed/pending.

**Props:**
- `currentStep: number`
- `steps: string[]` — `["Thông tin cá nhân", "Thông tin trường học", "Hồ sơ"]`

---

### 6.4 InputName

**Props:**
- `value: string`
- `onChange: (value: string) => void`
- `error: string | undefined`

**Thuộc tính input:**
- `type="text"`
- `placeholder="Nhập họ và tên"`
- `autoComplete="name"`

---

### 6.5 InputPhone

**Props:**
- `value: string`
- `onChange: (value: string) => void`
- `error: string | undefined`

**Thuộc tính input:**
- `type="tel"`
- `placeholder="Nhập số điện thoại"`
- `autoComplete="tel"`

---

### 6.6 GenderSelect

**Props:**
- `value: string`
- `onChange: (value: string) => void`
- `error: string | undefined`

**Options:** Nam | Nữ | Khác

---

### 6.7 DatePicker

**Mô tả:** Trường chọn ngày sinh.

**Props:**
- `value: string` — format `YYYY-MM-DD`
- `onChange: (value: string) => void`
- `error: string | undefined`

---

### 6.8 InputPassword / InputConfirmPassword

**Mô tả:** Như InputPassword trong màn Đăng nhập, thêm toggle hiển thị/ẩn.

---

## 7. Form Fields & Validation

### Bước 1 — Thông tin cá nhân

| Field | Label | Type | Required | Validation |
|-------|-------|------|----------|------------|
| name | Họ và tên | text | ✓ | Không trống; tối thiểu 2 ký tự |
| gender | Giới tính | select | ✓ | Phải chọn một giá trị |
| email | Email | email | ✓ | Không trống; định dạng email hợp lệ |
| phone | Số điện thoại | tel | ✓ | Không trống; 10 chữ số; bắt đầu bằng 0 |
| dob | Ngày sinh | date | ✓ | Không trống; không được là ngày trong tương lai |
| password | Mật khẩu | password | ✓ | Không trống; tối thiểu 8 ký tự |
| confirmPassword | Xác nhận mật khẩu | password | ✓ | Phải khớp với password |
| terms | Điều khoản | checkbox | ✓ | Phải tích chọn |

### Bước 2 — Thông tin trường học

| Field | Label | Type | Required | Validation |
|-------|-------|------|----------|------------|
| school | Tên trường / Trung tâm | text | ✓ | Không trống |
| position | Chức vụ | text | — | — |
| experience | Kinh nghiệm (năm) | number | — | Số nguyên dương |
| subject | Môn giảng dạy | text | — | — |

### Bước 3 — Hồ sơ

| Field | Label | Type | Required | Validation |
|-------|-------|------|----------|------------|
| avatar | Ảnh đại diện | file | — | jpg/png, max 5MB |
| bio | Giới thiệu bản thân | textarea | — | Tối đa 500 ký tự |
| certificate | Chứng chỉ | file | — | pdf/jpg/png, max 10MB |

### Thông báo lỗi Validation

| Điều kiện | Thông báo |
|-----------|-----------|
| Họ tên trống | "Vui lòng nhập họ và tên" |
| Họ tên < 2 ký tự | "Họ và tên tối thiểu 2 ký tự" |
| Giới tính chưa chọn | "Vui lòng chọn giới tính" |
| Email trống | "Vui lòng nhập email" |
| Email sai định dạng | "Email không hợp lệ" |
| SĐT trống | "Vui lòng nhập số điện thoại" |
| SĐT sai định dạng | "Số điện thoại không hợp lệ" |
| Ngày sinh trống | "Vui lòng chọn ngày sinh" |
| Mật khẩu trống | "Mật khẩu không được để trống" |
| Mật khẩu < 8 ký tự | "Mật khẩu tối thiểu 8 ký tự" |
| Confirm pass không khớp | "Mật khẩu xác nhận không khớp" |
| Chưa đồng ý điều khoản | "Vui lòng đồng ý với điều khoản" |

---

## 8. User Actions

### 8.1 Nhấn "Tiếp tục" (Bước 1, 2)

```
Validate fields của bước hiện tại
        ↓
[Có lỗi] → Hiển thị lỗi tương ứng, dừng
        ↓
[Không lỗi] → Chuyển sang bước tiếp theo
              Cập nhật StepIndicator
```

### 8.2 Nhấn "Hoàn tất" (Bước 3)

```
Validate fields bước 3
        ↓
[Có lỗi] → Hiển thị lỗi
        ↓
[Không lỗi] → Disable button, show loading
        ↓
Gọi API Device Init (lấy device-code nếu chưa có)
        ↓
Gọi API Register
        ↓
[Thành công] → Hiển thị thông báo thành công → Redirect /auth/login
[Thất bại]   → Hiển thị error message, enable button
```

### 8.3 Nhấn "Quay lại"

- Quay về bước trước, giữ nguyên dữ liệu đã nhập

### 8.4 Nhấn "Đã có tài khoản? Đăng nhập ngay"

- Chuyển hướng đến `/auth/login`

### 8.5 Nhấn vào step đã hoàn thành

- Cho phép quay về bước đó để chỉnh sửa

---

## 9. API Integration

### 9.1 API Device Init (Pre-register)

**Endpoint:** `POST /api/auth/device/init`

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Response:**
```json
{
  "device_code": "abc123xyz"
}
```

---

### 9.2 API Register

**Endpoint:** `POST /api/auth/register`

**Headers:**
```
Content-Type: application/json
Accept: application/json
Device-code: {device_code}
```

**Request body:**
```json
{
  "name": "Nguyễn Văn A",
  "gender": "male",
  "email": "teacher@example.com",
  "phone": "0901234567",
  "dob": "1990-01-15",
  "password": "password123",
  "password_confirmation": "password123",
  "school": "Trung tâm Hana Edu",
  "position": "Giáo viên tiếng Anh",
  "experience": 3,
  "subject": "Tiếng Anh",
  "bio": "Giáo viên có 3 năm kinh nghiệm...",
  "app_id": 2
}
```

**Response thành công (201):**
```json
{
  "message": "Đăng ký thành công. Vui lòng đăng nhập.",
  "user": {
    "id": 1,
    "name": "Nguyễn Văn A",
    "email": "teacher@example.com"
  }
}
```

**Response lỗi (422) — Validation:**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["Email đã được sử dụng"],
    "phone": ["Số điện thoại đã được đăng ký"]
  }
}
```

**Response lỗi (409) — Duplicate:**
```json
{
  "message": "Tài khoản đã tồn tại"
}
```

---

### 9.3 API Upload Avatar (Bước 3 — nếu có)

**Endpoint:** `POST /api/file/upload`

**Headers:**
```
Content-Type: multipart/form-data
Device-code: {device_code}
```

**Body:**
```
app_id: 2
secure_code: abc123
title: avatar
file: [file]
```

**Response:**
```json
{
  "id": 123,
  "url": "https://..."
}
```

---

## 10. State Management

### Form Data

```typescript
interface RegisterFormData {
  // Bước 1
  name: string
  gender: 'male' | 'female' | 'other'
  email: string
  phone: string
  dob: string
  password: string
  confirmPassword: string
  terms: boolean

  // Bước 2
  school: string
  position: string
  experience: number | null
  subject: string

  // Bước 3
  avatar: File | null
  avatarUrl: string | null
  bio: string
  certificate: File | null
}
```

### Step Progress

```typescript
completedSteps: number[]  // [1, 2] → bước 3 đang active
```

---

## 11. Redirect Logic

| Trạng thái | Hành động |
|------------|-----------|
| Chưa đăng nhập, truy cập `/auth/register` | Hiển thị form đăng ký |
| Đã đăng nhập, truy cập `/auth/register` | Redirect về `/dashboard` |
| Đăng ký thành công | Redirect về `/auth/login` + toast "Đăng ký thành công" |

---

## 12. Error Handling

| Loại lỗi | Hiển thị |
|----------|----------|
| Email đã tồn tại (422) | Hiển thị lỗi inline tại field email |
| SĐT đã đăng ký (422) | Hiển thị lỗi inline tại field phone |
| Lỗi server (5xx) | Toast error: "Lỗi kết nối. Vui lòng thử lại" |
| Upload avatar thất bại | Toast warning: "Không thể tải ảnh, bỏ qua bước này" |
| Device init thất bại | Toast error: "Không thể kết nối. Vui lòng thử lại" |

---

## 13. Loading State

- Nút "Tiếp tục" / "Hoàn tất" disabled + spinner khi đang gọi API
- Tất cả input disabled trong khi loading
- Upload avatar hiển thị progress bar

---

## 14. Responsive

| Breakpoint | Layout |
|------------|--------|
| Mobile (< 768px) | Ẩn panel trái, form full-width |
| Tablet (768px–1024px) | Ẩn panel trái, form max-width 540px căn giữa |
| Desktop (> 1024px) | Hai cột 50/50 |

---

## 15. Test Cases

| # | Mô tả | Input | Kết quả mong đợi |
|---|-------|-------|-----------------|
| 1 | Đăng ký thành công đầy đủ | Điền đủ 3 bước | Redirect /auth/login + toast thành công |
| 2 | Tiếp tục khi bước 1 còn trống | Submit khi trống | Hiển thị lỗi tương ứng từng field |
| 3 | Email sai định dạng | `abc@` | Lỗi "Email không hợp lệ" |
| 4 | SĐT sai định dạng | `12345` | Lỗi "Số điện thoại không hợp lệ" |
| 5 | Mật khẩu < 8 ký tự | `1234567` | Lỗi "Mật khẩu tối thiểu 8 ký tự" |
| 6 | Confirm pass không khớp | Nhập khác password | Lỗi "Mật khẩu xác nhận không khớp" |
| 7 | Chưa đồng ý điều khoản | Không tích checkbox | Lỗi "Vui lòng đồng ý với điều khoản" |
| 8 | Email đã tồn tại | Email đã dùng | Lỗi inline "Email đã được sử dụng" |
| 9 | SĐT đã đăng ký | SĐT đã dùng | Lỗi inline "Số điện thoại đã được đăng ký" |
| 10 | Quay lại bước trước | Nhấn Back | Giữ nguyên dữ liệu đã nhập |
| 11 | Bỏ qua bước 3 (optional) | Nhấn Hoàn tất không upload | Đăng ký thành công |
| 12 | Đăng nhập ngay | Nhấn link | Chuyển /auth/login |
| 13 | Đã đăng nhập | Truy cập /auth/register | Redirect /dashboard |
| 14 | Upload avatar vượt 5MB | File > 5MB | Lỗi "Ảnh không được vượt quá 5MB" |
| 15 | Enter submit | Nhấn Enter | Submit bước hiện tại |
