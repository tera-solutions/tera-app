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
import { StudentService } from "@tera/modules";

/* Import: pages */
import { IStudentForm } from "pages/education/student/_interface";

const StudentForm = forwardRef<any, IFormProps>(
  ({ dataDetail, type = "create" }, ref) => {
    const { t } = useTranslation();
    const form = useForm<IStudentForm>({
      mode: "onChange",
      defaultValues: {
        code: "",
        name: "",
      },
    });

    const { reset, formState } = form;

    const { mutate: onSubmit, isPending } = StudentService.useUpsertStudent();

    useEffect(() => {
      if (dataDetail?.id) {
        reset(dataDetail);
      }
    }, [dataDetail, reset]);

    const handleSubmitForm = (values: IStudentForm) => {
      const params = {
        code: values.code?.trim(),
        name: values.name?.trim(),
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
              label={t("student.code")}
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
                placeholder={t("form.enter_value", { key: t("student.code") })}
                disabled={type === "detail"}
              />
            </FormTeraItem>
          </Col>
          <Col>
            <FormTeraItem
              label={t("student.name")}
              name="name"
              rules={[
                {
                  required: {
                    value: true,
                    message: t("validate.required"),
                  },
                },
                {
                  maxLength: {
                    value: 100,
                    message: t("validate.maxLength", { maxLength: 100 }),
                  },
                },
              ]}
            >
              <Input
                placeholder={t("form.enter_value", { key: t("student.name") })}
                disabled={type === "detail"}
              />
            </FormTeraItem>
          </Col>
        </Row>
      </FormTera>
    );
  },
);

export default StudentForm;
