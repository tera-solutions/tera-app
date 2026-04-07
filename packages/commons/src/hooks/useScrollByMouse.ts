import { useRef, useState } from "react";

interface IValue {
  isScrolling: boolean;
  targetRef: any;
  onMouseDown: (e: any) => void;
  onMouseMove: (e: any) => void;
  onMouseUp: (e: any) => void;
  onMouseLeave: (e: any) => void;
}

const useScrollByMouse = (): IValue | undefined => {
  const [scrolling, setScrolling] = useState<boolean>(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const mouseCoords = useRef({
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });

  const handleDragStart = (e: any): void => {
    if (!targetRef.current) return;
    const slider = targetRef.current;
    const startX = e.pageX - slider.offsetLeft;
    const startY = e.pageY - slider.offsetTop;
    const scrollLeft = slider.scrollLeft;
    const scrollTop = slider.scrollTop;
    mouseCoords.current = { startX, startY, scrollLeft, scrollTop };
    setScrolling(true);
  };

  const handleDrag = (e: any): void => {
    if (!scrolling || !targetRef.current) return;
    e.preventDefault();
    const slider = targetRef.current;
    const x = e.pageX - slider.offsetLeft;
    const y = e.pageY - slider.offsetTop;
    const walkX = (x - mouseCoords.current.startX) * 1.5;
    const walkY = (y - mouseCoords.current.startY) * 1.5;
    slider.scrollLeft = mouseCoords.current.scrollLeft - walkX;
    slider.scrollTop = mouseCoords.current.scrollTop - walkY;
  };

  const handleDragEnd = () => setScrolling(false);

  return {
    isScrolling: scrolling,
    targetRef,
    onMouseDown: handleDragStart,
    onMouseMove: handleDrag,
    onMouseUp: handleDragEnd,
    onMouseLeave: handleDragEnd,
  };
};

export default useScrollByMouse;
