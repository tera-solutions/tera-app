module.exports = ({ ENTITY, Entity, moduleName, fields }) => {
  const filterFields = fields
    .map(
      (col) => `
          <FormTeraItem label={t("${ENTITY}.${col.key}")} name="${col.key}">
            <Input placeholder={t("${ENTITY}.${col.key}")} />
          </FormTeraItem>`,
    )
    .join("");

  function genDefaultValues(fields, type = "form") {
    return fields
      .map((f) => {
        let value = "undefined";

        // có thể custom theo type sau này
        if (type === "form") {
          value = "undefined";
        }

        return `    ${f.key}: ${value},`;
      })
      .join("\n");
  }

  return `/* Import: library */
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Row } from "tera-dls";

/* Import: packages */
import Filter from "@tera/components/web/Filter";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import { Input } from "@tera/components/dof/Control";

/* Import: pages */
import { I${Entity}Form } from "pages/${moduleName}/${ENTITY}/_interface";

const defaultValues: I${Entity}Form = {
  ${genDefaultValues(fields)}
};

interface ${Entity}FilterProps {
  open: boolean;
  initialValue: I${Entity}Form;
  onClose: () => void;
  onFilter: (value: I${Entity}Form) => void;
}

const ${Entity}Filter = ({ open, onClose, onFilter, initialValue }: ${Entity}FilterProps) => {
  const { t } = useTranslation();
  const form = useForm<I${Entity}Form>();

  useEffect(() => {
    form.reset(initialValue);
  }, [initialValue, form]);

  const handleSubmit = form.handleSubmit((value) => {
    const data = Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, v?.trim() || undefined])
    );

    onFilter(data);
    onClose();
  });

  const handleReset = () => {
    form.reset(defaultValues);
    onFilter(defaultValues);
    onClose();
  };

  return (
    <Filter open={open} onClose={onClose} onFilter={handleSubmit}>
      <FormTera form={form} onSubmit={handleSubmit}>
        <Row className="grid gap-y-0">
          ${filterFields}
        </Row>

        <span className="text-red-500 cursor-pointer" onClick={handleReset}>
          {t("button.clear_filter")}
        </span>
      </FormTera>
    </Filter>
  );
};

export default ${Entity}Filter;
`;
};
