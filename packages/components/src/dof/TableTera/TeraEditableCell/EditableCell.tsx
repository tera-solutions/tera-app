import React, { useEffect } from "react";
import DynamicControl from "../../Control/DynamicControl";
import { FormTeraItem } from "../../FormTera";
import { useTeraForm } from "@tera/components/dof/FormTera/TeraFormContext";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: any;
  record: any;
  index: number;
  children: React.ReactNode;
  control: any;
  register: any;
  inputProps: any;
  rules: any;
  key: string | number;
  forRef: any;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  inputType,
  children,
  dataIndex,
  inputProps,
  rules = [],
  record,
  ...restProps
}) => {
  const { form } = useTeraForm();
  const { setValue } = form;

  const setValueCell = () => setValue(dataIndex, record[dataIndex]);

  useEffect(() => {
    editing && setValueCell();
  }, [record?.[dataIndex]]);

  return (
    <td {...restProps}>
      {editing ? (
        <FormTeraItem
          name={dataIndex}
          isUpdate={true}
          rules={rules}
          displayLabel={false}
          style={{ margin: 0 }}
        >
          <DynamicControl
            onBlur={async () => {
              const isOk = await form.trigger();
              isOk && form.submit();
              setValueCell();
            }}
            type={inputType}
            {...(typeof inputProps === "function"
              ? inputProps?.(record)
              : inputProps)}
            placeholder=""
          />
        </FormTeraItem>
      ) : (
        children
      )}
    </td>
  );
};

export default React.memo(EditableCell);
