# Use Case — EDU-02 Parent Management

> Hana Edu | Version 1.0 | 2026-07-08 | Tham chiếu: `BRD - Education.md` § EDU-02, `SRS/SRS-EDU-02-Parent.md`

---

## Danh mục Use Case

| ID | Tên | Actor chính |
|----|-----|-------------|
| UC-EDU-02-01 | Tạo phụ huynh & liên kết học viên | Giáo vụ |
| UC-EDU-02-02 | Liên kết thêm con vào phụ huynh có sẵn | Giáo vụ |
| UC-EDU-02-03 | Đổi phụ huynh chính | Giáo vụ |
| UC-EDU-02-04 | Tạo tài khoản Parent App | Giáo vụ |
| UC-EDU-02-05 | Gộp hồ sơ trùng (merge) | Manager |

## Sơ đồ Actor – Use Case

```
Giáo vụ ────► UC-01, UC-02, UC-03, UC-04
Manager ────► tất cả + UC-05 (merge)
Parent ────► tự cập nhật thông tin cơ bản trên App; xem hồ sơ
Teacher ────► xem phụ huynh lớp mình (SĐT mask)
```

---

## UC-EDU-02-01 — Tạo phụ huynh & liên kết học viên

| Thuộc tính | Nội dung |
|-----------|----------|
| Actor chính | Giáo vụ |
| Trigger | Thường chạy inline trong UC-EDU-01-01; hoặc tạo độc lập |
| Precondition | SĐT chưa tồn tại trong business |
| Postcondition | Parent tạo, liên kết student với relationship + is_primary |

**Luồng chính**

| Bước | Actor | Hệ thống |
|------|-------|----------|
| 1 | Nhập SĐT | Check unique realtime (debounce 400ms) |
| 2 | Nhập tên, email?, nghề nghiệp? | Validate |
| 3 | Chọn học viên liên kết + relationship + is_primary | Nếu student đã có primary khác → cảnh báo sẽ chuyển primary |
| 4 | Lưu | Transaction: tạo parent + parent_student; đảm bảo đúng 1 primary/student |

**Luồng thay thế**

- A1 (bước 1): SĐT tồn tại → 422 E-PAR-01 kèm hồ sơ trùng → chuyển sang UC-02 (liên kết vào hồ sơ có sẵn).

**Luồng ngoại lệ**

- E1: 2 giáo vụ tạo cùng SĐT đồng thời → unique constraint, người sau nhận E-PAR-01.

**BR liên quan:** BR-01 (SĐT unique), BR-02 (n–n + primary duy nhất).

---

## UC-EDU-02-02 — Liên kết thêm con vào phụ huynh có sẵn

**Trigger:** Con thứ 2 nhập học.

**Luồng chính**

1. Từ hồ sơ học viên mới → tab Phụ huynh → "Liên kết phụ huynh có sẵn".
2. Tìm theo SĐT → chọn hồ sơ → chọn relationship, is_primary.
3. Hệ thống tạo liên kết; nếu is_primary → bỏ cờ primary cũ của học viên đó.
4. Push Parent App: "Đã liên kết bé B vào tài khoản của bạn" — app hiển thị đủ 2 con.

**Ngoại lệ:** liên kết đã tồn tại → 409; SĐT không tìm thấy → gợi ý tạo mới (UC-01).

---

## UC-EDU-02-03 — Đổi phụ huynh chính

**Trigger:** Gia đình đổi người liên hệ nhận thông báo/học phí.

**Luồng chính:** mở học viên → tab Phụ huynh → toggle is_primary sang người khác → hệ thống transaction swap cờ → thông báo học phí/điểm danh từ nay gửi người mới.

**Ngoại lệ:** hủy liên kết người là primary duy nhất → 409 E-PAR-03 (student luôn phải có ≥1 phụ huynh, và có đúng 1 primary).

**BR liên quan:** BR-02, BR-03.

---

## UC-EDU-02-04 — Tạo tài khoản Parent App

| Thuộc tính | Nội dung |
|-----------|----------|
| Precondition | Parent có SĐT hợp lệ, chưa có user |
| Postcondition | User role Parent (username=phone); OTP đã gửi |

**Luồng chính**

1. Giáo vụ bấm "Tạo tài khoản app" → hệ thống tạo user + gửi SMS OTP kích hoạt.
2. Phụ huynh cài app → đăng nhập SĐT → nhập OTP → đặt mật khẩu.
3. App load danh sách tất cả con liên kết.

**Ngoại lệ:** OTP hết hạn (5') → gửi lại (tối đa 3 lần/15', vượt → 429 E-PAR-05); SĐT đổi chủ → Manager reset + xác minh thủ công.

---

## UC-EDU-02-05 — Gộp hồ sơ trùng (Merge)

| Thuộc tính | Nội dung |
|-----------|----------|
| Actor chính | Manager |
| Trigger | Phát hiện 2 hồ sơ cùng người (thường sau import) |
| Precondition | 2 hồ sơ khác nhau, cùng business |
| Postcondition | Target giữ toàn bộ liên kết + lịch sử; source soft delete + log |

**Luồng chính**

1. Manager chọn 2 hồ sơ → màn so sánh side-by-side → chọn hồ sơ giữ (target).
2. Xác nhận → transaction: chuyển parent_student (khử trùng lặp), chuyển user app nếu target chưa có.
3. Async: cập nhật payer invoice bên Finance (saga có retry); ghi `parent_merge_logs`.
4. Hoàn tất → toast + source biến mất khỏi danh sách.

**Ngoại lệ:** merge chính nó / hồ sơ đã xóa → 422 E-PAR-04; bước Finance fail sau retry → alert admin xử lý tay (dữ liệu Education đã nhất quán).

**BR liên quan:** BR-04.
