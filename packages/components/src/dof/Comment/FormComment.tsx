import React, { forwardRef, useImperativeHandle } from "react";
import { Button, PaperAirplaneSolid } from "tera-dls";
// import UploadFile from '../Attachment/UploadFile';
import FormTera, {
  FormTeraItem,
  useFormTera,
} from "@tera/components/dof/FormTera";
import TextArea from "@tera/components/dof/Control/TextArea";

export interface FormCommentFunctionProps {
  reset: () => void;
}

interface FormCommentProps {
  reply?: boolean;
  onSubmit: (value) => void;
  object_type: string;
  [propsButtonSend: string]: any;
}

function FormComment({ onSubmit, propsButtonSend, reply, object_type }, ref) {
  const [formRef] = useFormTera();

  useImperativeHandle(ref, () => ({
    reset() {
      formRef?.current?.reset();
    },
  }));

  const handleSubmitForm = (value) => {
    const params = {
      ...value,
      type: object_type,
    };
    onSubmit(params);
    formRef?.current?.reset();
  };

  const defaultValues = {
    content: "",
  };

  return (
    <FormTera
      ref={formRef}
      onSubmit={handleSubmitForm}
      defaultValues={defaultValues}
    >
      <FormTeraItem
        name="content"
        rules={[
          {
            required: "Vui lòng nhập trường này",
          },
          {
            maxLength: {
              value: 255,
              message: "Vượt quá số kí tự cho phép",
            },
          },
        ]}
      >
        <TextArea
          rows={reply ? 3 : 5}
          style={{ resize: "none" }}
          placeholder="Vui lòng nhập"
        />
      </FormTeraItem>

      <div className="flex justify-between items-baseline">
        <Button
          className="ml-auto p-2.5 bg-green-400 items-center"
          htmlType="submit"
          type="success"
          icon={<PaperAirplaneSolid />}
          {...propsButtonSend}
        >
          Gửi
        </Button>
      </div>
    </FormTera>
  );
}

export default forwardRef<FormCommentFunctionProps, FormCommentProps>(
  FormComment,
);
