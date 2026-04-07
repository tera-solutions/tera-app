import { has } from "lodash";
import { createContext, useContext, useState } from "react";
// import { useStores } from './useStores';

export type MemberType =
  | "customer"
  | "supplier"
  | "customerLead"
  | "supplierLead";

interface IValue {
  openModalSelectPrintKey: boolean;
  openModalSelectEmployeeApply: boolean;

  listPrintKeySelect: any[];
  listEmployeeApplySelect: any[];
  title: string;

  setExcludeIds: (arrId: number[]) => void;
  excludeIds: number[];

  // PrintKey
  setListPrintKey: (itemSelect: any[]) => void;
  handleOpenModalPrintKey: (titleText?: string) => void;
  handleAddItemPrintKey: (itemSelect: any[]) => void;
  handleRemoveItemPrintKey: (idPrintKey: string | number) => void;

  // EmployeeApply
  setListEmployeeApplySelect: (itemSelect: any[]) => void;
  handleOpenModalEmployeeApply: (titleText?: string) => void;
  handleAddItemEmployeeApply: (itemSelect: any[]) => void;
  handleRemoveItemEmployeeApply: (idEmployeeApply: string | number) => void;

  closeModalPrintKey: () => void;
  closeModalEmployeeApply: () => void;

  clearStore: () => void;
}

export const HrmContext = createContext<IValue | null>(null);

export default function HrmProvider({ children }) {
  // --- isOpen ---
  const [openModalSelectPrintKey, setOpenModalSelectPrintKey] =
    useState<boolean>(false);
  const [openModalSelectEmployeeApply, setOpenModalSelectEmployeeApply] =
    useState<boolean>(false);

  // --- data ---
  const [title, setTitle] = useState<string>("");
  const [excludeIds, setExcludeIds] = useState([]);
  // -select data-
  const [listPrintKeySelect, setListPrintKeySelect] = useState<any[]>([]);
  const [listEmployeeApplySelect, setListEmployeeApplySelect] = useState<any[]>(
    [],
  );

  // ---------

  // --- function list ---

  const handleAddItemEmployeeApply = (listEmployeeApply: any[]) => {
    setListEmployeeApplySelect((preData) => [...preData, ...listEmployeeApply]);
    setOpenModalSelectEmployeeApply(false);
  };

  const handleRemoveItemEmployeeApply = (idEmployeeApply: string | number) => {
    const filterProduct = listEmployeeApplySelect.filter(
      (item) => item?.id !== idEmployeeApply,
    );
    setListEmployeeApplySelect(filterProduct);
  };

  const handleAddItemPrintKey = (listPrintKey: any[]) => {
    setListPrintKeySelect((preData) => [...preData, ...listPrintKey]);
    setOpenModalSelectPrintKey(false);
  };

  const setListPrintKey = (listPrintKey: any[]) => {
    setListPrintKeySelect(listPrintKey);
  };

  const handleRemoveItemPrintKey = (idProduct: string | number) => {
    const filterData = listPrintKeySelect.map((item) =>
      item?.id === idProduct ? { ...item, isDelete: true } : item,
    );
    const index = filterData.findIndex(
      (item) => item.id === idProduct && has(item, "isNew"),
    );

    if (index > -1) {
      filterData.splice(index, 1);
    }
    setListPrintKeySelect(filterData);
  };

  // --- open modal ---
  const handleOpenModalPrintKey = (titleText: string) => {
    setOpenModalSelectPrintKey(true);
    setTitle(titleText);
  };
  const handleOpenModalEmployeeApply = (titleText: string) => {
    setOpenModalSelectEmployeeApply(true);
    setTitle(titleText);
  };

  // --- close modal ---
  const closeModalPrintKey = () => {
    setOpenModalSelectPrintKey(false);
    setTitle("");
  };

  const closeModalEmployeeApply = () => {
    setOpenModalSelectEmployeeApply(false);
    setTitle("");
  };

  // --- clear store ---

  const clearStore = () => {
    setTitle("");
    setListPrintKeySelect([]);
    setListEmployeeApplySelect([]);
  };

  // ---

  const valueProps = {
    openModalSelectPrintKey,
    excludeIds,
    openModalSelectEmployeeApply,

    listPrintKeySelect,
    listEmployeeApplySelect,
    // listId,
    title,

    setExcludeIds,
    setListPrintKey,
    setListEmployeeApplySelect,

    // Print Key Modal
    handleOpenModalPrintKey,
    handleAddItemPrintKey,
    handleRemoveItemPrintKey,

    // Employee Apply Modal
    handleOpenModalEmployeeApply,
    handleAddItemEmployeeApply,
    handleRemoveItemEmployeeApply,

    closeModalPrintKey,
    closeModalEmployeeApply,
    clearStore,
  };

  return (
    <HrmContext.Provider value={valueProps}>{children}</HrmContext.Provider>
  );
}

export function useHrmClient() {
  return useContext(HrmContext);
}
