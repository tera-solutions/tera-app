import { timeFormat } from "@tera/commons/constants/common";
import { Avatar, formatDate } from "tera-dls";
import image from "@tera/themes/images/uiNew/logo.png";
import customTwMerge from "tailwind-merge.config";
import HoverQuickView from "@tera/components/web/HoverQuickView";
function Item({ data }) {
  const colorActionType = {
    edited: "text-green-800",
    created: "text-blue-800",
    deleted: "text-red-800",
  };
  const create_by = data?.created_by;
  return (
    <div className="flex justify-between [&:not(:first-child)]:pt-4 relative">
      <div className="flex items-start gap-x-2.5">
        <Avatar
          src={create_by?.avatar_url || image}
          className="w-6 h-6 shrink-0"
        />
        <div className="space-y-2.5">
          <HoverQuickView
            avatarUrl={create_by?.avatar_url}
            email={create_by?.email}
            phone={create_by?.phone}
            name={create_by?.full_name}
            sub={create_by?.job_title_text?.title}
            code={create_by?.code}
          >
            {create_by?.full_name}
          </HoverQuickView>
          <p>
            <span className="text-gray-700 font-light italic">đã</span>{" "}
            <span
              className={customTwMerge(
                "font-medium",
                colorActionType[data?.action_type],
              )}
            >
              {data?.action_type_text}
            </span>{" "}
            {data?.action_type !== "uploaded" && (
              <span className="text-gray-700">{data?.object_type_text}</span>
            )}{" "}
            <span
              className={customTwMerge(
                "text-blue-600",
                data?.action_type === "uploaded" ? "break-all" : "break-words",
              )}
            >
              {data?.content}
            </span>
          </p>
          {/* <p className="text-blue-600 font-semibold">
            {data?.created_by?.full_name}
          </p>
          <p>
            {data?.action_type_text} {data?.object_type_text}{' '}
            <span className="text-blue-500">{data?.content}</span>{' '}
            {data?.source && 'cho'} {data?.object_sub_type_text}{' '}
            <span className="text-blue-50rgba(31, 41, 55, 1)0">
              {data?.source}
            </span>
          </p> */}
        </div>
      </div>
      <span className="text-gray-700 font-light italic">
        {formatDate(data?.created_at, timeFormat.time_full)}
      </span>
    </div>
  );
}

export default Item;
