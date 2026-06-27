# Assignment Service

## Tổng quan

| | |
|---|---|
| **Module** | `@tera/modules/education/exam` (cùng folder với ExamService) |
| **API file** | `services/api/src/education/exam/assignment.api.ts` |
| **Service file** | `services/modules/src/education/exam/assignment.service.ts` |
| **Base URL** | `/v1/education/assignment/` _(prefix extended, giống Exam)_ |
| **Pattern** | A — CRUD + Export |
| **Screen** | `apps/hana-teacher/src/screens/AssignmentScreen` |
| **Route** | `apps/hana-teacher/src/app/edu/assignment.tsx` |

---

## API Endpoints

| Method | URL | Mô tả |
|---|---|---|
| GET | `/v1/education/assignment/list` | Danh sách bài tập |
| GET | `/v1/education/assignment/detail/:id` | Chi tiết bài tập |
| POST | `/v1/education/assignment/create` | Tạo bài tập |
| PUT | `/v1/education/assignment/update/:id` | Cập nhật bài tập |
| DELETE | `/v1/education/assignment/delete/:id` | Xóa bài tập |
| POST | `/v1/education/assignment/export` | Xuất Excel |

---

## Response: GET /v1/education/assignment/list

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "assignment_code": "ASG000001",
        "assignment_name": "Bài tập 1",
        "assignment_type": "homework",
        "course_id": 1,
        "course": { "id": 1, "code": "CRS001", "name": "Kids English" },
        "level_id": null,
        "lesson_id": null,
        "class_room_id": 1,
        "class": { "id": 1, "code": "CLS001", "name": "Lớp 1" },
        "description": null,
        "instruction": "Hoàn thành bài tập 1",
        "max_score": "10.00",
        "due_date": "2026-07-04T07:56:20.000000Z",
        "allow_late_submission": true,
        "allow_multiple_submission": false,
        "status": "draft",
        "submissions_count": 0,
        "created_at": "2026-06-27T07:56:20.000000Z",
        "updated_at": "2026-06-27T07:56:20.000000Z",
        "deleted_at": null
      }
    ],
    "pagination": { "total": 9, "per_page": 20, "current_page": 1, "last_page": 1 }
  },
  "code": 200,
  "errors": null
}
```

---

## TypeScript Interfaces

```typescript
export type AssignmentApiStatus = 'draft' | 'published' | 'closed';

export type AssignmentType =
  | 'homework' | 'worksheet' | 'quiz' | 'writing'
  | 'speaking' | 'listening' | 'reading' | 'project' | 'exam_practice';

export interface AssignmentResponse {
  id: number;
  assignment_code: string;
  assignment_name: string;
  assignment_type: AssignmentType;
  course_id?: number;
  course?: { id: number; code: string; name: string } | null;
  class_room_id?: number;
  class?: { id: number; code: string; name: string } | null;
  description?: string | null;
  instruction?: string;
  max_score?: string;           // "10.00"
  due_date?: string;            // ISO datetime UTC
  allow_late_submission?: boolean;
  allow_multiple_submission?: boolean;
  status?: AssignmentApiStatus;
  submissions_count?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface AssignmentStats {
  total: number;
  published: number;
  draft: number;
  closed: number;
}
```

---

## Status mapping (API → UI)

| API status | Badge type | Nhãn hiển thị |
|---|---|---|
| `draft` | `neutral` | Bản nháp |
| `published` | `success` | Đã giao |
| `closed` | `warning` | Đã đóng |

## assignment_type → Icon

| assignment_type | icon | iconColor |
|---|---|---|
| `homework` | `text-box-outline` | `#007AFF` |
| `worksheet` | `file-document-outline` | `#27AE60` |
| `quiz` | `help-circle-outline` | `#E67E22` |
| `writing` | `pencil` | `#9B5DE5` |
| `speaking` | `microphone-outline` | `#E74C3C` |
| `listening` | `headphones` | `#E67E22` |
| `reading` | `book-open-outline` | `#2980B9` |
| `project` | `folder-outline` | `#9B5DE5` |
| `exam_practice` | `clipboard-text-outline` | `#E74C3C` |

---

## Hooks

```typescript
import {
  useAssignmentList,
  useAssignmentDetail,
  useAssignmentCreate,
  useAssignmentUpdate,
  useUpsertAssignment,
  useAssignmentDelete,
  useAssignmentExport,
  AssignmentService,
} from '@tera/modules/education/exam';
```

---

## Cách sử dụng

### Danh sách

```typescript
import { useAssignmentList } from '@tera/modules/education/exam';
import { getListData } from '@tera/commons/hooks';
import { AssignmentResponse } from './types';

function AssignmentScreen() {
  const { data, isLoading, refetch } = useAssignmentList({
    params: { per_page: 50 },
  });

  const { items, pagination } = getListData<AssignmentResponse>(data);

  const stats = {
    total:     pagination.total,
    published: items.filter((i) => i.status === 'published').length,
    draft:     items.filter((i) => i.status === 'draft').length,
    closed:    items.filter((i) => i.status === 'closed').length,
  };
}
```

### Lọc theo status / class

```typescript
const { data } = useAssignmentList({
  params: {
    per_page: 50,
    filters: { status: 'published', class_room_id: 1 },
  },
});
```

---

## Lưu ý

- Assignment và Exam đều nằm trong cùng module `@tera/modules/education/exam` và cùng folder `services/modules/src/education/exam/`.
- URL dùng `/v1/education/assignment/` (prefix extended), không phải `/v1/edu/`.
- `max_score` là string `"10.00"` — parse khi cần: `parseFloat(item.max_score ?? '0')`.
- `submissions_count` trong list chỉ đếm tổng số bài đã nộp; không có `total_students` → không tính được % chính xác.
- `due_date` là ISO datetime UTC — format sang `DD/MM/YYYY` khi hiển thị.
- Tab filter trong screen: Tất cả / Đã giao (`published`) / Bản nháp (`draft`) / Đã đóng (`closed`).
- Cache invalidation: create/update/delete invalidate `["assignment", "list"]`. Upsert thêm `["assignment", "detail"]`.
