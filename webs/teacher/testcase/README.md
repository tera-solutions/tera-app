# Bộ Test Case — Teacher Web App (Hana Edu)

> Nguồn tham chiếu: `agents/claude/teacher/docs` (BRD/SRS/UseCase/ScreenSpec), `agents/claude/teacher/business.md` (luồng nghiệp vụ Teacher), `agents/claude/teacher/tasks` (28 file đặc tả màn hình đã triển khai, task 030–067).
> Ngày tạo: 2026-07-17

## Cấu trúc

- Mỗi màn hình đã triển khai có 1 file `.md` riêng (giữ nguyên tên file gốc trong `tasks/`), gồm: metadata (Task ID/Route), tiền điều kiện chung, và bảng test case chi tiết (TC ID, Tiêu đề, Loại, Ưu tiên, Tiền điều kiện, Các bước, Dữ liệu test, Kết quả mong đợi).
- `testcase_master.csv` — bản tổng hợp toàn bộ test case từ 28 file `.md` thành 1 file CSV phẳng (mở bằng Excel/Google Sheets hoặc import vào công cụ quản lý test như TestRail/Xray).

## Danh sách 28 màn hình

| Task ID | Màn hình | File |
|---|---|---|
| 030 | Đăng nhập | `030_dang_nhap_screen.md` |
| 031 | Trang chủ (Dashboard) | `031_trang_chu_screen.md` |
| 032 | Thông báo | `032_thong_bao_screen.md` |
| 033 | Lịch dạy | `033_lich_day_screen.md` |
| 034 | Lớp học | `034_lop_hoc_screen.md` |
| 035 | Chi tiết lớp học | `035_chi_tiet_lop_hoc_screen.md` |
| 036 | Giáo án | `036_giao_an_screen.md` |
| 037 | Bài học | `037_bai_hoc_screen.md` |
| 038 | Điểm danh | `038_diem_danh_screen.md` |
| 039 | Học viên | `039_hoc_vien_screen.md` |
| 040 | Chi tiết học viên | `040_chi_tiet_hoc_vien_screen.md` |
| 041 | Nhận xét học viên | `041_nhan_xet_hoc_vien_screen.md` |
| 042 | Bài tập | `042_bai_tap_screen.md` |
| 043 | Chấm bài | `043_cham_bai_screen.md` |
| 044 | Bài kiểm tra | `044_bai_kiem_tra_screen.md` |
| 045 | Chi tiết bài kiểm tra | `045_chi_tiet_bai_kiem_tra_screen.md` |
| 046 | Thành tích | `046_thanh_tich_screen.md` |
| 047 | Bảng xếp hạng | `047_bang_xep_hang_screen.md` |
| 048 | Tin nhắn | `048_tin_nhan_screen.md` |
| 049 | Hồ sơ cá nhân | `049_ho_so_ca_nhan_screen.md` |
| 060 | Đăng ký | `060_dang_ky_screen.md` |
| 061 | Phụ huynh | `061_phu_huynh_screen.md` |
| 062 | Chi tiết phụ huynh | `062_chi_tiet_phu_huynh_screen.md` |
| 063 | Phòng học | `063_phong_hoc_screen.md` |
| 064 | Chi tiết phòng học | `064_chi_tiet_phong_hoc_screen.md` |
| 065 | Chi tiết khóa học | `065_chi_tiet_khoa_hoc_screen.md` |
| 066 | Ghi danh học viên | `066_ghi_danh_hoc_vien_screen.md` |
| 067 | Chuyển lớp | `067_chuyen_lop_screen.md` |

## Thống kê

- Tổng số màn hình: 28
- Tổng số test case: 529
- Cột `Loại` gồm: Functional, UI-Validation, Permission, Error-Handling, Edge-Case
- Cột `Ưu tiên` gồm: High (luồng chính), Medium (phụ/filter/phân trang), Low (UI phụ/responsive)

## Quy ước TC ID

`TC-<TaskID>-<STT>`, ví dụ `TC-038-05` = test case thứ 5 của màn hình Điểm danh (task 038).
