import { useCallback, useMemo, useRef, useState } from "react";
import KanbanColumn from "./containers/Column";
import useScroll from "@tera/commons/hooks/useScroll";

const defaultValues = [
  {
    id: 1,
    status: "todo",
    name: "Thông",
    order: 1,
  },

  {
    id: 2,
    status: "todo",
    name: "Phụng",
    order: 2,
  },
  {
    id: 3,
    status: "todo",
    name: "Hào",
    order: 3,
  },
  {
    id: 4,
    status: "todo",
    name: "Bình",
    order: 4,
  },
  {
    id: 5,
    status: "todo",
    name: "Doanh",
    order: 5,
  },
  {
    id: 6,
    status: "todo",
    name: "Khang",
    order: 6,
  },
  {
    id: 7,
    status: "todo",
    name: "Phuong",
    order: 7,
  },
  {
    id: 8,
    status: "todo",
    name: "Ngọc",
    order: 8,
  },
  {
    id: 9,
    status: "todo",
    name: "Trinh",
    order: 9,
  },
  {
    id: 10,
    status: "todo",
    name: "Trâm",
    order: 10,
  },
];

const KanbanBoard = () => {
  const [cacheValues, setCacheValues] = useState<any>(defaultValues);
  const parentRef = useRef(null);
  const { onScroll } = useScroll({ targetRef: parentRef });

  console.log("cacheValues", cacheValues);

  const handleDragEnd = (item) => {
    setCacheValues((prev) => {
      const index = prev?.findIndex((val) => val.id === item.id);
      if (index !== -1) prev[index] = { ...prev[index], dragging: false };
      const result = [...prev];
      return result;
    });
  };

  const handleDragOut = (dragItem) => {
    setCacheValues((prev) => {
      console.log(dragItem);

      // let copiedStateArray = [...prev];
      // copiedStateArray = copiedStateArray.map((item) => {
      //   if (
      //     dragItem.status !== item.status ||
      //     item.order <= dragItem.order ||
      //     item.id === dragItem.id
      //   ) {
      //     return item;
      //   }

      //   return {
      //     ...item,
      //     order: item.order - 1,
      //   };
      // });

      return prev;
    });
  };

  const handleMoveToOtherColumn = (value, status) => {
    setCacheValues((prev) => {
      const dragItem = prev.find((item) => item.id === value.id);
      const dragStatus = prev.filter((item) => item.status === status);

      return prev.map((item) => ({
        ...item,
        ...(item.id === dragItem.id && {
          status,
          order: dragStatus?.length + 1,
        }),
        ...(item.order > dragItem.order &&
          dragItem.status === item.status && {
            order: item.order - 1,
          }),
      }));
    });
  };

  const handleMoveIn = useCallback(
    (dragId: number, dropId: number, status: string): void => {
      console.log(dragId, dropId, status);

      setCacheValues((prevState) => {
        const dragIndex = prevState.findIndex((item) => item.id === dragId);
        const dropIndex = prevState.findIndex((item) => item.id === dropId);
        const dragItem = prevState[dragIndex];
        const dropItem = prevState[dropIndex];

        let copiedStateArray = [...prevState];

        if (dragItem.status !== dropItem.status) {
          copiedStateArray[dragIndex] = {
            ...dragItem,
            status: dropItem.status,
            dragging: true,
            order: dropItem.order,
          };

          copiedStateArray[dropIndex] = {
            ...dropItem,
            order: dropItem.order + 1,
          };
          //update new array
          copiedStateArray = copiedStateArray.map((item) => {
            if (
              status !== item.status ||
              item.order < dropItem.order + 1 ||
              item.id === dropId ||
              item.id === dragId
            ) {
              return item;
            }

            return {
              ...item,
              order: item.order + 1,
            };
          });
          //update old array
          copiedStateArray = copiedStateArray.map((item) => {
            if (dragItem.status !== item.status || item.order <= dragItem.order)
              return item;
            return {
              ...item,
              order: item.order - 1,
            };
          });
          return copiedStateArray;
        }

        if (dragItem.order > dropItem.order) {
          copiedStateArray[dragIndex] = {
            ...dragItem,
            order: dropItem.order,
          };
          copiedStateArray[dropIndex] = {
            ...dropItem,
            order: dropItem.order + 1,
          };
          copiedStateArray = copiedStateArray.map((item) => {
            if (
              status !== item.status ||
              item.order < dropItem.order + 1 ||
              item.id === dropId ||
              item.order > dragItem.order
            )
              return item;
            return {
              ...item,
              order: item.order + 1,
            };
          });
        } else {
          copiedStateArray[dragIndex] = {
            ...dragItem,
            order: dropItem.order,
          };
          copiedStateArray[dropIndex] = {
            ...dropItem,
            order: dropItem.order - 1,
          };
          copiedStateArray = copiedStateArray.map((item) => {
            if (
              status !== item.status ||
              item.order <= dropItem.order ||
              item.id === dropId ||
              item.order <= dragItem.order
            )
              return item;
            return {
              ...item,
              order: item.order + 1,
            };
          });
        }
        return copiedStateArray;
      });
    },
    [setCacheValues],
  );
  const height = useMemo(() => {
    const count = {};
    let maxCount = 0;
    let mostFrequent = null;

    cacheValues.forEach((item) => {
      if (count[String(item?.status)] === undefined) {
        count[String(item?.status)] = 1;
      } else {
        count[String(item?.status)]++;
      }

      if (count[String(item?.status)] > maxCount) {
        maxCount = count[String(item?.status)];
        mostFrequent = String(item?.status);
      }
    });
    return count[mostFrequent];
  }, [cacheValues]);

  return (
    <div className="mb-5 mt-2">
      <h1 className=" mb-2 text-2xl text-green-500 text-center">
        This is a Kanban
      </h1>
      <div
        className="bg-white shadow-lg rounded-2xl p-5  overflow-scroll max-h-[calc(100%-300px)]"
        ref={parentRef}
      >
        <div className="flex gap-5 relative">
          <KanbanColumn
            key={1}
            height={height}
            value={cacheValues}
            status={"todo"}
            onMoveIn={handleMoveIn}
            onMoveOut={handleMoveToOtherColumn}
            onDragEnd={handleDragEnd}
            ref={parentRef}
            onDragOut={handleDragOut}
            onScroll={onScroll}
          />
          <KanbanColumn
            height={height}
            key={2}
            value={cacheValues}
            status={"doing"}
            onMoveIn={handleMoveIn}
            onMoveOut={handleMoveToOtherColumn}
            onDragEnd={handleDragEnd}
            ref={parentRef}
            onDragOut={handleDragOut}
            onScroll={onScroll}
          />
          <KanbanColumn
            height={height}
            key={3}
            value={cacheValues}
            status={"testing"}
            onMoveIn={handleMoveIn}
            onMoveOut={handleMoveToOtherColumn}
            onDragEnd={handleDragEnd}
            ref={parentRef}
            onDragOut={handleDragOut}
            onScroll={onScroll}
          />
          <KanbanColumn
            height={height}
            key={4}
            value={cacheValues}
            status={"done"}
            onMoveIn={handleMoveIn}
            onMoveOut={handleMoveToOtherColumn}
            onDragEnd={handleDragEnd}
            ref={parentRef}
            onDragOut={handleDragOut}
            onScroll={onScroll}
          />
          <KanbanColumn
            height={height}
            key={5}
            value={cacheValues}
            status={"done1"}
            onMoveIn={handleMoveIn}
            onMoveOut={handleMoveToOtherColumn}
            onDragEnd={handleDragEnd}
            ref={parentRef}
            onDragOut={handleDragOut}
            onScroll={onScroll}
          />
          <KanbanColumn
            height={height}
            key={6}
            value={cacheValues}
            status={"done2"}
            onMoveIn={handleMoveIn}
            onMoveOut={handleMoveToOtherColumn}
            onDragEnd={handleDragEnd}
            ref={parentRef}
            onDragOut={handleDragOut}
            onScroll={onScroll}
          />
          <KanbanColumn
            height={height}
            key={7}
            value={cacheValues}
            status={"done3"}
            onMoveIn={handleMoveIn}
            onMoveOut={handleMoveToOtherColumn}
            onDragEnd={handleDragEnd}
            ref={parentRef}
            onDragOut={handleDragOut}
            onScroll={onScroll}
          />
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
