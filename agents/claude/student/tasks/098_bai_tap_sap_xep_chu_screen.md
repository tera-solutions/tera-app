# [098] - Student - Bài tập sắp xếp chữ

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [098] |
| Module | Student |
| Screen | Bài tập sắp xếp chữ |
| Sprint | Sprint 5 |
| Label | Sprint5, Student, Frontend, API |
| Mockup Desktop | screen/desktop/bai tap sap xep chu.png |
| Mockup Mobile | screen/mobile/bai tap sap xep chu.png |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Bài tập ghép chữ cái thành từ đúng dựa theo hình minh họa: học viên kéo-thả từng chữ cái vào các ô trống theo đúng thứ tự.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/practice/word-order/{id}`
- **Layout:** StudentLayout
- **Breadcrumb:** Ôn luyện > Từ vựng > Bài tập sắp xếp chữ

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Practice > Word Order         [⭐1250][🔥12][🔔][Minh]│
│           │ [Avatar] Chủ đề: Animals ████░ 4/10   [⭐120XP]      │
│           │ Sắp xếp các chữ cái để tạo thành từ đúng               │
│           │ ┌──────────────────────────────┐  💡 Gợi ý làm bài    │
│           │ │       [Ảnh con voi]           │  - Nghe từ ghi nhớ  │
│           │ └──────────────────────────────┘  - Sắp xếp đúng thứ  │
│           │ [ _ ][ _ ][ _ ][ _ ][ _ ][ _ ]      tự                │
│           │  (ô trống kéo thả)                - Kiểm tra lại từ   │
│           │ [e][l][e][p][h][a][n][t] (xáo trộn) Tiến độ học tập   │
│           │ 💡 Gợi ý: Đây là loài vật to...[🔊 Nghe từ] [5 thanh %]│
│           │ [Làm lại]              [Kiểm tra]  Thành tích hôm nay │
│           │ [← Bài trước][💡 Gợi ý(2)][Bài tiếp theo →]           │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 ExerciseHeader

- Chủ đề, progress x/10, XP thưởng

### 5.2 PromptImage

- Ảnh minh họa từ cần ghép

### 5.3 LetterSlotRow

- Dãy ô trống theo đúng số ký tự của từ đích, hỗ trợ thả chữ cái vào

### 5.4 LetterTileBank

- Các thẻ chữ cái xáo trộn (bao gồm chữ nhiễu nếu có) để kéo vào ô trống
- Click/kéo thẻ đã đặt để rút lại về bank

### 5.5 HintText + AudioButton

- Gợi ý mô tả từ, nút "Nghe từ" phát âm từ đích

### 5.6 ActionBar

- `Làm lại`, `Kiểm tra`

### 5.7 TipsPanel (Panel phải trên)

- Gợi ý làm bài dạng checklist

### 5.8 SkillProgressBars (Panel phải giữa)

- 5 thanh kỹ năng: Từ vựng, Nghe, Nói, Đọc, Viết

### 5.9 TodayAchievementCard (Panel phải dưới)

- XP, streak, huy hiệu, phút học

### 5.10 NavigationBar

- Bài trước / Gợi ý / Bài tiếp theo

---

## 6. API Integration

### 6.1 API Word Order Exercise Detail

**Endpoint:** `GET /api/student/practice/word-order/{id}`

**Response (200):**
```json
{
  "topic": "Animals",
  "position": 4,
  "total": 10,
  "xp": 120,
  "image": "https://...",
  "target_word": "elephant",
  "letters": ["e","l","e","p","h","a","n","t"],
  "hint": "Đây là một loài vật rất to, có vòi dài.",
  "audio_url": "https://..."
}
```

---

### 6.2 API Submit Answer

**Endpoint:** `POST /api/student/practice/word-order/{id}/submit`

**Request body:** `{ "answer": "elephant" }`

**Response (200):** `{ "correct": true, "xp_earned": 10 }`

---

## 7. State Management

```typescript
wordOrderStore.setData(exercise)
wordOrderStore.setSlots(letters)
wordOrderStore.placeLetter(tileId, slotIndex)
wordOrderStore.removeLetter(slotIndex)
wordOrderStore.resetSlots()
wordOrderStore.setResult(result)
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load bài | Hiển thị ô trống đúng số ký tự + chữ cái xáo trộn |
| 2 | Kéo chữ vào ô | Chữ hiển thị trong ô, biến mất khỏi bank |
| 3 | Rút chữ khỏi ô | Trả lại chữ vào bank |
| 4 | Điền đúng từ + Kiểm tra | Thông báo đúng, +XP |
| 5 | Điền sai từ + Kiểm tra | Thông báo sai, cho sửa lại |
| 6 | Nghe từ | Phát âm đúng từ đích |
| 7 | Làm lại | Xóa toàn bộ ô đã điền |
