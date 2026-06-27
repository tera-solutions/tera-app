# Room Service

## Tổng quan

| | |
|---|---|
| **Module** | `@tera/modules/education/room` |
| **API file** | `services/api/src/education/room/room.api.ts` |
| **Base URL** | `/v1/edu/room/` |
| **Pattern** | C — CRUD + Export + Suspend/Restore |

---

## API Endpoints

| Method | URL | Mô tả |
|---|---|---|
| GET | `/v1/edu/room/list` | Danh sách phòng học |
| GET | `/v1/edu/room/detail/:id` | Chi tiết phòng học |
| POST | `/v1/edu/room/create` | Tạo phòng học |
| PUT | `/v1/edu/room/update/:id` | Cập nhật phòng học |
| DELETE | `/v1/edu/room/delete/:id` | Xóa phòng học |
| POST | `/v1/edu/room/suspend/:id` | Đình chỉ phòng học |
| POST | `/v1/edu/room/restore/:id` | Khôi phục phòng học |
| POST | `/v1/edu/room/export` | Xuất Excel |

---

## Response: GET /v1/edu/room/list

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
        "room_code": "R001",
        "room_name": "Phòng 1",
        "floor": null,
        "capacity": 20,
        "room_type": "classroom",
        "status": "active",
        "description": null,
        "branch_id": 1,
        "branch": {
          "id": 1,
          "name": "Chi nhánh Quận 1",
          "code": "CN1"
        },
        "active_classes_count": 0,
        "created_by": null,
        "updated_by": null,
        "deleted_by": null,
        "created_at": "2026-06-27T07:17:07.000000Z",
        "updated_at": "2026-06-27T07:17:07.000000Z",
        "deleted_at": null
      }
    ],
    "pagination": {
      "total": 6,
      "per_page": 20,
      "current_page": 1,
      "last_page": 1
    }
  }
}
```

> Cùng cấu trúc `{ data: { items, pagination } }` như tất cả API list khác — dùng `getListData<RoomResponse>(data)`.

---

## TypeScript Interfaces

```typescript
export type RoomType =
  | 'classroom'      // Phòng học
  | 'computer_room'  // Phòng máy tính
  | 'speaking_room'  // Phòng luyện nói
  | 'exam_room'      // Phòng thi
  | 'meeting_room'   // Phòng họp
  | 'other';

export type RoomApiStatus = 'active' | 'inactive' | 'maintenance';

export interface RoomResponse {
  id: number;
  room_code?: string;
  room_name: string;
  floor?: string | null;
  capacity?: number | null;
  room_type?: RoomType;
  status?: RoomApiStatus;
  description?: string | null;
  branch_id?: number;
  branch?: { id: number; name: string; code?: string } | null;
  active_classes_count?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
```

---

## Hooks

```typescript
import {
  useRoomList,
  useRoomDetail,
  useRoomCreate,
  useRoomUpdate,
  useUpsertRoom,
  useRoomDelete,
  useRoomExport,
  useRoomSuspend,
  useRoomRestore,
  RoomService,
} from '@tera/modules/education/room';
```

---

## Cách sử dụng

### Danh sách

```typescript
import { useRoomList } from '@tera/modules/education/room';
import { getListData } from '@tera/commons/hooks';
import { RoomResponse } from './types';

const ROOM_TYPE_LABELS: Record<string, string> = {
  classroom: 'Phòng học',
  computer_room: 'Phòng máy tính',
  speaking_room: 'Phòng luyện nói',
  exam_room: 'Phòng thi',
  meeting_room: 'Phòng họp',
  other: 'Khác',
};

function RoomScreen() {
  const { data, isLoading, isFetching, refetch } = useRoomList({
    params: { per_page: 50 },
  });

  const { items, pagination } = getListData<RoomResponse>(data);

  // items: RoomResponse[]
  // pagination: { total, per_page, current_page, last_page }
}
```

### Tạo / Cập nhật

```typescript
const { mutate: upsert } = useUpsertRoom();

upsert(
  {
    id: existingId, // undefined = create, có giá trị = update
    params: {
      room_name: 'Phòng A101',
      room_code: 'A101',
      room_type: 'classroom',
      capacity: 30,
      branch_id: 1,
      floor: '1',
      description: 'Phòng học tiêu chuẩn',
    },
  },
  {
    onSuccess: () => toast.success('Lưu thành công'),
    onError: (err) => toast.error(err.message),
  }
);
```

### Lọc theo chi nhánh / loại phòng

```typescript
const { data } = useRoomList({
  params: {
    per_page: 50,
    filters: {
      branch_id: 1,
      room_type: 'classroom',
      status: 'active',
    },
  },
});
```

---

## Lưu ý

- `status` có 3 giá trị: `active` (đang hoạt động), `inactive` (ngừng hoạt động), `maintenance` (đang bảo trì). UI type `RoomStatus` chỉ có `active | inactive` — map `maintenance` → `inactive`.
- `active_classes_count` = số lớp đang sử dụng phòng này. Không có `student_count` hay schedule trong list response.
- `room_name` và `branch.name` thường được ghép lại khi hiển thị: `"Phòng 1 - Chi nhánh Quận 1"`.
- Cache invalidation: tất cả mutation invalidate `["room", "list"]`. Suspend/Restore thêm `["room", "detail"]`.
