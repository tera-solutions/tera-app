import { messageError } from "@tera/commons/constants/message";
import {
  Button,
  Input,
  Dropdown,
  TrashOutlined,
  DocumentDuplicateOutlined,
  EllipsisVerticalOutlined,
  PaperClipOutlined,
  ArrowUpTrayOutlined,
  DocumentPlusOutlined,
  notification,
} from "tera-dls";

const UploadButtonUI = ({ textDisplay, file_url, file_name, mode, onDrop }) => {
  if (mode === "view" && !file_url) {
    return <div className="item-file">Không thể tải file hiển thị</div>;
  }
  return (
    <div className="item-file flex-1">
      {file_url ? (
        <>
          <object
            title={file_name}
            data={`${file_url}#page=1&zoom=85`}
            type="application/pdf"
            className="w-full h-full"
          >
            Không thể tải file hiển thị
          </object>
        </>
      ) : (
        <>
          <label
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            htmlFor="upload_pdf"
            className="w-full h-full block border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-blue-300 flex flex-col gap-y-3"
          >
            <DocumentPlusOutlined className="w-[50px] h-[50px]" />
            {textDisplay}
          </label>
        </>
      )}
    </div>
  );
};

interface UploadButtonProps {
  onUpload: (file) => void;
  disabled?: boolean;
  textDisplay?: string;
  onRemove: () => void;
  file: any;
  accept: string;
  mode: string;
}

const UploadButton = ({
  onUpload,
  disabled,
  textDisplay,
  onRemove,
  file,
  accept,
  mode,
}: UploadButtonProps) => {
  const _renderUploadButton = () => {
    const handleDrop = (e) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      onUpload(droppedFile);
    };
    return (
      <UploadButtonUI
        onDrop={handleDrop}
        textDisplay={textDisplay}
        file_url={file?.url}
        file_name={file?.name}
        mode={mode}
      />
    );
  };

  const handleDeleteFile = () => {
    if (!file?.id)
      return notification.error({
        message: messageError.DATA_NOT_FOUND,
      });

    const node = document.getElementById("upload_pdf") as HTMLInputElement;
    node.value = "";
    onRemove();
    return null;
  };

  const handleOpenNewTab = () => {
    if (!file?.url)
      return notification.error({
        message: messageError.DATA_NOT_FOUND,
      });

    window.open(file?.url, "_blank");
    return null;
  };

  const handleUploadNewFile = () => {
    document.getElementById("upload_pdf").click();
  };

  const dropdownItems = [
    {
      key: "1",
      icon: <DocumentDuplicateOutlined />,
      label: <a onClick={handleOpenNewTab}> Xem trong tab mới</a>,
    },
    {
      key: "2",
      icon: <TrashOutlined className="text-red-600" />,
      label: (
        <a className="text-red-600" onClick={handleDeleteFile}>
          Xóa file
        </a>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex-1 flex flex-col">
        {file?.id && (
          <div className="flex gap-x-2 justify-start items-center bg-inherit border border-[#f5f5f5] p-2">
            <span>{file?.name}</span>
            <Button
              onClick={handleUploadNewFile}
              icon={<ArrowUpTrayOutlined />}
              htmlType="button"
            >
              Tải lên
            </Button>
            <Dropdown menu={{ items: dropdownItems }} trigger="click">
              <Button
                className="p-2"
                type="alternative"
                htmlType="button"
                icon={<EllipsisVerticalOutlined />}
              />
            </Dropdown>
          </div>
        )}
        {!disabled && _renderUploadButton()}
      </div>

      <Input
        type="file"
        onChange={(e) => onUpload(e.target.files[0])}
        accept={accept}
        disabled={disabled}
        id="upload_pdf"
        className="w-full hidden"
      />
      <div
        className="p-2 flex justify-between items-center bg-[#fafafa] rounded-[3px] border border-[#f5f5f5] cursor-pointer"
        onClick={handleUploadNewFile}
      >
        <Button htmlType="button" type="alternative">
          File
        </Button>
        <p>
          {file?.name ? (
            file?.name
          ) : (
            <div className="flex items-center gap-x-1">
              <PaperClipOutlined className="w-[16px] h-[16px]" />
              <span>Upload file</span>
            </div>
          )}
        </p>
      </div>
    </div>
  );
};

export default UploadButton;
