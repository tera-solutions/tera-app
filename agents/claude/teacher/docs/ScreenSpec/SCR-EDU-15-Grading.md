# Screen Specification — EDU-15 Grading (Chấm bài)

> Hana Edu | Version 1.0 | 2026-07-08 | Teacher App + Web + Student/Parent App
>
> Tham chiếu: `SRS/SRS-EDU-15-Grading.md`, `UseCase/UC-EDU-15-Grading.md`

---

## Danh sách màn hình

| ID | Màn hình | Loại | Nền tảng |
|----|----------|------|----------|
| SCR-EDU-15-01 | Chấm bài (flow chuỗi) | Screen | Teacher App |
| SCR-EDU-15-02 | Annotation trên ảnh | Overlay | Teacher App |
| SCR-EDU-15-03 | Grid chấm bài | Page | Web |
| SCR-EDU-15-04 | Dashboard tiến độ chấm | Widget/Page | Web |
| SCR-EDU-15-05 | Xem kết quả chấm | Screen | Student/Parent App |

---

## SCR-EDU-15-01 — Teacher App: Chấm bài

```
┌────────────────────────────────┐
│ ← Chấm bài (3/18) · Bé Chi     │
│ ┌────────────────────────────┐ │
│ │  [ảnh bài làm]             │ │
│ │  ◀ swipe ▶ · pinch zoom    │ │
│ │  [✏️ vẽ]  (audio: ▶ 0:42)  │ │
│ └────────────────────────────┘ │
│ Điểm (thang 10):               │
│ (5)(6)(7)(8)(9)(10) [8.5_]     │
│ Nhận xét:                      │
│ [Con làm tốt, chú ý...______]  │
│ [💬 mẫu ▾] [🎤 ghi âm nhận xét] │
│ ┌──────────────┬─────────────┐ │
│ │ LÀM LẠI      │ LƯU & TIẾP ▶│ │
│ └──────────────┴─────────────┘ │
└────────────────────────────────┘
```

- Header đếm tiến độ hàng đợi; thang điểm render theo grading_scheme (chips điểm / A-D / ⭐1-5).
- [💬 mẫu]: bottom sheet câu nhận xét, placeholder {student_name} tự thay.
- [Lưu & tiếp]: 1 API call, response kèm bài kế → chuyển ngay không loading.
- [Làm lại]: nhập nhận xét bắt buộc → submission → redo.
- Hết hàng đợi: màn tổng kết "18/18 ✓ · điểm TB 8.2" + [Xong].

---

## SCR-EDU-15-02 — Annotation overlay

```
│ [ảnh full-screen]              │
│ Tools: ⭕ khoanh ✏️ vẽ ➖ gạch  │
│ Màu: 🔴🔵🟢  [↩ undo] [🗑 xóa]  │
│         [XONG]                 │
```

Layer vector lưu riêng (ảnh gốc không đổi); undo theo shape; render lại đúng trên mọi client.

---

## SCR-EDU-15-03 — Web: Grid chấm

**Route:** /edu/homework/:id/grading — cho GV thích chấm máy tính:

```
│ HV      | Bài nộp        | Điểm  | Nhận xét         | TT    │
│ Bé An   | [2 ảnh] [xem]  | [8.5] | [___________]    | ✓     │
│ Bé Chi  | [🎤 0:42]      | [___] | [___________]    | chờ   │
│ ☑ chọn nhiều → [Bulk: điểm __ + nhận xét mẫu ▾] [Áp dụng]  │
```

Enter = lưu dòng + focus dòng sau; panel preview bài bên phải khi focus.

---

## SCR-EDU-15-04 — Dashboard tiến độ chấm (Giáo vụ)

```
│ GV       | Chờ chấm | Quá 3 ngày |          │
│ Ms. Lan  |    4     |     0      |          │
│ Mr. John |   12     |     5 🔴   | [Nhắc]   │
│ Thời gian chấm TB toàn trung tâm: 1.8 ngày  │
```

Row đỏ khi quá hạn; [Nhắc] gửi push GV; click số → danh sách bài cụ thể.

---

## SCR-EDU-15-05 — Student/Parent App: Kết quả

```
┌────────────────────────────┐
│ Workbook tr.24-25          │
│      ⭐ 8.5 / 10           │
│ "Con làm tốt, chú ý chính  │
│  tả nhé!" — Ms. Lan        │
│ [▶ nghe nhận xét 0:32]     │
│ ┌────────────────────────┐ │
│ │ [ảnh bài + khoanh đỏ]  │ │
│ │ (annotation overlay)   │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```

Điểm sticker (lớp nhỏ): hiển thị ⭐⭐⭐⭐⭐ to, animation. Điểm bị điều chỉnh sau duyệt → dòng "Điểm đã điều chỉnh 8.5 → 9.0 (lý do)".

---

## Sửa điểm sau 7 ngày (Web dialog)

GV: [Đề xuất sửa] {điểm mới, lý do} → trạng thái "chờ duyệt" hiển thị trên bài. Manager: hàng đợi duyệt (bảng old/new/lý do) → [Duyệt]/[Từ chối]. Sau duyệt: recalc + re-notify tự động.

---

## Trạng thái

Chấm bài đã bị chấm bởi thiết bị khác → 409 → hiển thị điểm hiện tại, chuyển mode sửa. Audio nhận xét >3' → chặn khi ghi. Offline: chấm được, sync như điểm danh.
