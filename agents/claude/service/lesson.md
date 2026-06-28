# Lesson Service

## Tổng quan

| | |
|---|---|
| **Module** | `@tera/modules/education/lesson` |
| **API file** | `services/api/src/education/lesson/lesson.api.ts` |
| **Service file** | `services/modules/src/education/lesson/lesson.service.ts` |
| **Base URL** | `/v1/edu/lesson/` |
| **Pattern** | A — CRUD + Export |
| **Screen** | `apps/hana-teacher/src/screens/LessonScreen` |
| **Route** | `apps/hana-teacher/src/app/edu/lesson.tsx` |

---

## API Endpoints

| Method | URL | Mô tả |
|---|---|---|
| GET | `/v1/edu/lesson/list` | Danh sách buổi học |
| GET | `/v1/edu/lesson/detail/:id` | Chi tiết buổi học |
| POST | `/v1/edu/lesson/create` | Tạo buổi học |
| PUT | `/v1/edu/lesson/update/:id` | Cập nhật buổi học |
| DELETE | `/v1/edu/lesson/delete/:id` | Xóa buổi học |
| POST | `/v1/edu/lesson/export` | Xuất Excel |

---

## Response: GET /v1/edu/lesson/list

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 16,
        "class_room_id": 3,
        "lesson_plan_id": null,
        "lesson_plan_lesson_id": null,
        "lesson_no": 4,
        "lesson_title": "Buổi 4",
        "lesson_date": "2026-06-29T17:00:00.000000Z",
        "start_time": "18:00:00",
        "end_time": "19:30:00",
        "room_id": null,
        "teacher_id": null,
        "objective": null,
        "vocabulary": null,
        "grammar": null,
        "activities": null,
        "homework": null,
        "lesson_note": null,
        "status": "completed",
        "is_locked": false,
        "completed_at": null,
        "locked_at": null,
        "class": { "id": 3, "name": "Lớp 3", "code": "CLS003" },
        "teacher": null,
        "room": null,
        "created_at": "2026-06-27T07:56:20.000000Z",
        "updated_at": "2026-06-27T07:56:20.000000Z"
      }
    ],
    "pagination": { "total": 1, "per_page": 20, "current_page": 1, "last_page": 2 }
  },
  "code": 200,
  "errors": null
}
```

---

## TypeScript Interfaces

```typescript
export type LessonApiStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface LessonResponse {
  id: number;
  class_room_id: number;
  lesson_plan_id?: number | null;
  lesson_plan_lesson_id?: number | null;
  lesson_no: number;
  lesson_title: string;
  lesson_date: string;           // ISO datetime UTC
  start_time: string;            // "HH:mm:ss"
  end_time: string;              // "HH:mm:ss"
  room_id?: number | null;
  teacher_id?: number | null;
  objective?: string | null;     // chi tiết, thường null trong list
  vocabulary?: string | null;
  grammar?: string | null;
  activities?: string | null;
  homework?: string | null;
  lesson_note?: string | null;
  status: LessonApiStatus;
  is_locked: boolean;
  completed_at?: string | null;
  locked_at?: string | null;
  class?: { id: number; name: string; code: string } | null;
  teacher?: { id: number; name: string } | null;
  room?: { id: number; name: string } | null;
  created_at?: string;
  updated_at?: string;
}

export interface LessonStats {
  total: number;
  completed: number;
  upcoming: number;
  ongoing: number;
}
```

---

## Status mapping (API → UI)

| API status | Nhãn | Màu | Icon |
|---|---|---|---|
| `completed` | Đã giảng | `#27AE60` | `check-circle` |
| `upcoming` | Sắp tới | `#007AFF` | `clock-outline` |
| `ongoing` | Đang diễn ra | `#E67E22` | `play-circle-outline` |
| `cancelled` | Đã hủy | `#E74C3C` | `close-circle-outline` |

---

## Hooks

```typescript
import {
  useLessonList,
  useLessonDetail,
  useLessonCreate,
  useLessonUpdate,
  useUpsertLesson,
  useLessonDelete,
  useLessonExport,
  LessonService,
} from '@tera/modules/education/lesson';
```

---

## Cách sử dụng

### Danh sách buổi học (lọc theo class)

```typescript
import { useLessonList } from '@tera/modules/education/lesson';
import { getListData } from '@tera/commons/hooks';
import { LessonResponse } from './types';

function LessonScreen() {
  const { lessonId, classId } = useLocalSearchParams<{
    lessonId?: string;
    classId?: string;
  }>();

  const { data, isLoading } = useLessonList({
    params: {
      per_page: 50,
      filters: { class_room_id: classId },
    },
  });

  const { items, pagination } = getListData<LessonResponse>(data);

  // Lấy lesson cụ thể hoặc item đầu tiên
  const currentLesson = lessonId
    ? items.find((l) => String(l.id) === lessonId)
    : items[0];

  const stats = {
    total:     pagination.total,
    completed: items.filter((l) => l.status === 'completed').length,
    upcoming:  items.filter((l) => l.status === 'upcoming').length,
    ongoing:   items.filter((l) => l.status === 'ongoing').length,
  };
}
```

### Helpers format

```typescript
// "2026-06-29T17:00:00.000000Z" → "29/06/2026"
function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

// "18:00:00" → "18:00"
function formatTime(t: string): string {
  return t.slice(0, 5);
}

// Time range: "18:00 - 19:30"
const timeRange = `${formatTime(lesson.start_time)} - ${formatTime(lesson.end_time)}`;
```

### Cập nhật nội dung buổi học

```typescript
const { mutate: upsert } = useUpsertLesson();

upsert({
  id: lessonId,
  params: {
    objective: 'Học sinh có thể...',
    vocabulary: 'family, school, color',
    grammar: 'Present simple',
    homework: 'Làm bài tập trang 12',
    lesson_note: 'Cần chuẩn bị thêm flashcards',
  },
});
```

---

## Lưu ý

- `lesson_date` là ISO datetime UTC — cần parse và format sang `DD/MM/YYYY` khi hiển thị.
- `start_time` / `end_time` dạng `"HH:mm:ss"` — lấy 5 ký tự đầu `.slice(0,5)` để hiển thị `"HH:mm"`.
- `objective`, `vocabulary`, `grammar`, `activities`, `homework`, `lesson_note` thường là `null` trong list — chỉ có data khi giáo viên đã cập nhật chi tiết.
- `is_locked` — buổi học bị khóa không cho sửa. Cần check trước khi cho phép edit.
- Filter theo class dùng `params.filters.class_room_id`. Filter theo teacher dùng `params.filters.teacher_id`.
- Route params: `lessonId` để xem buổi học cụ thể, `classId` để lọc danh sách theo lớp.
- Bug đã fix: `useUpsertLesson` trước đây invalidate `["student", "list"]` — đã sửa thành `["lesson", "list"]` + `["lesson", "detail"]`.
- Cache invalidation: create/update/delete invalidate `["lesson", "list"]`. Upsert thêm `["lesson", "detail"]`.
