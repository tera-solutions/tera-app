import { createContext, useContext, useMemo } from "react";
import { useTeraForm } from "./TeraFormContext";
import { IRuleValidation } from "./_interfaces";

export interface TeraItemContextProps {
  name: string;
  object_type?: string;
  object_id?: string;
  rules: IRuleValidation;
  config?: any;
  children: any;
}

export interface TeraItemContextReturn {
  item?: {
    name: string;
    object_type?: string;
    object_id?: string;
  };
  config?: any;
  rules?: IRuleValidation;
}

export const FormItemContext = createContext({});

function TeraItemContext({
  name,
  object_type,
  object_id,
  rules,
  config,
  children,
}: TeraItemContextProps) {
  const { fields } = useTeraForm();

  const itemReturn = useMemo(() => {
    return {
      item: {
        name,
        object_type,
        object_id,
      },
      config,
      rules,
    };
  }, [name, rules, config, object_type, object_id, fields]);

  return (
    <FormItemContext.Provider value={itemReturn}>
      {children}
    </FormItemContext.Provider>
  );
}

export function useTeraFormItem(): TeraItemContextReturn {
  return useContext(FormItemContext);
}
export default TeraItemContext;
