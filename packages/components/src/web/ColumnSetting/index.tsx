import { Button, Modal } from "tera-dls";
import ColumnSettingOverview from "./ColumnSettingOverview";

interface IProps {
  open: boolean;
  object_type: string;
  modalProps?: any;
  onClose: () => void;
}
const ColumnSetting = (props: IProps) => {
  const { open, object_type, onClose, modalProps = {} } = props;
  return (
    <Modal
      centered={true}
      title="CẤU HÌNH CỘT"
      open={open}
      width={"90%"}
      closeIcon={false}
      okText="Đồng ý"
      cancelText="Huỷ"
      {...modalProps}
      onCancel={onClose}
      footer={
        <div className="w-[100%]">
          <Button className="float-right rounded-xsm" onClick={onClose}>
            Đóng
          </Button>
        </div>
      }
      destroyOnClose={true}
    >
      <ColumnSettingOverview objectType={object_type} />
    </Modal>
  );
};

export default ColumnSetting;
