import { useCallback, useEffect, useState } from "react";
import { IColumnType } from "../_interface";
import ShowedColumnItem from "./ShowedColumnItem";

interface IProps {
  value: Array<IColumnType>;
  onHideColumn: (val?) => void;
  onSortColumn: (dragColumn?: any, dropColumn?: any) => void;
}

const ShowedColumn = (props: IProps) => {
  const { value, onHideColumn, onSortColumn } = props;
  const [columns, setColumns] = useState<Array<IColumnType>>([]);

  useEffect(() => {
    value && setColumns(value);
  }, [value]);

  const handleMoveColumn = useCallback(
    (dragIndex: number, dropIndex: number): void => {
      setColumns((prev) => {
        const dragColumn = prev[dragIndex];
        const dropColumn = prev[dropIndex];
        const clonedColumn = [...prev];
        clonedColumn.splice(dragIndex, 1);
        clonedColumn.splice(dropIndex, 0, dragColumn);
        onSortColumn(dragColumn, dropColumn);
        return clonedColumn;
      });
    },
    [setColumns],
  );

  const sortedColumns: Array<IColumnType> = columns?.sort(
    (a, b) => a.order - b.order,
  );

  return (
    <>
      {sortedColumns.map((column: IColumnType, index: number) => {
        const { id, title, type } = column;
        return (
          <ShowedColumnItem
            {...{
              key: id,
              id,
              title,
              type,
              index,
              onHideColumn,
              onMoveColumn: handleMoveColumn,
              value: column,
            }}
          />
        );
      })}
    </>
  );
};

export default ShowedColumn;
