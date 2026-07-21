# [095] - Student - Bài tập luyện nói

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [095] |
| Module | Student |
| Screen | Bài tập luyện nói |
| Sprint | Sprint 5 |
| Label | Sprint5, Student, Frontend, API |
| Mockup Desktop | screen/desktop/bai tap luyen noi.png |
| Mockup Mobile | screen/mobile/bai tap luyen noi.png |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Bài tập luyện phát âm/nói: học viên nhìn tranh, nghe câu mẫu và ghi âm câu trả lời của mình để hệ thống chấm điểm phát âm.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập, cấp quyền micro
- **Route:** `/practice/speaking/{id}`
- **Layout:** StudentLayout
- **Breadcrumb:** Ôn luyện > Nói theo > Bài tập luyện nói

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ ← Bài tập luyện nói               [🔔][👤 Minh]      │
│           │ [Avatar 🔊] Chủ đề: Animals ███░ 4/10  [⭐120XP]     │
│           │ Nhìn tranh và nói câu                                 │
│           │ ┌──────────────────────────────┐  💡 Gợi ý           │
│           │ │       [Ảnh con chó]           │  - Nói to, rõ ràng  │
│           │ └──────────────────────────────┘  - 10 giây để trả lời│
│           │ Ví dụ câu trả lời 🔊 "It's a dog."                    │
│           │  ((  🎙  )) 00:00 / 00:10                              │
│           │ Nhấn nút và bắt đầu nói                                │
│           │ [▶ Nghe lại câu của bạn]      [Kiểm tra] (disabled)   │
│           │                              Tiến độ luyện nói         │
│           │                              [Bài][XP][Độ chính xác]  │
│           │                              Mẹo luyện nói (checklist)│
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 ExerciseHeader

- Avatar phát âm chủ đề, progress x/10, XP thưởng

### 5.2 SpeakingPromptImage

- Ảnh minh họa đối tượng cần mô tả

### 5.3 SampleAnswerCard

- Câu trả lời mẫu + nút phát âm mẫu

### 5.4 RecordButton

- Nút mic lớn giữa, waveform 2 bên, đồng hồ đếm 00:00/00:10
- Nhấn giữ hoặc nhấn để bắt đầu/dừng ghi âm

### 5.5 PlaybackBar

- `Nghe lại câu của bạn` (phát lại bản ghi âm)
- `Kiểm tra` → gửi bản ghi âm lên server để chấm điểm (disable đến khi có bản ghi âm)

### 5.6 HintPanel (Panel phải trên)

- Gợi ý thời gian trả lời, cách nói

### 5.7 SpeakingProgressStats (Panel phải giữa)

- Bài đã hoàn thành, XP, độ chính xác phát âm

### 5.8 SpeakingTipsCard (Panel phải dưới)

- Checklist mẹo luyện nói

---

## 6. API Integration

### 6.1 API Speaking Exercise Detail

**Endpoint:** `GET /api/student/practice/speaking/{id}`

**Response (200):**
```json
{
  "topic": "Animals",
  "position": 4,
  "total": 10,
  "xp": 120,
  "image": "https://...",
  "sample_answer": { "text": "It's a dog.", "audio_url": "https://..." },
  "max_seconds": 10
}
```

---

### 6.2 API Submit Recording

**Endpoint:** `POST /api/student/practice/speaking/{id}/submit` (multipart/form-data)

**Request body:** `audio_file`, `duration_seconds`

**Response (200):**
```json
{ "accuracy": 85, "xp_earned": 15, "feedback": "Phát âm tốt! Chú ý âm cuối /g/." }
```

---

## 7. State Management

```typescript
speakingExerciseStore.setData(exercise)
speakingExerciseStore.setRecordingState('idle' | 'recording' | 'recorded')
speakingExerciseStore.setAudioBlob(blob)
speakingExerciseStore.setResult(result)
```

---

## 8. Validation

| Field | Rule | Thông báo |
|-------|------|-----------|
| microphone permission | required | "Vui lòng cho phép truy cập micro để luyện nói" |
| audio_file | phải ghi âm trước khi kiểm tra | Nút "Kiểm tra" disabled đến khi có bản ghi |
| duration | tối đa 10 giây | Tự động dừng ghi âm khi hết thời gian |

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load bài | Hiển thị ảnh + câu mẫu + nút mic |
| 2 | Nhấn mic ghi âm | Bắt đầu đếm giờ, hiện waveform |
| 3 | Ghi âm quá 10s | Tự động dừng |
| 4 | Nghe lại bản ghi | Phát đúng bản ghi vừa thu |
| 5 | Kiểm tra | Gửi bản ghi, nhận điểm phát âm + feedback |
| 6 | Chưa cấp quyền micro | Hiện thông báo yêu cầu cấp quyền |
| 7 | Không ghi âm mà bấm Kiểm tra | Nút disabled, không gửi được |
