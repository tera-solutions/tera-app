/* Import: library */
import { useEffect, useImperativeHandle, forwardRef, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Col, Row, notification } from "tera-dls";
import debounce from "lodash/debounce";

/* Import: packages */
import { IFormProps } from "@tera/commons/interfaces";
import Input from "@tera/components/dof/Control/Input";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";

/* Import: services */
import { TeacherService } from "@tera/modules";
import { TeacherAPI } from "@tera/api";

/* Import: pages */
import { ITeacherForm } from "pages/education/teacher/_interface";

const SELECT_CLASS =
  "w-full max-w-full min-w-0 h-9 border border-gray-300 bg-white px-3 text-[13px] hover:border-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-700 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer box-border";

const defaultValues: ITeacherForm = {
  code: "",
  name: "",
  type: "",
  status: "",
  salary_per_hour: "",
};

const TeacherForm = forwardRef<any, IFormProps & { onSuccess?: () => void }>(
  ({ dataDetail, type = "create", onSuccess }, ref) => {
    const isView = type === "detail";
    const isUpdate = type === "update";
    const { t } = useTranslation();

    const checkCodeRef = useRef(
      debounce(
        (code: string, resolve: (valid: boolean) => void) => {
          TeacherAPI.getList({ params: { keyword: code, per_page: 5 } })
            .then((res) => {
              const items: any[] = res?.data?.items ?? [];
              resolve(!items.some((item) => item.code === code));
            })
            .catch(() => resolve(true));
        },
        500,
      ),
    );

    const schema = useMemo(
      () =>
        yup.object({
          code: yup
            .string()
            .required(t("validate.required"))
            .matches(/^[a-zA-Z0-9_-]+$/, t("validate.no_special_chars"))
            .test("unique-code", t("validate.code_exists"), (value) => {
              if (!value || isUpdate) return true;
              return new Promise((resolve) =>
                checkCodeRef.current(value, resolve),
              );
            }),
          name: yup
            .string()
            .required(t("validate.required"))
            .matches(
              /^[^!@#$%^&*()+\=\[\]{}|;:'",<>?\/\\~`]+$/,
              t("validate.no_special_chars"),
            ),
          type: yup.string().required(t("validate.required")),
          status: yup.string().required(t("validate.required")),
          salary_per_hour: yup.string().required(t("validate.required")),
        }),
      [t],
    );

    const form = useForm<ITeacherForm>({
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema) as any,
    });

    const { reset, formState, watch } = form;
    const typeValue = watch("type");
    const statusValue = watch("status");

    const queryClient = useQueryClient();
    const { mutate: onSubmit, isPending } = TeacherService.useUpsertTeacher();

    useEffect(() => {
      if (dataDetail?.id) {
        reset({
          code: dataDetail.code ?? "",
          name: dataDetail.name ?? "",
          type: dataDetail.type ?? "",
          status: dataDetail.status ?? "",
          salary_per_hour: dataDetail.salary_per_hour ?? "",
        });
      } else {
        reset(defaultValues);
      }
    }, [dataDetail, reset]);

    const handleSubmitForm = (values: ITeacherForm) => {
      const params = {
        code: values.code?.trim() || undefined,
        name: values.name?.trim() || undefined,
        type: values.type || undefined,
        status: values.status || undefined,
        salary_per_hour: values.salary_per_hour
          ? Number(values.salary_per_hour)
          : undefined,
      };

      onSubmit(
        { id: dataDetail?.id, params },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teacher", "list"] });
            onSuccess?.();
          },
          onError: (error: any) => {
            notification.error({
              message: error?.message || t("common.error_message"),
            });
          },
        },
      );
    };

    useImperativeHandle(ref, () => ({
      isValid: () => formState.isValid,
      submit: () => form.handleSubmit(handleSubmitForm)(),
      isDirty: () => formState.isDirty,
    }));

    return (
      <FormTera
        form={form}
        onSubmit={handleSubmitForm}
        isLoading={isPending}
        isDisabled={type === "detail"}
      >
        <Row className='grid grid-cols-1'>
          <Col>
            <FormTeraItem
              label={t("teacher.code")}
              name='code'
              rules={[{ required: t("validate.required") }]}
            >
              <Input
                placeholder={t("form.enter_value", { key: t("teacher.code") })}
                disabled={isView || isUpdate}
              />
            </FormTeraItem>
          </Col>

          <Col>
            <FormTeraItem
              label={t("teacher.name")}
              name='name'
              rules={[{ required: t("validate.required") }]}
            >
              <Input
                placeholder={t("form.enter_value", { key: t("teacher.name") })}
                disabled={isView}
              />
            </FormTeraItem>
          </Col>

          <Col>
            <FormTeraItem
              label={t("teacher.type")}
              name='type'
              rules={[{ required: t("validate.required") }]}
            >
              <div className='w-full overflow-hidden'>
                <select
                  className={SELECT_CLASS}
                  style={{
                    borderRadius: "3px",
                    color: typeValue ? "#111827" : "#9ca3af",
                  }}
                  disabled={isView}
                  {...form.register("type")}
                >
                  <option value='' disabled hidden>
                    {t("form.enter_value", { key: t("teacher.type") })}
                  </option>
                  <option value='part_time'>
                    {t("teacher.type_part_time")}
                  </option>
                  <option value='full_time'>
                    {t("teacher.type_full_time")}
                  </option>
                  <option value='assistant'>
                    {t("teacher.type_assistant")}
                  </option>
                  <option value='freelance'>
                    {t("teacher.type_freelance")}
                  </option>
                </select>
              </div>
            </FormTeraItem>
          </Col>

          <Col>
            <FormTeraItem
              label={t("teacher.salary_per_hour")}
              name='salary_per_hour'
              rules={[{ required: t("validate.required") }]}
            >
              <Input
                type='number'
                placeholder={t("form.enter_value", {
                  key: t("teacher.salary_per_hour"),
                })}
                disabled={isView}
              />
            </FormTeraItem>
          </Col>

          <Col>
            <FormTeraItem
              label={t("teacher.status")}
              name='status'
              rules={[{ required: t("validate.required") }]}
            >
              <div className='w-full overflow-hidden'>
                <select
                  className={SELECT_CLASS}
                  style={{
                    borderRadius: "3px",
                    color: statusValue ? "#111827" : "#9ca3af",
                  }}
                  disabled={isView}
                  {...form.register("status")}
                >
                  <option value='' disabled hidden>
                    {t("form.enter_value", { key: t("teacher.status") })}
                  </option>
                  <option value='active'>{t("teacher.status_active")}</option>
                  <option value='suspended'>
                    {t("teacher.status_suspended")}
                  </option>
                  <option value='resigned'>
                    {t("teacher.status_resigned")}
                  </option>
                </select>
              </div>
            </FormTeraItem>
          </Col>
        </Row>
      </FormTera>
    );
  },
);

export default TeacherForm;
