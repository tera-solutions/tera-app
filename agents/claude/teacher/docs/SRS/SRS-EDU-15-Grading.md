# SRS-EDU-15 — Assignment / Grading (Chấm bài)

> Software Requirements Specification — Hana Edu
>
> Version 1.0 | 2026-07-08 | Draft | Tham chiếu: `BRD - Education.md` § EDU-15

---

## 1. Giới thiệu

### 1.1 Mục đích

Đặc tả chấm bài nộp: điểm/mức/sao, nhận xét text/audio, annotation trên ảnh, bulk chấm, sửa điểm có kiểm soát, đổ điểm quá trình.

### 1.2 Phạm vi

Grade CRUD trên submission, thư viện nhận xét, dashboard tiến độ chấm. Nguồn submission: SRS-EDU-14; điểm tổng hợp: SRS-EDU-17.

## 2. Mô tả tổng quan

- Thang điểm theo `grading_scheme` (ưu tiên: homework > class > business Setting): `score_10` (0–10, bước 0.25) | `letter` (A–D) | `stars` (1–5).
- Ràng buộc: ≥1 loại phản hồi (điểm/mức/sao, comment, audio).
- Grade tạo → submission.status=graded → event `SubmissionGraded` → ScoreService.

## 3. Yêu cầu chức năng chi tiết

### FR-01 Hàng đợi chấm

`GET /homework/{id}/grading?status=submitted`: submissions kèm nội dung; sort theo submitted_at; hỗ trợ cursor "bài kế tiếp" cho flow Lưu & tiếp.

### FR-02 Chấm 1 bài

PUT `/submissions/{id}/grade`:
- Input theo scheme: score (decimal) | grade_label | stars; comment?; audio_comment {key, duration ≤180s}?; annotations[] ({attachment_index, shapes json — layer vẽ})?.
- Validate: submission submitted/redo-đã-nộp-lại; GV lớp; giá trị trong thang.
- Ghi grade (upsert — chấm lại ghi đè + log bản cũ vào `grade_revisions`); submission→graded; event.

### FR-03 Bulk chấm

POST /bulk-grade {submission_ids[], score/label/stars, comment_template_id?}: áp cùng giá trị; xử lý tuần tự trong transaction; trả kết quả từng bài.

### FR-04 Thư viện nhận xét

CRUD `/comment-templates` scope GV; biến placeholder {student_name}.

### FR-05 Sửa điểm có kiểm soát

- ≤ 7 ngày sau graded_at: GV sửa trực tiếp (ghi revision log).
- > 7 ngày: PUT /grade-revision tạo yêu cầu pending → Manager approve/reject; điểm cũ giữ nguyên tới khi approve; approve → apply + re-notify + ScoreService recalculate.

### FR-06 Dashboard tiến độ

`GET /grading/pending?teacher_id&overdue_days=`: đếm bài submitted chưa chấm theo GV/lớp; Giáo vụ view toàn chi nhánh; alert tự động khi quá Setting `edu.grading.overdue_days` (mặc định 3).

## 4. Use Case chính

**UC-01 Chấm chuỗi:** GV mở hàng đợi 18 bài → mỗi bài: xem ảnh (zoom) → tap chip điểm 8 → chọn nhận xét mẫu → "Lưu & tiếp" (1 API call, cursor next) → hết hàng đợi trong ~15 phút.

**UC-02 Annotation + audio:** khoanh lỗi trên ảnh (layer json, ảnh gốc giữ nguyên) → ghi âm 30s → lưu; Parent App render layer đè lên ảnh + player audio.

## 5. API Specification

| Method | Path | Quyền |
|--------|------|-------|
| GET | /api/edu/homework/{id}/grading | GV lớp |
| PUT | /api/edu/submissions/{id}/grade | edu.grading.grade (GV lớp) |
| POST | /api/edu/submissions/bulk-grade | GV lớp |
| GET/POST/PUT/DELETE | /api/edu/comment-templates | GV |
| PUT | /api/edu/submissions/{id}/grade-revision | GV đề xuất / Manager duyệt |
| GET | /api/edu/grading/pending | view-progress |

```json
// PUT /submissions/901/grade — Request (scheme score_10)
{
  "score": 8.5,
  "comment": "Con làm tốt, chú ý chính tả nhé!",
  "audio_comment": { "key": "gr/2026/07/a1.m4a", "duration": 32 },
  "annotations": [{ "attachment_index": 0, "shapes": [{ "type": "circle", "x": 120, "y": 340, "r": 40, "color": "#FF3B30" }] }]
}
```

## 6. Yêu cầu dữ liệu

`submission_grades`: id, business_id, submission_id FK unique, graded_by FK teachers, scheme enum(score_10,letter,stars), score decimal(4,2) null, grade_label char(1) null, stars tinyint null, comment text, audio_comment json null, annotations json null, graded_at, timestamps.

`grade_revisions`: id, grade_id FK, old_value json, new_value json, reason, requested_by, status enum(applied,pending,approved,rejected), approved_by null, created_at.

`comment_templates`: id, business_id, teacher_id, content varchar(500), usage_count.

## 7. Yêu cầu phi chức năng

- "Lưu & tiếp": 1 request trả kèm `next_submission` — không round-trip thêm.
- Annotation lưu vector json (không render ảnh mới server-side); FE render canvas overlay.
- Event `SubmissionGraded` outbox pattern — không mất khi crash.

## 8. Mã lỗi

| Code | HTTP | Ý nghĩa |
|------|------|---------|
| E-GRD-01 | 403 | Không phải GV lớp |
| E-GRD-02 | 422 | Giá trị ngoài thang / thiếu mọi phản hồi |
| E-GRD-03 | 409 | Chấm bài chưa nộp / đang redo chưa nộp lại |
| E-GRD-04 | 403 | Sửa sau 7 ngày không qua duyệt |
| E-GRD-05 | 422 | Audio > 180s / annotation sai index |

## 9. Test scenarios

| # | Scenario | Kỳ vọng |
|---|----------|---------|
| T1 | Chấm 8.5 + comment | Submission graded; HV+PH nhận push; ScoreService nhận event |
| T2 | Điểm 11 (scheme score_10) | 422 E-GRD-02 |
| T3 | Chấm không điểm, chỉ audio | OK (≥1 phản hồi) |
| T4 | Chấm lại trong 7 ngày | Ghi đè + revision log applied |
| T5 | Sửa sau 8 ngày | Tạo pending; Manager approve → điểm đổi + re-notify + recalc |
| T6 | Bulk 10 bài có 1 bài chưa nộp | 9 OK, 1 lỗi E-GRD-03, kết quả per-item |
| T7 | Annotation | Ảnh gốc không đổi; app render đúng layer |
| T8 | Bài quá 3 ngày chưa chấm | Xuất hiện dashboard + alert Giáo vụ |
