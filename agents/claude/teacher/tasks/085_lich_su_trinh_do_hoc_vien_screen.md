# [085] - Teacher - Lịch sử trình độ học viên

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [085] |
| Module | Teacher |
| Screen | Lịch sử trình độ học viên |
| Sprint | Sprint 5 |
| Label | Sprint5, Teacher, Frontend, API |
| Mockup | Không có |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Tab bổ sung trong màn hình Chi tiết học viên (040), hiển thị lịch sử thay đổi trình độ của học viên theo thời gian: ngày lên trình độ, lý do/căn cứ (bài kiểm tra, đánh giá giáo viên), người thực hiện.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/student/{id}?tab=level-history`
- **Layout:** BasicLayout
- **Breadcrumb:** Học viên > Chi tiết học viên > Lịch sử trình độ

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Nguyễn Minh An                                       │
│           │ [Tổng quan][Giám hộ][Bài KT][Lịch sử trình độ ●]     │
│           │                                                      │
│           │ Trình độ hiện tại: Movers            [+ Cập nhật]    │
│           │                                                      │
│           │ ┌──────────────────────────────────────────────┐    │
│           │ │ ● 15/07/2026  Starters → Movers               │    │
│           │ │   Căn cứ: Bài kiểm tra cuối khóa (9.2/10)     │    │
│           │ │   Người duyệt: Trần Văn A                     │    │
│           │ ├──────────────────────────────────────────────┤    │
│           │ │ ● 10/01/2026  Mới ghi danh → Starters         │    │
│           │ │   Căn cứ: Đánh giá đầu vào                    │    │
│           │ │   Người duyệt: Lê Thị B                       │    │
│           │ └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 CurrentLevelBar

- Hiển thị trình độ hiện tại của học viên (lấy từ danh sách trình độ dùng chung — task 077)
- Nút `+ Cập nhật` → mở form ghi nhận lên/xuống trình độ

### 5.2 LevelHistoryTimeline

- Danh sách các lần thay đổi trình độ theo thời gian giảm dần
- Mỗi mục: ngày thay đổi, trình độ cũ → trình độ mới, căn cứ (liên kết tới bài kiểm tra nếu có), người duyệt

### 5.3 UpdateLevelModal

| Field | Label | Type | Required |
|-------|-------|------|----------|
| new_level_id | Trình độ mới | select (danh sách trình độ toàn business) | ✓ |
| reason_type | Căn cứ | select (Bài kiểm tra / Đánh giá giáo viên / Khác) | ✓ |
| linked_exam_id | Liên kết bài kiểm tra | select (nếu reason_type = bài kiểm tra) | — |
| note | Ghi chú | textarea | — |

---

## 6. API Integration

### 6.1 API Level History

**Endpoint:** `GET /api/teacher/students/{id}/level-history`

**Response (200):**
```json
{
  "current_level": { "id": 2, "name": "Movers" },
  "history": [
    {
      "id": 1,
      "from_level": "Starters",
      "to_level": "Movers",
      "reason_type": "exam",
      "linked_exam": { "id": 12, "name": "Bài kiểm tra cuối khóa", "score": 9.2 },
      "approved_by": "Trần Văn A",
      "changed_at": "2026-07-15"
    },
    {
      "id": 2,
      "from_level": null,
      "to_level": "Starters",
      "reason_type": "placement",
      "approved_by": "Lê Thị B",
      "changed_at": "2026-01-10"
    }
  ]
}
```

---

### 6.2 API Update Level

**Endpoint:** `POST /api/teacher/students/{id}/level-history`

**Request body:**
```json
{ "new_level_id": 3, "reason_type": "exam", "linked_exam_id": 15, "note": "" }
```

**Response (201):** `{ "id": 3, "to_level": "Flyers" }`

---

## 7. State Management

```typescript
studentDetailStore.setLevelHistory(history)
studentDetailStore.setCurrentLevel(level)
studentDetailStore.openUpdateLevelModal()
```

---

## 8. Validation

| Field | Rule | Thông báo |
|-------|------|-----------|
| new_level_id | required, khác trình độ hiện tại | "Vui lòng chọn trình độ mới khác trình độ hiện tại" |
| reason_type | required | "Vui lòng chọn căn cứ thay đổi" |
| linked_exam_id | required nếu reason_type = exam | "Vui lòng chọn bài kiểm tra liên quan" |

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load tab | Hiển thị trình độ hiện tại + timeline |
| 2 | Cập nhật trình độ mới | Thêm mục mới vào timeline, cập nhật trình độ hiện tại |
| 3 | Chọn căn cứ "Bài kiểm tra" | Bắt buộc chọn bài kiểm tra liên kết |
| 4 | Click bài kiểm tra liên kết | Navigate sang chi tiết bài kiểm tra |
| 5 | Học viên chưa có lịch sử | Hiển thị timeline rỗng với trạng thái "Chưa có lịch sử" |
| 6 | Chọn trình độ trùng hiện tại | Validation error |
