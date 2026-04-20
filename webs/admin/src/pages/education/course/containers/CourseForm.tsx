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
level_id: undefined,
program_id: undefined,
duration: undefined,
price: undefined,
};

const CourseForm = forwardRef<any, IFormProps>(
  ({ dataDetail, type = "create" }, ref) => {
    const { t } = useTranslation();

    const form = useForm<ICourseForm>({
      mode: "onChange",
      defaultValues: defaultValues,
    });

    const { reset, formState } = form;

    const { mutate: onSubmit, isPending } =
      CourseService.useUpsertCourse();

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
        level_id: values.level_id || undefined,
        program_id: values.program_id || undefined,
        duration: values.duration || undefined,
        price: values.price || undefined,
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
                }
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
                }
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
              label={t("course.level_id")}
              name="level_id"
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
                  key: t("course.level_id"),
                })}
              />
            </FormTeraItem>
          </Col>

          <Col>
            <FormTeraItem
              label={t("course.program_id")}
              name="program_id"
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
                  key: t("course.program_id"),
                })}
              />
            </FormTeraItem>
          </Col>

          <Col>
            <FormTeraItem
              label={t("course.duration")}
              name="duration"
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
                  key: t("course.duration"),
                })}
              />
            </FormTeraItem>
          </Col>

          <Col>
            <FormTeraItem
              label={t("course.price")}
              name="price"
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
                  key: t("course.price"),
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
