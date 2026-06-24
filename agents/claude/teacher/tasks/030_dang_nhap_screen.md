# [030] - Teacher - Đăng nhập

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [030] |
| Module | Teacher |
| Screen | Đăng nhập |
| Sprint | Sprint 2 |
| Label | Sprint2, Teacher, Frontend |
| Trello | https://trello.com/c/BdSkS5Gm/57-030-teacher-đăng-nhập |
| Mockup | https://drive.google.com/file/d/1r_i0ZrcUVBq7L2AZl9rujMB35xBa6ydi/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Cho phép giáo viên đăng nhập vào hệ thống bằng email/số điện thoại và mật khẩu, hoặc qua tài khoản Google/Microsoft. Sau khi xác thực thành công, hệ thống lưu token và chuyển hướng về Dashboard.

---

## 3. Điều kiện truy cập

- **Truy cập được:** Người dùng chưa đăng nhập (unauthenticated)
- **Redirect nếu đã đăng nhập:** Chuyển về `/dashboard`
- **Route:** `/auth/login`
- **Layout:** UnAuthLayout (hai cột: marketing panel trái + form panel phải)

---

## 4. UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    HANA EDU                                     │
├───────────────────────────────┬─────────────────────────────────┤
│                               │         Đăng nhập               │
│   Nền tảng giảng dạy          │   Chào mừng bạn trở lại với     │
│   thông minh                  │   Hana Edu, Dành cho Giáo viên  │
│   Dành cho giáo viên          │                                 │
│   hiện đại                    │  Email hoặc số điện thoại        │
│                               │  ┌───────────────────────────┐  │
│  [Icon: Quản lý lớp học]      │  │ Nhập email hoặc SĐT       │  │
│  [Icon: Theo dõi học viên]    │  └───────────────────────────┘  │
│  [Icon: Đánh giá & phát triển]│                                 │
│  [Icon: Báo cáo thu nhập]     │  Mật khẩu                       │
│                               │  ┌───────────────────────────┐  │
│  [Illustration: teacher/app]  │  │ Nhập mật khẩu         [👁] │  │
│                               │  └───────────────────────────┘  │
│                               │                                 │
│                               │  [✓] Ghi nhớ đăng nhập         │
│                               │               Quên mật khẩu?   │
│                               │                                 │
│                               │  ┌───────────────────────────┐  │
│                               │  │        Đăng nhập           │  │
│                               │  └───────────────────────────┘  │
│                               │                                 │
│                               │  ──── Hoặc đăng nhập với ────   │
│                               │                                 │
│                               │  ┌──────────┐  ┌───────────┐   │
│                               │  │  Google  │  │ Microsoft │   │
│                               │  └──────────┘  └───────────┘   │
│                               │                                 │
│                               │  Chưa có tài khoản? Đăng ký   │
└───────────────────────────────┴─────────────────────────────────┘
```

---

## 5. Components

### 5.1 LoginPage

**Mô tả:** Layout hai cột cho toàn bộ trang đăng nhập.

**Cấu trúc:**
- `LeftPanel` — nội dung marketing, ẩn trên mobile
- `RightPanel` — chứa `LoginForm`

---

### 5.2 LoginForm

**Mô tả:** Form container chính.

**State:**
- `isLoading: boolean` — đang gọi API
- `errorMessage: string | null` — lỗi từ API

**Hành vi:**
- Submit khi nhấn nút "Đăng nhập" hoặc Enter
- Hiển thị lỗi chung bên dưới form nếu API trả lỗi

---

### 5.3 InputEmail

**Mô tả:** Trường nhập email hoặc số điện thoại.

**Props:**
- `value: string`
- `onChange: (value: string) => void`
- `error: string | undefined`
- `disabled?: boolean`

**Thuộc tính input:**
- `type="text"` (chấp nhận cả email và số điện thoại)
- `placeholder="Nhập email hoặc số điện thoại"`
- `autoComplete="username"`
- `autoFocus`

---

### 5.4 InputPassword

**Mô tả:** Trường nhập mật khẩu có nút toggle hiển thị/ẩn.

**Props:**
- `value: string`
- `onChange: (value: string) => void`
- `error: string | undefined`
- `disabled?: boolean`

**Thuộc tính input:**
- `type="password"` / `type="text"` (toggle)
- `placeholder="Nhập mật khẩu"`
- `autoComplete="current-password"`

**Icon toggle:** icon mắt — ẩn/hiện mật khẩu.

---

### 5.5 RememberMe

**Props:**
- `checked: boolean`
- `onChange: (checked: boolean) => void`

**Hành vi:**
- `true` → lưu token vào `localStorage`
- `false` → lưu token vào `sessionStorage`

---

### 5.6 SocialLogin

**Mô tả:** Nút đăng nhập qua Google và Microsoft.

**Buttons:** Google | Microsoft

**Hành vi:** Redirect sang OAuth flow của provider tương ứng.

---

## 6. Form Fields & Validation

| Field | Label | Type | Required | Validation |
|-------|-------|------|----------|------------|
| identifier | Email hoặc số điện thoại | text | ✓ | Không được để trống |
| password | Mật khẩu | password | ✓ | Không được để trống; tối thiểu 6 ký tự |
| rememberMe | Ghi nhớ đăng nhập | checkbox | — | Không validate |

### Thông báo lỗi Validation

| Điều kiện | Thông báo |
|-----------|-----------|
| Identifier trống | "Vui lòng nhập email hoặc số điện thoại" |
| Mật khẩu trống | "Mật khẩu không được để trống" |
| Mật khẩu < 6 ký tự | "Mật khẩu tối thiểu 6 ký tự" |

### Thời điểm validate

- **onBlur:** hiển thị lỗi khi rời khỏi field
- **onSubmit:** validate toàn bộ trước khi gọi API

---

## 7. User Actions

### 7.1 Nhấn "Đăng nhập"

```
User nhấn Đăng nhập
        ↓
Validate form (client-side)
        ↓
[Có lỗi] → Hiển thị lỗi, dừng
        ↓
[Không lỗi] → Disable button + show loading spinner
        ↓
Gọi API Device Init (lấy device-code)
        ↓
Gọi API Login
        ↓
[API lỗi] → Hiển thị error message, enable lại button
        ↓
[API thành công] → Lưu token → Gọi API Get Profile → Redirect /dashboard
```

### 7.2 Nhấn "Quên mật khẩu?"

- Chuyển hướng đến `/auth/forgot-password`

### 7.3 Nhấn "Đăng ký ngay"

- Chuyển hướng đến `/auth/register`

### 7.4 Nhấn Enter trong form

- Trigger submit form

### 7.5 Toggle hiển thị mật khẩu

- Nhấn icon 👁 → toggle `type` giữa `"password"` và `"text"`

### 7.6 Nhấn Google / Microsoft

- Redirect sang OAuth flow tương ứng

---

## 8. API Integration

### 8.1 API Device Init (Pre-login)

**Mục đích:** Lấy `device-code` trước khi gọi Login. Gọi 1 lần khi app khởi động hoặc trước login.

**Endpoint:** `POST /api/auth/device/init`

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Response thành công:**
```json
{
  "device_code": "abc123xyz"
}
```

Lưu `device_code` vào store/context để dùng cho các API sau.

---

### 8.2 API Login

**Endpoint:** `POST /api/auth/login`

**Headers:**
```
Content-Type: application/json
Accept: application/json
Device-code: {device_code}
```

**Request body:**
```json
{
  "identifier": "teacher@example.com",
  "password": "123456"
}
```

> `identifier` có thể là email hoặc số điện thoại.

**Response thành công (200):**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Response lỗi (401):**
```json
{
  "message": "Email hoặc mật khẩu không đúng"
}
```

**Response lỗi (403):**
```json
{
  "message": "Tài khoản đã bị khóa"
}
```

---

### 8.3 API Get Profile

**Endpoint:** `GET /api/auth/profile`

**Headers:**
```
Authorization: Bearer {access_token}
Device-code: {device_code}
Accept: application/json
```

**Response thành công (200):**
```json
{
  "id": 1,
  "name": "Nguyễn Văn A",
  "email": "teacher@example.com",
  "phone": "0901234567",
  "role": "teacher",
  "avatar": "https://..."
}
```

**Mục đích:** Lấy thông tin người dùng và lưu vào global store sau khi login thành công.

---

## 9. State Management

### Token Storage

| rememberMe | Storage | Keys |
|------------|---------|------|
| true | localStorage | `access_token`, `refresh_token` |
| false | sessionStorage | `access_token`, `refresh_token` |

### Device Code Storage

- Lưu `device_code` vào `localStorage` key `device_code` khi init.

### Global Store (sau login thành công)

```typescript
authStore.setAccessToken(access_token)
authStore.setRefreshToken(refresh_token)

userStore.setProfile({
  id,
  name,
  email,
  phone,
  role,
  avatar,
})
userStore.setIsAuthenticated(true)
```

---

## 10. Redirect Logic

| Trạng thái | Hành động |
|------------|-----------|
| Chưa đăng nhập, truy cập `/auth/login` | Hiển thị màn hình đăng nhập |
| Đã đăng nhập, truy cập `/auth/login` | Redirect về `/dashboard` |
| Login thành công | Redirect về `/dashboard` (hoặc `returnUrl` nếu có) |
| Token hết hạn | Redirect về `/auth/login` |

---

## 11. Error Handling

| Loại lỗi | Hiển thị |
|----------|----------|
| Sai email/SĐT hoặc mật khẩu (401) | Toast error: "Email hoặc mật khẩu không đúng" |
| Tài khoản bị khóa (403) | Toast error: "Tài khoản đã bị khóa. Vui lòng liên hệ admin" |
| Lỗi mạng / server (5xx) | Toast error: "Lỗi kết nối. Vui lòng thử lại" |
| Device init thất bại | Toast error: "Không thể kết nối. Vui lòng thử lại" |
| Timeout | Toast error: "Yêu cầu hết thời gian. Vui lòng thử lại" |

---

## 12. Loading State

- Nút "Đăng nhập" hiển thị spinner và `disabled` trong khi đang gọi API
- Tất cả input `disabled` trong khi loading
- Không cho submit lại khi đang loading

---

## 13. Responsive

| Breakpoint | Layout |
|------------|--------|
| Mobile (< 768px) | Ẩn panel trái, form full-width, padding 16px |
| Tablet (768px–1024px) | Ẩn panel trái, form max-width 480px căn giữa |
| Desktop (> 1024px) | Hai cột 50/50, panel trái hiện marketing content |

---

## 14. Test Cases

| # | Mô tả | Input | Kết quả mong đợi |
|---|-------|-------|-----------------|
| 1 | Login bằng email thành công | Email/pass đúng | Redirect /dashboard |
| 2 | Login bằng số điện thoại thành công | SĐT/pass đúng | Redirect /dashboard |
| 3 | Identifier trống | Submit khi trống | Lỗi "Vui lòng nhập email hoặc số điện thoại" |
| 4 | Mật khẩu trống | Submit khi pass trống | Lỗi "Mật khẩu không được để trống" |
| 5 | Mật khẩu < 6 ký tự | `12345` | Lỗi "Mật khẩu tối thiểu 6 ký tự" |
| 6 | Sai mật khẩu | Email đúng, pass sai | Toast "Email hoặc mật khẩu không đúng" |
| 7 | Tài khoản bị khóa | Email/pass đúng nhưng bị khóa | Toast "Tài khoản đã bị khóa" |
| 8 | Remember me = true | Login thành công | Token lưu localStorage |
| 9 | Remember me = false | Login thành công | Token lưu sessionStorage |
| 10 | Đã đăng nhập | Truy cập /auth/login | Redirect /dashboard |
| 11 | Toggle mật khẩu | Nhấn icon 👁 | Hiển thị / ẩn mật khẩu |
| 12 | Enter submit | Nhấn Enter trong form | Submit form |
| 13 | Quên mật khẩu | Nhấn link | Chuyển /auth/forgot-password |
| 14 | Đăng ký ngay | Nhấn link | Chuyển /auth/register |
| 15 | Device init lỗi | Mạng không ổn định | Toast lỗi kết nối, không gọi login |
