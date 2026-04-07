import NoData from "@tera/components/web/NoData";
import React, { useMemo } from "react";
import CommentItem from "./CommentItem";

function ListComment({ data }) {
  const renderList = useMemo(() => {
    if (!data) return <NoData />;
    const listComment = data?.data;

    return (
      <>
        {listComment?.map((item) => (
          <CommentItem item={item} key={item?.id} />
        ))}
      </>
    );
  }, [data]);

  return <>{renderList}</>;
}

export default ListComment;
