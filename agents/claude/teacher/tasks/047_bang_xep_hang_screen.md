# [047] - Teacher - Bảng xếp hạng học tập

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [047] |
| Module | Teacher |
| Screen | Bảng xếp hạng học tập |
| Sprint | Sprint 3 |
| Label | Sprint3, Teacher, Frontend |
| Trello | https://trello.com/c/61FPDlU4 |
| Mockup | https://drive.google.com/file/d/1Bs_ZnFBAv0SYfldLVWO2SjBhi4YNzzD-/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Hiển thị bảng xếp hạng học tập của học viên theo điểm số, chuyên cần và tiến bộ. Hỗ trợ nhiều chế độ xem và lọc theo thời gian, nhóm.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/ranking`
- **Layout:** BasicLayout
- **Breadcrumb:** Trang chủ > Bảng xếp hạng

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Bảng xếp hạng học tập                                │
│           │                                                      │
│           │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐               │
│           │ │  44  │ │ 8.25 │ │  26  │ │ 0.75 │               │
│           │ │  HV  │ │ ĐTB  │ │ Lớp  │ │Điểm  │               │
│           │ │      │ │      │ │      │ │ danh │               │
│           │ └──────┘ └──────┘ └──────┘ └──────┘               │
│           │                                                      │
│           │ [Bảng tổng hợp][Tiến lớp][Chọn nhóm][Đánh giá]     │
│           │                                                      │
│           ├─────────────────────────────┬────────────────────────┤
│           │  Bảng xếp hạng              │  Top 3                 │
│           │ ┌────────────────────────┐  │  🥇 Minh An - 9.8     │
│           │ │#│Ảnh│Tên│Trường│Điểm  │  │  🥈 Lan Anh - 9.5     │
│           │ │ │   │   │      │TB│KQ│  │  🥉 Tuấn   - 9.2     │
│           │ ├────────────────────────┤  │                       │
│           │ │1│[a]│Minh│SG   │9.8│★ │  │  Thống kê điểm        │
│           │ │2│[a]│Lan │HCM  │9.5│★ │  │  [Histogram]          │
│           │ │3│[a]│Tuấn│HN   │9.2│  │  │                       │
│           │ │4│[a]│Hoa │HCM  │8.8│  │  │  Lọc tháng: [▼]       │
│           │ └────────────────────────┘  │                       │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 RankingStatRow (×4)

| Card | Giá trị |
|------|---------|
| Tổng HV | 44 học sinh tham gia xếp hạng |
| Điểm TB | Điểm trung bình chung (8.25) |
| Tổng lớp | Số lớp tham gia (26) |
| Điểm danh TB | Điểm chuyên cần trung bình (0.75) |

---

### 5.2 RankingTabNav

**Tabs:**
- Bảng tổng hợp
- Tiến lớp
- Chọn nhóm
- Đánh giá

---

### 5.3 RankingTable (Tab: Bảng tổng hợp)

**Columns:**
- Hạng (#)
- Avatar
- Tên học viên
- Trường
- Điểm số
- Tổng kết
- Điểm danh
- Tiến bộ (sparkline mini chart)
- Xếp loại (badge: Xuất sắc / Giỏi / Khá / TB)

**Features:**
- Top 3 được highlight đặc biệt (vàng/bạc/đồng)
- Infinite scroll hoặc pagination

---

### 5.4 Top3Cards (Panel phải - trên)

- 3 card đặc biệt cho top 1, 2, 3
- Hiển thị: avatar lớn, tên, điểm số, huy hiệu vị trí

---

### 5.5 ScoreHistogram (Panel phải - giữa)

- Bar chart phân bố điểm
- Trục X: Dải điểm (0–4, 5–6, 7–8, 9–10)
- Trục Y: Số học viên

---

### 5.6 MonthFilter (Panel phải - dưới)

- Dropdown lọc theo tháng
- Cập nhật toàn bộ bảng xếp hạng khi thay đổi

---

### 5.7 Tab: Tiến lớp

- Bảng thể hiện học viên tiến bộ nhiều nhất so với kỳ trước
- Cột: Tên, Điểm kỳ trước, Điểm kỳ này, % tăng

---

### 5.8 Tab: Chọn nhóm

- Cho phép GV tạo nhóm so sánh tùy chỉnh
- Chọn học viên vào nhóm → xem bảng xếp hạng nhóm

---

## 6. API Integration

### 6.1 API Ranking List

**Endpoint:** `GET /api/teacher/ranking`

**Headers:**
```
Authorization: Bearer {access_token}
Device-code: {device_code}
Accept: application/json
```

**Query params:**
```
month=2025-05
tab=overall    # overall | progress | group | evaluation
page=1
limit=50
```

**Response (200):**
```json
{
  "summary": {
    "total_students": 44,
    "avg_score": 8.25,
    "total_classes": 26,
    "avg_attendance": 0.75
  },
  "top3": [
    { "rank": 1, "name": "Nguyễn Minh An", "score": 9.8, "avatar": "https://..." },
    { "rank": 2, "name": "Lan Anh", "score": 9.5, "avatar": "https://..." },
    { "rank": 3, "name": "Tuấn", "score": 9.2, "avatar": "https://..." }
  ],
  "data": [
    {
      "rank": 1,
      "student_id": 1,
      "name": "Nguyễn Minh An",
      "avatar": "https://...",
      "school": "THCS SG",
      "score": 9.8,
      "total_grade": "A",
      "attendance": 100,
      "progress": [8.5, 9.0, 9.5, 9.8],
      "rank_label": "Xuất sắc"
    }
  ],
  "score_distribution": { "0_4": 0, "5_6": 3, "7_8": 20, "9_10": 21 },
  "meta": { "total": 44 }
}
```

---

## 7. State Management

```typescript
rankingStore.setSummary(summary)
rankingStore.setTop3(top3)
rankingStore.setData(data)
rankingStore.setDistribution(distribution)
rankingStore.setActiveTab(tab)
rankingStore.setMonth(month)
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị bảng xếp hạng + stats |
| 2 | Top 3 cards | Render 3 card highlight |
| 3 | Sparkline tiến bộ | Mini chart đúng từng HV |
| 4 | Đổi tháng filter | Bảng cập nhật đúng |
| 5 | Click tab "Tiến lớp" | Hiển thị HV tiến bộ nhiều nhất |
| 6 | Histogram | Render phân bố điểm đúng |
| 7 | Scroll infinite | Load thêm data |
| 8 | Badge xếp loại | Đúng màu theo loại |
