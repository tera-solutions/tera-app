/* Import: library */
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
} from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Col, Row, notification } from "tera-dls";

/* Import: packages */
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import Input from "@tera/components/dof/Control/Input";
import TextArea from "@tera/components/dof/Control/TextArea";

/* Import: services */
import { LevelService, CourseService } from "@tera/modules";

/* Import: pages */
import { CEFR_LEVELS, ILevel, ILevelForm } from "../_interface";

const SELECT_CLASS =
  "w-full h-9 border border-gray-300 rounded bg-white px-3 text-[13px] focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer";

const defaultValues: ILevelForm = {
  level_code: "",
  level_name: "",
  course_id: "",
  cefr_level: "",
  level_order: "",
  description: "",
  status: "active",
};

interface IProps {
  dataDetail?: ILevel | null;
  type?: "create" | "update" | "detail";
  onSuccess?: () => void;
}

const LevelForm = forwardRef<any, IProps>(
  ({ dataDetail, type = "create", onSuccess }, ref) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const isView = type === "detail";
    const isUpdate = type === "update" || (type === "detail" && !!dataDetail?.id);

    const { data: courseData } = CourseService.useCourseList({
      params: { page: 1, per_page: 100 },
    });
    const courses: any[] = useMemo(() => {
      const list = courseData?.data?.items ?? [];
      const selected = dataDetail?.course;
      if (selected?.id && !list.some((c: any) => c.id === selected.id)) {
        return [...list, selected];
      }
      return list;
    }, [courseData, dataDetail]);

    const schema = useMemo(
      () =>
        yup.object({
          level_code: yup.string().required(t("validate.required")),
          level_name: yup.string().required(t("validate.required")),
          course_id: yup.string().required(t("validate.required")),
          cefr_level: yup.string(),
          level_order: yup.string(),
          description: yup.string(),
          status: yup.string(),
        }),
      [t],
    );

    const form = useForm<ILevelForm>({
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema) as any,
    });
    const { reset, register, formState } = form;

    const { mutate: upsert, isPending } = LevelService.useUpsertLevel();

    useEffect(() => {
      if (dataDetail?.id) {
        reset({
          level_code: dataDetail.level_code ?? "",
          level_name: dataDetail.level_name ?? "",
          course_id: dataDetail.course_id
            ? String(dataDetail.course_id)
            : dataDetail.course?.id
              ? String(dataDetail.course.id)
              : "",
          cefr_level: dataDetail.cefr_level ?? "",
          level_order:
            dataDetail.level_order != null ? String(dataDetail.level_order) : "",
          description: dataDetail.description ?? "",
          status: dataDetail.status ?? "active",
        });
      } else {
        reset(defaultValues);
      }
    }, [dataDetail, reset]);

    const handleSubmitForm = (values: ILevelForm) => {
      const params: any = {
        level_code: values.level_code,
        level_name: values.level_name,
        course_id: values.course_id ? Number(values.course_id) : undefined,
        cefr_level: values.cefr_level || undefined,
        level_order: values.level_order ? Number(values.level_order) : undefined,
        description: values.description || undefined,
      };
      // status chỉ gửi khi create (đổi trạng thái qua suspend/restore)
      if (!isUpdate) params.status = values.status;

      upsert(
        { id: dataDetail?.id, params },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["level", "list"] });
            queryClient.invalidateQueries({ queryKey: ["level", "detail"] });
            notification.success({
              message: isUpdate
                ? t("common.update_success")
                : t("common.create_success"),
            });
            onSuccess?.();
          },
          onError: (error: any) =>
            notification.error({
              message: error?.message || t("common.error_message"),
            }),
        } as any,
      );
    };

    useImperativeHandle(ref, () => ({
      submit: () => form.handleSubmit(handleSubmitForm)(),
      isDirty: () => formState.isDirty,
      isLoading: () => isPending,
    }));

    return (
      <FormTera form={form} onSubmit={handleSubmitForm} isDisabled={isView}>
        <Row className="grid-cols-2 gap-x-4">
          <Col>
            <FormTeraItem
              label={t("level.code")}
              name="level_code"
              rules={[{ required: t("validate.required") }]}
            >
              <Input
                placeholder={t("level.code")}
                disabled={isView || isUpdate}
              />
            </FormTeraItem>
          </Col>
          <Col>
            <FormTeraItem
              label={t("level.name")}
              name="level_name"
              rules={[{ required: t("validate.required") }]}
            >
              <Input placeholder={t("level.name")} disabled={isView} />
            </FormTeraItem>
          </Col>
          <Col>
            <FormTeraItem
              label={t("level.course")}
              name="course_id"
              rules={[{ required: t("validate.required") }]}
            >
              <select
                {...register("course_id")}
                disabled={isView}
                className={SELECT_CLASS}
              >
                <option value="" disabled hidden>
                  {t("level.select_course")}
                </option>
                {courses.map((c: any) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.code ? `${c.name} (${c.code})` : c.name}
                  </option>
                ))}
              </select>
            </FormTeraItem>
          </Col>
          <Col>
            <FormTeraItem label={t("level.cefr")} name="cefr_level">
              <select
                {...register("cefr_level")}
                disabled={isView}
                className={SELECT_CLASS}
              >
                <option value="">—</option>
                {CEFR_LEVELS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </FormTeraItem>
          </Col>
          <Col>
            <FormTeraItem label={t("level.order")} name="level_order">
              <Input type="number" min={0} placeholder="0" disabled={isView} />
            </FormTeraItem>
          </Col>
          {!isUpdate && (
            <Col>
              <FormTeraItem label={t("level.status")} name="status">
                <select
                  {...register("status")}
                  disabled={isView}
                  className={SELECT_CLASS}
                >
                  <option value="active">{t("level.status_active")}</option>
                  <option value="inactive">{t("level.status_inactive")}</option>
                </select>
              </FormTeraItem>
            </Col>
          )}
          <Col className="col-span-2">
            <FormTeraItem label={t("level.description")} name="description">
              <TextArea rows={3} disabled={isView} />
            </FormTeraItem>
          </Col>
        </Row>
      </FormTera>
    );
  },
);

export default LevelForm;
