import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";
import { Modal, notification, Select } from "tera-dls";

import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import Input from "@tera/components/dof/Control/Input";
import InputNumber from "@tera/components/dof/Control/InputNumber";
import TextArea from "@tera/components/dof/Control/TextArea";
import DatePicker from "@tera/components/dof/Control/DatePicker";

import ClassroomSelect from "_common/components/ClassroomSelect";
import LevelSelect from "_common/components/LevelSelect";
import { useMeta } from "_common/hooks/useMeta";

import type { Homework, HomeworkFormValues } from "../_interface";
import { ASSIGNMENT_TYPE_META, DEFAULT_FORM_VALUES } from "../constants";
import { AssignmentService } from "@tera/modules/education";

interface HomeworkFormProps {
  open: boolean;
  onClose: () => void;
  editingItem: Homework | null;
}

const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";

const HomeworkForm = ({ open, onClose, editingItem }: HomeworkFormProps) => {
  const { getOptions } = useMeta();
  const form = useForm<HomeworkFormValues>({
    mode: "onChange",
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(
      editingItem
        ? {
            assignment_name: editingItem.name,
            assignment_type: editingItem.type || "homework",
            instruction: "",
            due_date: editingItem.due_date,
            max_score: editingItem.max_score || 10,
            class_room_id: editingItem.class_id ?? undefined,
            level_id: editingItem.level_id ?? undefined,
          }
        : DEFAULT_FORM_VALUES,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editingItem]);

  const { mutate: createAssignment, isPending: isCreating } =
    AssignmentService.useAssignmentCreate();
  const { mutate: updateAssignment, isPending: isUpdating } =
    AssignmentService.useAssignmentUpdate();
  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = (values: HomeworkFormValues) => {
    const basePayload = {
      assignment_name: values.assignment_name,
      assignment_type: values.assignment_type,
      instruction: values.instruction,
      max_score: values.max_score,
      due_date: values.due_date,
    };
    const assignPayload = {
      class_room_id: values.class_room_id,
      level_id: values.level_id,
    };

    if (editingItem) {
      updateAssignment(
        { id: editingItem.id, params: { ...basePayload, ...assignPayload } },
        {
          onSuccess: () => {
            notification.success({ message: "Cập nhật bài tập thành công" });
            onClose();
          },
          onError: (error: any) => {
            notification.error({
              message: error?.data?.msg ?? error?.message ?? "Không thể cập nhật bài tập",
            });
          },
        },
      );
      return;
    }

    // Backend creates the assignment with base fields only, then the class/level
    // scope is set via a follow-up update (assignment.md §VI).
    createAssignment(
      { params: basePayload },
      {
        onSuccess: (res: any) => {
          const newId = res?.data?.id;
          if (newId && (values.class_room_id || values.level_id)) {
            updateAssignment({ id: newId, params: assignPayload });
          }
          notification.success({ message: "Tạo bài tập thành công" });
          onClose();
        },
        onError: (error: any) => {
          notification.error({
            message: error?.data?.msg ?? error?.message ?? "Không thể tạo bài tập",
          });
        },
      },
    );
  };

  return (
    <Modal
      title={editingItem ? "Sửa bài tập" : "Tạo bài tập"}
      open={open}
      className="!w-[95%] xmd:!w-[560px]"
      okText="Lưu"
      cancelText="Hủy"
      onCancel={onClose}
      onOk={() => form.handleSubmit(handleSubmit)()}
      destroyOnClose
      confirmLoading={isSubmitting}
    >
      <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
        <FormTeraItem
          label="Tên bài tập"
          name="assignment_name"
          rules={[{ required: "Vui lòng nhập tên bài tập" }]}
        >
          <Input placeholder="VD: Write the missing letters" />
        </FormTeraItem>

        <FormTeraItem label="Loại bài tập" name="assignment_type">
          <Controller
            control={form.control}
            name="assignment_type"
            render={({ field }) => (
              <Select value={field.value} options={getOptions(ASSIGNMENT_TYPE_META)} onChange={field.onChange} />
            )}
          />
        </FormTeraItem>

        <FormTeraItem label="Lớp áp dụng" name="class_room_id">
          <Controller
            control={form.control}
            name="class_room_id"
            render={({ field }) => (
              <ClassroomSelect
                value={field.value}
                onChange={(value) => field.onChange(value != null ? Number(value) : undefined)}
                allowClear
              />
            )}
          />
        </FormTeraItem>

        <FormTeraItem label="Hạng thứ" name="level_id">
          <Controller
            control={form.control}
            name="level_id"
            render={({ field }) => (
              <LevelSelect
                value={field.value}
                onChange={(value) => field.onChange(value != null ? Number(value) : undefined)}
                allowClear
              />
            )}
          />
        </FormTeraItem>

        <FormTeraItem
          label="Mô tả/yêu cầu"
          name="instruction"
          rules={[{ required: "Vui lòng nhập mô tả bài tập" }]}
        >
          <TextArea placeholder="Hướng dẫn cho học viên..." rows={4} />
        </FormTeraItem>

        <FormTeraItem
          label="Hạn nộp"
          name="due_date"
          rules={[{ required: "Vui lòng chọn hạn nộp" }]}
        >
          <Controller
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <DatePicker
                showTime
                format={DATE_FORMAT}
                value={field.value ? moment(field.value) : undefined}
                onChange={(value: any) =>
                  field.onChange(value ? moment(value).format(DATE_FORMAT) : "")
                }
                placeholder="Chọn hạn nộp"
              />
            )}
          />
        </FormTeraItem>

        <FormTeraItem
          label="Điểm tối đa"
          name="max_score"
          rules={[{ required: "Vui lòng nhập điểm tối đa" }]}
        >
          <InputNumber min={1} />
        </FormTeraItem>
      </FormTera>
    </Modal>
  );
};

export default HomeworkForm;
