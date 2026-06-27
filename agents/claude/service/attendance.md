# Attendance Service

## Tổng quan

| | |
|---|---|
| **Module** | `@tera/modules/education/attendance` |
| **API file** | `services/api/src/education/attendance/attendance.api.ts` |
| **Service file** | `services/modules/src/education/attendance/attendance.service.ts` |
| **Base URL** | `/v1/edu/attendance/` |
| **Pattern** | A — CRUD + Export |
| **Screen** | `apps/hana-teacher/src/screens/AttendanceScreen` |

---

## API Endpoints

| Method | URL | Mô tả |
|---|---|---|
| GET | `/v1/edu/attendance/list` | Danh sách điểm danh |
| GET | `/v1/edu/attendance/detail/:id` | Chi tiết bản ghi điểm danh |
| POST | `/v1/edu/attendance/create` | Tạo điểm danh |
| PUT | `/v1/edu/attendance/update/:id` | Cập nhật điểm danh |
| DELETE | `/v1/edu/attendance/delete/:id` | Xóa điểm danh |
| POST | `/v1/edu/attendance/export` | Xuất Excel |

---

## Response: GET /v1/edu/attendance/list

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "session_id": 1,
        "session": {
          "id": 1,
          "session_no": 1,
          "name": "Buổi học 1",
          "session_date": "2026-06-26T17:00:00.000000Z",
          "status": "upcoming"
        },
        "student_id": 1,
        "student": {
          "id": 1,
          "code": "STU0001",
          "name": "Học viên 1"
        },
        "status": "present",
        "status_label": "Có mặt",
        "checkin_time": "2026-06-27T11:00:00.000000Z",
        "checkout_time": "2026-06-27T12:30:00.000000Z",
        "note": null,
        "created_by": null,
        "created_at": "2026-06-27T07:56:20.000000Z",
        "updated_at": "2026-06-27T07:56:20.000000Z"
      }
    ],
    "pagination": { "total": 1, "per_page": 20, "current_page": 1, "last_page": 1 }
  },
  "code": 200,
  "errors": null
}
```

---

## TypeScript Interfaces

```typescript
export type AttendanceApiStatus = 'present' | 'late' | 'absent' | 'excused';

export interface AttendanceSessionInfo {
  id: number;
  session_no: number;
  name: string;
  session_date: string;   // ISO datetime UTC
  status: string;         // 'upcoming' | 'ongoing' | 'completed'
}

export interface AttendanceStudentInfo {
  id: number;
  code: string;
  name: string;
}

export interface AttendanceResponse {
  id: number;
  session_id: number;
  session?: AttendanceSessionInfo | null;
  student_id: number;
  student?: AttendanceStudentInfo | null;
  status: AttendanceApiStatus;
  status_label?: string;          // "Có mặt", "Đi muộn", "Vắng mặt"
  checkin_time?: string | null;   // ISO datetime UTC
  checkout_time?: string | null;  // ISO datetime UTC
  note?: string | null;
  created_by?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface AttendanceStats {
  total: number;
  present: number;
  late: number;
  absent: number;
}
```

---

## Status mapping (API → UI)

| API status | UI AttendanceStatus | Badge | Màu |
|---|---|---|---|
| `present` | `present` | Có mặt | `#22C55E` |
| `late` | `late` | Đi muộn | `#F59E0B` |
| `absent` | `absent` | Vắng mặt | `#EF4444` |
| `excused` | `absent` | Vắng có phép | `#EF4444` |
| _(null/unknown)_ | `unmarked` | Chưa điểm danh | `#94A3B8` |

---

## Hooks

```typescript
import {
  useAttendanceList,
  useAttendanceDetail,
  useAttendanceCreate,
  useAttendanceUpdate,
  useUpsertAttendance,
  useAttendanceDelete,
  useAttendanceExport,
  AttendanceService,
} from '@tera/modules/education/attendance';
```

---

## Cách sử dụng

### Danh sách điểm danh (lọc theo session)

```typescript
import { useAttendanceList } from '@tera/modules/education/attendance';
import { getListData } from '@tera/commons/hooks';
import { AttendanceResponse } from './types';

function AttendanceScreen() {
  const { data, isLoading, refetch } = useAttendanceList({
    params: {
      per_page: 50,
      filters: { session_id: sessionId },  // lọc theo buổi học
    },
  });

  const { items, pagination } = getListData<AttendanceResponse>(data);

  const stats = {
    total:   pagination.total,
    present: items.filter((i) => i.status === 'present').length,
    late:    items.filter((i) => i.status === 'late').length,
    absent:  items.filter((i) => i.status === 'absent').length,
  };

  const attended = stats.present + stats.late;
}
```

### Mapper API → UI

```typescript
function mapToStudentAttendance(
  item: AttendanceResponse,
  index: number,
): StudentAttendance {
  return {
    id: String(item.id),
    no: String(index + 1).padStart(2, '0'),
    avatar: `https://i.pravatar.cc/150?img=${(item.student_id % 50) + 1}`,
    fullName: item.student?.name ?? '',
    status: (item.status as AttendanceStatus) ?? 'unmarked',
    checkInTime: item.checkin_time
      ? item.checkin_time.slice(11, 16)   // "HH:mm" từ ISO UTC
      : undefined,
  };
}
```

### Điểm danh học viên (update status)

```typescript
const { mutate: upsert } = useUpsertAttendance();

upsert({
  id: attendanceRecordId,
  params: {
    status: 'present',
    checkin_time: new Date().toISOString(),
  },
});
```

---

## Lưu ý

- `checkin_time` / `checkout_time` là ISO datetime UTC — extract giờ với `.slice(11, 16)` để lấy `"HH:mm"`.
- List API hỗ trợ filter `session_id` qua `params.filters` để lọc theo buổi học cụ thể.
- `status_label` sẵn có trong response — có thể dùng trực tiếp thay vì tự map.
- `avatar` không có trong API — dùng placeholder: `https://i.pravatar.cc/150?img=${student_id % 50 + 1}`.
- Bug đã fix: `useUpsertAttendance` trước đây invalidate `["student", "list"]` — đã sửa thành `["attendance", "list"]` + `["attendance", "detail"]`.
- Cache invalidation: create/update/delete invalidate `["attendance", "list"]`. Upsert thêm `["attendance", "detail"]`.
