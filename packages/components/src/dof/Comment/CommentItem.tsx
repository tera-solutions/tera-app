import { useMutationLegacy } from "@tera/commons/hooks/tanstack";

import ErrorToast from "@tera/components/web/ToastCustom/ErrorsToast";
import { getTimeRender } from "@tera/commons/utils";
import { useRef, useState } from "react";
import {
  ArrowUturnRightOutlined,
  Dropdown,
  DropdownItem,
  EllipsisHorizontalCircleOutlined,
  notification,
} from "tera-dls";
import DefaultImage from "../../components/DefaultImage";
import FormComment, { FormCommentFunctionProps } from "./FormComment";
import CommentApi from "./_api";
import { usePermission } from "@tera/commons/hooks/usePermission";
import { QUICK_ACTION_PERMISSION_KEY } from "@tera/commons/constants/permission";

function CommentItem({ item, object_id, onRefetch, onOpenChild }) {
  const [isReply, setIsReply] = useState<boolean>(false);
  const { hasPage } = usePermission();
  const form = useRef<FormCommentFunctionProps>(null);

  const { mutate } = useMutationLegacy({
    mutationFn: (variables: any) => CommentApi.create({ params: variables }),

    onSuccess: (res) => {
      if (res?.code === 200) {
        onRefetch();
        form?.current?.reset();
        notification.success({
          message: res?.msg,
        });
        setIsReply(false);
      }
    },

    onError: (error: any) => {
      ErrorToast({ errorProp: error?.data });
    },
  });

  const handleReply = (value) => {
    const variable = {
      object_id,
      content: value?.content,
      parent_id: item?.id,
    };
    mutate(variable);
  };

  const { mutate: deleteComment } = useMutationLegacy({
    mutationFn: (variable) => CommentApi.delete(variable),

    onSuccess: (res) => {
      if (res?.code === 200) {
        onRefetch();
        notification.success({
          message: res?.msg,
        });
      }
    },

    onError: (error: any) => {
      ErrorToast({ errorProp: error?.data });
    },
  });

  const itemsDropdown = (id): DropdownItem[] => {
    const arrData: DropdownItem[] = [];
    hasPage(QUICK_ACTION_PERMISSION_KEY.DRAWER_COMMUNICATION_DELETE) &&
      arrData.push({
        key: "delete",
        label: <span className="text-red-600 ">Xóa</span>,
        onClick: () => deleteComment(id),
      });
    return arrData;
  };

  const comment = item?.child_open ? item?.children : [item?.children[0]];

  const renderCountReply = (reply) => {
    if (reply?.length === 0) return;
    if (reply?.length > 99) return "99+";
    return reply?.length;
  };

  return (
    <div className="flex gap-x-2.5 justify-start" key={item?.id}>
      <div className="w-9 h-9 rounded-full bg-gray overflow-hidden shrink-0">
        <DefaultImage
          src={item?.created_by?.avatar_url}
          alt={item?.created_by?.avatar_url}
          className="w-full h-full"
        />
      </div>

      <div className="flex flex-col gap-y-2.5 flex-1">
        <div className="flex flex-col w-full gap-y-[5px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-1">
              <h3 className="font-bold text-gray-800 leading-4">
                {item?.created_by?.username}
              </h3>
              <span className="font-light	text-[10px]">
                {getTimeRender(item?.created_at)}
              </span>
            </div>
            {itemsDropdown(item?.id).length > 0 && (
              <Dropdown
                menu={{ items: itemsDropdown(item?.id) }}
                trigger="click"
              >
                <div className="w-5 h-5 cursor-pointer text-gray-500">
                  <EllipsisHorizontalCircleOutlined />
                </div>
              </Dropdown>
            )}
          </div>
          <p className="break-word">{item?.content}</p>
        </div>

        {isReply ? (
          <FormComment ref={form} onSubmit={handleReply} reply />
        ) : (
          <div className="flex gap-x-2.5 items-center">
            {hasPage(
              QUICK_ACTION_PERMISSION_KEY.DRAWER_COMMUNICATION_COMMENT,
            ) && (
              <div
                className="flex gap-x-2.5 items-center shrink-0 cursor-pointer"
                onClick={() => setIsReply(true)}
              >
                <ArrowUturnRightOutlined className="w-4 h-4" />
                <span className="font-bold">
                  {renderCountReply(item?.children)} Trả lời
                </span>
              </div>
            )}
            {/* <span className="font-bold">.</span>
            <div className="flex shrink-0 gap-x-1.5 items-center">
              <span>{item?.count_like || 0}</span>
              <HeartOutlined className="text-red-500 w-6 h-6 cursor-pointer " />
            </div> */}
          </div>
        )}

        {item?.children?.length > 0 && (
          <div className="pl-2.5 border-l-2 flex flex-col gap-y-2">
            {comment?.map((child) => (
              <div className="flex flex-col gap-y-1.5 flex-1">
                <div className="flex items-center  justify-between">
                  <div className="flex gap-x-2">
                    <div className="w-4 h-4 rounded-full bg-gray overflow-hidden shrink-0">
                      <DefaultImage
                        src={item?.created_by?.avatar_url}
                        alt={item?.created_by?.avatar_url}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex items-center gap-x-1">
                      <h3 className="font-bold text-gray-800">
                        {child?.created_by?.username}
                      </h3>
                      <span className="font-light	text-[10px] text-gray-500">
                        {getTimeRender(child?.created_at)}
                      </span>
                    </div>
                  </div>
                  {itemsDropdown(child?.id).length > 0 && (
                    <Dropdown
                      menu={{ items: itemsDropdown(child?.id) }}
                      trigger="click"
                    >
                      <div className="w-5 h-5 cursor-pointer text-gray-500">
                        <EllipsisHorizontalCircleOutlined />
                      </div>
                    </Dropdown>
                  )}
                </div>

                <p className="break-word">{child?.content}</p>
              </div>
            ))}
            {item?.children?.length > 1 && (
              <span
                className="text-blue-500 cursor-pointer hover:underline w-max "
                onClick={() => onOpenChild(item?.id, !item?.child_open)}
              >
                {item?.child_open ? "Ẩn bớt" : "Xem thêm"}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentItem;
