import { useMutationLegacy, useQueryLegacy } from "@tera/commons/hooks/tanstack";
import React, { useRef, useState } from "react";
import CommentApi from "../../_api/comment";
import { Pagination, Spin, notification } from "tera-dls";

import ErrorToast from "@tera/components/web/ToastCustom/ErrorsToast";
import ListComment from "./ListComment";
import FormComment, { FormCommentFunctionProps } from "./FormComment";

function Comment({ object_type, object_id }) {
  const [pagination, setPagination] = useState({ currentPage: 1, limit: 10 });

  const formRef = useRef<FormCommentFunctionProps>(null);

  const {
    data,
    refetch,
    isPending: loadingComments, // isLoading trong v5 đổi thành isPending (hoặc giữ isLoading nếu dùng v4)
  } = useQueryLegacy({
    queryKey: ["list-comment", object_type, object_id, pagination.currentPage],
    queryFn: () =>
      CommentApi.getList({
        params: {
          page: pagination.currentPage,
          limit: pagination.limit,
          object_id: 25, // Lưu ý: object_id cứng hay dynamic?
          object_type: object_type,
        },
      }),
    staleTime: 300000,
    gcTime: 300000, // cacheTime trong v5 đã đổi tên thành gcTime
  });

  const { mutate, isPending: isLoading } = useMutationLegacy({
    mutationFn: (variables: any) => CommentApi.create({ params: variables }),
    onSuccess: (res) => {
      if (res?.code === 200) {
        notification.success({
          message: res?.msg,
        });
        formRef?.current?.reset();
        // Refetch danh sách comment sau khi tạo mới thành công
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
      file_upload: value?.file_upload,
    };
    mutate(variable);
  };

  const handleChangePagination = (page, pageSize) => {
    setPagination({
      ...pagination,
      currentPage: page,
      limit: pageSize,
    });
  };

  return (
    <div>
      <h2 className="font-semibold text-lg text-gray-700">Thảo luận</h2>
      <FormComment
        onSubmit={handleSubmitForm}
        propsButtonSend={{ loading: isLoading }}
        ref={formRef}
      />

      <div className="flex flex-col gap-y-1 mt-4">
        <Spin spinning={loadingComments}>
          <ListComment data={data} />
        </Spin>
        {data && (
          <Pagination
            current={data?.current_page}
            onChange={handleChangePagination}
            total={data?.total}
          />
        )}
      </div>
    </div>
  );
}

export default Comment;
