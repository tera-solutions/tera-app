# [061] - Teacher - Phụ huynh

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [061] |
| Module | Teacher |
| Screen | Phụ huynh |
| Sprint | Sprint 3 |
| Label | Sprint3, Teacher, Frontend |
| Trello | https://trello.com/c/QYD14DL9 |
| Mockup | https://drive.google.com/file/d/1ftb_JV3TXVbtoJsnNf5Hyy8Od7RniMAB/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Hiển thị danh sách phụ huynh của học viên trong các lớp giáo viên phụ trách. Cho phép tìm kiếm, liên hệ và theo dõi trạng thái tương tác.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/parents`
- **Layout:** BasicLayout
- **Breadcrumb:** Phụ huynh

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Danh sách phụ huynh          [+ Thêm phụ huynh]      │
│           │ Quản lý liên lạc phụ huynh                           │
│           │                                                      │
│           │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│           │ │ 128  │ │  86  │ │  24  │ │ 4.8/5│ │  98% │       │
│           │ │ Tổng │ │ Đã   │ │ Tin  │ │      │ │ Hoàn │       │
│           │ │  PH  │ │tiếp  │ │ nhắn │ │      │ │thành │       │
│           │ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘       │
│           │                                                      │
│           │ [🔍 Tìm kiếm tên, email, SĐT...]  [Lọc lớp ▼]       │
│           │                                   [Lọc trạng thái ▼]│
│           │                                   [Xuất Excel]      │
│           │                                                      │
│           │ ┌──────────────────────────────────────────────────┐ │
│           │ │Họ tên│Liên hệ│Lớp│SĐT│Email│Trạng thái│Hành động│ │
│           │ ├──────────────────────────────────────────────────┤ │
│           │ │[a]Trần Thị An│Phụ huynh│S2A│...│...│Đã TN │[btn]│ │
│           │ │[a]Nguyễn Văn B│Phụ huynh│M1B│...│...│Chưa TN│[btn]│ │
│           │ └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 ParentStatRow (×5)

| Card | Giá trị |
|------|---------|
| Tổng phụ huynh | 128 |
| Đã tiếp nối | 86 (đã liên hệ/nhắn tin) |
| Tin nhắn mới | 24 tin chưa đọc |
| Đánh giá | 4.8/5 |
| Hoàn thành | 98% |

---

### 5.2 ParentToolbar

- Search input: "Tìm theo tên, email, SĐT..."
- Dropdown lọc Lớp
- Dropdown lọc Trạng thái (Đã tiếp nối / Chưa tiếp nối)
- Nút Xuất Excel
- Nút "+ Thêm phụ huynh"

---

### 5.3 ParentTable

**Columns:**
- Họ tên (avatar + tên)
- Liên hệ (vai trò: Bố/Mẹ/Người thân)
- Lớp của con
- Số điện thoại
- Email
- Thông tin khác
- Trạng thái tiếp cận (Đã TN / Chưa TN)
- Hành động: Xem | Nhắn tin | Gọi

**Click tên** → Navigate `/parent/{id}`

---

## 6. API Integration

### 6.1 API Parent List

**Endpoint:** `GET /api/teacher/parents`

**Headers:**
```
Authorization: Bearer {access_token}
Device-code: {device_code}
Accept: application/json
```

**Query params:**
```
search=
class_id=
status=all    # all | contacted | not_contacted
page=1
limit=20
```

**Response (200):**
```json
{
  "summary": {
    "total": 128,
    "contacted": 86,
    "new_messages": 24,
    "avg_rating": 4.8,
    "completion_rate": 98
  },
  "data": [
    {
      "id": 1,
      "name": "Trần Thị An",
      "avatar": "https://...",
      "relation": "Mẹ",
      "class_name": "Starters 2A",
      "phone": "0901234567",
      "email": "an@example.com",
      "contact_status": "contacted"
    }
  ],
  "meta": { "total": 128, "per_page": 20, "current_page": 1 }
}
```

---

## 7. State Management

```typescript
parentListStore.setSummary(summary)
parentListStore.setList(data)
parentListStore.setFilter({ search, class_id, status })
parentListStore.setPage(page)
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị danh sách + stats |
| 2 | Tìm kiếm | Filter realtime |
| 3 | Lọc theo lớp | Chỉ hiện PH có con trong lớp đó |
| 4 | Click "Nhắn tin" | Navigate sang màn Tin nhắn với PH đó |
| 5 | Click tên PH | Navigate /parent/{id} |
| 6 | Xuất Excel | Download file danh sách |
| 7 | Badge tin nhắn mới | Hiển thị số tin chưa đọc |
| 8 | Phân trang | Load page tiếp theo |
