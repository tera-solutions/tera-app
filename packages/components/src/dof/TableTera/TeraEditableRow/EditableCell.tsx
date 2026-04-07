import React from "react";
import DynamicControl from "../../Control/DynamicControl";
import { FormTeraItem } from "../../FormTera";
import customTwMerge from "tailwind-merge.config";
import { TABLE_ROW_EXCEPT_COPE_CLASS } from "../constants";

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
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  inputType,
  children,
  dataIndex,
  inputProps,
  rules = [],
  className,
  ...restProps
}) => {
  return (
    <td {...restProps} className={customTwMerge(className, "!py-3")}>
      {editing ? (
        <FormTeraItem
          name={dataIndex}
          isUpdate={editing}
          rules={rules}
          label=""
          displayLabel={false}
          style={{ margin: 0 }}
        >
          <DynamicControl
            type={inputType}
            {...inputProps}
            {...{
              ...(inputType === "select" && {
                className: "bg-white",
                dropdownClassName: `${TABLE_ROW_EXCEPT_COPE_CLASS}`,
              }),
            }}
          />
        </FormTeraItem>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;
