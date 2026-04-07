import { createContext, useContext, useMemo } from "react";
import { FormTeraRefProps, ILayoutForm } from "./_interfaces";

export interface TeraFormContextProps {
  form?: FormTeraRefProps;
  onChangeCustomTera?: (valueChecked: any) => void;
  fields?: any[];
  object_type?: string;
  object_id?: string;
  isLoading?: boolean;
  isCreate?: boolean;
  isUpdate?: boolean;
  layout?: ILayoutForm;
  children: any;
}

export interface TeraFormContextReturn {
  form?: FormTeraRefProps;
  onChangeCustomTera?: (valueChecked: any) => void;
  fields?: any[];
  object_type?: string;
  object_id?: string;
  isLoading?: boolean;
  isCreate?: boolean;
  isUpdate?: boolean;
  layout?: ILayoutForm;
}

export const FormContext = createContext({});

function TeraFormContext({
  form,
  onChangeCustomTera,
  fields,
  isCreate,
  isUpdate,
  object_type,
  object_id,
  isLoading,
  layout,
  children,
}: TeraFormContextProps) {
  const formReturn = useMemo(() => {
    return {
      form,
      onChangeCustomTera,
      fields,
      isCreate,
      isUpdate,
      isLoading,
      object_type,
      object_id,
      layout,
    };
  }, [
    form,
    onChangeCustomTera,
    fields,
    isCreate,
    isUpdate,
    isLoading,
    layout,
    object_type,
    object_id,
  ]);

  return (
    <FormContext.Provider value={formReturn}>{children}</FormContext.Provider>
  );
}

export function useTeraForm(): TeraFormContextReturn {
  return useContext(FormContext);
}
export default TeraFormContext;
