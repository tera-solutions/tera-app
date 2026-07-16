import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal, notification, Select } from "tera-dls";

import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import Input from "@tera/components/dof/Control/Input";
import TextArea from "@tera/components/dof/Control/TextArea";
import InputNumber from "@tera/components/dof/Control/InputNumber";
import { PlacementTestService } from "@tera/modules/education";

import type { PlacementTestRow } from "../_interface";
import { CEFR_LEVEL_OPTIONS, SKILL_OPTIONS } from "../constants";

interface PlacementTestFormValues {
  title: string;
  description?: string;
  cefr_level: string;
  skills: string[];
  question_count: number;
  duration_minutes: number;
}

interface PlacementTestFormProps {
  open: boolean;
  editing?: PlacementTestRow | null;
  onClose: () => void;
}

const DEFAULT_VALUES: PlacementTestFormValues = {
  title: "",
  description: "",
  cefr_level: "A1",
  skills: [],
  question_count: 30,
  duration_minutes: 45,
};

const PlacementTestForm = ({ open, editing, onClose }: PlacementTestFormProps) => {
  const form = useForm<PlacementTestFormValues>({ mode: "onChange", defaultValues: DEFAULT_VALUES });

  useEffect(() => {
    if (!open) return;
    if (editing) {
      form.reset({
        title: editing.title,
        description: editing.description ?? "",
        cefr_level: editing.cefrLevel ?? "A1",
        skills: editing.skills,
        question_count: editing.questionCount,
        duration_minutes: editing.durationMinutes,
      });
    } else {
      form.reset(DEFAULT_VALUES);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  const { mutate: createTest, isPending: isCreating } = PlacementTestService.usePlacementTestCreate();
  const { mutate: updateTest, isPending: isUpdating } = PlacementTestService.usePlacementTestUpdate();
  const isSubmitting = isCreating || isUpdating;

  const handleClose = () => {
    form.reset(DEFAULT_VALUES);
    onClose();
  };

  const handleSubmit = (values: PlacementTestFormValues) => {
    const params = { ...values, description: values.description || undefined };
    const onSuccess = () => {
      notification.success({ message: editing ? "Cập nhật bài kiểm tra thành công" : "Tạo bài kiểm tra thành công" });
      handleClose();
    };
    const onError = (error: any) =>
      notification.error({ message: error?.data?.msg ?? error?.message ?? "Không thể lưu bài kiểm tra" });

    if (editing) {
      updateTest({ id: editing.id, params }, { onSuccess, onError });
    } else {
      createTest({ params }, { onSuccess, onError });
    }
  };

  return (
    <Modal
      title={editing ? "Sửa bài kiểm tra" : "Tạo bài kiểm tra mới"}
      open={open}
      className="!w-[95%] xmd:!w-[560px]"
      okText="Lưu"
      cancelText="Hủy"
      onCancel={handleClose}
      onOk={() => form.handleSubmit(handleSubmit)()}
      destroyOnClose
      confirmLoading={isSubmitting}
    >
      <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
        <FormTeraItem label="Tên bài kiểm tra" name="title" rules={[{ required: "Vui lòng nhập tên bài kiểm tra" }]}>
          <Input placeholder="VD: Kiểm tra đầu vào Tiếng Anh A1" />
        </FormTeraItem>

        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <FormTeraItem label="Trình độ" name="cefr_level">
            <Controller
              control={form.control}
              name="cefr_level"
              render={({ field }) => (
                <Select value={field.value} onChange={field.onChange} options={CEFR_LEVEL_OPTIONS} />
              )}
            />
          </FormTeraItem>
          <FormTeraItem label="Kỹ năng" name="skills">
            <Controller
              control={form.control}
              name="skills"
              render={({ field }) => (
                <Select mode="multiple" value={field.value} onChange={field.onChange} options={SKILL_OPTIONS} />
              )}
            />
          </FormTeraItem>
          <FormTeraItem label="Số câu hỏi" name="question_count">
            <InputNumber min={0} className="w-full" />
          </FormTeraItem>
          <FormTeraItem label="Thời gian (phút)" name="duration_minutes">
            <InputNumber min={0} className="w-full" />
          </FormTeraItem>
        </div>

        <FormTeraItem label="Mô tả" name="description">
          <TextArea placeholder="Mô tả bài kiểm tra..." rows={3} />
        </FormTeraItem>
      </FormTera>
    </Modal>
  );
};

export default PlacementTestForm;
