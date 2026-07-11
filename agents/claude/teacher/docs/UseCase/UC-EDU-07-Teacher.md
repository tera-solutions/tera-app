# Use Case — EDU-07 Teacher (Hồ sơ & Phân công)

> Hana Edu | Version 1.0 | 2026-07-08 | Tham chiếu: `BRD - Education.md` § EDU-07, `SRS/SRS-EDU-07-Teacher.md`

---

## Danh mục Use Case

| ID | Tên | Actor chính |
|----|-----|-------------|
| UC-EDU-07-01 | Tạo hồ sơ chuyên môn giáo viên | Manager |
| UC-EDU-07-02 | Phân công giáo viên cho lớp | Giáo vụ |
| UC-EDU-07-03 | Gán giáo viên dạy thay 1 buổi | Giáo vụ |
| UC-EDU-07-04 | Tổng hợp giờ dạy tháng | System/Manager |

## Sơ đồ Actor – Use Case

```
Admin/Manager ────► UC-01, UC-02, UC-04
Giáo vụ ────► UC-02, UC-03
Teacher ────► xem hồ sơ + lịch dạy + giờ dạy của mình (Teacher App)
HR (module) ────► nguồn employee; nhận giờ dạy từ UC-04
```

---

## UC-EDU-07-01 — Tạo hồ sơ chuyên môn

| Thuộc tính | Nội dung |
|-----------|----------|
| Precondition | Employee (HR) tồn tại, có user; chưa có teacher profile |
| Postcondition | Teacher active, khai báo môn được dạy — sẵn sàng phân công |

**Luồng chính**

1. Manager chọn employee từ HR → "Tạo hồ sơ giáo viên".
2. Nhập: loại (vietnamese/native/assistant), bằng cấp, chứng chỉ (upload pdf), môn được dạy (≥1), bio, ảnh.
3. Lưu → GV xuất hiện trong danh sách phân công.

**Ngoại lệ:** employee đã có profile → 422 E-TCH-03.

**BR liên quan:** BR-01, BR-02.

---

## UC-EDU-07-02 — Phân công giáo viên cho lớp

| Thuộc tính | Nội dung |
|-----------|----------|
| Trigger | Bước 3 wizard mở lớp; hoặc đổi GV giữa khóa |
| Precondition | GV active, dạy đúng môn của course |
| Postcondition | class_teachers ghi nhận; sessions tương lai gán GV; GV nhận thông báo |

**Luồng chính**

| Bước | Actor | Hệ thống |
|------|-------|----------|
| 1 | Chọn GV chính + trợ giảng | Filter GV theo môn của course |
| 2 | Xác nhận | Check teacher_subjects khớp; check trùng lịch toàn bộ session tương lai (1 query gộp) |
| 3 | — | Insert class_teachers; update sessions tương lai; push Teacher App |

**Luồng thay thế**

- A1: Đổi GV chính giữa khóa → nhập lý do → main cũ set to_date, buổi đã học giữ nguyên GV cũ, buổi tương lai sang GV mới.

**Luồng ngoại lệ**

- E1: Trùng lịch → 409 E-TCH-02 kèm danh sách buổi xung đột → chọn GV khác hoặc đổi lịch.
- E2: Sai môn → 422 E-TCH-01.
- E3: Lớp completed → 409 E-TCH-04.

**BR liên quan:** BR-02, BR-03, BR-04, BR-05.

---

## UC-EDU-07-03 — Gán giáo viên dạy thay

| Thuộc tính | Nội dung |
|-----------|----------|
| Trigger | GV chính báo bận đột xuất |
| Postcondition | Buổi đó có substitute; các buổi khác không đổi |

**Luồng chính**

1. Giáo vụ mở buổi 15/07 → "Gán dạy thay" → chọn GV B + lý do.
2. Hệ thống check lịch B rảnh khung đó → lưu substitute_teacher_id.
3. Push: GV B (nhận buổi + link nội dung syllabus), GV A (được thay), Parent App (đổi GV buổi này).
4. Giờ dạy buổi này tính cho GV B (UC-04).

**Ngoại lệ:** B bận → 409 kèm gợi ý GV rảnh cùng môn; buổi đã completed → 422 E-TCH-05.

---

## UC-EDU-07-04 — Tổng hợp giờ dạy tháng

**Trigger:** Chốt lương cuối tháng (HR) / GV tự xem.

**Luồng chính**

1. Hệ thống tính: Σ duration các buổi completed trong tháng mà GV thực dạy (substitute ưu tiên hơn teacher gốc).
2. Manager xem breakdown theo lớp → export gửi HR Payroll.
3. Job đêm đối soát Education ↔ HR, chênh lệch → alert.

**Ngoại lệ:** buổi bị sửa trạng thái sau chốt lương → nằm trong kỳ đối soát tháng sau, có log.

**BR liên quan:** BR-05 (SRS §7 — giờ dạy theo attendance buổi completed).
