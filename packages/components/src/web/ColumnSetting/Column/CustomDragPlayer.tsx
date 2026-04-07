import { forwardRef } from "react";
import { useDragLayer } from "react-dnd";

interface IProps {
  id: number;
  type: string;
  title: string;
}

const CustomDragPlayer = forwardRef((props: IProps, ref: any) => {
  const { id, type, title } = props;
  const { current } = ref;
  const width = current?.getBoundingClientRect()?.width;
  const { isDragging, currentOffset, item } = useDragLayer((monitor) => {
    return {
      isDragging: monitor.isDragging(),
      currentOffset: monitor.getSourceClientOffset(),
      item: monitor.getItem(),
    };
  });

  return isDragging && currentOffset && item.id === id ? (
    <div
      className="fixed top-0 shadow-lg pointer-events-none left-0 bg-white py-[0.9375rem] flex justify-between items-center px-2.5 outline outline-1 outline-solid text-sm font-normal rounded-[0.3125rem] outline-[#E5E7EB]"
      style={{
        ...(width && { width: `${width}px` }),
        transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
      }}
    >
      <span> {type === "action" ? "action" : title}</span>
    </div>
  ) : null;
});

export default CustomDragPlayer;
