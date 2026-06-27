# Material Service

## Tổng quan

| | |
|---|---|
| **Module** | `@tera/modules/education/material` |
| **API file** | `services/api/src/education/material/material.api.ts` |
| **Service file** | `services/modules/src/education/material/material.service.ts` |
| **Base URL** | `/v1/edu/material/` |
| **Pattern** | A — CRUD + Export |
| **Screen** | `apps/hana-teacher/src/screens/MaterialScreen` |
| **Route** | `apps/hana-teacher/src/app/edu/material.tsx` |

---

## API Endpoints

| Method | URL | Mô tả |
|---|---|---|
| GET | `/v1/edu/material/list` | Danh sách tài liệu |
| GET | `/v1/edu/material/detail/:id` | Chi tiết tài liệu |
| POST | `/v1/edu/material/create` | Tạo tài liệu |
| PUT | `/v1/edu/material/update/:id` | Cập nhật tài liệu |
| DELETE | `/v1/edu/material/delete/:id` | Xóa tài liệu |
| POST | `/v1/edu/material/export` | Xuất Excel |

---

## Response: GET /v1/edu/material/list

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "material_code": "MAT0001",
        "material_name": "Giáo trình My World 1",
        "material_type": "pdf",
        "category_id": null,
        "category": null,
        "current_version": null,
        "access_type": "teacher",
        "status": "draft",
        "file_size": null,
        "file_url": null,
        "description": null,
        "class": null,
        "course": null,
        "created_by": null,
        "business_id": 2,
        "created_at": "2026-06-27T07:56:20.000000Z",
        "updated_at": "2026-06-27T07:56:20.000000Z"
      }
    ],
    "pagination": { "total": 6, "per_page": 20, "current_page": 1, "last_page": 1 }
  },
  "code": 200,
  "errors": null
}
```

---

## TypeScript Interfaces

```typescript
export type MaterialApiStatus = 'draft' | 'published' | 'archived';

export type MaterialType =
  | 'pdf' | 'doc' | 'docx' | 'ppt' | 'pptx'
  | 'xls' | 'xlsx' | 'mp4' | 'mp3'
  | 'image' | 'link' | 'other';

export type MaterialAccessType = 'teacher' | 'student' | 'all';

export interface MaterialCategory {
  id: number;
  name: string;
  color?: string;
}

export interface MaterialResponse {
  id: number;
  material_code: string;
  material_name: string;
  material_type: MaterialType;
  category_id?: number | null;
  category?: MaterialCategory | null;
  current_version?: string | null;
  access_type?: MaterialAccessType;
  status: MaterialApiStatus;
  file_size?: number | null;      // bytes
  file_url?: string | null;
  description?: string | null;
  class?: { id: number; name: string } | null;
  course?: { id: number; name: string } | null;
  created_by?: number | null;
  business_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MaterialStats {
  total: number;
  hoc_lieu: number;        // pdf/doc/ppt
  tai_lieu: number;        // xls/image/link/other
  da_phuong_tien: number;  // mp4/mp3
}
```

---

## Status mapping (API → UI)

| API status | Nhãn | Màu nền | Màu chữ |
|---|---|---|---|
| `draft` | Bản nháp | `#F1F5F9` | `#64748B` |
| `published` | Đã xuất bản | `#EBF7EE` | `#27AE60` |
| `archived` | Lưu trữ | `#FFF4EB` | `#E67E22` |

---

## Type → Icon mapping

| Type | Icon | Màu |
|---|---|---|
| `pdf` | `file-pdf-box` | `#E74C3C` |
| `doc` / `docx` | `file-word-box` | `#2980B9` |
| `ppt` / `pptx` | `file-powerpoint-box` | `#E67E22` |
| `xls` / `xlsx` | `file-excel-box` | `#27AE60` |
| `mp4` | `file-video-outline` | `#9B5DE5` |
| `mp3` | `file-music-outline` | `#8E44AD` |
| `image` | `file-image-outline` | `#007AFF` |
| `link` | `link-variant` | `#00A896` |
| `other` | `file-outline` | `#64748B` |

---

## Hooks

```typescript
import {
  useMaterialList,
  useMaterialDetail,
  useMaterialCreate,
  useMaterialUpdate,
  useUpsertMaterial,
  useMaterialDelete,
  useMaterialExport,
  MaterialService,
} from '@tera/modules/education/material';
```

---

## Cách sử dụng

### Danh sách tài liệu

```typescript
import { useMaterialList } from '@tera/modules/education/material';
import { getListData } from '@tera/commons/hooks';
import { MaterialResponse } from './types';

function MaterialScreen() {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useMaterialList({
    params: { per_page: 50, search: search || undefined },
  });

  const { items, pagination } = getListData<MaterialResponse>(data);

  const stats = {
    total:          pagination.total,
    hoc_lieu:       items.filter((i) => ['pdf','doc','docx','ppt','pptx'].includes(i.material_type)).length,
    tai_lieu:       items.filter((i) => !['pdf','doc','docx','ppt','pptx','mp4','mp3'].includes(i.material_type)).length,
    da_phuong_tien: items.filter((i) => ['mp4','mp3'].includes(i.material_type)).length,
  };
}
```

### Tài liệu theo buổi học (LessonScreen)

```typescript
const { data } = useMaterialList({
  params: {
    per_page: 50,
    filters: { lesson_id: lessonId },
  },
});
```

### Format file size

```typescript
function formatSize(bytes?: number | null): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
```

---

## LessonScreen Integration

Material được tích hợp vào LessonScreen tab "Tài liệu" qua component `MaterialTab`:

```typescript
// LessonScreen/components/MaterialTab.tsx
const { data } = useMaterialList({
  params: { per_page: 50, filters: { lesson_id: lessonId } },
});
```

---

## Lưu ý

- `category_id` và `category` thường là `null` trong API hiện tại — dùng `material_type` để phân loại hiển thị.
- `file_size` là số bytes, cần format khi hiển thị (`formatSize()`).
- `access_type`: `teacher` = chỉ GV, `student` = học viên, `all` = tất cả.
- `current_version` dùng để track phiên bản tài liệu, thường `null` trong list.
- URL prefix dùng `/v1/edu/material/` (extended) khác với các service dùng `/v1/edu/`.
- TABS trong LessonScreen đã refactor sang dạng `{ value: string; text: string }[]`.
- Cache invalidation: create/update/delete invalidate `["material", "list"]`. Upsert thêm `["material", "detail"]`.
