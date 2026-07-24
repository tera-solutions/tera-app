import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AcademicCapOutlined,
  BanknotesOutlined,
  BookOpenOutlined,
  Button,
  Checkbox,
  ClockOutlined,
  HashtagOutlined,
  Input,
  InputNumber,
  InformationCircleOutlined,
  notification,
  PlusOutlined,
  Select,
  TextArea,
  TrashOutlined,
} from "tera-dls";

import Breadcrumb from "_common/components/Breadcrumb";
import Card from "_common/components/Card";
import FieldLabel from "_common/components/FieldLabel";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { useMeta } from "_common/hooks/useMeta";
import { CourseCurriculumService, CourseService } from "@tera/modules/education";

interface CurriculumDraftRow {
  title: string;
  content: string;
}

const emptyCurriculumRow: CurriculumDraftRow = { title: "", content: "" };

const empty = {
  name: "",
  title: "",
  code: "",
  duration_minutes: "60",
  price_per_lesson: "0",
  tuition_type: "per_lesson",
  description: "",
  is_active: true,
};

const formatVnd = (v: number | string) => `${Number(v || 0).toLocaleString("vi-VN")} ₫`;

const SectionTitle = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-brand [&_svg]:h-4.5 [&_svg]:w-4.5">
      {icon}
    </span>
    <p className="text-sm font-semibold text-slate-700">{children}</p>
  </div>
);

const CourseCreate = () => {
  const navigate = useNavigate();
  const { getOptions } = useMeta();

  const { mutate: create, isPending: creating } = CourseService.useCourseCreate();
  const { mutateAsync: createCurriculum } = CourseCurriculumService.useCourseCurriculumCreate();

  const [form, setForm] = useState(empty);
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  const [curriculum, setCurriculum] = useState<CurriculumDraftRow[]>([{ ...emptyCurriculumRow }]);
  const [savingCurriculum, setSavingCurriculum] = useState(false);
  const addCurriculumRow = () => setCurriculum((prev) => [...prev, { ...emptyCurriculumRow }]);
  const removeCurriculumRow = (index: number) =>
    setCurriculum((prev) => prev.filter((_, i) => i !== index));
  const updateCurriculumRow = (index: number, patch: Partial<CurriculumDraftRow>) =>
    setCurriculum((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));

  const tuitionLabel =
    getOptions("course_tuition_type").find((o) => o.value === form.tuition_type)?.label ?? "";
  const filledCurriculum = curriculum.filter((row) => row.title.trim());

  const handleSubmit = () => {
    if (!form.name.trim()) {
      notification.warning({ message: "Vui lòng nhập tên khóa học" });
      return;
    }

    const params: Record<string, unknown> = {
      name: form.name.trim(),
      title: form.title.trim() || null,
      duration_minutes: Number(form.duration_minutes || 0),
      price_per_lesson: Number(form.price_per_lesson || 0),
      tuition_type: form.tuition_type,
      description: form.description.trim() || null,
      is_active: form.is_active,
      code: form.code.trim() ? form.code.trim().toUpperCase() : undefined,
    };

    const curriculumRows = curriculum.filter((row) => row.title.trim());

    create(
      { params },
      {
        onSuccess: async (res: any) => {
          const newCourseId = res?.data?.id;
          if (newCourseId && curriculumRows.length > 0) {
            setSavingCurriculum(true);
            try {
              for (let i = 0; i < curriculumRows.length; i += 1) {
                await createCurriculum({
                  params: {
                    course_id: newCourseId,
                    title: curriculumRows[i].title.trim(),
                    content: curriculumRows[i].content.trim() || undefined,
                    order: i + 1,
                  },
                });
              }
            } catch (e: any) {
              notification.error({
                message: e?.data?.msg ?? e?.message ?? "Không thể lưu chương trình học",
              });
            } finally {
              setSavingCurriculum(false);
            }
          }
          notification.success({ message: "Đã tạo khóa học" });
          navigate(PATHS.courses);
        },
        onError: (e: any) =>
          notification.error({ message: e?.data?.msg?.message ?? e?.data?.msg ?? "Không thể lưu khóa học" }),
      },
    );
  };

  return (
    <div className="p-4 xmd:p-6">
      <Breadcrumb
        items={[
          { label: "Khóa học", onClick: () => navigate(PATHS.courses) },
          { label: "Tạo khóa học" },
        ]}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Tạo khóa học</h1>
          <p className="mt-0.5 text-sm text-slate-400">Thiết lập thông tin và chương trình học cho khóa học mới.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button outlined onClick={() => navigate(PATHS.courses)} className="text-slate-600 border-slate-300 hover:bg-slate-50">
            Hủy
          </Button>
          <Button onClick={handleSubmit} loading={creating || savingCurriculum} className="bg-brand hover:bg-brand/80">
            Lưu khóa học
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[1fr_340px]">
        <Card>
          <SectionTitle icon={<InformationCircleOutlined />}>Thông tin cơ bản</SectionTitle>
          <div className="space-y-3">
            <div>
              <FieldLabel required>Tên khóa học</FieldLabel>
              <Input
                placeholder="VD: IELTS Foundation"
                value={form.name}
                onChange={(e) => set({ name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <FieldLabel>Tiêu đề hiển thị</FieldLabel>
                <Input
                  placeholder="Tên rút gọn hiển thị cho học viên"
                  value={form.title}
                  onChange={(e) => set({ title: e.target.value })}
                />
              </div>
              <div>
                <FieldLabel>Mã khóa học</FieldLabel>
                <Input
                  value={form.code}
                  onChange={(e) => set({ code: e.target.value.toUpperCase() })}
                  placeholder="Để trống để tự sinh mã"
                />
              </div>
            </div>
            <p className="-mt-1.5 text-xs text-slate-400">
              Mã khóa học chỉ chấp nhận chữ A-Z, số 0-9 và dấu gạch dưới — bỏ trống để hệ thống tự sinh.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel required>Thời lượng (phút)</FieldLabel>
                <InputNumber
                  min={1}
                  className="w-full"
                  value={form.duration_minutes ? Number(form.duration_minutes) : undefined}
                  onChange={(v) => set({ duration_minutes: v == null ? "" : String(v) })}
                />
              </div>
              <div>
                <FieldLabel required>Học phí / buổi (₫)</FieldLabel>
                <InputNumber
                  min={0}
                  className="w-full"
                  value={form.price_per_lesson ? Number(form.price_per_lesson) : undefined}
                  onChange={(v) => set({ price_per_lesson: v == null ? "" : String(v) })}
                />
              </div>
            </div>
            <div>
              <FieldLabel>Loại học phí</FieldLabel>
              <Select
                value={form.tuition_type}
                options={getOptions("course_tuition_type").map((o) => ({ value: o.value, label: o.label }))}
                onChange={(v: any) => set({ tuition_type: v })}
              />
            </div>
            <div>
              <FieldLabel>Mô tả</FieldLabel>
              <TextArea
                className="w-full"
                rows={3}
                placeholder="Giới thiệu ngắn gọn về khóa học..."
                value={form.description}
                onChange={(e) => set({ description: e.target.value })}
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-100 p-3">
              <Checkbox checked={form.is_active} onChange={(e) => set({ is_active: e.target.checked })} />
              <div>
                <p className="text-sm font-medium text-slate-700">Mở khóa học ngay</p>
                <p className="text-xs text-slate-400">Cho phép ghi danh học viên ngay sau khi tạo.</p>
              </div>
            </label>
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <SectionTitle icon={<AcademicCapOutlined />}>Xem trước</SectionTitle>
            <div className="rounded-xl border border-slate-100 p-3">
              <p className="truncate font-semibold text-slate-800">{form.name || "Tên khóa học"}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                <HashtagOutlined className="h-3.5 w-3.5" />
                {form.code || "Tự sinh"}
              </p>
              <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <ClockOutlined className="h-4 w-4 text-slate-400" />
                  {form.duration_minutes || 0} phút / buổi
                </div>
                <div className="flex items-center gap-2">
                  <BanknotesOutlined className="h-4 w-4 text-slate-400" />
                  {formatVnd(form.price_per_lesson)}
                  {tuitionLabel ? ` — ${tuitionLabel}` : ""}
                </div>
              </div>
              <span
                className={`mt-3 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  form.is_active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                }`}
              >
                {form.is_active ? "Đang mở" : "Đóng"}
              </span>
            </div>
          </Card>

          <Card>
            <SectionTitle icon={<BookOpenOutlined />}>Chương trình học</SectionTitle>
            <div className="flex flex-col gap-3">
              {curriculum.map((row, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-semibold text-brand">
                    {index + 1}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <Input
                      placeholder="Tiêu đề, VD: Nghe hiểu cơ bản"
                      value={row.title}
                      onChange={(e) => updateCurriculumRow(index, { title: e.target.value })}
                    />
                    <TextArea
                      className="w-full"
                      rows={2}
                      placeholder="Nội dung chi tiết (tùy chọn)"
                      value={row.content}
                      onChange={(e) => updateCurriculumRow(index, { content: e.target.value })}
                    />
                  </div>
                  <button
                    type="button"
                    title="Xóa"
                    onClick={() => removeCurriculumRow(index)}
                    disabled={curriculum.length === 1}
                    className="mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 disabled:cursor-not-allowed disabled:text-slate-200 disabled:hover:bg-transparent [&_svg]:h-4 [&_svg]:w-4"
                  >
                    <TrashOutlined />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addCurriculumRow}
                className="flex w-fit items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-brand hover:bg-sky-50 [&_svg]:h-3.5 [&_svg]:w-3.5"
              >
                <PlusOutlined />
                Thêm nội dung
              </button>
            </div>
            <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-400">
              {filledCurriculum.length > 0
                ? `${filledCurriculum.length} nội dung sẽ được lưu — hiển thị ở trang chi tiết khóa học.`
                : "Không bắt buộc. Bỏ trống tiêu đề để không lưu dòng đó."}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseCreate;
