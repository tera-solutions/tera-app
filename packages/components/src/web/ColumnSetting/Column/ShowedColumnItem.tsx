import { useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { Bars2Outlined, XMarkOutlined } from "tera-dls";
import { TYPE_HIDDEN_TABLE_COLUMN_DND } from "../_constant";
import CustomDragPlayer from "./CustomDragPlayer";

interface IProps {
  id: number;
  type: string;
  title: string;
  index: number;
  onHideColumn: (id: number) => void;
  onMoveColumn: (dragIndex: number, dropIndex: number) => void;
  value?: any;
}

export default (props: IProps) => {
  const { id, type, title, onHideColumn, index, onMoveColumn, value } = props;

  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: TYPE_HIDDEN_TABLE_COLUMN_DND,
      item: { id, dragIndex: index },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [index],
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: TYPE_HIDDEN_TABLE_COLUMN_DND,
      drop({ dragIndex }) {
        onMoveColumn(dragIndex, index);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [index, onMoveColumn],
  );

  const disableDraggableElement = (): void => {
    dragPreview(getEmptyImage());
  };

  useEffect(() => {
    disableDraggableElement();
  }, []);
  drop(drag(ref));
  return (
    <>
      <div
        className="flex gap-2.5 items-center cursor-pointer"
        ref={ref}
        style={{
          visibility: isDragging ? "hidden" : "inherit",
        }}
      >
        <Bars2Outlined
          className={`w-5 h-5 ${isOver ? "text-blue-700" : "text-blue-400"}`}
        />
        <div
          className={`flex-1 py-2 flex justify-between items-center px-2.5 outline outline-1 outline-solid text-sm font-normal rounded-[0.3125rem]	outline-[#E5E7EB] ${
            isOver && "bg-[#e8f5ff] outline-[#e8f5ff] "
          }`}
        >
          <span> {type === "action" ? "action" : title}</span>
          <XMarkOutlined
            onClick={() => onHideColumn(value)}
            width={"1rem"}
            height={"1rem"}
            className="cursor-pointer text-xs"
          />
        </div>
      </div>
      <CustomDragPlayer {...{ id, title, type, ref }} />
    </>
  );
};
