import { useStores } from "hooks/useStores";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ExclamationTriangleOutlined,
  Modal,
} from "tera-dls";

const ModalConfirm = observer(() => {
  const {
    confirmStore: {
      content,
      onCancel,
      onOk,
      openConfirm,
      type,
      align,
      props,
      setCloseConfirm,
    },
  } = useStores();

  const typeIcon = {
    success: <CheckCircleOutlined color="#438558" />,
    warning: <ExclamationTriangleOutlined color="#F5C344" />,
    error: <ExclamationCircleOutlined color="#C9444A" />,
  };

  const classNameContent = classNames(
    "modal-confirm__content text-base w-full break-word",
  );
  const classNameContainer = classNames(
    "modal-confirm sm:w-[400px] xmd:w-[500px] w-full",
    props?.className,
  );

  return (
    <Modal
      destroyOnClose
      okText="Đồng ý"
      cancelText="Hủy"
      closeIcon={false}
      {...props}
      open={openConfirm}
      onOk={() => {
        if (typeof onOk === "function") onOk();
        setCloseConfirm();
      }}
      onCancel={() => {
        if (typeof onCancel === "function") onCancel();
        setCloseConfirm();
      }}
      className={classNameContainer}
    >
      <div className="modal-confirm__wrapper flex flex-col items-center gap-4 w-full">
        {type && (
          <div className="modal-confirm__icon w-20 h-20 m-auto font-thin">
            {typeIcon[type]}
          </div>
        )}
        <div className={classNameContent} style={{ textAlign: align }}>
          {content}
        </div>
      </div>
    </Modal>
  );
});

export default ModalConfirm;
