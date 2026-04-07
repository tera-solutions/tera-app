import { TQuickActions } from "@tera/commons/interfaces/router";
import React from "react";
import {
  ArchiveBoxOutlined,
  CalendarDaysOutlined,
  ClipboardDocumentListOutlined,
  PhoneOutlined,
} from "tera-dls";

interface IconItemActionProps {
  type: TQuickActions;
}

function IconItemAction({ type }: IconItemActionProps) {
  const classIcon = "w-2.5 h-2.5 text-white ";
  const renderIcon = (type: TQuickActions) => {
    switch (type) {
      case "mission":
        return <ClipboardDocumentListOutlined className={classIcon} />;
      case "appointment":
        return <CalendarDaysOutlined className={classIcon} />;
      case "call":
        return <PhoneOutlined className={classIcon} />;
      default:
        return <ArchiveBoxOutlined className={classIcon} />;
    }
  };
  return (
    <div className="h-5 w-5 flex items-center justify-center bg-blue-200 rounded-full shrink-0">
      {renderIcon(type)}
    </div>
  );
}

export default IconItemAction;
