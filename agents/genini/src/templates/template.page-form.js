module.exports = function templateForm({ module, entity, Entity, fields }) {
  const ENTITY = entity.toLowerCase();

  function genDefaultValues(fields, type = "form") {
    return fields
      .map((f) => {
        let value = "undefined";

        // có thể custom theo type sau này
        if (type === "form") {
          value = "undefined";
        }

        return `${f.key}: ${value},`;
      })
      .join("\n");
  }

  const submitValues = fields
    .map((f) => {
      if (f.type === "string") {
        return `        ${f.key}: values.${f.key}?.trim() || undefined,`;
      }

      return `        ${f.key}: values.${f.key} || undefined,`;
    })
    .join("\n");

  const formItems = fields
    .map((f) => {
      const rules = [];

      if (f.required) {
        rules.push(`{
                  required: {
                    value: true,
                    message: t("validate.required"),
                  },
                }`);
      }

      return `
          <Col>
            <FormTeraItem
              label={t("${ENTITY}.${f.key}")}
              name="${f.key}"
              rules={[
                ${rules.join(",")}
              ]}
            >
              <Input
                placeholder={t("form.enter_value", {
                  key: t("${ENTITY}.${f.key}"),
                })}
              />
            </FormTeraItem>
          </Col>`;
    })
    .join("\n");

  return `/* Import: library */
import { useEffect, useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Col, Row } from "tera-dls";

/* Import: packages */
import { IFormProps } from "@tera/commons/interfaces";
import Input from "@tera/components/dof/Control/Input";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";

/* Import: services */
import { ${Entity}Service } from "@tera/modules";

/* Import: pages */
import { I${Entity}Form } from "pages/${module}/${entity}/_interface";

const defaultValues: I${Entity}Form = {
  ${genDefaultValues(fields)}
};

const ${Entity}Form = forwardRef<any, IFormProps>(
  ({ dataDetail, type = "create" }, ref) => {
    const { t } = useTranslation();

    const form = useForm<I${Entity}Form>({
      mode: "onChange",
      defaultValues: defaultValues,
    });

    const { reset, formState } = form;

    const { mutate: onSubmit, isPending } =
      ${Entity}Service.useUpsert${Entity}();

    useEffect(() => {
      if (dataDetail?.id) {
        reset(dataDetail);
      } else {
        reset(defaultValues);
      }
    }, [dataDetail, reset]);

    const handleSubmitForm = (values: I${Entity}Form) => {
      const params = {
${submitValues}
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
${formItems}
        </Row>
      </FormTera>
    );
  },
);

export default ${Entity}Form;
`;
};
