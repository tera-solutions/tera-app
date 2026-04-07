import _ from "lodash";
import { RefObject, forwardRef, useCallback, useRef } from "react";
import { useDrop } from "react-dnd";
import { PlusCircleOutlined, Row, formatCurrency } from "tera-dls";
import KanbanCard, { CARD_TYPE } from "../Card";
import CustomDragPlayer from "../CustomDragPlayer";

interface IProps {
  value: any;
  status: string;
  onMoveIn?: (dragId: number, dropId: number, status: string) => any;
  onMoveOut?: (val, val2) => any;
  onDragEnd?: (item) => void;
  height: number;
  onDragOut?: (val) => void;
  onScroll?: (val) => void;
}

const KanbanColumn = forwardRef(
  (props: IProps, ref: RefObject<HTMLDivElement>) => {
    const {
      value,
      status,
      onMoveIn,
      onMoveOut,
      onDragEnd,
      height,
      onDragOut,
      onScroll,
    } = props;
    const usedValue = value?.filter((item) => item?.status === status);
    const targetRef = useRef<HTMLDivElement>(null);

    const handleScroll = useCallback(
      _.throttle((monitor) => {
        const clientOffset = monitor.getClientOffset();
        const targetRect = ref.current.getBoundingClientRect();

        if (targetRect?.bottom - clientOffset?.y < 50) {
          onScroll("toBottom");
          return;
        }
        if (clientOffset?.y - targetRect?.top < 150) {
          onScroll("toTop");
          return;
        }
        if (targetRect?.right - clientOffset?.x < 200) {
          onScroll("toRight");
          return;
        }
        if (clientOffset?.x - targetRect?.left < 200) {
          onScroll("toLeft");
          return;
        }
        onScroll("none");
      }, 200),
      [onScroll],
    );
    const [{ isOver }, drop] = useDrop(
      {
        accept: CARD_TYPE,
        collect: (monitor) => ({
          isOver: monitor.isOver(),
        }),
        hover: (_, monitor) => {
          if (!targetRef?.current) return;
          handleScroll(monitor);
        },
        drop(dragItems: any) {
          if (!targetRef.current) return;
          const value = usedValue?.find((item) => item.id === dragItems.id);
          if (value?.status !== status) {
            onMoveOut(dragItems, status);
          }
          onScroll("none");
        },
      },
      [onMoveOut, status, usedValue, targetRef, handleScroll],
    );

    const handleDragEnd = (item) => {
      onScroll("none");
      onDragEnd && onDragEnd(item);
    };

    drop(targetRef);

    return (
      <>
        <div
          className="min-w-[300px] max-w-[300px] h-full flex-1"
          ref={targetRef}
        >
          <Row className="w-full bg-blue-100 p-2.5 rounded-md flex justify-between text-blue-600 items-center">
            <span className="font-medium">Tiêu đề</span>
            <span className="px-2.5 py-1 rounded-full bg-green-200">
              {usedValue?.length ?? 0}
            </span>
          </Row>
          <Row className="border-t-[1px] border-gray-300 my-4" />
          <Row className="rounded-xl bg-gray-200 h-full">
            <div
              className={`px-2.5 py-5 h-full ${isOver ? "bg-indigo-50" : ""}`}
            >
              <div className="flex justify-between">
                <span className="text-blue-600 font-medium text-base">
                  {formatCurrency(29000000)}
                </span>
                <PlusCircleOutlined className="w-[1.5rem] h-[1.5rem] stroke-green-500 cursor-pointer" />
              </div>
              <div
                className="pt-6 flex flex-col gap-7 w-ful relative"
                style={{
                  height: (height ?? 1) * 150,
                }}
              >
                {usedValue?.length > 0 && (
                  <>
                    {usedValue?.map((item) => (
                      <KanbanCard
                        key={item?.id}
                        value={item}
                        onDragOut={onDragOut}
                        onMoveIn={onMoveIn}
                        onDragEnd={handleDragEnd}
                        style={{
                          transition: "250ms",
                          position: "absolute",
                          transform:
                            "translate(0, " + (item.order - 1) * 150 + "px)",
                        }}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
          </Row>
        </div>
        <CustomDragPlayer />
      </>
    );
  },
);

export default KanbanColumn;
