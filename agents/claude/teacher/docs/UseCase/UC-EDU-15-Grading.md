# Use Case — EDU-15 Assignment / Grading (Chấm bài)

> Hana Edu | Version 1.0 | 2026-07-08 | Tham chiếu: `BRD - Education.md` § EDU-15, `SRS/SRS-EDU-15-Grading.md`

---

## Danh mục Use Case

| ID | Tên | Actor chính |
|----|-----|-------------|
| UC-EDU-15-01 | Chấm chuỗi bài (Lưu & tiếp theo) | Teacher |
| UC-EDU-15-02 | Chấm với annotation & audio | Teacher |
| UC-EDU-15-03 | Bulk chấm với nhận xét mẫu | Teacher |
| UC-EDU-15-04 | Sửa điểm sau 7 ngày (có duyệt) | Manager |
| UC-EDU-15-05 | Giám sát tiến độ chấm | Giáo vụ |

## Sơ đồ Actor – Use Case

```
Teacher ────► UC-01, UC-02, UC-03 (+ đề xuất trong UC-04)
Manager ────► UC-04 (duyệt)
Giáo vụ ────► UC-05
Student/Parent ────► nhận kết quả chấm
ScoreService ────► nhận event SubmissionGraded (điểm quá trình)
```

---

## UC-EDU-15-01 — Chấm chuỗi bài

| Thuộc tính | Nội dung |
|-----------|----------|
| Actor chính | Teacher |
| Trigger | Bài có submissions chờ chấm |
| Precondition | Submission submitted; GV của lớp |
| Postcondition | Từng bài graded; HV/PH nhận push; điểm đổ quá trình |

**Luồng chính**

| Bước | Actor | Hệ thống |
|------|-------|----------|
| 1 | Mở hàng đợi chấm bài X | Load 18 bài submitted, sort theo giờ nộp |
| 2 | Xem bài 1 (swipe ảnh, zoom) | — |
| 3 | Tap chip điểm 8 + chọn nhận xét mẫu | Validate thang điểm |
| 4 | Bấm "Lưu & tiếp" | Ghi grade → submission graded → event → push HV/PH → trả bài kế tiếp trong cùng response |
| 5 | Lặp đến hết | Hàng đợi trống, summary "18/18 đã chấm" |

**Luồng ngoại lệ**

- E1: điểm ngoài thang → 422 E-GRD-02.
- E2: bài bị redo giữa chừng bởi thao tác khác → 409 E-GRD-03, refresh.

**BR liên quan:** BR-01, BR-02, BR-03, BR-04.

---

## UC-EDU-15-02 — Chấm với annotation & audio

**Trigger:** Bài cần chỉ rõ lỗi sai cho phụ huynh cùng theo dõi.

**Luồng chính**

1. Trong màn chấm → bật chế độ vẽ → khoanh tròn lỗi trên ảnh (layer vector, ảnh gốc không đổi).
2. Giữ nút mic ghi nhận xét 30 giây (≤3').
3. Lưu → Student/Parent App render layer đè ảnh + player audio.

**Ngoại lệ:** audio >180s → chặn từ client; annotation trên file pdf → chỉ hỗ trợ ảnh (thông báo).

**BR liên quan:** BR-03.

---

## UC-EDU-15-03 — Bulk chấm

**Trigger:** Lớp mẫu giáo chấm sticker/sao đồng loạt.

**Luồng chính:** chọn nhiều bài (hoặc "tất cả đã nộp") → chọn 5 sao + nhận xét mẫu "{student_name} làm bài rất tốt!" → hệ thống chấm tuần tự, placeholder thay tên từng em → kết quả per-item.

**Ngoại lệ:** 1 bài trong batch chưa nộp → item đó lỗi E-GRD-03, các bài khác vẫn thành công.

**BR liên quan:** BR-06.

---

## UC-EDU-15-04 — Sửa điểm sau 7 ngày

| Thuộc tính | Nội dung |
|-----------|----------|
| Actor | Teacher (đề xuất) → Manager (duyệt) |
| Precondition | Grade quá 7 ngày kể từ graded_at |
| Postcondition | Điểm đổi sau approve; log đầy đủ; recalc điểm quá trình; re-notify |

**Luồng chính**

1. GV mở bài → "Đề xuất sửa điểm" {giá trị mới, lý do} → tạo revision pending; điểm cũ giữ nguyên.
2. Manager nhận danh sách chờ duyệt → xem old/new/lý do → Approve.
3. Hệ thống apply → grade_revisions log → ScoreService recalculate → push HV/PH bản điều chỉnh.

**Luồng thay thế:** A1: ≤7 ngày → GV sửa trực tiếp (ghi log, không cần duyệt). A2: Manager reject → điểm giữ nguyên, GV nhận lý do.

**BR liên quan:** BR-05.

---

## UC-EDU-15-05 — Giám sát tiến độ chấm

**Luồng chính:** Giáo vụ mở dashboard → bảng GV × số bài pending (quá 3 ngày highlight đỏ) → bấm nhắc → push GV; báo cáo thời gian chấm trung bình dùng cho Teacher Report.

**Actor phụ:** System — alert tự động khi bài pending vượt `edu.grading.overdue_days`.
