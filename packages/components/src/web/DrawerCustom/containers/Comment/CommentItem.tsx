import { formatDate } from "@tera/commons/utils";
import React, { useState } from "react";

import {
  ArrowUturnLeftSolid,
  Dropdown,
  EllipsisVerticalOutlined,
  HandThumbUpSolid,
  notification,
} from "tera-dls";
import FormComment from "./FormComment";
import { useMutationLegacy } from "@tera/commons/hooks/tanstack";
import CommentApi from "../../_api/comment";
import ErrorToast from "@tera/components/web/ToastCustom/ErrorsToast";
import { useQueryClient } from "@tanstack/react-query";

function CommentItem({ item }) {
  const queryClient = useQueryClient();
  const [isReply, setIsReply] = useState<boolean>(false);

  const handleReply = (value) => {
    console.log("reply value", value);
  };

  const { mutate } = useMutationLegacy({
    mutationFn: (variable: any) => CommentApi.delete(variable),
    onSuccess: (res) => {
      if (res?.code === 200) {
        notification.success({
          message: res?.msg,
        });
        queryClient.invalidateQueries({ queryKey: ["list-comment"] });
      }
    },
    onError: (error: any) => {
      ErrorToast({ errorProp: error?.data });
    },
  });
  const items = [
    {
      key: "delete",
      label: (
        <a className="text-red-500" onClick={() => mutate(item?.id)}>
          Xóa
        </a>
      ),
    },
  ];

  return (
    <div
      className="flex hover:bg-slate-100 px-3 py-2 rounded gap-x-3 items-start"
      key={item?.id}
    >
      <img
        src={item?.created_by?.avatar_url}
        alt={item?.created_by?.avatar_url}
        className="w-10 h-10 shrink-0"
      />

      <div className="w-full flex flex-col gap-y-1">
        <h3 className="flex gap-x-2 items-center justify-between">
          <div>
            <span className="text-base font-semibold text-green-600">
              {item?.created_by?.username}
            </span>

            {item?.type && (
              <span className="text-xs">
                {item?.type} <b>{item?.title}</b>
              </span>
            )}
          </div>

          <Dropdown
            containerClassName="z-[2000]"
            menu={{ items }}
            trigger="click"
          >
            <EllipsisVerticalOutlined className="w-6 h-6 cursor-pointer" />
          </Dropdown>
        </h3>

        <p className="text-xs text-gray-500">
          {formatDate(item?.created_at, "DD/MM/YYYY HH:mm:ss")}
        </p>
        <p>{item?.content}</p>
        {isReply ? (
          <FormComment onSubmit={handleReply} />
        ) : (
          <div className="flex justify-between items-center">
            <div
              className="flex w-max items-center hover:bg-slate-300 p-1 rounded cursor-pointer"
              onClick={() => setIsReply(true)}
            >
              <ArrowUturnLeftSolid className="w-5 h-5" /> <span>Trả lời</span>
            </div>
            <HandThumbUpSolid className="w-6 h-6 cursor-pointer hover:text-blue-500" />
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentItem;
