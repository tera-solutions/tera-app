# Use Case — EDU-16 Examination (Kiểm tra)

> Hana Edu | Version 1.0 | 2026-07-08 | Tham chiếu: `BRD - Education.md` § EDU-16, `SRS/SRS-EDU-16-Examination.md`

---

## Danh mục Use Case

| ID | Tên | Actor chính |
|----|-----|-------------|
| UC-EDU-16-01 | Tổ chức kỳ thi giữa/cuối khóa | Giáo vụ |
| UC-EDU-16-02 | Nhập điểm theo kỹ năng (song song) | Teacher |
| UC-EDU-16-03 | Publish kết quả | Manager |
| UC-EDU-16-04 | Thi bù cho học viên vắng | Giáo vụ |
| UC-EDU-16-05 | Placement test (kiểm tra đầu vào) | Giáo vụ/Sales |

## Sơ đồ Actor – Use Case

```
Giáo vụ ────► UC-01, UC-04, UC-05
Teacher ────► UC-02 (coi thi, chấm, nhập điểm)
Manager ────► UC-03 (duyệt publish, ngoại lệ)
Parent/Student ────► xem kết quả sau publish
CRM/Sales ────► nhận kết quả placement (UC-05)
ScoreService ────► nhận event ExamPublished
```

---

## UC-EDU-16-01 — Tổ chức kỳ thi

| Thuộc tính | Nội dung |
|-----------|----------|
| Precondition | Lớp ongoing; theo cấu hình course lớp cần midterm + final |
| Postcondition | Kỳ thi planned; lịch thi thông báo phụ huynh trước X ngày |

**Luồng chính**

1. Giáo vụ tạo kỳ Final lớp Starters: 4 kỹ năng × 25 điểm, ngày thi, phòng, GV chấm (2 người: viết + nói).
2. Hệ thống validate ngày trong khoảng lớp → planned.
3. Thông báo lịch thi → Parent/Student App; nhắc lại trước 1 ngày.
4. Đến ngày thi → scheduler chuyển ongoing.

**Luồng thay thế:** A1: level thấp (mẫu giáo) chỉ bật Listening + Speaking.

**BR liên quan:** BR-01, BR-02, BR-04.

---

## UC-EDU-16-02 — Nhập điểm song song

| Thuộc tính | Nội dung |
|-----------|----------|
| Actor chính | 2+ Teachers được phân công |
| Precondition | Kỳ thi ongoing/grading |
| Postcondition | Đủ skill_scores mọi học viên (hoặc đánh dấu vắng) |

**Luồng chính**

1. GV A nhập Listening/Reading trên web (bảng spreadsheet, autosave 10s); GV B nhập Speaking trên tablet ngay trong giờ thi nói.
2. Hệ thống merge theo (student, skill) — hai người không đè nhau.
3. Học viên vắng → đánh dấu is_absent.
4. Nhập đủ → trạng thái grading hiển thị "sẵn sàng publish".

**Luồng thay thế:** A1: import điểm từ Excel theo template kỳ thi.

**Luồng ngoại lệ**

- E1: điểm vượt max kỹ năng → 422 E-EXM-01 ngay trên ô.
- E2: 2 người sửa cùng ô → optimistic lock, người sau thấy 409 + giá trị mới nhất.
- E3: đứt mạng → autosave buffer local, đẩy lại khi có mạng.

**BR liên quan:** BR-02.

---

## UC-EDU-16-03 — Publish kết quả

| Thuộc tính | Nội dung |
|-----------|----------|
| Actor chính | Manager (hoặc Giáo vụ nếu Setting không yêu cầu duyệt) |
| Precondition | 100% học viên đủ điểm hoặc is_absent |
| Postcondition | Kết quả visible cho PH; điểm đổ vào EDU-17; thông báo gửi |

**Luồng chính**

1. Giáo vụ bấm Publish → hệ thống validate đủ dữ liệu.
2. Setting yêu cầu duyệt → tạo approval → Manager approve.
3. Publish nguyên tử: status published + snapshot → event `ExamPublished` → ScoreService ghi component → fan-out push từng phụ huynh (điểm kỹ năng + nhận xét, biểu đồ radar).

**Luồng ngoại lệ**

- E1: thiếu điểm → 422 E-EXM-02 danh sách chính xác (em nào, kỹ năng nào).
- E2: sửa điểm sau publish → flow duyệt Manager (như UC-EDU-15-04) + re-notify.

**BR liên quan:** BR-03, BR-06.

---

## UC-EDU-16-04 — Thi bù

**Trigger:** 2 học viên ốm ngày thi chính.

**Luồng chính:** Giáo vụ tạo makeup {2 học viên, ngày thứ 7 tuần này} (≤ exam_date + 14 ngày) → thông báo 2 phụ huynh → GV nhập điểm sau thi bù vào kỳ gốc (is_makeup=true) → đủ dữ liệu → publish toàn kỳ.

**Ngoại lệ:** quá hạn 14 ngày → 422 E-EXM-04; giữ absent → xét chứng chỉ cần ngoại lệ Manager (UC-EDU-18).

**BR liên quan:** BR-05.

---

## UC-EDU-16-05 — Placement test

| Thuộc tính | Nội dung |
|-----------|----------|
| Trigger | Khách mới muốn kiểm tra trình độ trước khi đăng ký |
| Precondition | Lead/customer từ CRM |
| Postcondition | Kết quả + suggested_level → Sales tư vấn khóa phù hợp |

**Luồng chính**

1. Sales đặt lịch placement cho bé → Giáo vụ tạo kỳ type=placement (gắn chi nhánh, không gắn lớp).
2. GV kiểm tra + nhập điểm kỹ năng.
3. Hệ thống tính tổng → tra `placement_level_mappings` (VD 70–85 = Movers) → suggested_level.
4. CRM đọc kết quả → Sales tư vấn khóa thuộc level Movers → chốt → flow ghi danh.

**Ngoại lệ:** tổng điểm ngoài mọi range mapping → không gợi ý, Giáo vụ tư vấn tay + alert Admin bổ sung mapping.

**BR liên quan:** BR-01.
