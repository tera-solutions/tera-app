# SRS-EDU-18 — Certificate (Cấp chứng chỉ)

> Software Requirements Specification — Hana Edu
>
> Version 1.0 | 2026-07-08 | Draft | Tham chiếu: `BRD - Education.md` § EDU-18

---

## 1. Giới thiệu

### 1.1 Mục đích

Đặc tả cấp chứng chỉ hoàn thành khóa: điều kiện 3 lớp (điểm/chuyên cần/học phí), số hiệu tuần tự, render PDF từ template, QR xác thực public, thu hồi/cấp lại.

### 1.2 Phạm vi

Template designer, eligibility engine, issue (lô/lẻ/ngoại lệ), revoke/reissue, verify page. Điểm: SRS-EDU-17; công nợ: Finance.

## 2. Mô tả tổng quan

- Điều kiện mặc định: score_finals.grade ≥ pass AND attendance_rate ≥ Setting `edu.certificate.min_attendance` (80%) AND Finance.debt(khóa)=0. Ngoại lệ: Manager approve per-student (log).
- Số hiệu: `{business_code}/{YYYY}/{NNNNN}` từ `certificate_sequences` — atomic, không tái sử dụng.
- Verify: public, không auth, qua QR hoặc nhập số hiệu.

## 3. Yêu cầu chức năng chi tiết

### FR-01 Template designer

- CRUD template per course (fallback default); fields json: [{type: student_name|course_name|grade|issued_date|certificate_no|qr, x, y, font, size, color, align}]; background image A4 landscape (300dpi khuyến nghị).
- POST /preview: render PDF mẫu với dữ liệu giả.

### FR-02 Eligibility engine

`GET /classes/{id}/certificate-eligibility` (gọi khi lớp completed):
```
for student in score_finals(class):
    checks = { score: grade≥pass, attendance: rate≥min, finance: debt==0 }
    eligible = all(checks)
```
Output per student: eligible, checks chi tiết {pass, value, threshold}, exception_status. Finance check qua FinanceClient (cache 5 phút).

### FR-03 Phát hành

- POST /issue {student_ids[], exceptions?: [{student_id, reason}]}: validate từng em eligible hoặc có exception được Manager phê duyệt (approval flow) → transaction sinh certificate_no (sequence FOR UPDATE) → record status=`pending_render` → queue render PDF (template + data + QR encode verify URL) → xong: status=`issued`, pdf_url → notification PH.
- Cấp lẻ: POST /certificates với student + class.

### FR-04 Thu hồi / cấp lại

- PATCH /revoke {reason ≥10 ký tự}: issued→revoked; verify page phản ánh ngay (cache purge); notify PH.
- Cấp lại: issue mới (số hiệu mới) với `replaces_certificate_id` → bản cũ auto revoke nếu chưa.

### FR-05 Verify public

`GET /api/public/certificates/verify/{code}`: trả {student_name, course_name, grade_label, issued_date, status valid|revoked} — không SĐT/DOB. Không tồn tại → 404 thông điệp trung tính. Rate limit IP 30 req/phút.

### FR-06 App

Parent/Student App: danh sách chứng chỉ + tải PDF + share image preview (render PNG từ PDF trang 1).

## 4. Use Case chính

**UC-01 Cấp lô:** Lớp đóng, 18 HV: eligibility trả 15 ✓, 2 thiếu chuyên cần (78%, 75%), 1 nợ 500k → Giáo vụ chọn 15 + đề xuất ngoại lệ em 78% → Manager approve → issue 16 → queue render → 16 PH nhận push+email trong 5 phút.

**UC-04 Sai tên:** revoke HANA/2026/00123 (lý do sai tên) → sửa tên học viên → issue mới 00124 replaces 00123 → verify 00123 hiện "Đã thu hồi", 00124 "Hợp lệ".

## 5. API Specification

| Method | Path | Quyền |
|--------|------|-------|
| GET/POST/PUT | /api/edu/certificate-templates | template |
| POST | /api/edu/certificate-templates/{id}/preview | template |
| GET | /api/edu/classes/{id}/certificate-eligibility | issue |
| POST | /api/edu/classes/{id}/certificates/issue | issue (+ Manager approve exception) |
| POST | /api/edu/certificates | issue (cấp lẻ) |
| PATCH | /api/edu/certificates/{id}/revoke | revoke |
| GET | /api/edu/students/{id}/certificates | view scope |
| GET | /api/public/certificates/verify/{code} | public |

```json
// GET /verify/HANA-2026-00123 — Response
{
  "success": true,
  "data": {
    "certificate_no": "HANA/2026/00123",
    "student_name": "Nguyễn Minh An",
    "course_name": "Cambridge Starters",
    "grade": "Giỏi",
    "issued_date": "2026-07-01",
    "status": "revoked",
    "replaced_by": "HANA/2026/00124"
  }
}
```

## 6. Yêu cầu dữ liệu

`certificate_templates`: id, business_id, course_id FK null, name, background_url, fields json, status enum(active,inactive), timestamps.

`certificates`: id, business_id, certificate_no varchar(30) unique, student_id FK, class_id FK, course_id FK, template_id FK, grade, issued_date, issued_by, approved_by null, exception_reason null, exception_approved_by null, pdf_url null, verify_code varchar(40) unique (random, dùng trong QR), status enum(pending_render,issued,revoked) index, revoke_reason/revoked_at null, replaces_certificate_id FK self null, timestamps.

`certificate_sequences`: business_id, year, last_number. PK (business_id, year) — update FOR UPDATE.

## 7. Yêu cầu phi chức năng

- Render lô 30 PDF < 30s (queue song song 5 worker); PDF có watermark; QR encode URL verify + verify_code (không encode số hiệu thuần — chống đoán).
- Verify page: cache CDN 60s, purge khi revoke; chịu 100 req/s.
- Sequence: test concurrency chứng minh không trùng/không nhảy số dưới tải song song.

## 8. Mã lỗi

| Code | HTTP | Ý nghĩa |
|------|------|---------|
| E-CER-01 | 422 | Không đủ điều kiện, không có exception (kèm checks) |
| E-CER-02 | 403 | Exception chưa được Manager duyệt |
| E-CER-03 | 409 | Học viên đã có chứng chỉ issued cho lớp này |
| E-CER-04 | 422 | Revoke thiếu lý do |
| E-CER-05 | 404 | Verify code không tồn tại |
| E-CER-06 | 429 | Verify vượt rate limit |

## 9. Test scenarios

| # | Scenario | Kỳ vọng |
|---|----------|---------|
| T1 | Eligibility 18 em | Checks đúng cả 3 điều kiện, giá trị + ngưỡng rõ ràng |
| T2 | Issue em nợ học phí không exception | 422 E-CER-01 |
| T3 | Issue lô song song 2 request | Số hiệu liên tục, không trùng |
| T4 | Render fail 1 PDF giữa lô | Retry; số hiệu giữ nguyên; các PDF khác không ảnh hưởng |
| T5 | Verify QR | < 2s, không auth, dữ liệu tối thiểu |
| T6 | Revoke | Verify hiện "Đã thu hồi" ≤ 60s |
| T7 | Reissue | Bản mới liên kết bản cũ; bản cũ revoked |
| T8 | Issue trùng (student, class) | 409 E-CER-03 |
