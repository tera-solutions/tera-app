# [103] - Student - Xem hoạt hình phóng to

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [103] |
| Module | Student |
| Screen | Xem hoạt hình phóng to |
| Sprint | Sprint 5 |
| Label | Sprint5, Student, Frontend, API |
| Mockup Desktop | screen/desktop/xem hoat hinh phong to.png |
| Mockup Mobile | screen/mobile/xem video hoat hinh.png, screen/mobile/xem hoat hinh phong to.png |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Trang phát video hoạt hình chi tiết dạng "theo dõi" (giống Youtube): player lớn có công cụ vẽ/ghi chú, phụ đề song ngữ đồng bộ, từ vựng trong video, bình luận và video liên quan.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/library/{id}`
- **Layout:** StudentLayout
- **Breadcrumb:** Thư viện > {Tên series} > {Tên tập}

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ [🔍 Tìm kiếm...]                [⭐1250][🔥12][🔔][Minh]│
│           │ Thư viện > At the Park > Tập 1                        │
│           │ At the Park – Tập 1                                   │
│           │ [Bút vẽ][Màu▼][Text][Hình khối][Xóa][Hoàn tác][Lưu]  │
│           │ ┌──────────────────────────────┐  [Phụ đề][Từ vựng]  │
│           │ │        [Video player]         │  [EN][VI]           │
│           │ │  01:25/05:20  ⚙ ⛶            │  01:20 Hi I'm Tom... │
│           │ └──────────────────────────────┘  01:25 We are at...  │
│           │ [Học tập][Bài tập][Từ vựng][Highlight][⏱][1.0x]       │
│           │ Hana Edu Kids ✓ 128K người đăng ký  [👍2.4K][👎][Chia sẻ]│
│           │ Mô tả video + hashtag                Danh sách phát   │
│           │ Bình luận (127) [Viết bình luận...]  [6 video series] │
│           │                                       Video liên quan  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 VideoToolbar

- Công cụ vẽ/ghi chú lên video (dành cho giáo viên/phụ huynh hỗ trợ bé): Bút vẽ, Màu, Text, Hình khối, Xóa, Hoàn tác, Làm lại, Lưu

### 5.2 VideoPlayer

- Player chính: play/pause, thanh thời gian, âm lượng, cài đặt tốc độ, toàn màn hình
- Thanh công cụ dưới player: Học tập, Bài tập, Từ vựng, Highlight (bật/tắt), tốc độ phát (1.0x)

### 5.3 VideoInfoPanel

- Tiêu đề video, kênh (tên + tick xác minh + số người đăng ký)
- Like/Dislike, Chia sẻ, Lưu, menu thêm
- Lượt xem, ngày đăng, hashtag
- Mô tả video (thu gọn/mở rộng "Hiển thị thêm")

### 5.4 CommentSection

- Ô viết bình luận, sắp xếp (Mới nhất/...)
- Danh sách bình luận: avatar, tên, thời gian, nội dung, like, trả lời

### 5.5 SubtitleVocabPanel (Panel phải trên)

- Tab "Phụ đề" / "Từ vựng (n)" / "Ghi chú"
- Chuyển đổi hiển thị EN/VI
- Danh sách câu phụ đề đồng bộ theo thời gian video, click câu → tua video tới đó

### 5.6 PlaylistPanel (Panel phải giữa)

- Danh sách các tập trong cùng series: thumbnail, thời lượng, tên tập, tập đang phát được highlight
- Click tập khác → chuyển video

### 5.7 RelatedVideoGrid (Panel phải dưới)

- Danh sách video liên quan: thumbnail, tên, số lượt xem

---

## 6. API Integration

### 6.1 API Video Detail

**Endpoint:** `GET /api/student/library/videos/{id}`

**Response (200):**
```json
{
  "id": 1,
  "title": "At the Park – Tập 1",
  "video_url": "https://...",
  "duration": "05:20",
  "channel": { "name": "Hana Edu Kids", "verified": true, "subscribers": 128000 },
  "likes": 2400,
  "views": 12540,
  "published_at": "2026-07-19",
  "description": "Cùng Tom và chú chó Lucky khám phá công viên...",
  "hashtags": ["AtThePark", "HanaEdu", "LearnEnglish"]
}
```

---

### 6.2 API Subtitles & Vocabulary

**Endpoint:** `GET /api/student/library/videos/{id}/subtitles`

**Response (200):**
```json
{
  "subtitles": [ { "time": "01:20", "en": "Hi! I'm Tom. This is my dog, Lucky!", "vi": "Xin chào! Tớ là Tom..." } ],
  "vocabulary": [ { "word": "park", "meaning": "công viên" } ]
}
```

---

### 6.3 API Playlist

**Endpoint:** `GET /api/student/library/series/{seriesId}/episodes`

**Response (200):**
```json
{ "data": [ { "id": 1, "title": "At the Park – Tập 1", "duration": "05:20", "current": true } ] }
```

---

### 6.4 API Comments

**Endpoint:** `GET /api/student/library/videos/{id}/comments` / `POST /api/student/library/videos/{id}/comments`

**POST Request body:** `{ "content": "Video rất hay!" }`

**Response (201):** `{ "id": 200, "content": "Video rất hay!", "created_at": "2026-07-21T10:00:00Z" }`

---

### 6.5 API Like/Save Video

**Endpoint:** `POST /api/student/library/videos/{id}/like` , `POST /api/student/library/videos/{id}/save`

**Response (200):** `{ "success": true }`

---

## 7. State Management

```typescript
videoDetailStore.setVideo(video)
videoDetailStore.setSubtitles(subtitles)
videoDetailStore.setVocabulary(vocab)
videoDetailStore.setPlaylist(episodes)
videoDetailStore.setComments(comments)
videoDetailStore.setSubtitleLang('en' | 'vi')
videoDetailStore.setPlaybackRate(rate)
```

---

## 8. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Video + phụ đề + playlist hiển thị đúng |
| 2 | Click câu phụ đề | Video tua tới đúng thời điểm |
| 3 | Chuyển tab Từ vựng | Hiện danh sách từ vựng trong video |
| 4 | Click tập khác trong playlist | Chuyển sang video tập đó |
| 5 | Viết bình luận | Bình luận mới xuất hiện đầu danh sách |
| 6 | Like video | Số like tăng, icon đổi trạng thái |
| 7 | Đổi tốc độ phát | Video phát đúng tốc độ đã chọn |
| 8 | Dùng công cụ vẽ | Có thể vẽ/ghi chú lên khung video và lưu lại |
