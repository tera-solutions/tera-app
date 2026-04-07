import FormTera, { useFormTera } from "@tera/components/dof/FormTera";
import _ from "lodash";
import {
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  BookmarkOutlined,
  PencilSquareOutlined,
  Table,
  TrashOutlined,
  XMarkOutlined,
  mergeArrayObjectByKeyDependOnNewArray,
} from "tera-dls";
import { getRowKey } from "../Util";
import { IRecordCreator } from "../_interfaces";
import { OPERATION_KEY, flatAction } from "../constants";
import useTeraTable from "../useTeraTable";
import EditableCell from "./EditableCell";
import EditableRow from "./EditableRow";
import { useForm } from "react-hook-form";

const TeraEditableRow = () => {
  const {
    data,
    columns = [],
    editable = {},
    recordCreatorProps = {},
    formObjectType,
    actionRef,
    rowKey,
    onRow,
    buttonEditIndicator,
    buttonDeleteIndicator,
    buttonSaveIndicator,
    buttonCancelIndicator,
    loading,
    bodyComponents = {},
    ...restProps
  } = useTeraTable();
  const [forRef] = useFormTera();
  const form = useForm({ shouldFocusError: false, mode: "onChange" });
  const updateFormValues = (data?) =>
    data ? forRef?.current?.reset(data) : forRef?.current?.reset();

  const [dataSource, setDataSource] = useState<Array<any>>([]);
  const [editingKey, setEditingKey] = useState<string | undefined>();
  const {
    onEditableKeyChange,
    editableKey,
    onValuesChange,
    actionRender,
    onUpdate,
    onAdd,
    onDelete,
    saveOnClickOut = false,
    isDisabled,
  } = editable;

  const { position = "top", record } = recordCreatorProps as IRecordCreator;

  useEffect(() => {
    setEditingKey(editableKey);
  }, [editableKey]);

  useEffect(() => {
    onEditableKeyChange && onEditableKeyChange(editingKey);
  }, [editingKey]);

  useEffect(() => {
    if (data) {
      const usedValue = data.filter((item) => !item.isDelete);
      setDataSource(usedValue);
      updateFormValues(usedValue);
      setEditingKey(undefined);
    }
  }, [data]);

  const isEditing = (record): boolean =>
    String(getRowKey(rowKey, record)) &&
    String(getRowKey(rowKey, record)) === String(editingKey);

  const handleAddNewData = (record): void => {
    const newRecord = { ...record };
    const newData = [...dataSource].map((data) =>
      String(getRowKey(rowKey, data)) === String(getRowKey(rowKey, record))
        ? newRecord
        : data,
    );
    setEditingKey(undefined);
    setDataSource(newData);
    onAdd && onAdd(newRecord);
    onValuesChange && onValuesChange(newRecord, newData);
  };

  const handleUpdateData = (record): void => {
    const newData = _.cloneDeep(dataSource);
    const index = newData?.findIndex(
      (item) =>
        String(getRowKey(rowKey, record)) === String(getRowKey(rowKey, item)),
    );
    const newRecord = { ...record };
    if (index > -1) {
      newData.splice(index, 1, {
        ...newRecord,
      });
    }
    setEditingKey(undefined);
    setDataSource(newData);
    onUpdate && onUpdate(newRecord);
    onValuesChange && onValuesChange(newRecord, newData);
  };

  const handleSubmitForm = (value): void => {
    const { isNew, isUpdate } = value;

    const data = _.pickBy(value, (_, key) => !flatAction?.includes(key));
    if (isNew) {
      if (isNew && isUpdate) {
        handleUpdateData({ ...data, isNew: true });
        return;
      }
      if (isNew) {
        handleAddNewData({ ...data, isNew: true });
        return;
      }
    }
    if (isUpdate) {
      handleUpdateData({ ...data, isUpdate: true });
      return;
    }
    handleUpdateData({ ...data, isUpdate: true });
  };

  const handleEdit = (record): void => {
    const convertedObj = _.mapValues(record, (value) =>
      typeof value === "number" ? _.toString(value) : value,
    );
    updateFormValues({ ...convertedObj, isUpdate: true });
    setEditingKey(getRowKey(rowKey, record));
  };

  const handleCancel = (): void => {
    const newDataSource = dataSource.filter((item) => !item.isRemove);
    setDataSource(newDataSource);
    updateFormValues();
    setEditingKey(undefined);
  };

  const handleDelete = (targetKey: string | number, index?: number): void => {
    const record = dataSource.find(
      (item) => String(getRowKey(rowKey, item)) === String(targetKey),
    );
    const newDataSource = dataSource.map((item) =>
      String(getRowKey(rowKey, item)) === String(targetKey)
        ? { ...item, isDelete: true }
        : item,
    );

    const filteredData = newDataSource.filter((item) =>
      item.isNew && item.isDelete ? false : true,
    );

    setDataSource(filteredData);
    updateFormValues();
    onDelete && onDelete({ ...record, isDelete: true }, index);
    onValuesChange &&
      onValuesChange({ ...record, isDelete: true }, filteredData);
  };

  const handleAdd = useCallback(
    _.debounce(() => {
      setEditingKey((prev) => {
        if (prev) return prev;
        const newRecord = {
          id: Math.floor(Math.random() * Date.now()),
          ...(record?.(dataSource?.length) ?? {}),
        };
        if (!getRowKey(rowKey, newRecord)) return undefined;
        if (position === "top") {
          setDataSource((prev: Array<any>) => {
            return [{ ...newRecord, isNew: true, isRemove: true }, ...prev];
          });
        }
        if (position === "bottom") {
          setDataSource((prev: Array<any>) => {
            return [...prev, { ...newRecord, isNew: true, isRemove: true }];
          });
        }
        updateFormValues({ ...newRecord, isNew: true, isRemove: true });
        return getRowKey(rowKey, newRecord);
      });
    }, 200),
    [setEditingKey, setDataSource, dataSource],
  );

  useImperativeHandle(actionRef, () => {
    return {
      editRow: handleEdit,
      cancelRow: handleCancel,
      saveRow: forRef?.current?.submit,
      addRow: handleAdd,
      deleteRow: handleDelete,
      trigger: () => forRef.current.trigger(),
    };
  }, [handleAdd, handleEdit, handleCancel, handleDelete, forRef]);

  const defaultAction = (record, index): ReactNode => {
    const editable = isEditing(record);
    return editable ? (
      <div className="flex gap-2.5 justify-center">
        {buttonCancelIndicator ? (
          buttonCancelIndicator
        ) : (
          <XMarkOutlined
            className="text-red-500 cursor-pointer w-5"
            onClick={handleCancel}
          />
        )}
        {buttonSaveIndicator ? (
          buttonSaveIndicator
        ) : (
          <BookmarkOutlined
            className="text-green-500 cursor-pointer w-5"
            onClick={() => forRef?.current?.submit()}
          />
        )}
      </div>
    ) : (
      <div className="flex gap-2.5 justify-center">
        <a
          className={` ${
            !!editingKey || isDisabled
              ? "text-[#00000040] cursor-not-allowed"
              : "text-green-600 cursor-pointer"
          }`}
          onClick={() => !editingKey && handleEdit({ ...record, index })}
        >
          {buttonEditIndicator ? (
            buttonEditIndicator
          ) : (
            <PencilSquareOutlined
              onClick={() => !editingKey && actionRef?.current?.editRow(record)}
              className={` ${
                !!editingKey || isDisabled
                  ? "text-[#00000040] cursor-not-allowed"
                  : "text-blue-600 cursor-pointer"
              }`}
              width={"1rem"}
              height={"1rem"}
            />
          )}
        </a>
        <a
          className={` ${
            !!editingKey || isDisabled
              ? "text-[#00000040] cursor-not-allowed"
              : "text-red-600 cursor-pointer"
          }`}
          onClick={() =>
            !editingKey && handleDelete(getRowKey(rowKey, record), index)
          }
        >
          {buttonDeleteIndicator ? (
            buttonEditIndicator
          ) : (
            <TrashOutlined
              className={` ${
                !!editingKey || isDisabled
                  ? "text-[#00000040] cursor-not-allowed"
                  : "text-red-600 cursor-pointer"
              }`}
              width={"1rem"}
              height={"1rem"}
            />
          )}
        </a>
      </div>
    );
  };

  const defaultOperation: any = {
    title: "",
    key: OPERATION_KEY,
    dataIndex: OPERATION_KEY,
    width: 80,
    unit: "px",
    align: "center",
    render: (_, record, index) => {
      const defaultDom = defaultAction(record, index);
      if (actionRender) {
        return actionRender(record, defaultDom);
      }
      return defaultDom;
    },
  };

  const mapOperation = useMemo(() => {
    const data = mergeArrayObjectByKeyDependOnNewArray(
      [defaultOperation],
      columns,
      "dataIndex",
    );
    return data;
  }, [columns, defaultOperation]);

  const mergedColumns: any = mapOperation?.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        inputType: col.type ?? "varchar",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        inputProps: col.inputProps ?? {},
        rules: col.rules,
      }),
    };
  });
  const formConfig = {
    ...(formObjectType && { object_type: formObjectType }),
  };
  return (
    <>
      <FormTera
        {...formConfig}
        form={form}
        ref={forRef}
        onSubmit={handleSubmitForm}
      >
        <Table
          {...restProps}
          loading={loading}
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
              editing: isEditing(record),
              saveOnClickOut,
              onSubmit: () => forRef?.current?.submit(),
            };
          }}
          columns={mergedColumns}
          data={dataSource}
        />
      </FormTera>
    </>
  );
};

export default TeraEditableRow;
