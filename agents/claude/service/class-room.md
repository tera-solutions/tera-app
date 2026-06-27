# ClassRoom Service

## Tổng quan

| | |
|---|---|
| **Module** | `@tera/modules/education/class-room` |
| **API file** | `services/api/src/education/class-room/class-room.api.ts` |
| **Base URL** | `GET /v1/edu/class-room/list` |
| **Pattern** | C — CRUD + Export + Suspend/Restore |

---

## API Endpoints

| Method | URL | Mô tả |
|---|---|---|
| GET | `/v1/edu/class-room/list` | Danh sách lớp |
| GET | `/v1/edu/class-room/detail/:id` | Chi tiết lớp |
| POST | `/v1/edu/class-room/create` | Tạo lớp |
| PUT | `/v1/edu/class-room/update/:id` | Cập nhật lớp |
| DELETE | `/v1/edu/class-room/delete/:id` | Xóa lớp |
| POST | `/v1/edu/class-room/suspend/:id` | Đình chỉ lớp |
| POST | `/v1/edu/class-room/restore/:id` | Khôi phục lớp |
| POST | `/v1/edu/class-room/export` | Xuất Excel |

---

## Response: GET /v1/edu/class-room/list

```json
{
  "success": true,
  "msg": "Thao tác thành công",
  "code": 200,
  "errors": null,
  "data": {
    "items": [
      {
        "id": 1,
        "code": "CLS001",
        "name": "Lớp 1",
        "course_id": 1,
        "course": {
          "id": 1,
          "code": "CRS001",
          "name": "IELTS Foundation (test)"
        },
        "lesson_plan_id": null,
        "lesson_plan": null,
        "teacher_id": null,
        "teacher": null,
        "assignee_id": null,
        "assignee": null,
        "room_id": null,
        "room": null,
        "learning_type": "self_learning",
        "start_date": "2026-07-18",
        "end_date": null,
        "status": "upcoming",
        "min_warning_capacity": null,
        "min_capacity": null,
        "max_warning_capacity": null,
        "max_capacity": 20,
        "capacity_warning": null,
        "use_course_curriculum": false,
        "description": null,
        "schedules": [
          {
            "id": 1,
            "class_id": 1,
            "weekday": 2,
            "start_time": "15:00:00",
            "end_time": "17:00:00"
          }
        ],
        "business_id": null,
        "business": null,
        "created_by": 1,
        "updated_by": 1,
        "deleted_by": null,
        "created_at": "2026-06-27T01:43:23.000000Z",
        "updated_at": "2026-06-27T01:43:23.000000Z",
        "deleted_at": null
      }
    ],
    "pagination": {
      "total": 1,
      "per_page": 20,
      "current_page": 1,
      "last_page": 1
    }
  }
}
```

---

## TypeScript Interfaces

```typescript
export interface ClassRoomSchedule {
  id?: number;
  class_id?: number;
  weekday?: number;    // 2=T2, 3=T3, 4=T4, 5=T5, 6=T6, 7=T7, 8=CN
  start_time?: string; // "HH:mm:ss"
  end_time?: string;   // "HH:mm:ss"
}

export interface ClassRoomResponse {
  id: number;
  code?: string;
  name: string;

  course_id?: number;
  course?: { id: number; code?: string; name: string };

  teacher_id?: number | null;
  teacher?: { id: number; name: string } | null;

  room_id?: number | null;
  room?: { id?: number; name?: string } | null;

  learning_type?: string;   // "self_learning" | "offline" | "online"
  start_date?: string;      // "YYYY-MM-DD"
  end_date?: string | null;
  status?: string;          // "upcoming" | "active" | "suspended"

  min_capacity?: number | null;
  max_capacity?: number | null;

  use_course_curriculum?: boolean;
  description?: string | null;

  schedules?: ClassRoomSchedule[];

  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
```

---

## Hooks

```typescript
import {
  useClassRoomList,
  useClassRoomDetail,
  useClassRoomCreate,
  useClassRoomUpdate,
  useUpsertClassRoom,
  useClassRoomDelete,
  useClassRoomSuspend,
  useClassRoomRestore,
  useClassRoomExport,
} from '@tera/modules/education/class-room';
```

---

## Cách sử dụng

### Danh sách

```typescript
import { useClassRoomList } from '@tera/modules/education/class-room';
import { getListData } from '@tera/commons/hooks';

const WEEKDAY_LABELS: Record<number, string> = {
  2: 'T2', 3: 'T3', 4: 'T4', 5: 'T5', 6: 'T6', 7: 'T7', 8: 'CN',
};

function ClassroomScreen() {
  const [search, setSearch] = useState('');

  const { data, isLoading, isFetching, refetch } = useClassRoomList({
    params: { search: search || undefined, per_page: 50 },
  });

  // Dùng helper chuẩn — KHÔNG truy cập data?.data?.items trực tiếp
  const { items, pagination } = getListData<ClassRoomResponse>(data);

  const totalClasses = pagination.total;
  const scheduleText = (room: ClassRoomResponse) =>
    (room.schedules ?? [])
      .map((s) => WEEKDAY_LABELS[s.weekday ?? 0])
      .filter(Boolean)
      .join(', ');
}
```

### Chi tiết

```typescript
const { data, isLoading } = useClassRoomDetail({ id: classId });
const room = data?.data as ClassRoomResponse;
```

### Tạo / Cập nhật

```typescript
const { mutate: upsert } = useUpsertClassRoom();

upsert(
  {
    id: existingId, // undefined = create, có giá trị = update
    params: {
      name: 'Lớp A1',
      course_id: 1,
      max_capacity: 20,
      start_date: '2026-09-01',
      schedules: [
        { weekday: 2, start_time: '08:00:00', end_time: '10:00:00' },
        { weekday: 4, start_time: '08:00:00', end_time: '10:00:00' },
      ],
    },
  },
  {
    onSuccess: () => toast.success('Lưu thành công'),
    onError: (err) => toast.error(err.message),
  }
);
```

### Đình chỉ / Khôi phục

```typescript
const { mutate: suspend } = useClassRoomSuspend();
const { mutate: restore } = useClassRoomRestore();

suspend({ id: classId, params: {} });
restore({ id: classId, params: {} });
```

---

## Lưu ý

- `weekday` là số nguyên (2–8), KHÔNG phải string. Cần map sang label trước khi hiển thị.
- `start_time` / `end_time` có dạng `"HH:mm:ss"` — cắt `.slice(0, 5)` để hiển thị `"HH:mm"`.
- Không có field `branch`, `level`, `age_group`, `student_count` trong response. Dùng `course.name` thay cho level.
- `status`: `upcoming` = chưa bắt đầu, `active` = đang hoạt động, `suspended` = đã đình chỉ.
- Cache invalidation: tất cả mutation đều invalidate `["class-room", "list"]`. Suspend/Restore thêm `["class-room", "detail"]`.
