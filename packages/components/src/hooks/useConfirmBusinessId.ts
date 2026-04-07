import { useEffect } from "react";
import { useStores } from "./useStores";

const useConfirmBusinessId = () => {
  const {
    commonStore: { setOpenModalLocationId },
  } = useStores();

  useEffect(() => {
    setOpenModalLocationId(true);
    return () => setOpenModalLocationId(false);
  }, []);
};

export default useConfirmBusinessId;
