import Chat from "@tera/components/dof/Comment";
import React from "react";

function Comment({ object_type, object_id }) {
  return (
    <div className="mt-4">
      <Chat object_id={object_id} object_type={object_type} />
    </div>
  );
}

export default Comment;
