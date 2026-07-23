# [094] - Student - Bài tập luyện nghe

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [094] |
| Module | Student |
| Screen | Bài tập luyện nghe |
| Sprint | Sprint 5 |
| Label | Sprint5, Student, Frontend, API |
| Mockup Desktop | screen/desktop/bai tap luyen nghe.png |
| Mockup Mobile | screen/mobile/bai tap luyen nghe.png |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Bài tập trắc nghiệm luyện nghe: học viên nghe đoạn âm thanh/hội thoại ngắn kèm hình minh họa và chọn đáp án đúng trong 4 lựa chọn.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/practice/listening-choice/{id}`
- **Layout:** StudentLayout
- **Breadcrumb:** Ôn luyện > Nghe hiểu > Bài tập luyện nghe

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ ← Bài tập luyện nghe             [🔔][👤 Minh]       │
│           │ [Avatar] Chủ đề: Animals  ███░ 4/10  [⭐120XP]       │
│           │ Nghe và chọn đáp án đúng                              │
│           │ ┌──────────────────────────────┐  💡 Gợi ý (3)        │
│           │ │      [Ảnh minh họa]           │  Mẹo luyện nghe:    │
│           │ └──────────────────────────────┘  - Nghe toàn bộ trước│
│           │        ((  🔊  )) 1/2               - Chú ý từ khóa   │
│           │        Nhấn để nghe đoạn hội thoại   - Loại bỏ sai    │
│           │ ○ It's a dog.                        - Nghe lại nếu cần│
│           │ ○ It's a cat.                       Tiến độ luyện nghe │
│           │ ● It's an elephant. ✓                [Bài][XP][Độ CX] │
│           │ ○ It's a lion.                                        │
│           │ [💡 Gợi ý][🔄 Nghe lại][⏭ Bỏ qua]                     │
│           │ [← Bài trước]              [Bài tiếp theo →]           │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 ExerciseHeader

- Chủ đề, progress x/10, XP thưởng

### 5.2 AudioSceneImage

- Ảnh minh họa tình huống nghe

### 5.3 AudioPlayerButton

- Nút loa lớn giữa, đếm số lần đã nghe (1/2), waveform 2 bên khi phát

### 5.4 AnswerOptionList

- 4 đáp án dạng radio, mỗi đáp án kèm icon minh họa
- Đáp án đúng: viền xanh + dấu tick khi đã chọn đúng

### 5.5 ActionBar

- `Gợi ý` (kèm số lượt còn lại), `Nghe lại`, `Bỏ qua`

### 5.6 HintPanel (Panel phải trên)

- Gợi ý ngắn

### 5.7 ListeningTipsCard (Panel phải giữa)

- 4 mẹo luyện nghe dạng checklist

### 5.8 ListeningProgressStats (Panel phải dưới)

- Bài đã hoàn thành (x/10), Điểm XP, Độ chính xác %

---

## 6. API Integration

### 6.1 API Listening Exercise Detail

**Endpoint:** `GET /api/student/practice/listening-choice/{id}`

**Response (200):**
```json
{
  "topic": "Animals",
  "position": 4,
  "total": 10,
  "xp": 120,
  "image": "https://...",
  "audio_url": "https://...",
  "max_plays": 2,
  "options": [
    { "id": 1, "label": "It's a dog." },
    { "id": 2, "label": "It's an elephant." }
  ]
}
```

---

### 6.2 API Submit Answer

**Endpoint:** `POST /api/student/practice/listening-choice/{id}/answer`

**Request body:** `{ "option_id": 2, "plays_used": 1 }`

**Response (200):** `{ "correct": true, "xp_earned": 10, "accuracy": 80 }`

---

## 7. State Management

```typescript
listeningExerciseStore.setData(exercise)
listeningExerciseStore.setPlaysUsed(count)
listeningExerciseStore.setSelectedOption(id)
listeningExerciseStore.setResult(result)
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load bài | Hiển thị ảnh + nút nghe + 4 đáp án |
| 2 | Click nút nghe | Phát audio, tăng đếm số lần nghe |
| 3 | Nghe vượt quá max_plays | Nút nghe bị vô hiệu hoặc cảnh báo |
| 4 | Chọn đáp án đúng | Viền xanh, cập nhật độ chính xác |
| 5 | Dùng gợi ý | Giảm số lượt gợi ý |
| 6 | Bỏ qua | Chuyển bài tiếp theo, không tính điểm |
| 7 | Hoàn thành bài | Ghi nhận XP, cập nhật tiến độ luyện nghe |
