import { EmployeeText } from "@tera/components/web/TableColumnCustom/EmployeeText";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownRef, Tag, useHover } from "tera-dls";
import { generateObjectContent } from "../common";
import Description from "../components/Description";
import DropdownAction from "../components/DropdownAction";
import { usePermission } from "@tera/commons/hooks/usePermission";
import { ACTIVITY_TASK_URL } from "@tera/components/shared/Activity/containers/Task/url";
import { StatusTaskActivity } from "@tera/components/shared/Activity/constants";
import { QUICK_ACTION_PERMISSION_KEY } from "@tera/commons/constants/permission";

interface IProps {
  value: any;
  object_type?: string;
}

function Item(props: IProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { hasPage } = usePermission();
  const { value, object_type } = props;
  const navigate = useNavigate();
  const object = generateObjectContent(value);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<DropdownRef>(null);
  const menuRef = dropdownRef.current
    ? [ref, dropdownRef.current.dropdownRef]
    : ref;
  const { isHover } = useHover(menuRef);

  useEffect(() => {
    if (!isHover) {
      setOpenDropdown(false);
    }
  }, [isHover]);

  const items = () => {
    const arrData = [];
    hasPage(QUICK_ACTION_PERMISSION_KEY.DRAWER_TASK_VIEW_DETAIL) &&
      arrData.push({
        key: 1,
        label: "Xem",
        onClick: () => {
          navigate(`${ACTIVITY_TASK_URL.detail.path}/${value?.id}`);
        },
      });
    return arrData;
  };
  return (
    <div
      className="flex flex-col gap-y-2 [&:not(:first-child)]:pt-4 relative"
      ref={ref}
    >
      <Description
        title="Nhiệm vụ"
        value={<span className="text-blue-600 break-word">{value.title}</span>}
      />
      <Description
        title="Trạng thái"
        value={
          <Tag
            className="w-fit"
            color={StatusTaskActivity[value.status]?.color}
          >
            {StatusTaskActivity[value.status]?.text}
          </Tag>
        }
      />
      {object[object_type]?.subTitle?.[value?.relate_type]}
      <Description title="Loại nhiệm vụ" value={value.task_type} />
      <Description title="Mức độ ưu tiên" value={value.priority_level} />
      <Description
        title="Người thực hiện"
        value={
          <EmployeeText
            code={value?.staff_by?.code}
            name={value?.staff_by?.full_name}
          />
        }
      />
      <Description title="Thời gian bắt đầu" value={value?.time_start} />
      <Description title="Thời gian kết thúc" value={value?.time_end} />
      {items()?.length > 0 && (
        <DropdownAction
          open={openDropdown}
          items={items()}
          isHover={isHover}
          ref={dropdownRef}
          setOpen={setOpenDropdown}
        />
      )}
    </div>
  );
}

export default Item;
