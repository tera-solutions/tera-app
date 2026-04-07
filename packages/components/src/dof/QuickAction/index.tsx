import { Badge, Tooltip } from "tera-dls";
import { dataMenu } from "./_constant";
import { classTabs } from "./common";
import useQuickAction from "./useQuickAction";

type QuickActionProps = {
  actions: any;
  object_id: number;
  object_type: string;
};

function QuickAction({ actions, object_id, object_type }: QuickActionProps) {
  const { openQuickAction } = useQuickAction();
  const actionsActive = () => {
    return dataMenu.filter((item) => actions?.includes(item?.key));
  };

  return (
    <div className="right-0 fixed top-[45px] z-50">
      <div className="py-4 bg-gray-50 hover:bg-blue-800 group flex flex-col h-[calc(100vh-40px)] shadow-[-2px_0_4px_0px_rgba(0,0,0,0.10)] transition-colors duration-300">
        {actionsActive().map((item) => (
          <Tooltip title={item.label} placement="left" key={item.key}>
            <div
              onClick={() =>
                openQuickAction({
                  object_id,
                  object_type,
                  actions,
                  active_key: item.key,
                })
              }
              className={classTabs}
            >
              <Badge
                count={item.key === "chat" ? 10 : 0}
                containerClassName="p-2.5 hover:bg-white/25 text-gray-700 group-hover:text-blue-50"
              >
                {item.icon}
              </Badge>
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

export default QuickAction;
