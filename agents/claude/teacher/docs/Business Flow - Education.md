# Business Flow — Hana Edu (Education & liên module)

> Version 1.0 | 2026-07-08 | Draft
>
> Tham chiếu: `BRD - Education.md`, folder `SRS/`, folder `UseCase/`
>
> Ký hiệu module: [CRM] [FIN]=Finance [EDU]=Education [HR] [NTF]=Notification [RPT]=Reporting

---

## Danh mục Business Flow

| Mã | Flow | Module tham gia |
|----|------|-----------------|
| BF-01 | Tuyển sinh → Nhập học | CRM, FIN, EDU, NTF |
| BF-02 | Mở lớp mới | EDU |
| BF-03 | Vận hành buổi học hàng ngày | EDU, NTF, HR |
| BF-04 | Chu trình bài tập về nhà | EDU, NTF |
| BF-05 | Kiểm tra & công bố điểm | EDU, NTF |
| BF-06 | Kết thúc khóa học | EDU, FIN, NTF, CRM |
| BF-07 | Biến động ghi danh (chuyển/bảo lưu/hủy) | EDU, FIN, NTF |
| BF-08 | Quản lý vắng học & chăm sóc | EDU, CRM, NTF |
| BF-09 | Biến động lịch học (dời/hủy/dạy thay) | EDU, NTF |
| BF-10 | Tái ghi danh (renewal) | EDU, CRM, FIN |

## Bản đồ tổng thể

```
        BF-01 Tuyển sinh                    BF-02 Mở lớp
             │                                   │
             └──────────► Ghi danh ◄─────────────┘
                             │
                    BF-03 Buổi học hàng ngày ◄── BF-09 Biến động lịch
                       │           │
              BF-04 Bài tập   BF-08 Vắng học
                       │           │
                    BF-05 Kiểm tra │
                             │     │
                    BF-06 Kết thúc khóa ──► BF-10 Tái ghi danh ──► (vòng lại Ghi danh)
                             │
                    BF-07 Biến động ghi danh (chạy song song bất kỳ lúc nào)
```

---

# BF-01 — Tuyển sinh → Nhập học

**Mục tiêu:** biến quan tâm của phụ huynh thành học viên vào lớp, thanh toán đầy đủ.

**Actor:** Phụ huynh, Sales, Giáo vụ, Kế toán, System.

## Sơ đồ

```
[CRM] Lead (FB/Website/Landing) ──► Chia Sales ──► Tư vấn/Follow-up
                                                      │
                                        (tùy chọn) Placement Test [EDU]
                                                      │ suggested_level
                                                   Báo giá (Opportunity)
                                                      │ chốt
                                        [FIN] Invoice ──► Thu tiền (đủ ngưỡng)
                                                      │ PaymentConfirmed
                        [EDU] Auto tạo Student + Enrollment (có lớp chỉ định)
                                        │                    │ (chưa có lớp)
                                        ▼                    ▼
                          [NTF] Chào mừng + lịch học   Task "Chờ xếp lớp" → Giáo vụ xếp
```

## Bước chi tiết

| # | Actor | Hành động | Chức năng | Đầu ra |
|---|-------|-----------|-----------|--------|
| 1 | PH | Để lại thông tin (form/fanpage) | CRM Lead | Lead mới |
| 2 | System | Chia lead theo rule | CRM Assignment | Sales phụ trách |
| 3 | Sales | Gọi tư vấn, hẹn test | CRM Follow-up | Lịch hẹn |
| 4 | Giáo vụ/GV | Kiểm tra đầu vào | UC-EDU-16-05 | suggested_level |
| 5 | Sales | Báo giá khóa theo level | CRM Opportunity | Báo giá |
| 6 | Kế toán | Tạo invoice, thu tiền | FIN Invoice/Payment | PaymentConfirmed |
| 7 | System | Tạo Student (idempotent) | UC-EDU-01-02 | Student pending |
| 8 | System/Giáo vụ | Ghi danh vào lớp | UC-EDU-09-01/02 | Enrollment active |
| 9 | System | Thông báo chào mừng + lịch + tài khoản app | NTF | PH sẵn sàng |

## Rẽ nhánh & ngoại lệ

- 6a: Trả góp — đủ ngưỡng đợt 1 vẫn được ghi danh (Setting); các đợt sau FIN theo dõi công nợ.
- 8a: Chưa có lớp phù hợp → pending_placement, Giáo vụ xếp sau; quá N ngày chưa xếp → alert Manager.
- 8b: Lớp chỉ định đầy → fallback pending + alert.
- Bất kỳ: PH hủy trước khai giảng → BF-07 nhánh hủy.

**KPI:** conversion lead→student; thời gian lead→enrollment; % auto-enrollment thành công.

---

# BF-02 — Mở lớp mới

**Mục tiêu:** từ nhu cầu tuyển sinh ra lớp sẵn sàng khai giảng, không xung đột tài nguyên.

**Actor:** Manager, Giáo vụ, System.

## Sơ đồ

```
Nhu cầu (occupancy trống + demand CRM) ──► Chọn Course active
        │
Wizard: Thông tin ──► Lịch tuần (preview né lễ, check phòng/GV) ──► Gán GV
        │ transaction all-or-nothing
Class draft + 48 sessions + class_teachers
        │
     Mở tuyển (open) ──► Sales gắn lớp vào tư vấn ──► Ghi danh dần (BF-01)
        │ buổi 1 bắt đầu (scheduler)
     ongoing (khai giảng)
```

## Bước chi tiết

| # | Actor | Hành động | Chức năng |
|---|-------|-----------|-----------|
| 1 | Manager | Quyết định mở lớp (xem occupancy UC-EDU-06-03 + demand) | RPT |
| 2 | Giáo vụ | Wizard 3 bước | UC-EDU-08-01, UC-EDU-10-01, UC-EDU-07-02 |
| 3 | System | Sinh sessions, validate conflict | SRS-EDU-10 FR-02 |
| 4 | Giáo vụ | Mở tuyển | Class open |
| 5 | Sales | Ghi danh học viên vào lớp | BF-01 bước 8 |
| 6 | System | Khai giảng: open→ongoing | Scheduler |

## Rẽ nhánh & ngoại lệ

- 3a: Conflict phòng/GV → đổi slot, không sinh buổi nào (all-or-nothing).
- 6a: Đến hạn khai giảng chưa đủ sĩ số min → Manager quyết: dời khai giảng (regenerate lịch) hoặc hủy lớp (BF-07/UC-EDU-08-04).

**KPI:** thời gian mở lớp; tỷ lệ lấp đầy khi khai giảng; % lớp phải dời/hủy.

---

# BF-03 — Vận hành buổi học hàng ngày

**Mục tiêu:** mỗi buổi học diễn ra đúng lịch, dữ liệu chuyên cần realtime đến phụ huynh, giờ dạy ghi nhận chính xác.

**Actor:** System, Teacher, Parent.

## Sơ đồ

```
[Scheduler] 2h trước: nhắc lịch PH/HV ──► đến giờ: session ongoing
                                              │
                     GV mở Teacher App ──► Bắt đầu buổi ──► Điểm danh từng em
                                              │                  │
                                              │        [NTF] push PH realtime
                                              │        ("đến lớp 18:02" / "vắng")
                                              │                  │
                     Ghi chú nội dung ◄───────┘        PH báo vắng trước? → auto gợi ý
                                              │
                                        Hoàn tất buổi (đủ 100% điểm danh)
                                              │ SessionCompleted
              ┌───────────────┬───────────────┼────────────────┐
        used_sessions    giờ dạy [HR]    tiến độ lớp      [RPT] thống kê
```

## Bước chi tiết

| # | Actor | Hành động | Chức năng |
|---|-------|-----------|-----------|
| 1 | System | Nhắc lịch trước 2h | NTF, Setting |
| 2 | System | scheduled→ongoing đúng giờ | SRS-EDU-11 |
| 3 | Teacher | Start buổi | UC-EDU-11-01 |
| 4 | Teacher | Điểm danh (offline được) | UC-EDU-12-01, UC-EDU-11-04 |
| 5 | System | Push PH từng em ≤1' | SRS-EDU-12 FR-06 |
| 6 | Teacher | Note + Complete | UC-EDU-11-01 |
| 7 | System | Hậu xử lý: used_sessions, giờ dạy, tiến độ | Events |

## Rẽ nhánh & ngoại lệ

- 3a: GV quên start/điểm danh quá 30' → nhắc GV + cảnh báo Giáo vụ.
- 4a: PH đã báo vắng trước (UC-EDU-12-02) → GV confirm 1 tap.
- 4b: Mất mạng → offline queue, sync sau (server-wins).
- 6a: Thiếu điểm danh → chặn complete tới khi đủ.
- Vắng không phép lần 3 liên tiếp → BF-08.

**KPI:** % buổi complete đúng hạn; độ trễ push PH; % buổi GV quên điểm danh.

---

# BF-04 — Chu trình bài tập về nhà

**Mục tiêu:** khép kín giao → nộp → chấm → phản hồi, phụ huynh đồng hành, điểm đổ vào quá trình.

**Actor:** Teacher, Student, Parent, System.

## Sơ đồ

```
GV giao bài (cả lớp/nhóm) ──► [NTF] push HV+PH
        │                         │
        │              [Scheduler] nhắc −24h/−2h (chưa nộp)
        ▼                         ▼
HV nộp (ảnh/audio/quiz) ──► GV theo dõi 3 phân đoạn ──► nộp hộ bài giấy
        │                                                    │
        └────────────► GV chấm (điểm + nhận xét ± annotation/audio)
                              │                    │
                        [NTF] trả bài HV+PH   yêu cầu làm lại (redo) ──► HV nộp lại
                              │
                    [EDU-17] điểm quá trình (component homework)
```

## Bước chi tiết

| # | Actor | Hành động | Chức năng |
|---|-------|-----------|-----------|
| 1 | Teacher | Giao bài sau buổi học | UC-EDU-13-01/02 |
| 2 | System | Push + nhắc deadline | UC-EDU-13-05 |
| 3 | Student | Nộp bài | UC-EDU-14-01/02 |
| 4 | Teacher | Nộp hộ bài giấy nếu cần | UC-EDU-14-03 |
| 5 | Teacher | Chấm chuỗi / bulk | UC-EDU-15-01/02/03 |
| 6 | System | Trả kết quả + đổ điểm quá trình | UC-EDU-17-02 |

## Rẽ nhánh & ngoại lệ

- 3a: Nộp muộn → cờ late (hoặc chặn theo cấu hình bài).
- 5a: Bài sai yêu cầu → redo (UC-EDU-14-04) → vòng lại bước 3.
- 5b: GV chấm chậm >3 ngày → alert Giáo vụ (UC-EDU-15-05).

**KPI:** % nộp đúng hạn; thời gian chấm trung bình; % bài có phản hồi chi tiết (annotation/audio).

---

# BF-05 — Kiểm tra & công bố điểm

**Mục tiêu:** đánh giá định kỳ chuẩn hóa theo kỹ năng, kết quả minh bạch đến phụ huynh đúng thời điểm.

**Actor:** Giáo vụ, Teacher, Manager, System.

## Sơ đồ

```
Giáo vụ tạo kỳ thi (midterm/final, kỹ năng × max điểm)
        │ [NTF] lịch thi PH trước X ngày + nhắc trước 1 ngày
     Ngày thi: ongoing ──► GV coi thi + nhập điểm song song (autosave, merge theo skill)
        │                       │ HV vắng → đánh dấu absent ──► xếp thi bù ≤14 ngày
     grading (đủ điểm) ──► Manager duyệt ──► PUBLISH (nguyên tử)
                                               │
                        ┌──────────────────────┼──────────────────┐
                 [NTF] kết quả PH        [EDU-17] component     [RPT] phân bố điểm
                 (radar kỹ năng)          exam_midterm/final
```

## Bước chi tiết

| # | Actor | Hành động | Chức năng |
|---|-------|-----------|-----------|
| 1 | Giáo vụ | Tạo kỳ thi | UC-EDU-16-01 |
| 2 | System | Thông báo + nhắc lịch thi | NTF |
| 3 | Teacher | Nhập điểm kỹ năng (song song 2 GV) | UC-EDU-16-02 |
| 4 | Giáo vụ | Xếp thi bù cho HV vắng | UC-EDU-16-04 |
| 5 | Manager | Duyệt & publish | UC-EDU-16-03 |
| 6 | System | Đổ điểm EDU-17 + push PH | Events |

## Rẽ nhánh & ngoại lệ

- 5a: Thiếu điểm → chặn publish, liệt kê chính xác.
- 6a: Sửa điểm sau publish → duyệt Manager + re-notify + recalc.
- 4a: Quá hạn thi bù → absent giữ nguyên → ảnh hưởng xét chứng chỉ (BF-06, cần ngoại lệ).

**KPI:** % publish đúng hạn sau ngày thi; % HV thi bù đúng hạn; phân bố điểm theo lớp/GV.

---

# BF-06 — Kết thúc khóa học

**Mục tiêu:** đóng lớp trọn vẹn: điểm chốt, phiếu điểm, chứng chỉ, và chuyển tiếp sang tái ghi danh.

**Actor:** Giáo vụ, Manager, System, Parent.

## Sơ đồ

```
Buổi cuối completed ──► Giáo vụ chạy close-checklist
   (buổi đủ / điểm danh đủ / đầu điểm đủ)
        │ pass                        │ fail → bổ sung (điểm, thi bù...) → chạy lại
   Manager confirm đóng lớp
        │ transaction
   Finalize scores ──► xếp loại ──► phiếu điểm PDF ──► [NTF] PH
        │ ScoreFinalized
   Certificate eligibility (điểm + chuyên cần + công nợ [FIN])
        │
   ┌────┴─────────┐
   Đủ ĐK      Thiếu ĐK ──► Manager duyệt ngoại lệ? ──► không → thông báo lý do
   │ Manager duyệt lô
   Phát hành chứng chỉ (số hiệu + PDF + QR) ──► [NTF] PH
        │
   Enrollment completed ──► Student completed ──► [CRM] BF-10 tái ghi danh
```

## Bước chi tiết

| # | Actor | Hành động | Chức năng |
|---|-------|-----------|-----------|
| 1 | Giáo vụ | Close-checklist | UC-EDU-08-03 |
| 2 | Manager | Confirm đóng | UC-EDU-08-03 |
| 3 | System | Finalize + phiếu điểm | UC-EDU-17-04 |
| 4 | System | Eligibility 3 điều kiện | UC-EDU-18-01 |
| 5 | Manager | Duyệt lô + ngoại lệ | UC-EDU-18-01/02 |
| 6 | System | Phát hành chứng chỉ | UC-EDU-18-01 |
| 7 | System | Trigger tái ghi danh | BF-10 |

## Rẽ nhánh & ngoại lệ

- 1a: Checklist fail → nêu rõ thiếu gì; vòng bổ sung.
- 4a: Nợ học phí → chờ FIN thu nốt → cấp bổ sung.
- 6a: Render PDF lỗi → retry, số hiệu giữ; sai thông tin → thu hồi/cấp lại (UC-EDU-18-05).

**KPI:** thời gian từ buổi cuối → đóng lớp; % học viên đạt & nhận chứng chỉ; % lớp đóng không phải bổ sung.

---

# BF-07 — Biến động ghi danh

**Mục tiêu:** xử lý mọi thay đổi giữa khóa: chuyển lớp, bảo lưu, hủy & hoàn phí — bảo toàn quyền lợi số buổi.

**Actor:** Giáo vụ, Manager, Parent, System.

## Sơ đồ

```
                        Enrollment active
        ┌──────────────────┼──────────────────────┐
   Chuyển lớp          Bảo lưu                 Hủy học
        │                  │                       │
  tính buổi còn lại   reserved + ngày về      tính remaining
  lớp mới cùng             │                       │
  course/level        quay lại: activate      [FIN] refund request
        │             lớp mới (remaining)          │ tính tiền theo chính sách
  enrollment mới           │                  hoàn tiền + thông báo 2 bước
  (transfer, bảo toàn)     │                       │
        └────────► [NTF] PH lịch/kết quả ◄─────────┘
```

## Bước chi tiết

| Nhánh | Bước chính | Chức năng |
|-------|-----------|-----------|
| Chuyển lớp | So sánh lịch → tính 30/48 còn lại → transaction chuyển → notify 2 GV + PH | UC-EDU-08-02 |
| Bảo lưu | reserve + expected_return → loại khỏi roster → nhắc khi đến hạn → activate lớp mới | UC-EDU-09-03 |
| Hủy | cancel + lý do → remaining → FIN refund → student status quyết bởi Giáo vụ | UC-EDU-09-04 |

## Rẽ nhánh & ngoại lệ

- Chuyển: lớp đích đầy → Manager override hoặc chọn lớp khác.
- Bảo lưu: quá hạn quay lại → job nhắc Giáo vụ chăm sóc; không quay lại → chuyển nhánh hủy.
- Hủy: tranh chấp số buổi → recalculate từ attendance (nguồn sự thật).

**KPI:** % chuyển lớp thành công không mất buổi; % bảo lưu quay lại học; thời gian xử lý hoàn phí.

---

# BF-08 — Quản lý vắng học & chăm sóc

**Mục tiêu:** phát hiện sớm học viên có nguy cơ nghỉ, chăm sóc giữ chân.

**Actor:** Parent, Teacher, System, Sales, Giáo vụ.

## Sơ đồ

```
PH báo vắng trước ──► GV confirm (absent_excused)
        │
Điểm danh absent (không phép) ──► rule engine đếm chuỗi
        │ chuỗi ≥ 3
[NTF] cảnh báo Giáo vụ + Sales ──► gọi chăm sóc PH ──► ghi kết quả [CRM]
        │                                  │
        │                    lý do: bận/ốm → hẹn học bù/bảo lưu (BF-07)
        │                    lý do: muốn nghỉ → Manager can thiệp giữ chân
        ▼
[RPT] tỷ lệ chuyên cần lớp/chi nhánh ──► họp vận hành định kỳ
```

## Bước chi tiết

| # | Actor | Hành động | Chức năng |
|---|-------|-----------|-----------|
| 1 | Parent | Báo vắng trước qua app | UC-EDU-12-02 |
| 2 | System | Đếm chuỗi vắng sau mỗi điểm danh | UC-EDU-12-04 |
| 3 | Sales | Gọi chăm sóc, ghi log CRM | CRM Follow-up |
| 4 | Giáo vụ | Phương án: học bù/bảo lưu/động viên | BF-07 |
| 5 | Manager | Case muốn nghỉ hẳn → retention offer | CRM |

**KPI:** % học viên cảnh báo được gọi trong 24h; % giữ chân sau cảnh báo; tương quan chuyên cần–kết quả.

---

# BF-09 — Biến động lịch học

**Mục tiêu:** xử lý mọi thay đổi lịch, phụ huynh luôn được báo trước, tổng quyền lợi buổi học không đổi.

**Actor:** Giáo vụ, Manager, Teacher, System.

## Sơ đồ

```
                     Sự kiện phát sinh
   ┌──────────────┬────────────────┬───────────────────┐
GV bận 1 buổi   Phòng bảo trì   Nghỉ đột xuất      Đổi lịch dài hạn
   │                │            (bão, toàn CN)        │
Ưu tiên 1:      liệt kê buổi        │             sửa slot tuần
dạy thay ────►  ảnh hưởng      bulk-cancel       regenerate buổi
   │ không có   → đổi phòng    → make-up          tương lai
Ưu tiên 2:      từng buổi      từng lớp                │
dời buổi            │               │                  │
   │ không được     │               │                  │
Ưu tiên 3: hủy + make-up cuối chuỗi │                  │
   └────────────────┴───────────────┴──────────────────┘
                          │
        [NTF] thông báo PH trước ≥ min_notice_hours (gộp tin khi bulk)
```

## Bước chi tiết

| Nhánh | Bước chính | Chức năng |
|-------|-----------|-----------|
| Dạy thay | check lịch GV thay → gán buổi → notify | UC-EDU-07-03 |
| Dời buổi | reschedule + lý do → conflict check → notify | UC-EDU-10-03 |
| Hủy + bù | cancel → make-up cuối chuỗi → notify | UC-EDU-11-02 |
| Bulk | hủy cả ngày chi nhánh → bù từng lớp → tin gộp/PH | UC-EDU-11-03 |
| Bảo trì phòng | maintenance → danh sách ảnh hưởng → đổi phòng | UC-EDU-06-02 |
| Dài hạn | sửa slot → regenerate tương lai | UC-EDU-10-02 |

**Nguyên tắc:** ưu tiên dạy thay > dời > hủy; notice tối thiểu theo Setting; tổng số buổi lớp bất biến.

**KPI:** % buổi biến động báo trước đủ thời gian; % chọn dạy thay thay vì hủy; số buổi bù tồn đọng.

---

# BF-10 — Tái ghi danh (Renewal)

**Mục tiêu:** giữ học viên học tiếp lộ trình level kế — nguồn doanh thu bền vững nhất.

**Actor:** System, Sales, Parent, Giáo vụ.

## Sơ đồ

```
Trigger 1: enrollment còn ≤5 buổi (job hàng ngày)
Trigger 2: lớp đóng, học viên completed (BF-06)
        │
[EDU] gợi ý lộ trình: level hiện tại → next_level → course active
        │
[CRM] task Sales "Tư vấn tái ghi danh" + [NTF] Parent App gợi ý
        │
Sales tư vấn (kèm kết quả học tập: điểm, chuyên cần, nhận xét GV)
        │ chốt                          │ chưa chốt
[FIN] invoice khóa mới            follow-up theo chu kỳ CRM
        │ PaymentConfirmed             │ từ chối → lý do → [RPT] churn
[EDU] enrollment lớp mới (BF-01 bước 7-9)
        │
Học tiếp — vòng đời lặp lại
```

## Bước chi tiết

| # | Actor | Hành động | Chức năng |
|---|-------|-----------|-----------|
| 1 | System | Trigger renewal (2 nguồn) | UC-EDU-09-05, BF-06 |
| 2 | System | Gợi ý khóa theo next_level | UC-EDU-05-02 |
| 3 | Sales | Tư vấn với data kết quả học | CRM + RPT |
| 4 | Kế toán | Invoice + thu tiền | FIN |
| 5 | System | Ghi danh lớp mới | BF-01 |

## Rẽ nhánh & ngoại lệ

- 2a: Level cuối chuỗi → tư vấn chương trình khác/luyện thi.
- 2b: next_level không có course active → alert Manager thiếu sản phẩm.
- 3a: Từ chối → ghi lý do churn → báo cáo cải thiện.

**KPI:** retention rate (% tái ghi danh); thời gian gap giữa 2 khóa; doanh thu renewal/tổng doanh thu.

---

# Phụ lục — Ma trận Flow × Chức năng EDU

| Flow | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 |
|------|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
| BF-01 | ✓ | ✓ | | | ✓ | | | | ✓ | | | | | | | ✓ | | |
| BF-02 | | | ✓ | | | ✓ | ✓ | ✓ | | ✓ | ✓ | | | | | | | |
| BF-03 | | | | | | | | | ✓ | | ✓ | ✓ | | | | | | |
| BF-04 | | | | | | | | | | | | | ✓ | ✓ | ✓ | | ✓ | |
| BF-05 | | | | | | | | | | | | | | | | ✓ | ✓ | |
| BF-06 | ✓ | | | | | | | ✓ | ✓ | | | | | | | | ✓ | ✓ |
| BF-07 | ✓ | | | | | | | ✓ | ✓ | | | ✓ | | | | | | |
| BF-08 | | ✓ | | | | | | | | | | ✓ | | | | | | |
| BF-09 | | | | | | ✓ | ✓ | | | ✓ | ✓ | | | | | | | |
| BF-10 | | | | | ✓ | | | | ✓ | | | | | | | | ✓ | |
