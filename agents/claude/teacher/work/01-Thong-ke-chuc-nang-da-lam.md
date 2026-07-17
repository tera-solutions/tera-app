# Thống kê chức năng đã triển khai — Teacher Web (`webs/teacher`)

> Phạm vi rà soát: toàn bộ `D:\workspace\tera-app\webs\teacher\src\pages` (51 thư mục trang, 44 route đăng ký trong `src/routers/index.tsx` + 2 trang mồ côi không gắn route).
> Phương pháp: đọc trực tiếp `index.tsx`, `components/*`, `_interface.ts`, `constants.ts`, `hooks/*` của từng trang; phân loại theo dữ liệu thật (gọi service `@tera/modules/*` qua React Query) hay dữ liệu giả (mock array / `_mock.ts` / nút bấm không làm gì).
> Ngày: 2026-07-17

---

## 1. Tổng quan số lượng

| Trạng thái | Số trang | Tỷ lệ (/46) |
|---|---:|---:|
| **Hoàn chỉnh** — CRUD/luồng nghiệp vụ chính chạy thật, không thấy stub lớn | 27 | 59% |
| **Một phần** — chạy thật nhưng thiếu tính năng lõi theo BRD hoặc còn nút/ tab stub | 9 | 20% |
| **Mock hoàn toàn** — UI đầy đủ nhưng dữ liệu/hành động giả, không backend | 6 | 13% |
| **Mồ côi / dead code** — không gắn route, hoặc không submit được | 2 | 4% |
| **Thiếu hoàn toàn** — không tồn tại trang nào (xem file 02) | 4 chức năng EDU | — |

Ghi chú: "Một phần" và "Mock" không loại trừ lẫn nhau ở cấp field/tab (VD: Wallet hoàn chỉnh phần lớn nhưng nút Export là stub) — bảng chi tiết bên dưới ghi rõ từng điểm.

---

## 2. Module Education (đối chiếu EDU-01 → EDU-18)

| Mã BRD | Trang code | Route | Nguồn dữ liệu | Trạng thái | Ghi chú |
|---|---|---|---|---|---|
| EDU-01 Student | `Students`, `StudentDetail` | `/students`, `/student/:id` | `StudentService`, `AttendanceService`, `EvaluationService` (thật) | Hoàn chỉnh | List: tab trạng thái, tìm kiếm, filter lớp/level/ngày, sửa/xóa. Tạo mới học viên chỉ qua Enrollment wizard, không có nút "Tạo" trực tiếp ở đây. Detail: 5 tab đều thật (tổng quan, điểm, điểm danh, bài tập, lịch sử). |
| EDU-02 Parent | `Parents`, `ParentDetail` | `/parents`, `/parent/:id` | `ParentService` (CRM), `StudentService` (thật) | Hoàn chỉnh | CRUD, tìm kiếm, filter lớp, nút "Nhắn tin" (điều hướng qua Messages — Messages lại là mock). Card "Thông báo mới nhất" ở Detail luôn rỗng (chưa nối dữ liệu). Danh sách con của phụ huynh dựng bằng cách quét roster các lớp GV dạy (workaround phía FE do thiếu API scope theo teacher). |
| EDU-03 Course | `Courses`, `CourseDetail` | `/courses`, `/course/:id` | `CourseService` (thật) | Một phần | List/CRUD hoàn chỉnh. Detail: khối "doanh thu"/"đánh giá" luôn = 0 (BE chưa trả dữ liệu thật, FE đã ghi chú placeholder). |
| EDU-04 Subject | — | — | — | **Thiếu hoàn toàn** | Không có trang/route nào (đã xác nhận bằng Glob toàn bộ `src`). Xem file 02. |
| EDU-05 Level | `Levels` | `/levels` | `LevelService` (thật) | Hoàn chỉnh | CRUD, sắp thứ tự, khóa/mở (suspend/restore) thay vì xóa cứng. Không có trang chi tiết riêng (không bắt buộc theo BRD). |
| EDU-06 Classroom (phòng vật lý — code gọi là **`Room`**) | `Room`, `RoomDetail` | `/rooms`, `/room/:id` | `RoomService`, `AttendanceService` (thật) | Hoàn chỉnh | Tab trạng thái (đang dùng/trống/bảo trì), CRUD, xem buổi học đang diễn ra trong phòng + nút "Kết thúc buổi học" ngay tại đây. |
| EDU-07 Teacher (hồ sơ & phân công) | — (chỉ có `MyInfo`, `Achievement` cho *chính* GV) | `/profile`, `/achievement` | `ProfileService`, `TeacherService`, `AchievementService` (HR, thật) | Một phần | Không có màn "Quản lý giáo viên" cho giáo vụ/quản lý (CRUD hồ sơ GV khác, phân công GV chính/trợ giảng cho lớp, check trùng lịch dạy) — các trang hiện có chỉ phục vụ GV xem hồ sơ/thành tích **của chính mình**. |
| EDU-08 Class (lớp học — code gọi là **`Classroom`**) | `Classroom`, `ClassroomDetail` | `/classroom`, `/classroom/:id` | `ClassRoomService`, `LessonPlanService`, `TimetableService` (thật) | Hoàn chỉnh | List + grid view, CRUD, filter khóa/ca/ngày. Detail có 7 tab thật: học viên, điểm danh, lịch học, tài liệu, bài tập, điểm số, bình luận. |
| EDU-09 Enrollment | `Enrollment`, `Transfer` | `/enrollment/new`, `/transfer` | `EnrollmentService`, `StudentService` (thật) | Hoàn chỉnh | Enrollment: wizard 4 bước (chọn lớp → học phí → học viên mới/có sẵn → xác nhận, tạo tuần tự từng học viên). Transfer: wizard 3 bước (chọn HV → lớp đích → lý do + ngày hiệu lực). Card "Thống kê chuyển lớp" ở Transfer là placeholder rỗng. |
| EDU-10 Timetable | `Schedule` | `/schedule` | `TimetableService.useTimetableCalendar` (thật, **chỉ đọc**) | Một phần | Chỉ có màn xem lịch (ngày/tuần/tháng/danh sách, filter, thống kê). Không có UI thiết lập lịch tuần, không check trùng phòng/GV, không có logic né ngày lễ — toàn bộ nghiệp vụ "xếp lịch" của EDU-10 không có ở FE (có thể do lịch được sinh từ phía Class Wizard, cần xác minh thêm). |
| EDU-11 Session | `SessionRuntime`, `Lesson`, `LessonPlan`/`PlanLessons`/`Wizard` | `/session/:id`, `/lesson/:id`, `/lesson-plans/*` | `ClassSessionService`, `LessonService`, `LessonPlanService` (thật) | Một phần | Luồng scheduled→ongoing→completed hoạt động đúng (nút Bắt đầu bị khóa tới khi đã điểm danh + có giáo án, đúng rule BRD). Có "Hủy buổi học" ở cấp Lesson (LessonService.useLessonCancel) nhưng **không sinh buổi bù (makeup)** — grep toàn repo không thấy logic makeup. SessionRuntime không có nút hủy buổi. |
| EDU-12 Attendance | `Attendance` (+ nhúng trong `SessionRuntime`) | `/attendance` | `AttendanceService` (thật) | Một phần | Grid điểm danh, chọn nhiều + đặt trạng thái hàng loạt, "Tất cả có mặt", lưu dirty-rows, export. **Không có offline-first** (BRD yêu cầu điểm danh được khi mất mạng) — không tìm thấy localStorage/IndexedDB/service-worker nào phục vụ việc này. |
| EDU-13 Homework | `Assignment`, `AssignmentDetail` | `/assignment`, `/assignment-detail/:id` | `AssignmentService`, `SubmissionService`, `MaterialService` (thật) | Một phần | CRUD đầy đủ, đính kèm file, giao theo course/class/lesson/level. **Không có loại bài "quiz" liên kết ngân hàng câu hỏi** dù `QuestionBank` đã tồn tại độc lập. **Không giao được cho từng học viên riêng lẻ** (chỉ theo phạm vi lớp/level). |
| EDU-14 Homework Submission | (nằm trong `AssignmentDetail` + `Grading`) | — | `SubmissionService` (thật) | Một phần | GV xem danh sách nộp/roster, chuyển sang chấm. Chưa xác nhận được tính năng "GV nộp hộ bài giấy" (`submitted_by_teacher`) có UI ở đâu — cần kiểm tra thêm. |
| EDU-15 Assignment/Grading | `Grading` | `/grading/:id` | `SubmissionService` (thật) | Một phần | Chỉ có 1 điểm số (0–max, bước 0.5) + 1 ô nhận xét text. **Không có**: annotate trực tiếp lên ảnh bài làm, ghi âm nhận xét, chấm hàng loạt/nhận xét mẫu, thang điểm chữ/sao. Panel "AI tóm tắt" chỉ là heuristic đếm từ cục bộ, không phải AI thật. |
| EDU-16 Examination | `ExamSession`, `ExamDetail`, `PlacementTest` | `/exam*`, `/placement-test` | `ExamService`, `ExamSessionService`, `ExamResultService`, `PlacementTestService` (thật) | Một phần | Chấm theo từng kỹ năng (Listening/Speaking/Reading/Writing/Grammar/Vocabulary) đúng yêu cầu. **Không có** thi bù cho học viên vắng, không có bước publish/duyệt điểm gating hiển thị cho phụ huynh. 2 tab "Phân tích câu hỏi" và "Chi tiết bài làm" chỉ là `<ComingSoon />` rỗng. Tab "Câu hỏi" trong PlacementTest chỉ redirect sang QuestionBank, không nhúng UI thật. |
| EDU-17 Score (bảng điểm tổng hợp) | — (điểm chỉ hiện rải rác ở tab "scores" của `StudentDetail`/`ClassroomDetail`) | — | — | **Chưa xác nhận đầy đủ** | Không thấy màn hình cấu hình cấu trúc điểm (trọng số theo component), nút "Chốt điểm" (finalize), hay xuất phiếu điểm PDF — cần rà soát kỹ thêm 2 tab "scores" nói trên ở đợt sau; nhiều khả năng đây là khoảng trống. |
| EDU-18 Certificate | — | — | — | **Thiếu hoàn toàn** | Không có trang/route nào (xác nhận bằng Glob `**/*ertificat*` toàn `src` — không có kết quả). Xem file 02. |

---

## 3. Tính năng bổ sung ngoài 18 mã EDU (đặc thù Teacher App)

| Trang | Route | Nguồn dữ liệu | Trạng thái | Ghi chú |
|---|---|---|---|---|
| `Evaluation` | `/evaluation` | `EvaluationService` (thật) | Hoàn chỉnh | GV đánh giá học viên theo 9 tiêu chí cố định (1–5 điểm) + nhận xét — tính năng không có trong 18 mã BRD Education, là bổ sung riêng của Teacher App. |
| `Achievement` | `/achievement` | `AchievementService` (HR), `ProfileService` (thật) | Hoàn chỉnh | Hồ sơ + thành tích giảng dạy **của chính giáo viên**, đánh giá từ học viên. |
| `Ranking` | `/ranking` | `StudentService`, `EvaluationService` (thật) | Một phần | Xếp hạng học viên theo điểm đánh giá (3 tab thật: tổng quan/tiến bộ/so sánh nhóm). Tab "evaluation" chỉ redirect sang trang Evaluation, không có nội dung riêng. |
| `Material` | `/materials` | `MaterialService` (thật) | Một phần | CRUD tài liệu, upload thật. Nút "Tạo thư mục" và xem chi tiết tài liệu (`onView`) là stub. |
| `QuestionBank` | `/question-bank` | `QuestionService` (thật) | Hoàn chỉnh | CRUD câu hỏi, filter kỹ năng/loại/độ khó, tab của tôi/tất cả. |
| `Dashboard` | `/dashboard` | `DashboardService` (thật) | Một phần | Đầy đủ widget (lịch, bài tập, tiến độ, lớp của tôi...). Riêng widget Thông báo dùng dữ liệu mock (comment code xác nhận backend thông báo chưa có). |

---

## 4. Module ngoài Education (Finance / HR / System / SaaS Platform)

| Trang | Route | Nguồn dữ liệu | Trạng thái | Ghi chú |
|---|---|---|---|---|
| `Notifications` | `/notifications` | Mock (`_mock.ts`) | **Mock hoàn toàn** | Comment code xác nhận chưa có backend thông báo. Trạng thái đọc/chưa đọc chỉ lưu local, mất khi tải lại trang. |
| `Messages` | `/messages` | Mock (`_mock.ts`) | **Mock hoàn toàn** | Comment code xác nhận backend chưa có model Conversation/Message hay websocket. Gửi tin nhắn chỉ thêm vào state cục bộ, không lưu. |
| `Wallet` | `/wallet` | `WalletService` (thật) | Một phần | Số dư, giao dịch, biểu đồ đều thật. Nút Export là stub. |
| `Deposit` | `/wallet/deposit` | `WalletService.useWalletDeposit` (thật nhưng khóa) | Một phần | Wiring thật nhưng `DEPOSIT_ENABLED = false` — vai trò giáo viên bị BE trả 403, modal nạp tiền không bao giờ mở được trên thực tế. |
| `Withdraw` | `/wallet/withdraw` | Không có | **Chưa làm** | Hoàn toàn chỉ có UI, không có khái niệm rút tiền ở backend (`WITHDRAW_ENABLED = false`), submit không làm gì, lịch sử luôn rỗng. |
| `Invoice` | `/invoices` | `InvoiceService` (thật, chỉ đọc) | Một phần | Danh sách/filter/thống kê thật. Nút "Tạo hóa đơn" và xem chi tiết hóa đơn đều là stub (`onClick={() => undefined}`). |
| `Timesheet` | `/timesheet` | `TimetableService` (thật) | Một phần | Lịch dạy, giờ dạy, biểu đồ thật. Filter "Hình thức học" luôn khóa (BE chưa có field). Nút Export Excel là stub. |
| `Payroll`, `Payroll/:id` | `/payroll`, `/payroll/:id` | Mock (`_mock.ts`) | **Mock hoàn toàn** | UI rất đầy đủ (bảng lương, biểu đồ thu nhập, khấu trừ, tải PDF...) nhưng toàn bộ là dữ liệu giả, mọi nút hành động là stub — comment code ghi rõ "UI-only theo design". |
| `LeaveRequest`, `LeaveRequest/all` | `/leave-request`, `/leave-request/all` | Mock (`_mock.ts`) | **Mock hoàn toàn** | Form tạo đơn nghỉ chỉ hiện thông báo demo, không gọi API thật (code ghi chú cần nối `EduLeaveService.useCreateLeave()`). |
| `Settings` | `/settings` | `ProfileService`, `SettingService` (thật) | Hoàn chỉnh | Tab chung/thông báo/giao diện đều lưu thật qua API. |
| `Report` | (Report page) | `TeacherReportService` (thật) | Một phần | Đầy đủ biểu đồ/thống kê. Nút "Xuất báo cáo" là stub. |
| `PackageManagement` | `/package-management` | `SubscriptionService`, `PackageService` (thật) | Hoàn chỉnh | Gói hiện tại, nâng cấp gói (mutation thật), lịch sử hóa đơn subscription. |
| `Subscription` | `/subscription` | Mock (`_mock.ts`) | **Mock hoàn toàn, trùng lặp** | Cùng chức năng với `PackageManagement` nhưng chưa nối API — nhiều khả năng là trang cũ chưa dọn dẹp. |
| `Superadmin/*` (Dashboard, Tenants, TenantDetail, Packages) | `/superadmin/*` | `SuperadminService` (thật) | Hoàn chỉnh | Cả 4 trang quản trị nền tảng SaaS (tenant, gói, doanh thu MRR) đều hoạt động thật, có mutation suspend/activate/assign-plan/extend/cancel. |
| `MyInfo` | `/profile` | `ProfileService`, `TeacherService` (thật) | Hoàn chỉnh | Hồ sơ cá nhân GV, đổi mật khẩu (dùng chung form với Settings), đăng xuất thật. |
| `ChangePassword` (trang độc lập) | — (không gắn route) | — | **Mồ côi/dead code** | `router.tsx` tồn tại nhưng không được import vào `routers/index.tsx`; nút Save không có `onSubmit`. Đã có bản dùng thật trong MyInfo/Settings. |
| `Auth` (Login, Register, ForgotPassword) | `/auth/*` | `AuthApi` (thật) | Hoàn chỉnh | Đăng nhập/đăng ký nhiều bước/quên mật khẩu đều hoạt động thật. |
| `More` | `/more` | `useFeatures()` (thật) | Hoàn chỉnh | Menu điều hướng lọc theo feature flag, có mục riêng cho superadmin. |
| `Placeholder` | — (không gắn route) | — | Không lộ ra UI | `PLACEHOLDER_PATHS` trong router đang là mảng rỗng — hiện không có route "đang phát triển" nào hiển thị cho người dùng thật. |
| `FileUploaded` | — (không gắn route) | — | **Mồ côi/dead code** | `router.tsx` không được import; nội dung là ảnh demo `picsum.photos`, rõ ràng là code scaffold còn sót lại. |

---

## 5. Ghi chú phương pháp

Báo cáo dựa trên đọc mã nguồn frontend (React) trực tiếp — không kiểm tra được điều hoạt động thực tế phía backend (Laravel), chỉ suy ra "thật" hay "mock" dựa trên việc trang có gọi service layer (`@tera/modules/*`, dùng React Query) hay dùng mảng dữ liệu tĩnh/`_mock.ts`/nút không có `onClick` thực. Một số điểm được đánh dấu "chưa xác nhận" (EDU-14 nộp hộ bài giấy, EDU-17 Score) cần rà soát sâu hơn ở lượt sau nếu cần độ chính xác cao hơn.
