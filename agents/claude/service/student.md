# Student Service

## Tổng quan

| | |
|---|---|
| **Module** | `@tera/modules/education/student` |
| **API file** | `services/api/src/education/student/student.api.ts` |
| **Service file** | `services/modules/src/education/student/student.service.ts` |
| **Base URL** | `/v1/edu/student/` |
| **Pattern** | C — CRUD + Export + Suspend/Restore |
| **Screen** | `apps/hana-teacher/src/screens/StudentScreen` |

---

## API Endpoints

| Method | URL | Mô tả |
|---|---|---|
| GET | `/v1/edu/student/list` | Danh sách học viên |
| GET | `/v1/edu/student/detail/:id` | Chi tiết học viên |
| POST | `/v1/edu/student/create` | Tạo học viên |
| PUT | `/v1/edu/student/update/:id` | Cập nhật học viên |
| DELETE | `/v1/edu/student/delete/:id` | Xóa học viên |
| POST | `/v1/edu/student/export` | Xuất Excel |
| POST | `/v1/edu/student/suspend/:id` | Tạm dừng học viên |
| POST | `/v1/edu/student/restore/:id` | Khôi phục học viên |

---

## Response: GET /v1/edu/student/list

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "code": "STU0001",
        "name": "Học viên 1",
        "avatar": null,
        "dob": null,
        "gender": null,
        "nationality": null,
        "language": null,
        "email": null,
        "phone": null,
        "level_id": 2,
        "status": "active",
        "enrollment_date": null,
        "admission_source": null,
        "user_id": null,
        "business_id": 2,
        "business": { "id": 2, "name": "Hana English (Demo)" },
        "branch_id": 2,
        "branch": { "id": 2, "name": "Chi nhánh Quận 7" },
        "parents": [
          {
            "id": 1,
            "name": "Phụ huynh 1",
            "phone": "0911111101",
            "email": null,
            "relation": "father"
          }
        ],
        "created_at": "2026-06-27T07:56:20.000000Z",
        "updated_at": "2026-06-27T07:56:20.000000Z",
        "deleted_at": null
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
export type StudentApiStatus = 'active' | 'suspended' | 'inactive';

export type StudentGender = 'male' | 'female' | null;

export interface StudentParent {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  relation: 'father' | 'mother' | 'guardian' | string;
}

export interface StudentResponse {
  id: number;
  code: string;
  name: string;
  avatar?: string | null;
  dob?: string | null;              // ISO date, nullable
  gender?: StudentGender;           // nullable trong list
  nationality?: string | null;
  language?: string | null;
  email?: string | null;
  phone?: string | null;
  level_id?: number | null;
  status?: StudentApiStatus;
  enrollment_date?: string | null;
  admission_source?: string | null;
  user_id?: number | null;
  business_id?: number;
  business?: { id: number; name: string } | null;
  branch_id?: number;
  branch?: { id: number; name: string } | null;
  parents?: StudentParent[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
```

---

## Status mapping (API → UI)

| API status | UI AttendanceStatus | Tag hiển thị | Màu tag |
|---|---|---|---|
| `active` | `present` | Tích cực | `#2D7DD2` (xanh) |
| `suspended` | `absent` | Cần cố gắng | `#D97706` (cam) |
| `inactive` | `absent` | Bình thường | `#64748B` (xám) |

---

## Hooks

```typescript
import {
  useStudentList,
  useStudentDetail,
  useStudentCreate,
  useStudentUpdate,
  useUpsertStudent,
  useStudentDelete,
  useStudentSuspend,
  useStudentRestore,
  useStudentExport,
  StudentService,
} from '@tera/modules/education/student';
```

---

## Cách sử dụng

### Danh sách học viên

```typescript
import { useStudentList } from '@tera/modules/education/student';
import { getListData } from '@tera/commons/hooks';
import { StudentResponse } from './types';

function StudentScreen() {
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch } = useStudentList({
    params: { search: search || undefined, per_page: 50 },
  });

  const { items, pagination } = getListData<StudentResponse>(data);

  // Total từ pagination.total thay vì items.length
  const totalStudents = pagination.total;
  const activeCount = items.filter((s) => s.status === 'active').length;
}
```

### Mapper API → UI StudentItem

```typescript
function mapToStudentItem(item: StudentResponse, index: number): StudentItemType {
  const status = item.status ?? 'active';
  return {
    id: String(item.id),
    index: index + 1,
    name: item.name,
    birthday: item.dob ? formatDate(item.dob) : 'Chưa cập nhật',
    gender: 'Nam',           // API trả null trong list, dùng default
    rating: 4.5,             // không có trong list API
    ...TAG_MAP[status],
    status: status === 'active' ? 'present' : 'absent',
    attendanceRate: 0,       // không có trong list API
    avatar: AVATARS[index % AVATARS.length],
  };
}
```

### Tạm dừng / khôi phục học viên

```typescript
const { mutate: suspend } = useStudentSuspend();
const { mutate: restore } = useStudentRestore();

suspend({ id: studentId, params: { reason: 'Nghỉ tạm thời' } });
restore({ id: studentId, params: {} });
```

### Lọc theo branch / status

```typescript
const { data } = useStudentList({
  params: {
    per_page: 50,
    filters: { branch_id: 2, status: 'active' },
  },
});
```

---

## Lưu ý

- `gender`, `dob`, `avatar` thường là `null` trong list API — cần dùng giá trị mặc định khi hiển thị.
- `attendanceRate`, `presentCount`, `absentCount` không có trong list API — cần gọi thêm Attendance API để tính.
- `parents[]` có trong list response — dùng `parents[0]` để lấy thông tin phụ huynh chính.
- `totalStudents` nên lấy từ `pagination.total` thay vì `items.length` (do pagination).
- Search được hỗ trợ qua `params.search` — truyền trực tiếp, không cần qua `filters`.
- Bug đã fix: `useUpsertStudent` trước đây không invalidate `["student", "detail"]` — đã thêm vào.
- Cache invalidation: create/update/delete invalidate `["student", "list"]`. Upsert + suspend + restore thêm `["student", "detail"]`.
