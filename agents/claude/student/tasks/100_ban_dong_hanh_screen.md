# [100] - Student - Bạn đồng hành

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [100] |
| Module | Student |
| Screen | Bạn đồng hành |
| Sprint | Sprint 5 |
| Label | Sprint5, Student, Frontend, API |
| Mockup Desktop | screen/desktop/ban dong hanh.png |
| Mockup Mobile | screen/mobile/ban dong hanh.png |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Cho phép học viên chọn nhân vật đồng hành (AI giáo viên, người thân, thú cưng ảo, robot, avatar cá nhân...) đồng hành xuyên suốt quá trình học tập.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/companion`
- **Layout:** StudentLayout
- **Breadcrumb:** Bạn đồng hành

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Bạn đồng hành                    [⭐1250][🔥12][🔔][Minh]│
│           │ Chọn bạn đồng hành cùng bé trong hành trình học tiếng Anh│
│           │ ┌───────┐┌───────┐┌───────┐┌───────┐                 │
│           │ │Cô Hana✓││  Ba   ││  Mẹ   ││ Bunny │  Bạn đồng hành  │
│           │ └───────┘└───────┘└───────┘└───────┘  là gì? (mô tả) │
│           │ ┌───────┐┌───────┐┌───────┐┌───────┐  4 lợi ích       │
│           │ │ Kitty ││ Robot ││Unicorn││Avatar📷│                 │
│           │ └───────┘└───────┘└───────┘└───────┘  Mẹo nhỏ         │
│           │            [Tiếp tục →]                (3 gợi ý)      │
│           │  "Bé có thể thay đổi bạn đồng hành bất cứ lúc nào."   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 CompanionGrid

- 8 thẻ nhân vật: Cô Hana (GV AI), Ba, Mẹ, Bunny (thú), Kitty (thú), Robot, Unicorn, Avatar của bé (tùy chỉnh ảnh riêng — icon camera)
- Mỗi thẻ: ảnh nhân vật, tên, mô tả ngắn tính cách
- Chọn 1 thẻ → viền xanh + dấu tick góc phải

### 5.2 CustomAvatarUpload

- Riêng thẻ "Avatar của bé": click mở trình chọn ảnh/camera để tạo nhân vật riêng

### 5.3 CompanionInfoPanel (Panel phải trên)

- Giải thích "Bạn đồng hành là gì?" — 4 lợi ích: Động viên học tập, Hỗ trợ học tập, Nhận phần thưởng, Kết nối cảm xúc

### 5.4 TipsCard (Panel phải dưới)

- Mẹo nhỏ: chọn nhân vật yêu thích, có thể đổi bất cứ lúc nào, xuất hiện xuyên suốt hành trình học

### 5.5 ContinueButton

- Nút `Tiếp tục` → lưu lựa chọn, điều hướng về trang chủ hoặc bước tiếp theo (onboarding)

---

## 6. API Integration

### 6.1 API Companion List

**Endpoint:** `GET /api/student/companions`

**Response (200):**
```json
{
  "current_companion_id": 1,
  "data": [
    { "id": 1, "name": "Cô Hana", "type": "ai_teacher", "avatar": "https://...", "description": "Giáo viên AI thân thiện, luôn bên bé mỗi ngày." },
    { "id": 8, "name": "Avatar của bé", "type": "custom", "avatar": null }
  ]
}
```

---

### 6.2 API Select Companion

**Endpoint:** `PUT /api/student/companions/select`

**Request body:** `{ "companion_id": 4 }`

**Response (200):** `{ "success": true, "companion_id": 4 }`

---

### 6.3 API Upload Custom Avatar

**Endpoint:** `POST /api/student/companions/custom-avatar` (multipart/form-data)

**Request body:** `image_file`

**Response (201):** `{ "companion_id": 8, "avatar": "https://..." }`

---

## 7. State Management

```typescript
companionStore.setList(companions)
companionStore.setSelected(id)
companionStore.uploadCustomAvatar(file)
companionStore.save()
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị 8 thẻ nhân vật, đúng nhân vật hiện tại được tick |
| 2 | Chọn nhân vật khác | Cập nhật viền chọn, bỏ chọn nhân vật cũ |
| 3 | Click "Avatar của bé" | Mở trình chọn ảnh/camera |
| 4 | Upload ảnh tùy chỉnh | Ảnh hiển thị làm avatar nhân vật |
| 5 | Click "Tiếp tục" | Lưu lựa chọn, điều hướng đúng trang |
| 6 | Đổi bạn đồng hành từ hồ sơ | Đồng bộ hiển thị đúng ở trang chủ |
