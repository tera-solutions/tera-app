import { useMutationLegacy } from "@tera/commons/hooks/tanstack";

import DefaultImage from "@tera/components/web/DefaultImage";
import { useStores } from "hooks/useStores";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { AuthApi } from "@tera/api";
import IconExit from "@tera/themes/images/Icons/IconExit.svg?react";
import { EnvelopeOutlined, Popover, notification } from "tera-dls";
import ModalResetPassword from "./ModalResetPassword";
import ModalUpdateInformation from "./ModalUpdateInformation";

const User = observer(() => {
  const {
    authStore: { user, clear },
    commonStore: { clear: clearCRM },
  } = useStores();

  const [modalResetPassword, setModalResetPassword] = useState<boolean>(false);
  const [modalUpdateInformation, setModalUpdateInformation] =
    useState<boolean>(false);

  const { mutate: onLogout } = useMutationLegacy({
    mutationFn: AuthApi.logout,
    onSuccess: () => {
      clear();
      clearCRM();
    },
    onError: (error: any) => {
      clear();
      clearCRM();
      const errorMessage = error?.msg;

      notification.error({
        message: errorMessage,
      });
    },
  });

  const Content = () => {
    const classItem =
      "p-[6px] [&:not(:last-child)]:border-b hover:bg-gray-50 cursor-pointer";
    return (
      <div className="p-2.5 rounded-2.5 w-[200px] flex flex-col gap-y-5">
        <div className="flex flex-col gap-y-[14px]">
          <h3 className="text-blue-800">Tài khoản</h3>
          <div className="flex flex-col gap-y-[7px]">
            <div className="flex items-center gap-x-[7px]">
              <DefaultImage
                src={user?.avatar_url}
                alt={user?.full_name}
                className="w-10 h-10 rounded-full border shrink-0"
              />
              <div className="flex flex-col justify-center gap-x-[5px] w-full">
                <span className="text-blue-500 line-clamp-1 break-word">
                  {user?.full_name}
                </span>
                <span className="text-[10px] text-gray-500 line-clamp-1 break-word">
                  {user?.role_name}
                </span>
              </div>
            </div>
            <p className="flex items-center gap-x-[5px]">
              <EnvelopeOutlined className="w-4 h-4" />
              <span className="truncate">{user?.email}</span>
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-blue-800 mb-[5px]">Khác</h3>
          <ul>
            <li
              className={classItem}
              onClick={() => setModalUpdateInformation(true)}
            >
              Chỉnh sửa thông tin
            </li>
            <li
              className={classItem}
              onClick={() => setModalResetPassword(true)}
            >
              Đổi mật khẩu
            </li>
          </ul>
        </div>
        <div>
          <p
            className="flex gap-x-[5px] text-red-500 itemns-center p-[6px] hover:bg-gray-50 cursor-pointer"
            onClick={() => onLogout()}
          >
            <IconExit />
            <span>Thoát</span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <Popover trigger="click" content={<Content />} placement="bottom-end">
        <div>
          <img
            src={user?.avatar_url}
            className="object-cover w-6 h-6 rounded-full"
            alt="avatar-user"
          />
        </div>
      </Popover>
      {modalResetPassword && (
        <ModalResetPassword
          open={modalResetPassword}
          onCancel={() => setModalResetPassword(false)}
          onSuccess={() => onLogout()}
        />
      )}
      {modalUpdateInformation && (
        <ModalUpdateInformation
          open={modalUpdateInformation}
          onCancel={() => setModalUpdateInformation(false)}
        />
      )}
    </>
  );
});

export default User;
