# Use Case — EDU-18 Certificate (Cấp chứng chỉ)

> Hana Edu | Version 1.0 | 2026-07-08 | Tham chiếu: `BRD - Education.md` § EDU-18, `SRS/SRS-EDU-18-Certificate.md`

---

## Danh mục Use Case

| ID | Tên | Actor chính |
|----|-----|-------------|
| UC-EDU-18-01 | Cấp chứng chỉ theo lô khi đóng lớp | Giáo vụ + Manager |
| UC-EDU-18-02 | Duyệt ngoại lệ điều kiện | Manager |
| UC-EDU-18-03 | Thiết kế template chứng chỉ | Manager |
| UC-EDU-18-04 | Xác thực chứng chỉ qua QR | Người ngoài (public) |
| UC-EDU-18-05 | Thu hồi & cấp lại | Manager |

## Sơ đồ Actor – Use Case

```
System ────► eligibility engine (điểm + chuyên cần + học phí)
Giáo vụ ────► UC-01 (trình phát hành)
Manager ────► UC-01 (duyệt), UC-02, UC-03, UC-05
Parent/Student ────► nhận, tải, chia sẻ chứng chỉ
Người ngoài ────► UC-04 (không cần đăng nhập)
Finance ────► điều kiện công nợ
```

---

## UC-EDU-18-01 — Cấp chứng chỉ theo lô

| Thuộc tính | Nội dung |
|-----------|----------|
| Trigger | Lớp completed, score_finals chốt (từ UC-EDU-17-04) |
| Precondition | Template course đã cấu hình |
| Postcondition | Chứng chỉ issued (số hiệu + PDF + QR); PH nhận thông báo; student → completed |

**Luồng chính**

| Bước | Actor | Hệ thống |
|------|-------|----------|
| 1 | Giáo vụ mở màn phát hành lớp | Eligibility engine check 3 điều kiện từng em: điểm ≥ Đạt, chuyên cần ≥80%, công nợ = 0 |
| 2 | — | Bảng 18 em: 15 ✓; 2 thiếu chuyên cần (78%, 75%); 1 nợ 500k |
| 3 | Chọn 15 em ✓, trình duyệt | Tạo yêu cầu phát hành |
| 4 | Manager duyệt | Transaction sinh số hiệu tuần tự HANA/2026/00123... (atomic) |
| 5 | — | Queue render 15 PDF (template + QR verify) → issued → push + email PH |

**Luồng thay thế:** A1: em nợ 500k đóng nốt → re-check → phát hành bổ sung cấp lẻ.

**Luồng ngoại lệ**

- E1: render fail 1 PDF → retry riêng, số hiệu giữ nguyên, các PDF khác không ảnh hưởng.
- E2: cấp trùng (student, class) → 409 E-CER-03.

**BR liên quan:** BR-01, BR-02, BR-03, BR-06.

---

## UC-EDU-18-02 — Duyệt ngoại lệ

**Trigger:** Em chuyên cần 78% (thiếu 2%) nhưng điểm giỏi, lý do vắng chính đáng.

**Luồng chính:** Giáo vụ đề xuất ngoại lệ + lý do → Manager xem hồ sơ (điểm, lịch sử vắng, lý do) → Approve → em vào danh sách phát hành với exception log (người duyệt, lý do).

**Ngoại lệ:** phát hành khi exception chưa duyệt → 403 E-CER-02; reject → em không được cấp, PH được thông báo điều kiện thiếu.

**BR liên quan:** BR-01.

---

## UC-EDU-18-03 — Thiết kế template

**Luồng chính**

1. Manager upload ảnh nền A4 ngang (300dpi) cho course.
2. Kéo thả field lên canvas: tên học viên, khóa, xếp loại, ngày cấp, số hiệu, QR — chỉnh font/size/màu/căn.
3. Preview với dữ liệu mẫu → lưu.
4. Course không có template riêng → dùng template mặc định business.

**Ngoại lệ:** thiếu field bắt buộc (tên/số hiệu/QR) → 422 khi lưu.

**BR liên quan:** BR-03.

---

## UC-EDU-18-04 — Xác thực qua QR

| Thuộc tính | Nội dung |
|-----------|----------|
| Actor | Người ngoài (trường học, đơn vị tuyển) |
| Precondition | Không cần đăng nhập |
| Postcondition | Biết chứng chỉ hợp lệ/thu hồi trong < 2s |

**Luồng chính**

1. Quét QR trên chứng chỉ → mở trang verify public.
2. Trang hiển thị: tên học viên, khóa, xếp loại, ngày cấp, trạng thái "Hợp lệ" nổi bật (không SĐT/ngày sinh).
3. Hoặc nhập số hiệu tay trên trang tra cứu.

**Ngoại lệ:** mã không tồn tại → "Không tìm thấy chứng chỉ" (trung tính, không lộ thông tin); vượt rate limit 30 req/phút/IP → 429.

**BR liên quan:** BR-04.

---

## UC-EDU-18-05 — Thu hồi & cấp lại

**Trigger:** Phát hiện sai tên trên chứng chỉ đã phát hành.

**Luồng chính**

1. Manager /revoke HANA/2026/00123 + lý do "Sai tên học viên".
2. Verify page phản ánh "Đã thu hồi" ≤ 60s (purge cache); PH nhận thông báo.
3. Sửa tên học viên (UC-EDU-01) → cấp lại: số hiệu mới 00124, replaces 00123.
4. Verify 00123 hiển thị "Đã thu hồi — thay bằng 00124"; 00124 "Hợp lệ".

**Ràng buộc:** số hiệu không tái sử dụng; bản cũ giữ vĩnh viễn trong hệ thống phục vụ tra soát.

**BR liên quan:** BR-02, BR-05.
