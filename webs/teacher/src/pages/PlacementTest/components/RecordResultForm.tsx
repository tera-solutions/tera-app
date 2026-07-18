import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { notification, Select } from "tera-dls";

import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import FormScaff from "@tera/components/dof/FormScaff";
import InputNumber from "@tera/components/dof/Control/InputNumber";
import { PlacementTestService } from "@tera/modules/education";
import StudentSelect from "_common/components/StudentSelect";

import type { PlacementTestRow } from "../_interface";
import { CEFR_LEVEL_OPTIONS } from "../constants";

interface RecordResultFormValues {
  student_id: number | string | undefined;
  score: number | undefined;
  cefr_result: string | undefined;
  completion_rate: number | undefined;
  status: "in_progress" | "completed";
}

const DEFAULT_VALUES: RecordResultFormValues = {
  student_id: undefined,
  score: undefined,
  cefr_result: undefined,
  completion_rate: 100,
  status: "completed",
};

const STATUS_OPTIONS = [
  { value: "completed", label: "Đã hoàn thành" },
  { value: "in_progress", label: "Đang làm" },
];

interface RecordResultFormProps {
  open: boolean;
  test: PlacementTestRow | null;
  onClose: () => void;
}

const RecordResultForm = ({ open, test, onClose }: RecordResultFormProps) => {
  const form = useForm<RecordResultFormValues>({ mode: "onChange", defaultValues: DEFAULT_VALUES });

  useEffect(() => {
    if (open) form.reset(DEFAULT_VALUES);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, test?.id]);

  const { mutate: recordResult, isPending } = PlacementTestService.usePlacementTestRecordResult();

  const handleClose = () => {
    form.reset(DEFAULT_VALUES);
    onClose();
  };

  const handleSubmit = (values: RecordResultFormValues) => {
    if (!test || !values.student_id) return;

    recordResult(
      {
        id: test.id,
        params: {
          student_id: values.student_id,
          score: values.score,
          cefr_result: values.cefr_result,
          completion_rate: values.completion_rate,
          status: values.status,
        },
      },
      {
        onSuccess: () => {
          notification.success({ message: "Ghi nhận kết quả thành công" });
          handleClose();
        },
        onError: (error: any) =>
          notification.error({ message: error?.data?.msg ?? "Không thể ghi nhận kết quả" }),
      },
    );
  };

  const title = `Ghi nhận kết quả${test ? ` — ${test.title}` : ""}`;

  return (
    <FormScaff
      open={open}
      onClose={handleClose}
      isEdit={false}
      titleCreate={title}
      titleEdit={title}
      className="!w-[95%] xmd:!w-[480px]"
      okText="Lưu"
      onOk={() => form.handleSubmit(handleSubmit)()}
      confirmLoading={isPending}
    >
      <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
        <FormTeraItem label="Học viên" name="student_id" rules={[{ required: "Vui lòng chọn học viên" }]}>
          <Controller
            control={form.control}
            name="student_id"
            render={({ field }) => <StudentSelect value={field.value} onChange={field.onChange} />}
          />
        </FormTeraItem>

        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <FormTeraItem label="Điểm số" name="score">
            <InputNumber min={0} className="w-full" />
          </FormTeraItem>
          <FormTeraItem label="Tỷ lệ hoàn thành (%)" name="completion_rate">
            <InputNumber min={0} max={100} className="w-full" />
          </FormTeraItem>
          <FormTeraItem label="Trình độ đạt được" name="cefr_result">
            <Controller
              control={form.control}
              name="cefr_result"
              render={({ field }) => (
                <Select value={field.value} onChange={field.onChange} options={CEFR_LEVEL_OPTIONS} allowClear />
              )}
            />
          </FormTeraItem>
          <FormTeraItem label="Trạng thái" name="status">
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onChange={field.onChange} options={STATUS_OPTIONS} />
              )}
            />
          </FormTeraItem>
        </div>
      </FormTera>
    </FormScaff>
  );
};

export default RecordResultForm;
