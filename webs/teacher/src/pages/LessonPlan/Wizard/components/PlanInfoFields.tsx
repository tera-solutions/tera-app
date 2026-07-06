import { useRef, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { notification, UserOutlined } from "tera-dls";

import Input from "@tera/components/dof/Control/Input";
import TextArea from "@tera/components/dof/Control/TextArea";
import { FormTeraItem } from "@tera/components/dof/FormTera";
import { REGEX } from "@tera/commons/constants/common";
import { FileAPI, stripExtension } from "@tera/api/common/FileAPI";

import CourseSelect from "_common/components/CourseSelect";
import LevelSelect from "_common/components/LevelSelect";

import type { LessonPlanFormValues } from "../../_interface";

interface PlanInfoFieldsProps {
  form: UseFormReturn<LessonPlanFormValues>;
  /** Code and course are immutable once the plan exists. */
  disableImmutable?: boolean;
}

/** Plan-info form body (code/name/avatar/course/level/description), shared by the create and edit wizards. */
const PlanInfoFields = ({ form, disableImmutable }: PlanInfoFieldsProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarValue = form.watch("avatar");

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

  return (
    <>
      <div className="mb-3 flex flex-col items-center gap-2">
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          className="group relative h-20 w-20 cursor-pointer overflow-hidden rounded-full border border-slate-200 bg-slate-50"
        >
          {avatarValue ? (
            <img src={avatarValue} alt="avatar" className="h-full w-full object-cover" />
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
              minLength: { value: 2, message: "Mã giáo án phải có ít nhất 2 ký tự" },
              maxLength: {
                value: 50,
                message: "Mã giáo án không được vượt quá 50 ký tự",
              },
            },
          ]}
        >
          <Input placeholder="Ví dụ: LP001" maxLength={50} disabled={disableImmutable} />
        </FormTeraItem>

        <FormTeraItem
          label="Tên giáo án"
          name="plan_name"
          rules={[
            {
              required: "Vui lòng nhập tên giáo án",
              minLength: { value: 2, message: "Tên giáo án phải có ít nhất 2 ký tự" },
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
                disabled={disableImmutable}
              />
            )}
          />
        </FormTeraItem>

        <FormTeraItem label="Cấp độ" name="level_id">
          <Controller
            control={form.control}
            name="level_id"
            render={({ field }) => (
              <LevelSelect value={field.value} onChange={field.onChange} allowClear />
            )}
          />
        </FormTeraItem>
      </div>

      <FormTeraItem label="Mô tả" name="description">
        <TextArea placeholder="Mô tả giáo án" rows={4} maxLength={2000} />
      </FormTeraItem>
    </>
  );
};

export default PlanInfoFields;
