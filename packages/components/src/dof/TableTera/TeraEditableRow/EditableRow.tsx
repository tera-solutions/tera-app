import React, { useEffect, useRef } from "react";
import { TABLE_ROW_EXCEPT_COPE_CLASS } from "../constants";

const EditableRow: React.FC<any> = (props) => {
  const { onSubmit, editing, saveOnClickOut, ...restProps } = props;
  const ref = useRef(null);

  const handleOutsideClick = (e) => {
    const exceptElements: any = document.querySelectorAll(
      `.${TABLE_ROW_EXCEPT_COPE_CLASS}`,
    );
    if (ref.current && !ref.current.contains(e.target)) {
      let clickedInsideExceptElement = false;
      exceptElements.forEach((element) => {
        if (element.contains(e.target)) clickedInsideExceptElement = true;
      });
      !clickedInsideExceptElement && editing && onSubmit && onSubmit();
    }
  };

  useEffect(() => {
    if (!saveOnClickOut) return;
    editing && document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [editing, saveOnClickOut]);

  return <tr {...restProps} ref={ref} />;
};

export default React.memo(EditableRow);
