# SRS-EDU-17 — Score (Bảng điểm tổng hợp)

> Software Requirements Specification — Hana Edu
>
> Version 1.0 | 2026-07-08 | Draft | Tham chiếu: `BRD - Education.md` § EDU-17

---

## 1. Giới thiệu

### 1.1 Mục đích

Đặc tả engine tổng hợp điểm: cấu trúc component trọng số, auto-aggregate từ homework/attendance/exam, điểm manual, finalize và phiếu điểm.

### 1.2 Phạm vi

score_structures, scores, score_finals, recalculate, finalize, report card PDF. Nguồn dữ liệu: SRS-EDU-12/15/16.

## 2. Mô tả tổng quan

- **ScoreService = single source of truth** cho công thức: mọi nơi (web, app, PDF, report) gọi cùng service/API, không tự tính.
- Component nguồn: homework (avg điểm bài tập quy về thang 10), attendance ((present+late)/total × 10), exam_midterm, exam_final (total exam quy thang 10), manual.
- Tổng = Σ(component × weight/100), thang 10, làm tròn 1 decimal (half-up); xếp loại theo ngưỡng cấu hình business.

## 3. Yêu cầu chức năng chi tiết

### FR-01 Cấu trúc điểm

- `GET/PUT /classes/{id}/score-structure`: kế thừa mặc định từ course khi tạo lớp; sửa được trước khi finalize. Validate Σweight=100; mỗi source auto tối đa 1 component (trừ manual).
- Đổi cấu trúc giữa khóa → auto recalculate toàn lớp + log.

### FR-02 Aggregate tự động

Listeners: `SubmissionGraded`, `SessionCompleted`(attendance), `ExamPublished` → queue `RecalculateScore {class_id, student_id, component}`:
- homework: avg các grade quy thang 10 (letter/stars quy đổi theo bảng Setting); bài chưa chấm không tính.
- attendance: theo buổi completed đến hiện tại.
- exam: total/max_total × 10.
Ghi `scores` kèm `source_detail` (trace: ids nguồn + công thức) phục vụ audit.

### FR-03 Manual component

PUT /scores/manual {student_id, component_id, value 0–10 bước 0.1}: chỉ GV lớp; sau finalize → khóa.

### FR-04 Recalculate

- POST /recalculate: chạy lại toàn lớp từ dữ liệu gốc (không cộng dồn) — dùng sau sửa điểm danh/điểm thi.
- Job đêm: recalculate các lớp có event trong ngày (đối soát drift).

### FR-05 Finalize

- Precondition: mọi (student, component bắt buộc) có giá trị hoặc is_exempt (kèm lý do); gọi từ close flow (SRS-EDU-08) hoặc trực tiếp.
- Transaction: compute total + grade từng học viên → insert `score_finals` → event `ScoreFinalized` → queue render report card PDF → gửi Parent App/email.
- Sửa sau finalize: Manager, PUT score_finals qua revision (log json) → re-render PDF + re-notify.
- Zero-division policy (component homework không có bài nào): Setting `edu.score.empty_component_policy` = redistribute (chia lại weight) | zero.

### FR-06 Xem & xuất

- Bảng điểm lớp realtime; lịch sử học viên qua các lớp; report card PDF (template logo, điểm kỹ năng exam, nhận xét, xếp loại).
- Parent App: `GET /api/parent/students/{id}/scores` — điểm quá trình realtime + finals.

## 4. Use Case chính

**UC-03 Finalize khi đóng lớp:** close-checklist gọi `ScoreService::canFinalize(class)` → thiếu final 2 em → sau bổ sung → finalize 18 học viên → 15 pass trở lên → event sang Certificate → 18 PDF gửi phụ huynh.

## 5. API Specification

| Method | Path | Quyền |
|--------|------|-------|
| GET/PUT | /api/edu/classes/{id}/score-structure | view / config |
| GET | /api/edu/classes/{id}/scores | view |
| PUT | /api/edu/classes/{id}/scores/manual | enter-manual (GV) |
| POST | /api/edu/classes/{id}/scores/recalculate | admin/manager |
| POST | /api/edu/classes/{id}/scores/finalize | finalize |
| PUT | /api/edu/score-finals/{id}/revise | edit-finalized (Manager) |
| GET | /api/edu/students/{id}/scores | view scope |
| GET | /api/edu/students/{id}/report-card/{class_id} | view scope (PDF) |

```json
// GET /classes/12/scores — Response (rút gọn)
{
  "success": true,
  "data": {
    "structure": [
      { "id": 1, "component": "Quá trình", "source": "homework", "weight": 30 },
      { "id": 2, "component": "Chuyên cần", "source": "attendance", "weight": 10 },
      { "id": 3, "component": "Giữa khóa", "source": "exam_midterm", "weight": 20 },
      { "id": 4, "component": "Cuối khóa", "source": "exam_final", "weight": 40 }
    ],
    "students": [
      { "student_id": 101, "values": { "1": 8.2, "2": 9.5, "3": 7.75, "4": 8.0 }, "total": 8.2, "grade": "good" }
    ],
    "finalized": false
  }
}
```

## 6. Yêu cầu dữ liệu

`score_structures`: id, class_id FK, component varchar(50), source enum(homework,attendance,exam_midterm,exam_final,manual), weight decimal(5,2), sort_order, is_required bool default true, timestamps. Validate Σweight=100 tại service.

`scores`: id, business_id, class_id, student_id, structure_id FK, value decimal(4,2), source_detail json, is_exempt bool, exempt_reason null, entered_by null, computed_at, timestamps. Unique (class_id, student_id, structure_id).

`score_finals`: id, class_id, student_id, total decimal(4,2), grade enum(excellent,good,pass,fail), finalized_at/by, revisions json[], timestamps. Unique (class_id, student_id).

`grade_thresholds` (Setting business): [{grade, min_total}] mặc định excellent ≥8.5, good ≥7, pass ≥5.

## 7. Yêu cầu phi chức năng

- Recalculate lớp 30 HV × 10 component < 2s; queue riêng, debounce 30s (gộp event dồn dập).
- Mọi giá trị auto phải trace được về nguồn qua source_detail (audit).
- Rounding: half-up 1 decimal — cố định trong ScoreService, có unit test chốt hành vi.

## 8. Mã lỗi

| Code | HTTP | Ý nghĩa |
|------|------|---------|
| E-SCR-01 | 422 | Σweight ≠ 100 |
| E-SCR-02 | 422 | Finalize thiếu điểm (kèm danh sách) |
| E-SCR-03 | 409 | Sửa manual sau finalize |
| E-SCR-04 | 403 | Revise finals không phải Manager |
| E-SCR-05 | 422 | Giá trị manual ngoài 0–10 |

## 9. Test scenarios

| # | Scenario | Kỳ vọng |
|---|----------|---------|
| T1 | Cấu trúc 30/10/20/40, các điểm 8.2/9.5/7.75/8.0 | total=8.2 (kiểm bằng tay), grade=good |
| T2 | Sửa 1 điểm bài tập | Component homework đổi ≤ 30s (debounce), total đổi theo |
| T3 | Recalculate sau sửa điểm danh | Khớp lại 100% từ nguồn |
| T4 | Finalize thiếu manual 1 em | 422 E-SCR-02 |
| T5 | Component homework 0 bài, policy redistribute | Weight chia lại đúng tỷ lệ, tổng vẫn thang 10 |
| T6 | Finalize | score_finals đủ 18 em; PDF gửi PH; event tới Certificate |
| T7 | Sửa exam sau finalize | finals KHÔNG tự đổi; cảnh báo Manager re-finalize |
| T8 | Web/App/PDF cùng học viên | Cùng một con số (single source) |
