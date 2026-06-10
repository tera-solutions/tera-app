/* Import: library */
import { useEffect, useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Col, Row } from "tera-dls";

/* Import: packages */
import { IFormProps } from "@tera/commons/interfaces";
import Input from "@tera/components/dof/Control/Input";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";

/* Import: services */
import { TeacherService } from "@tera/modules";

/* Import: pages */
import { ITeacherForm } from "pages/education/teacher/_interface";

const defaultValues: ITeacherForm = {
  code: undefined,
  name: undefined,
  type: "teacher",
  status: "active",
  salary_per_hour: undefined,
};

const TeacherForm = forwardRef<any, IFormProps & { onSuccess?: () => void }>(
  ({ dataDetail, type = "create", onSuccess }, ref) => {
    const isView = type === "detail";
    const { t } = useTranslation();

    const form = useForm<ITeacherForm>({
      mode: "onChange",
      defaultValues: defaultValues,
    });

    const { reset, formState } = form;

    const { mutate: onSubmit, isPending } =
      TeacherService.useUpsertTeacher();

    useEffect(() => {
      if (dataDetail?.id) {
        reset(dataDetail);
      } else {
        reset(defaultValues);
      }
    }, [dataDetail, reset]);

    const handleSubmitForm = (values: ITeacherForm) => {
      const params = {
        code: values.code?.trim() || undefined,
        name: values.name?.trim() || undefined,
        type: values.type || "teacher",
        status: values.status?.trim() || "active",
        salary_per_hour: values.salary_per_hour ? Number(values.salary_per_hour) : undefined,
      };

      onSubmit({ id: dataDetail?.id, params }, { onSuccess });
    };

    useImperativeHandle(
      ref,
      () => ({
        isValid: () => formState.isValid,
        submit: () => form.handleSubmit(handleSubmitForm)(),
        isDirty: () => formState.isDirty,
      }),
      [formState.isValid, formState.isDirty],
    );

    return (
      <FormTera
        form={form}
        onSubmit={handleSubmitForm}
        isLoading={isPending}
        isDisabled={type === "detail"}
      >
        <Row className="grid grid-cols-1">

          <Col>
            <FormTeraItem
              label={t("teacher.code")}
              name="code"
              rules={[
                {
                  required: {
                    value: true,
                    message: t("validate.required"),
                  },
                }
              ]}
            >
              <Input
                placeholder={t("form.enter_value", {
                  key: t("teacher.code"),
                })}
                disabled={isView}
              />
            </FormTeraItem>
          </Col>

          <Col>
            <FormTeraItem
              label={t("teacher.name")}
              name="name"
              rules={[
                {
                  required: {
                    value: true,
                    message: t("validate.required"),
                  },
                }
              ]}
            >
              <Input
                placeholder={t("form.enter_value", {
                  key: t("teacher.name"),
                })}
                disabled={isView}
              />
            </FormTeraItem>
          </Col>

          <Col>
            <FormTeraItem
              label={t("teacher.type")}
              name="type"
              rules={[]}
            >
              <Input
                placeholder={t("form.enter_value", {
                  key: t("teacher.type"),
                })}
                disabled
              />
            </FormTeraItem>
          </Col>

          <Col>
            <FormTeraItem
              label={t("teacher.salary_per_hour")}
              name="salary_per_hour"
              rules={[]}
            >
              <Input
                type="number"
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
              name="status"
              rules={[
                
              ]}
            >
              <Input
                placeholder={t("form.enter_value", {
                  key: t("teacher.status"),
                })}
                disabled={isView}
              />
            </FormTeraItem>
          </Col>
        </Row>
      </FormTera>
    );
  },
);

export default TeacherForm;
