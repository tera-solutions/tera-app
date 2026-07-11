# Screen Specification — EDU-05 Level Management

> Hana Edu | Version 1.0 | 2026-07-08 | Web Admin
>
> Tham chiếu: `SRS/SRS-EDU-05-Level.md`, `UseCase/UC-EDU-05-Level.md`

---

## Danh sách màn hình

| ID | Màn hình | Loại |
|----|----------|------|
| SCR-EDU-05-01 | Danh mục cấp độ | Tab trong "Danh mục đào tạo" |
| SCR-EDU-05-02 | Tạo/Sửa cấp độ | Dialog |
| SCR-EDU-05-03 | Sơ đồ lộ trình | Panel phụ |

---

## SCR-EDU-05-01 — Danh mục cấp độ

**Route:** /edu/catalog?tab=levels

```
┌──────────────────────────────────────────────────────────┐
│                                   [Xem lộ trình] [+ Thêm]│
│ ⠿ | Pre-A1    | 4–6t  | → Starters | 2 khóa | ●active ✎ │
│ ⠿ | Starters  | 6–8t  | → Movers   | 4 khóa | ●active ✎ │
│ ⠿ | Movers    | 8–10t | → Flyers   | 3 khóa | ●active ✎ │
│ ⠿ | Flyers    | 9–11t | → (cuối)   | 2 khóa | ●active ✎ │
└──────────────────────────────────────────────────────────┘
```

- Cột "→ next": chip level kế tiếp, "(cuối)" nếu null.
- Kéo thả sort_order = thứ bậc thấp→cao.

---

## SCR-EDU-05-02 — Dialog Tạo/Sửa

| Trường | Control | Validation |
|--------|---------|-----------|
| Tên * | Text | 2–100 unique |
| Mã | Text | Auto-slug |
| Độ tuổi khuyến nghị | Range | 3–18 |
| Level kế tiếp | Select (loại trừ chính nó) | Chọn gây vòng lặp → lỗi inline "Tạo vòng lặp: Movers → Flyers → Movers" (E-LVL-02) |
| Mô tả | Textarea | — |

---

## SCR-EDU-05-03 — Panel Sơ đồ lộ trình

Mở bằng nút [Xem lộ trình] — drawer phải:

```
Pre-A1 (4-6t)
   │
Starters (6-8t) ── 4 khóa active
   │
Movers (8-10t) ── 3 khóa active
   │
Flyers (9-11t) ── 2 khóa active
```

- Node click → filter danh sách khóa học theo level.
- Node không có course active → cảnh báo vàng "Thiếu khóa học nối tiếp" (phục vụ BF-10).

---

## Trạng thái

Xóa level đang có course → disable + tooltip (E-LVL-03). Chuỗi bị đứt (next bị xóa) → hiển thị "→ (chưa đặt)" màu vàng.
