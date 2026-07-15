/* Import: library */
import { useRef, useState } from "react";
import { Modal, Spin, Button } from "tera-dls";
import { useTranslation } from "react-i18next";

/* Import: packages */
import { messageWarning } from "@tera/commons/constants/message";
import useConfirm from "@tera/commons/hooks/useConfirm";
import { IFormRef, IModalProps } from "@tera/commons/interfaces";

/* Import: services */
import { RoomService } from "@tera/modules";

/* Import: pages */
import RoomForm from "./containers/RoomForm";
import RoomDetailContent from "./containers/RoomDetailContent";

const RoomFormModal = ({ open, onClose, id, type }: IModalProps) => {
  const [currentType, setCurrentType] = useState(type);
  const confirm = useConfirm();
  const { t } = useTranslation();
  const actionRef = useRef<IFormRef>(null);

  const isDetail = currentType === "detail";

  const { data, isLoading } = RoomService.useRoomDetail({ id });
  const room = data?.data?.room ?? data?.data;

  const handleCloseConfirm = async () => {
    if (!isDetail && actionRef.current?.isDirty?.()) {
      confirm.warning({
        title: t("common.exit_title"),
        content: (
          <>
            <p>{messageWarning.WARNING_EXIT_1}</p>
            <p>{messageWarning.WARNING_EXIT_2}</p>
          </>
        ),
        onOk: () => onClose(),
      });
    } else {
      onClose();
    }
  };

  const titleMap = {
    create: t("room.create"),
    update: t("room.update"),
    detail: t("room.detail"),
  };

  return (
    <Modal
      title={titleMap[currentType]}
      destroyOnClose
      closeIcon={false}
      width={"60%"}
      open={open}
      centered={true}
      footer={
        <div className="flex justify-end gap-2">
          {isDetail && (
            <Button
              onClick={() => setCurrentType("update")}
              className="rounded-xsm!"
            >
              {t("button.edit")}
            </Button>
          )}
          <Button onClick={handleCloseConfirm} className="rounded-xsm!">
            {t("button.cancel")}
          </Button>
          {!isDetail && (
            <Button
              type="primary"
              className="rounded-xsm!"
              onClick={() => actionRef?.current?.submit()}
            >
              {t("button.save")}
            </Button>
          )}
        </div>
      }
    >
      <Spin spinning={isLoading}>
        {isDetail ? (
          <div>
            {/* Profile card */}
            <div className="flex flex-col items-center py-4 bg-white rounded-md border border-gray-100 mb-3">
              <div className="w-20 h-20 rounded-lg mb-2 overflow-hidden border border-gray-100">
                {room?.avatar ? (
                  <img
                    src={room.avatar}
                    alt={room.room_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 text-xl font-bold">
                    {room?.room_name
                      ? room.room_name.charAt(0).toUpperCase()
                      : "?"}
                  </div>
                )}
              </div>
              <p className="text-sm font-bold text-gray-800">
                {room?.room_name ?? "—"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {room?.room_code ?? "—"}
              </p>
            </div>

            <RoomDetailContent room={room} />
          </div>
        ) : (
          <RoomForm
            ref={actionRef}
            dataDetail={room}
            type={currentType}
            onSuccess={onClose}
          />
        )}
      </Spin>
    </Modal>
  );
};

export default RoomFormModal;
