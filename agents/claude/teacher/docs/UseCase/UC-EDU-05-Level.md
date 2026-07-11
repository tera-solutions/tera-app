# Use Case — EDU-05 Level Management

> Hana Edu | Version 1.0 | 2026-07-08 | Tham chiếu: `BRD - Education.md` § EDU-05, `SRS/SRS-EDU-05-Level.md`

---

## Danh mục Use Case

| ID | Tên | Actor chính |
|----|-----|-------------|
| UC-EDU-05-01 | Thiết lập chuỗi cấp độ (lộ trình) | Admin/Manager |
| UC-EDU-05-02 | Gợi ý khóa học tiếp theo | System |
| UC-EDU-05-03 | Sắp xếp thứ bậc | Admin/Manager |

## Sơ đồ Actor – Use Case

```
Admin/Manager ────► UC-01, UC-03
System ────► UC-02 (khi enrollment completed)
Sales/CRM ────► nhận gợi ý từ UC-02 để tư vấn
```

---

## UC-EDU-05-01 — Thiết lập chuỗi cấp độ

| Thuộc tính | Nội dung |
|-----------|----------|
| Postcondition | Chuỗi Starters → Movers → Flyers không vòng lặp |

**Luồng chính**

1. Tạo từng level: tên, code, tuổi khuyến nghị, mô tả.
2. Với mỗi level, chọn next_level (VD Starters → Movers).
3. Hệ thống validate chuỗi (duyệt tối đa 20 bước, phát hiện vòng lặp).
4. Sắp thứ bậc sort_order thấp → cao.

**Ngoại lệ**

- E1: next_level = chính nó → 422.
- E2: A→B→C→A → 422 E-LVL-02 kèm chain [A,B,C,A].
- E3: xóa level đang có course → 409 E-LVL-03.

**BR liên quan:** BR-01, BR-02, BR-03.

---

## UC-EDU-05-02 — Gợi ý khóa học tiếp theo

| Thuộc tính | Nội dung |
|-----------|----------|
| Actor | System (listener `EnrollmentCompleted`) |
| Trigger | Học viên hoàn thành khóa (lớp đóng) |
| Postcondition | CRM nhận task tư vấn; Parent App nhận gợi ý |

**Luồng chính**

1. Enrollment completed → lấy level của course vừa xong.
2. Tra next_level_id → danh sách course active thuộc level đó.
3. Có khóa → tạo task Sales "Tư vấn tái ghi danh" kèm gợi ý + push Parent App.

**Luồng thay thế:** A1: level cuối chuỗi (không có next) → task tư vấn không kèm gợi ý cụ thể. A2: next_level không có course active → alert Manager (thiếu sản phẩm nối tiếp).

---

## UC-EDU-05-03 — Sắp xếp thứ bậc

Tương tự UC-EDU-04-03 (kéo thả, bulk update sort_order); thứ bậc dùng cho hiển thị lộ trình và báo cáo phân bố học viên theo level.
