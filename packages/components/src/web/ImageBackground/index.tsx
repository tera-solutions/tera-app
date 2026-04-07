import UploadFiles from "@tera/components/dof/UploadFiles";
import { IFileUpload } from "@tera/commons/interfaces";
import React, { useEffect, useState } from "react";
import { Image, PhotoOutlined, XCircleSolid } from "tera-dls";

interface IProps {
  value?: IFileUpload;
  onChange?: (val: IFileUpload) => void;
  isShowBtnDelete?: boolean;
  [key: string]: any;
}
const ImageBackground = (props: IProps) => {
  const { onChange, value, isShowBtnDelete, ...restProps } = props;
  const [image, setImage] = useState<IFileUpload>({});

  useEffect(() => {
    value && setImage(value);
  }, [value]);

  const handleUploadThumbnail = (file: IFileUpload) => {
    onChange(file);
    setImage(file);
  };

  const handleRemoveThumbnail = () => {
    setImage(null);
    onChange(null);
  };

  const nodeButtonDelete = (fn: () => void) => {
    return (
      <>
        <XCircleSolid
          className="cursor-pointer absolute z-50 w-6 right-[-10px] top-[-8px] fill-red-500"
          onClick={fn}
        />
        <div className="absolute -right-0.5 w-2 h-2 bg-white z-30" />
      </>
    );
  };

  return (
    <>
      {image?.url ? (
        <div className="relative w-fit">
          {isShowBtnDelete && nodeButtonDelete(handleRemoveThumbnail)}
          <Image
            src={image.url}
            imageClassName="h-[100px] w-[100px]"
            borderRadius={10}
            alt={image.name}
          />
        </div>
      ) : (
        <UploadFiles
          object_id="thumbnail"
          object_key="product"
          folder="product"
          fileList={[image]}
          onReceiveFiles={handleUploadThumbnail}
          isSingle
          maxSize={5}
          isView={false}
          isCount={false}
          accept=".png, .jpeg, .gif, .jpg"
          className="max-w-max"
          {...restProps}
        >
          <button
            className="w-[100px] h-[100px] border border-dashed border-gray-200 bg-gray-50 rounded-[10px] flex items-center justify-center"
            type="button"
          >
            <PhotoOutlined className="w-8 h-8 text-gray-500" />
          </button>
        </UploadFiles>
      )}
    </>
  );
};

export default React.memo(ImageBackground);
