import { Modal, XCircleOutlined } from "tera-dls";
import welcome from "@tera/themes/images/uiNew/welcome.png";
import { useQueryClient } from "@tanstack/react-query";
import { AuthApi } from "@tera/api";
import { useEffect } from "react";
import { useMutationLegacy } from "@tera/commons/hooks/useMutationLegacy";
const FirstLogin = ({ open, onClose }) => {
  const queryClient = useQueryClient();

  const { mutate: mutateDisable } = useMutationLegacy({
    mutationFn: () => AuthApi.disableWelcome(),
    onSuccess: () => {
      // Trong v5, invalidateQueries yêu cầu truyền object chứa queryKey
      queryClient.invalidateQueries({
        queryKey: ["get_profile"],
      });
    },
  });

  useEffect(() => {
    return () => {
      mutateDisable();
    };
  }, []);

  return (
    <Modal
      width={500}
      open={open}
      onCancel={onClose}
      okText="Đồng ý"
      cancelText="Huỷ"
      destroyOnClose
      footer={<div />}
      footerClassName="p-0"
    >
      <div className="flex justify-end mb-[16px]">
        <XCircleOutlined
          onClick={onClose}
          className="w-5 h-5 cursor-pointer text-red-500"
        />
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col gap-2.5 items-center">
          <img src={welcome} width={337} height={188} />
          <div>Chúc mừng bạn đã đăng ký dùng thử thành công</div>
        </div>
      </div>
    </Modal>
  );
};

export default FirstLogin;
