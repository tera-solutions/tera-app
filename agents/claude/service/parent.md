# Parent Service

## Tổng quan

| | |
|---|---|
| **Module** | `@tera/modules/crm/parent` |
| **API file** | `services/api/src/crm/parent/parent.api.ts` |
| **Base URL** | `/v1/crm/parent/` |
| **Pattern** | C — CRUD + Export + Suspend/Restore |

---

## API Endpoints

| Method | URL | Mô tả |
|---|---|---|
| GET | `/v1/crm/parent/list` | Danh sách phụ huynh |
| GET | `/v1/crm/parent/detail/:id` | Chi tiết phụ huynh |
| POST | `/v1/crm/parent/create` | Tạo phụ huynh |
| PUT | `/v1/crm/parent/update/:id` | Cập nhật phụ huynh |
| DELETE | `/v1/crm/parent/delete/:id` | Xóa phụ huynh |
| POST | `/v1/crm/parent/suspend/:id` | Đình chỉ phụ huynh |
| POST | `/v1/crm/parent/restore/:id` | Khôi phục phụ huynh |
| POST | `/v1/crm/parent/export` | Xuất Excel |

---

## Response: GET /v1/crm/parent/list

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
        "code": "PAR0001",
        "name": "Phụ huynh 1",
        "avatar": null,
        "gender": null,
        "dob": null,
        "email": null,
        "phone": "0911111101",
        "address": null,
        "province": null,
        "district": null,
        "occupation": null,
        "company": null,
        "note": null,
        "status": "active",
        "students_count": 1,
        "business_id": 2,
        "business": { "id": 2, "name": "Hana English (Demo)" },
        "branch_id": 1,
        "branch": { "id": 1, "name": "Chi nhánh Quận 1" },
        "created_at": "2026-06-27T07:56:20.000000Z",
        "updated_at": "2026-06-27T07:56:20.000000Z",
        "deleted_at": null
      }
    ],
    "pagination": {
      "total": 3,
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
export type ParentApiStatus = 'active' | 'suspended' | 'inactive';

export interface ParentResponse {
  id: number;
  code?: string;
  name: string;
  avatar?: string | null;
  gender?: string | null;
  dob?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  province?: string | null;
  district?: string | null;
  occupation?: string | null;
  company?: string | null;
  note?: string | null;
  status?: ParentApiStatus;
  students_count?: number;
  business?: { id: number; name: string } | null;
  branch?: { id: number; name: string } | null;
  created_at?: string;
  updated_at?: string;
}
```

---

## Hooks

```typescript
import {
  useParentList,
  useParentDetail,
  useParentCreate,
  useParentUpdate,
  useUpsertParent,
  useParentDelete,
  useParentExport,
  useParentSuspend,
  useParentRestore,
  ParentService,
} from '@tera/modules/crm/parent';
```

---

## Cách sử dụng

### Danh sách

```typescript
import { useParentList } from '@tera/modules/crm/parent';
import { getListData } from '@tera/commons/hooks';
import { ParentResponse } from './types';

function ParentScreen() {
  const [search, setSearch] = useState('');

  const { data, isLoading, isFetching, refetch } = useParentList({
    params: { search: search || undefined, per_page: 50 },
  });

  const { items, pagination } = getListData<ParentResponse>(data);
  // items: ParentResponse[]
  // pagination.total: tổng số phụ huynh
}
```

### Lọc theo chi nhánh / trạng thái

```typescript
const { data } = useParentList({
  params: {
    per_page: 50,
    filters: {
      branch_id: 1,
      status: 'active',
    },
  },
});
```

### Tạo / Cập nhật

```typescript
const { mutate: upsert } = useUpsertParent();

upsert(
  {
    id: existingId,
    params: {
      name: 'Nguyễn Thị Hoa',
      phone: '0912345678',
      email: 'hoa@example.com',
      gender: 'female',
      branch_id: 1,
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
const { mutate: suspend } = useParentSuspend();
const { mutate: restore } = useParentRestore();

suspend({ id: parentId, params: {} });
restore({ id: parentId, params: {} });
```

---

## Lưu ý

- `status` có 3 giá trị: `active` (đang hoạt động), `suspended` (đình chỉ), `inactive` (ngừng hoạt động).
- `students_count` = số học viên liên kết với phụ huynh này. Tên học viên cụ thể **không có** trong list response — cần gọi detail hoặc parent-student API.
- `avatar` trả về `null` nếu chưa upload — dùng ảnh fallback khi hiển thị.
- **Bug đã fix:** `useUpsertParent` trước đây invalidate sai key `["student", "list"]`, đã sửa thành `["parent", "list"]`.
- Cache invalidation: create/update/delete invalidate `["parent", "list"]`. Suspend/Restore thêm `["parent", "detail"]`.

---

## Status mapping (UI)

API `status` khác với UI `ContactStatus` của ParentScreen:

| API status | UI ContactStatus | Ý nghĩa |
|---|---|---|
| `active` | `contacted` | Phụ huynh đang hoạt động |
| `suspended` | `not_contacted` | Đã đình chỉ |
| `inactive` | `not_contacted` | Ngừng hoạt động |

> UI filter tab `contacted`/`not_contacted` map theo bảng trên. Đây là mapping tạm thời — khi API có field `contact_status` riêng thì cần cập nhật lại.
