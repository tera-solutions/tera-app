import PaginationCustom from "@tera/components/web/PaginationCustom";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PaginationProps } from "tera-dls";
import customTwMerge from "tailwind-merge.config";

import TeraEditableCell from "./TeraEditableCell";
import TeraEditableRow from "./TeraEditableRow";
import TeraNormalTable from "./TeraNormalTable";
import TeraTableContext from "./TeraTableContext";
import { ITeraTableProps } from "./_interfaces";

import Summary from "./containers/Summary";

const calculateDataSource = (page: number, pageSize: number, data: any[]) => {
  const cloned = _.cloneDeep(data);
  return cloned?.slice((page - 1) * pageSize, page * pageSize);
};
const calculateCurrentPage = ({
  total,
  page,
  pageSize,
}: {
  total: number;
  page: number;
  pageSize: number;
}) =>
  Math.ceil(total / pageSize) < page
    ? Math.ceil(total / pageSize) === 0
      ? 1
      : Math.ceil(total / pageSize)
    : page;

const TableTera = (props: ITeraTableProps) => {
  const {
    objectType,
    columns,
    mode = "table",
    editable,
    rowKey = "id",
    pagination,
    data,
    middleChildren,
    summary,
    loadingIndicator,
    wrapperClassName,
    ...restProps
  } = props;
  const mergePagination =
    typeof pagination === "boolean" || typeof pagination === "undefined"
      ? {}
      : pagination;

  const {
    onChange,
    defaultPageSize = 10,
    total: propTotal,
    to = 1,
    from = 10,
    current,
    pageSize,
    ...paginationProps
  } = mergePagination || {};
  const [params, setParams] = useState({
    page: 1,
    pageSize: defaultPageSize,
  });

  const [dataSource, setDataSource] = useState([]);

  const dataProp = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data?.filter((value) => !!value);
  }, [data]);

  useEffect(() => {
    if (dataProp?.length === 0 && current && current > 1) {
      onChange?.(current - 1, pageSize ?? defaultPageSize);
    }
  }, [dataProp, current]);

  const total = propTotal ?? dataProp?.length;
  const getDataSource = (data: any) =>
    data?.length <= params?.pageSize
      ? data
      : calculateDataSource(params.page, params.pageSize, data);

  useEffect(() => {
    const data = dataProp;
    setDataSource(pagination ? getDataSource(data) : data);
  }, [params, dataProp]);

  useEffect(() => {
    current && setParams((prevPrams) => ({ ...prevPrams, page: current }));
  }, [current]);

  useEffect(() => {
    pageSize && setParams((prevPrams) => ({ ...prevPrams, pageSize }));
  }, [pageSize]);

  useEffect(() => {
    mode &&
      editable?.onEditableKeyChange &&
      editable.onEditableKeyChange(undefined);
  }, [mode]);

  const handleChangePage: PaginationProps["onChange"] = (
    page?: number,
    pageSize?: number,
  ) => {
    const currentPage = calculateCurrentPage({
      page: page ?? 1,
      total,
      pageSize: pageSize ?? defaultPageSize,
    });
    const dataSource = calculateDataSource(
      currentPage,
      pageSize ?? defaultPageSize,
      dataProp,
    );
    setDataSource(dataSource as any);
    setParams((prev) => ({
      ...prev,
      page: currentPage,
      pageSize: pageSize ?? defaultPageSize,
    }));
    onChange && onChange(currentPage, pageSize ?? defaultPageSize);
  };
  const defaultFrom = (params?.page - 1) * params?.pageSize + 1;
  const defaultTo = params?.page * params?.pageSize;
  const paginationConfig = {
    ...(!!propTotal
      ? { to }
      : {
          to: total < params?.page * params?.pageSize ? total : defaultTo,
        }),
    ...(!!propTotal ? { from } : { from: defaultFrom }),
  };
  useEffect(() => {
    if (current || pageSize) return;
    const currentPage = calculateCurrentPage({
      page: params.page,
      total,
      pageSize: params.pageSize,
    });
    setParams((prev) => ({
      ...prev,
      page: currentPage,
      pageSize: params.pageSize,
    }));
  }, [total, params?.pageSize, current, pageSize]);

  const handleValuesChange = useCallback(
    _.debounce((value, values) => {
      if (!pagination)
        return (
          typeof editable?.onValuesChange === "function" &&
          editable?.onValuesChange(value, values)
        );
      if (editable?.onValuesChange) {
        dataProp.splice(
          (params?.page - 1) * params?.pageSize,
          params?.pageSize,
        );
        dataProp.splice((params?.page - 1) * params?.pageSize, 0, ...values);
        editable?.onValuesChange(value, dataProp);
      }
    }, 0),
    [editable?.onValuesChange, params, dataProp],
  );

  return (
    <TeraTableContext
      {...restProps}
      columns={columns}
      editable={{ ...editable, onValuesChange: handleValuesChange }}
      data={dataSource}
      rowKey={rowKey}
      id={objectType}
      {...(summary && {
        summary: (records: any) => (
          <Summary
            records={records}
            summary={summary as any}
            loadingIndicator={loadingIndicator}
          />
        ),
      })}
    >
      <div className={customTwMerge("shadow-md", wrapperClassName)}>
        {mode === "editable-row" && <TeraEditableRow />}
        {mode == "editable-cell" && <TeraEditableCell />}
        {mode == "table" && <TeraNormalTable />}
        {middleChildren}
        {pagination && total >= defaultPageSize && (
          <PaginationCustom
            {...paginationConfig}
            total={Number(total) ?? 0}
            {...paginationProps}
            onChange={handleChangePage}
            defaultPageSize={defaultPageSize}
            current={params?.page}
            pageSize={params?.pageSize}
          />
        )}
      </div>
      {/* {pagination && <div className="pt-4" />} */}
    </TeraTableContext>
  );
};
export default TableTera;
