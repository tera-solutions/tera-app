import { Controller, UseFormReturn } from "react-hook-form";

import Input from "@tera/components/dof/Control/Input";
import TextArea from "@tera/components/dof/Control/TextArea";
import { FormTeraItem } from "@tera/components/dof/FormTera";
import { REGEX } from "@tera/commons/constants/common";

import AvatarUpload from "_common/components/AvatarUpload";
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
  const avatarValue = form.watch("avatar");

  return (
    <>
      <div className="mb-3 flex flex-col items-center gap-2">
        <AvatarUpload
          src={avatarValue}
          alt={form.watch("plan_name")}
          uploadTitlePrefix="avatar"
          onUploaded={(url) => form.setValue("avatar", url, { shouldDirty: true })}
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
