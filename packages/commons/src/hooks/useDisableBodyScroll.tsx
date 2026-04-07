import { useEffect } from "react";

const useDisableBodyScroll = () => {
  useEffect(() => {
    const bodyElement: any = document.getElementsByTagName("BODY")[0];
    if (!bodyElement) return;
    bodyElement.style.overflow = "hidden";

    return () => {
      bodyElement.style.overflow = "auto";
    };
  }, []);
};

export default useDisableBodyScroll;
