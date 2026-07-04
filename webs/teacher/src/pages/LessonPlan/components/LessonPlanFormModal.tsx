import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { observer } from "mobx-react-lite";
import { Modal, notification, Spin, UserOutlined } from "tera-dls";

import Input from "@tera/components/dof/Control/Input";
import TextArea from "@tera/components/dof/Control/TextArea";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import { REGEX } from "@tera/commons/constants/common";
import { LessonPlanService } from "@tera/modules/education";
import { FileAPI, stripExtension } from "@tera/api/common/FileAPI";

import CourseSelect from "_common/components/CourseSelect";
import LevelSelect from "_common/components/LevelSelect";

import type { LessonPlan, LessonPlanFormValues } from "../_interface";

interface LessonPlanFormModalProps {
  open: boolean;
  editing: LessonPlan | null;
  onClose: () => void;
  onSuccess: () => void;
}

const LessonPlanFormModal = observer(({
  open,
  editing,
  onClose,
  onSuccess,
}: LessonPlanFormModalProps) => {
  const form = useForm<LessonPlanFormValues>({ mode: "onChange" });
  const isEdit = !!editing;

  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarValue = form.watch("avatar");

  const { mutate: upsert, isPending } = LessonPlanService.useUpsertLessonPlan();

  useEffect(() => {
    if (!open) return;
    form.reset({
      plan_code: editing?.plan_code ?? "",
      plan_name: editing?.plan_name ?? "",
      avatar: editing?.avatar ?? "",
      course_id: editing?.course_id ?? null,
      level_id: editing?.level_id ?? null,
      description: editing?.description ?? "",
    });
  }, [open, editing]);

  const handleUploadAvatar = async (file?: File) => {
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      const uploaded = await FileAPI.upload(file, {
        title: `avatar-${stripExtension(file.name)}`,
      });
      form.setValue("avatar", uploaded.url, { shouldDirty: true });
    } catch (err: any) {
      notification.error({
        message: err?.msg ?? err?.message ?? "Tải ảnh đại diện thất bại",
      });
    } finally {
      setIsUploadingAvatar(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleSubmit = (values: LessonPlanFormValues) => {
    // Update rejects `course_id` (immutable once created) — only send it on create.
    const params: Record<string, unknown> = {
      plan_code: values.plan_code,
      plan_name: values.plan_name,
      avatar: values.avatar || undefined,
      level_id: values.level_id || undefined,
      description: values.description ?? "",
      ...(isEdit ? {} : { course_id: values.course_id }),
    };

    upsert(
      { id: editing?.id, params },
      {
        onSuccess: (res: any) => {
          notification.success({
            message: res?.msg ?? "Lưu giáo án thành công",
          });
          onSuccess();
          onClose();
        },
        onError: (err: any) => {
          notification.error({
            message: err?.msg ?? err?.message ?? "Lưu giáo án thất bại",
          });
        },
      },
    );
  };

  return (
    <Modal
      title={isEdit ? "Sửa giáo án" : "Thêm giáo án"}
      open={open}
      width={680}
      centered
      okText="Lưu"
      cancelText="Hủy"
      onCancel={onClose}
      onOk={() => form.handleSubmit(handleSubmit)()}
      destroyOnClose
      confirmLoading={isPending}
    >
      <Spin spinning={isPending}>
        <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="mb-3 flex flex-col items-center gap-2">
            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              className="group relative h-20 w-20 cursor-pointer overflow-hidden rounded-full border border-slate-200 bg-slate-50"
            >
              {avatarValue ? (
                <img
                  src={avatarValue}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-slate-300 [&_svg]:h-8 [&_svg]:w-8">
                  <UserOutlined />
                </span>
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-center text-[11px] font-medium leading-tight text-white opacity-0 transition-opacity group-hover:opacity-100">
                {isUploadingAvatar ? "Đang tải..." : "Đổi ảnh"}
              </span>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleUploadAvatar(e.target.files?.[0])}
            />
          </div>

          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <FormTeraItem
              label="Mã giáo án"
              name="plan_code"
              rules={[
                {
                  required: "Vui lòng nhập mã giáo án",
                  pattern: {
                    value: REGEX.CODE,
                    message: "Mã giáo án chỉ được chứa chữ, số và dấu gạch dưới",
                  },
                  minLength: {
                    value: 2,
                    message: "Mã giáo án phải có ít nhất 2 ký tự",
                  },
                  maxLength: {
                    value: 50,
                    message: "Mã giáo án không được vượt quá 50 ký tự",
                  },
                },
              ]}
            >
              <Input placeholder="Ví dụ: LP001" maxLength={50} disabled={isEdit} />
            </FormTeraItem>

            <FormTeraItem
              label="Tên giáo án"
              name="plan_name"
              rules={[
                {
                  required: "Vui lòng nhập tên giáo án",
                  minLength: {
                    value: 2,
                    message: "Tên giáo án phải có ít nhất 2 ký tự",
                  },
                  maxLength: {
                    value: 255,
                    message: "Tên giáo án không được vượt quá 255 ký tự",
                  },
                },
              ]}
            >
              <Input placeholder="Vui lòng nhập tên giáo án" maxLength={255} />
            </FormTeraItem>
          </div>

          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <FormTeraItem
              label="Khóa học"
              name="course_id"
              rules={[{ required: "Vui lòng chọn khóa học" }]}
            >
              <Controller
                control={form.control}
                name="course_id"
                rules={{ required: "Vui lòng chọn khóa học" }}
                render={({ field }) => (
                  <CourseSelect
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isEdit}
                  />
                )}
              />
            </FormTeraItem>

            <FormTeraItem label="Cấp độ" name="level_id">
              <Controller
                control={form.control}
                name="level_id"
                render={({ field }) => (
                  <LevelSelect
                    value={field.value}
                    onChange={field.onChange}
                    allowClear
                  />
                )}
              />
            </FormTeraItem>
          </div>

          <FormTeraItem label="Mô tả" name="description">
            <TextArea placeholder="Mô tả giáo án" rows={4} maxLength={2000} />
          </FormTeraItem>
        </FormTera>
      </Spin>
    </Modal>
  );
});

export default LessonPlanFormModal;
