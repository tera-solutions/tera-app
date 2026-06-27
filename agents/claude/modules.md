# Tera App — Đặc tả Modules

**Package:** `@tera/modules` | **Source:** `services/modules/src/`

Module layer nằm giữa UI và API: bọc `@tera/api` thành **React Query hooks** để component gọi trực tiếp mà không cần xử lý loading/error/cache thủ công.

---

## Cấu trúc tổng quan

```
src/
├── crm/
│   ├── enrollment/      ✅ implemented
│   ├── lead/            ✅ core | 🔲 lead-pipeline, lead-activity (empty)
│   ├── parent/          ✅ implemented
│   └── parent-student/  ✅ implemented
├── education/
│   ├── attendance/      ✅ core | 🔲 absence-reason, attendance-session (empty)
│   ├── class-room/      ✅ implemented
│   ├── class-schedule/  ✅ implemented
│   ├── course/          ✅ core | 🔲 course-level, course-pricing, curriculum (empty)
│   ├── evaluation/      ✅ core | 🔲 exam, score, skill-assessment, test, progress-report (empty)
│   ├── lesson/          ✅ core | 🔲 homework, lesson-material, lesson-plan, lesson-progress (empty)
│   ├── lesson-plan/     ✅ implemented
│   ├── level/           ✅ implemented
│   ├── student/         ✅ core | 🔲 student-profile, student-level, student-status, student-document, student-history (empty)
│   └── student-level/   ✅ implemented
├── finance/
│   ├── debt/            ✅ core | 🔲 debt-aging, debt-reminder (empty)
│   ├── discount/        ✅ core | 🔲 coupon, discount-rule, promotion-campaign (empty)
│   ├── invoice/         ✅ core | 🔲 invoice-item, invoice-status, invoice-adjustment (empty)
│   ├── payment/         ✅ core | 🔲 payment-method, payment-transaction (empty)
│   └── refund/          ✅ implemented
├── hr/
│   ├── staff/           ✅ core | 🔲 department, job-role, work-schedule (empty)
│   └── teacher/         ✅ core | 🔲 teacher-profile, teacher-salary, teacher-schedule, teacher-performance (empty)
├── notification/
│   ├── notification/    ✅ core | 🔲 notification-queue, notification-read (empty)
│   └── template/        ✅ core | 🔲 notification-template, notification-channel (empty)
├── reporting/           ✅ tất cả 6 service đều implemented
├── system/
│   ├── audit/           ✅ core | 🔲 audit-log (empty)
│   ├── auth/            ✅ implemented
│   ├── branch/          ✅ implemented
│   ├── business/        ✅ implemented
│   ├── permission/      ✅ implemented
│   ├── role/            ✅ implemented
│   ├── setting/         ✅ implemented
│   └── user/            ✅ core | 🔲 profile (empty)
└── wallet/
    ├── transaction/     🔲 tất cả empty (wallet-topup, wallet-deduction, wallet-refund, wallet-transaction)
    ├── wallet/          ✅ core | 🔲 wallet-balance (empty)
    └── wallet-transaction/ ✅ implemented
```

> **✅ implemented** = file có code | **🔲 empty** = file tạo sẵn, chưa viết logic

---

## Dependency & Import

```typescript
// Trong component
import { StudentService } from "@tera/modules";

// Service export object — dùng destructure
const { useStudentList, useStudentCreate } = StudentService;

// Hoặc import thẳng named export
import { useStudentList, useStudentCreate } from "@tera/modules";
```

Mỗi module export theo hai cách:
- **Named exports** cho từng hook riêng lẻ
- **Service object** (e.g. `StudentService`, `TeacherService`) tập hợp tất cả hooks của module đó

---

## Payload Types (`@tera/api/_interface`)

| Type | Fields | Dùng cho |
|---|---|---|
| `ListPayload` | `{ params?: { filters?: object; page?: number; pageSize?: number; ... } }` | Query danh sách |
| `DetailPayload` | `{ id: string \| number }` | Query chi tiết 1 record |
| `CreatePayload` | `{ params: object }` | Tạo mới |
| `UpdatePayload` | `{ id: string \| number; params: object }` | Cập nhật |
| `DeletePayload` | `{ id: string \| number }` | Xoá |
| `ExportPayload` | `{ params: object }` | Xuất file |

---

## Function Patterns

Toàn bộ codebase dùng **4 pattern** sau, phân loại theo độ phức tạp nghiệp vụ:

---

### Pattern A — Standard CRUD + Export

Dành cho phần lớn các entity. Gồm **7 hooks**.

```typescript
// ── QUERY (tự động fetch, cache) ──────────────────────────────
const { data, isLoading, isFetching } = useXxxList(payload);
const { data, isLoading } = useXxxDetail(payload);

// ── MUTATION (gọi thủ công qua mutate/mutateAsync) ────────────
const { mutate: create } = useXxxCreate();
const { mutate: update } = useXxxUpdate();
const { mutate: upsert } = useUpsertXxx();   // tự chọn create/update dựa vào payload.id
const { mutate: remove } = useXxxDelete();
const { mutate: doExport } = useXxxExport(); // mở link download trong tab mới
```

**Danh sách service dùng Pattern A:**
`AuthService`, `UserService`, `BusinessService`, `RoleService`, `PermissionService`, `SettingService`, `AuditService`, `EnrollmentService`, `LeadService`, `AttendanceService`, `CourseService`, `EvaluationService`, `LessonService`, `LessonPlanService`, `StudentLevelService`, `DebtService`, `DiscountService`, `InvoiceService`, `PaymentService`, `RefundService`, `StaffService`, `NotificationService`, `TemplateService`, `WalletService`, `WalletTransactionService`, `AttendanceReportService`, `RevenueReportService`, `LeadConversionReportService`, `StudentProgressReportService`, `ClassUtilizationReportService`, `TeacherPerformanceReportService`

---

### Pattern B — CRUD không có Export

Dành cho sub-entity hoặc entity không cần xuất file. Gồm **5 hooks** (bỏ Export).

```typescript
const { data } = useXxxList(payload);
const { data } = useXxxDetail(payload);
const { mutate } = useXxxCreate();
const { mutate } = useXxxUpdate();
const { mutate } = useXxxDelete();
// Không có useUpsertXxx, không có useXxxExport
```

**Đặc biệt:** `useClassScheduleList` nhận thêm tham số `options?: { enabled?: boolean }` để kiểm soát khi nào query kích hoạt:

```typescript
// Chỉ fetch khi classId tồn tại
const { data } = useClassScheduleList(
  { params: { class_id: classId } },
  { enabled: !!classId }
);
```

**Danh sách service dùng Pattern B:**
`BranchService`, `ParentStudentService`, `ClassScheduleService`, `LevelService`

---

### Pattern C — CRUD + Export + Suspend/Restore

Dành cho entity có vòng đời trạng thái (active → suspended → active). Gồm **9 hooks**.

```typescript
// Thêm 2 hooks so với Pattern A:
const { mutate: suspend } = useXxxSuspend(); // tạm ngưng
const { mutate: restore } = useXxxRestore(); // khôi phục
```

> Sau suspend/restore, cache bị xoá cả `list` lẫn `detail` (vì trạng thái ảnh hưởng cả hai view).

**Danh sách service dùng Pattern C:**
`StudentService`, `ClassRoomService`, `ParentService`

---

### Pattern D — CRUD + Export + Suspend/Restore/Resign + Certificate (Teacher)

Pattern phức tạp nhất, chỉ dùng cho `TeacherService`. Gồm **14 hooks**.

```typescript
// Hooks bổ sung ngoài Pattern C:
const { mutate: resign } = useTeacherResign();  // ghi nhận nghỉ việc

// Sub-resource: Chứng chỉ giáo viên
const { data } = useTeacherCertificateList({ id: teacherId });
const { mutate } = useTeacherCertificateCreate();
const { mutate } = useTeacherCertificateUpdate();
const { mutate } = useTeacherCertificateDelete();
```

Cache key cho certificate: `["teacher", "certificate", "list", teacherId]`

---

## Chi tiết từng Module

### 1. CRM

#### EnrollmentService
```typescript
import { EnrollmentService } from "@tera/modules";

EnrollmentService.useEnrollmentList(payload)    // Query list
EnrollmentService.useEnrollmentDetail(payload)  // Query detail
EnrollmentService.useEnrollmentCreate()         // Mutation
EnrollmentService.useEnrollmentUpdate()         // Mutation
EnrollmentService.useUpsertEnrollment()         // Mutation
EnrollmentService.useEnrollmentDelete()         // Mutation
EnrollmentService.useEnrollmentExport()         // Mutation → mở link
```

#### LeadService
```typescript
LeadService.useLeadList(payload)
LeadService.useLeadDetail(payload)
LeadService.useLeadCreate()
LeadService.useLeadUpdate()
LeadService.useUpsertLead()
LeadService.useLeadDelete()
LeadService.useLeadExport()
```

> `lead-pipeline.service.ts` và `lead-activity.service.ts` hiện còn **empty** — chưa implement.

#### ParentService _(Pattern C)_
```typescript
ParentService.useParentList(payload)
ParentService.useParentDetail(payload)
ParentService.useParentCreate()
ParentService.useParentUpdate()
ParentService.useUpsertParent()
ParentService.useParentDelete()
ParentService.useParentSuspend()    // POST /crm/parent/suspend/:id
ParentService.useParentRestore()    // POST /crm/parent/restore/:id
ParentService.useParentExport()
```

#### ParentStudentService _(Pattern B)_
```typescript
ParentStudentService.useParentStudentList(payload)
ParentStudentService.useParentStudentDetail(payload)
ParentStudentService.useParentStudentCreate()   // body: { parent_id, student_id, relation }
ParentStudentService.useParentStudentUpdate()
ParentStudentService.useParentStudentDelete()
```

---

### 2. Education

#### StudentService _(Pattern C)_
```typescript
StudentService.useStudentList(payload)
StudentService.useStudentDetail(payload)
StudentService.useStudentCreate()
StudentService.useStudentUpdate()
StudentService.useUpsertStudent()
StudentService.useStudentDelete()
StudentService.useStudentSuspend()
StudentService.useStudentRestore()
StudentService.useStudentExport()
```

#### LevelService _(Pattern B)_
```typescript
LevelService.useLevelList(payload)
LevelService.useLevelDetail(payload)
LevelService.useLevelCreate()
LevelService.useLevelUpdate()
// Không có delete — dùng suspend/restore ở tầng API
```

#### CourseService _(Pattern A)_
```typescript
CourseService.useCourseList(payload)
CourseService.useCourseDetail(payload)
CourseService.useCourseCreate()
CourseService.useCourseUpdate()
CourseService.useUpsertCourse()
CourseService.useCourseDelete()
CourseService.useCourseExport()
```

> `course-level.service.ts`, `course-pricing.service.ts`, `curriculum.service.ts` còn **empty**.

#### ClassRoomService _(Pattern C)_
```typescript
ClassRoomService.useClassRoomList(payload)
ClassRoomService.useClassRoomDetail(payload)
ClassRoomService.useClassRoomCreate()
ClassRoomService.useClassRoomUpdate()
ClassRoomService.useUpsertClassRoom()
ClassRoomService.useClassRoomDelete()
ClassRoomService.useClassRoomSuspend()
ClassRoomService.useClassRoomRestore()
ClassRoomService.useClassRoomExport()
```

#### ClassScheduleService _(Pattern B + options)_
```typescript
ClassScheduleService.useClassScheduleList(payload, options?)
// options: { enabled?: boolean } — kiểm soát khi nào query chạy

ClassScheduleService.useClassScheduleDetail(payload)
ClassScheduleService.useClassScheduleCreate()  // cần params.class_id để build URL nested
ClassScheduleService.useClassScheduleUpdate()
ClassScheduleService.useClassScheduleDelete()
```

Lưu ý: `getList` và `create` dùng URL nested `edu/class-room/:class_id/schedule/*`; `getDetail`, `update`, `delete` dùng URL phẳng `edu/class-schedule/*`.

#### LessonPlanService _(Pattern A)_
```typescript
LessonPlanService.useLessonPlanList(payload)
LessonPlanService.useLessonPlanDetail(payload)
LessonPlanService.useLessonPlanCreate()
LessonPlanService.useLessonPlanUpdate()
LessonPlanService.useUpsertLessonPlan()
LessonPlanService.useLessonPlanDelete()
LessonPlanService.useLessonPlanExport()
```

#### LessonService _(Pattern A)_
```typescript
LessonService.useLessonList(payload)
LessonService.useLessonDetail(payload)
LessonService.useLessonCreate()
LessonService.useLessonUpdate()
LessonService.useUpsertLesson()
LessonService.useLessonDelete()
LessonService.useLessonExport()
```

> `homework.service.ts`, `lesson-material.service.ts`, `lesson-progress.service.ts` còn **empty**.

#### AttendanceService _(Pattern A)_
```typescript
AttendanceService.useAttendanceList(payload)
AttendanceService.useAttendanceDetail(payload)
AttendanceService.useAttendanceCreate()
AttendanceService.useAttendanceUpdate()
AttendanceService.useUpsertAttendance()
AttendanceService.useAttendanceDelete()
AttendanceService.useAttendanceExport()
```

> `absence-reason.service.ts`, `attendance-session.service.ts` còn **empty**.

#### EvaluationService _(Pattern A)_
```typescript
EvaluationService.useEvaluationList(payload)
EvaluationService.useEvaluationDetail(payload)
EvaluationService.useEvaluationCreate()
EvaluationService.useEvaluationUpdate()
EvaluationService.useUpsertEvaluation()
EvaluationService.useEvaluationDelete()
EvaluationService.useEvaluationExport()
```

> `exam.service.ts`, `score.service.ts`, `skill-assessment.service.ts`, `test.service.ts`, `progress-report.service.ts` còn **empty**.

#### StudentLevelService _(Pattern A)_
```typescript
StudentLevelService.useStudentLevelList(payload)
StudentLevelService.useStudentLevelDetail(payload)
StudentLevelService.useStudentLevelCreate()
StudentLevelService.useStudentLevelUpdate()
StudentLevelService.useUpsertStudentLevel()
StudentLevelService.useStudentLevelDelete()
StudentLevelService.useStudentLevelExport()
```

---

### 3. HR

#### TeacherService _(Pattern D)_
```typescript
TeacherService.useTeacherList(payload)
TeacherService.useTeacherDetail(payload)
TeacherService.useTeacherCreate()
TeacherService.useTeacherUpdate()
TeacherService.useUpsertTeacher()
TeacherService.useTeacherDelete()
TeacherService.useTeacherSuspend()
TeacherService.useTeacherRestore()
TeacherService.useTeacherResign()          // Ghi nhận nghỉ việc
TeacherService.useTeacherExport()

// Sub-resource: Chứng chỉ
TeacherService.useTeacherCertificateList({ id: teacherId })
TeacherService.useTeacherCertificateCreate()
TeacherService.useTeacherCertificateUpdate()
TeacherService.useTeacherCertificateDelete()
```

> `teacher-profile.service.ts`, `teacher-salary.service.ts`, `teacher-schedule.service.ts`, `teacher-performance.service.ts` còn **empty**.

#### StaffService _(Pattern A)_
```typescript
StaffService.useStaffList(payload)
StaffService.useStaffDetail(payload)
StaffService.useStaffCreate()
StaffService.useStaffUpdate()
StaffService.useUpsertStaff()
StaffService.useStaffDelete()
StaffService.useStaffExport()
```

> `department.service.ts`, `job-role.service.ts`, `work-schedule.service.ts` còn **empty**.

---

### 4. Finance

#### InvoiceService _(Pattern A)_
```typescript
InvoiceService.useInvoiceList(payload)
InvoiceService.useInvoiceDetail(payload)
InvoiceService.useInvoiceCreate()
InvoiceService.useInvoiceUpdate()
InvoiceService.useUpsertInvoice()
InvoiceService.useInvoiceDelete()
InvoiceService.useInvoiceExport()
```

> `invoice-item.service.ts`, `invoice-status.service.ts`, `invoice-adjustment.service.ts` còn **empty**.

#### PaymentService _(Pattern A)_
```typescript
PaymentService.usePaymentList(payload)
PaymentService.usePaymentDetail(payload)
PaymentService.usePaymentCreate()
PaymentService.usePaymentUpdate()
PaymentService.useUpsertPayment()
PaymentService.usePaymentDelete()
PaymentService.usePaymentExport()
```

> `payment-method.service.ts`, `payment-transaction.service.ts` còn **empty**.

#### RefundService _(Pattern A)_
```typescript
RefundService.useRefundList(payload)
RefundService.useRefundDetail(payload)
RefundService.useRefundCreate()
RefundService.useRefundUpdate()
RefundService.useUpsertRefund()
RefundService.useRefundDelete()
RefundService.useRefundExport()
```

#### DebtService _(Pattern A)_
```typescript
DebtService.useDebtList(payload)
DebtService.useDebtDetail(payload)
DebtService.useDebtCreate()
DebtService.useDebtUpdate()
DebtService.useUpsertDebt()
DebtService.useDebtDelete()
DebtService.useDebtExport()
```

> `debt-aging.service.ts`, `debt-reminder.service.ts` còn **empty**.

#### DiscountService _(Pattern A)_
```typescript
DiscountService.useDiscountList(payload)
DiscountService.useDiscountDetail(payload)
DiscountService.useDiscountCreate()
DiscountService.useDiscountUpdate()
DiscountService.useUpsertDiscount()
DiscountService.useDiscountDelete()
DiscountService.useDiscountExport()
```

> `coupon.service.ts`, `discount-rule.service.ts`, `promotion-campaign.service.ts` còn **empty**.

---

### 5. Wallet

#### WalletService _(Pattern A)_
```typescript
WalletService.useWalletList(payload)
WalletService.useWalletDetail(payload)
WalletService.useWalletCreate()
WalletService.useWalletUpdate()
WalletService.useUpsertWallet()
WalletService.useWalletDelete()
WalletService.useWalletExport()
```

#### WalletTransactionService _(Pattern A)_
```typescript
WalletTransactionService.useWalletTransactionList(payload)
WalletTransactionService.useWalletTransactionDetail(payload)
WalletTransactionService.useWalletTransactionCreate()
WalletTransactionService.useWalletTransactionUpdate()
WalletTransactionService.useUpsertWalletTransaction()
WalletTransactionService.useWalletTransactionDelete()
WalletTransactionService.useWalletTransactionExport()
```

> Folder `wallet/transaction/` (wallet-topup, wallet-deduction, wallet-refund) còn **empty**.

---

### 6. Notification

#### NotificationService _(Pattern A)_
```typescript
NotificationService.useNotificationList(payload)
NotificationService.useNotificationDetail(payload)
NotificationService.useNotificationCreate()
NotificationService.useNotificationUpdate()
NotificationService.useUpsertNotification()
NotificationService.useNotificationDelete()
NotificationService.useNotificationExport()
```

> `notification-queue.service.ts`, `notification-read.service.ts` còn **empty**.

#### TemplateService _(Pattern A)_
```typescript
TemplateService.useTemplateList(payload)
TemplateService.useTemplateDetail(payload)
TemplateService.useTemplateCreate()
TemplateService.useTemplateUpdate()
TemplateService.useUpsertTemplate()
TemplateService.useTemplateDelete()
TemplateService.useTemplateExport()
```

> `notification-template.service.ts`, `notification-channel.service.ts` còn **empty**.

---

### 7. System

#### AuthService _(Pattern A)_
```typescript
AuthService.useAuthList(payload)
AuthService.useAuthDetail(payload)
AuthService.useAuthCreate()
AuthService.useAuthUpdate()
AuthService.useUpsertAuth()
AuthService.useAuthDelete()
AuthService.useAuthExport()
```

#### UserService _(Pattern A)_
```typescript
UserService.useUserList(payload)
UserService.useUserDetail(payload)
UserService.useUserCreate()
UserService.useUserUpdate()
UserService.useUpsertUser()
UserService.useUserDelete()
UserService.useUserExport()
```

> `profile.service.ts` còn **empty**.

#### BusinessService _(Pattern A)_
```typescript
BusinessService.useBusinessList(payload)
BusinessService.useBusinessDetail(payload)
BusinessService.useBusinessCreate()
BusinessService.useBusinessUpdate()
BusinessService.useUpsertBusiness()
BusinessService.useBusinessDelete()
BusinessService.useBusinessExport()
```

#### BranchService _(Pattern B)_
```typescript
BranchService.useBranchList(payload)
BranchService.useBranchDetail(payload)
BranchService.useBranchCreate()
BranchService.useBranchUpdate()
BranchService.useUpsertBranch()
BranchService.useBranchDelete()
```

#### RoleService / PermissionService / SettingService / AuditService _(Pattern A)_

Tất cả đều theo Pattern A tiêu chuẩn với prefix tương ứng: `Role`, `Permission`, `Setting`, `Audit`.

---

### 8. Reporting

Tất cả 6 service báo cáo đều theo **Pattern A** đầy đủ (List, Detail, Create, Update, Upsert, Delete, Export).

| Service | Query Key |
|---|---|
| `AttendanceReportService` | `["attendance-report", ...]` |
| `RevenueReportService` | `["revenue-report", ...]` |
| `LeadConversionReportService` | `["lead-conversion-report", ...]` |
| `StudentProgressReportService` | `["student-progress-report", ...]` |
| `ClassUtilizationReportService` | `["class-utilization-report", ...]` |
| `TeacherPerformanceReportService` | `["teacher-performance-report", ...]` |

---

## Cách sử dụng trong Component

### Query — đọc dữ liệu

```typescript
import { useStudentList, useStudentDetail } from "@tera/modules";

function StudentListPage() {
  const [filters, setFilters] = useState({});

  // Tự động fetch, refetch khi filters thay đổi
  const { data, isLoading, isFetching } = useStudentList({
    params: { filters, page: 1, pageSize: 20 },
  });

  return <Table data={data?.data} loading={isLoading} />;
}

function StudentDetailPage({ id }: { id: string }) {
  // Chỉ chạy khi id có giá trị (enabled: !!payload.id)
  const { data, isLoading } = useStudentDetail({ id });

  return <Form defaultValues={data?.data} />;
}
```

### Mutation — ghi dữ liệu

```typescript
import { useUpsertStudent, useStudentDelete, useStudentSuspend } from "@tera/modules";

function StudentForm({ id }: { id?: string }) {
  const { mutate: upsert, isLoading } = useUpsertStudent();
  const { mutate: remove } = useStudentDelete();
  const { mutate: suspend } = useStudentSuspend();

  const onSubmit = (values) => {
    // Tự động create nếu không có id, update nếu có id
    upsert(
      { id, params: values },
      {
        onSuccess: () => toast.success("Lưu thành công"),
        onError: (err) => toast.error("Lỗi: " + err.message),
      }
    );
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

### Export — tải file

```typescript
import { useStudentExport } from "@tera/modules";

function ExportButton({ filters }) {
  const { mutate: doExport, isLoading } = useStudentExport();

  return (
    <Button
      loading={isLoading}
      onClick={() => doExport({ params: { filters } })}
    >
      Xuất Excel
    </Button>
  );
  // onSuccess tự động gọi window.open(res.data.link, "_blank")
}
```

### ClassSchedule — query có điều kiện

```typescript
import { ClassScheduleService } from "@tera/modules";

function ClassSchedulePanel({ classId }: { classId?: string }) {
  const { data } = ClassScheduleService.useClassScheduleList(
    { params: { class_id: classId } },
    { enabled: !!classId }  // chỉ fetch khi classId tồn tại
  );

  return <ScheduleTable data={data?.data} />;
}
```

### Teacher Certificate — sub-resource

```typescript
import { TeacherService } from "@tera/modules";

function TeacherCertificates({ teacherId }: { teacherId: string }) {
  const { data } = TeacherService.useTeacherCertificateList({ id: teacherId });
  const { mutate: addCert } = TeacherService.useTeacherCertificateCreate();
  const { mutate: removeCert } = TeacherService.useTeacherCertificateDelete();

  return (
    <CertificateList
      items={data?.data}
      onAdd={(params) => addCert({ id: teacherId, params })}
      onRemove={(id) => removeCert({ id })}
    />
  );
}
```

---

## Cache Invalidation Strategy

Mỗi mutation tự động invalidate React Query cache sau khi thành công:

| Mutation | Invalidate |
|---|---|
| create / update / delete / export | `[entity, "list"]` |
| suspend / restore / resign | `[entity, "list"]` + `[entity, "detail"]` |
| certificate create/update/delete | `["teacher", "certificate", "list"]` |

> **Lưu ý bug:** Một số `useUpsertXxx` invalidate sai key `["student", "list"]` thay vì key của entity đang xử lý. Cần sửa khi implement thực tế.

---

## Thống kê

| Domain | Tổng service | Implemented | Empty (TODO) |
|---|---|---|---|
| System | 9 | 8 | 1 (profile) |
| CRM | 6 | 4 | 2 (lead-pipeline, lead-activity) |
| Education | 19 | 10 | 9 |
| HR | 9 | 2 | 7 |
| Finance | 12 | 5 | 7 |
| Wallet | 7 | 2 | 5 |
| Notification | 6 | 2 | 4 |
| Reporting | 6 | 6 | 0 |
| **Tổng** | **74** | **39** | **35** |

| Pattern | Số lượng service | Đặc điểm |
|---|---|---|
| A — Standard CRUD + Export | ~30 | 7 hooks: List, Detail, Create, Update, Upsert, Delete, Export |
| B — CRUD không Export | 4 | 5 hooks, một số không có Upsert |
| C — CRUD + Export + Suspend/Restore | 3 | 9 hooks (Student, ClassRoom, Parent) |
| D — Full + Certificate | 1 | 14 hooks (Teacher only) |
