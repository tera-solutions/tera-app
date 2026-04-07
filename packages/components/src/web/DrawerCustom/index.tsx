import React, { useMemo, useState } from "react";
import {
  Button,
  ChatBubbleLeftSolid,
  ClockSolid,
  DocumentSolid,
  Drawer,
  InformationCircleSolid,
  QuestionMarkCircleSolid,
  Tooltip,
} from "tera-dls";
import ActivityLog from "./containers/ActivityLog";
import Attachment from "./containers/Attachment";
import Comment from "./containers/Comment";
import classnames from "classnames";
import Question from "./containers/Question";
import NoData from "../NoData";
import Information from "./containers/Information";

const dataMenu = [
  {
    key: "info",
    label: "Thông tin",
    icon: <InformationCircleSolid className="w-6 h-6 text-white" />,
  },
  {
    key: "activity_log",
    label: "Lịch sử hoạt động",
    icon: <ClockSolid className="w-6 h-6 text-white" />,
  },
  {
    key: "attachment",
    label: "Tệp đính kèm",
    icon: <DocumentSolid className="w-6 h-6 text-white" />,
  },
  {
    key: "comment",
    label: "Thảo luận",
    icon: <ChatBubbleLeftSolid className="w-6 h-6 text-white" />,
  },
  {
    key: "question",
    label: "Hướng dẫn",
    icon: <QuestionMarkCircleSolid className="w-6 h-6 text-white" />,
  },
];

const defaultActiveKey = "info";

function DrawerCustom({ open, object_id, object_type, onClose }) {
  const [activeKey, setActiveKey] = useState<string>(defaultActiveKey);

  const renderBody = useMemo(() => {
    switch (activeKey) {
      case "info":
        return <Information />;
      case "activity_log":
        return <ActivityLog object_id={object_id} object_type={object_type} />;
      case "attachment":
        return <Attachment object_id={object_id} object_type={object_type} />;
      case "comment":
        return <Comment object_id={25} object_type={object_type} />;
      case "question":
        return <Question />;
      default:
        return <NoData />;
    }
  }, [activeKey, object_id, object_type]);

  const classTabs =
    "aspect-square w-full flex justify-center items-center cursor-pointer";

  const active = "bg-sky-500";

  const handleClose = () => {
    onClose();
    setActiveKey(defaultActiveKey);
  };

  return (
    <>
      {open && (
        <Drawer
          containerClassName="w-[680px] !p-0 !overflow-hidden"
          open={open}
          onClose={handleClose}
        >
          <div className="flex w-full h-[100vh]">
            <div className="flex-1 flex flex-col">
              <div className="p-5 flex-1 overflow-y-scroll">{renderBody}</div>
              <div className="py-3 px-5 border-t-2">
                <Button onClick={onClose}>Đóng</Button>
              </div>
            </div>
            <div className="w-[50px] h-full bg-sky-700 flex flex-col">
              {dataMenu.map((item) => (
                <Tooltip
                  title={item.label}
                  trigger="click"
                  placement="left"
                  key={item.key}
                >
                  <div
                    className={classnames(classTabs, {
                      [active]: activeKey === item.key,
                    })}
                    onClick={() => setActiveKey(item.key)}
                  >
                    {item.icon}
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
        </Drawer>
      )}
    </>
  );
}

export default DrawerCustom;
