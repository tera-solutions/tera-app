# Hana AI Content Service — API Reference

> Tài liệu này mô tả các endpoint **đã thực sự triển khai trong code** (khác với bản thiết kế tổng quan ở [structure.md](structure.md), mục 16, vốn mô tả API ở mức ý tưởng và không hoàn toàn khớp với hiện trạng).
>
> Base URL local: `http://localhost:8000`

---

## 1. Tổng quan routing

- App: `FastAPI(title="Hana AI Content Service", version="1.0")` — khai báo ở `app/main.py`.
- Router gốc: `app/api/router.py`.
  - `GET /health` — **không** có prefix `/api/v1`.
  - Tất cả các domain còn lại được mount dưới `v1_router = APIRouter(prefix="/api/v1")`.
- **Không có middleware xác thực (auth) nào** trên các endpoint — không API key, không OAuth2, không Authorization header bắt buộc. Biến `LEONARDO_API_KEY`/tương tự trong `app/config/settings.py` chỉ dùng để gọi ra ngoài (outbound) tới AI provider, không liên quan tới việc bảo vệ API này.
- Không có versioning theo tag ngoài `/api/v1` trong path.

### Trạng thái triển khai theo domain

| Domain | Base path | Trạng thái |
|---|---|---|
| Health | `/health` | ✅ Hoạt động |
| Image | `/api/v1/image` | ✅ Hoạt động đầy đủ |
| Vocabulary | `/api/v1/vocabulary` | ✅ Hoạt động đầy đủ |
| Job | `/api/v1/jobs` | ✅ Hoạt động đầy đủ |
| Video | `/api/v1/video` | 🚧 Stub — luôn trả `501` |
| Audio | `/api/v1/audio` | 🚧 Stub — luôn trả `501` |
| Story | `/api/v1/story` | 🚧 Stub — luôn trả `501` |
| Dialogue | `/api/v1/dialogue` | 🚧 Stub — luôn trả `501` |
| Lesson | `/api/v1/lesson` | 🚧 Stub — luôn trả `501` |
| Flashcard | `/api/v1/flashcard` | 🚧 Stub — luôn trả `501` |
| Ebook | `/api/v1/ebook` | 🚧 Stub — luôn trả `501` |
| Comic | `/api/v1/comic` | 🚧 Stub — luôn trả `501` |
| Mindmap | `/api/v1/mindmap` | 🚧 Stub — luôn trả `501` |

Các domain "Stub" dùng chung `make_stub_router()` (`app/api/_stub.py`): body được validate bằng Pydantic (`GenerateRequest`) nhưng handler luôn `raise HTTPException(501, detail="<domain> generation chưa được triển khai")`. Không có tương tác DB/queue nào xảy ra.

---

## 2. Health

### `GET /health`

Kiểm tra tình trạng service. Không tham số, không yêu cầu auth.

**Response `200`:**
```json
{ "status": "ok" }
```

---

## 3. Image (đã triển khai đầy đủ)

Prefix: `/api/v1/image`

### `POST /api/v1/image/generate`

Tạo (enqueue) job sinh ảnh cho một vocabulary. Nếu ảnh đã sinh thành công trước đó và không ép buộc lại (`force=false`), trả về job cũ thay vì tạo job mới.

**Request body** (`GenerateRequest`):

| Field | Type | Bắt buộc | Mặc định | Ghi chú |
|---|---|---|---|---|
| `vocabulary_id` | string | ✅ | — | ID của vocabulary cần sinh ảnh |
| `prompt_template` | string \| null | ❌ | `null` | Template prompt tuỳ chỉnh (hiện chưa thấy được dùng trong logic enqueue) |
| `force` | boolean | ❌ | `false` | `true` để bỏ qua job đã SUCCESS và sinh lại |

**Xử lý:**
1. Không tìm thấy `vocabulary_id` → `404 Vocabulary not found`.
2. Nếu `force=false` và vocabulary đang ở `status=SUCCESS` và có job `IMAGE` thành công gần nhất → trả job đó luôn, **không** tạo job mới.
3. Ngược lại → tạo `Job(type=IMAGE, status=WAITING)`, lưu DB, gọi `enqueue_image_job(job.id)` để đẩy vào queue (Redis/ARQ).

**Response `200`** (`JobEnqueuedResponse`):

| Field | Type | Ghi chú |
|---|---|---|
| `job_id` | int | ID của job (mới hoặc đã có sẵn) |
| `status` | string | `"ALREADY_GENERATED"` nếu tái sử dụng job cũ, hoặc giá trị `JobStatus` (thường là `"WAITING"`) nếu vừa tạo mới |

> Lưu ý: dù tạo resource mới, endpoint không set `status_code=201` — trả về `200` mặc định.

**Errors:** `404` nếu `vocabulary_id` không tồn tại.

---

### `GET /api/v1/image/{vocabulary_id}`

Lấy danh sách asset gắn với một vocabulary.

**Path params:** `vocabulary_id: string`

**Response `200`**: `AssetRead[]`

| Field | Type | Ghi chú |
|---|---|---|
| `id` | int | |
| `vocabulary_id` | string | |
| `type` | string | Loại asset (image/audio/video/...) |
| `path` | string | Đường dẫn lưu trữ (VPS local storage) |
| `width` | int \| null | |
| `height` | int \| null | |
| `size` | int \| null | |
| `checksum` | string \| null | |

> ⚠️ Chưa xác nhận được: `asset_repo.list_by_vocabulary()` có lọc theo `type == "image"` hay trả về **toàn bộ** asset (mọi loại) của vocabulary đó — cần kiểm tra `app/repositories/asset_repository.py` nếu cần chính xác tuyệt đối.

**Errors:** `404 Vocabulary not found` nếu `vocabulary_id` không tồn tại.

---

## 4. Video / Audio / Story / Dialogue / Lesson / Flashcard / Ebook / Comic / Mindmap (stub)

Mỗi domain chỉ có **một** endpoint, hành vi giống hệt nhau:

### `POST /api/v1/{domain}/generate`

Ví dụ: `/api/v1/video/generate`, `/api/v1/audio/generate`, `/api/v1/story/generate`, `/api/v1/dialogue/generate`, `/api/v1/lesson/generate`, `/api/v1/flashcard/generate`, `/api/v1/ebook/generate`, `/api/v1/comic/generate`, `/api/v1/mindmap/generate`.

**Request body** (`GenerateRequest`) — schema giống hệt Image ở trên (`vocabulary_id`, `prompt_template`, `force`).

**Response:** luôn `501 Not Implemented`
```json
{ "detail": "<domain> generation chưa được triển khai" }
```

Không có logic DB/queue nào chạy — chỉ validate body rồi raise lỗi.

---

## 5. Vocabulary (đã triển khai đầy đủ)

Prefix: `/api/v1/vocabulary`

### `GET /api/v1/vocabulary`

Danh sách vocabulary, phân trang.

**Query params:**

| Param | Type | Mặc định | Ghi chú |
|---|---|---|---|
| `limit` | int | `50` | Không giới hạn min/max ở tầng validate |
| `offset` | int | `0` | |

**Response `200`**: `VocabularyRead[]`

### `GET /api/v1/vocabulary/search`

Tìm kiếm vocabulary theo từ khoá.

**Query params:**

| Param | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `q` | string | ✅ | `min_length=1` |
| `limit` | int | ❌ | mặc định `50` |
| `offset` | int | ❌ | mặc định `0` |

**Response `200`**: `VocabularyRead[]`

### `GET /api/v1/vocabulary/{vocabulary_id}`

**Path params:** `vocabulary_id: string`

**Response `200`**: `VocabularyRead`
**Errors:** `404 Vocabulary not found`

**`VocabularyRead` schema:**

| Field | Type | Ghi chú |
|---|---|---|
| `id` | string | |
| `word` | string | |
| `level` | string | |
| `topic` | string | |
| `subcategory` | string \| null | |
| `status` | enum `JobStatus` | xem bảng enum bên dưới |
| `image_path` | string \| null | |
| `audio_path` | string \| null | |
| `video_path` | string \| null | |
| `story_path` | string \| null | |
| `source` | object \| null | |
| `created_at` | datetime | |
| `updated_at` | datetime | |

> Có schema `VocabularyCreate` (`word`, `level`, `topic`, `subcategory`, `id`) nhưng **chưa có endpoint tạo mới vocabulary** qua REST API — vocabulary hiện chỉ đọc được, không tạo được qua API này.

---

## 6. Job (đã triển khai đầy đủ)

Prefix: `/api/v1/jobs`

### `GET /api/v1/jobs`

**Query params:** `limit: int = 50`, `offset: int = 0`

**Response `200`**: `JobRead[]`

### `GET /api/v1/jobs/{job_id}`

**Path params:** `job_id: int`

**Response `200`**: `JobRead`
**Errors:** `404 Job not found`

**`JobRead` schema:**

| Field | Type | Ghi chú |
|---|---|---|
| `id` | int | |
| `vocabulary_id` | string \| null | |
| `type` | enum `JobType` | `image`, `audio`, `video`, `story`, `dialogue`, `lesson`, `flashcard`, `comic`, `mindmap`, `ebook` |
| `status` | enum `JobStatus` | xem bảng enum bên dưới |
| `provider` | string \| null | |
| `model` | string \| null | |
| `retry` | int | |
| `cost` | float \| null | |
| `duration` | float \| null | |
| `error` | string \| null | |
| `created_at` | datetime | |

---

## 7. Enums dùng chung

**`JobStatus`**: `WAITING`, `GENERATING`, `DOWNLOADING`, `REMOVE_BG`, `RESIZE`, `THUMBNAIL`, `WEBP`, `METADATA`, `UPLOAD`, `SUCCESS`, `FAILED`, `RETRY`

**`JobType`**: `image`, `audio`, `video`, `story`, `dialogue`, `lesson`, `flashcard`, `comic`, `mindmap`, `ebook`

---

## 8. Sai khác so với bản thiết kế (structure.md, mục 16)

- **Prefix**: doc thiết kế dùng `/api/...` (không version), code thực tế dùng `/api/v1/...` (trừ `/health` không có prefix nào).
- Doc chỉ liệt kê generate cho image/video/audio/story/comic — thực tế code có thêm stub cho dialogue/lesson/flashcard/ebook/mindmap.
- Doc mô tả `GET /api/audio/{id}` và `GET /api/video/{id}` (asset theo id) — **chưa tồn tại** trong code (audio.py, video.py chỉ có `/generate`).
- Doc mô tả `GET /api/image/{id}` như lấy asset theo asset id — thực tế `GET /api/v1/image/{vocabulary_id}` nhận **vocabulary_id**, trả về danh sách asset của vocabulary đó, không phải lấy 1 asset theo asset id.
- Chỉ **Image, Vocabulary, Job** là có logic thật (DB + queue); các domain còn lại (Video, Audio, Story, Dialogue, Lesson, Flashcard, Ebook, Comic, Mindmap) hiện là stub trả `501`, chờ Phase 2/3 theo roadmap.
