import UploadFiles from '@tera/components/dof/UploadFiles';
import { IFileUpload } from '@tera/commons/interfaces';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Image, PhotoOutlined, XCircleSolid } from 'tera-dls';

interface IProps {
  error?: boolean;
  value?: string[];
  onChange?: (val: string[]) => void;
  isShowBtnDelete?: boolean;
  width?: number;
  [key: string]: any;
}
const MultiImageBackground = (props: IProps) => {
  const { onChange, value, error, isShowBtnDelete, width, ...restProps } =
    props;
  const [fileList, setFileList] = useState<string[]>([]);

  useEffect(() => {
    value && setFileList(value);
  }, [value]);

  const handleUploadThumbnail = (file: IFileUpload) => {
    onChange([...fileList, file.url]);
    setFileList((prev) => [...prev, file.url]);
  };

  const handleRemoveFile = (url: any) => {
    const files = fileList.filter((item) => item !== url);
    onChange(files);
    setFileList(files);
  };

  return (
    <div className="flex gap-2.5 flex-wrap">
      {fileList.map((image, index) => (
        <div className="relative" key={index}>
          {isShowBtnDelete && (
            <XCircleSolid
              className="cursor-pointer absolute z-50 w-6 right-[-10px] top-[-8px] fill-red-500"
              onClick={() => handleRemoveFile(image)}
            />
          )}
          <Image
            src={image}
            alt={image}
            borderRadius={10}
            containerClassName={`w-[${width}px] h-[${width}px] object-cover rounded-md border overflow-hidden`}
            imageClassName="object-cover"
          />
        </div>
      ))}
      <UploadFiles
        object_id="thumbnail"
        object_key="product"
        folder="product"
        fileList={[]}
        onReceiveFiles={handleUploadThumbnail}
        isSingle
        maxSize={10}
        isView={false}
        isCount={false}
        accept=".png, .jpeg, .gif, .jpg"
        className="max-w-max"
        {...restProps}
      >
        <button
          className={classNames(
            `w-[${width}px] h-[${width}px] border border-dashed border-gray-200 bg-gray-50 rounded-[10px] flex items-center justify-center`,
            {
              'border-red-500': error,
            },
          )}
          type="button"
        >
          <PhotoOutlined className="w-8 h-8 text-gray-500" />
        </button>
      </UploadFiles>
    </div>
  );
};

export default React.memo(MultiImageBackground);
