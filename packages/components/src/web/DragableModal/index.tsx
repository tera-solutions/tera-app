import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useDrag, useDragLayer, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { ModalProps, ModalWindow } from "tera-dls";
import useDraggableModal from "./Hooks/useDraggableModal";

interface IProps extends ModalProps {
  open: boolean;
  type: string;
  title?: ReactNode | string;
  onClose: () => void;
}
const sizeObject = {
  large:
    "top-0 left-0 translate-x-0 translate-y-0 w-full drag-modal-fullscreen",
  normal: "w-4/5",
  small: "w-3/5",
};

const paddingX = 10;
const paddingY = 20;

const calculatePosition = (x: number, y: number, modalRef: any) => {
  if (!modalRef) return { clampedX: 0, clampedY: 0 };
  const maxX = window.innerWidth - modalRef.current.offsetWidth;
  const maxY = window.innerHeight - modalRef.current.offsetHeight;

  const clampedX = Math.max(0, Math.min(x, maxX));
  const clampedY = Math.max(0, Math.min(y, maxY));
  return { clampedX, clampedY };
};

const DraggableModal = (props: IProps) => {
  const { open, onClose, type, title, children, ...rest } = props;
  const { register, unRegister, getZIndex, onFocus } = useDraggableModal();
  const [position, setPosition] = useState<any>();
  const [size, setSize] = useState<"large" | "normal" | "small">("normal");
  const modalRef = useRef<any>(null);

  const isActive = (type: string): boolean => size === type;

  const [, drag, dragPreview] = useDrag(
    {
      type,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    },
    [type],
  );

  const [, drop] = useDrop(
    {
      accept: type,
    },
    [],
  );

  useEffect(() => {
    register(type);
    return () => {
      unRegister(type);
    };
  }, [type]);

  const { currentOffset, itemType } = useDragLayer((monitor) => {
    return {
      currentOffset: monitor.getSourceClientOffset(),
      itemType: monitor.getItemType(),
    };
  });

  useEffect(() => {
    if (!modalRef || !position) return;
    setPosition((prev) => {
      const { clampedX, clampedY } = calculatePosition(
        prev?.x,
        prev?.y,
        modalRef,
      );
      return { x: clampedX, y: clampedY };
    });
  }, [modalRef, size]);

  useEffect(() => {
    if (!currentOffset || itemType !== type) return;
    const { clampedX, clampedY } = calculatePosition(
      currentOffset?.x,
      currentOffset?.y,
      modalRef,
    );
    setPosition({ y: clampedY, x: clampedX });
  }, [currentOffset, itemType, modalRef]);

  useEffect(() => {
    dragPreview(getEmptyImage());
  }, [dragPreview]);

  const configProps = useMemo(() => {
    return {
      wrapClassName: `${
        position ? "top-0 left-0 translate-x-0 translate-y-0 w-full" : ""
      } ${sizeObject[size]}`,
      wrapProps: {
        style: {
          zIndex: getZIndex(type),
          ...(position && {
            transform: `translate(${(position?.x ?? 0) - paddingX}px, ${
              (position?.y ?? 0) - paddingY
            }px)`,
          }),
        },
      },
    };
  }, [position, getZIndex]);

  const handleUpdateSize = (size: any) => (): void => {
    setSize(size);
    setPosition((prev) => ({ x: prev?.x ?? 0, y: prev?.y ?? 0 }));
  };

  return (
    open && (
      <div onClick={() => onFocus(type)}>
        <ModalWindow
          destroyOnClose
          cancelText="Hủy"
          okText="Đồng ý"
          open={open}
          {...rest}
          {...configProps}
          onCancel={onClose}
          ref={modalRef}
          headerRender={
            <div
              ref={(ref) => {
                size !== "large" && drop(drag(ref));
              }}
              onDragStart={() => onFocus(type)}
              className="w-full cursor-move"
            >
              <div className="flex items-start justify-between rounded-t dark:border-gray-600 pt-[30px] pb-2.5 px-0 mx-[30px] my-0 border-b border-b-gray-200">
                <h3 className="w-full text-xl font-medium text-gray-900 uppercase dark:text-white flex gap-2.5">
                  <div className=" flex gap-1.5 h-auto items-end pb-2">
                    <div
                      onClick={handleUpdateSize("small")}
                      className={`w-[11px] h-[11px] rounded-xsm bg-gray-200 border-gray-400 border-2 hover:bg-blue-300 hover:border-blue-700 cursor-pointer ${
                        isActive("small") ? "!bg-blue-400 !border-blue-500" : ""
                      }`}
                    />
                    <div
                      onClick={handleUpdateSize("normal")}
                      className={`w-[13px] h-[13px] rounded-xsm bg-gray-200 border-gray-400 border-2  hover:bg-blue-300 hover:border-blue-700 cursor-pointer ${
                        isActive("normal")
                          ? "!bg-blue-400 !border-blue-500"
                          : ""
                      }`}
                    />
                    <div
                      onClick={handleUpdateSize("large")}
                      className={`w-[15px] h-[15px] rounded-xsm bg-gray-200 border-gray-400 border-2  hover:bg-blue-300 hover:border-blue-700 cursor-pointer ${
                        isActive("large") ? "!bg-blue-400 !border-blue-500" : ""
                      }`}
                    />
                  </div>
                  <div>{title}</div>
                </h3>
              </div>
            </div>
          }
        >
          {children}
        </ModalWindow>
      </div>
    )
  );
};

export default DraggableModal;
