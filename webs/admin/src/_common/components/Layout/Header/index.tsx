import {
  // Placement,
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react-dom";
import { CHAT_URL } from "@tera/components/shared/Chat/url";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  BellOutlined,
  ChatBubbleOvalLeftEllipsisOutlined,
  EnvelopeOutlined,
  PhoneOutlined,
} from "tera-dls";
import Application from "./Application";
import User from "./User";
import ModalViewMoreNotification from "./UserNotification/ModalViewMoreNotification";
import UserNotification from "./UserNotification/index";

const Header = () => {
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const { refs, floatingStyles } = useFloating<HTMLDivElement>({
    placement: "bottom-start",
    whileElementsMounted: autoUpdate,
    middleware: [offset(5), flip(), shift()],
  });

  const handleModal = () => {
    setOpenNotification(false);
    setIsOpenModal(true);
  };

  const handleClose = () => {
    setIsOpenModal(false);
  };

  const listIcon = [
    <PhoneOutlined className="w-6 h-6" />,
    <div
      className="cursor-pointer"
      onClick={() => {
        navigate(CHAT_URL);
      }}
      ref={refs.setReference}
    >
      <ChatBubbleOvalLeftEllipsisOutlined className="w-6 h-6" />
    </div>,
    <EnvelopeOutlined onClick={() => navigate("/mail")} className="w-6 h-6" />,
    <div
      className="cursor-pointer"
      onClick={() => {
        setOpenNotification(true);
      }}
      ref={refs.setReference}
    >
      <BellOutlined className="w-6 h-6" />
    </div>,
  ];
  listIcon;
  return (
    <>
      <ul className="flex flex-row gap-2.5 pr-2.5">
        <li>
          <Application />
        </li>
        {/* {listIcon &&
          listIcon.map((item, key) => (
            <Badge
              key={key}
              count={10}
              className="w-[15px] h-[15px] bg-red-400 text-white text-[8px] p-0"
            >
              <li className="text-gray-500">{item}</li>
            </Badge>
          ))} */}
        <li>
          <User />
        </li>
      </ul>
      {createPortal(
        openNotification && (
          <>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className="z-50 w-[35%]"
            >
              <UserNotification handleModal={handleModal} />
            </div>
          </>
        ),
        document.body,
      )}

      {openNotification && (
        <div
          onClick={() => setOpenNotification(false)}
          className="absolute z-49 w-full h-full"
        />
      )}
      {isOpenModal && (
        <ModalViewMoreNotification
          isOpen={isOpenModal}
          handleClose={handleClose}
        />
      )}
    </>
  );
};
export default Header;
