import { useContext } from "react";
import { rootStoreContext } from "states/index";

export const useStores = () => useContext(rootStoreContext);
