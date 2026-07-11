# Use Case — EDU-04 Subject Management

> Hana Edu | Version 1.0 | 2026-07-08 | Tham chiếu: `BRD - Education.md` § EDU-04, `SRS/SRS-EDU-04-Subject.md`

---

## Danh mục Use Case

| ID | Tên | Actor chính |
|----|-----|-------------|
| UC-EDU-04-01 | Tạo môn học | Admin/Manager |
| UC-EDU-04-02 | Ngừng sử dụng môn học | Admin/Manager |
| UC-EDU-04-03 | Sắp xếp thứ tự hiển thị | Admin/Manager |

## Sơ đồ Actor – Use Case

```
Admin/Manager ────► UC-01, UC-02, UC-03
Role đào tạo ────► xem (dropdown, filter)
Website ────► thứ tự chương trình theo sort_order
```

---

## UC-EDU-04-01 — Tạo môn học

| Thuộc tính | Nội dung |
|-----------|----------|
| Precondition | Quyền `edu.subject.manage`; tên chưa tồn tại |
| Postcondition | Subject active, khả dụng trong form tạo course |

**Luồng chính**

1. Mở "Danh mục đào tạo" → tab Môn học → Thêm.
2. Nhập tên ("Jolly Phonics"), code (auto-slug), chọn icon + màu, mô tả.
3. Lưu → xuất hiện trong bảng + dropdown course; cache invalidate.

**Ngoại lệ:** trùng tên/code → 422 E-SBJ-01.

**BR liên quan:** BR-01.

---

## UC-EDU-04-02 — Ngừng sử dụng môn học

**Trigger:** Không còn tuyển sinh chương trình này.

**Luồng chính:** đổi status → inactive → biến mất khỏi dropdown tạo course mới; course cũ vẫn hiển thị đúng tên môn.

**Luồng thay thế:** muốn xóa hẳn → chỉ khi courses_count = 0; ngược lại 409 E-SBJ-02 kèm số course tham chiếu.

**BR liên quan:** BR-02.

---

## UC-EDU-04-03 — Sắp xếp thứ tự hiển thị

**Luồng chính:** kéo thả hàng trong bảng → FE gửi mảng id thứ tự mới → bulk update sort_order → dropdown + Website đổi thứ tự sau cache invalidate.

**Ngoại lệ:** 2 người cùng sắp xếp → lần lưu sau thắng (last-write-wins, dữ liệu nhỏ chấp nhận được).

**BR liên quan:** BR-03.
