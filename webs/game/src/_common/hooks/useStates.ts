import { useContext } from "react";
import { rootStoreContext } from "@tera/game/states/index";

export const useStates = () => useContext(rootStoreContext);
