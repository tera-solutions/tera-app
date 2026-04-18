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
import { CourseService } from "@tera/modules";

/* Import: pages */
import { ICourseForm } from "pages/education/course/_interface";

const defaultValues: ICourseForm = {
  code: undefined,
  name: undefined,
  level: undefined,
  status: undefined,
};

const CourseForm = forwardRef<any, IFormProps>(
  ({ dataDetail, type = "create" }, ref) => {
    const { t } = useTranslation();

    const form = useForm<ICourseForm>({
      mode: "onChange",
      defaultValues: defaultValues,
    });

    const { reset, formState } = form;

    const { mutate: onSubmit, isPending } = CourseService.useUpsertCourse();

    useEffect(() => {
      if (dataDetail?.id) {
        reset(dataDetail);
      } else {
        reset(defaultValues);
      }
    }, [dataDetail, reset]);

    const handleSubmitForm = (values: ICourseForm) => {
      const params = {
        code: values.code?.trim() || undefined,
        name: values.name?.trim() || undefined,
        level: values.level || undefined,
        status: values.status?.trim() || undefined,
      };

      onSubmit({ id: dataDetail?.id, params });
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
              label={t("course.code")}
              name="code"
              rules={[
                {
                  required: {
                    value: true,
                    message: t("validate.required"),
                  },
                },
              ]}
            >
              <Input
                placeholder={t("form.enter_value", {
                  key: t("course.code"),
                })}
              />
            </FormTeraItem>
          </Col>

          <Col>
            <FormTeraItem
              label={t("course.name")}
              name="name"
              rules={[
                {
                  required: {
                    value: true,
                    message: t("validate.required"),
                  },
                },
              ]}
            >
              <Input
                placeholder={t("form.enter_value", {
                  key: t("course.name"),
                })}
              />
            </FormTeraItem>
          </Col>

          <Col>
            <FormTeraItem
              label={t("course.level")}
              name="level"
              rules={[
                {
                  required: {
                    value: true,
                    message: t("validate.required"),
                  },
                },
              ]}
            >
              <Input
                placeholder={t("form.enter_value", {
                  key: t("course.level"),
                })}
              />
            </FormTeraItem>
          </Col>

          <Col>
            <FormTeraItem label={t("course.status")} name="status" rules={[]}>
              <Input
                placeholder={t("form.enter_value", {
                  key: t("course.status"),
                })}
              />
            </FormTeraItem>
          </Col>
        </Row>
      </FormTera>
    );
  },
);

export default CourseForm;
