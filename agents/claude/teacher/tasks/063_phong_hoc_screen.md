# [063] - Teacher - Phòng học

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [063] |
| Module | Teacher |
| Screen | Phòng học |
| Sprint | Sprint 3 |
| Label | Sprint3, Teacher, Frontend |
| Trello | https://trello.com/c/R8Vl9EPm |
| Mockup | https://drive.google.com/file/d/1X6io3rCiq2ykWn-vV9f44CWH8LQnrfWL/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Hiển thị danh sách phòng học của trung tâm: tình trạng sử dụng, lịch đặt phòng và các thông tin liên quan. Hỗ trợ lọc và tìm kiếm phòng theo trạng thái, loại phòng.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/rooms`
- **Layout:** BasicLayout
- **Breadcrumb:** Phòng học

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Danh sách phòng học          [+ Thêm phòng học]      │
│           │ Quản lý & theo dõi tình trạng sử dụng phòng          │
│           │                                                      │
│           │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐┌──────┐│
│           │ │  24  │ │  18  │ │  2   │ │  4   │ │ 480  ││  6   ││
│           │ │Phòng │ │Đang  │ │Bảo   │ │Trống │ │ HV   ││ TT   ││
│           │ │      │ │dùng  │ │trì   │ │      │ │      ││ online││
│           │ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘└──────┘│
│           │                                                      │
│           ├─────────────────────────────┬────────────────────────┤
│           │  Danh sách phòng học         │  Bộ lọc               │
│           │ ┌───────────────────────┐   │                        │
│           │ │#│Tên│Loại│Tầng│Trạng │   │  Loại phòng: [▼]       │
│           │ │ │   │    │    │thái  │   │  Trạng thái: [▼]       │
│           │ ├───────────────────────┤   │  Tầng: [▼]             │
│           │ │1│P01│Lý  │ 1  │Đang  │   │  Sức chứa: [▼]         │
│           │ │ │   │thuyết│  │dùng  │   │                        │
│           │ │2│P02│Thực│ 1  │Trống │   │  [Áp dụng lọc]         │
│           │ │ │   │hành│    │      │   │                        │
│           │ │3│P03│Lý  │ 2  │Bảo   │   │                        │
│           │ │ │   │thuyết│  │trì   │   │                        │
│           │ └───────────────────────┘   │                        │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 RoomStatRow (×6)

| Card | Giá trị |
|------|---------|
| Tổng phòng | 24 |
| Đang dùng | 18 |
| Đang bảo trì | 2 |
| Trống | 4 |
| Học viên | 480 (tổng HV đang học) |
| Phòng trực tuyến | 6 |

---

### 5.2 RoomTable (Panel trái)

**Columns:**
- STT
- Tên phòng
- Loại phòng (Lý thuyết / Thực hành / Trực tuyến)
- Tầng
- Sức chứa (tối đa)
- Trạng thái (Đang dùng / Trống / Bảo trì)
- Lịch đặt / Ngày đặt gần nhất
- Thao tác: Xem chi tiết | Đặt phòng | Báo bảo trì

**Màu trạng thái:**
- Đang dùng: xanh lá
- Trống: xám
- Bảo trì: đỏ/cam

**Click tên phòng** → Navigate `/room/{id}`

---

### 5.3 RoomFilterSidebar (Panel phải)

**Bộ lọc:**
- Dropdown Loại phòng (Tất cả / Lý thuyết / Thực hành / Trực tuyến)
- Dropdown Trạng thái (Tất cả / Đang dùng / Trống / Bảo trì)
- Dropdown Tầng
- Dropdown Sức chứa (≤10 / 11–20 / 21–30 / >30)
- Nút "Áp dụng lọc"

---

## 6. API Integration

### 6.1 API Room List

**Endpoint:** `GET /api/teacher/rooms`

**Headers:**
```
Authorization: Bearer {access_token}
Device-code: {device_code}
Accept: application/json
```

**Query params:**
```
type=all       # all | theory | practice | online
status=all     # all | in_use | empty | maintenance
floor=
capacity=
page=1
limit=20
```

**Response (200):**
```json
{
  "summary": {
    "total": 24,
    "in_use": 18,
    "maintenance": 2,
    "empty": 4,
    "total_students": 480,
    "online_rooms": 6
  },
  "data": [
    {
      "id": 1,
      "name": "Phòng 01",
      "type": "theory",
      "floor": 1,
      "capacity": 25,
      "status": "in_use",
      "latest_booking_date": "2025-05-20"
    }
  ],
  "meta": { "total": 24, "per_page": 20, "current_page": 1 }
}
```

---

## 7. State Management

```typescript
roomListStore.setSummary(summary)
roomListStore.setList(data)
roomListStore.setFilter({ type, status, floor, capacity })
roomListStore.setPage(page)
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị danh sách + stats |
| 2 | Lọc "Trống" | Chỉ hiện phòng đang trống |
| 3 | Lọc "Bảo trì" | Chỉ hiện phòng đang bảo trì |
| 4 | Click tên phòng | Navigate /room/{id} |
| 5 | Click "Đặt phòng" | Mở form đặt phòng |
| 6 | Lọc theo tầng | Chỉ hiện phòng đúng tầng |
| 7 | Màu trạng thái | Badge đúng màu |
| 8 | Phân trang | Load page tiếp theo |
