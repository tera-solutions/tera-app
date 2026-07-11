# SRS-EDU-16 — Examination (Kiểm tra)

> Software Requirements Specification — Hana Edu
>
> Version 1.0 | 2026-07-08 | Draft | Tham chiếu: `BRD - Education.md` § EDU-16

---

## 1. Giới thiệu

### 1.1 Mục đích

Đặc tả tổ chức kỳ kiểm tra (placement/midterm/final/mock) với điểm theo kỹ năng, nhập điểm autosave, publish có kiểm soát, thi bù.

### 1.2 Phạm vi

Examination lifecycle, exam_results theo kỹ năng, import điểm, publish, makeup, placement không gắn lớp. Điểm tổng hợp: SRS-EDU-17.

## 2. Mô tả tổng quan

- State machine: `planned → ongoing → grading → published`.
- Cấu trúc kỹ năng: json [{skill: listening|speaking|reading|writing, max_score}] — bật/tắt theo level.
- Điểm chỉ visible cho Parent/Student khi published; publish nguyên tử.

## 3. Yêu cầu chức năng chi tiết

### FR-01 Tạo kỳ thi

POST: name, type, class_id (null nếu placement — thay bằng branch_id), exam_date(s), classroom_id?, skills[] (≥1, max_score 1–100), grader_teacher_ids[]. Lớp bắt buộc có midterm+final theo cấu hình course — check ở close-checklist (SRS-EDU-08).

### FR-02 Nhập điểm

- `PUT /{id}/scores` batch [{student_id, skill_scores {listening: 22.5, ...}, comment?, is_absent?}] — autosave partial: cho phép gửi từng phần, merge theo student+skill.
- Optimistic lock: mỗi record kèm `updated_at` snapshot; conflict → 409 trả giá trị hiện tại.
- Teacher App: nhập theo kỹ năng được phân công (VD chỉ Speaking).

### FR-03 Import Excel

Template sinh theo skills của kỳ thi; validate từng dòng; kết quả file lỗi như SRS-EDU-01 FR-06.

### FR-04 Publish

- PATCH /publish: validate 100% học viên roster có đủ skill_scores hoặc is_absent → (Setting `edu.exam.require_manager_approval` → tạo approval) → published_at; batch notification phụ huynh; event `ExamPublished` → ScoreService.
- Sửa sau publish: qua `grade-revision` flow như SRS-EDU-15 FR-05 (Manager duyệt, re-notify).

### FR-05 Thi bù

POST /makeup {student_ids, date}: học viên is_absent; deadline ≤ exam_date + Setting `edu.exam.makeup_days` (mặc định 14); nhập điểm ghi vào exam gốc với is_makeup=true. Quá hạn: giữ absent — ngoại lệ xét chứng chỉ do Manager (SRS-EDU-18).

### FR-06 Placement test

- Không gắn lớp; đối tượng: lead/customer (CRM) hoặc học viên cũ; kết quả kèm `suggested_level_id` tính từ bảng quy đổi `placement_level_mappings` (range tổng điểm → level).
- API cho CRM: `GET /api/edu/placements/{id}/result` → Sales tư vấn khóa.

## 4. Use Case chính

**UC-02 Nhập điểm 2 GV song song:** GV A nhập Listening/Reading trên web, GV B nhập Speaking trên tablet — merge theo skill không đè nhau; ô conflict (cùng skill) → người sau thấy 409 + giá trị mới nhất.

**UC-03 Thi bù:** 2 HV ốm → makeup thứ 7 → nhập điểm → đủ dữ liệu → publish toàn kỳ.

## 5. API Specification

| Method | Path | Quyền |
|--------|------|-------|
| GET/POST | /api/edu/examinations | view / manage |
| GET/PUT/DELETE | /api/edu/examinations/{id} | view / manage |
| GET/PUT | /api/edu/examinations/{id}/scores | enter-score |
| POST | /api/edu/examinations/{id}/scores/import | enter-score |
| PATCH | /api/edu/examinations/{id}/publish | publish |
| POST | /api/edu/examinations/{id}/makeup | manage |
| GET | /api/parent/students/{id}/exam-results | Parent App (published) |
| GET | /api/edu/placements/{id}/result | CRM internal |

```json
// PATCH /publish — 422 thiếu điểm
{
  "success": false,
  "errors": {
    "code": "E-EXM-02",
    "missing": [{ "student_id": 7, "name": "Bé An", "skills": ["speaking"] }]
  }
}
```

## 6. Yêu cầu dữ liệu

`examinations`: id, business_id, branch_id, class_id FK null, name, type enum(placement,midterm,final,mock,other), exam_date date, classroom_id null, skills json, status enum(planned,ongoing,grading,published) index, published_at/published_by null, approval_id null, timestamps, deleted_at.

`exam_results`: id, examination_id FK, student_id FK null, lead_id FK null (placement), skill_scores json, total decimal(6,2) computed, comment text, is_absent bool, is_makeup bool, suggested_level_id null, entered_by, updated_at (optimistic lock), timestamps. Unique (examination_id, student_id).

`placement_level_mappings`: business_id, min_total, max_total, level_id.

## 7. Yêu cầu phi chức năng

- Autosave: FE gửi diff mỗi 10s; server merge idempotent; không mất dữ liệu khi đứt mạng (local buffer).
- Publish: transaction cập nhật status + snapshot kết quả; notification fan-out qua queue sau commit.
- Parent API chỉ trả exam published — enforce ở query scope, không chỉ FE.

## 8. Mã lỗi

| Code | HTTP | Ý nghĩa |
|------|------|---------|
| E-EXM-01 | 422 | Điểm vượt max_score kỹ năng |
| E-EXM-02 | 422 | Publish thiếu điểm (kèm missing) |
| E-EXM-03 | 409 | Optimistic lock conflict |
| E-EXM-04 | 422 | Makeup quá hạn / học viên không absent |
| E-EXM-05 | 403 | Publish không có approval (khi Setting bật) |
| E-EXM-06 | 409 | Sửa điểm exam đã published không qua duyệt |

## 9. Test scenarios

| # | Scenario | Kỳ vọng |
|---|----------|---------|
| T1 | Nhập 26/25 Listening | 422 E-EXM-01 ngay ô nhập |
| T2 | Publish thiếu Speaking 1 em | 422 kèm missing chính xác |
| T3 | Parent gọi API trước publish | Không có dữ liệu kỳ thi đó |
| T4 | Publish thành công | 100% PH nhận push; ScoreService nhận event; biểu đồ kỹ năng đúng |
| T5 | 2 GV nhập song song khác skill | Merge đủ cả 2, không mất |
| T6 | Makeup ngày 15 (hạn 14) | 422 E-EXM-04 |
| T7 | Placement tổng 78 (range 70–85 = Movers) | suggested_level = Movers, CRM đọc được |
| T8 | Sửa điểm sau publish | Pending Manager; approve → đổi + re-notify + recalc EDU-17 |
