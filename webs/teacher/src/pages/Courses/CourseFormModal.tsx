import { useEffect, useState } from "react";
import { Checkbox, Input, InputNumber, notification, PlusOutlined, TextArea, TrashOutlined } from "tera-dls";

import { CourseCurriculumService, CourseService } from "@tera/modules/education";
import FormScaff from "@tera/components/dof/FormScaff";
import FieldLabel from "_common/components/FieldLabel";

interface CurriculumDraftRow {
  title: string;
  content: string;
}

const emptyCurriculumRow: CurriculumDraftRow = { title: "", content: "" };

export interface CourseRow {
  id: number;
  code: string;
  name: string;
  duration_minutes: number | string;
  price_per_lesson: number | string;
  description?: string | null;
  is_active?: boolean;
}

interface Props {
  open: boolean;
  course: CourseRow | null;
  onClose: () => void;
}

const empty = {
  name: "",
  code: "",
  duration_minutes: "60",
  price_per_lesson: "0",
  description: "",
  is_active: true,
};

const CourseFormModal = ({ open, course, onClose }: Props) => {
  const isEdit = !!course;
  const { mutate: create, isPending: creating } = CourseService.useCourseCreate();
  const { mutate: update, isPending: updating } = CourseService.useCourseUpdate();
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

  useEffect(() => {
    if (!open) return;
    if (course) {
      setForm({
        name: course.name ?? "",
        code: course.code ?? "",
        duration_minutes: String(course.duration_minutes ?? 60),
        price_per_lesson: String(course.price_per_lesson ?? 0),
        description: course.description ?? "",
        is_active: course.is_active ?? true,
      });
    } else {
      setForm(empty);
      setCurriculum([{ ...emptyCurriculumRow }]);
    }
  }, [open, course]);

  const handleSubmit = () => {
    if (!form.name.trim()) {
      notification.warning({ message: "Vui lòng nhập tên khóa học" });
      return;
    }
    const params: Record<string, unknown> = {
      name: form.name.trim(),
      duration_minutes: Number(form.duration_minutes || 0),
      price_per_lesson: Number(form.price_per_lesson || 0),
      description: form.description.trim() || null,
      is_active: form.is_active,
    };

    if (isEdit && course) {
      update(
        { id: course.id, params },
        {
          onSuccess: () => {
            notification.success({ message: "Đã cập nhật khóa học" });
            onClose();
          },
          onError: (e: any) =>
            notification.error({ message: e?.data?.msg?.message ?? e?.data?.msg ?? "Không thể lưu khóa học" }),
        },
      );
      return;
    }

    if (!form.code.trim()) {
      notification.warning({ message: "Vui lòng nhập mã khóa học" });
      return;
    }
    const curriculumRows = curriculum.filter((row) => row.title.trim());

    create(
      { params: { ...params, code: form.code.trim().toUpperCase() } },
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
          onClose();
        },
        onError: (e: any) =>
          notification.error({ message: e?.data?.msg?.message ?? e?.data?.msg ?? "Không thể lưu khóa học" }),
      },
    );
  };

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit={isEdit}
      titleCreate="Tạo khóa học"
      titleEdit="Sửa khóa học"
      className="!w-[95%] xmd:!w-[540px]"
      confirmLoading={creating || updating || savingCurriculum}
      onOk={handleSubmit}
    >
      <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
        <div>
          <FieldLabel required>Tên khóa học</FieldLabel>
          <Input value={form.name} onChange={(e) => set({ name: e.target.value })} />
        </div>
        {!isEdit && (
          <div>
            <FieldLabel required>Mã khóa học</FieldLabel>
            <Input
              value={form.code}
              onChange={(e) => set({ code: e.target.value.toUpperCase() })}
              placeholder="IELTS_FOUNDATION"
            />
            <p className="mt-1 text-xs text-slate-400">Chỉ dùng chữ A-Z, số 0-9 và dấu gạch dưới.</p>
          </div>
        )}
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
          <FieldLabel>Mô tả</FieldLabel>
          <TextArea
            className="w-full"
            rows={3}
            value={form.description}
            onChange={(e) => set({ description: e.target.value })}
          />
        </div>
        <Checkbox
          checked={form.is_active}
          onChange={(e) => set({ is_active: e.target.checked })}
        >
          <p className="mb-1 block text-xs font-medium text-slate-500">Đang mở</p>
        </Checkbox>

        {!isEdit && (
          <div className="border-t border-slate-100 pt-3">
            <FieldLabel>Chương trình học (không bắt buộc)</FieldLabel>
            <div className="flex flex-col gap-2">
              {curriculum.map((row, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-semibold text-brand">
                    {index + 1}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <Input
                      placeholder="Tiêu đề, VD: Nghe hiểu — Listening comprehension"
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
            <p className="mt-1 text-xs text-slate-400">
              Chương trình học sẽ hiển thị ở trang chi tiết khóa học. Bỏ trống tiêu đề để không lưu
              dòng đó.
            </p>
          </div>
        )}
      </div>
    </FormScaff>
  );
};

export default CourseFormModal;
