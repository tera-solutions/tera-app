# [097] - Student - Bài tập nối từ

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [097] |
| Module | Student |
| Screen | Bài tập nối từ |
| Sprint | Sprint 5 |
| Label | Sprint5, Student, Frontend, API |
| Mockup Desktop | screen/desktop/bai tap noi tu.png |
| Mockup Mobile | screen/mobile/bai tap noi tu.png |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Bài tập nối từ vựng với hình ảnh tương ứng bằng kéo-thả (drag-to-connect), giúp củng cố khả năng nhận diện từ vựng theo chủ đề.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/practice/word-match/{id}`
- **Layout:** StudentLayout
- **Breadcrumb:** Ôn luyện > Từ vựng > Bài tập nối từ

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ ← Bài tập nối từ                  [🔔][👤 Minh]      │
│           │ [Avatar] Chủ đề: Food ████░ 5/10   [⭐150XP]         │
│           │ Nối từ với hình phù hợp                               │
│           │ [apple  ●───────●[🍞 bread]]        💡 Gợi ý          │
│           │ [banana ●        ●[🍎 apple]]        - Đọc từ thật kỹ │
│           │ [milk   ●        ●[🍼 milk]]         - Nhìn hình nhớ  │
│           │ [bread  ●        ●[🍌 banana]]       - Kéo thả chính  │
│           │ [egg    ●        ●[🍳 egg]]           xác             │
│           │ 💡 Gợi ý: Đọc từ và nhìn hình để nối [🔊 Đọc lại từ]  │
│           │ [Làm lại]              [Kiểm tra]                     │
│           │ [← Bài trước][💡 Gợi ý(2)][Bài tiếp theo →]           │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 ExerciseHeader

- Chủ đề, progress x/10, XP thưởng

### 5.2 MatchingBoard

- 2 cột: cột trái là danh sách từ (text, có màu viền riêng biệt), cột phải là danh sách hình ảnh tương ứng (thứ tự xáo trộn)
- Kéo từ điểm nối bên trái sang điểm nối bên phải để tạo đường nối; đường nối tô màu theo cặp từ
- Có thể nối lại (kéo từ điểm khác để thay thế)

### 5.3 ActionBar

- `Làm lại` (xóa toàn bộ đường nối), `Kiểm tra` (chấm điểm khi đã nối đủ)

### 5.4 HintPanel (Panel phải trên)

- Gợi ý cách chơi, nút "Đọc lại từ" (phát âm toàn bộ danh sách từ)

### 5.5 LearningProgressPanel

- 5 thanh kỹ năng: Từ vựng, Nghe, Nói, Đọc, Viết

### 5.6 TodayAchievementCard

- XP, ngày streak, huy hiệu, phút học hôm nay

### 5.7 NavigationBar

- Bài trước / Gợi ý / Bài tiếp theo

---

## 6. API Integration

### 6.1 API Word Match Exercise Detail

**Endpoint:** `GET /api/student/practice/word-match/{id}`

**Response (200):**
```json
{
  "topic": "Food",
  "position": 5,
  "total": 10,
  "xp": 150,
  "pairs": [
    { "id": 1, "word": "apple", "image": "apple.png" },
    { "id": 2, "word": "banana", "image": "banana.png" }
  ]
}
```

---

### 6.2 API Submit Matches

**Endpoint:** `POST /api/student/practice/word-match/{id}/submit`

**Request body:**
```json
{ "matches": [ { "word_id": 1, "image_id": 1 }, { "word_id": 2, "image_id": 2 } ] }
```

**Response (200):**
```json
{ "correct_count": 4, "total": 5, "xp_earned": 150, "wrong_pairs": [3] }
```

---

## 7. State Management

```typescript
wordMatchStore.setPairs(pairs)
wordMatchStore.setConnections(connections)
wordMatchStore.addConnection(wordId, imageId)
wordMatchStore.resetConnections()
wordMatchStore.setResult(result)
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load bài | Hiển thị 2 cột từ/hình chưa nối |
| 2 | Kéo nối đúng cặp | Đường nối hiện màu, giữ trạng thái |
| 3 | Nối lại một từ khác điểm | Đường nối cũ bị xóa, thay bằng mới |
| 4 | Kiểm tra khi nối đủ | Chấm điểm, hiện cặp đúng/sai |
| 5 | Làm lại | Xóa toàn bộ đường nối |
| 6 | Đọc lại từ | Phát âm lần lượt các từ |
| 7 | Hoàn thành bài | Ghi nhận XP, điều hướng bài tiếp theo |
