import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";
import { notification, Select } from "tera-dls";

import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import FormScaff from "@tera/components/dof/FormScaff";
import TextArea from "@tera/components/dof/Control/TextArea";
import DatePicker from "@tera/components/dof/Control/DatePicker";
import { TeacherService } from "@tera/modules/hr";
import { RoomService } from "@tera/modules/education";
import { TimetableService } from "@tera/modules/education";

import type { SessionDetail } from "../_utils";

interface BaseProps {
  open: boolean;
  session: SessionDetail | null;
  onClose: () => void;
}

const errorMessage = (error: any, fallback: string) =>
  error?.data?.msg?.message ?? error?.data?.msg ?? error?.message ?? fallback;

export const ChangeTeacherModal = ({ open, session, onClose }: BaseProps) => {
  const form = useForm<{ teacher_id: number | undefined; reason: string }>({
    mode: "onChange",
    defaultValues: { teacher_id: undefined, reason: "" },
  });
  const teachersQuery = TeacherService.useTeacherList({ params: { per_page: 100 } });
  const teacherOptions = useMemo(
    () =>
      (teachersQuery.data?.data?.items ?? []).map((t: any) => ({
        value: t.id,
        label: t.full_name,
      })),
    [teachersQuery.data],
  );
  const { mutate, isPending } = TimetableService.useTimetableChangeTeacher();

  useEffect(() => {
    if (open) form.reset({ teacher_id: session?.teacher_id ?? undefined, reason: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, session?.id]);

  const handleSubmit = (values: { teacher_id: number | undefined; reason: string }) => {
    if (!session || !values.teacher_id) return;
    mutate(
      { id: session.id, params: { teacher_id: values.teacher_id, reason: values.reason || undefined } },
      {
        onSuccess: () => {
          notification.success({ message: "Đổi giáo viên thành công" });
          onClose();
        },
        onError: (error: any) => notification.error({ message: errorMessage(error, "Không thể đổi giáo viên") }),
      },
    );
  };

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit
      titleCreate="Đổi giáo viên"
      titleEdit="Đổi giáo viên"
      className="!w-[95%] xmd:!w-[440px]"
      okText="Lưu"
      onOk={() => form.handleSubmit(handleSubmit)()}
      confirmLoading={isPending}
    >
      <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
        <FormTeraItem
          label="Giáo viên mới"
          name="teacher_id"
          rules={[{ required: "Vui lòng chọn giáo viên" }]}
        >
          <Controller
            control={form.control}
            name="teacher_id"
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                options={teacherOptions}
                loading={teachersQuery.isLoading}
                placeholder="Chọn giáo viên"
              />
            )}
          />
        </FormTeraItem>
        <FormTeraItem label="Lý do (tùy chọn)" name="reason">
          <TextArea placeholder="VD: Giáo viên A nghỉ đột xuất." rows={2} />
        </FormTeraItem>
      </FormTera>
    </FormScaff>
  );
};

export const ChangeRoomModal = ({ open, session, onClose }: BaseProps) => {
  const form = useForm<{ room_id: number | undefined; reason: string }>({
    mode: "onChange",
    defaultValues: { room_id: undefined, reason: "" },
  });
  const roomsQuery = RoomService.useRoomList({ params: { per_page: 100 } });
  const roomOptions = useMemo(
    () =>
      (roomsQuery.data?.data?.items ?? []).map((r: any) => ({
        value: r.id,
        label: r.room_name,
      })),
    [roomsQuery.data],
  );
  const { mutate, isPending } = TimetableService.useTimetableChangeRoom();

  useEffect(() => {
    if (open) form.reset({ room_id: session?.room_id ?? undefined, reason: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, session?.id]);

  const handleSubmit = (values: { room_id: number | undefined; reason: string }) => {
    if (!session || !values.room_id) return;
    mutate(
      { id: session.id, params: { room_id: values.room_id, reason: values.reason || undefined } },
      {
        onSuccess: () => {
          notification.success({ message: "Đổi phòng học thành công" });
          onClose();
        },
        onError: (error: any) => notification.error({ message: errorMessage(error, "Không thể đổi phòng học") }),
      },
    );
  };

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit
      titleCreate="Đổi phòng học"
      titleEdit="Đổi phòng học"
      className="!w-[95%] xmd:!w-[440px]"
      okText="Lưu"
      onOk={() => form.handleSubmit(handleSubmit)()}
      confirmLoading={isPending}
    >
      <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
        <FormTeraItem
          label="Phòng học mới"
          name="room_id"
          rules={[{ required: "Vui lòng chọn phòng học" }]}
        >
          <Controller
            control={form.control}
            name="room_id"
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                options={roomOptions}
                loading={roomsQuery.isLoading}
                placeholder="Chọn phòng học"
              />
            )}
          />
        </FormTeraItem>
        <FormTeraItem label="Lý do (tùy chọn)" name="reason">
          <TextArea placeholder="VD: Phòng A đang sửa chữa." rows={2} />
        </FormTeraItem>
      </FormTera>
    </FormScaff>
  );
};

export const RescheduleModal = ({ open, session, onClose }: BaseProps) => {
  const form = useForm<{
    session_date: string | undefined;
    start_time: string;
    end_time: string;
    reason: string;
  }>({
    mode: "onChange",
    defaultValues: { session_date: undefined, start_time: "", end_time: "", reason: "" },
  });
  const { mutate, isPending } = TimetableService.useTimetableReschedule();

  useEffect(() => {
    if (open) {
      form.reset({
        session_date: session?.date ?? undefined,
        start_time: session?.start_time ?? "",
        end_time: session?.end_time ?? "",
        reason: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, session?.id]);

  const handleSubmit = (values: {
    session_date: string | undefined;
    start_time: string;
    end_time: string;
    reason: string;
  }) => {
    if (!session || !values.session_date) return;
    mutate(
      {
        id: session.id,
        params: {
          session_date: values.session_date,
          start_time: values.start_time,
          end_time: values.end_time,
          reason: values.reason || undefined,
        },
      },
      {
        onSuccess: () => {
          notification.success({ message: "Dời lịch học thành công" });
          onClose();
        },
        onError: (error: any) => notification.error({ message: errorMessage(error, "Không thể dời lịch học") }),
      },
    );
  };

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit
      titleCreate="Dời lịch học"
      titleEdit="Dời lịch học"
      className="!w-[95%] xmd:!w-[440px]"
      okText="Lưu"
      onOk={() => form.handleSubmit(handleSubmit)()}
      confirmLoading={isPending}
    >
      <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
        <FormTeraItem
          label="Ngày học mới"
          name="session_date"
          rules={[{ required: "Vui lòng chọn ngày học mới" }]}
        >
          <Controller
            control={form.control}
            name="session_date"
            render={({ field }) => (
              <DatePicker
                className="w-full"
                format="DD/MM/YYYY"
                value={field.value ? moment(field.value) : undefined}
                onChange={(value: any) =>
                  field.onChange(value ? moment(value).format("YYYY-MM-DD") : undefined)
                }
              />
            )}
          />
        </FormTeraItem>
        <div className="grid grid-cols-2 gap-x-4">
          <FormTeraItem
            label="Giờ bắt đầu"
            name="start_time"
            rules={[{ required: "Bắt buộc" }]}
          >
            <input
              type="time"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none"
              value={form.watch("start_time")}
              onChange={(e) => form.setValue("start_time", e.target.value, { shouldValidate: true })}
            />
          </FormTeraItem>
          <FormTeraItem
            label="Giờ kết thúc"
            name="end_time"
            rules={[{ required: "Bắt buộc" }]}
          >
            <input
              type="time"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none"
              value={form.watch("end_time")}
              onChange={(e) => form.setValue("end_time", e.target.value, { shouldValidate: true })}
            />
          </FormTeraItem>
        </div>
        <FormTeraItem label="Lý do (tùy chọn)" name="reason">
          <TextArea placeholder="VD: Trùng lịch phòng, dời sang ngày khác." rows={2} />
        </FormTeraItem>
      </FormTera>
    </FormScaff>
  );
};

export const CancelSessionModal = ({ open, session, onClose }: BaseProps) => {
  const form = useForm<{ reason: string }>({ mode: "onChange", defaultValues: { reason: "" } });
  const { mutate, isPending } = TimetableService.useTimetableCancelSession();

  useEffect(() => {
    if (open) form.reset({ reason: "" });
  }, [open, form]);

  const handleSubmit = (values: { reason: string }) => {
    if (!session) return;
    mutate(
      { id: session.id, params: { reason: values.reason } },
      {
        onSuccess: () => {
          notification.success({ message: "Đã hủy buổi học" });
          onClose();
        },
        onError: (error: any) => notification.error({ message: errorMessage(error, "Không thể hủy buổi học") }),
      },
    );
  };

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit={false}
      titleCreate="Hủy buổi học"
      titleEdit="Hủy buổi học"
      className="!w-[95%] xmd:!w-[420px]"
      okText="Xác nhận hủy"
      onOk={() => form.handleSubmit(handleSubmit)()}
      confirmLoading={isPending}
    >
      <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
        <FormTeraItem label="Lý do hủy" name="reason" rules={[{ required: "Vui lòng nhập lý do hủy" }]}>
          <TextArea placeholder="VD: Nghỉ lễ." rows={3} />
        </FormTeraItem>
      </FormTera>
    </FormScaff>
  );
};
