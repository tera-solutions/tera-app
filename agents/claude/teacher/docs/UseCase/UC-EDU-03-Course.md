# Use Case — EDU-03 Course Management

> Hana Edu | Version 1.0 | 2026-07-08 | Tham chiếu: `BRD - Education.md` § EDU-03, `SRS/SRS-EDU-03-Course.md`

---

## Danh mục Use Case

| ID | Tên | Actor chính |
|----|-----|-------------|
| UC-EDU-03-01 | Tạo & kích hoạt khóa học | Manager |
| UC-EDU-03-02 | Quản lý syllabus | Manager |
| UC-EDU-03-03 | Publish khóa lên Website | Manager |
| UC-EDU-03-04 | Thay giáo trình (duplicate + inactive) | Manager |

## Sơ đồ Actor – Use Case

```
Admin/Manager ────► UC-01 → UC-04
Giáo vụ/Sales ────► xem, chọn khi mở lớp / báo giá
Website (public) ────► đọc khóa is_published
```

---

## UC-EDU-03-01 — Tạo & kích hoạt khóa học

| Thuộc tính | Nội dung |
|-----------|----------|
| Precondition | Subject, Level đã tồn tại |
| Postcondition | Khóa active — khả dụng cho mở lớp và báo giá CRM |

**Luồng chính**

1. Manager tạo khóa (draft): tên, mã, subject, level, 48 buổi × 90 phút, tuổi 6–8, mô tả, ảnh.
2. Nhập syllabus (UC-02).
3. PATCH active → hệ thống validate đủ trường + ≥1 lesson.
4. Khóa xuất hiện trong wizard mở lớp + dropdown báo giá; cache invalidate.

**Luồng thay thế:** A1 (bước 3): syllabus < total_sessions → warning, Admin được bỏ qua.

**Ngoại lệ:** trùng mã → 422 E-CRS-01.

**BR liên quan:** BR-01, BR-02, BR-03.

---

## UC-EDU-03-02 — Quản lý syllabus

**Luồng chính:** mở tab Syllabus → thêm bài theo buổi (order, title, objective, materials) hoặc import xlsx → kéo thả đổi thứ tự → lưu (replace toàn bộ, transaction).

**Ngoại lệ:** order trùng → 422 E-CRS-05; import sai template → file lỗi từng dòng.

---

## UC-EDU-03-03 — Publish khóa lên Website

| Thuộc tính | Nội dung |
|-----------|----------|
| Precondition | Khóa status=active |
| Postcondition | Khóa hiển thị public ≤ 1 phút (cache purge) |

**Luồng chính:** bật is_published → hệ thống validate active → purge cache CDN → Website `GET /api/website/courses` trả khóa (bản rút gọn, ẩn thông tin nội bộ) → form đăng ký học thử trên Website nhận khóa này.

**Ngoại lệ:** khóa draft/inactive → 422 E-CRS-03.

**BR liên quan:** BR-03 (validation publish).

---

## UC-EDU-03-04 — Thay giáo trình

**Trigger:** Đổi giáo trình từ kỳ tuyển sinh sau, các lớp đang chạy giữ chương trình cũ.

**Luồng chính**

1. Duplicate khóa cũ → bản sao draft (code mới, đủ syllabus).
2. Sửa syllabus bản mới → active → publish.
3. Unpublish + inactive bản cũ.
4. Bản cũ: lớp ongoing chạy tiếp bình thường; không mở lớp mới được nữa.

**Ngoại lệ:** inactive khi còn lớp ongoing → 409 E-CRS-02 kèm danh sách lớp — phải đợi lớp kết thúc hoặc chỉ unpublish trước.

**BR liên quan:** BR-04.
