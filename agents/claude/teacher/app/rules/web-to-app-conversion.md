# Hana Teacher — Web → App Conversion Playbook

Quy trình tái sử dụng khi cần chuyển đổi 1 màn hình / chức năng từ web
(`webs/teacher/src/pages/<Feature>`) sang mobile app (`apps/hana-teacher/src/screens/<Feature>Screen`).

Đọc kèm [`structure.md`](./structure.md) và [`conventions.md`](./conventions.md) trước khi bắt đầu — file này chỉ nói về **cách chuyển đổi**, hai file kia là nguồn sự thật về cấu trúc/convention.

---

## 1. Nguyên tắc chung

- **Logic nghiệp vụ (business logic) lấy từ web, KHÔNG lấy UI/markup.** Web dùng `tera-dls` + Tailwind + `react-router-dom`; mobile dùng `react-native-paper` + `StyleSheet` + `expo-router`. Không có mapping 1-1 về component, phải build lại UI bằng RN primitives.
- **Tầng service/data (`@tera/modules/*`, `@tera/api/*`) dùng chung** giữa web và mobile — đây là workspace package, KHÔNG viết lại. Chỉ import đúng hook (`XxxService.useXxxList`, `useUpsertXxx`, …) như web đang dùng.
- **Luôn ưu tiên soi 1 màn hình mobile "hàng xóm" cùng domain đã có sẵn** (vd: đang làm `LessonPlanCreateScreen` thì soi `LessonPlanScreen`, `LessonScreen`) để bắt đúng convention thực tế đang chạy trong repo — `structure.md`/`conventions.md` là tài liệu tham chiếu, nhưng code thật (`LoginScreen.tsx`, các Screen đã `inprogress` trong [`task.md`](./task.md)) là nguồn đúng khi có mâu thuẫn.

---

## 2. Quy trình từng bước

### Bước 1 — Đọc hiểu logic web nguồn
1. `ls webs/teacher/src/pages/<Feature>` để biết cấu trúc (Wizard nhiều bước? 1 form đơn? danh sách + detail?).
2. Đọc `index.tsx`/`*.tsx` chính, các `_interface.ts`, `_utils.ts`, `constants.ts` — lấy ra:
   - Các field/form values thực sự cần (bỏ qua field chỉ phục vụ UI web).
   - Luồng submit: mutation nào được gọi, theo thứ tự nào, payload map ra sao (`toXxxParams` functions).
   - Các API/service hook dùng (`@tera/modules/education/...`) — đây là danh sách hook sẽ tái sử dụng y hệt ở mobile.
   - Các sub-select/picker phụ thuộc API khác (course, level, class, …) và field nào map sang option nào (`toOption`).

### Bước 2 — Kiểm tra route đã scaffold chưa
1. `ls apps/hana-teacher/src/app/**` tìm file route tương ứng (vd `edu/lesson-plan-create.tsx`). Route thường đã có sẵn dạng:
   ```typescript
   export { default } from '@screens/XxxScreen';
   ```
   nếu chưa có, tạo mới theo đúng convention 1 dòng re-export này.
2. Đăng ký route trong `_layout.tsx` Stack tương ứng (`app/edu/_layout.tsx` hoặc `app/student/_layout.tsx`) — dễ bị quên vì route file có thể đã tồn tại nhưng chưa add vào `<Stack.Screen name="..." />`.
3. Nếu màn hình được mở từ 1 entry point khác (banner, nút "+ Tạo mới", item trong list…) — nhớ nối `onPress`/`onCreate` ở màn hình gọi tới `router.push('/edu/xxx')`, đừng chỉ tạo màn đích rồi bỏ quên điểm vào.

### Bước 3 — Tạo cấu trúc thư mục screen
Theo `conventions.md` §1:
```
ScreenName/
├── index.tsx
├── styles.ts        # hoặc style.ts — theo style file cùng domain đã dùng
├── types.ts          # types cục bộ của screen (form state), KHÔNG phải API response types nếu đã có sẵn ở web _interface.ts tương ứng
├── _utils.ts          # nếu cần port lại các hàm map/transform từ web _utils.ts
└── components/
    ├── SectionA.tsx
    └── SectionB.tsx
```
Ưu tiên copy tên file/tên hàm giống hệt web (`emptyTemplate`, `toTemplateParams`, `joinObjective`, …) để dễ đối chiếu về sau.

### Bước 4 — Map building blocks web → mobile

| Web (`webs/teacher`) | Mobile (`apps/hana-teacher`) |
|---|---|
| `react-router-dom` `useNavigate`/`useParams` | `expo-router` `useRouter`/`useLocalSearchParams` |
| `tera-dls` `Button`, `Input`, `TextArea`, `Select` | `react-native-paper` hoặc `@components/ui` (xem bảng §5) |
| `FormTera` + `FormTeraItem` + `react-hook-form` | `react-hook-form` (`useForm` + `Controller`) — KHÔNG dùng `FormTera`, dùng pattern giống `LoginScreen.tsx` (xem §6) |
| `notification.success/error` (`tera-dls`) | `Toast.show({ type, text1, text2 })` (`react-native-toast-message`) |
| `AsyncSearchSelect` (custom searchable dropdown) | Không có sẵn — build 1 `PickerField` generic dùng `Portal + Modal + Searchbar + FlatList` từ `react-native-paper`, nhận `useList`/`toOption` giống hệt cách `AsyncSearchSelect` nhận prop (xem §7) |
| Upload file trực tiếp (`<input type="file">`, `FileAPI.upload`) | **Chưa có infra** (`expo-image-picker`/`expo-document-picker` chưa cài) — mặc định BỎ QUA, note lại trong PR/summary, không tự ý thêm dependency mới nếu không được yêu cầu |
| `@tera/modules/education/*` hooks | Dùng y nguyên — import qua path `@tera/modules/education/<domain>` hoặc barrel `@tera/modules/education` (cả 2 đều resolve được nhờ tsconfig path alias, dù `package.json` "exports" chỉ khai báo ".") |
| CSS/Tailwind classes | `StyleSheet.create()` trong `styles.ts`, màu hex lấy theo tông đã dùng ở màn hình cùng domain (vd `#007AFF` primary, `#0F172A` text, `#64748B` muted, `#F8FAFC` bg, `#F1F5F9` border) |

### Bước 5 — Build UI
- Header: copy pattern `headerBackground` + `IconButton(chevron-left)` + `Text title` đã dùng ở các screen cùng domain (xem `LessonPlanScreen/index.tsx`, `LessonScreen`).
- Card/section: `View` bo góc 16, border `#F1F5F9`, shadow nhẹ — xem `styles.card` ở screen hàng xóm để copy nguyên style object.
- List/array field (nhiều item có thể add/remove, vd lesson templates, activities): giữ là **local state** (`useState<T[]>`), KHÔNG ép vào react-hook-form `useFieldArray` trừ khi đã có tiền lệ trong app — web cũng xử lý các step dạng này bằng local array state (`CreateWizard.tsx`), không phải react-hook-form.
- Bottom action bar cố định: `position: 'absolute', bottom: 0` + 2 nút Hủy (outlined)/Submit (contained), disable khi `submitting`.

### Bước 6 — Submit flow
- Port lại logic submit tuần tự y hệt web (thường: upsert entity chính → lấy `id` từ response → loop tạo sub-resource). Xem `StepReviewCreate.tsx` (hoặc tương đương) để lấy đúng thứ tự gọi mutation.
- Bọc trong `try/catch/finally`, set `submitting` state, `Toast.show` khi success/error, điều hướng `router.back()` hoặc `router.replace(...)` sau khi thành công — không tự nghĩ ra luồng điều hướng khác nếu web không có gợi ý tương đương.

### Bước 7 — Verify
1. `tsc --noEmit` full project sẽ FAIL ngay ở `tsconfig.json` vì `ignoreDeprecations: "6.0"` không hợp với TS cài đặt (5.9.3) — đây là lỗi **pre-existing**, không phải do thay đổi của bạn. Để kiểm tra riêng file mới:
   ```bash
   node -e "
     const fs = require('fs');
     const cfg = JSON.parse(fs.readFileSync('tsconfig.json','utf8'));
     delete cfg.compilerOptions.ignoreDeprecations;
     fs.writeFileSync('tsconfig.check.json', JSON.stringify(cfg, null, 2));
   "
   npx tsc --noEmit -p tsconfig.check.json 2>&1 | grep -i "<ScreenName>"
   rm tsconfig.check.json
   ```
2. Grep lại chính các file vừa tạo để đảm bảo không còn import `TextInput`/`Button` trực tiếp từ `react-native-paper` ở nơi lẽ ra phải dùng `@components/ui` (xem §5), và không còn state/logic thừa từ bản nháp đầu.
3. Nếu có UI thực sự cần chạy thử (không chỉ đọc code) — dùng skill `/run` hoặc nói rõ trong summary là "chưa test trên thiết bị/simulator".

---

## 3. Reusable prompt (copy-paste để bắt đầu 1 conversion mới)

```
Đọc logic xử lý trong file webs/teacher/src/pages/<Feature>/<SubPath>
(và các file liên quan: _interface.ts, _utils.ts, constants.ts, components/).

Trước khi code, đọc agents/claude/teacher/app/rules/structure.md,
agents/claude/teacher/app/rules/conventions.md và
agents/claude/teacher/app/rules/web-to-app-conversion.md.

Tạo màn hình mobile tương ứng tại apps/hana-teacher/src/screens/<Feature>Screen
(hoặc sửa nếu đã tồn tại), tái sử dụng nguyên các hook trong @tera/modules/education/*
mà bản web đang dùng cho phần logic/data — không viết lại tầng API.

Đăng ký route (apps/hana-teacher/src/app/...) và entry point điều hướng tới
màn hình này nếu chưa có.

Ràng buộc:
- Theo đúng cấu trúc thư mục + convention đặt tên trong conventions.md.
- Form dùng react-hook-form (useForm + Controller + rules inline), theo đúng
  pattern thực tế của LoginScreen.tsx — không dùng FormTera (web-only).
- Input/Button dùng qua @components/ui khi có; Icon/IconButton/Modal/Portal/
  Searchbar dùng thẳng react-native-paper (không có wrapper riêng).
- List động (thêm/xóa nhiều item) giữ local state, không ép vào useFieldArray.
- Không thêm dependency mới (vd expo-image-picker) nếu không được yêu cầu —
  nếu web có upload file mà mobile chưa có infra, bỏ qua phần đó và nói rõ
  trong tóm tắt cuối cùng.
- Verify bằng tsc --noEmit theo hướng dẫn ở §7 của web-to-app-conversion.md
  (repo có lỗi ignoreDeprecations pre-existing, đừng cố sửa nó).
```

---

## 4. Bảng UI component tham chiếu nhanh

| Cần gì | Dùng |
|---|---|
| Text input 1 dòng / multiline | `TextInput` từ `@components/ui` (lưu ý: mặc định `height: 50` — field multiline phải override bằng `style={{ height: N }}`, KHÔNG dùng `minHeight` vì `height` cố định sẽ đè lên) |
| Password input | `InputPassword` từ `@components/ui` |
| Button (submit/action chính) | `Button` từ `@components/ui` (mặc định `mode="contained"`, `textColor` trắng) hoặc `Button` thẳng từ `react-native-paper` nếu cần 1 nút `outlined` phụ cạnh nút chính (xem `LessonPlanScreen`/`LessonScreen` — cả 2 style đều đang tồn tại song song trong app, chọn theo screen hàng xóm cùng domain) |
| Icon | `Icon` từ `react-native-paper` (`source="mdi-icon-name"`) |
| Icon button (header back, xóa item…) | `IconButton` từ `react-native-paper` |
| Dropdown/select đơn giản, list tĩnh nhỏ | `SelectBox` từ `@components/ui` (yêu cầu `items` có sẵn đồng bộ, không phù hợp cho list fetch async) |
| Dropdown async có search (course/level/class…) | Tự build `PickerField` generic: `Portal` + `Modal` + `Searchbar` + `FlatList`, nhận prop `useList`/`toOption` — gọi thẳng hook được truyền vào (an toàn về Rules of Hooks vì hook luôn được gọi ở cùng vị trí mỗi render, y hệt cách `AsyncSearchSelect.tsx` bên web làm) |
| Toast thông báo | `Toast.show({ type: 'success' | 'error', text1, text2? })` từ `react-native-toast-message` |
| Modal picker cần z-index nổi trên toàn màn hình | Bọc trong `<Portal>` (đã có `PaperProvider` ở `app/_layout.tsx`, `Portal` dùng được ở bất kỳ đâu) |

---

## 5. Các lỗi hay gặp (đã tự kiểm chứng khi convert LessonPlan Wizard → LessonPlanCreateScreen)

- **`UpdatePayload.id` typed `string | number`** (không optional) trong `@tera/api/_interface.ts` — nhưng pattern "upsert" (`id: undefined` để tạo mới) vẫn đúng về runtime, chỉ sai type. Cast `as any` cho object payload khi gọi `useUpsertXxx({ id: undefined, params })`, đừng sửa type dùng chung.
- **`@components/ui/TextInput` ép cứng `height: 50`** trong style mặc định — field multiline (textarea) bị bóp nếu chỉ truyền `minHeight`. Phải truyền `height` tường minh để override.
- **`TouchableRipple` (react-native-paper) nhận Fragment `<>...</>` làm children vẫn render đúng** — `style` prop được áp cho `Pressable` bao ngoài (không clone vào children), nên nhiều children trong 1 Fragment layout đúng theo `flexDirection` của style ngoài. Không cần bọc thêm `View` nếu không cần thiết.
- **`@tera/modules/*` deep import** (`@tera/modules/education/lesson-plan`) hoạt động dù `package.json` của `@tera/modules` chỉ khai báo `"exports": { ".": ... }`** — do Metro/tsconfig path alias resolve trực tiếp theo file system, không strict theo `exports` field. Không cần sửa `package.json`.
- **`tsc --noEmit` full project luôn fail** vì `tsconfig.json` có `ignoreDeprecations: "6.0"` không hợp với TypeScript 5.9.3 đang cài — lỗi này có từ trước, không liên quan tới thay đổi của bạn. Dùng tsconfig tạm (xem §2 Bước 7) để verify riêng phần mình vừa sửa.
