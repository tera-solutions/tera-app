import { useQueryLegacy, useMutationLegacy } from "@tera/commons/hooks/tanstack";

import ErrorToast from "@tera/components/web/ToastCustom/ErrorsToast";
import { QUICK_ACTION_PERMISSION_KEY } from "@tera/commons/constants/permission";
import { usePermission } from "@tera/commons/hooks/usePermission";
import { useEffect, useRef, useState } from "react";
import { ChevronDownSolid, Spin, notification } from "tera-dls";
import CommentItem from "./CommentItem";
import FormComment, { FormCommentFunctionProps } from "./FormComment";
import CommentApi from "./_api";

function Chat({ object_type, object_id }) {
  const { hasPage } = usePermission();
  const [limit, setLimit] = useState<number>(5);
  const [listComment, setListComment] = useState([]);
  const formRef = useRef<FormCommentFunctionProps>(null);

  const {
    data,
    refetch,
    isLoading: loadingComments,
  } = useQueryLegacy({
    queryKey: ["list-chat", object_type, object_id, limit],

    queryFn: () => {
      const params = {
        limit: limit,
        object_id,
        type: object_type,
      };
      return CommentApi.getList({ params });
    },

    enabled: !!object_type,
    staleTime: 300000,
    gcTime: 300000,
  });

  const { mutate, isLoading } = useMutationLegacy({
    mutationFn: (variables: any) => CommentApi.create({ params: variables }),

    onSuccess: (res) => {
      if (res?.code === 200) {
        notification.success({
          message: res?.msg,
        });
        formRef?.current?.reset();
        refetch();
      }
    },

    onError: (error: any) => {
      ErrorToast({ errorProp: error?.data });
    },
  });

  const handleSubmitForm = (value) => {
    const variable = {
      content: value?.content,
      object_id: object_id,
      type: object_type,
    };
    mutate(variable);
  };

  const handleOpenChild = (id, isOpen) => {
    const newList = listComment.map((item) => {
      if (item?.id === id) {
        return {
          ...item,
          child_open: isOpen,
        };
      }
      return item;
    });
    setListComment(newList);
  };

  useEffect(() => {
    if (data) {
      const listId = listComment.map((item) => item?.id);
      const newList = data?.data?.map((item) => {
        const idx = listId.indexOf(item?.id);
        if (idx !== -1)
          return {
            ...item,
            child_open: listComment[idx]?.child_open,
          };
        return {
          ...item,
          child_open: false,
        };
      });

      setListComment(newList);
    }
  }, [data]);

  return (
    <div className="flex flex-col gap-y-[15px]">
      {hasPage(QUICK_ACTION_PERMISSION_KEY.DRAWER_COMMUNICATION_COMMENT) && (
        <FormComment
          object_type={object_type}
          onSubmit={handleSubmitForm}
          propsButtonSend={{ loading: isLoading }}
          ref={formRef}
        />
      )}
      {data?.total > 0 && (
        <div className="flex items-center gap-x-2.5">
          <span>{data?.total} bình luận</span>
          <span className="flex-1 h-[1px] bg-gray-400" />
        </div>
      )}

      <Spin spinning={loadingComments}>
        <div className="flex flex-col gap-y-[15px]">
          {listComment?.map((item) => (
            <CommentItem
              item={item}
              key={item?.id}
              object_id={object_id}
              onRefetch={refetch}
              onOpenChild={handleOpenChild}
            />
          ))}
        </div>
      </Spin>

      {data?.to < data?.total && (
        <div
          className="text-blue-600 mx-auto hover:underline cursor-pointer font-bold flex gap-x-2.5 items-center"
          onClick={() => setLimit((prev) => prev + 5)}
        >
          <span>Xem thêm</span>
          <ChevronDownSolid className=" w-[12px] h-[12px]" />
        </div>
      )}
    </div>
  );
}

export default Chat;
