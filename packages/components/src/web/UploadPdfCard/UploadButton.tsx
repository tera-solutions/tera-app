import {
  Button,
  Input,
  PaperClipOutlined,
  DocumentOutlined,
  notification,
} from "tera-dls";
import ActionCUD from "../TableColumnCustom/ActionCUD";

interface UploadButtonProps {
  onUpload: (file) => void;
  disabled?: boolean;
  textDisplay?: string;
  onRemove: () => void;
  file: any;
  accept: string;
  mode?: string;
}

const UploadButton = ({
  onUpload,
  disabled,
  onRemove,
  file,
  accept,
}: UploadButtonProps) => {
  const handleDeleteFile = () => {
    if (!file?.id)
      return notification.error({ message: "Không tìm thấy file đính kèm" });

    const node = document.getElementById("upload_pdf") as HTMLInputElement;
    node.value = "";
    onRemove();
    return null;
  };

  const handleOpenNewTab = () => {
    if (!file?.url)
      return notification.error({ message: "Không tìm thấy file đính kèm" });

    window.open(file?.url, "_blank");
    return null;
  };

  const handleUploadNewFile = () => {
    document.getElementById("upload_pdf").click();
  };

  return (
    <div className="flex flex-col gap-5 h-full">
      <Input
        type="file"
        onChange={(e) => onUpload(e.target.files[0])}
        accept={accept}
        disabled={disabled}
        id="upload_pdf"
        className="w-full hidden"
      />
      <div>
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
        {file && (
          <div className="flex justify-between border p-2.5">
            <div className="flex items-center gap-x-1">
              <DocumentOutlined className="w-6 h-6" />
              <span>{file?.name}</span>
            </div>
            <ActionCUD
              classNames="gap-x-2"
              onClickDetail={handleOpenNewTab}
              onClickDelete={handleDeleteFile}
              activeButtons={["detail", "delete"]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadButton;
