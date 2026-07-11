# Use Case — EDU-13 Homework (Giao bài tập)

> Hana Edu | Version 1.0 | 2026-07-08 | Tham chiếu: `BRD - Education.md` § EDU-13, `SRS/SRS-EDU-13-Homework.md`

---

## Danh mục Use Case

| ID | Tên | Actor chính |
|----|-----|-------------|
| UC-EDU-13-01 | Giao bài cho cả lớp | Teacher |
| UC-EDU-13-02 | Giao bài cho nhóm học viên | Teacher |
| UC-EDU-13-03 | Gia hạn / đóng bài | Teacher |
| UC-EDU-13-04 | Dùng template bài tập | Teacher |
| UC-EDU-13-05 | Nhắc deadline tự động | System |

## Sơ đồ Actor – Use Case

```
Teacher ────► UC-01 → UC-04
System ────► UC-05
Student ────► nhận bài, xem (nộp: UC-EDU-14)
Parent ────► theo dõi read-only + nhận thông báo
Giáo vụ ────► giám sát danh sách bài theo lớp
```

---

## UC-EDU-13-01 — Giao bài cho cả lớp

| Thuộc tính | Nội dung |
|-----------|----------|
| Actor chính | Teacher (GV của lớp) |
| Trigger | Kết thúc buổi học |
| Precondition | Lớp ongoing |
| Postcondition | Bài assigned; mọi học viên active nhận push ≤ 2 phút |

**Luồng chính**

| Bước | Actor | Hệ thống |
|------|-------|----------|
| 1 | Từ màn buổi học bấm "Giao bài" | Form với deadline mặc định = buổi kế tiếp |
| 2 | Nhập tiêu đề, chụp 2 ảnh workbook | Upload presigned URL, nén client ~1MB |
| 3 | Bấm "Giao bài" | Tạo homework → assigned; resolve 18 học viên active |
| 4 | — | Fan-out push Student App + Parent App; list bài hiển thị progress 0/18 |

**Luồng thay thế:** A1: lưu draft trước, giao sau (VD chuẩn bị trước buổi học).

**Luồng ngoại lệ:** E1: GV lớp khác → 403 E-HWK-01; E2: file quá 20MB → 422 E-HWK-04 chặn từ client; E3: lớp completed → 409 E-HWK-05.

**BR liên quan:** BR-01, BR-03, BR-05.

---

## UC-EDU-13-02 — Giao bài cho nhóm

**Trigger:** Bài phụ đạo riêng cho 3 học viên yếu.

**Luồng chính:** như UC-01 nhưng chọn assign_scope=selected + tick 3 học viên → chỉ 3 em nhận bài và thấy trong app; 15 em còn lại không thấy.

**Ngoại lệ:** selected rỗng / học viên ngoài lớp → 422 E-HWK-06.

**BR liên quan:** BR-01.

---

## UC-EDU-13-03 — Gia hạn / đóng bài

**Luồng chính (gia hạn):** quá deadline nhiều em chưa nộp → GV /extend deadline +2 ngày → push học viên chưa nộp + Parent App.

**Luồng chính (đóng):** đủ bài hoặc hết thời gian → /close → không nhận nộp thêm → chuyển sang chấm (UC-EDU-15-01). Auto-close theo Setting sau deadline + X ngày.

**Ngoại lệ:** extend giảm deadline → 422 E-HWK-03; xóa bài đã có submission → 409 E-HWK-02 (chỉ được đóng).

**BR liên quan:** BR-04, BR-05.

---

## UC-EDU-13-04 — Dùng template

**Luồng chính:** GV mở thư viện template cá nhân → chọn "Workbook Unit 5" → form pre-fill nội dung + file (reference cùng storage) → chỉnh deadline → giao. Lưu bài hay dùng thành template mới từ bài đã tạo.

**Luồng thay thế:** template shared toàn business → Manager duyệt trước khi GV khác thấy.

---

## UC-EDU-13-05 — Nhắc deadline tự động

**Actor:** System (scheduler).

**Luồng chính:** deadline − 24h và − 2h → query học viên trong scope CHƯA có submission → push Student App + Parent App "Bài X sắp hết hạn".

**Ràng buộc:** không gửi học viên đã nộp; bài closed không nhắc.
