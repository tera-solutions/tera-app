import { DATE_FORMAT } from "@tera/commons/constants/common";
import _ from "lodash";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { CalendarDaysOutlined, TrashOutlined, formatCurrency } from "tera-dls";

export const CARD_TYPE = "card";

interface IProps {
  value: any;
  onMoveIn?: (dragId: number, dropId: number, status: string) => any;
  onDragEnd?: (item) => void;
  isDefault?: boolean;
  style?: any;
  onDragOut: (val) => void;
}
const KanbanCard = (props: IProps) => {
  const {
    onMoveIn,
    value,
    isDefault = false,
    style = {},
    onDragEnd,
    onDragOut,
  } = props;
  const ref = useRef(null);

  const [action, setAction] = useState<string>("dragIn");

  const handleDragging = useCallback(
    _.debounce((monitor) => {
      const mouseLocation = monitor.getClientOffset();
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      if (
        mouseLocation?.x - hoverBoundingRect?.left > 0 &&
        hoverBoundingRect?.right - mouseLocation?.x > 0 &&
        mouseLocation?.y - hoverBoundingRect?.top > 0 &&
        hoverBoundingRect?.bottom - mouseLocation?.y > 0
      ) {
        return;
      }
      setAction("dragOut");
    }, 100),
    [ref],
  );
  useEffect(() => {
    if (action === "dragIn") {
    }
    if (action === "dragOut") {
      onDragOut(value);
    }
  }, [action, value]);

  const [, drop] = useDrop(
    () => ({
      accept: CARD_TYPE,
      hover(itemDrag: any, monitor) {
        if (!ref.current || isDefault) {
          return;
        }
        const hoverId = value.id;
        const dragId = itemDrag.id;

        const dragOrder = itemDrag.order;
        const dropOrder = value.order;
        if (hoverId === dragId) {
          setAction("dragIn");
          return;
        }

        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        if (dragOrder < dropOrder && hoverClientY < hoverMiddleY) {
          return;
        }
        if (dragOrder > dropOrder && hoverClientY > hoverMiddleY) {
          return;
        }

        onMoveIn(dragId, hoverId, value?.status);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [value, ref, onMoveIn],
  );

  const [{ isDragging }, drag, dragPreview] = useDrag(
    {
      type: CARD_TYPE,
      item: { ...value },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      // isDragging: (monitor) => {
      //   if (value.id !== monitor.getItem().id) return false;
      //   !monitor.didDrop() && handleDragging(monitor);
      //   return true;
      // },
      end: (item) => {
        onDragEnd(item);
      },
    },
    [value, onDragEnd, handleDragging],
  );

  useEffect(() => {
    dragPreview(getEmptyImage());
  }, [dragPreview]);

  !isDefault && drop(drag(ref));

  return (
    <>
      <div
        className={`rounded-md  w-full ${
          isDefault ? " kanban-default " : "cursor-pointer "
        }
          ${isDragging || !!value.dragging ? "bg-gray-500" : "bg-white"}
        `}
        style={{
          ...style,
        }}
        ref={ref}
      >
        <div
          className={`p-2.5 ${
            isDragging || !!value.dragging ? " invisible" : "visible"
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="font-semibold">{value?.name}</span>
            <TrashOutlined className="w-[1rem] h-[1rem] stroke-red-600 cursor-pointer" />
          </div>
          <p className="mt-5 mb-2.5">Tên đối tượng</p>
          <div className="font-medium text-green-500">
            {formatCurrency(29000000)}
          </div>
          <div className="flex justify-between items-start mt-2.5">
            <div className="flex gap-2.5 items-start">
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
    </>
  );
};

export default KanbanCard;
