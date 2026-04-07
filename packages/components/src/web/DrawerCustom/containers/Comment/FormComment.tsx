import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  FormItem,
  Button,
  TextArea,
  Form,
  PaperClipSolid,
  PaperAirplaneSolid,
} from "tera-dls";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import UploadFile from "../Attachment/UploadFile";
const schema = yup.object().shape({
  content: yup.string().required("Vui lòng nhập trường này!"),
  file_upload: yup.mixed(),
});

export interface FormCommentFunctionProps {
  reset: () => void;
}

interface FormCommentProps {
  onSubmit: (value) => void;
  [propsButtonSend: string]: any;
}

function FormComment({ onSubmit, propsButtonSend }, ref) {
  const [fileList, setFileList] = useState([]);
  const {
    reset,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useImperativeHandle(ref, () => ({
    reset() {
      reset();
      setFileList([]);
    },
  }));

  const handleSubmitForm = (value) => {
    onSubmit(value);
  };

  const handleReceiveFiles = (files) => {
    setValue("file_upload", files);
    setFileList(files);
  };

  const handleRemoveFile = (file) => {
    const newListFile = fileList.filter((item) => item?.id !== file?.id);
    setFileList(newListFile);
    setValue("file_upload", newListFile);
  };

  return (
    <Form onSubmit={handleSubmit(handleSubmitForm)}>
      <FormItem isError={!!errors?.content} messages={errors?.content?.message}>
        <TextArea
          rows={3}
          style={{ resize: "none" }}
          placeholder="Vui lòng nhập"
          {...register("content")}
        />
      </FormItem>

      <div className="flex justify-between items-baseline">
        <div>
          <UploadFile
            fileList={fileList}
            folder="comment"
            object_key="comment"
            onReceiveFiles={(_, files) => {
              handleReceiveFiles(files);
            }}
            onRemove={handleRemoveFile}
          >
            <Button htmlType="button" icon={<PaperClipSolid />}>
              Đính kèm
            </Button>
          </UploadFile>
        </div>

        <Button
          htmlType="submit"
          icon={<PaperAirplaneSolid />}
          {...propsButtonSend}
        >
          Gửi
        </Button>
      </div>
    </Form>
  );
}

export default forwardRef<FormCommentFunctionProps, FormCommentProps>(
  FormComment,
);
