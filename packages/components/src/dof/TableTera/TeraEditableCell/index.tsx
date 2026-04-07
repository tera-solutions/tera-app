import _ from "lodash";
import { useCallback, useEffect, useImperativeHandle, useState } from "react";
import { Table } from "tera-dls";
import { getRowKey } from "../Util";
import { flatAction } from "../constants";
import useTeraTable from "../useTeraTable";
import EditableRow from "./EditableRow";
import EditableCell from "./EditableCell";

const TeraEditableCell = () => {
  const {
    data,
    columns = [],
    editable = {},
    actionRef,
    rowKey,
    onRow,
    bodyComponents = {},
    ...restProps
  } = useTeraTable();

  const [dataSource, setDataSource] = useState<Array<any>>([]);

  const { onValuesChange, onDelete } = editable;

  useEffect(() => {
    if (data) {
      const usedValue = data.filter((item) => !item.isDelete);
      setDataSource(usedValue);
    }
  }, [data]);

  const handleDelete = useCallback(
    (targetKey: string | number): void => {
      const record = dataSource.find(
        (item) => String(getRowKey(rowKey, item)) === String(targetKey),
      );

      const flattenRecord = _.pickBy(
        record,
        (_, key) => !flatAction?.includes(key),
      );
      let newDataSource = [];
      if (!!record?.isNew) {
        newDataSource = dataSource.filter(
          (item) => String(getRowKey(rowKey, item)) !== String(targetKey),
        );
      } else {
        newDataSource = dataSource.map((item) =>
          String(getRowKey(rowKey, item)) === String(targetKey)
            ? { ...flattenRecord, isDelete: true }
            : item,
        );
      }

      setDataSource(newDataSource);
      onDelete && onDelete({ ...flattenRecord, isDelete: true });
      onValuesChange &&
        onValuesChange({ ...flattenRecord, isDelete: true }, newDataSource);
    },
    [onDelete, onValuesChange, dataSource],
  );

  useImperativeHandle(actionRef, () => {
    return {
      deleteRow: handleDelete,
    };
  }, [handleDelete]);
  const handleUpdateRow = useCallback(
    (value) => {
      const targetKey = String(getRowKey(rowKey, value));
      const stateRow = dataSource.find(
        (item) => String(getRowKey(rowKey, item)) === String(targetKey),
      );

      const removedFlat = _.pickBy(
        stateRow,
        (_, key) => !flatAction?.includes(key),
      );

      const newRow = {
        ...removedFlat,
        ...value,
        ...(stateRow?.isNew ? { isNew: true } : { isUpdate: true }),
      };
      const newDataSource = dataSource.map((item) => {
        const key = getRowKey(rowKey, item);
        if (String(key) === String(targetKey)) return newRow;
        return item;
      });

      onValuesChange && onValuesChange(newRow, newDataSource);
    },
    [dataSource, onValuesChange],
  );

  const mergedColumns: any = columns?.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => {
        return {
          inputType: col.type ?? "varchar",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: col.editable,
          inputProps: col.inputProps ?? {},
          rules: col.rules,
          record,
          onSave: handleUpdateRow,
        };
      },
    };
  });

  return (
    <>
      <Table
        {...restProps}
        components={{
          body: {
            ...bodyComponents,
            cell: EditableCell,
            row: EditableRow,
          },
        }}
        rowKey={rowKey}
        onRow={(record) => {
          const rows = onRow && onRow(record);
          return {
            ...rows,
            record,
            onSave: handleUpdateRow,
          };
        }}
        columns={mergedColumns}
        data={dataSource}
      />
    </>
  );
};

export default TeraEditableCell;
