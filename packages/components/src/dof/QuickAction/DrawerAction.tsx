import NoData from "@tera/components/web/NoData";
import { useStores } from "@tera/stores/useStores";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useRef, useState } from "react";
import customTwMerge from "tailwind-merge.config";
import { Button, Drawer, PlusCircleOutlined, Tooltip } from "tera-dls";
import ActivityLog from "./ActivityLog";
import Appointment from "./Appointment";
import Attachment from "./Attachment";
import Call from "./Call";
import Chat from "./Chat";
import Comment from "./Comment";
import Mail from "./Mail";
import Mission from "./Mission";
import { dataMenu } from "./_constant";
import { classTabs } from "./common";
import { usePermission } from "@tera/states/hooks";
import NoPermission from "@tera/components/web/NoPermission";
import { QUICK_ACTION_PERMISSION_KEY } from "@tera/commons/constants/permission";

function DrawerAction() {
  const ref = useRef<HTMLDivElement>(null);
  const element = ref.current;
  const { hasPage } = usePermission();

  const [isScroll, setIsScroll] = useState(false);
  const {
    quickActionStore: {
      object_id,
      object_type,
      active_key,
      open,
      actions,
      setActiveKey,
      clearQuickAction,
      setOpenForm,
    },
  } = useStores();

  const renderBody = useMemo(() => {
    switch (active_key) {
      case "activity-log":
        return hasPage(QUICK_ACTION_PERMISSION_KEY.DRAWER_HISTORY_VIEW_LIST) ? (
          <ActivityLog
            isScroll={isScroll}
            object_id={object_id}
            object_type={object_type}
          />
        ) : (
          <NoPermission />
        );
      case "comment":
        return hasPage(
          QUICK_ACTION_PERMISSION_KEY.DRAWER_COMMUNICATION_VIEW_LIST,
        ) ? (
          <Comment object_id={object_id} object_type={object_type} />
        ) : (
          <NoPermission />
        );
      case "attachment":
        return hasPage(QUICK_ACTION_PERMISSION_KEY.DRAWER_FILE_VIEW_LIST) ? (
          <Attachment object_id={object_id} object_type={object_type} />
        ) : (
          <NoPermission />
        );
      case "mission":
        return hasPage(QUICK_ACTION_PERMISSION_KEY.DRAWER_TASK_VIEW_LIST) ? (
          <Mission
            isScroll={isScroll}
            object_id={object_id}
            object_type={object_type}
          />
        ) : (
          <NoPermission />
        );

      case "appointment":
        return hasPage(
          QUICK_ACTION_PERMISSION_KEY.DRAWER_APPOINTMENT_VIEW_LIST,
        ) ? (
          <Appointment
            isScroll={isScroll}
            object_id={object_id}
            object_type={object_type}
          />
        ) : (
          <NoPermission />
        );

      case "call":
        return hasPage(QUICK_ACTION_PERMISSION_KEY.DRAWER_CALL_VIEW_LIST) ? (
          <Call
            isScroll={isScroll}
            object_id={object_id}
            object_type={object_type}
          />
        ) : (
          <NoPermission />
        );

      case "mail":
        return <Mail />;
      case "chat":
        return <Chat />;
      default:
        return <NoData />;
    }
  }, [active_key, object_id, object_type, isScroll]);

  const active = "bg-white/25";

  const actionsActive = () => {
    return dataMenu.filter((item) => actions?.includes(item?.key));
  };

  const renderTitle = (activeKey) => {
    return dataMenu.find((item) => item.key === activeKey)?.label;
  };

  // const renderWidth = (active_key) => {
  //   switch (active_key) {
  //     case 'activity-log':
  //     case 'comment':
  //     case 'attachment':
  //     case 'mission':
  //     case 'appointment':
  //     case 'call':
  //     case 'chat':
  //     case 'mail':
  //       return 'w-[1800px]';
  //   }
  // };

  const flagPermission = () => {
    if (
      hasPage(QUICK_ACTION_PERMISSION_KEY.DRAWER_TASK_CREATE) &&
      hasPage(QUICK_ACTION_PERMISSION_KEY.DRAWER_TASK_VIEW_LIST) &&
      active_key === "mission"
    )
      return true;
    if (
      hasPage(QUICK_ACTION_PERMISSION_KEY.DRAWER_APPOINTMENT_CREATE) &&
      hasPage(QUICK_ACTION_PERMISSION_KEY.DRAWER_APPOINTMENT_VIEW_LIST) &&
      active_key === "appointment"
    )
      return true;
    if (
      hasPage(QUICK_ACTION_PERMISSION_KEY.DRAWER_CALL_CREATE) &&
      hasPage(QUICK_ACTION_PERMISSION_KEY.DRAWER_CALL_VIEW_LIST) &&
      active_key === "call"
    )
      return true;
    return false;
  };

  useEffect(() => {
    setTimeout(() => {
      if (!element) return;
      const handleScroll = () => {
        const isScroll = element.scrollTop > 0;
        setIsScroll(isScroll);
      };
      element.addEventListener("scroll", handleScroll);

      return () => {
        element.removeEventListener("scroll", handleScroll);
      };
    }, 0);
  }, [element]);

  return (
    <Drawer
      containerClassName={customTwMerge(
        "p-0 overflow-hidden transition-all w-[426px]",
        // renderWidth(active_key),
      )}
      open={open}
      onClose={clearQuickAction}
    >
      <div className="flex w-full h-[100vh]">
        <div className="pt-2.5 pb-4 flex-1 flex flex-col w-[386px]">
          <div className="tera-modal-header border-b px-4 flex items-center justify-between pb-2.5">
            <h3 className="text-base">{renderTitle(active_key)}</h3>
            {flagPermission() && (
              <Button
                onClick={() => setOpenForm(true)}
                className="bg-transparent text-blue-600 hover:bg-transparent focus:ring-0 focus:outline-0 p-0"
              >
                <div className="flex gap-x-1 items-center">
                  <PlusCircleOutlined className="w-4 h-4" />
                  <span>Thêm mới</span>
                </div>
              </Button>
            )}
          </div>
          <div
            className="flex-1 px-4 pb-4 overflow-y-scroll relative"
            ref={ref}
          >
            {renderBody}
          </div>
          <div className="border-t-2 pt-5 pr-5">
            <Button className="ml-auto" onClick={clearQuickAction}>
              Đóng
            </Button>
          </div>
        </div>
        <div className="py-4 bg-blue-800 flex flex-col shadow-[-2px_0_4px_0px_rgba(0,0,0,0.10)]">
          {actionsActive().map((item) => (
            <Tooltip title={item.label} placement="left" key={item.key}>
              <div
                className={customTwMerge(classTabs)}
                onClick={() => setActiveKey(item.key)}
              >
                <span
                  className={customTwMerge(
                    "p-2.5 hover:bg-white/25 text-blue-50",
                    active_key === item.key && active,
                  )}
                >
                  {item.icon}
                </span>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </Drawer>
  );
}

export default observer(DrawerAction);
