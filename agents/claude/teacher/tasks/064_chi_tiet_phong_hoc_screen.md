# [064] - Teacher - Chi tiết phòng học

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [064] |
| Module | Teacher |
| Screen | Chi tiết phòng học |
| Sprint | Sprint 3 |
| Label | Sprint3, Teacher, Frontend |
| Trello | https://trello.com/c/ld0CINX0 |
| Mockup | https://drive.google.com/file/d/1dkTLLBECBo96wrANJkrPsOsyKoCMzVur/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Hiển thị chi tiết một phòng học đang diễn ra: thông tin lớp học, đồng hồ đếm thời gian, danh sách học viên hiện diện, tài liệu và thông tin phòng.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/room/{id}`
- **Layout:** BasicLayout
- **Breadcrumb:** Phòng học > Chi tiết phòng học

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Phòng học                [Chỉnh sửa] [Báo bảo trì]   │
│           │                                                      │
│           ├──────────────────────────────────┬───────────────────┤
│           │  Tiếng Anh A2 - Cô Tối           │  Thông tin lớp học│
│           │  (Thứ 2, 4, 6)  [Đang diễn ra]   │  ─────────────── │
│           │                                  │  Phòng:  Phòng 01 │
│           │  Thời gian buổi học:             │  GV: Cô Ngọc      │
│           │  ┌─────────────────┐             │  Lớp: Starters 2A │
│           │  │  00:24:15       │             │  Sỹ số: 18/25     │
│           │  │  [Dừng lại]     │             │  Cấp độ: A2       │
│           │  └─────────────────┘             │                   │
│           │                                  │  Lịch học:        │
│           │  Danh sách học viên lớp học      │  T2, T4, T6       │
│           │  [Grid avatars]                  │  08:00 – 09:30    │
│           │  [a][a][a][a][a][a]              │                   │
│           │  [a][a][a][a][a][a]              │                   │
│           │  [a][a][a][a][a][a]              │                   │
│           │                                  │                   │
│           │  Tài liệu                        │                   │
│           │  📄 Giáo trình Unit 5.pdf        │                   │
│           │  📄 Flashcards.pdf               │                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 RoomHeader

**Hiển thị:**
- Tên lớp đang học trong phòng (Tiếng Anh A2 - Cô Tối)
- Lịch học (Thứ 2, 4, 6)
- Badge trạng thái: Đang diễn ra / Trống / Bảo trì
- Nút: `Chỉnh sửa` | `Báo bảo trì`

---

### 5.2 SessionTimer

**Đồng hồ đếm thời gian buổi học:**
- Hiển thị dạng `HH:MM:SS` (00:24:15)
- Đếm tiến (đếm lên từ khi bắt đầu buổi học)
- Nút `Dừng lại` (kết thúc buổi học sớm)

---

### 5.3 StudentAvatarGrid

**Danh sách học viên hiện diện:**
- Grid avatar (3–4 cột)
- Avatar + tên ngắn
- Badge điểm danh: ✓ Có mặt / ✗ Vắng / ⏱ Trễ

**Click avatar** → Popup nhanh thông tin học viên

---

### 5.4 RoomMaterialList

Danh sách tài liệu trong phòng học / buổi học hiện tại:
- Icon loại file + tên file
- Nút Download
- Nút Chia sẻ với HV

---

### 5.5 RoomInfoSidebar (Panel phải)

**Thông tin lớp học:**
- Tên phòng
- Tên giáo viên
- Tên lớp (link → `/classroom/{id}`)
- Sỹ số hiện tại / tối đa
- Cấp độ
- Lịch học (ngày + giờ)

---

## 6. API Integration

### 6.1 API Room Detail

**Endpoint:** `GET /api/teacher/rooms/{id}`

**Headers:**
```
Authorization: Bearer {access_token}
Device-code: {device_code}
Accept: application/json
```

**Response (200):**
```json
{
  "room": {
    "id": 1,
    "name": "Phòng 01",
    "floor": 1,
    "capacity": 25,
    "status": "in_use"
  },
  "current_session": {
    "class_name": "Tiếng Anh A2 - Cô Tối",
    "schedule_days": "Thứ 2, 4, 6",
    "teacher_name": "Cô Ngọc",
    "class_id": 10,
    "level": "A2",
    "start_time": "2025-05-20T08:00:00Z",
    "student_count": 18,
    "max_students": 25
  },
  "students": [
    {
      "id": 1,
      "name": "Minh An",
      "avatar": "https://...",
      "attendance": "present"
    }
  ],
  "materials": [
    { "id": 1, "name": "Giáo trình Unit 5.pdf", "url": "https://..." }
  ]
}
```

---

### 6.2 API End Session

**Endpoint:** `POST /api/teacher/rooms/{id}/end-session`

**Response (200):**
```json
{ "success": true, "ended_at": "2025-05-20T09:30:00Z" }
```

---

### 6.3 API Update Room

**Endpoint:** `PUT /api/teacher/rooms/{id}`

**Request body:**
```json
{
  "status": "maintenance",
  "note": "Máy chiếu hỏng"
}
```

---

## 7. State Management

```typescript
roomDetailStore.setRoom(room)
roomDetailStore.setCurrentSession(session)
roomDetailStore.setStudents(students)
roomDetailStore.setMaterials(materials)
roomDetailStore.setElapsedTime(seconds)
roomDetailStore.setTimerRunning(bool)
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load phòng đang có lớp | Hiển thị tên lớp + timer |
| 2 | Timer | Đếm tiến liên tục |
| 3 | Click "Dừng lại" | Confirm → kết thúc buổi |
| 4 | Grid học viên | Hiển thị đúng trạng thái điểm danh |
| 5 | Click avatar HV | Popup thông tin HV |
| 6 | Tải tài liệu | Download thành công |
| 7 | Phòng trống | Ẩn timer + session info |
| 8 | Báo bảo trì | Cập nhật status phòng |
