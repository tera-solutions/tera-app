import { useEffect } from "react";

interface IProps {
  ref: any;
  callback?: (event) => void;
  spacing?: number;
  enable?: boolean;
}
const useInfiniteScrollTable = ({
  ref,
  callback,
  spacing = 20,
  enable = true,
}: IProps) => {
  const handleCallback = (event): void => {
    const target: HTMLElement = event.target;
    if (
      target.scrollTop + target.clientHeight >=
      target.scrollHeight - spacing
    ) {
      callback && callback(event);
    }
  };

  useEffect(() => {
    if (!ref?.current || !enable) return;
    ref?.current.addEventListener("scroll", handleCallback);
    return () => {
      ref?.current &&
        ref?.current.removeEventListener("scroll", handleCallback);
    };
  }, [ref?.current, enable, handleCallback]);

  return {};
};

export default useInfiniteScrollTable;
