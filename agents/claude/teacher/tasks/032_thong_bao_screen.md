# [032] - Teacher - Thông báo

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [032] |
| Module | Teacher |
| Screen | Thông báo |
| Sprint | Sprint 2 |
| Label | Sprint2, Teacher, Frontend |
| Trello | https://trello.com/c/C9hoEU0l/72-032-teacher-thông-báo |
| Mockup | https://drive.google.com/file/d/1zuAvdXVTuM3KGAdvRyxsXCQnH_Xe2IBg/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Hiển thị và quản lý tất cả thông báo của giáo viên. Hỗ trợ lọc theo danh mục, trạng thái đã đọc/chưa đọc, thời gian và xem chi tiết thông báo.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/notifications`
- **Layout:** BasicLayout

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │  Thông báo                        [Đánh dấu đã đọc] │
│           │  Quản lý các thông báo và cập nhật mới nhất          │
│           ├──────────────┬───────────────────┬───────────────────┤
│           │ Danh mục     │ Tất cả thông báo  │ Dạy lớp viên      │
│           │              │                   │ tháng 5           │
│           │ Tất cả    77 │ [item 1] •        │ [image]           │
│           │              │ [item 2]           │                   │
│           │ Trạng thái   │ [item 3]           │ Thứ 5, 16/05/2025 │
│           │ Tất cả       │ [item 4]           │ [nội dung]        │
│           │ Chưa đọc     │ [item 5]           │                   │
│           │ Đã đọc       │ [...]              │ [Tới đây]         │
│           │              │                   │                   │
│           │ Thời gian    │                   │                   │
│           │ [filter]     │                   │                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 NotificationFilter (Panel trái)

**Sections:**
- **Danh mục** — danh sách loại thông báo + số lượng badge:
  - Tất cả thông báo (77)
  - Theo các category: Lịch học, Bài tập, Họp, Hệ thống...
- **Trạng thái** — radio buttons:
  - Tất cả
  - Chưa đọc
  - Đã đọc
- **Thời gian** — date range picker

---

### 5.2 NotificationTable (Panel giữa)

**Hiển thị mỗi item:**
- Dot indicator (xanh = chưa đọc)
- Icon loại thông báo
- Tiêu đề (bold nếu chưa đọc)
- Nội dung preview (1–2 dòng)
- Thời gian tương đối (1 giờ trước, hôm qua...)
- Hover → highlight row
- Click → mở NotificationDetail

**Pagination:** 20 items/trang

---

### 5.3 NotificationDetail (Panel phải)

**Hiển thị:**
- Tiêu đề thông báo
- Ngày giờ đầy đủ
- Ảnh đính kèm (nếu có)
- Nội dung HTML đầy đủ
- Nút hành động (nếu có): "Tới đây", "Xem lịch", v.v.
- Tự động mark as read khi mở

---

### 5.4 MarkAllReadButton

- Button "Đánh dấu tất cả đã đọc" ở header
- Gọi API Mark All Read
- Cập nhật UI ngay (optimistic update)

---

## 6. API Integration

### 6.1 API Notification List

**Endpoint:** `GET /api/teacher/notifications`

**Query params:**
```
page=1
limit=20
category=all          # hoặc tên category
status=all            # all | unread | read
date_from=2025-05-01
date_to=2025-05-31
```

**Headers:**
```
Authorization: Bearer {access_token}
Device-code: {device_code}
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Họp phụ huynh tháng 5",
      "content": "Cuộc họp phụ huynh sẽ diễn ra vào thứ 5...",
      "category": "meeting",
      "is_read": false,
      "image_url": "https://...",
      "action_url": null,
      "action_label": null,
      "created_at": "2025-05-15T10:00:00Z"
    }
  ],
  "meta": {
    "total": 77,
    "per_page": 20,
    "current_page": 1,
    "last_page": 4
  },
  "unread_count": 12
}
```

---

### 6.2 API Notification Detail

**Endpoint:** `GET /api/teacher/notifications/{id}`

**Response (200):**
```json
{
  "id": 1,
  "title": "Họp phụ huynh tháng 5",
  "content": "<p>Thông báo chi tiết...</p>",
  "category": "meeting",
  "is_read": true,
  "image_url": "https://...",
  "attachments": [],
  "action_url": "/schedule",
  "action_label": "Tới đây",
  "created_at": "2025-05-15T10:00:00Z"
}
```

---

### 6.3 API Mark As Read

**Endpoint:** `POST /api/teacher/notifications/{id}/read`

**Response (200):**
```json
{ "success": true }
```

---

### 6.4 API Mark All Read

**Endpoint:** `POST /api/teacher/notifications/read-all`

**Response (200):**
```json
{ "success": true, "updated_count": 12 }
```

---

## 7. State Management

```typescript
notificationStore.setList(data)
notificationStore.setSelectedId(id)
notificationStore.setUnreadCount(unread_count)
notificationStore.markAsRead(id)
notificationStore.markAllRead()
```

---

## 8. Filter Logic

- Thay đổi filter → reset page về 1 → re-fetch list
- Filter được giữ khi chuyển tab trong session
- URL sync: `/notifications?category=meeting&status=unread`

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị danh sách thông báo, badge đếm chưa đọc |
| 2 | Lọc "Chưa đọc" | Chỉ hiện thông báo chưa đọc |
| 3 | Click thông báo | Mở detail panel, mark as read |
| 4 | Nhấn "Đánh dấu tất cả đã đọc" | Tất cả dot biến mất, count = 0 |
| 5 | Lọc theo danh mục | Chỉ hiện thông báo đúng category |
| 6 | Lọc theo thời gian | Chỉ hiện thông báo trong khoảng ngày |
| 7 | Phân trang | Load trang tiếp theo khi scroll/click |
| 8 | Thông báo có action | Hiện nút hành động, click điều hướng |
| 9 | Không có thông báo | Hiển thị "Không có thông báo" |
