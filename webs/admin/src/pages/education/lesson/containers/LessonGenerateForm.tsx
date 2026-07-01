/* Import: library */
import { useImperativeHandle, forwardRef, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { Col, Row, notification, DatePicker as DatePickerTera } from "tera-dls";

/* Import: packages */
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";

/* Import: services */
import { LessonService, ClassRoomService } from "@tera/modules";

const SELECT_CLASS =
  "w-full max-w-full min-w-0 h-9 border border-gray-300 bg-white px-3 text-[13px] hover:border-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-700 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer box-border";

interface IGenerateForm {
  class_room_id: string;
  from_date: string;
  override: boolean;
}

const defaultValues: IGenerateForm = {
  class_room_id: "",
  from_date: "",
  override: false,
};

type LessonGenerateFormProps = { onSuccess?: () => void };

/**
 * Form sinh bài học (generate) cho 1 lớp từ ngày bắt đầu.
 * Gọi POST /edu/lesson/generate/:classId — body { from_date, override }.
 */
const LessonGenerateForm = forwardRef<any, LessonGenerateFormProps>(
  ({ onSuccess }, ref) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const { data: classData } = ClassRoomService.useClassRoomList({
      params: { page: 1, per_page: 100 },
    });
    const classes: any[] = classData?.data?.items ?? [];

    const schema = useMemo(
      () =>
        yup.object({
          class_room_id: yup.string().required(t("validate.required")),
          from_date: yup.string().required(t("validate.required")),
        }),
      [t],
    );

    const form = useForm<IGenerateForm>({
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema) as any,
    });

    const { formState, watch, register, control } = form;
    const classRoomIdValue = watch("class_room_id");
    const overrideValue = watch("override");

    const { mutate: onGenerate, isPending } = LessonService.useLessonGenerate();

    const handleSubmitForm = (values: IGenerateForm) => {
      onGenerate(
        {
          id: Number(values.class_room_id),
          params: {
            from_date: values.from_date || undefined,
            override: !!values.override,
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lesson", "list"] });
            notification.success({ message: t("lesson.generate_success") });
            onSuccess?.();
          },
          onError: (error: any) =>
            notification.error({
              message: error?.message || t("common.error_message"),
            }),
        },
      );
    };

    useImperativeHandle(ref, () => ({
      isValid: () => formState.isValid,
      submit: () => form.handleSubmit(handleSubmitForm)(),
      isDirty: () => formState.isDirty,
    }));

    return (
      <FormTera form={form} onSubmit={handleSubmitForm} isLoading={isPending}>
        <p className="text-[13px] text-gray-500 mb-3">
          {t("lesson.generate_hint")}
        </p>
        <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Col className="sm:col-span-2">
            <FormTeraItem
              label={t("lesson.class")}
              name="class_room_id"
              rules={[{ required: t("validate.required") }]}
            >
              <div className="w-full overflow-hidden">
                <select
                  className={SELECT_CLASS}
                  style={{
                    borderRadius: "3px",
                    color: classRoomIdValue ? "#111827" : "#9ca3af",
                  }}
                  {...register("class_room_id")}
                >
                  <option value="" disabled hidden>
                    {t("form.enter_value", { key: t("lesson.class") })}
                  </option>
                  {classes.map((c) => (
                    <option
                      key={c.id}
                      value={String(c.id)}
                      style={{ color: "#111827" }}
                    >
                      {c.name}
                      {c.code ? ` (${c.code})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </FormTeraItem>
          </Col>
          <Col className="sm:col-span-2">
            <FormTeraItem
              label={t("lesson.generate_from_date")}
              name="from_date"
              rules={[{ required: t("validate.required") }]}
            >
              <Controller
                control={control}
                name="from_date"
                render={({ field }) => (
                  <DatePickerTera
                    className="w-full"
                    format="DD/MM/YYYY"
                    placeholder="dd/mm/yyyy"
                    allowClear
                    value={
                      field.value
                        ? moment(String(field.value), "YYYY-MM-DD")
                        : undefined
                    }
                    onChange={(date: any) =>
                      field.onChange(
                        date ? moment(date).format("YYYY-MM-DD") : "",
                      )
                    }
                  />
                )}
              />
            </FormTeraItem>
          </Col>
          <Col className="sm:col-span-2">
            <label className="flex items-center gap-2 text-[13px] text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={!!overrideValue}
                {...register("override")}
              />
              {t("lesson.generate_override")}
            </label>
          </Col>
        </Row>
      </FormTera>
    );
  },
);

export default LessonGenerateForm;
