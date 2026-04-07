import { useContext } from "react";
import { TableContext } from "./TeraTableContext";
import { ITeraTableProps } from "./_interfaces";

const useTeraTable = () => {
  return useContext(TableContext) as ITeraTableProps;
};

export default useTeraTable;
