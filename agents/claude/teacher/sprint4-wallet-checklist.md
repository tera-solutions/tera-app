# Sprint 4 — Ví & Cá nhân [050]–[056] + [068] Đơn xin nghỉ · Checklist tiến độ

> Đối chiếu `agents/claude/teacher/task.md` (§[050]–[056]) với code thật trong `webs/teacher/src/pages/`
> và route sống trong Postman collection `Modules` → `Finance/Wallet`.
>
> Cập nhật: **2026-07-09**
>
> Ký hiệu: `[x]` đã làm · `[ ]` chưa làm · `[~]` làm rồi nhưng **còn hạn chế do backend**
> · 🚫 **backend không có endpoint** — không thể làm bằng frontend
>
> ✅ **Response API đã verify bằng dữ liệu thật** (gọi API sống 2026-07-09, Postman không lưu example
> nào) — field name + enum trong `_utils.ts`/`constants.tsx` nay khớp backend.
>
> ⚠️ **Vẫn chưa hạng mục "Kiểm thử" nào được thực hiện.** Repo không có test runner, và màn Ví **chưa
> từng được render với dữ liệu thật** — mới chỉ verify ở tầng response JSON, chưa chạy app.

---

## 📮 Gửi BE — danh sách yêu cầu (2026-07-09)

### 🔴 Chặn hoàn toàn, không làm tiếp được

1. **Cấp quyền cho role Teacher đọc ví của chính mình.**
   `GET /v1/fin/wallet/list?owner_type=teacher&owner_id=<user_id>` đang trả
   `{code: 403, "Bạn không có quyền sử dụng chức năng này!"}` với token giáo viên.
   Cần mở quyền cho **`fin/wallet/list`** và **`fin/wallet/transactions`**, giới hạn ở ví mà
   `owner_id` = chính user đang đăng nhập. → **Không có cái này thì [050] không chạy được.**

2. **Chốt luồng nạp tiền cho giáo viên ([051]).**
   `POST /v1/fin/wallet/deposit` cũng bị chặn với token giáo viên (đúng về bảo mật). Nhưng vậy thì
   giáo viên nạp tiền bằng cách nào? Ba khả năng, cần product/BE chọn:
   (a) có **payment gateway** → FE redirect sang cổng, BE nhận webhook rồi tự ghi `deposit`;
   (b) endpoint **"yêu cầu nạp → kế toán duyệt"** (hiện KHÔNG có route nào như vậy);
   (c) nạp tiền là việc của kế toán bên web admin → **bỏ [051] khỏi portal giáo viên**.

3. **[052] Rút tiền — xác nhận có làm không.** `transaction_type` không có `withdraw`, không có route
   `fin/wallet/withdraw`. Ví là **số dư trả trước để thanh toán hóa đơn**, không rút về ngân hàng.
   Nếu không làm → bỏ task khỏi sprint.

4. **[053][054][055] — bao giờ có module HR/Timesheet + Payroll?** Folder `HR` hiện chỉ có
   `Achievement`, `Teacher`, `Teacher Certificate`, `Teacher Review`.

### 🟡 Cần bổ sung để làm đúng thiết kế

5. **Thêm field `payment_provider`** (hoặc mở rộng enum `payment_method`).
   Hiện `payment_method` chỉ có `cash|transfer|card|wallet|other` → MoMo và ZaloPay ghi vào sổ cái
   giống hệt nhau, thẻ nội địa và thẻ quốc tế cũng vậy. Thiết kế có cột "Phương thức" hiện logo từng
   nhà cung cấp → FE buộc phải nhét tên vào `note` rồi parse ngược, rất mong manh.

6. **Endpoint `fin/wallet/summary`** — thống kê toàn bộ lịch sử (tổng nạp/tổng chi/số giao dịch).
   Hiện FE tự cộng phía client, mà `per_page` trần 100 → **số liệu chỉ đúng trên 100 giao dịch gần
   nhất**, không phải toàn bộ.

7. **Endpoint export** cho lịch sử giao dịch (nút "Xuất file" đang không có route để gọi).

8. **API khuyến mãi nạp ví** (+2%/+5% trong thiết kế) và **bảng phí giao dịch** — hiện không có, FE
   đang hiển thị "Miễn phí" + card ưu đãi xám nhãn "Sắp có".

9. **Param `search`** cho `fin/wallet/transactions` — hiện BE **bỏ qua** param này, ô tìm kiếm trên
   UI không lọc được gì.

9b. 🔴 **Ví được tạo LÚC NÀO? (chưa ai trả lời)** — folder `Finance/Wallet` có **đúng 11 route, không
    có `create`**, nên **FE không tạo được ví**; ví do backend tự sinh theo owner. Nhưng chưa rõ sinh
    ở thời điểm nào, và 3 khả năng cho 3 hành vi rất khác nhau:
    - **(a) sinh cùng lúc với user** → `useTeacherWallet()` luôn tìm thấy, không vấn đề gì.
    - **(b) sinh lazy khi có bút toán đầu tiên** → 🔴 **vòng lặp chết**: giáo viên mới thấy màn Ví
      rỗng, mà muốn nạp tiền thì `POST fin/wallet/deposit` lại đòi `wallet_id` — cái chỉ có khi đã
      có ví. Không có đường thoát.
    - **(c) chỉ seeder tạo** → giáo viên thật trên production sẽ **không có ví**.

    ❓ **Hỏi BE**: *"Ví được tạo khi nào — lúc tạo user, hay lazy khi có bút toán đầu tiên? Giáo viên
    mới đăng ký mà chưa có ví thì `fin/wallet/list` trả rỗng, FE phải làm gì?"*

    ⚠️ Chưa lộ ra vì DB dev có sẵn ví, và role Teacher đang bị 403 nên không ai đi tới bước đó.

### 🔵 Lỗi nhỏ / dữ liệu

10. **`owner_type_label` của ví teacher trả `null`** (ví parent có `"Phụ huynh"`) — chưa map nhãn.

11. **Cân nhắc: BE tự scope `fin/wallet/list` theo token** thay vì bắt FE truyền `owner_type` +
    `owner_id`. Ví là dữ liệu tiền, để FE nhớ truyền filter đúng ở mọi màn là chuyện sớm muộn cũng quên.

12. **Backend trả `HTTP 200` kèm `code: 403` trong body** thay vì HTTP 403. Không sai với FE hiện tại
    (interceptor có kiểm `data.code`), nhưng dễ bẫy client khác + sai chuẩn HTTP.

---

## Bức tranh chung

| Task | Tiêu đề | Trạng thái | Chặn bởi |
| --- | --- | --- | --- |
| [050] | Ví cá nhân | 🔴 **403 với tài khoản giáo viên** | 🚫 role Teacher bị chặn quyền trên module ví |
| [051] | Nạp tiền | ✅ **FE xong 6/6** · 🟡 API chờ người khác tích hợp (tắt bằng `DEPOSIT_ENABLED`) | 🚫 **GV không có quyền gọi `deposit`** · không có gateway |
| [052] | Rút tiền | ✅ **FE xong 6/6** · 🚫 API không làm được (tắt bằng `WITHDRAW_ENABLED`) | 🚫 backend không có khái niệm rút tiền |
| [053] | Bảng công | ✅ **FE xong** (full khung theo `bang cong.png`, dữ liệu thật từ `edu/timetable/calendar`) · 🟡 vài khối "Sắp có" chờ backend | 🚫 endpoint timetable không trả `student_count`/`learning_type`/`note`; không có Timesheet/Payroll/activity/export |
| [054] | Bảng lương | 🔴 Chưa làm | 🚫 không có endpoint Payroll |
| [055] | Chi tiết bảng lương | 🔴 Chưa làm | 🚫 không có endpoint Payroll |
| [056] | Gói đăng ký | 🔴 Chưa làm | ❓ chưa rõ nghiệp vụ + chưa tìm ra endpoint |

**Route Wallet thật — đúng 11 request, không hơn:**
`GET fin/wallet/list` · `GET fin/wallet/detail/:id` · `GET fin/wallet/transactions` ·
`POST fin/wallet/{deposit|payment|refund|adjustment|from-invoice|from-payment}` ·
`POST fin/wallet/{lock|unlock}/:id`

Không có `create` / `update` / `delete` / `export` / `summary` / `withdraw`.

---

## [050] - Teacher - Ví cá nhân

Code: `webs/teacher/src/pages/Wallet/` · Route `/wallet` · Menu đã wire (`menus.tsx:361`)

> 🔴 **CHẶN BỞI BACKEND (verify 2026-07-09)** — đăng nhập web bằng **tài khoản giáo viên**, request
> `GET /v1/fin/wallet/list?owner_id=5&owner_type=teacher&page=1&per_page=20` trả:
>
> ```
> HTTP 200 OK
> { "code": 403, "msg": "Bạn không có quyền sử dụng chức năng này!", "errors": [], "data": null }
> ```
>
> **Role Teacher không có quyền đọc `fin/wallet/list`.** Màn Ví không hiển thị được gì —
> `wallet.id` = null nên `transactions` cũng không được gọi (`enabled: !!wallet.id`).
> **FE không sửa được**, phải chờ BE cấp quyền.
>
> ⚠️ **Backend trả HTTP 200 kèm `code: 403` trong body** (không phải HTTP 403). May là
> `_requestResponse` (`services/api/src/drivers/_interceptor.ts:61`) đã kiểm `data.code !== 200` →
> `throw response` → react-query báo lỗi + toast hiện đúng message. Đừng đổi interceptor này.
>
> ⚠️ Mọi response JSON dùng để verify shape trong phiên này đều lấy bằng token **`super`**
> (`is_admin: 1`, gọi được mọi endpoint). Chúng đúng về *hình dạng dữ liệu*, **không** chứng minh
> được giáo viên có quyền. Bài học: **verify quyền phải bằng đúng role của người dùng màn hình đó.**
>
> ✅ Điểm sáng: query string cho thấy fix mục 4a wire đúng (`owner_id=5&owner_type=teacher`).

- [x] Xây dựng UI ví cá nhân
- [x] Xây dựng `WalletSummary` component
- [x] Xây dựng `BalanceCard` component
- [x] Xây dựng `TransactionTable` component
- [~] Tích hợp API Wallet Summary — 🚫 **endpoint không tồn tại**, đang tính client-side (mục 1)
- [x] Tích hợp API Transaction List — `GET fin/wallet/transactions`, đã lọc đúng `wallet_id`
- [x] Kiểm thử ví cá nhân — **đã chạy Playwright 2026-07-09**, verify được cả phần rỗng (role
      Teacher, 403) lẫn phần **có dữ liệu thật** (bằng `super` + vá XHR). Kết quả bên dưới.

### Kết quả kiểm thử Playwright (2026-07-09, `localhost:3001/wallet`, role Teacher)

✅ **Không trắng trang**, layout render đủ 6 khối ở cả desktop (1440px) và mobile (390px).
✅ Sidebar sáng đúng "Ví cá nhân"; header hiện "Cô Hà / Teacher".
✅ Query gửi đúng: `GET /v1/fin/wallet/list?owner_id=5&owner_type=teacher&page=1&per_page=20`
   → **fix mục 4a hoạt động thật** (`owner_id` lấy từ `profile.data.id`).
✅ Số dư mặc định ẩn (`••••••••`) như yêu cầu.
✅ Xác nhận mục 4c: card "Tài khoản ngân hàng liên kết" hiện **"Chưa liên kết tài khoản ngân hàng"**
   — cả `wallet.bank_accounts` lẫn `profile.bank_account` đều không tồn tại.
✅ Console **không có exception nào của màn Ví** (chỉ warning `forwardRef`/`Invalid DOM property` từ
   tera-dls, và 404 `edu/dashboard/summary` của màn Dashboard — không liên quan).

🐞 **403 bị nuốt im lặng — lỗi FE, sửa được.** `_requestError` (`_interceptor.ts:82`) chỉ gắn
   `error.message` rồi `throw`, **không hiện notification**. Màn Ví thì `BalanceCard` không nhận
   `isError`, còn `TransactionTable` bị `enabled: !!wallet.id` chặn nên không vào nhánh `ErrorRetry`.
   → Giáo viên thấy **ví rỗng, số dư 0đ**, không hề biết mình bị từ chối quyền. Cần hiện lỗi rõ ràng.

🐞 **Một request `fin/wallet/list` trả HTTP 404 kèm trang HTML "Not Found" của Laravel** (3 request
   còn lại trả 200 + body `code:403`). Cùng URL, cùng phiên. **Lỗi BE, không ổn định** — báo BE.

⚠️ `GET /api/auth/profile` bị gọi **3 lần** trong một lần vào trang.

⚠️ Vào thẳng `/wallet` bằng URL (full reload) **có lúc bị đá về `/auth/login`**. Nguyên nhân đã rõ:
   `AuthStore` trong localStorage có **`token: ""`** — token chỉ giữ trong memory, reload là mất.
   (Không phải bug của [050].)

### ✅ Verify phần CÓ DỮ LIỆU (login `super` + vá XHR `owner_id=1` → `5`, không sửa code)

Vì role Teacher bị 403, mình đăng nhập `super@terasolutions.vn` rồi patch `XMLHttpRequest.open` ngay
trong trình duyệt để trỏ vào ví của Cô Hà (`WAL000003`). **Toàn bộ tầng map dữ liệu chạy đúng:**

| Kiểm | Kết quả |
| --- | --- |
| `wallet_id` suy từ ví | `transactions?wallet_id=3` ✅ (cả 2 query summary + table) |
| `toWalletInfo` đọc `available_balance` | Số dư **2,550,000đ** = 450,000 + 2,000,000 + 100,000 ✅ |
| `toSummaryStats` sau khi bỏ lọc `status` | Tổng nạp **2,100,000đ**, Giao dịch thành công **2** ✅ |
| `toChartPoints` | Biểu đồ vẽ đúng cột ngày 09/07 ✅ |
| `toTransaction` (`transaction_code`/`description`) | `WTX000005`, `WTX000006` + nội dung ✅ |
| Badge `transaction_type` = `deposit` | Hiện "Nạp tiền" (xanh) ✅ |
| Cột Trạng thái mặc định `completed` | Hiện "Thành công" ✅ |
| Phân trang | "Hiển thị 1 - 2 trong tổng số 2 giao dịch" ✅ |
| Nút ẩn/hiện số dư | Mặc định `••••••••`, bấm hiện đúng ✅ |
| Tile "Tổng rút tiền" / "Giao dịch thất bại" | Đều **0** — đúng như dự đoán (ví không rút, sổ cái không có giao dịch thất bại) |

⚠️ **Chưa test**: bộ lọc "Loại giao dịch" (dropdown không mở được qua Playwright — `CompactSelect`
render bằng portal). Đây là chỗ đã sửa enum `topup`→`deposit`, **nên test tay 1 lần**.

📝 Ví `WAL000003` hiện có 2 giao dịch `deposit` với `description` = "Nạp tiền qua Ví MoMo" /
"Nạp tiền qua Thẻ quốc tế" — **đúng định dạng `buildDepositNote()`** của trang Nạp tiền đã revert.

**Làm thêm ngoài spec:** `DepositMethods`, `TransactionChart`, `LinkedBankAccounts`.

**Trạng thái nối API:** `fin/wallet/list?owner_type=teacher` → ví `WAL000003` (`id: 3`, số dư
450.000đ) · `fin/wallet/transactions?wallet_id=3` → bảng + biểu đồ + 4 tile tổng quan.

### 🐞 THIẾU: empty state "chưa có ví" (việc của FE)

`toWalletInfo()` (`pages/Wallet/_utils.ts`) trả `{ id: null, balance: 0 }` khi `items` rỗng, và **cả
3 trang** (`Wallet`, `Deposit`, `Withdraw`) truyền thẳng `wallet.balance` vào thẻ số dư. Nên giáo viên
**chưa có ví** sẽ thấy màn hình **số dư 0đ trông y hệt bình thường** — không phân biệt được với người
có ví mà số dư đúng bằng 0. Bảng giao dịch cũng im lặng vì bị `enabled: !!wallet.id` chặn.

Cùng lớp lỗi với review #1 của Copilot: **hiển thị một con số tiền trong khi thực ra không biết gì cả.**
Khác ở chỗ lần này không lộ ví người khác, mà **giấu mất sự thật là chưa có ví**.

- Cần: khi `wallet.id === null` và query đã xong (không loading, không error) → hiện empty state
  "Chưa có ví" thay vì `0đ`.
- ⚠️ **Chờ BE trả lời câu 9b trước** (ví sinh lúc nào): nội dung hướng dẫn trong empty state phụ thuộc
  vào đó — lỗi hệ thống cần báo hỗ trợ (a/c), hay người dùng phải làm gì để kích hoạt (b).

### Chưa xong / cần xử lý

1. **🚫 Không có API Wallet Summary** (xác nhận: folder `Finance/Wallet` có đúng 11 route, không route
   nào là summary/statistics/overview; `detail/:id` có kèm 20 giao dịch gần nhất nhưng không có khối
   thống kê). `toSummaryStats()` (`_utils.ts`) tự cộng phía client từ danh sách giao dịch tải về.
   Vì `per_page` **chỉ nhận 20|50|100**, `SUMMARY_FETCH_SIZE` đã hạ 500 → 100 → **số liệu tổng quan +
   biểu đồ chỉ đúng trên 100 giao dịch gần nhất**, không phải toàn bộ lịch sử. Cần BE làm endpoint.

2. ~~**🐞 4 tile "Tổng quan ví" luôn bằng 0.**~~ ✅ **Đã sửa 2026-07-09.** `toSummaryStats` +
   `toChartPoints` từng lọc `SUCCESS_STATUSES = ["success","completed"]`, nhưng giao dịch ví
   **không có field `status`** (sổ cái bất biến; `active/locked/closed` là trạng thái của *ví*).
   `t.status` luôn `undefined` → mọi `.filter()` trả rỗng → 4 tile + biểu đồ đều 0. Đã bỏ tầng lọc
   status; `toTransaction` mặc định gán `completed`. Tile **"Giao dịch thất bại" vẫn luôn 0** —
   không có nguồn dữ liệu, chờ product chốt bỏ tile hay đổi nhãn.

3. ~~**🐞 Bộ lọc "Loại giao dịch" gửi sai enum.**~~ ✅ **Đã sửa 2026-07-09.** `TYPE_FILTER_OPTIONS`
   từng là `topup | withdraw | receive | refund` (chỉ `refund` trùng, ba cái kia lọc ra rỗng).
   Nay dùng đúng enum backend `deposit | payment | refund | bonus | adjustment | expire`;
   `TYPE_CONFIG` bổ sung `bonus`/`adjustment`/`expire`, giữ alias cũ để phòng thủ.
   `adjustment` không cố định hướng tiền → suy ra từ dấu của `amount`.

4. **🐞 Số dư là của ví người khác.** ✅ **Đã xác minh bằng API thật (2026-07-09) — KHÔNG có auto-scope.**
   `fin/wallet/list` trả về ví của mọi owner (thực tế: 2 ví `owner_type: "parent"`), `transactions`
   không truyền `wallet_id` thì trả giao dịch của **mọi ví**. `items[0]` = ví một phụ huynh.
   - Đã sửa: list lọc `owner_type: "teacher"`; cả 2 query transactions truyền `wallet_id` +
     `enabled: !!wallet.id`.
   - ✅ **`owner_type=teacher` hợp lệ** (verify 2026-07-09: trả 200, không 422). DB **đã có** ví giáo
     viên: `WAL000003`, `id: 3`, `owner_id: 5`, số dư `"450000.00"`. Màn Ví giờ có dữ liệu để test.
   - ⚠️ `owner_type_label` của ví teacher trả `null` (ví parent có `"Phụ huynh"`) — BE chưa map nhãn.
     FE không dùng field này nên vô hại.
   - 🔴 **CHƯA sửa hết** — xem mục 4a ngay dưới.

4a. ✅ **ĐÃ FIX 2026-07-09 — rò rỉ ví giữa các giáo viên.**
   Trước đó `index.tsx` lọc `owner_type: "teacher"` rồi lấy `items[0]`, **không lọc `owner_id`** →
   thêm giáo viên thứ 2 là mọi người cùng thấy ví của giáo viên đầu tiên.
   - **Chốt được nhờ verify**: `wallet.owner_id` là **id bảng `users`** (ví teacher `owner_id: 5`,
     đúng bằng user id 5 = "Cô Hà", `role.title: "Teacher"`). KHÔNG phải id bảng `teachers`.
   - Đã sửa: `currentUserId = profileQuery.data?.data?.id` → truyền `owner_id` vào `useWalletList`,
     và `enabled: !profileQuery.isLoading` để không nháy 1 nhịp bằng ví người khác.
   - ✅ **`GET /api/auth/profile` CÓ trả `data.id`** (verify 2026-07-09 bằng tài khoản `super`) →
     nhánh fallback (chỉ lọc `owner_type`) trên thực tế không bao giờ chạy. Endpoint này dùng
     `auth2Endpoint` (`/api/auth/...`), **KHÔNG nằm trong collection Postman `Modules`**.
   - ⚠️ **Dev bằng tài khoản `super` (id 1, role Administrator) sẽ thấy màn Ví TRỐNG** — không có ví
     nào `owner_type=teacher & owner_id=1`. Đây là hành vi ĐÚNG. Muốn thấy dữ liệu phải đăng nhập
     bằng `giaovien` (user id 5, chủ ví `WAL000003`).
   - ⚠️ DB có **3 user role Teacher** (id 5 "Cô Hà", id 6 "Thầy Minh", id 3 "Cô Hạ") nhưng mới 1 ví
     teacher → bug cũ chưa kịp lộ. Tạo thêm ví là lộ ngay.
   - 🚫 Vẫn nên đề nghị BE **tự scope theo token**: ví là dữ liệu tiền, để FE nhớ truyền filter đúng
     ở mọi màn là chuyện sớm muộn cũng quên.

4b. **🐞 Tên field response đều sai — đã sửa 2026-07-09.** `toWalletInfo` đọc `balance`/`current_balance`,
   nhưng field thật là **`available_balance`** (chuỗi `"450000.00"`) → `BalanceCard` **đang hiện 0đ**.
   `toTransaction` đọc các alias không tồn tại (`type`, `note`, `content`, `transaction_date`).
   Đã sửa cả hai theo response thật.

4c. **🐞 `LinkedBankAccounts` nhiều khả năng LUÔN RỖNG.** `toLinkedBankAccounts()` thử 2 nguồn, **cả
   hai đều không tồn tại** (verify 2026-07-09):
   - `wallet.bank_accounts` → ví chỉ có `available_balance/bonus_balance/frozen_balance/currency/...`,
     **không có** field này.
   - `profile.teacher.bank_account` ?? `profile.bank_account` → response `/api/auth/profile` (tài khoản
     `super`) **không có object `teacher`, cũng không có `bank_account`**; chỉ có các field user phẳng.
   - ⚠️ **Chưa loại trừ**: profile của tài khoản **giáo viên thật** có thể kèm object `teacher`. Phải
     đăng nhập bằng `giaovien` rồi xem lại response mới kết luận được.
   - Nếu đúng là rỗng → hoặc bỏ card "Tài khoản liên kết", hoặc lấy `bank_account` từ
     `hr/teacher/detail/:id` (entity teacher CÓ nested `bank_account` — xem CLAUDE.md mục 10).

5. ~~**⚠️ Nút "Xuất" gọi route không tồn tại.**~~ ✅ **Đã xử lý 2026-07-09.** `WalletAPI`/`WalletService`
   đã cắt về đúng 11 route Postman (bỏ `create`/`update`/`delete`/`export`). Nút Xuất **vẫn còn**
   nhưng chỉ hiện toast "Tính năng đang được phát triển", không bắn request 404 nữa —
   **vẫn cần hỏi backend** có định làm route export không.

6. **🐞 Ô tìm kiếm KHÔNG hoạt động — đã xác minh, cố ý để nguyên.** `fin/wallet/transactions` **bỏ qua**
   param `search` (test Postman 2026-07-09: có/không `search` đều trả cùng số dòng). Route chỉ nhận
   `wallet_id`, `transaction_type`, `reference_type`, `reference_id`, `date_from`, `date_to`,
   `sort_by`, `sort_dir`, `per_page`.
   → **Quyết định (user, 2026-07-09): giữ nguyên ô tìm kiếm như hiện tại**, dù gõ vào không lọc gì.
   Khi cần sửa, 2 hướng: (a) BE bổ sung `search`; (b) FE lọc client-side trên tập giao dịch đã tải
   (`summaryQuery`, trần 100 dòng) + tự phân trang khi đang tìm.

7. **⚠️ Tile "Tổng rút tiền" và "Giao dịch thất bại" mô tả thứ backend không có.** Ví là số dư trả
   trước để thanh toán hóa đơn, **không rút về ngân hàng**. "Tổng rút tiền" thực chất là tổng
   `payment` (chi tiêu); "Giao dịch thất bại" luôn 0. Cần chốt lại nhãn với product.

8. ~~**⚠️ `PAGE_SIZE_OPTIONS` có giá trị `10`.**~~ ✅ **Đã sửa 2026-07-09** —
   `_common/constants/pagination.ts` nay là `[20, 50, 100]`, khớp ràng buộc `per_page` của backend.
   ⚠️ Constant dùng chung **mọi list của web teacher** → các màn khác cũng không còn tùy chọn 10 dòng.

9. ~~**⚠️ Tên field response chưa verify.**~~ ✅ **Đã verify bằng response thật 2026-07-09.**
   Vẫn chưa verify: `fin/wallet/transactions` có nhận param
   **`search`** không (cần gọi thử với/không có param rồi so số dòng).

---

## [051] - Teacher - Nạp tiền

Thiết kế: `picture's page/nap tien.png`

> **Phạm vi**: phần FE/component là của mình; **tích hợp API do người khác làm**. Cột "Ai làm"
> tách rõ để khỏi chờ nhau.

| Hạng mục | Trạng thái | Ai làm | Bằng chứng |
| --- | --- | --- | --- |
| Xây dựng UI nạp tiền | ✅ | mình | `pages/Deposit/index.tsx`, route `/wallet/deposit` (`routers/index.tsx:117`), lối vào từ `BalanceCard` + `DepositMethods` |
| `DepositForm` component | ✅ | mình | tách 2 phần: `AmountSelector.tsx` (chọn/nhập tiền) + `DepositSummary.tsx` (tổng kết + nút submit) |
| `PaymentMethod` component | ✅ | mình | `PaymentMethodPicker.tsx` — 5 hình thức, chọn 1, có "Khuyến nghị" |
| `DepositHistory` component | ✅ | mình | `DepositHistory.tsx` — bảng + phân trang + lọc ngày + lọc trạng thái |
| Validation dữ liệu nạp tiền | ✅ | mình | `_utils.validateAmount` (10.000đ–50.000.000đ) + `parseAmountInput` (chỉ chữ số); verify Playwright 4 ca |
| Tích hợp API Deposit | 🟡 wire sẵn, **tắt bằng cờ** | **người khác** | `index.tsx:78` `useWalletDeposit()` + `mutate` ở `:84`; nút disable bởi `DEPOSIT_ENABLED = false` |
| Tích hợp API Payment Gateway | 🚫 không làm được | **người khác / BE** | collection `Modules` không có route tạo phiên thanh toán |
| Kiểm thử nạp tiền | ✅ | mình | Playwright 2026-07-10, kết quả bên dưới |

**Kết luận phần của mình: XONG cả 6/6 hạng mục FE.** Hai hạng mục còn lại (`Deposit` API, Payment
Gateway) phụ thuộc người tích hợp API + backend mở quyền.

**Bàn giao cho người làm API — chỉ cần 1 thay đổi:** đổi `DEPOSIT_ENABLED` thành `true` trong
`pages/Deposit/constants.tsx`. Mutation, payload (`wallet_id`, `amount`, `payment_method`, `note`),
confirm modal, toast thành công/thất bại đã wire đủ; không phải viết lại gì.

### 🚩 Trạng thái: dựng xong sau feature flag (2026-07-10)

Toàn bộ UI + mutation đã sẵn sàng, nhưng `DEPOSIT_ENABLED = false` trong
`webs/teacher/src/pages/Deposit/constants.tsx` → nút "Nạp tiền ngay" **disable** + nhãn
**"Chờ tích hợp cổng thanh toán"**. **Khi BE mở quyền `fin/wallet/deposit` cho role Teacher (hoặc
dựng gateway), đổi hằng số đó thành `true` là chạy** — không phải viết lại gì.

Lý do vẫn tắt: token giáo viên gọi `POST fin/wallet/deposit` trả `code: 403` (verify lại 2026-07-10).
Và kể cả khi mở quyền, `deposit` **ghi thẳng bút toán vào sổ cái** — bật khi chưa có bước trả tiền
thật đồng nghĩa cho giáo viên tự cộng tiền cho mình.

**Kết quả kiểm thử Playwright (2026-07-10, `localhost:3001/wallet/deposit`)**

- ✅ Lối vào chạy: nút "Nạp tiền" ở `BalanceCard` + 4 card `DepositMethods` → điều hướng kèm
  `location.state.method`, trang Nạp tiền **chọn sẵn đúng hình thức** (bấm "Ví điện tử" → "Ví MoMo").
- ✅ Sidebar vẫn sáng "Ví cá nhân" (menu dò segment `wallet` trong pathname) — đúng như dự đoán.
- ✅ Nút submit **disable** dù form hợp lệ; nhãn "Chờ tích hợp cổng thanh toán" hiện.
  Suốt phiên test **không có request `POST deposit` nào** được bắn.
- ✅ Validation: `5.000` → "Số tiền tối thiểu là 10,000đ"; `60.000.000` → "Số tiền tối đa là
  50,000,000đ"; `abc123def` → ô chỉ giữ `123`.
- ✅ Số ngoài hạn mức **không** hiện ở "Số tiền nhận được" (hiện `—`), tránh khẳng định một con số
  tiền không hợp lệ.
- ✅ "Số tiền nhận được" = đúng số tiền nạp, **không cộng % ưu đãi** (card ưu đãi xám + "Sắp có").
- ✅ Responsive: không tràn ngang ở 320 / 390 / 768 / 1024 / 1280px.
- ✅ Typecheck: 45 lỗi baseline, không lỗi mới.

**Tái dùng / cấu trúc:** `useTeacherWallet()` (mới, `pages/Wallet/useTeacherWallet.ts`) dùng chung cho
cả màn Ví lẫn màn Nạp tiền — nhân bản logic `owner_type` + `owner_id` ra 2 chỗ là đường ngắn nhất tới
việc một giáo viên nạp tiền vào ví giáo viên khác. Dùng lại `Card`, `IconBox`, `Table`,
`TablePagination`, `Badge`, `BalanceCard` (thêm prop `showActions`/`onDeposit`).

**✅ Verify thêm (2026-07-10):** `fin/wallet/transactions` **CÓ** tôn trọng `date_from`/`date_to`
(khoảng quá khứ → 0 giao dịch) và `transaction_type` (deposit → 2, payment → 1). Khác với `search`
vốn bị bỏ qua → bộ lọc ngày ở `DepositHistory` là thật.

**Bộ lọc "Tất cả trạng thái" — lọc CLIENT, có chủ đích.** Verify 2026-07-10: backend **bỏ qua** param
`status` (`status=failed` vẫn trả đủ 3 giao dịch, `status=rac_xyz` cũng vậy) và giao dịch **không có
field `status`** (13 field thật, không có cái nào là status). `"Thành công"` là hằng số FE gán
(`DEFAULT_TRANSACTION_STATUS`). Nên dropdown lọc trên trạng thái đã gán: chọn "Thành công" → hiện đủ +
tổng đúng; chọn "Đang xử lý"/"Thất bại" → rỗng, tổng 0 (đúng: không tồn tại giao dịch nào như vậy).
Không request nào mang param `status` được bắn. Vì trạng thái là hằng số nên lọc trên trang hiện tại
**không làm sai tổng số** của phân trang server. Khi BE có trạng thái giao dịch thật → chuyển sang
gửi param lên server.

**🐞 Rác test trong DB (2026-07-10):** giao dịch `WTX000005` — `deposit` 1.000đ, mô tả `"probe"`,
vào ví `WAL000001` (phụ huynh, 450.000đ → 451.000đ) — là **do mình lỡ tạo khi dò schema**. Sổ cái bất
biến, không xóa được. Báo BE biết khi seed lại. Bài học đã ghi vào memory: **không gọi route ghi tiền
để dò schema** — backend **không validate `payment_method`** (nhận cả chuỗi rác vẫn ghi thành công).

### Quyết định đã chốt (2026-07-09) — dùng lại khi làm thật

- **Trang riêng** `/wallet/deposit` (không phải modal): bảng "Lịch sử nạp tiền" quá lớn cho modal.
  Sidebar vẫn sáng ở "Ví cá nhân" vì menu active dò segment `wallet` trong pathname.
- **Lối vào**: nút "Nạp tiền" trên `BalanceCard` + 4 card `DepositMethods` → navigate kèm
  `location.state.method` để chọn sẵn hình thức.
- **Cổng thanh toán giả lập** (hướng B): modal 3 trạng thái `waiting → processing → success`,
  bấm "Tôi đã thanh toán" thì mới gọi `POST deposit`. Nếu không ổn → đổi sang hướng C (disable nút).
- **Giữ đủ khối như thiết kế** (hướng C ở câu hỏi khối thiếu dữ liệu): phí "Miễn phí", cột "Trạng thái",
  card "Ưu đãi" **xám + nhãn "Sắp có"**.
- Hạn mức **10,000đ – 50,000,000đ** (lấy từ thiết kế; backend chỉ ràng buộc `amount > 0` — BR003).

### Chưa xong / cần xử lý

1. 🚫 **GIÁO VIÊN KHÔNG GỌI ĐƯỢC `fin/wallet/deposit`** — verify 2026-07-09 bằng token tài khoản
   giáo viên: bị chặn quyền. (Test bằng `super` thì vô nghĩa: `is_admin: 1` gọi được mọi thứ.)
   - **Hệ quả: [051] KHÔNG làm được như thiết kế.** Endpoint tồn tại, hook `useWalletDeposit()` có
     sẵn, nhưng người dùng của màn này không có quyền gọi. Hướng B (giả lập cổng thanh toán rồi gọi
     thẳng `deposit`) **đã chết** — nút bấm vào sẽ 403.
   - ✅ Về mặt bảo mật thì đây là tin **tốt**: giáo viên không tự cộng tiền cho mình được.
   - **Chờ product/BE chốt luồng đúng**, 3 khả năng:
     (a) có payment gateway thật → FE redirect sang cổng, BE nhận webhook rồi tự ghi `deposit`;
     (b) giáo viên gửi **yêu cầu nạp**, kế toán duyệt → cần endpoint mới, hiện KHÔNG có;
     (c) nạp tiền là việc của kế toán bên web admin, **portal giáo viên bỏ màn này**.
   - → **Trước mắt làm hướng C**: dựng đủ UI, nút submit disable + nhãn "Chờ tích hợp cổng thanh toán".

2. **🚫 Không có Payment Gateway** trong collection `Modules` — không route nào tạo phiên thanh toán
   VNPay/MoMo. `deposit` chỉ **ghi thẳng bút toán vào sổ cái** (ví dụ `payment_method` của BE là
   `"cash"`), tức nó được thiết kế cho **kế toán nhập tay**, không phải cho người dùng cuối tự nạp.

3. **🐞 `payment_method` mất thông tin nhà cung cấp.** Metadata chỉ có `cash|transfer|card|wallet|other`,
   trong khi thiết kế có 5 hình thức: **MoMo + ZaloPay đều thành `wallet`**; **thẻ nội địa + thẻ quốc tế
   đều thành `card`**. Nhìn lịch sử giao dịch sẽ không phân biệt được, dù mockup có cột "Phương thức"
   hiện rõ logo từng nhà cung cấp.
   - **Workaround đã thử**: ghi `note` theo mẫu **cố định** `"Nạp tiền qua <label>"` rồi **đọc ngược từ
     `description`** để chọn logo. ⚠️ Mong manh: đổi định dạng `note` là hỏng; giao dịch do kế toán nhập
     tay từ admin sẽ không khớp → hiện icon chung.
   - **TODO(BE)**: xin field **`payment_provider`** (hoặc mở rộng enum thêm `momo`/`zalopay`). Khi có →
     gửi thẳng key, **bỏ hẳn việc parse `description`**.

4. **⚠️ Card "Ưu đãi nạp tiền" (+2% / +5%) không có API.** `Finance/Promotion` là khuyến mãi khóa học,
   khác nghiệp vụ. Nạp 1,000,000đ vẫn nhận đúng 1,000,000đ → **không được cộng % vào "Số tiền nhận
   được"**. Hiển thị xám + "Sắp có" để không hứa hẹn sai (đây là con số về tiền).

5. **⚠️ "Phí giao dịch"** không có bảng phí ở backend, cũng không bị trừ → hiện "Miễn phí" là **đúng sự
   thật**, không phải mock. Khi BE có phí → đọc từ API thay vì hằng số.

6. **⚠️ Cột "Trạng thái" luôn "Thành công"** — sổ cái bất biến, không có giao dịch treo/thất bại.

7. **🚫 Nút "Tải hóa đơn"** ở mỗi dòng lịch sử: không có endpoint hóa đơn → toast "đang phát triển".

8. **`DepositHistory`** không cần endpoint riêng: lọc `fin/wallet/transactions?transaction_type=deposit`.

---

## [052] - Teacher - Rút tiền

> **Phạm vi**: FE/component là của mình; tích hợp API do người khác làm. Nhưng ⚠️ **[052] khác
> [051]**: [051] chỉ thiếu **quyền** (route có sẵn, BE mở quyền là chạy), còn [052] thiếu hẳn
> **nghiệp vụ** — không route, `transaction_type` không có `withdraw`. Bật cờ lên cũng không có gì
> để gọi. Cần product chốt trước khi ai đó tích hợp API.

| Hạng mục | Trạng thái | Ai làm | Bằng chứng |
| --- | --- | --- | --- |
| Xây dựng UI rút tiền | ✅ | mình | `pages/Withdraw/index.tsx`, route `/wallet/withdraw` (`routers/index.tsx:119`), lối vào từ nút "Rút tiền" của `BalanceCard` ở cả màn Ví lẫn trang Nạp tiền |
| `WithdrawForm` component | ✅ | mình | `WithdrawForm.tsx` — số tiền + nút "Tất cả" + phí + số nhận được + nội dung + nút xác nhận |
| `WithdrawHistory` component | ✅ | mình | `WithdrawHistory.tsx` — 8 cột + phân trang + lọc trạng thái + lọc ngày |
| `WithdrawStatus` component | ✅ | mình | `WithdrawStatus.tsx` — badge 4 trạng thái (`pending/completed/rejected/cancelled`) |
| Validation dữ liệu rút tiền | ✅ | mình | `_utils.validateAmount` — 3 ràng buộc: min 50.000đ, max 50.000.000đ, **không vượt số dư**; ô nhập chỉ nhận chữ số. Verify Playwright 4 ca |
| Tích hợp API Withdraw | 🚫 không làm được | **BE / product** | không có route `fin/wallet/withdraw` |
| Tích hợp API Withdraw History | 🚫 không làm được | **BE / product** | không có route; `transaction_type` không có `withdraw` |
| Kiểm thử rút tiền | ✅ | mình | Playwright 2026-07-10 (xem dưới) |

**Kết luận phần của mình: XONG 6/6 hạng mục FE.** `WITHDRAW_ENABLED = false` trong
`pages/Withdraw/constants.ts` → nút "Rút tiền" disable + nhãn "Chờ backend hỗ trợ rút tiền".

**Component làm thêm ngoài spec** (theo thiết kế `picture's page/rut tien.png`): `WithdrawBalance`
(số dư + 2 tile thống kê), `WithdrawNotice` (card lưu ý, nền xanh nhạt), `BankAccountPicker`
(chọn tài khoản nhận tiền).

**Cố ý KHÔNG bịa dữ liệu tiền** (user chốt 2026-07-10): bảng lịch sử rỗng, 2 tile thống kê `0đ /
0 giao dịch`, khối tài khoản ngân hàng hiện "Chưa liên kết". Không dùng mock. Khi BE có endpoint
thì chỉ cần đổ dữ liệu vào — props của các component đã sẵn.

**Kết quả kiểm thử Playwright (2026-07-10, `localhost:3001/wallet/withdraw`)**

- ✅ Nút "Rút tiền" ở `BalanceCard` điều hướng sang `/wallet/withdraw` (trước đó chỉ hiện toast).
- ✅ Validation 4 ca: `10.000` → "Số tiền tối thiểu là 50,000đ"; `99.000.000` → "Số tiền tối đa là
  50,000,000đ"; `100.000` với số dư 0 → **"Số tiền rút vượt quá số dư khả dụng"**; `abc12x` → ô chỉ
  giữ `12`.
- ✅ Nút "Rút tiền" disable; nút "Tất cả" tự disable khi số dư = 0; nhãn "Chờ backend hỗ trợ rút tiền".
- ✅ Không tràn ngang ở 390 / 768 / 1280px; dropdown trạng thái + ô ngày cùng một hàng, chữ ngày
  không bị cắt (picker 200px ở mobile, 260px ở desktop).
- ✅ Không có request rút tiền nào được bắn (`grep Service.` trong `pages/Withdraw/` → rỗng).
- ✅ Typecheck: 45 lỗi baseline, không lỗi mới.

### Chưa xong / cần xử lý

- **🚫 Toàn bộ task bị chặn về mặt khái niệm.** `transaction_type` **không có `withdraw`**, và không
  có route `fin/wallet/withdraw`. Mô tả module trong Postman: *"Internal customer balances... Every
  balance change is an immutable transaction"* — đây là **số dư trả trước nội bộ để thanh toán hóa
  đơn**, không phải ví rút tiền về ngân hàng.
- `WithdrawStatus` (chờ duyệt / đã duyệt / từ chối) cũng không map được: giao dịch không có
  `status`, không có luồng phê duyệt.
- **Cần quyết định sản phẩm trước khi code**: (a) backend bổ sung module rút tiền + luồng duyệt,
  hoặc (b) bỏ task này khỏi Sprint 4.

---

## [053] - Teacher - Bảng công

Code: `webs/teacher/src/pages/Timesheet/` · Route `/timesheet` · Menu "Bảng công" (icon
`ClipboardDocumentCheckOutlined`). ⚠️ **Sau khi merge master (2026-07-12)** menu item nằm trong
`MORE_MENU_ITEMS` (menu "Khác"), ngay sau "Báo cáo" — KHÔNG còn ở sidebar chính. Wiring (PATHS +
menu item + import + route) từng bị **gỡ tạm để merge master rồi thêm lại** — nếu mất thì khôi phục 4
mẩu trong `menus.tsx` + `routers/index.tsx`.
Full khung theo thiết kế `picture's page/bang cong.png`, đọc `edu/timetable/calendar` (scope sẵn theo
GV đăng nhập). Giờ giảng hiển thị **đồng hồ `H.Mh`** (2.5h = 2 giờ 5 phút). Verify Playwright + backend
thật (`192.168.1.190:8086`) 2026-07-11; tinh chỉnh UI 2026-07-12 (xem mục dưới).

- [x] Xây dựng UI bảng công — full khung: 6 tile · filter (ngày/lớp/trạng thái/hình thức/search/Xuất Excel) · bảng · lịch tháng · donut · giờ/tuần · hiệu suất · hoạt động
- [x] Xây dựng `TimesheetTable` component — `TimesheetStats.tsx` (6 tile) + `TeachingSessionTable.tsx`
- [x] Xây dựng `MonthlySummary` component — `MonthlySummary.tsx` (donut xếp DỌC: biểu đồ trên, legend + số liệu dưới; tiêu đề "Tổng hợp tháng MM/YYYY")
- [x] Xây dựng `TeachingSessionTable` component — bảng 10 cột + Xem (`ScheduleDetailDrawer`) + phân trang client
- [~] Tích hợp API Timesheet — 🚫 **không có endpoint Timesheet/Payroll**; thống kê (số buổi/giờ) tính client từ timetable. Các khối chờ backend để **"Sắp có"** (không mock)
- [x] Tích hợp API Teaching Session — `TimetableService.useTimetableCalendar`, dữ liệu thật, lọc client (lớp/trạng thái/tìm kiếm) + lịch tháng điều khiển khoảng ngày
- [x] Kiểm thử bảng công — Playwright 2026-07-11 (desktop + mobile 390px), typecheck 45 baseline + node-check logic giờ 12/12

### Đã có dữ liệu THẬT

- 5 tile (Tổng buổi/Hoàn thành/Sắp diễn ra/Hủy/Tổng giờ giảng), bảng buổi dạy, **Lịch dạy tháng**
  (tô ngày có buổi + hôm nay, ‹ ›/"Hôm nay" đổi tháng cho cả trang), **Tổng hợp** (donut), **Giờ giảng
  theo tuần** (line), **Tỷ lệ hoàn thành** (trong Hiệu suất).

### Khối "Sắp có" — chờ backend (cố ý KHÔNG mock)

Verify payload thật `edu/timetable/calendar` (2026-07-11): mỗi buổi chỉ có
`id/session_no/name/session_date/start_time/end_time/status/class{id,code,name}/teacher/room/timetable`.
**KHÔNG có** `student_count`, `learning_type`, `note`, `course/level`, thu nhập → các khối dưới để "Sắp có":

- Tile **Thu nhập ước tính** (cần `hourly_rate`), cột **Hình thức**/**Ghi chú**/**Học viên** (hiện "—")
- Card **Tổng giờ giảng theo hình thức** (cần `learning_type`)
- **Hiệu suất**: Tỷ lệ HV tham gia (cần điểm danh) + Đánh giá TB (cần đánh giá)
- **Hoạt động gần đây** (không có endpoint activity log)
- Nút **Xuất Excel** + select **Tất cả hình thức** (disabled/toast — không có endpoint export/hình thức)
- → Khi BE bổ sung field/endpoint tương ứng thì nối thẳng (props/cột đã sẵn).

### Tinh chỉnh UI (2026-07-12) — đã làm, verify Playwright

- [x] **Mobile bỏ `DateRangeFilter`** — bọc `hidden xmd:contents` (desktop giữ nguyên); khoảng ngày ở mobile do **lịch tháng** điều khiển (tránh popup RangePicker tràn mép — bug §2 handoff-07-11 nay không còn liên quan).
- [x] **`MonthCalendarCard`**: ngày có buổi hiển thị **gạch màu theo trạng thái** phía trên số (xanh=hoàn thành/cam=sắp diễn ra/đỏ=hủy, dùng `statusGroup`), KHÔNG tô nền cả ô; legend 3 màu + "Hôm nay". Fix **vòng tròn hôm nay bị oval** khi card thu hẹp → `aspect-square w-full max-w-9` (luôn tròn).
- [x] **Layout desktop**: 3 card phải (Lịch dạy/Tổng hợp/Tổng giờ giảng theo hình thức) thu còn 278px dồn sát phải; bảng buổi dạy tràn lấp khoảng trống (grid `[minmax(0,1fr)_278px]`); hàng dưới thẳng cột (`[1.2fr_0.8fr_278px]` — "Hiệu suất" hẹp 1/5 để "Giờ giảng theo tuần" rộng ra; "Hoạt động gần đây" thẳng cột 278px).
- [x] **`WeeklyHoursChart`**: bật `datalabels` (giá trị `H.Mh` trên mỗi điểm); nhãn trục X **2 dòng** "Tuần N" + khoảng ngày có ngoặc "(01 - 05/07)" (clamp trong range); trục Y **tự co, bước 5h** (`grace 25%`); bỏ vùng tô (`fill:false`); `x.offset:true` để điểm/nhãn Tuần 1 không dính trục Y. ⚠️ Thêm **plugin** cho chart → HMR chỉ `update()` không tạo lại chart, phải remount (điều hướng đi/về) mới thấy.
- [x] **`MonthlySummary`**: donut để **trơn** (không hiệu ứng hover/dim — đã thử offset/pop/dim-others rồi user chốt bỏ); tooltip mặc định Chart.js vẫn hiện số buổi khi hover.

---

## [054] - Teacher - Bảng lương

> ✅ **UI XONG (UI-only, CHƯA wire API) — 2026-07-16.** Dựng theo design `picture's page/bang luong.png`.
> Module `webs/teacher/src/pages/Payroll/`. Route `/payroll`, menu "Bảng lương" ở **MORE_MENU_ITEMS**
> (menu "Khác", sau "Bảng công"). Verify Playwright desktop + mobile 390px; typecheck teacher **45 baseline, 0 lỗi mới**.

- [x] Xây dựng UI bảng lương — full trang: 6 tile (Tổng thu nhập → Thực nhận) + filter (DateRange/loại/trạng thái/search/Xuất Excel) + bảng 13 cột + biểu đồ đường 6 tháng + lịch thanh toán + sidebar
- [x] Xây dựng `PayrollTable` component — bảng theo kỳ, phân trang client (10/trang, 20 bản ghi mock), bấm dòng/👁 → `/payroll/:id`
- [x] Xây dựng `PayrollSummary` component — 6 tile thu nhập tháng
- [x] Xây dựng `SalaryOverview` component — sidebar: tổng quan thu nhập + donut cơ cấu (53.1/24.8/10.6/6.2% khớp design) + hoạt động gần đây
- [~] Tích hợp API Payroll List — ⏭️ **bỏ (UI-only)**; data = `_mock.ts` (`PAYROLL_PERIODS`). Nút Xuất Excel/Tải = `notification.warning` demo
- [~] Tích hợp API Payroll Summary — ⏭️ **bỏ (UI-only)**; `CURRENT_STATS`/`INCOME_TREND`/`PAYMENT_SCHEDULE`/`RECENT_ACTIVITIES` trong mock
- [x] Kiểm thử bảng lương — Playwright 2026-07-16 (desktop + mobile 390px, list + chi tiết + điều hướng)

### Ghi chú
- **🚫 Vẫn không có endpoint Payroll** (xem [053]) → khi backend có module lương thì thay `_mock.ts` bằng service hook, giữ shape `_interface.ts`.
- Component thêm ngoài spec (theo design): `IncomeChart` (line 6 tháng), `PaymentSchedule`, `PayrollStatusBadge`.
- **Bộ lọc nâng cao mobile (2026-07-16)**: mobile ẩn 2 select (loại thu nhập/trạng thái) → nút "Lọc" (badge số bộ lọc bật) mở modal chip. Dùng **`ChipGroup` của dof** (`@tera/components/dof/ChipGroup`, KHÔNG dùng i18n) cho nội dung; nút + modal shell dựng **local hardcode tiếng Việt** vì `FilterButton`/`FilterModalShell` của dof dùng `t()` mà **web teacher KHÔNG có i18n** (không init, không dep i18next — mọi text teacher hardcode VN). Draft state trong `PayrollTable`, Áp dụng mới commit. Desktop giữ 2 `CompactSelect` inline (ẩn nút Lọc qua `hidden xmd:contents` / `xmd:hidden`). ⚠️ Web teacher thêm bộ lọc mobile sau này → theo pattern này (ChipGroup dof + shell local VN), ĐỪNG import FilterButton/FilterModalShell dof (sẽ ra raw key).
- ⚠️ Range mặc định = phủ toàn bộ data mock (01/01/2023–31/12/2025) để bảng hiện đủ 20 kỳ (design vẽ range tháng 5 nhưng vẫn liệt kê 20 dòng — mâu thuẫn, ưu tiên filter chạy thật).

---

## [055] - Teacher - Chi tiết bảng lương

> ✅ **UI XONG (UI-only, CHƯA wire API) — 2026-07-16.** Dựng theo design `picture's page/chi tiet bang luong.png`.
> Route `/payroll/:id` (`PayrollDetailPage.tsx`). Vào từ nút 👁/dòng bảng ở màn list.

- [x] Xây dựng UI chi tiết bảng lương — hồ sơ GV + thông tin kỳ + card "Thực nhận" (kèm **số tiền bằng chữ** tự sinh, `amountToWords`) + 4 mục + sidebar (donut tổng quan + timeline lịch sử thanh toán + hỗ trợ). Nút Tải PDF/In = demo
- [x] Xây dựng `SalaryBreakdown` component — mục "1. Thu nhập" (bảng lương + phụ cấp); nhận `salaryItems`+`bonusItems`, render dòng thưởng qua `<BonusInfo>` **trong cùng 1 bảng** → giao diện y hệt bản gộp (1 bảng phẳng, thưởng gom cuối)
- [x] Xây dựng `BonusInfo` component — **ĐÃ TÁCH RIÊNG** (user chốt 2026-07-16: tách vì nhìn vẫn giống hệt bản gộp + đúng task). Trả về fragment các `<tr>` khoản thưởng, nằm chung bảng với `SalaryBreakdown`. Data tách thành `salaryItems`/`bonusItems` ở `_interface`/`_mock`.
- [x] Xây dựng `DeductionInfo` component — mục "2. Khấu trừ" (bảo hiểm + thuế)
- [~] Tích hợp API Payroll Detail — ⏭️ **bỏ (UI-only)**; data suy từ `_mock.ts` theo id kỳ (`getPayrollDetail`)
- [x] Kiểm thử chi tiết bảng lương — Playwright 2026-07-16 (desktop + mobile 390px); số tiền bằng chữ verify node ("10.600.000 → Mười triệu sáu trăm nghìn đồng")

### Ghi chú
- Component thêm ngoài spec: `ClassIncomeTable` (mục 3 theo lớp học), `PaymentTimeline` (mục lịch sử thanh toán).
- **🚫 Vẫn không có endpoint Payroll Detail** → chờ backend chung với [054].

---

## [056] - Teacher - Gói đăng ký

- [ ] Xây dựng UI gói đăng ký
- [ ] Xây dựng `PackageList` component
- [ ] Xây dựng `PackageDetail` component
- [ ] Xây dựng `BenefitSection` component
- [ ] Tích hợp API Package List
- [ ] Tích hợp API Package Detail
- [ ] Kiểm thử gói đăng ký

### Chưa xong / cần xử lý

- **❓ Chưa xác định được resource backend.** Đã kiểm: `Finance` (7 folder) và `HR` (4 folder)
  **không có** "Package"; gần nhất là `Finance/Promotion` (khuyến mãi, voucher) — khác nghiệp vụ.
  ⚠️ **`Education` có 31 folder con chưa được liệt kê tên** → chưa
  loại trừ được khả năng Package nằm trong đó. Phải dò folder id `ac98f4d2-3600-4b78-8cba-2c6188fef4cb`
  trước khi kết luận.
- **Chưa rõ nghiệp vụ**: "gói đăng ký" là gói dịch vụ giáo viên mua, hay gói khóa học bán cho học
  viên? Task [071] "Quản lý gói" có thể cùng domain → làm chung một lượt.
- → Cần làm rõ yêu cầu + chờ backend.

---

## Đã tự kiểm tra xong — KHÔNG cần hỏi lại

Verify bằng cách gọi API thật (2026-07-09):

- ✅ **Không có auto-scope theo token** — `list` trả ví mọi owner, `transactions` thiếu `wallet_id`
  thì trả giao dịch mọi ví. FE đã tự lọc.
- ✅ **`owner_type=teacher` hợp lệ** (200, không 422). DB đã có ví `WAL000003` (`id: 3`, `owner_id: 5`).
- ✅ **Giao dịch KHÔNG có field `status`** → đã bỏ tầng lọc status, mặc định `completed`.
- ✅ **`search` bị backend bỏ qua** → ô tìm kiếm không lọc gì (giữ nguyên theo yêu cầu user).
- ✅ **Không có endpoint Wallet Summary / export** — folder `Finance/Wallet` đúng 11 route.
- ✅ **Field name thật**: `available_balance` (chuỗi), `transaction_code`, `description`, `created_at`.

## Câu hỏi còn lại cho backend / product

1. ✅ *Đã tự kiểm tra:* `owner_id` = **id bảng `users`**. Câu hỏi còn lại: **BE có tự scope
   `fin/wallet/list` theo token** được không? (an toàn hơn việc FE phải nhớ truyền filter ở mọi màn)
   Và `GET /api/auth/profile` có chắc chắn trả `data.id` không? (FE đang dựa vào field này)
2. `owner_type_label` của ví teacher trả **`null`** — BE map nhãn giúp (ví parent có `"Phụ huynh"`).
3. Có định làm **`fin/wallet/summary`** (thống kê toàn lịch sử) và **`fin/wallet/export`** không?
4. Có định thêm param **`search`** cho `transactions` không? (nếu không, FE sẽ lọc client-side)
5. Ví giáo viên **có `bank_accounts`** không, hay luôn lấy `bank_account` từ hồ sơ giáo viên?
6. **Nạp tiền [051]** — ✅ *đã tự kiểm tra:* giáo viên **bị chặn quyền** trên `fin/wallet/deposit`.
   Câu hỏi còn lại cho product/BE:
   a. 🔴 **Giáo viên nạp tiền bằng cách nào?** Có payment gateway không? Hay cần endpoint "yêu cầu
      nạp → kế toán duyệt"? Hay bỏ hẳn màn này khỏi portal giáo viên?
   b. Xin thêm field **`payment_provider`** (momo/zalopay/...) — `payment_method` hiện không phân biệt
      MoMo với ZaloPay.
   c. Có **API khuyến mãi nạp ví** và **bảng phí giao dịch** không? (thiết kế có, backend không)
7. **Rút tiền [052]**: backend có định làm không, hay bỏ task? (ví trả trước hiện không rút được)
8. **Timesheet / Payroll [053][054][055]**: bao giờ có module HR tương ứng?
9. **Gói đăng ký [056]**: nghiệp vụ là gì, resource nào bên backend?

---

## [056] - Teacher - Gói đăng ký

> ✅ **UI XONG (UI-only, CHƯA wire API, CHƯA commit) — 2026-07-15.** Dựng theo design
> `picture's page/goi dang ky.png`. Module `webs/teacher/src/pages/Subscription/`. Route `/subscription`,
> menu "Gói đăng ký" ở **MORE_MENU_ITEMS** (menu "Khác").

- [x] Xây dựng UI gói đăng ký — full trang: header + breadcrumb + card "Cần hỗ trợ" + banner nâng cấp + 4 thẻ gói + sidebar (gói hiện tại / lịch sử thanh toán / phương thức thanh toán) + footer cam kết bảo mật
- [x] Xây dựng `PackageList` component — lưới 4 thẻ (`PackageCard`): Miễn phí / Cơ bản (Phổ biến nhất, viền xanh) / Nâng cao / Premium; giá + giá năm + CTA (gói hiện tại = "Đang sử dụng" disabled, còn lại "Nâng cấp ngay")
- [x] Xây dựng `PackageDetail` component — thẻ "Gói hiện tại của bạn" (icon + tên + badge Đang sử dụng + ngày bắt đầu + quyền lợi + nút Nâng cấp)
- [x] Xây dựng `BenefitSection` component — danh sách quyền lợi (check xanh + tiêu đề nhóm "Tất cả tính năng của …, và:"), dùng lại ở PackageCard + PackageDetail
- [~] Tích hợp API Package List — ⏭️ **bỏ (UI-only)**; data = `_mock.ts` (`PLANS`). Điểm nối: `index.tsx` import mock
- [~] Tích hợp API Package Detail — ⏭️ **bỏ (UI-only)**; `CURRENT_PLAN`/`PAYMENT_HISTORY`/`PAYMENT_METHOD` trong mock. CTA nâng cấp = `notification.warning` demo
- [x] Kiểm thử gói đăng ký — Playwright 2026-07-15 (desktop + mobile 390px); typecheck teacher **45 baseline, 0 lỗi mới**

### Ghi chú
- Icon 4 gói (plane/crown/briefcase/diamond) = inline SVG (`components/planVisual.tsx`); màu theo gói.
- 4 thẻ: mobile 1 cột, `sm` 2 cột, `2xl` 4 cột (design gốc 4-in-row cần màn rộng); sidebar 340px ở `xl+`.
- ⚠️ Design Google Drive `11cFOVBN...` (mục Description task) chưa xem được — nếu có màn chi tiết tính năng / thanh toán riêng thì bổ sung.

---

## [068] - Teacher - Đơn xin nghỉ

> ✅ **UI XONG (UI-only, CHƯA wire API, CHƯA commit) — 2026-07-15.** Dựng theo design
> `picture's page/don xin nghi.png`. Module `webs/teacher/src/pages/LeaveRequest/`. Route thật khi
> wire: **`v1/edu/leave/*`**, giữ shape ở `_interface.ts`.

- [x] Xây dựng UI đơn xin nghỉ — full trang: 4 thẻ quota + form tạo đơn + lịch (3 view **Tháng·Tuần·Ngày**) + lịch sử rút gọn (4 đơn mới nhất)
- [x] Xây dựng `LeaveRequestTable` component — bảng dùng `Table`/`TablePagination` chung; màn **"Danh sách đơn xin nghỉ"** đầy đủ (`AllRequestsPage.tsx`, route `/leave-request/all`, tab lọc trạng thái + phân trang client). Nút "Xem tất cả" ở trang chính dẫn qua.
- [x] Xây dựng `LeaveRequestForm` component — `CreateLeaveForm.tsx` (loại/thời gian/từ–đến ngày → tự tính tổng số ngày, lý do + counter, đính kèm, Hủy/Gửi). Date picker = **tera-dls `DatePicker`** (KHÔNG native — đúng luật teacher)
- [x] Xây dựng `LeaveRequestStatus` component — badge trạng thái (Chờ duyệt/Đã duyệt/Từ chối), chứa `LEAVE_STATUS_META` (dùng lại ở list/calendar/table)
- [x] Validation dữ liệu đơn xin nghỉ — **field-level** (viền đỏ + text lỗi, tự xóa khi sửa): required loại/từ/đến/lý do + `đến ≥ từ`
- [~] Tích hợp API Leave Request List — ⏭️ **bỏ (UI-only)**; data = `_mock.ts` (8 đơn). Điểm nối: `index.tsx` + `AllRequestsPage` import mock
- [~] Tích hợp API Create Leave Request — ⏭️ **bỏ (UI-only)**. Điểm nối: `CreateLeaveForm.submit` (đang `notification.warning` demo)
- [~] Tích hợp API Leave Request Status — ⏭️ **bỏ (UI-only)**; trạng thái hiển thị từ mock qua `LeaveRequestStatus`
- [x] Kiểm thử đơn xin nghỉ — Playwright 2026-07-15 (desktop + mobile 390px): stat/form/validation/3 view lịch/màn "Xem tất cả" + filter; typecheck teacher **45 baseline, 0 lỗi mới**

### Ghi chú
- Menu "Đơn xin nghỉ" ở **`MORE_MENU_ITEMS`** (menu "Khác", KHÔNG sidebar chính — theo convention Timesheet/Wallet); route `/leave-request`.
- ⚠️ Design Google Drive `1_o-7AK4...` (mục Description task) **chưa xem được** — nếu trong đó có thêm màn (chi tiết đơn / hủy đơn) thì bổ sung sau.
