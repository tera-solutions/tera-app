import { useContext } from "react";
import { DraggableContext, IValue } from "../Context";

const useDraggableModal = () => {
  return useContext(DraggableContext) as IValue;
};

export default useDraggableModal;
