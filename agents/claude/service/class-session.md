# ClassSession Service

## Tổng quan

| | |
|---|---|
| **Module** | `@tera/modules/education/class-session` |
| **API file** | `services/api/src/education/class-session/class-session.api.ts` |
| **Base URL** | Lồng theo lớp: `/v1/edu/class-room/:classId/session/` · Phẳng: `/v1/edu/class-session/` |
| **Pattern** | D — Custom (nested list/create/generate + flat detail/update/cancel/delete). KHÔNG có Suspend/Restore/Export |

> ⚠️ **buổi học (class-session) = đơn vị VẬN HÀNH của 1 lớp** — KHÁC **bài học (lesson)** là đơn vị chương trình/giáo án. 1 buổi gắn `class_id`, có lịch/phòng/giáo viên/điểm danh.

---

## API Endpoints

| Method | URL | Mô tả |
|---|---|---|
| GET | `/v1/edu/class-room/:classId/session/list` | Danh sách buổi học của 1 lớp **(lồng — `:classId`)** |
| POST | `/v1/edu/class-room/:classId/session/create` | Thêm 1 buổi học (lẻ/bù) cho lớp **(lồng)** |
| POST | `/v1/edu/class-room/:classId/session/generate` | Sinh buổi học tự động theo lịch tuần **(lồng)** |
| GET | `/v1/edu/class-session/detail/:id` | Chi tiết buổi học (`:id` = id buổi) |
| PUT | `/v1/edu/class-session/update/:id` | Cập nhật buổi học |
| POST | `/v1/edu/class-session/cancel/:id` | Hủy buổi học (body `{ reason }`) |
| DELETE | `/v1/edu/class-session/delete/:id` | Xóa buổi học |

> ⚠️ **ID convention khác nhau**: 3 route đầu (list/create/generate) **LỒNG** → `:classId` (id của lớp). 4 route sau (detail/update/cancel/delete) **PHẲNG** → `:id` (id của buổi).

---

## Response: GET /v1/edu/class-room/:classId/session/list

```json
{
  "success": true,
  "msg": "Thao tác thành công",
  "code": 200,
  "errors": null,
  "data": {
    "items": [
      {
        "id": 93,
        "class_id": 10,
        "schedule_id": null,
        "session_no": 9,
        "code": "CLS010-B09",
        "name": "Buổi 9",
        "session_date": "2026-07-18",
        "start_time": "15:00:00",
        "end_time": "17:00:00",
        "room_id": 4,
        "teacher_id": 2,
        "teacher": { "id": 2, "full_name": "Giáo viên 2", "avatar": null },
        "substitute_teacher_id": 3,
        "substitute_teacher": { "id": 3, "full_name": "Giáo viên 3", "avatar": null },
        "status": "upcoming",
        "attendance_locked": false,
        "revenue_amount": "0.00",
        "note": null,
        "tags": [],
        "created_by": 1,
        "updated_by": 1,
        "deleted_by": null,
        "created_at": "2026-06-27T02:34:38.000000Z",
        "updated_at": "2026-06-27T02:34:38.000000Z",
        "deleted_at": null
      }
    ],
    "pagination": {
      "total": 9,
      "per_page": 20,
      "current_page": 1,
      "last_page": 1
    }
  }
}
```

> Cùng cấu trúc `{ data: { items, pagination } }` như mọi API list — dùng `getListData<ClassSessionResponse>(data)`.

> Field `code` = **`<mã lớp>-B<số buổi 2 chữ số>`** (vd `CLS010-B09`), KHÔNG phải `SESxxx`. `schedule_id` = null cho buổi lẻ (`create`), = id lịch tuần cho buổi sinh tự động (`generate`).

---

## Response: GET /v1/edu/class-session/detail/:id

```json
{
  "success": true,
  "msg": "Thao tác thành công",
  "code": 200,
  "errors": null,
  "data": {
    "id": 1,
    "class_id": 1,
    "schedule_id": null,
    "session_no": 1,
    "code": "SES001",
    "name": "Buổi học 1",
    "session_date": "2026-06-24",
    "start_time": "18:00:00",
    "end_time": "19:30:00",
    "room_id": null,
    "teacher_id": 1,
    "teacher": { "id": 1, "full_name": "Giáo viên 1", "avatar": null },
    "substitute_teacher_id": null,
    "substitute_teacher": null,
    "status": "upcoming",
    "attendance_locked": false,
    "revenue_amount": "0.00",
    "note": null,
    "tags": [],
    "created_by": null,
    "updated_by": null,
    "deleted_by": null,
    "created_at": "2026-06-24T04:28:31.000000Z",
    "updated_at": "2026-06-24T04:28:31.000000Z",
    "deleted_at": null
  }
}
```

> ✅ Detail trả `data` = **object buổi học TRỰC TIẾP** (KHÔNG bọc `data.session`, KHÔNG kèm statistics — khác class-room detail bọc `data.class` + `statistics`). Đọc: `const session = data?.data as ClassSessionResponse`.

---

## TypeScript Interfaces

```typescript
export type ClassSessionStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface ClassSessionResponse {
  id: number;
  class_id?: number;
  schedule_id?: number | null;
  session_no?: number;       // số thứ tự buổi (1, 2, 3...)
  code?: string;             // "CLS010-B09" = <mã lớp>-B<số buổi>
  name?: string;
  session_date?: string;     // "YYYY-MM-DD"
  start_time?: string;       // "HH:mm:ss"
  end_time?: string;         // "HH:mm:ss"
  room_id?: number | null;
  teacher_id?: number | null;
  teacher?: { id: number; full_name: string; avatar?: string | null } | null;
  substitute_teacher_id?: number | null;       // giáo viên dạy thay
  substitute_teacher?: { id: number; full_name: string; avatar?: string | null } | null;
  status?: ClassSessionStatus;
  attendance_locked?: boolean;  // đã chốt điểm danh → FE khóa sửa
  revenue_amount?: string;      // "0.00"
  note?: string | null;
  tags?: { id: number; name: string; color?: string; backgroundColor?: string }[];
  created_by?: number | null;
  updated_by?: number | null;
  deleted_by?: number | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
```

---

## Status

Status đọc từ **metadata `class_session_status`** (`globalStore.getMetaItem`), KHÔNG hardcode màu/label.

| Giá trị | Ý nghĩa |
|---|---|
| `upcoming` | Sắp diễn ra |
| `ongoing` | Đang diễn ra |
| `completed` | Đã hoàn thành |
| `cancelled` | Đã hủy |

---

## Hooks

```typescript
import {
  useClassSessionList,
  useClassSessionDetail,
  useClassSessionCreate,
  useClassSessionGenerate,
  useClassSessionUpdate,
  useClassSessionCancel,
  useClassSessionDelete,
  ClassSessionService,
} from '@tera/modules/education/class-session';
```

---

## Cách sử dụng

### Danh sách (lồng theo lớp)

```typescript
import { useClassSessionList } from '@tera/modules/education/class-session';
import { getListData } from '@tera/commons/hooks';
import { ClassSessionResponse } from './types';

function SessionScreen({ classId }: { classId: number }) {
  const { data, isLoading, refetch } = useClassSessionList({
    params: { class_id: classId, per_page: 50, sort_by: 'session_no', sort_dir: 'asc' },
  });

  const { items, pagination } = getListData<ClassSessionResponse>(data);

  const time = (v?: string) => (v ? v.slice(0, 5) : '—'); // "18:00:00" -> "18:00"
}
```

> ⚠️ `class_id` truyền trong `params` — API tách ra để ghép vào URL lồng `:classId`, phần còn lại thành query.

### Lọc

```typescript
const { data } = useClassSessionList({
  params: {
    class_id: classId,
    per_page: 50,
    status: 'upcoming',
    teacher_id: 1,
    room_id: 2,
    from_date: '2026-07-01',
    to_date: '2026-07-31',
    tag_ids: [1, 2],
  },
});
```

### Thêm 1 buổi (lẻ/bù)

```typescript
const { mutate: create } = useClassSessionCreate();

create(
  {
    params: {
      class_id: classId,             // ghép vào URL lồng (KHÔNG nằm trong body)
      name: 'Buổi bù',
      session_date: '2026-07-10',    // chọn ngày tự do, KHÔNG ràng buộc lịch tuần
      start_time: '19:00',           // gửi "HH:mm"
      end_time: '20:30',
      teacher_id: 1,
      substitute_teacher_id: 2,      // giáo viên dạy thay (optional)
      room_id: 2,
      note: 'Học bù',
      tag_ids: [17],
    },
  },
  { onSuccess: () => toast.success('Đã thêm buổi học') }
);
```

### Sinh buổi tự động (theo lịch tuần)

```typescript
const { mutate: generate } = useClassSessionGenerate();

generate(
  {
    params: {
      class_id: classId,
      from_date: '2026-07-01',
      to_date: '2026-07-31',
      override: false, // true = xóa buổi CHƯA chốt điểm danh trong khoảng rồi sinh lại
    },
  },
  { onSuccess: () => toast.success('Đã sinh buổi học') }
);
```

### Cập nhật / Hủy / Xóa (phẳng — `:id` = id buổi)

```typescript
const { mutate: update } = useClassSessionUpdate();
const { mutate: cancel } = useClassSessionCancel();
const { mutate: remove } = useClassSessionDelete();

// Update gửi full body (giống create, KHÔNG có class_id)
update({
  id: sessionId,
  params: {
    name: 'Buổi 1 - Introduction (updated)',
    session_date: '2026-07-02',
    start_time: '19:00',
    end_time: '20:30',
    teacher_id: 2,
    substitute_teacher_id: 3,
    room_id: 2,
    note: 'Ghi chú',
    tag_ids: [17],
  },
});
cancel({ id: sessionId, params: { reason: 'Giáo viên nghỉ đột xuất.' } });
remove({ id: sessionId });
```

---

## Lưu ý

- **ID convention**: list/create/generate dùng **`class_id`** (id lớp, route lồng); detail/update/cancel/delete dùng **`id`** (id buổi, route phẳng). Đừng nhầm.
- **2 cách tạo buổi**: `generate` sinh theo **lịch tuần** (weekday) + khoảng `from_date/to_date`; `create` chọn **`session_date` tự do** (buổi lẻ/bù), không có weekday.
- `start_time`/`end_time` dạng `"HH:mm:ss"` — gửi backend dạng `"HH:mm"`, hiển thị `.slice(0, 5)`.
- `attendance_locked = true` → buổi đã chốt điểm danh: FE **ẩn nút Sửa** (chỉ xem). Đây là quy ước FE, không phải ràng buộc API.
- **Update gửi FULL body** (giống create: `name/session_date/start_time/end_time/teacher_id/substitute_teacher_id/room_id/note/tag_ids`), KHÔNG có `class_id`. ⚠️ **API CHẤP NHẬN sửa `name`** (body update có `name`), nhưng FE quy ước **khóa ô tên** khi update (UX) — nếu muốn cho sửa tên thì bỏ `disabled`.
- `tags` chưa có catalog riêng → options lấy distinct từ data buổi (chưa tạo tag mới được từ FE).
- **Cache invalidation**: mọi mutation (create/generate/update/cancel/delete) invalidate `["class-session", "list"]` **VÀ** `["class-room", "detail"]` + `["class-room", "list"]` — vì `statistics.operational.total_sessions` (tab Thống kê vận hành) nằm trong **class-room detail**, không tự refresh khi chỉ invalidate session list.
- ⚠️ **Route LỒNG `/edu/class-room/:classId/session/*` có thể trả 401 → logout** nếu backend chưa deploy (interceptor `_requestError` gặp 401 → `localStorage.clear()` + `/401`). Route phẳng `/edu/class-session/{detail|update|cancel|delete}/:id` thì OK.
- 🐞 **Bug backend đã biết**: sau khi xóa session, `total_sessions` ở `class-room/detail` vẫn đếm session soft-deleted (thiếu `whereNull('deleted_at')`) → cần backend sửa câu đếm stats vận hành.
