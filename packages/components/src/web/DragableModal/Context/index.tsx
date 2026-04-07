import { createContext, useState } from "react";
export const DraggableContext = createContext(null);

export interface IValue {
  getZIndex: (type: string) => void;
  register: (type: string) => void;
  onFocus: (type: string) => void;
  unRegister: (type: string) => void;
}
const DraggableModalContext = ({ children }) => {
  const [zIndexes, setZIndexes] = useState<any>([]);

  const getZIndex = (type: string) => {
    const data = zIndexes?.find((item) => item.type === type);
    return data?.z;
  };

  const register = (type: string) =>
    setZIndexes((prev) => {
      const newData = prev?.filter((item) => item.type !== type);
      newData.push({ type, z: 60 });
      return newData;
    });

  const unRegister = (type: string) =>
    setZIndexes((prev) => {
      const newData = prev?.filter((item) => item.type !== type);
      return newData;
    });

  const onFocus = (type: string) =>
    setZIndexes((prev) =>
      prev?.map((item) =>
        item.type === type ? { ...item, z: 61 } : { ...item, z: 60 },
      ),
    );

  return (
    <DraggableContext.Provider
      value={{ register, unRegister, getZIndex, onFocus }}
    >
      {children}
    </DraggableContext.Provider>
  );
};

export default DraggableModalContext;
