# Use Case — EDU-17 Score (Bảng điểm tổng hợp)

> Hana Edu | Version 1.0 | 2026-07-08 | Tham chiếu: `BRD - Education.md` § EDU-17, `SRS/SRS-EDU-17-Score.md`

---

## Danh mục Use Case

| ID | Tên | Actor chính |
|----|-----|-------------|
| UC-EDU-17-01 | Cấu hình cấu trúc điểm cho lớp | Manager |
| UC-EDU-17-02 | Tổng hợp điểm tự động | System |
| UC-EDU-17-03 | Nhập điểm manual | Teacher |
| UC-EDU-17-04 | Chốt bảng điểm & phát hành phiếu điểm | Manager |
| UC-EDU-17-05 | Phụ huynh theo dõi điểm quá trình | Parent |

## Sơ đồ Actor – Use Case

```
Manager ────► UC-01, UC-04 (+ sửa sau chốt)
System (ScoreService) ────► UC-02 (nguồn sự thật công thức)
Teacher ────► UC-03; review bảng điểm lớp mình
Parent/Student ────► UC-05
Certificate (EDU-18) ────► nhận kết quả từ UC-04
```

---

## UC-EDU-17-01 — Cấu hình cấu trúc điểm

| Thuộc tính | Nội dung |
|-----------|----------|
| Trigger | Tạo lớp (kế thừa course) hoặc điều chỉnh trước finalize |
| Postcondition | Σ trọng số = 100%; bảng điểm realtime theo cấu trúc mới |

**Luồng chính**

1. Manager mở score-structure lớp: mặc định Quá trình 30 / Chuyên cần 10 / Giữa khóa 20 / Cuối khóa 40.
2. Thêm component manual "Dự án cuối khóa" 10% → giảm Cuối khóa còn 30%.
3. Lưu → validate Σ=100 → auto recalculate toàn lớp + log thay đổi.

**Ngoại lệ:** Σ ≠ 100 → 422 E-SCR-01; sửa sau finalize → khóa.

**BR liên quan:** BR-01.

---

## UC-EDU-17-02 — Tổng hợp điểm tự động

| Thuộc tính | Nội dung |
|-----------|----------|
| Actor | System — listeners SubmissionGraded / SessionCompleted / ExamPublished |
| Postcondition | scores upsert kèm source_detail trace; total tạm realtime |

**Luồng chính**

1. Event đến → queue RecalculateScore (debounce 30s gộp event dồn dập).
2. ScoreService tính lại component liên quan: homework = avg quy thang 10; attendance = tỷ lệ present+late × 10; exam = total/max × 10.
3. Upsert scores + source_detail (trace id nguồn) → bảng điểm và Parent App đổi theo.

**Luồng thay thế:** A1: sửa dữ liệu nguồn (điểm danh, điểm thi) → recalculate lại từ gốc, không cộng dồn. A2: component homework chưa có bài nào → policy redistribute/zero theo Setting.

**BR liên quan:** BR-02, BR-03.

---

## UC-EDU-17-03 — Nhập điểm manual

**Luồng chính:** GV mở bảng điểm lớp → cột "Dự án cuối khóa" (manual, editable) → nhập 0–10 từng em → total cập nhật ngay.

**Ngoại lệ:** ngoài 0–10 → 422 E-SCR-05; sau finalize → 409 E-SCR-03.

---

## UC-EDU-17-04 — Chốt bảng điểm & phiếu điểm

| Thuộc tính | Nội dung |
|-----------|----------|
| Trigger | Flow đóng lớp (UC-EDU-08-03) |
| Precondition | 100% (student × component bắt buộc) có giá trị hoặc miễn có lý do |
| Postcondition | score_finals + xếp loại; PDF phiếu điểm gửi PH; đầu vào chứng chỉ |

**Luồng chính**

1. Close-checklist gọi canFinalize → pass.
2. Finalize: tính total (làm tròn half-up 1 decimal) + grade theo ngưỡng (≥8.5 Giỏi / ≥7 Khá / ≥5 Đạt) → insert score_finals 18 em.
3. Event `ScoreFinalized` → Certificate eligibility (UC-EDU-18-01).
4. Queue render 18 phiếu điểm PDF (logo, điểm kỹ năng, nhận xét GV, xếp loại) → Parent App + email.

**Luồng thay thế:** A1: sửa sau chốt → Manager revise (log json) → re-render PDF + re-notify phụ huynh bản điều chỉnh.

**Ngoại lệ:** thiếu điểm → 422 E-SCR-02 danh sách; nguồn thay đổi sau finalize → finals không tự đổi, cảnh báo Manager quyết định re-finalize.

**BR liên quan:** BR-03, BR-04, BR-05.

---

## UC-EDU-17-05 — Phụ huynh theo dõi điểm

**Luồng chính:** PH mở Parent App → tab Điểm của con → điểm quá trình realtime theo component + biểu đồ tiến bộ qua các kỳ → sau chốt: phiếu điểm chính thức tải được PDF.

**Ràng buộc:** điểm exam chỉ hiện sau publish (UC-EDU-16-03); con số ở App = Web = PDF (single source ScoreService).
