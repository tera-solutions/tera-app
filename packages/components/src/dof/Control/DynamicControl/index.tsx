import React from "react";
import Input from "../Input";
import InputNumber from "../InputNumber";
import TextArea from "../TextArea";
import Select from "../Select";
import CheckBox from "../CheckBox";

interface DynamicControlProp {
  type?: "varchar" | "int" | "text" | "select" | "checkbox";
}

const DynamicControl = React.memo(({ type, ...props }: DynamicControlProp) => {
  switch (type) {
    case "varchar":
      return <Input {...props} />;
    case "int":
      return <InputNumber {...props} />;
    case "text":
      return <TextArea {...props} />;
    case "select":
      return <Select {...props} />;
    case "checkbox":
      return <CheckBox {...props} />;
    default:
      return <Input {...props} />;
  }
});

export default DynamicControl;
