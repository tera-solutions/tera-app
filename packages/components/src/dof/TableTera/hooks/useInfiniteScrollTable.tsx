import _ from "lodash";
import { useCallback, useEffect } from "react";

interface IProps {
  objectType: string;
  callback?: (event) => void;
  spacing?: number;
  enable?: boolean;
}
const useInfiniteScrollTable = ({
  objectType,
  callback,
  spacing = 20,
  enable = true,
}: IProps) => {
  const tableElement: any = document.querySelector(`#${objectType}`);
  const scrollElement: any =
    tableElement && tableElement.querySelector(`.tera-table-body`);

  const handleCallback = useCallback(
    _.debounce((event): void => {
      const target: HTMLElement = event.target;
      if (
        target.scrollTop + target.clientHeight >=
        target.scrollHeight - spacing
      ) {
        callback && callback(event);
      }
    }, 200),
    [callback],
  );

  useEffect(() => {
    if (!scrollElement && enable) return;
    scrollElement && scrollElement.addEventListener("scroll", handleCallback);
    if (!enable) {
      scrollElement &&
        scrollElement?.removeEventListener("scroll", handleCallback);
    }
    return () => {
      scrollElement &&
        scrollElement.removeEventListener("scroll", handleCallback);
    };
  }, [scrollElement, enable, handleCallback]);

  return {};
};

export default useInfiniteScrollTable;
