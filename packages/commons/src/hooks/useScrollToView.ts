import { useEffect, useRef } from "react";

interface IOption {
  behavior?: "smooth";
}
const useScrollToView = (option?: IOption) => {
  const targetRef = useRef<any>(null);
  useEffect(() => {
    targetRef.current && targetRef.current.scrollIntoView(option);
  }, [targetRef]);

  return targetRef;
};

export default useScrollToView;
