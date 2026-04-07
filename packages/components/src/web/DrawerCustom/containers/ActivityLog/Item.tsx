import { formatDate } from "@tera/commons/utils";
import React, { useMemo } from "react";

function Item({ item }) {
  const noteData = item?.node || "";
  const renderNoteF = useMemo(() => {
    if (!noteData) return <></>;
    const splitData = noteData.split(";");

    if (splitData?.length > 0) {
      return splitData.map((obj, index) => {
        if (!obj) return <></>;
        return <li key={`item-${index.toString()}`}>{obj}</li>;
      });
    }

    return <></>;
  }, [noteData]);

  return (
    <div className="flex items-start p-2 rounded gap-x-10" key={item?.id}>
      <p className="text-sm font-medium">
        {formatDate(item?.created_at, "HH:mm")}
      </p>
      <p>
        <b className="text-green-700">{item?.created_by?.username}</b>{" "}
        <span>{item?.action_type_text}</span> <span>{item?.type_text}</span>{" "}
        <b>{item?.content}</b>
        {noteData?.length > 0 && <ul className="list-disc">{renderNoteF}</ul>}
      </p>
    </div>
  );
}

export default Item;
