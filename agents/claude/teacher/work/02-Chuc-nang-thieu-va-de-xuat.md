# Chức năng còn thiếu, lỗ hổng, và đề xuất bổ sung — Teacher Web

> Đối chiếu giữa mã nguồn thực tế (`webs/teacher/src/pages`, xem file `01-Thong-ke-chuc-nang-da-lam.md`) với tài liệu thiết kế đã đọc: `readme.md`, `Business Requirement.md`, `BRD - Education.md` (18 chức năng EDU-01→18), `Business Flow - Education.md` (10 luồng BF-01→10), và một phần `SRS/UseCase/ScreenSpec`.
> Ngày: 2026-07-17

---

## 1. Chức năng thiếu hoàn toàn (không có trang nào trong code)

| # | Chức năng | Theo tài liệu | Mức độ ảnh hưởng |
|---|---|---|---|
| 1 | **Subject Management** (EDU-04) | Danh mục môn học (Cambridge, Phonics, Giao tiếp...) — là 1 trong 3 danh mục nền tảng cùng Level/Classroom | Trung bình — nếu Course đang tự nhập subject dạng text thì còn chấp nhận được tạm thời, nhưng sẽ khó chuẩn hóa báo cáo theo môn học và khó mở rộng khi có nhiều chương trình. |
| 2 | **Certificate** (EDU-18) — toàn bộ module cấp chứng chỉ | Template kéo-thả, xét điều kiện (điểm + chuyên cần + công nợ), phát hành lô, số hiệu, QR xác thực public, thu hồi/cấp lại | **Cao** — đây là điểm chạm cuối hành trình học viên và có giá trị thương hiệu (BF-06); thiếu hoàn toàn nghĩa là trung tâm không thể số hóa việc cấp chứng chỉ dù đã có đủ dữ liệu điểm/chuyên cần để xét. |
| 3 | **Score — Bảng điểm tổng hợp & chốt điểm** (EDU-17, phần cấu hình/finalize) | Cấu hình trọng số component, nút "Chốt điểm" khi đóng lớp, xuất phiếu điểm PDF gửi phụ huynh | **Cao** — không có màn này thì không có cơ chế nào để tính điểm tổng kết → xếp loại → làm căn cứ cấp chứng chỉ (phụ thuộc trực tiếp vào #2). Cần rà soát kỹ tab "scores" hiện có trước khi kết luận chắc chắn, nhưng nhiều khả năng đây là khoảng trống thật. |
| 4 | **Teacher Management** (EDU-07, phần quản lý — không tính hồ sơ tự xem) | CRUD hồ sơ chuyên môn GV khác, phân công GV chính/trợ giảng, check trùng lịch dạy, thống kê giờ dạy toàn trung tâm | Trung bình — hiện tại phân công GV có lẽ nằm gọn trong `ClassFormModal` của Classroom, nhưng không có màn quản lý GV độc lập cho vai trò Giáo vụ/Manager (đúng ra ngoài phạm vi "Teacher app" cho GV, nhưng nếu app này cũng phục vụ Giáo vụ/Manager thì đây là thiếu). |
| 5 | **Timetable setup — thiết lập lịch tuần** (EDU-10, phần tạo lịch) | Wizard thêm slot (thứ/giờ/phòng/GV), preview buổi sinh ra (né lễ), check xung đột phòng/GV trước khi generate | Cao — `Schedule` hiện tại chỉ là màn xem lịch, không có nơi nào để thiết lập lịch tuần mới hoặc sửa lịch giữa khóa (có thể đang nằm trong Class Wizard khi tạo lớp — cần xác minh riêng vì không nằm trong phạm vi rà soát lần này). |

---

## 2. Lỗ hổng trong các chức năng đã có (so với business rule trong BRD)

### 2.1 Vận hành lớp/buổi học
- **Không có sinh buổi bù (makeup session)** khi hủy buổi — BR-05 của EDU-11 yêu cầu hủy buổi phải tự sinh buổi bù giữ nguyên tổng số buổi của lớp; grep toàn bộ mã nguồn không tìm thấy logic này ở đâu (SessionRuntime không có nút hủy; Lesson có nút hủy nhưng không kèm makeup).
- **Không có UI hủy buổi hàng loạt (bulk-cancel)** cho tình huống nghỉ đột xuất toàn chi nhánh (BF-09), dù BRD mô tả rõ nghiệp vụ này (nghỉ lễ đột xuất/bão).
- **Attendance không hỗ trợ offline** — BRD yêu cầu điểm danh vẫn ghi được khi mất mạng và tự đồng bộ sau; hiện tại 100% phụ thuộc kết nối mạng, rủi ro cao khi GV dạy ở phòng tín hiệu yếu.
- **Không thấy cảnh báo vắng liên tiếp** (BR-06 EDU-12: vắng ≥3 buổi liên tiếp phải cảnh báo Giáo vụ/Sales) ở màn Attendance hay Dashboard — nên có widget/badge riêng.

### 2.2 Bài tập & chấm bài
- **Homework không có loại "quiz" liên kết QuestionBank** dù QuestionBank đã tồn tại đầy đủ và độc lập — hai tính năng chưa được nối với nhau, lãng phí dữ liệu ngân hàng câu hỏi đã xây.
- **Không giao bài cho từng học viên riêng lẻ** (`assign_scope=selected` theo BRD) — hiện chỉ giao theo phạm vi lớp/level, không phù hợp với use case "giao bài phụ đạo cho 3 học viên yếu" mà BRD nêu.
- **Grading rất sơ khai so với yêu cầu**: thiếu annotate trực tiếp lên ảnh bài làm, thiếu ghi âm nhận xét (quan trọng với trẻ nhỏ chưa đọc tốt chữ), thiếu chấm hàng loạt + thư viện nhận xét mẫu, thiếu đa dạng thang điểm (số/chữ/sao — BRD yêu cầu sao cho lớp mẫu giáo). Đây là điểm trải nghiệm GV yếu nhất trong toàn bộ ứng dụng.

### 2.3 Kiểm tra & điểm số
- **Không có thi bù cho học viên vắng thi** (BR-05 EDU-16) — enum có `absent` nhưng không có action tạo lượt thi bù.
- **Không có bước publish/duyệt điểm** trước khi phụ huynh xem được — kết quả thi có vẻ hiển thị ngay, thiếu cơ chế kiểm soát chất lượng trước khi công bố (rủi ro gửi nhầm điểm cho phụ huynh).
- Hai tab "Phân tích câu hỏi" và "Chi tiết bài làm" trong ExamSession chỉ là khung rỗng (`ComingSoon`).

### 2.4 Tài chính & HR (ngoài phạm vi Education nhưng cùng ứng dụng)
- `Payroll`, `LeaveRequest` hoàn toàn mock — GV hiện không thể thực sự xem bảng lương hay nộp đơn nghỉ phép qua app dù giao diện trông như đã xong, dễ gây hiểu nhầm là "đã có tính năng" khi demo.
- `Notifications`, `Messages` hoàn toàn mock — đây là kênh liên lạc cốt lõi giữa GV–Giáo vụ–Phụ huynh mà BRD nhấn mạnh rất nhiều (thông báo realtime điểm danh, nhắc deadline, trả bài...); thiếu backend thật ở đây làm vô hiệu hóa nhiều tính năng khác đã "hoàn chỉnh" về mặt logic (VD: điểm danh xong nhưng phụ huynh không thực sự nhận được thông báo).
- `Withdraw`, `Invoice` (tạo/xem chi tiết) chưa có backend — nếu nghiệp vụ có yêu cầu GV rút ví/xem chi tiết hóa đơn thì đây là điểm nghẽn.
- `Subscription` trùng chức năng với `PackageManagement` nhưng chưa nối API — nên gộp lại, tránh 2 trang cùng nhiệm vụ gây nhầm lẫn bảo trì.

### 2.5 Đặt tên/kiến trúc gây nhầm lẫn
- **Code gọi "Classroom" cho lớp học (BRD gọi là "Class"/EDU-08), và gọi "Room" cho phòng học vật lý (BRD gọi là "Classroom"/EDU-06).** Đây thuần túy là vấn đề đặt tên, không ảnh hưởng chức năng, nhưng dễ gây hiểu nhầm nghiêm trọng khi trao đổi giữa đội code và đội BA/tài liệu — nên thống nhất 1 bộ thuật ngữ (khuyến nghị đổi tên hiển thị hoặc chú thích rõ trong tài liệu kỹ thuật).
- Hai trang mồ côi (`ChangePassword` độc lập, `FileUploaded`) không gắn route và có chức năng giả — nên dọn dẹp khỏi codebase để tránh nhầm là tính năng đang phát triển dở.

---

## 3. Đề xuất bổ sung tính năng mới

Dựa trên các luồng nghiệp vụ (BF-01 → BF-10) đã đọc trong `Business Flow - Education.md` mà chưa thấy UI tương ứng, và các khoảng trống hợp lý nên có với một ứng dụng quản lý trung tâm Anh ngữ:

1. **Màn "Bảo lưu học viên" (reserve) riêng biệt** — hiện có Transfer (chuyển lớp) nhưng chưa thấy luồng "bảo lưu + ngày dự kiến quay lại + kích hoạt lại vào lớp mới" (BF-07) như một wizard độc lập tương tự Transfer.
2. **Bảng cảnh báo chuyên cần & chăm sóc học viên nguy cơ nghỉ** (BF-08) — dashboard/widget liệt kê học viên vắng liên tiếp ≥3 buổi, trạng thái đã gọi chăm sóc chưa, để Giáo vụ/Sales theo dõi ngay trong app thay vì làm thủ công.
3. **Gợi ý tái ghi danh (renewal)** (BF-10) — hiện không thấy nơi nào hiển thị "học viên sắp hết buổi (≤5 buổi)" hay gợi ý khóa tiếp theo theo `next_level`; có thể thêm 1 widget trên Dashboard hoặc tab riêng trong StudentDetail.
4. **Module Certificate đầy đủ** (đã nêu ở mục 1) — nên làm theo đúng đặc tả BRD: trình thiết kế template, danh sách đủ/thiếu điều kiện tự động khi đóng lớp, phát hành lô, trang xác thực QR public.
5. **Hoàn thiện Grading**: thêm annotate ảnh, ghi âm nhận xét, chấm hàng loạt với nhận xét mẫu, hỗ trợ thang điểm sao cho lớp nhỏ tuổi — đây là hạng mục ảnh hưởng trực tiếp đến trải nghiệm hàng ngày của GV nên ưu tiên cao.
6. **Liên kết Homework ↔ QuestionBank** để hỗ trợ bài tập dạng quiz tự động chấm — tận dụng dữ liệu QuestionBank đã có sẵn đầy đủ (skill/type/difficulty).
7. **Cơ chế publish/duyệt điểm thi** trước khi hiển thị cho phụ huynh, cộng thêm luồng thi bù cho học viên vắng thi — tránh rủi ro công bố điểm sai/thiếu.
8. **Offline-first cho Attendance** (buffer local + đồng bộ khi có mạng) — đặc biệt quan trọng vì đây là thao tác GV làm mỗi buổi học, mạng yếu là rủi ro thực tế ở phòng học.
9. **Thiết lập lịch tuần + kiểm tra xung đột phòng/GV** ngay trong Schedule (hiện chỉ xem), hoặc nếu tính năng này đã nằm ở Class Wizard thì nên bổ sung link điều hướng rõ ràng từ Schedule sang đó để tránh cảm giác "thiếu chức năng".
10. **Dọn dẹp/hoàn thiện các trang mock** theo thứ tự ưu tiên gợi ý: Notifications & Messages (ảnh hưởng nhiều tính năng khác) → Payroll & LeaveRequest (ảnh hưởng trải nghiệm GV về quyền lợi) → Subscription (gộp vào PackageManagement) → Withdraw/Invoice detail.

---

## 4. Ưu tiên đề xuất triển khai (gợi ý)

| Ưu tiên | Hạng mục | Lý do |
|---|---|---|
| P0 | Notifications & Messages có backend thật | Là hạ tầng giao tiếp nền cho gần như mọi tính năng khác đã "hoàn chỉnh" về logic nhưng vô nghĩa nếu thông báo không tới được phụ huynh/GV thật. |
| P0 | Score finalize + Certificate | Khép kín vòng đời học viên (BF-06), hiện đang là 2 mắt xích thiếu ở cuối chuỗi giá trị dù dữ liệu đầu vào (điểm, chuyên cần) đã có đủ. |
| P1 | Hoàn thiện Grading (annotate, audio, bulk, thang điểm) | Tác động trực tiếp trải nghiệm GV hàng ngày, hiện là điểm yếu nhất trong nhóm tính năng học tập. |
| P1 | Offline attendance + cảnh báo chuyên cần | Rủi ro vận hành thực tế cao (mất mạng tại lớp) và ảnh hưởng giữ chân học viên. |
| P2 | Thi bù + publish điểm thi | Giảm rủi ro sai sót khi công bố điểm cho phụ huynh. |
| P2 | Homework-Quiz liên kết QuestionBank | Tận dụng tài sản dữ liệu đã có, nâng cao trải nghiệm học viên nhỏ tuổi. |
| P3 | Payroll/LeaveRequest thật, dọn Subscription/trang mồ côi | Không chặn nghiệp vụ đào tạo cốt lõi nhưng cần thiết trước khi go-live diện rộng. |
