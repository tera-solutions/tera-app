import { RefObject, useEffect, useState } from "react";

export type IScrollType = "none" | "toLeft" | "toRight" | "toBottom" | "toTop";

const startScroll = (
  ref: RefObject<HTMLDivElement>,
  type: IScrollType,
  speed: number,
) => {
  const typeObject = {
    toLeft: [-1 * speed, 0],
    toRight: [speed, 0],
    toBottom: [0, speed],
    toTop: [0, -1 * speed],
  };
  const value = typeObject[type];
  if (!value) return;

  return setInterval(() => ref?.current?.scrollBy(value[0], value[1]), 20);
};

interface IProps {
  targetRef: RefObject<HTMLDivElement>;
  speed?: number;
}
const useScroll = (value: IProps) => {
  const { targetRef, speed = 15 } = value;
  const [scrollType, setScrollType] = useState<IScrollType>("none");

  useEffect(() => {
    let intervalId;
    clearInterval(intervalId);
    if (!scrollType && !targetRef?.current) {
      clearInterval(intervalId);
      return;
    }

    if (scrollType === "none") {
      clearInterval(intervalId);
    }
    if (scrollType !== "none") {
      clearInterval(intervalId);
      intervalId = startScroll(targetRef, scrollType, speed);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [scrollType, targetRef?.current]);

  const handleSetScrollType = (type: IScrollType) => setScrollType(type);

  return { onScroll: handleSetScrollType };
};

export default useScroll;
