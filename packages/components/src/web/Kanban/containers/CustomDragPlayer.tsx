import { DATE_FORMAT } from "@tera/commons/constants/common";
import moment from "moment";
import { useDragLayer } from "react-dnd";
import { CalendarDaysOutlined, formatCurrency } from "tera-dls";

const CustomDragPlayer = () => {
  const { isDragging, currentOffset, item } = useDragLayer((monitor) => {
    return {
      isDragging: monitor.isDragging(),
      currentOffset: monitor.getSourceClientOffset(),
      item: monitor.getItem(),
    };
  });

  return isDragging && currentOffset ? (
    <div
      className="rounded-md bg-white border border-1 border-blue-200 w-[280px]"
      style={{
        transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    >
      <div className="p-2.5">
        <div className="flex justify-between items-center">
          <span className="font-semibold">{item?.name}</span>
        </div>
        <p className="mt-5 mb-2.5">Tên đối tượng</p>
        <div className="font-medium text-green-500">
          {formatCurrency(29000000)}
        </div>
        <div className="flex justify-between items-center mt-2.5">
          <div className="flex gap-2.5 items-center">
            <img
              src="http://genk.mediacdn.vn/2018/11/24/photo-1-1543033619457907305329.jpg"
              className="w-[18px] h-[18px] rounded-full"
            />
            <span>Nguyễn Văn A</span>
          </div>
          <div className="flex gap-2.5 items-center">
            <CalendarDaysOutlined className="w-[1rem] h-[1rem] stroke-yellow-500" />
            {moment().format(DATE_FORMAT)}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default CustomDragPlayer;
