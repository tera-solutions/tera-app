import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";
import { Button, Checkbox, CheckOutlined, notification, Select, Spin, UserOutlined, XMarkOutlined } from "tera-dls";

import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import Input from "@tera/components/dof/Control/Input";
import InputNumber from "@tera/components/dof/Control/InputNumber";
import TextArea from "@tera/components/dof/Control/TextArea";
import DatePicker from "@tera/components/dof/Control/DatePicker";
import { FileAPI, stripExtension } from "@tera/api/common/FileAPI";

import Breadcrumb from "_common/components/Breadcrumb";
import Card from "_common/components/Card";
import ClassroomSelect from "_common/components/ClassroomSelect";
import CourseSelect from "_common/components/CourseSelect";
import LessonSelect from "_common/components/LessonSelect";
import LevelSelect from "_common/components/LevelSelect";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { useMeta } from "_common/hooks/useMeta";
import { AssignmentService } from "@tera/modules/education";

import type { AssignmentFormValues } from "../_interface";
import { ASSIGNMENT_TYPE_META, DEFAULT_FORM_VALUES } from "../constants";
import { toAssignment } from "../_utils";

const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";

const AssignmentFormPage = () => {
  const navigate = useNavigate();
  const { getOptions } = useMeta();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const form = useForm<AssignmentFormValues>({
    mode: "onChange",
    defaultValues: DEFAULT_FORM_VALUES,
  });
  const avatarValue = form.watch("avatar");

  const detailQuery = AssignmentService.useAssignmentDetail({ id: id ?? "" }, { enabled: isEdit });
  const editingRaw = detailQuery.data?.data?.assignment;
  const editingItem = isEdit && editingRaw ? toAssignment(editingRaw) : null;

  useEffect(() => {
    if (!isEdit || !editingItem?.id) return;
    form.reset({
      assignment_name: editingItem.name,
      assignment_type: editingItem.type || "homework",
      avatar: editingItem.avatar_url || "",
      description: editingItem.description || "",
      instruction: editingItem.instruction || "",
      due_date: editingItem.due_date,
      max_score: editingItem.max_score || 10,
      course_id: editingItem.course_id ?? undefined,
      class_room_id: editingItem.class_id ?? undefined,
      level_id: editingItem.level_id ?? undefined,
      lesson_id: editingItem.lesson_id ?? undefined,
      allow_late_submission: editingItem.allow_late_submission ?? false,
      allow_multiple_submission: editingItem.allow_multiple_submission ?? false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, editingItem?.id]);

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

  const { mutate: createAssignment, isPending: isCreating } =
    AssignmentService.useAssignmentCreate();
  const { mutate: updateAssignment, isPending: isUpdating } =
    AssignmentService.useAssignmentUpdate();
  const isSubmitting = isCreating || isUpdating;

  const goBack = () => navigate(isEdit ? `${PATHS.assignmentDetail}/${id}` : PATHS.assignment);

  const handleSubmit = (values: AssignmentFormValues) => {
    const basePayload = {
      assignment_name: values.assignment_name,
      assignment_type: values.assignment_type,
      avatar: values.avatar || undefined,
      instruction: values.instruction,
      max_score: values.max_score,
      due_date: values.due_date,
    };
    // `description`, course/class/level/lesson scope, and submission policy
    // flags are only accepted by the update endpoint (assignment.md §VI) —
    // none of these are part of create input.
    const assignPayload = {
      course_id: values.course_id,
      class_room_id: values.class_room_id,
      level_id: values.level_id,
      lesson_id: values.lesson_id,
      description: values.description || undefined,
      allow_late_submission: values.allow_late_submission,
      allow_multiple_submission: values.allow_multiple_submission,
    };

    if (isEdit) {
      updateAssignment(
        { id, params: { ...basePayload, ...assignPayload } },
        {
          onSuccess: () => {
            notification.success({ message: "Cập nhật bài tập thành công" });
            navigate(`${PATHS.assignmentDetail}/${id}`);
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

    createAssignment(
      { params: basePayload },
      {
        onSuccess: (res: any) => {
          const newId = res?.data?.id;
          const hasScope =
            values.course_id ||
            values.class_room_id ||
            values.level_id ||
            values.lesson_id ||
            values.description ||
            values.allow_late_submission ||
            values.allow_multiple_submission;
          if (newId && hasScope) {
            updateAssignment({ id: newId, params: assignPayload });
          }
          notification.success({ message: "Tạo bài tập thành công" });
          navigate(newId ? `${PATHS.assignmentDetail}/${newId}` : PATHS.assignment);
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
    <div className="p-4 xmd:p-6">
      <Breadcrumb
        items={[
          { label: "Bài tập", onClick: () => navigate(PATHS.assignment) },
          ...(isEdit && editingItem
            ? [{ label: editingItem.name, onClick: () => navigate(`${PATHS.assignmentDetail}/${id}`) }]
            : []),
          { label: isEdit ? "Sửa bài tập" : "Tạo bài tập" },
        ]}
      />

      <div className="mt-0.5 mb-4 text-sm text-slate-400">
        {isEdit
          ? "Cập nhật nội dung, phạm vi áp dụng và tùy chọn nộp bài"
          : "Thiết lập nội dung, hạn nộp và phạm vi áp dụng cho bài tập mới"}
      </div>

      <Spin spinning={isEdit && detailQuery.isLoading}>
        <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px]">
            <div className="flex flex-col gap-4">
              <Card>
                <p className="mb-3 text-sm font-semibold text-slate-700">Thông tin bài tập</p>
                <div className="mb-4 flex items-center gap-3">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => inputRef.current?.click()}
                    className="group relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                  >
                    {avatarValue ? (
                      <img src={avatarValue} alt="avatar" className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-slate-300 [&_svg]:h-7 [&_svg]:w-7">
                        <UserOutlined />
                      </span>
                    )}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-center text-[10px] font-medium leading-tight text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {isUploadingAvatar ? "Đang tải..." : "Đổi ảnh"}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700">Ảnh minh họa</p>
                    <p className="text-xs text-slate-400">Ảnh đại diện hiển thị cho bài tập (không bắt buộc)</p>
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
                    label="Tên bài tập"
                    name="assignment_name"
                    className="sm:col-span-2"
                    rules={[
                      { required: "Vui lòng nhập tên bài tập" },
                      { maxLength: { value: 255, message: "Tên bài tập không được vượt quá 255 ký tự" } },
                    ]}
                  >
                    <Input placeholder="VD: Write the missing letters" />
                  </FormTeraItem>

                  <FormTeraItem label="Loại bài tập" name="assignment_type">
                    <Controller
                      control={form.control}
                      name="assignment_type"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          options={getOptions(ASSIGNMENT_TYPE_META)}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </FormTeraItem>

                  <FormTeraItem
                    label="Điểm tối đa"
                    name="max_score"
                    rules={[
                      { required: "Vui lòng nhập điểm tối đa" },
                      { min: { value: 1, message: "Điểm tối đa phải lớn hơn 0" } },
                    ]}
                  >
                    <InputNumber min={1} className="w-full" />
                  </FormTeraItem>
                </div>

                <FormTeraItem
                  label="Mô tả"
                  name="description"
                  rules={[{ maxLength: { value: 5000, message: "Mô tả không được vượt quá 5000 ký tự" } }]}
                >
                  <TextArea placeholder="Mô tả ngắn gọn về bài tập..." rows={2} />
                </FormTeraItem>

                <FormTeraItem
                  label="Yêu cầu"
                  name="instruction"
                  rules={[
                    { required: "Vui lòng nhập yêu cầu bài tập" },
                    { maxLength: { value: 10000, message: "Yêu cầu không được vượt quá 10000 ký tự" } },
                  ]}
                >
                  <TextArea placeholder="Hướng dẫn cho học viên..." rows={5} />
                </FormTeraItem>
              </Card>

              <Card>
                <p className="mb-3 text-sm font-semibold text-slate-700">Tùy chọn nộp bài</p>
                <div className="flex flex-col gap-2">
                  <Controller
                    control={form.control}
                    name="allow_late_submission"
                    render={({ field }) => (
                      <Checkbox checked={!!field.value} onChange={(e: any) => field.onChange(e.target.checked)}>
                        <span className="text-sm text-slate-600">Cho phép nộp bài trễ hạn</span>
                      </Checkbox>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="allow_multiple_submission"
                    render={({ field }) => (
                      <Checkbox checked={!!field.value} onChange={(e: any) => field.onChange(e.target.checked)}>
                        <span className="text-sm text-slate-600">Cho phép nộp lại nhiều lần</span>
                      </Checkbox>
                    )}
                  />
                </div>
              </Card>
            </div>

            <div className="flex flex-col gap-4">
              <Card>
                <p className="mb-3 text-sm font-semibold text-slate-700">Hạn nộp</p>
                <FormTeraItem
                  name="due_date"
                  rules={[
                    { required: "Vui lòng chọn hạn nộp" },
                    ...(isEdit
                      ? []
                      : [
                          {
                            validate: {
                              inFuture: (value: string) =>
                                !value ||
                                moment(value).isAfter(moment()) ||
                                "Hạn nộp phải sau thời điểm hiện tại",
                            },
                          },
                        ]),
                  ]}
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
                        className="w-full"
                      />
                    )}
                  />
                </FormTeraItem>
              </Card>

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

                <FormTeraItem label="Bài học" name="lesson_id">
                  <Controller
                    control={form.control}
                    name="lesson_id"
                    render={({ field }) => (
                      <LessonSelect
                        value={field.value}
                        onChange={(value) => field.onChange(value != null ? Number(value) : undefined)}
                        classRoomId={form.watch("class_room_id")}
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
              onClick={() => form.handleSubmit(handleSubmit)()}
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

export default AssignmentFormPage;
