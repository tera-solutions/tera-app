# LessonPlan Service

## Tổng quan

| | |
|---|---|
| **Module** | `@tera/modules/education/lesson-plan` |
| **API file** | `services/api/src/education/lesson-plan/lesson-plan.api.ts` |
| **Base URL** | `/v1/edu/lesson-plan/` |
| **Pattern** | A — CRUD + Export (không có Suspend/Restore) |

---

## API Endpoints

| Method | URL | Mô tả |
|---|---|---|
| GET | `/v1/edu/lesson-plan/list` | Danh sách giáo án |
| GET | `/v1/edu/lesson-plan/detail/:id` | Chi tiết giáo án |
| POST | `/v1/edu/lesson-plan/create` | Tạo giáo án |
| PUT | `/v1/edu/lesson-plan/update/:id` | Cập nhật giáo án |
| DELETE | `/v1/edu/lesson-plan/delete/:id` | Xóa giáo án |
| POST | `/v1/edu/lesson-plan/export` | Xuất Excel |

---

## Response: GET /v1/edu/lesson-plan/list

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
        "plan_code": "LP001",
        "plan_name": "Giáo án 1",
        "course_id": 1,
        "level_id": null,
        "version": 1,
        "total_lessons": 0,
        "lessons_count": 0,
        "description": null,
        "status": "draft",
        "published_at": null,
        "published_by": null,
        "course": { "id": 1, "name": "Kids English", "code": "CRS001" },
        "created_at": "2026-06-27T07:56:20.000000Z",
        "updated_at": "2026-06-27T07:56:20.000000Z",
        "deleted_at": null
      }
    ],
    "pagination": {
      "total": 4,
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
export type LessonPlanStatus = 'draft' | 'reviewing' | 'published' | 'archived';

export interface LessonPlanResponse {
  id: number;
  plan_code?: string;
  plan_name: string;
  course_id?: number;
  level_id?: number | null;
  version?: number;
  total_lessons?: number;   // số bài học trong kế hoạch
  lessons_count?: number;   // số bài học thực tế đã tạo
  description?: string | null;
  status?: LessonPlanStatus;
  published_at?: string | null;
  course?: { id: number; name: string; code?: string } | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
```

---

## Status

| Giá trị | Ý nghĩa | UI mapping |
|---|---|---|
| `draft` | Bản nháp | `none` (chưa giảng) |
| `reviewing` | Đang chờ duyệt | `upcoming` (sắp tới) |
| `published` | Đã xuất bản | `done` (đã giảng) |
| `archived` | Đã lưu trữ | `none` (chưa giảng) |

---

## Hooks

```typescript
import {
  useLessonPlanList,
  useLessonPlanDetail,
  useLessonPlanCreate,
  useLessonPlanUpdate,
  useUpsertLessonPlan,
  useLessonPlanDelete,
  useLessonPlanExport,
  LessonPlanService,
} from '@tera/modules/education/lesson-plan';
```

---

## Cách sử dụng

### Danh sách

```typescript
import { useLessonPlanList } from '@tera/modules/education/lesson-plan';
import { getListData } from '@tera/commons/hooks';
import { LessonPlanResponse } from './types';

function LessonPlanScreen() {
  const [search, setSearch] = useState('');

  const { data, isLoading, isFetching, refetch } = useLessonPlanList({
    params: { search: search || undefined, per_page: 50 },
  });

  const { items, pagination } = getListData<LessonPlanResponse>(data);

  // Tính stats
  const published = items.filter((p) => p.status === 'published').length;
  const reviewing = items.filter((p) => p.status === 'reviewing').length;
  const progressPercent = pagination.total > 0
    ? Math.round((published / pagination.total) * 100)
    : 0;
}
```

### Lọc theo status / khóa học

```typescript
const { data } = useLessonPlanList({
  params: {
    per_page: 50,
    filters: {
      status: 'published',
      course_id: 1,
    },
  },
});
```

### Tạo / Cập nhật

```typescript
const { mutate: upsert } = useUpsertLessonPlan();

upsert(
  {
    id: existingId,
    params: {
      plan_name: 'Giáo án Tiếng Anh Lớp 1',
      plan_code: 'LP010',
      course_id: 1,
      total_lessons: 24,
      description: 'Chương trình học kỳ 1',
    },
  },
  {
    onSuccess: () => toast.success('Lưu thành công'),
    onError: (err) => toast.error(err.message),
  }
);
```

---

## Lưu ý

- **`total_lessons`** vs **`lessons_count`**: `total_lessons` là số bài dự kiến trong kế hoạch, `lessons_count` là số bài thực tế đã được tạo. Cả hai có thể là 0 nếu chưa thêm bài học.
- **Bug đã fix:** `useUpsertLessonPlan` trước đây invalidate sai key `["student", "list"]`, đã sửa thành `["lesson-plan", "list"]` và thêm `["lesson-plan", "detail"]`.
- Không có Suspend/Restore — giáo án bị ngừng dùng thì chuyển về `archived` qua `update`.
- Cache invalidation: create/update/delete invalidate `["lesson-plan", "list"]`. Upsert thêm `["lesson-plan", "detail"]`.
