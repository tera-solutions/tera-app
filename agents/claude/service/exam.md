# Exam Service

## Tổng quan

| | |
|---|---|
| **Module** | `@tera/modules/education/exam` |
| **API file** | `services/api/src/education/exam/exam.api.ts` |
| **Base URL** | `/v1/edu/exam/` _(dùng prefix extended, không phải `/edu/`)_ |
| **Pattern** | A — CRUD + Export |

---

## API Endpoints

| Method | URL | Mô tả |
|---|---|---|
| GET | `/v1/edu/exam/list` | Danh sách bài kiểm tra |
| GET | `/v1/edu/exam/detail/:id` | Chi tiết bài kiểm tra |
| POST | `/v1/edu/exam/create` | Tạo bài kiểm tra |
| PUT | `/v1/edu/exam/update/:id` | Cập nhật bài kiểm tra |
| DELETE | `/v1/edu/exam/delete/:id` | Xóa bài kiểm tra |
| POST | `/v1/edu/exam/export` | Xuất Excel |

---

## Response: POST /v1/edu/exam/create (shape dùng cho detail/list item)

```json
{
  "success": true,
  "msg": "Tạo bài kiểm tra thành công.",
  "code": 200,
  "errors": null,
  "data": {
    "id": 1,
    "exam_code": "EXM000001",
    "exam_name": "Final Test - Starter",
    "exam_type": "final",
    "course_id": 1,
    "course": { "id": 1, "code": "CRS001", "name": "Kids English" },
    "level_id": 1,
    "level": { "id": 1, "level_code": "LV1-1", "level_name": "Starter" },
    "duration": 60,
    "total_score": "100.00",
    "passing_score": "70.00",
    "version": 1,
    "root_exam_id": null,
    "status": "draft",
    "questions": [],
    "created_by": 2,
    "updated_by": 2,
    "created_at": "2026-06-27T08:30:04.000000Z",
    "updated_at": "2026-06-27T08:30:04.000000Z",
    "deleted_at": null
  }
}
```

> List endpoint trả về `{ data: { items: ExamResponse[], pagination } }` — dùng `getListData<ExamResponse>(data)`.

---

## TypeScript Interfaces

```typescript
export type ExamApiStatus = 'draft' | 'published' | 'active' | 'completed' | 'archived';

export type ExamType = 'quiz' | 'midterm' | 'final' | 'practice' | 'other';

export interface ExamResponse {
  id: number;
  exam_code?: string;
  exam_name: string;
  exam_type?: ExamType;
  course_id?: number;
  course?: { id: number; code?: string; name: string } | null;
  level_id?: number | null;
  level?: { id: number; level_code?: string; level_name?: string } | null;
  duration?: number;        // phút
  total_score?: string;     // "100.00"
  passing_score?: string;   // "70.00"
  version?: number;
  status?: ExamApiStatus;
  questions?: unknown[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
```

---

## Status mapping (API → UI)

| API status | UI ExamStatus | Hiển thị |
|---|---|---|
| `draft` | `upcoming` | Chưa bắt đầu |
| `published` | `upcoming` | Chưa bắt đầu |
| `active` | `ongoing` | Đang diễn ra |
| `completed` | `completed` | Đã hoàn thành |
| `archived` | `completed` | Đã hoàn thành |

## exam_type → Icon

| exam_type | iconName | iconColor |
|---|---|---|
| `final` | `clipboard-outline` | `#F97316` |
| `midterm` | `file-edit-outline` | `#2196F3` |
| `quiz` | `format-text` | `#8B5CF6` |
| `practice` | `book-open-outline` | `#22C55E` |
| `other` | `file-document-outline` | `#2196F3` |

---

## Hooks

```typescript
import {
  useExamList,
  useExamDetail,
  useExamCreate,
  useExamUpdate,
  useUpsertExam,
  useExamDelete,
  useExamExport,
  ExamService,
} from '@tera/modules/education/exam';
```

---

## Cách sử dụng

### Danh sách

```typescript
import { useExamList } from '@tera/modules/education/exam';
import { getListData } from '@tera/commons/hooks';
import { ExamResponse } from './types';

function ExamScreen() {
  const { data, isLoading, isFetching, refetch } = useExamList({
    params: { per_page: 50 },
  });

  const { items, pagination } = getListData<ExamResponse>(data);

  const stats = {
    total:     pagination.total,
    completed: items.filter((e) => e.status === 'completed' || e.status === 'archived').length,
    ongoing:   items.filter((e) => e.status === 'active').length,
    upcoming:  items.filter((e) => e.status === 'draft' || e.status === 'published').length,
  };
}
```

### Tạo bài kiểm tra

```typescript
const { mutate: upsert } = useUpsertExam();

upsert(
  {
    id: existingId,
    params: {
      exam_name: 'Final Test - Starter',
      exam_type: 'final',
      course_id: 1,
      level_id: 1,
      duration: 60,
      total_score: 100,
      passing_score: 70,
    },
  },
  {
    onSuccess: () => toast.success('Lưu thành công'),
    onError: (err) => toast.error(err.message),
  }
);
```

### Lọc theo course / status

```typescript
const { data } = useExamList({
  params: {
    per_page: 50,
    filters: { course_id: 1, status: 'published' },
  },
});
```

---

## Lưu ý

- **URL prefix khác biệt:** Exam dùng `/v1/edu/exam/` (extended), KHÔNG phải `/v1/edu/exam/`. Các service education khác dùng `/v1/edu/`.
- `total_score` và `passing_score` là string dạng `"100.00"` — parse sang number khi cần tính toán: `parseFloat(exam.total_score ?? '0')`.
- `questions: []` — list API trả về array rỗng; câu hỏi chi tiết chỉ có trong detail endpoint.
- `studentCount` không có trong list response — cần gọi thêm API enrollment để lấy số học viên dự thi.
- Cache invalidation: create/update/delete invalidate `["exam", "list"]`. Upsert thêm `["exam", "detail"]`.
