import { checkFileType } from "@tera/commons/utils";
import { Modal } from "tera-dls";
import NoData from "../NoData";

function ModalPreview({ handleClose, open, file }) {
  const renderLayout = () => {
    const file_type = checkFileType(file?.name);
    if (!file?.url) return <NoData />;
    switch (file_type) {
      case "image":
        return <img src={file.url} alt={file?.name} />;
      case "pdf":
        return (
          <object
            title={file.name}
            data={`${file.url}#page=1&zoom=85`}
            type="application/pdf"
          >
            Không thể hiển thị file
          </object>
        );

      default:
        return <NoData />;
    }
  };
  return (
    <Modal
      title="Xem trước"
      open={open}
      className="modal-preview"
      cancelText="Đóng"
      okButtonProps={{ className: "hidden" }}
      onCancel={handleClose}
    >
      <div className="modal-preview__body">{renderLayout()}</div>
    </Modal>
  );
}

export default ModalPreview;
