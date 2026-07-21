# [102] - Student - Thư viện hoạt hình

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [102] |
| Module | Student |
| Screen | Thư viện hoạt hình |
| Sprint | Sprint 5 |
| Label | Sprint5, Student, Frontend, API |
| Mockup Desktop | screen/desktop/thu vien hoat hinh.png |
| Mockup Mobile | screen/mobile/thu vien.png |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Thư viện video hoạt hình học tiếng Anh: tìm kiếm, lọc theo chủ đề/độ dài/độ phổ biến, xem danh sách video minh họa với thông tin lượt xem, thời lượng.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/library`
- **Layout:** StudentLayout
- **Breadcrumb:** Thư viện

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ [☰][🔄][🔍 Tìm kiếm video, bài học...]  [⭐1250][🔥12][Minh]│
│           │ Video hoạt hình                                       │
│           │ [Tất cả][Mới nhất][Phổ biến][Chủ đề▼][Độ dài▼] [Sắp xếp▼]│
│           │ ┌────────┐┌────────┐┌────────┐┌────────┐              │
│           │ │[thumb] ││[thumb] ││[thumb] ││[thumb] │              │
│           │ │05:20   ││04:35   ││03:15   ││04:50   │              │
│           │ │At the  ││My      ││Little  ││Wheels  │              │
│           │ │Park T1 ││Family  ││Bunny   ││on Bus  │              │
│           │ │12N lượt││18N lượt││8,2N    ││15N lượt│              │
│           │ └────────┘└────────┘└────────┘└────────┘              │
│           │  ... (3 hàng x 4 video)                                │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 SearchBar

- Ô tìm kiếm video/bài học/chủ đề, nút refresh gợi ý

### 5.2 FilterTabBar

- Tab: Tất cả / Mới nhất / Phổ biến
- Dropdown: Chủ đề, Độ dài
- Dropdown sắp xếp: Mới nhất / Xem nhiều nhất / Thời lượng

### 5.3 VideoCardGrid

- Lưới 4 cột video: thumbnail + nhãn thời lượng góc dưới phải, tên video, kênh "Hana Edu Kids" (kèm tick xác minh), số lượt xem + thời gian đăng, menu "..." (lưu/báo cáo)
- Click video → Navigate `/library/{id}`

### 5.4 UpgradePromptCard (Sidebar dưới)

- Gợi ý nâng cấp gói để mở khóa toàn bộ video, nút `Nâng cấp ngay`

---

## 6. API Integration

### 6.1 API Video List

**Endpoint:** `GET /api/student/library/videos`

**Query params:** `tab=all, topic=, duration=, sort=newest, search=, page=1, limit=20`

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "At the Park – Tập 1",
      "thumbnail": "https://...",
      "duration": "05:20",
      "channel": "Hana Edu Kids",
      "verified": true,
      "views": 12000,
      "published_at": "2026-07-19"
    }
  ],
  "meta": { "total": 48, "per_page": 20, "current_page": 1 }
}
```

---

### 6.2 API Search Suggestions

**Endpoint:** `GET /api/student/library/search-suggestions?q=park`

**Response (200):** `{ "data": ["At the Park", "Park animals"] }`

---

## 7. State Management

```typescript
libraryStore.setList(videos)
libraryStore.setFilter({ tab, topic, duration, sort, search })
libraryStore.setPage(page)
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị lưới video |
| 2 | Tìm kiếm theo tên | Trả về đúng kết quả |
| 3 | Lọc "Phổ biến" | Sắp xếp theo lượt xem giảm dần |
| 4 | Lọc theo chủ đề | Chỉ hiện video đúng chủ đề |
| 5 | Click video | Navigate `/library/{id}` |
| 6 | Cuộn trang / phân trang | Load thêm video |
| 7 | Video bị khóa (chưa nâng cấp) | Hiện icon khóa + nhắc nâng cấp |
