# Use Case — EDU-14 Homework Submission (Nộp bài)

> Hana Edu | Version 1.0 | 2026-07-08 | Tham chiếu: `BRD - Education.md` § EDU-14, `SRS/SRS-EDU-14-Homework-Submission.md`

---

## Danh mục Use Case

| ID | Tên | Actor chính |
|----|-----|-------------|
| UC-EDU-14-01 | Học viên nộp bài (ảnh/text/audio) | Student |
| UC-EDU-14-02 | Nộp lại trước deadline | Student |
| UC-EDU-14-03 | Giáo viên nộp hộ bài giấy | Teacher |
| UC-EDU-14-04 | Yêu cầu làm lại (redo) | Teacher |
| UC-EDU-14-05 | Theo dõi & nhắc nộp bài | Teacher |

## Sơ đồ Actor – Use Case

```
Student (App) ────► UC-01, UC-02
Teacher ────► UC-03, UC-04, UC-05
Parent ────► xem trạng thái bài của con (read-only)
System ────► đánh dấu muộn, đếm phân đoạn nộp
```

---

## UC-EDU-14-01 — Học viên nộp bài

| Thuộc tính | Nội dung |
|-----------|----------|
| Actor chính | Student (Student App) |
| Precondition | Bài assigned, học viên trong scope, chưa graded |
| Postcondition | Submission submitted (± is_late); GV nhận thông báo gộp |

**Luồng chính**

| Bước | Actor | Hệ thống |
|------|-------|----------|
| 1 | Mở bài trong tab Homework | Hiển thị đề + deadline + trạng thái |
| 2 | Chụp 2 trang workbook (hoặc ghi âm luyện nói ≤5') | Nén ảnh ~1MB, preview |
| 3 | Bấm Nộp | Upload presigned (retry/resume) → POST submission |
| 4 | — | is_late = so deadline; badge "Đã nộp"; push gộp cho GV (≤1 tin/15') |

**Luồng thay thế:** A1: bài type=quiz → làm quiz trong app → nộp quiz_result tự động.

**Luồng ngoại lệ**

- E1: bài closed → 422 E-SUB-01 "liên hệ giáo viên".
- E2: quá deadline + allow_late=false → 422 E-SUB-02.
- E3: mất mạng khi upload → resume; fail hẳn → giữ draft local, nộp lại sau.
- E4: ngoài scope → 403 E-SUB-03.

**BR liên quan:** BR-02, BR-03.

---

## UC-EDU-14-02 — Nộp lại trước deadline

**Trigger:** Học viên phát hiện thiếu 1 trang.

**Luồng chính:** mở bài đã nộp → "Nộp lại" → thêm ảnh → hệ thống archive bản cũ (versions), version++, submission mới là chính thức → GV thấy bản mới nhất kèm link lịch sử.

**Ngoại lệ:** đã graded → 409 E-SUB-04 (chờ GV redo); retry cùng client_request_id → không tăng version.

**BR liên quan:** BR-01, BR-05.

---

## UC-EDU-14-03 — Giáo viên nộp hộ

**Trigger:** Học viên làm bài giấy / chưa có thiết bị.

**Luồng chính:** GV thu bài trên lớp → màn theo dõi bài → chọn học viên "Chưa nộp" → chụp ảnh bài giấy → nộp hộ → submitted_by=teacher, hiển thị nhãn "GV nộp hộ".

**Đặc thù:** GV được nộp hộ cả sau deadline (chủ động của GV).

**BR liên quan:** BR-04.

---

## UC-EDU-14-04 — Yêu cầu làm lại (redo)

| Thuộc tính | Nội dung |
|-----------|----------|
| Trigger | Bài làm sai yêu cầu / thiếu |
| Precondition | Submission đã graded |
| Postcondition | Submission → redo; học viên nộp lại được |

**Luồng chính**

1. GV mở bài đã chấm → "Yêu cầu làm lại" + nhận xét hướng dẫn.
2. Push Student + Parent App kèm nhận xét.
3. Học viên nộp bản mới (version++) → status submitted → GV chấm lại (grade mới ghi đè, log lần cũ).

**BR liên quan:** BR-05.

---

## UC-EDU-14-05 — Theo dõi & nhắc nộp

**Luồng chính:** GV mở tab theo dõi → 3 phân đoạn Đã nộp (12) / Chưa nộp (5) / Muộn (1) → bấm "Nhắc cả nhóm chưa nộp" → push 5 em + phụ huynh.

**Ràng buộc:** nhắc thủ công rate limit 1 lần/6h/bài (tránh spam); nhắc tự động: UC-EDU-13-05.
