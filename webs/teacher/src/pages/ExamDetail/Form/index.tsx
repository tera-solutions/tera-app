import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Button, CheckOutlined, notification, Select, Spin, XMarkOutlined } from "tera-dls";

import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import Input from "@tera/components/dof/Control/Input";
import InputNumber from "@tera/components/dof/Control/InputNumber";

import Breadcrumb from "_common/components/Breadcrumb";
import Card from "_common/components/Card";
import CourseSelect from "_common/components/CourseSelect";
import LevelSelect from "_common/components/LevelSelect";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { useMeta } from "_common/hooks/useMeta";
import { ExamService } from "@tera/modules/education";

import type { ExamFormValues } from "../_interface";
import { DEFAULT_FORM_VALUES, EXAM_TYPE_META } from "../constants";
import { toExamBank } from "../_utils";

const ExamFormPage = () => {
  const navigate = useNavigate();
  const { getOptions } = useMeta();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const form = useForm<ExamFormValues>({
    mode: "onChange",
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const detailQuery = ExamService.useExamDetail({ id: id ?? "" }, { enabled: isEdit });
  const editingItem = isEdit ? toExamBank(detailQuery.data?.data) : null;

  useEffect(() => {
    if (!isEdit || !editingItem?.id) return;
    form.reset({
      exam_name: editingItem.name,
      exam_type: editingItem.type || "final",
      course_id: editingItem.course_id ?? undefined,
      level_id: editingItem.level_id ?? undefined,
      duration: editingItem.duration || 60,
      total_score: editingItem.total_score || 100,
      passing_score: editingItem.passing_score ?? 60,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, editingItem?.id]);

  const { mutate: createExam, isPending: isCreating } = ExamService.useExamCreate();
  const { mutate: updateExam, isPending: isUpdating } = ExamService.useExamUpdate();
  const isSubmitting = isCreating || isUpdating;

  const goBack = () => navigate(isEdit ? `${PATHS.exam}/${id}` : PATHS.exam);

  const handleSubmit = (values: ExamFormValues) => {
    const payload = {
      exam_name: values.exam_name,
      exam_type: values.exam_type,
      course_id: values.course_id,
      level_id: values.level_id,
      duration: values.duration,
      total_score: values.total_score,
      passing_score: values.passing_score,
    };

    if (isEdit) {
      updateExam(
        { id, params: payload },
        {
          onSuccess: () => {
            notification.success({ message: "Cập nhật bài kiểm tra thành công" });
            navigate(`${PATHS.exam}/${id}`);
          },
          onError: (error: any) => {
            notification.error({
              message: error?.data?.msg ?? error?.message ?? "Không thể cập nhật bài kiểm tra",
            });
          },
        },
      );
      return;
    }

    createExam(
      { params: payload },
      {
        onSuccess: (res: any) => {
          const newId = res?.data?.id;
          notification.success({ message: "Tạo bài kiểm tra thành công" });
          navigate(newId ? `${PATHS.exam}/${newId}` : PATHS.exam);
        },
        onError: (error: any) => {
          notification.error({
            message: error?.data?.msg ?? error?.message ?? "Không thể tạo bài kiểm tra",
          });
        },
      },
    );
  };

  return (
    <div className="p-4 xmd:p-6">
      <Breadcrumb
        items={[
          { label: "Bài kiểm tra", onClick: () => navigate(PATHS.exam) },
          ...(isEdit && editingItem
            ? [{ label: editingItem.name, onClick: () => navigate(`${PATHS.exam}/${id}`) }]
            : []),
          { label: isEdit ? "Sửa bài kiểm tra" : "Tạo bài kiểm tra" },
        ]}
      />

      <div className="mt-0.5 mb-4 text-sm text-slate-400">
        {isEdit
          ? "Cập nhật nội dung và thang điểm của bài kiểm tra"
          : "Thiết lập nội dung, thời lượng và thang điểm cho bài kiểm tra mới"}
      </div>

      <Spin spinning={isEdit && detailQuery.isLoading}>
        <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px]">
            <div className="flex flex-col gap-4">
              <Card>
                <p className="mb-3 text-sm font-semibold text-slate-700">Thông tin bài kiểm tra</p>
                <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                  <FormTeraItem
                    label="Tên bài kiểm tra"
                    name="exam_name"
                    className="sm:col-span-2"
                    rules={[
                      { required: "Vui lòng nhập tên bài kiểm tra" },
                      { maxLength: { value: 255, message: "Tên bài kiểm tra không được vượt quá 255 ký tự" } },
                    ]}
                  >
                    <Input placeholder="VD: Kids Starter — Final Exam" />
                  </FormTeraItem>

                  <FormTeraItem label="Loại bài kiểm tra" name="exam_type">
                    <Controller
                      control={form.control}
                      name="exam_type"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          options={getOptions(EXAM_TYPE_META)}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </FormTeraItem>

                  <FormTeraItem
                    label="Thời lượng (phút)"
                    name="duration"
                    rules={[
                      { required: "Vui lòng nhập thời lượng" },
                      { min: { value: 1, message: "Thời lượng phải lớn hơn 0" } },
                    ]}
                  >
                    <InputNumber min={1} className="w-full" />
                  </FormTeraItem>
                </div>
              </Card>

              <Card>
                <p className="mb-3 text-sm font-semibold text-slate-700">Thang điểm</p>
                <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                  <FormTeraItem
                    label="Tổng điểm"
                    name="total_score"
                    rules={[
                      { required: "Vui lòng nhập tổng điểm" },
                      { min: { value: 1, message: "Tổng điểm phải lớn hơn 0" } },
                    ]}
                  >
                    <InputNumber min={1} className="w-full" />
                  </FormTeraItem>

                  <FormTeraItem
                    label="Điểm đạt"
                    name="passing_score"
                    rules={[
                      { required: "Vui lòng nhập điểm đạt" },
                      {
                        validate: {
                          notAboveTotal: (value: number) =>
                            value <= (form.watch("total_score") || 0) ||
                            "Điểm đạt không được vượt quá tổng điểm",
                        },
                      },
                    ]}
                  >
                    <InputNumber min={0} className="w-full" />
                  </FormTeraItem>
                </div>
              </Card>
            </div>

            <div className="flex flex-col gap-4">
              <Card>
                <p className="mb-3 text-sm font-semibold text-slate-700">Phạm vi áp dụng</p>
                <FormTeraItem label="Khóa học" name="course_id">
                  <Controller
                    control={form.control}
                    name="course_id"
                    render={({ field }) => (
                      <CourseSelect
                        value={field.value}
                        onChange={(value) => field.onChange(value != null ? Number(value) : undefined)}
                        allowClear
                      />
                    )}
                  />
                </FormTeraItem>

                <FormTeraItem label="Hạng thứ" name="level_id" className="mb-0">
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
              </Card>
            </div>
          </div>

          <div className="sticky bottom-0 -mx-4 mt-4 flex items-center justify-end gap-3 border-t border-slate-100 bg-white/95 px-4 py-3 shadow-[0_-2px_8px_rgba(15,23,42,0.04)] backdrop-blur xmd:-mx-6 xmd:px-6">
            <Button
              outlined
              icon={<XMarkOutlined />}
              onClick={goBack}
              disabled={isSubmitting}
              className="min-w-28 justify-center text-brand border-brand hover:bg-brand"
            >
              Hủy
            </Button>
            <Button
              htmlType="submit"
              icon={<CheckOutlined />}
              loading={isSubmitting}
              className="min-w-28 justify-center whitespace-nowrap bg-brand hover:bg-brand/80"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </FormTera>
      </Spin>
    </div>
  );
};

export default ExamFormPage;
