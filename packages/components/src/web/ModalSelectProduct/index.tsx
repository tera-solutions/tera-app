import { useQuery } from "@tanstack/react-query";
import { useStores } from "hooks/useStores";
import { IPagination } from "_common/interface";
import TableSelection from "@tera/components/shared/Stock/Product/Table/TableSelection";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import StockApi from "@tera/api/stock";
import {
  FormItem,
  Modal,
  PaginationProps,
  TableRowSelection,
  Toggle,
} from "tera-dls";
import { AnyObject } from "yup";
import SelectContactModalHeader from "./HeaderSearch";
import ProductApi from "./_api";
import _ from "lodash";

function ModalSelectProduct() {
  const {
    globalStore: { device, authenticated },
    modalSelectStore: { product, updateData, closeModal },
  } = useStores();
  const form = useForm();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [isViewAll, setIsViewAll] = useState<boolean>(
    product?.typeOrder === "combo",
  );
  const [pagination, setPagination] = useState<IPagination>({
    limit: 10,
    page: 1,
  });

  const {
    data: listDataTable,
    isRefetching,
    refetch: refetchData,
  } = useQuery({
    queryKey: [
      "get-list-select-modal-product",
      pagination,
      searchKeyword,
      isViewAll,
      product,
    ],

    queryFn: () => {
      return ProductApi.getList({
        ...pagination,
        keyword: searchKeyword,
        status: isViewAll ? "all" : "!all",
        type: product?.params?.type,
        contact_id: product?.params?.contact_id,
        order_id: product?.params?.order_id,
        // exclude_id: product?.params?.exclude_id,
        is_append_variant: 1,
        ...(isViewAll && { is_stock_default: 1 }),
        ...(product?.excepts?.exceptVariantIds?.length > 0 && {
          except_variant_condition_ids:
            product?.excepts?.exceptVariantIds?.join(","),
        }),
        ...(product?.excepts?.exceptProductIds?.length > 0 && {
          except_product_ids: product?.excepts?.exceptProductIds?.join(","),
        }),
        // ...(product?.excepts?.exceptStockConditionIds?.length > 0 && {
        //   except_stock_condition_ids:
        //     product?.excepts?.exceptStockConditionIds?.join(','),
        // }),
      });
    },

    enabled: device ? !!authenticated : true,
    staleTime: 300000,
    gcTime: 300000,
    keepPreviousData: true,
  });

  useEffect(() => {
    product && refetchData();
  }, [product]);

  const data = useMemo(() => {
    const list = listDataTable?.data?.data ?? [];
    return list
      ? list?.map((item) => {
          if (item?.type === "combo") {
            const stockData = item?.stock_products?.find(
              (i) => i.stock?.id === item?.stock?.id,
            );
            return {
              ...item,
              purchase_price: stockData?.purchase_price,
              purchase_price_inc_tax: stockData?.purchase_price_inc_tax,
              quantity: stockData?.quantity,
              unit_price: isViewAll
                ? stockData?.combo_unit_price
                : stockData?.unit_price,
              unit_price_inc_tax: stockData?.unit_price_inc_tax ?? 0,
              key: `product_${item?.id}`,
              combo: item.combo?.map((i) => {
                if (i?.type === "variable") {
                  return {
                    ...i,
                    image_url: i?.stock_product?.image_url,
                    name: i?.parent?.name,
                    sku: i?.stock_product?.sku,
                    title: i?.variant_first?.title,
                  };
                }
                return {
                  ...i,
                  image_url: i?.image_url,
                  name: i?.parent?.name,
                  sku: i?.parent?.sku,
                  title: i?.variant_first?.title,
                };
              }),
            };
          }
          if (item?.type === "variable") {
            // const stockData = item?.stock_products?.find(
            //   (i) => i.stock?.id === item?.stock?.id,
            // );
            return {
              ...item,
              sku: item?.variant?.sku,
              unit_price: item?.variant?.unit_price,
              unit_price_inc_tax: item?.variant?.unit_price_inc_tax,
              purchase_price: item?.variant?.purchase_price,
              purchase_price_inc_tax: item?.variant?.purchase_price_inc_tax,
              quantity: item?.variant?.quantity,
              key: `variable_${item?.variant?.id}`,
            };
          }
          const stockData = item?.stock_products?.find(
            (i) => i.stock?.id === item?.stock?.id,
          );
          return {
            ...item,
            purchase_price: stockData?.purchase_price,
            unit_price: stockData?.unit_price,
            unit_price_inc_tax: stockData?.unit_price_inc_tax ?? 0,
            quantity: stockData?.quantity,
            key: `single_${item?.id}`,
          };
        })
      : [];
  }, [listDataTable?.data?.data, isViewAll]);

  // const memoTable = useMemo(() => {
  //   return listDataTable?.data?.data
  //     ? listDataTable?.data?.data?.filter(
  //         (data) => !product?.listId.includes(data?.id),
  //       )
  //     : [];
  // }, [product?.listId, listDataTable]);

  const { data: stock, refetch } = useQuery({
    queryKey: ["get-list-stock"],

    queryFn: () =>
      StockApi.getList({
        page: 1,
        limit: 15,
        is_default: 1,
      }),

    staleTime: 300000,
    gcTime: 300000,
  });

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    stock?.data?.[0]?.id && form.setValue("stock_id", stock?.data?.[0]?.id);
  }, [stock]);

  const handleChangePage: PaginationProps["onChange"] = (page, pageSize) => {
    setPagination({
      limit: pageSize,
      page: page,
    });
  };

  const handleSearch = (value) => {
    setSearchKeyword(value?.keyword);
    setPagination({ ...pagination, page: 1 });
  };

  const rowSelection: TableRowSelection<AnyObject> = {
    type: "checkbox",
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys, record) => {
      setSelectedRows((prev) => {
        return _.uniqBy([...prev, ...record], "key").filter(
          (i) => !!i && selectedRowKeys?.includes(i?.key),
        );
      });
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const handleOk = () => {
    updateData("product", "data", selectedRows);
    closeModal("product");
  };

  // const columns: any = [
  //   {
  //     title: 'SKU',
  //     dataIndex: 'sku',
  //     render: (code) => <div className="line-clamp-2">{code}</div>,
  //   },
  //   {
  //     title: 'Tên sản phẩm',
  //     dataIndex: 'name',
  //     render: (text, record) => {
  //       return (
  //         <>
  //           <span>{text}</span>
  //           <br />
  //           <strong>Tồn kho: {formatNumber(record?.quantity)}</strong>
  //         </>
  //       );
  //     },
  //   },
  //   {
  //     title: 'Giá bán',
  //     dataIndex: 'unit_price',
  //     render: (price, record) => {
  //       const unit_price_before_tax = get(record, 'unit_price_inc_tax', 0);
  //       const unit_price = get(record, 'unit_price', unit_price_before_tax);
  //       let present = 0;
  //       if (unit_price_before_tax !== unit_price && unit_price_before_tax > 0) {
  //         present =
  //           ((unit_price_before_tax - unit_price) / unit_price_before_tax) *
  //           100;
  //       }
  //       return (
  //         <>
  //           <p>
  //             <strong>{formatCurrency(unit_price)}</strong>{' '}
  //           </p>
  //           {unit_price_before_tax !== unit_price && present !== 0 && (
  //             <p>
  //               Giá gốc: {formatCurrency(unit_price_before_tax)} (
  //               {formatNumber(present * -1)}%)
  //             </p>
  //           )}
  //         </>
  //       );
  //     },
  //   },
  //   {
  //     title: 'Giá mua',
  //     dataIndex: 'purchase_price',
  //     render: (purchase_price) => {
  //       // const purchase_price = get(row.stock_products[0], 'purchase_price', 0);
  //       return (
  //         <>
  //           <p>
  //             <strong>{formatCurrency(purchase_price)}</strong>{' '}
  //           </p>
  //         </>
  //       );
  //     },
  //   },
  // ];

  return (
    <Modal
      title="Danh sách sản phẩm"
      okText="Đồng ý"
      cancelText="Huỷ"
      destroyOnClose
      closeIcon={false}
      className="sm:w-[95%] xl:w-[90%]"
      okButtonProps={{ disabled: selectedRowKeys?.length === 0 }}
      onOk={() => handleOk()}
      onCancel={() => closeModal("product")}
      open={product?.open}
      centered={true}
    >
      <div className="flex justify-between items-center pb-4 gap-x-2.5">
        <div>
          <SelectContactModalHeader
            onSearch={handleSearch}
            placeholderProp="Tìm kiếm theo tên sản phẩm, mã SKU"
          />
        </div>
        <div className="flex gap-5 shrink-0">
          {/* {isViewAll && (
            <FormTera form={form}>
              <FormTeraItem name="stock_id">
                <SelectStock
                  className="w-[200px]"
                  paramsApi={{ exclude_id: form.watch('stock_id') }}
                  onChangeCustom={() => {
                    setSelectedRowKeys([]);
                    setSelectedRows([]);
                  }}
                />
              </FormTeraItem>
            </FormTera>
          )} */}
          {product?.typeOrder !== "combo" &&
            !product?.params?.hiddenShowAll && (
              <FormItem
                layout="inline"
                label="Hiển thị tất cả sản phẩm"
                isRequired={false}
                className="items-center"
              >
                <Toggle
                  checked={isViewAll}
                  onChange={() => {
                    setIsViewAll(!isViewAll);
                    setPagination({
                      limit: 10,
                      page: 1,
                    });
                    setSelectedRowKeys([]);
                    setSelectedRows([]);
                  }}
                />
              </FormItem>
            )}
        </div>
      </div>
      <TableSelection
        value={data}
        key={data}
        rowSelection={rowSelection}
        loading={isRefetching}
        pagination={{
          onChange: handleChangePage,
          total: listDataTable?.data?.total || 0,
          current: listDataTable?.data?.current_page,
          pageSize: listDataTable?.data?.per_page,
          to: listDataTable?.data?.to,
          from: listDataTable?.data?.from,
        }}
        onRow={(record: any) => ({
          onClick: () => {
            if (!selectedRowKeys?.includes(record?.key)) {
              setSelectedRows((pre) => [...(pre ?? []), record]);
              setSelectedRowKeys((pre) => [...pre, record?.key]);
              return;
            }
            const filterData = selectedRows?.filter(
              (item) => item?.key !== record?.key,
            );
            const filterId = filterData.map((item) => item?.key);
            setSelectedRows(filterData);
            setSelectedRowKeys(filterId);
          },
          className: selectedRowKeys.includes(record?.key) && "!bg-[#e8f5ff]",
        })}
      />
      {/* <TableTera
        columns={columns}
        data={memoTable}
        className="max-h-[500px] overflow-auto"
        rowSelection={rowSelection}
        onRow={(record: any) => ({
          onClick: () => {
            if (!rowId.includes(record?.id)) {
              setRowSelected((pre) => [...(pre ?? []), record]);
              setRowId((pre) => [...pre, record?.id]);
              return;
            }
            const filterData = rowSelected.filter(
              (item) => item?.id !== record?.id,
            );
            const filterId = filterData.map((item) => item?.id);
            setRowSelected(filterData);
            setRowId(filterId);
          },
          className:
            rowId.includes(record?.id) && 'tera-table-cell-row-focused',
        })}
        loading={isLoading}
        pagination={{
          onChange: handleChangePage,
          total: listDataTable?.data?.total || 0,
          current: listDataTable?.data?.current_page,
          pageSize: listDataTable?.data?.per_page,
          to: listDataTable?.data?.to,
          from: listDataTable?.data?.from,
        }}
      /> */}
    </Modal>
  );
}

export default observer(ModalSelectProduct);
