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
import { LessonService } from "@tera/modules";

/* Import: pages */
import { ILessonForm } from "pages/education/lesson/_interface";

const defaultValues: ILessonForm = {
  code: undefined,
  name: undefined,
  level: undefined,
  status: undefined,
};

const LessonForm = forwardRef<any, IFormProps>(
  ({ dataDetail, type = "create" }, ref) => {
    const { t } = useTranslation();

    const form = useForm<ILessonForm>({
      mode: "onChange",
      defaultValues: defaultValues,
    });

    const { reset, formState } = form;

    const { mutate: onSubmit, isPending } = LessonService.useUpsertLesson();

    useEffect(() => {
      if (dataDetail?.id) {
        reset(dataDetail);
      } else {
        reset(defaultValues);
      }
    }, [dataDetail, reset]);

    const handleSubmitForm = (values: ILessonForm) => {
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
              label={t("lesson.code")}
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
                  key: t("lesson.code"),
                })}
              />
            </FormTeraItem>
          </Col>

          <Col>
            <FormTeraItem
              label={t("lesson.name")}
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
                  key: t("lesson.name"),
                })}
              />
            </FormTeraItem>
          </Col>

          <Col>
            <FormTeraItem
              label={t("lesson.level")}
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
                  key: t("lesson.level"),
                })}
              />
            </FormTeraItem>
          </Col>

          <Col>
            <FormTeraItem label={t("lesson.status")} name="status" rules={[]}>
              <Input
                placeholder={t("form.enter_value", {
                  key: t("lesson.status"),
                })}
              />
            </FormTeraItem>
          </Col>
        </Row>
      </FormTera>
    );
  },
);

export default LessonForm;
