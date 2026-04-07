import { RefObject, useMemo, useRef } from "react";
import { FormTeraRefProps, defaultRef } from "./_interfaces";

function useFormTera(form?): [RefObject<FormTeraRefProps>, FormTeraRefProps] {
  const formRef = useRef<FormTeraRefProps>(null);

  const wrapForm = useMemo(() => {
    return (
      form ?? {
        ...defaultRef,
      }
    );
  }, [form, formRef]);
  return [formRef, formRef?.current ?? wrapForm];
}

export default useFormTera;
