# BRD v2 — Hana Edu chuyển mô hình: Giáo viên tự vận hành "Trung tâm mini"

> Business Requirements Document — Pivot Document
>
> Version: 2.0 | Ngày: 2026-07-17 | Trạng thái: Draft
>
> **Quan hệ với tài liệu cũ:** Tài liệu này KHÔNG thay thế toàn bộ `BRD - Education.md`, `Business Requirement.md`, `readme.md` — các đặc tả chức năng chi tiết (Business Rules, API, Database Design...) của từng EDU-xx vẫn giữ nguyên giá trị tham khảo kỹ thuật. Tài liệu này **thay đổi tầng actor/quyền/tenant** phía trên các chức năng đó, và bổ sung các module hoàn toàn mới (Marketplace nội dung, Ví giáo viên, Gói thuê bao, Chứng nhận, Thành tích học viên). Mục 9 liệt kê chính xác phần nào của tài liệu cũ bị ảnh hưởng.
>
> **Bối cảnh:** Toàn bộ nội dung dưới đây được đối chiếu với hiện trạng thật của ứng dụng Teacher Web (đã review mã nguồn + test trực tiếp trên `teacher.anhnguhana.com`, xem báo cáo `work/01-Thong-ke-chuc-nang-da-lam.md`, `work/02-Chuc-nang-thieu-va-de-xuat.md`, `test/30-Thong-ke-tong-hop.md`). Nhiều phần hạ tầng cho mô hình mới **đã tồn tại sẵn** (Đăng ký giáo viên, Gói đăng ký, Ví cá nhân, Hóa đơn...) chỉ cần điều chỉnh quyền và nối luồng nghiệp vụ.

---

# 1. Tổng quan mô hình mới

## 1.1 Vấn đề của mô hình cũ

Mô hình hiện tại (`BRD - Education.md`) là **1 trung tâm Anh ngữ nhiều chi nhánh, nhiều nhân sự**: Admin/Manager/Giáo vụ vận hành, Giáo viên chỉ là nhân sự thực thi (dạy, điểm danh, giao bài, chấm bài) — không có quyền tạo khóa học, lớp học, phòng học, và không sở hữu quan hệ tài chính với phụ huynh (phụ huynh trả tiền cho **trung tâm**, trung tâm trả lương cho **giáo viên**).

## 1.2 Mô hình mới: Teacher-as-Tenant (Giáo viên = 1 "trung tâm mini")

Mỗi giáo viên đăng ký tài khoản trở thành **chủ sở hữu một trung tâm dạy thêm độc lập** (mini center) bên trong nền tảng Hana Edu:

- Giáo viên **tự tạo và quản lý toàn bộ danh mục đào tạo** của mình: Môn học, Trình độ, Khóa học, Lớp học, Phòng học/địa điểm dạy.
- Giáo viên **tự quản lý học viên và phụ huynh** của mình (CRM thu nhỏ: Lead → tiềm năng → học viên).
- Giáo viên **thu học phí trực tiếp từ phụ huynh** vào Ví giáo viên, và **rút tiền** về tài khoản ngân hàng.
- Đổi lại, giáo viên **trả phí thuê bao (subscription)** cho nền tảng Hana Edu để được sử dụng phần mềm, theo các gói giới hạn số lớp/học viên/tính năng.
- Nền tảng Hana Edu đóng vai trò **SaaS Provider + Content Marketplace**: bán gói phần mềm, và vận hành chợ nội dung (ngân hàng câu hỏi, tài liệu, học liệu, giáo trình) để giáo viên mua thêm.

```
                    ┌─────────────────────────────────────────┐
                    │        HANA EDU PLATFORM (SaaS)          │
                    │  - Bán gói thuê bao cho Giáo viên        │
                    │  - Vận hành Content Marketplace          │
                    │  - Quản trị nền tảng (Superadmin)        │
                    └───────────────┬───────────────────────────┘
                                    │ thuê bao (Invoice nền tảng)
                                    ▼
        ┌───────────────────────────────────────────────────────┐
        │      GIÁO VIÊN = CHỦ "TRUNG TÂM MINI" (Tenant)         │
        │  - Toàn quyền: Course/Level/Subject/Class/Room         │
        │  - CRM riêng: Lead → Student → Parent                  │
        │  - Thu học phí → Ví giáo viên → Rút tiền               │
        │  - Mua nội dung từ Marketplace bằng Ví                 │
        └───────────────┬─────────────────────────────────────────┘
                         │ dạy & thu học phí
                         ▼
              ┌────────────────────────┐
              │   Phụ huynh / Học viên   │
              └────────────────────────┘
```

## 1.3 Actor mới

| Actor | Vai trò trong mô hình mới | Khác biệt so với mô hình cũ |
|---|---|---|
| **Platform Admin (Superadmin)** | Quản trị nền tảng: duyệt/khóa tài khoản giáo viên, cấu hình gói thuê bao, quản lý Marketplace, xem doanh thu nền tảng | Trước đây gọi là "Admin" quản lý trung tâm; nay tách hẳn thành quản trị **nền tảng SaaS** (đã có sẵn `Superadmin/*` trong code) |
| **Teacher (chủ trung tâm mini)** | Full quyền trên phạm vi dữ liệu của chính mình: danh mục đào tạo, CRM, vận hành lớp, tài chính | Trước đây chỉ có quyền `view`/thao tác giảng dạy; nay có toàn bộ quyền trước đây thuộc về Admin/Manager/Giáo vụ, nhưng **giới hạn trong phạm vi `teacher_id` của chính họ** |
| **Assistant (Trợ giảng) — tùy chọn** | Giáo viên có thể mời 1-2 trợ giảng vào trung tâm mini của mình, quyền do giáo viên tự cấp (subset quyền) | Khái niệm mới, không bắt buộc ở phase đầu |
| **Parent / Student** | Giữ nguyên vai trò, nhưng nay là khách hàng của **1 giáo viên cụ thể**, không phải của "trung tâm nhiều GV" | Không đổi về chức năng, đổi về phạm vi dữ liệu (thấy 1 giáo viên duy nhất, không thấy đa chi nhánh) |
| **Content Provider — tùy chọn tương lai** | Bên thứ 3 (hoặc chính Hana Edu) đăng bán ngân hàng câu hỏi/giáo trình lên Marketplace | Actor mới, có thể triển khai phase sau |

## 1.4 Điều gì được giữ nguyên gần như 100%

Các Business Rules chi tiết ở cấp chức năng (VD: "1 buổi học có đúng 1 bản ghi điểm danh mỗi học viên", "điểm quá trình = trung bình bài tập", state machine `scheduled→ongoing→completed`...) trong `BRD - Education.md` **không đổi về logic nghiệp vụ**, chỉ đổi **ai được phép làm** (Permissions) và **phạm vi dữ liệu** (data scope đổi từ `business_id/branch_id` sang `teacher_id`).

---

# 2. Đa người thuê (Multi-tenancy) — thay đổi mô hình dữ liệu

## 2.1 Trước đây

```
business (1 trung tâm, nhiều chi nhánh)
   └── branch (nhiều chi nhánh)
         └── users (Admin, Manager, Giáo vụ, Teacher — nhân sự)
         └── students, classes, courses... (dữ liệu chung chi nhánh)
```

## 2.2 Mô hình mới

```
teacher_workspace (1 giáo viên = 1 workspace/"trung tâm mini")
   ├── owner_teacher_id (chính là giáo viên đăng ký)
   ├── subscription (gói thuê bao hiện tại + giới hạn)
   ├── assistants[] (trợ giảng được mời, tùy chọn)
   ├── students, parents, courses, levels, subjects, classes, rooms
   │      → mọi bảng nghiệp vụ Education thêm cột `teacher_workspace_id`
   │      → GIỮ NGUYÊN cột `business_id` cho tương thích ngược, nhưng
   │        `business_id` giờ = `teacher_workspace_id` (1-1), không còn multi-branch
   └── wallet (ví giáo viên: doanh thu học phí, nạp tiền, mua nội dung, rút tiền)
```

**Quyết định kỹ thuật đề xuất:** không xóa khái niệm `business_id`/`branch_id` trong schema hiện tại (tránh phá vỡ toàn bộ FK đã thiết kế trong `BRD - Education.md`), mà **ánh xạ 1 `teacher_workspace` = 1 `business` + 1 `branch` mặc định**, tạo tự động khi giáo viên hoàn tất đăng ký (task `060_dang_ky_screen.md`). Nhờ vậy toàn bộ 18 chức năng EDU-01→18 đã xây dựng **tái sử dụng được gần như nguyên vẹn**, chỉ cần sửa tầng Permission (mục 4) và bổ sung bước tạo `business` tự động khi đăng ký (mục 3).

## 2.3 Giới hạn theo gói thuê bao (Subscription Limits)

Mỗi `teacher_workspace` bị giới hạn theo gói đang active — đã có sẵn khung dữ liệu này ở trang "Gói đăng ký" hiện tại (`package-management`), cần chuẩn hóa lại thành 1 nguồn duy nhất:

| Gói | Giá đề xuất | Giới hạn lớp | Giới hạn học viên | Tính năng nâng cao |
|---|---:|---:|---:|---|
| Miễn phí (Free/Trial) | 0đ | 2 lớp | 50 học viên | Không Marketplace, không Certificate, watermark trên phiếu điểm |
| Cơ bản | 149.000đ/tháng | 10 lớp | 300 học viên | Marketplace cơ bản, xuất báo cáo |
| Nâng cao | 299.000đ/tháng | Không giới hạn | Không giới hạn | Marketplace đầy đủ, Chứng chỉ, AI hỗ trợ chấm bài |
| Toàn diện | 499.000đ/tháng | Không giới hạn | Không giới hạn | Tất cả tính năng + hỗ trợ ưu tiên + thương hiệu riêng (custom branding trên chứng chỉ/phiếu điểm) |

> Ghi chú: bảng giá kế thừa nguyên trạng từ 2 trang trùng lặp đã phát hiện khi test (`package-management` vs `subscription`) — **mục 8.1** yêu cầu gộp về đúng 1 nguồn dữ liệu.

---

# 3. Luồng Đăng ký & Thuê bao (Onboarding + Billing)

## 3.1 Sơ đồ

```
Giáo viên vào trang Đăng ký (060) ──► Nhập thông tin cá nhân + hồ sơ giảng dạy
        │
   Tạo tài khoản (role=teacher) ──► Auto tạo teacher_workspace (business + branch mặc định)
        │                                   │ gói mặc định = Miễn phí
        ▼                                   ▼
   Xác thực email/SĐT                Workspace sẵn sàng, giới hạn 2 lớp/50 HV
        │
   Chọn gói thuê bao (hoặc tiếp tục dùng Miễn phí)
        │ chọn gói trả phí
   Tạo Invoice nền tảng (loại: subscription) ──► Thanh toán (cổng thanh toán / Ví giáo viên nếu đủ số dư)
        │ PaymentConfirmed
   Kích hoạt gói ──► Nâng giới hạn lớp/học viên + mở tính năng theo gói
```

## 3.2 Business Rules

- BR-01: Tài khoản Teacher mới **tự động có 1 `teacher_workspace`** duy nhất, không được join vào workspace khác trừ khi được mời làm Trợ giảng.
- BR-02: Gói mặc định khi đăng ký = **Miễn phí**, không yêu cầu thanh toán ngay — giáo viên có thể trải nghiệm đủ luồng nghiệp vụ ở quy mô nhỏ trước khi nâng cấp.
- BR-03: Khi số lớp hoặc số học viên chạm giới hạn gói hiện tại, hệ thống **chặn tạo mới** (lớp/học viên) và hiển thị lời mời nâng cấp gói — không tự động khóa dữ liệu đã có.
- BR-04: **Invoice nền tảng** (giáo viên trả cho Hana Edu) và **Invoice học phí** (phụ huynh trả cho giáo viên) là 2 loại hóa đơn tách biệt hoàn toàn, không dùng chung màn hình "Hóa đơn" hiện tại (xem mục 8.3) — tránh nhầm lẫn dòng tiền.
- BR-05: Thanh toán gói thuê bao có thể qua: cổng thanh toán ngoài (thẻ/chuyển khoản) HOẶC trừ trực tiếp từ Ví giáo viên nếu đủ số dư (tiện lợi, không bắt buộc nạp riêng).
- BR-06: Hạ gói (downgrade): nếu số lớp/học viên hiện có vượt giới hạn gói mới, chặn hạ gói cho tới khi giáo viên tự giảm quy mô hoặc hệ thống đưa ra checklist rõ ràng.
- BR-07: Gói hết hạn mà không gia hạn → tự động chuyển về gói Miễn phí, dữ liệu vượt giới hạn được giữ nguyên (read-only) cho tới khi gia hạn hoặc xóa bớt.

## 3.3 Actors

Giáo viên (tự đăng ký, tự thanh toán); System (tạo workspace, tính giới hạn, nhắc gia hạn); Platform Admin (duyệt tài khoản nếu bật cơ chế kiểm duyệt, xử lý tranh chấp thanh toán).

---

# 4. Ma trận quyền mới (Permission Matrix)

So sánh trực tiếp với bảng Permissions trong `BRD - Education.md` — cột "Trước đây" lấy nguyên từ tài liệu gốc, cột "Mô hình mới" là thay đổi.

| Permission | Trước đây (chủ sở hữu) | Mô hình mới (chủ sở hữu) |
|---|---|---|
| `edu.subject.manage`, `edu.level.manage` | Admin, Manager | **Teacher** (trong workspace của mình) |
| `edu.course.create/update/delete/publish` | Admin, Manager | **Teacher** |
| `edu.classroom.manage` (phòng học) | Admin, Manager | **Teacher** |
| `edu.class.create/update/close/cancel` | Admin, Manager, Giáo vụ | **Teacher** |
| `edu.teacher.*` (hồ sơ & phân công GV) | Admin, Manager | **Teacher tự quản hồ sơ mình**; phân công Trợ giảng do Teacher cấp quyền thủ công |
| `edu.student.create/update/import` | Admin, Manager, Giáo vụ | **Teacher** |
| `edu.parent.create/update/link-student` | Admin, Manager, Giáo vụ | **Teacher** |
| `edu.enrollment.create/cancel/reserve` | Admin, Manager, Giáo vụ | **Teacher** |
| `edu.timetable.manage` | Admin, Manager, Giáo vụ | **Teacher** |
| `edu.attendance.take/edit-after-close` | Teacher (take) / Manager (edit) | **Teacher** làm cả hai (không còn phân tách vai trò) |
| `edu.homework.*`, `edu.grading.*` | Teacher | Không đổi — **Teacher** |
| `edu.exam.create/publish` | Giáo vụ/Manager | **Teacher** (Teacher tự publish, không cần ai duyệt vì không còn cấp trên) |
| `edu.score.finalize/edit-finalized` | Manager | **Teacher** |
| `edu.certificate.issue/revoke` | Giáo vụ trình + Manager duyệt | **Teacher tự phát hành** (không có bước "trình duyệt" vì Teacher chính là người quyết định cao nhất trong workspace của mình) |
| Tài chính: Invoice, Payment, Wallet | Kế toán/Admin (Finance module) | **Teacher** toàn quyền tạo hóa đơn học phí, nhận thanh toán, quản lý Ví |
| Superadmin (tenant, subscription plans, marketplace) | — (chưa có role rõ) | **Platform Admin** duy nhất |

**Nguyên tắc bao trùm:** trong mô hình mới, **không còn phân biệt Admin/Manager/Giáo vụ** ở cấp workspace — toàn bộ 4 vai trò cũ (Admin, Manager, Giáo vụ, Teacher) **hợp nhất thành 1 vai trò Teacher** với full quyền trong phạm vi `teacher_workspace_id` của chính họ. Vai trò Assistant (trợ giảng) là role phụ, tùy chọn, quyền do Teacher tự cấu hình (không bắt buộc thiết kế chi tiết ở v2 này — xem mục 10 Open Questions).

---

# 5. Sơ đồ luồng tổng thể (Master End-to-End Flow)

Đây là chuỗi nghiệp vụ đầy đủ theo đúng yêu cầu — từ 1 khách hàng tiềm năng cho tới khi giáo viên rút được tiền về túi mình. Sơ đồ này **thay thế vai trò "bản đồ tổng thể"** ở đầu `Business Flow - Education.md` bằng góc nhìn 1 giáo viên duy nhất xuyên suốt.

```
 [1] LEAD                     Khách hàng để lại thông tin (Zalo/FB/Landing page của Teacher)
   │
 [2] TIỀM NĂNG                Teacher tự tư vấn (không có Sales riêng) → đánh dấu "quan tâm"
   │
 [3] GHI DANH HỌC VIÊN        Teacher tạo hồ sơ Học viên + Phụ huynh (EDU-01, EDU-02)
   │
 [4] KIỂM TRA ĐẦU VÀO         Teacher tự tổ chức placement test (EDU-16, loại "placement")
   │
 [5] CHỌN TRÌNH ĐỘ BAN ĐẦU    Dựa trên kết quả test → gán Level (EDU-05)
   │
 [6] GÁN VÀO KHÓA HỌC         Teacher chọn/tạo Course phù hợp Level (EDU-03)
   │
 [7] GÁN VÀO LỚP HỌC          Teacher mở lớp mới hoặc xếp vào lớp có sẵn (EDU-08)
   │
 [8] GÁN VÀO PHÒNG HỌC        Chọn phòng vật lý / lớp online của chính Teacher (EDU-06)
   │
 [9] LỊCH HỌC / LỊCH DẠY      Thiết lập lịch tuần, sinh buổi học tự động (EDU-10, EDU-11)
   │
[10] HÓA ĐƠN HỌC PHÍ          Teacher tạo Invoice học phí gửi Phụ huynh (FIN — Invoice loại "tuition")
   │                                    │ Phụ huynh thanh toán
   │                                    ▼
   │                          Tiền vào VÍ GIÁO VIÊN (ghi có tự động) ──────────────┐
   │                                                                              │
[11] ĐIỂM DANH HÀNG NGÀY /    Mỗi buổi học: điểm danh (EDU-12); Phụ huynh/HV gửi   │
     ĐƠN XIN NGHỈ              đơn xin nghỉ trước → auto absent_excused            │
   │                                                                              │
[12] TẠO GIÁO ÁN              Teacher soạn giáo án cho khóa/lớp (Lesson Plan)      │
   │                                                                              │
[13] CÓ BÀI HỌC               Buổi học cụ thể diễn ra theo giáo án (course_lessons)│
   │                                                                              │
[14] NẠP TIỀN (Ví)            Teacher nạp thêm tiền vào Ví (không bắt buộc nếu     │
   │                          đã có doanh thu học phí đủ dùng)                    │
   │                                                                              │
[15] MUA NGÂN HÀNG CÂU HỎI /  Teacher dùng số dư Ví để mua gói câu hỏi/tài liệu/  │
     TÀI LIỆU / HỌC LIỆU /     học liệu/giáo trình từ Content Marketplace          │
     GIÁO TRÌNH                                                                    │
   │                                                                              │
[16] GIAO BÀI TẬP             Giao bài (có thể dùng câu hỏi vừa mua — quiz)        │
   │                          (EDU-13/14)                                        │
   │                                                                              │
[17] CHẤM BÀI                 Teacher chấm điểm + nhận xét (EDU-15)                │
   │                                                                              │
[18] ĐÁNH GIÁ                 Nhận xét định kỳ theo 9 tiêu chí (Evaluation)         │
   │                                                                              │
[19] XẾP HẠNG                 Cập nhật bảng xếp hạng học viên (Ranking)            │
   │                                                                              │
[20] KIỂM TRA                 Kỳ thi giữa kỳ/cuối kỳ (EDU-16 midterm/final)        │
   │                                                                              │
[21] ĐÁNH GIÁ (định kỳ)       Đánh giá tổng hợp sau kỳ thi (Evaluation + EDU-17)    │
   │                                                                              │
[22] XẾP HẠNG (cập nhật)      Xếp hạng cuối kỳ (Ranking)                           │
   │                                                                              │
[23] THÀNH TÍCH               Học viên tích lũy huy hiệu/thành tích (Student        │
   │                          Achievement — MODULE MỚI, xem mục 6.4)              │
   │                                                                              │
[24] CHỨNG NHẬN               Đủ điều kiện → cấp Chứng chỉ hoàn thành (EDU-18)      │
   │                                                                              │
[25] VÍ GIÁO VIÊN             Toàn bộ doanh thu học phí trong suốt khóa học đã      │
   │◄─────────────────────────────────────────────────────────────────────────────┘
   │                          được cộng dồn vào đây (auto-credit mỗi khi có
   │                          Invoice học phí thanh toán thành công — bước [10])
   │
[26] RÚT TIỀN                 Teacher rút tiền từ Ví về tài khoản ngân hàng cá nhân
```

## 5.1 Bảng bước chi tiết (rút gọn, tham chiếu module)

| # | Bước | Actor chính | Module / Mã tham chiếu | Đã có sẵn? |
|---|---|---|---|---|
| 1-2 | Lead → Tiềm năng | Teacher | CRM (Lead, Opportunity) — thu gọn quy mô 1 giáo viên | Chưa có UI riêng, cần bổ sung (mục 6.1) |
| 3 | Ghi danh học viên | Teacher | EDU-01, EDU-02, EDU-09 | **Có sẵn** (`066_ghi_danh_hoc_vien_screen`) |
| 4 | Kiểm tra đầu vào | Teacher | EDU-16 (placement) | **Có sẵn** (`044/045` Bài kiểm tra) |
| 5 | Chọn trình độ ban đầu | Teacher | EDU-05 | **Có sẵn** (Trình độ) |
| 6 | Gán vào khóa học | Teacher | EDU-03 | **Có sẵn**, cần mở quyền tạo/sửa cho Teacher |
| 7 | Gán vào lớp học | Teacher | EDU-08 | **Có sẵn** (`034/035`) |
| 8 | Gán vào phòng học | Teacher | EDU-06 | **Có sẵn** (Phòng học `063/064`) |
| 9 | Lịch học/lịch dạy | Teacher | EDU-10, EDU-11 | **Có một phần** — thiếu UI thiết lập lịch tuần độc lập (đã ghi nhận ở `02-Chuc-nang-thieu-va-de-xuat.md`) |
| 10 | Hóa đơn học phí | Teacher | FIN Invoice (tuition) | **Có sẵn** nhưng nút "Tạo hóa đơn" hiện là stub — cần hoàn thiện |
| 11 | Điểm danh / đơn xin nghỉ | Teacher, Parent | EDU-12 | **Có sẵn** (`038`); "đơn xin nghỉ" ở đây là **học viên xin nghỉ** (absence report), không phải leave request nhân sự — xem mục 6.2 |
| 12-13 | Giáo án / Bài học | Teacher | EDU-11 hỗ trợ, Lesson Plan | **Có sẵn** (`036/037`) |
| 14 | Nạp tiền | Teacher | Ví giáo viên | **Có sẵn về UI**, đang khóa "chờ tích hợp cổng thanh toán" — cần ưu tiên mở |
| 15 | Mua nội dung Marketplace | Teacher | Content Marketplace | **CHƯA CÓ — module mới**, xem mục 6.3 |
| 16-17 | Giao bài / Chấm bài | Teacher | EDU-13/14/15 | **Có sẵn**, còn thiếu liên kết Ngân hàng câu hỏi ↔ Bài tập dạng quiz |
| 18-19 | Đánh giá / Xếp hạng | Teacher | Evaluation, Ranking | **Có sẵn** (`041/047`) |
| 20-22 | Kiểm tra / Đánh giá / Xếp hạng (định kỳ) | Teacher | EDU-16, EDU-17 | **Có sẵn** phần lớn |
| 23 | Thành tích (học viên) | System | Student Achievement | **CHƯA CÓ — module mới**, xem mục 6.4 |
| 24 | Chứng nhận | Teacher | EDU-18 | **CHƯA CÓ — module còn thiếu**, đã ghi nhận từ trước |
| 25-26 | Ví giáo viên / Rút tiền | Teacher | Wallet | **Có sẵn về UI**, đang khóa "chờ backend hỗ trợ rút tiền" — cần ưu tiên mở, đây là module SỐNG CÒN của mô hình mới |

---

# 6. Module mới / cần bổ sung

## 6.1 CRM thu gọn cho Teacher (Lead → Tiềm năng)

- Mục tiêu: cho giáo viên 1 kênh nhận yêu cầu tư vấn từ phụ huynh mới (landing page cá nhân/link đăng ký test thử) mà không cần bộ máy Sales như trung tâm lớn.
- Đề xuất tối giản: 1 màn hình "Khách hàng tiềm năng" (Leads) với các trạng thái `new → contacted → trial_booked → converted/lost`, mỗi Lead có thể "Chuyển thành Học viên" (tiền điền sẵn form Ghi danh học viên đã có).
- Nguồn Lead: form landing page công khai (mỗi giáo viên có 1 link/QR riêng), hoặc nhập tay.

## 6.2 Làm rõ "Đơn xin nghỉ" trong mô hình mới

Module `LeaveRequest` hiện tại (`049`... thực ra là HR leave request cho nhân sự) được thiết kế cho mô hình "giáo viên là nhân viên xin nghỉ phép". Trong mô hình mới:

- **Học viên/Phụ huynh xin nghỉ buổi học** → đây là nghiệp vụ chính trong chuỗi flow (bước 11), map vào `absence_reports` đã có sẵn trong BRD EDU-12 (BR "PH báo vắng trước qua Parent App → auto absent_excused chờ GV xác nhận"). Cần đảm bảo Teacher app có màn hình duyệt nhanh các đơn xin nghỉ này (hiện đã có 1 phần trong Attendance).
- **Giáo viên tự nghỉ dạy 1 buổi** (không có "cấp trên" để xin phép) → không còn là "leave request" cần duyệt, mà là hành động trực tiếp: Teacher chủ động **hủy buổi + hệ thống tự sinh buổi bù** (đã có BR-05 EDU-11). Trang `LeaveRequest` cũ có thể giữ lại dưới dạng **nhật ký nghỉ cá nhân** (self-log, không cần workflow duyệt) hoặc loại bỏ khỏi menu chính, gộp logic vào thao tác "Hủy buổi" ở màn Lịch dạy/Chi tiết lớp.

## 6.3 Content Marketplace (Ngân hàng câu hỏi / Tài liệu / Học liệu / Giáo trình) — MODULE MỚI

**Mục tiêu:** tạo nguồn thu thứ 2 cho nền tảng (ngoài phí thuê bao) và giúp giáo viên tiết kiệm thời gian soạn bài bằng cách mua nội dung soạn sẵn.

### Business Objective
Cho phép giáo viên dùng số dư Ví để mua các gói nội dung dạy học (câu hỏi, tài liệu, giáo trình, học liệu) do Hana Edu hoặc bên thứ 3 cung cấp, sử dụng ngay trong Ngân hàng câu hỏi / Tài liệu / Giáo án của họ.

### Business Rules
- BR-01: Sản phẩm Marketplace có loại: `question_pack` (bộ câu hỏi theo skill/level), `material` (tài liệu/file), `curriculum` (giáo trình đầy đủ theo course, gồm cả `course_lessons` mẫu).
- BR-02: Giá sản phẩm tính bằng VNĐ, trừ trực tiếp từ Ví giáo viên khi mua — không hỗ trợ trả góp.
- BR-03: Sau khi mua, nội dung được **copy vào workspace riêng của giáo viên** (không chia sẻ ngược, không đồng bộ khi bản gốc bị sửa) — đơn giản hóa version control ở phase đầu.
- BR-04: Gói thuê bao Miễn phí/Cơ bản có thể giới hạn quyền truy cập Marketplace (chỉ xem, không mua) — xem bảng giới hạn mục 2.3.
- BR-05: Hana Edu thu % hoa hồng nếu Content Provider là bên thứ 3 (tỷ lệ cấu hình ở Superadmin) — áp dụng khi mở actor Content Provider ở phase sau.

### Functional Requirements
| ID | Yêu cầu |
|----|---------|
| FR-01 | Trang "Cửa hàng nội dung": danh sách sản phẩm, lọc theo loại/môn/level/giá |
| FR-02 | Xem chi tiết sản phẩm: preview 1 phần nội dung trước khi mua |
| FR-03 | Mua sản phẩm: xác nhận trừ tiền từ Ví → copy nội dung vào workspace |
| FR-04 | "Nội dung đã mua": danh sách những gì giáo viên đã sở hữu, có thể dùng lại trong Bài tập/Giáo án |
| FR-05 | (Phase sau) Content Provider đăng bán sản phẩm, chờ Platform Admin duyệt |

### Liên kết với chức năng đã có
Đây chính là mắt xích còn thiếu đã phát hiện khi review trước đó: "Homework không có loại quiz liên kết QuestionBank". Với Marketplace, luồng trở thành: **Mua question_pack → tự động nạp vào Ngân hàng câu hỏi của giáo viên → khi tạo Bài tập loại "quiz", chọn câu hỏi trực tiếp từ đó.**

## 6.4 Thành tích học viên (Student Achievement / Badges) — MODULE MỚI

Phân biệt rõ với trang "Thành tích" hiện có (đó là **thành tích giảng dạy của giáo viên** — giữ nguyên, đổi tên hiển thị thành "Thành tích giảng dạy" để tránh nhầm lẫn).

### Business Objective
Tạo động lực học tập cho học viên nhỏ tuổi thông qua hệ thống huy hiệu/thành tích tích lũy dựa trên chuyên cần, điểm số, xếp hạng — hiển thị cho cả học viên (Student App) và phụ huynh (Parent App).

### Business Rules
- BR-01: Huy hiệu (badge) được cấp tự động theo rule cấu hình (VD: "Chuyên cần 100% trong tháng", "Top 3 bảng xếp hạng", "Hoàn thành 10 bài tập liên tiếp đúng hạn").
- BR-02: Thành tích tích lũy xuyên suốt học viên (không mất khi chuyển lớp/khóa), hiển thị trong hồ sơ học viên (`StudentDetail`) như 1 tab mới "Thành tích".
- BR-03: Thành tích là 1 trong các điều kiện tham chiếu (không bắt buộc) khi xét cấp Chứng chỉ (EDU-18) — Teacher có thể chọn hiển thị huy hiệu nổi bật lên chứng chỉ.

### Functional Requirements
| ID | Yêu cầu |
|----|---------|
| FR-01 | Cấu hình rule cấp huy hiệu (Teacher tự bật/tắt, hoặc dùng bộ mặc định của Platform) |
| FR-02 | Job tự động quét điều kiện sau mỗi lần: điểm danh, chấm bài, cập nhật xếp hạng |
| FR-03 | Tab "Thành tích" trong hồ sơ học viên: danh sách huy hiệu đã đạt + tiến độ huy hiệu đang theo đuổi |
| FR-04 | Thông báo cho Phụ huynh/Học viên khi đạt huy hiệu mới |

## 6.5 Ví giáo viên mở rộng (Teacher Wallet 2 chiều)

Ví giáo viên hiện tại (`Wallet`, `Deposit`, `Withdraw`) cần mở rộng loại giao dịch:

| Loại giao dịch | Chiều | Kích hoạt bởi |
|---|---|---|
| Nạp tiền thủ công (Deposit) | Tiền vào | Teacher chủ động nạp qua cổng thanh toán |
| **Ghi có học phí (Tuition Credit)** — MỚI | Tiền vào | Tự động khi Invoice học phí (bước 10) được phụ huynh thanh toán thành công |
| Mua nội dung Marketplace | Tiền ra | Teacher mua sản phẩm ở mục 6.3 |
| Thanh toán gói thuê bao qua Ví | Tiền ra | Tùy chọn ở bước đăng ký/gia hạn gói (mục 3.2 BR-05) |
| Rút tiền (Withdraw) | Tiền ra | Teacher rút về tài khoản ngân hàng cá nhân |

**Ưu tiên kỹ thuật cao nhất:** hiện tại cả Nạp tiền và Rút tiền đều đang bị khóa trên môi trường thật ("Chờ tích hợp cổng thanh toán" / "Chờ backend hỗ trợ rút tiền" — xem `test/25-Vi-ca-nhan-Wallet.md`). Trong mô hình cũ đây là tính năng phụ; **trong mô hình mới đây là huyết mạch của toàn bộ mô hình kinh doanh** (Teacher không thu được học phí và không rút được tiền = mô hình không hoạt động). Đề xuất đưa "Ghi có học phí tự động" + "Rút tiền" vào ưu tiên P0 tuyệt đối.

---

# 7. Ảnh hưởng tới các module Finance/HR hiện có

| Module cũ (theo `Business Requirement.md`) | Vai trò trong mô hình mới |
|---|---|
| Finance › Invoice, Payment | Giữ lại, nhưng tách rõ 2 luồng: Invoice học phí (Teacher→Parent) và Invoice thuê bao (Teacher→Platform) — xem mục 3.2 BR-04 |
| Finance › Promotion, Discount | Teacher tự cấu hình khuyến mãi cho học viên của mình (giữ nguyên logic, đổi phạm vi) |
| Finance › Installment (trả góp) | Giữ nguyên, áp dụng cho học phí Teacher thu từ Phụ huynh |
| HR › Employee, Contract, Payroll, Working Schedule | **Không còn áp dụng cho Teacher chính** (họ là chủ, không nhận lương) — chỉ áp dụng nếu Teacher thuê Trợ giảng (Assistant) như nhân viên thật, trả lương ngoài hệ thống hoặc qua 1 module Payroll thu gọn (phase sau) |
| HR › Leave (đơn xin nghỉ) | Xem lại theo mục 6.2 |

---

# 8. Việc cần dọn dẹp trên hệ thống hiện có trước khi triển khai mô hình mới

Tổng hợp từ các phát hiện lỗi/dư thừa đã ghi nhận trong quá trình review mã nguồn và test trực tiếp — nay trở thành **điều kiện tiên quyết** vì mô hình mới phụ thuộc trực tiếp vào các phần này:

1. **Gộp 2 trang "Gói đăng ký" và "Gói đã đăng ký"** thành 1 nguồn dữ liệu subscription duy nhất (mục 2.3) — hiện đang hiển thị 2 bộ giá và 2 trạng thái mâu thuẫn nhau.
2. **Hoàn thiện Nạp tiền / Rút tiền thật** trong Ví — hiện đang chủ động khóa chờ tích hợp; đây là yêu cầu bắt buộc để mô hình mới vận hành được (mục 6.5).
3. **Hoàn thiện nút "Tạo hóa đơn"** ở màn Hóa đơn (hiện là stub không phản hồi) — cần cho bước 10 trong luồng tổng thể.
4. **Sửa lỗi liên kết dữ liệu học viên ↔ lớp ↔ phụ huynh** đã phát hiện khi test (học viên trạng thái "studying" nhưng không thuộc lớp nào, 0 phụ huynh dù có học viên) — nếu không sửa, toàn bộ luồng từ bước 3 trở đi không đúng.
5. **Mở quyền tạo Course/Level/Subject/Class/Room cho role Teacher** (hiện các quyền `edu.*.create/update` này chỉ cấp cho Admin/Manager theo `BRD - Education.md` gốc) — đây là thay đổi permission cốt lõi của tài liệu này (mục 4).
6. **Xây mới module Certificate (EDU-18)** — xác nhận hoàn toàn chưa có trang nào trên frontend.
7. **Kết nối thật Thông báo & Tin nhắn** (hiện 100% dữ liệu mock, không lưu trữ) — quan trọng hơn trong mô hình mới vì đây là kênh duy nhất Teacher liên lạc với Phụ huynh (không còn "trung tâm" đứng giữa).

---

# 9. Tác động tới tài liệu hiện có (Mapping)

| Tài liệu gốc | Phần bị ảnh hưởng | Hành động đề xuất |
|---|---|---|
| `readme.md` | Mục 5 "Người dùng" (Admin/Manager/Teacher/Parent/Student) | Cập nhật lại theo actor mới ở mục 1.3 tài liệu này |
| `Business Requirement.md` | Toàn bộ bảng Permission trong mục 3.1-3.6 gắn theo Admin/Manager/Giáo vụ | Áp dụng nguyên tắc hợp nhất quyền ở mục 4 tài liệu này |
| `BRD - Education.md` | Mục "Permissions" của từng EDU-01→18 | Thay các dòng Admin/Manager/Giáo vụ bằng Teacher theo mục 4; **Business Rules/API/Database Design giữ nguyên** |
| `Business Flow - Education.md` | BF-01 (Tuyển sinh), BF-02 (Mở lớp), BF-06 (Kết thúc khóa), BF-10 (Tái ghi danh) | Actor "Sales/Giáo vụ/Manager/Kế toán" trong các flow này đổi thành "Teacher" duy nhất; sơ đồ tổng ở mục 5 tài liệu này là bản thay thế cấp cao |
| `SRS/`, `UseCase/`, `ScreenSpec/` | Không đổi nội dung kỹ thuật, chỉ đổi role trong phần Actor/Permission nếu có nhắc tới Admin/Manager/Giáo vụ | Rà soát lại khi triển khai chi tiết (không nằm trong phạm vi v2 này) |

---

# 10. Open Questions (cần chốt trước khi triển khai)

1. Trợ giảng (Assistant) có được trả lương qua hệ thống không, hay chỉ là quyền truy cập hỗ trợ không có yếu tố tài chính?
2. Hana Edu có thu % hoa hồng trên học phí Teacher thu được không, hay chỉ thu qua phí thuê bao cố định? (Ảnh hưởng trực tiếp tới thiết kế Ví và Invoice.)
3. Có cho phép 1 giáo viên sở hữu nhiều `teacher_workspace` (nhiều "thương hiệu" dạy khác nhau) không, hay cứng 1-1?
4. Content Marketplace ở phase đầu chỉ do Hana Edu cung cấp, hay mở ngay cho Content Provider bên thứ 3?
5. Cơ chế xác thực/duyệt hồ sơ giáo viên trước khi được thu tiền thật (chống lừa đảo) — có cần Platform Admin duyệt KYC không?
6. Khi Teacher ngừng sử dụng/xóa tài khoản, dữ liệu học viên/phụ huynh (thuộc sở hữu của Teacher) được xử lý ra sao — có bàn giao được cho Teacher khác không?
