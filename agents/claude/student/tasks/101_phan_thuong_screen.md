# [101] - Student - Phần thưởng

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [101] |
| Module | Student |
| Screen | Phần thưởng |
| Sprint | Sprint 5 |
| Label | Sprint5, Student, Frontend, API |
| Mockup Desktop | screen/desktop/phan thuong.png |
| Mockup Mobile | screen/mobile/phan thuong.png |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Cho phép học viên dùng XP tích lũy để đổi phần thưởng: nhân vật, vật phẩm, thời gian học thêm và các phần thưởng đặc biệt khác.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/rewards`
- **Layout:** StudentLayout
- **Breadcrumb:** Phần thưởng

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Phần thưởng                     [⭐1250][🔔][Minh]    │
│           │ Cùng tích XP để đổi những phần thưởng thú vị nhé!    │
│           │ ┌──────────────────────────────┐  [🎁 quà minh họa]  │
│           │ │ Tiến trình tích XP: 1250/1800 │                    │
│           │ └──────────────────────────────┘                     │
│           │ [Đổi phần thưởng]  [Lịch sử nhận thưởng]              │
│           │ Danh mục: [Tất cả][Nhân vật][Vật phẩm][Thời gian][Khác]│
│           │ [Mèo Mimi 500XP][Balo 300XP][+30 phút 200XP][Khung ảnh250XP]│
│           │ [Hộp quà bí mật400][Huy hiệu Vàng600][Quái vật vui700][+1 ngày350]│
│           │ "Tiếp tục học tập và hoàn thành bài học để tích XP nhé!"│
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 XpProgressBanner

- Ảnh nhân vật, thanh tiến độ XP hiện có / mốc tiếp theo, hộp quà minh họa

### 5.2 ActionButtons

- `Đổi phần thưởng` (scroll tới danh sách / mở modal chọn nhanh)
- `Lịch sử nhận thưởng` → mở danh sách các phần thưởng đã đổi

### 5.3 RewardCategoryTabs

- Tất cả / Nhân vật / Vật phẩm / Thời gian / Khác

### 5.4 RewardCard (grid)

- Ảnh vật phẩm, tên, danh mục, giá XP, nút `Đổi ngay` (disable nếu không đủ XP)

### 5.5 RedeemConfirmModal

- Xác nhận đổi thưởng: tên vật phẩm, giá XP, XP còn lại sau khi đổi
- Nút `Xác nhận đổi`

### 5.6 RewardHistoryModal

- Danh sách phần thưởng đã đổi: tên, ngày đổi, số XP đã dùng

### 5.7 EmptyEncouragementBar

- Thông điệp khuyến khích tiếp tục học để tích thêm XP

---

## 6. API Integration

### 6.1 API Rewards Overview

**Endpoint:** `GET /api/student/rewards`

**Query params:** `category=all`

**Response (200):**
```json
{
  "xp_current": 1250,
  "xp_next_milestone": 1800,
  "data": [
    { "id": 1, "name": "Mèo Mimi", "category": "character", "cost_xp": 500, "image": "https://..." },
    { "id": 2, "name": "Balo sắc màu", "category": "item", "cost_xp": 300, "image": "https://..." }
  ]
}
```

---

### 6.2 API Redeem Reward

**Endpoint:** `POST /api/student/rewards/{id}/redeem`

**Response (200):**
```json
{ "success": true, "xp_remaining": 750, "reward_name": "Mèo Mimi" }
```

**Response (400) nếu không đủ XP:** `{ "error": "insufficient_xp", "required": 500, "current": 250 }`

---

### 6.3 API Redeem History

**Endpoint:** `GET /api/student/rewards/history`

**Response (200):**
```json
{ "data": [ { "id": 10, "reward_name": "Mèo Mimi", "cost_xp": 500, "redeemed_at": "2026-07-10" } ] }
```

---

## 7. State Management

```typescript
rewardStore.setXp(current, nextMilestone)
rewardStore.setList(rewards)
rewardStore.setCategory(category)
rewardStore.openRedeemConfirm(reward)
rewardStore.redeem(id)
rewardStore.openHistoryModal()
```

---

## 8. Validation

| Field | Rule | Thông báo |
|-------|------|-----------|
| redeem | XP hiện tại ≥ giá vật phẩm | "Bạn chưa đủ XP để đổi phần thưởng này" |

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị đúng XP hiện có + danh sách phần thưởng |
| 2 | Lọc theo danh mục | Chỉ hiện đúng nhóm phần thưởng |
| 3 | Đổi thưởng đủ XP | Trừ XP, thêm vào lịch sử, toast thành công |
| 4 | Đổi thưởng không đủ XP | Nút disabled hoặc hiện cảnh báo |
| 5 | Xem lịch sử nhận thưởng | Hiển thị đúng danh sách đã đổi |
| 6 | Thanh tiến độ XP | Cập nhật đúng theo mốc tiếp theo |
