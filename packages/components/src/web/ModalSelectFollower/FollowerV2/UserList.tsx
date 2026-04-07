import { followerMode } from "@tera/components/dof/CrmProvider";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import SelectDepartment from "@tera/components/dof/Select/ObjectType/SelectDepartment";
import SelectJobTitle from "@tera/components/dof/Select/ObjectType/SelectJobTitle";
import SelectPosition from "@tera/components/dof/Select/ObjectType/SelectPosition";

import { useCallback, useEffect, useState } from "react";
import { Checkbox, Empty, PaginationProps, Row, Spin } from "tera-dls";
import useAction from "./Hook/useAction";
import useGetData from "./Hook/useGetData";
import Item from "./Item";
import Searching from "./Searching";
import _ from "lodash";
import PaginationShort from "@tera/components/web/PaginationShort";

interface IProps {
  followers: any;
  onChange: (value: any) => void;
  selectEmployeeIds?: number[];
  mode: followerMode;
  objectType?: string;
  objectId?: string;
}

const UserList = (props: IProps) => {
  const { followers, onChange, mode, objectType, objectId } = props;
  const [checkedValue, setCheckedValue] = useState<any>([]);
  const [params, setParams] = useState<any>({ page: 1, limit: 6 });
  const isSoftMode = mode === "soft";

  const handleCheck = (checked: boolean, value: any): void => {
    setCheckedValue((prev) => {
      if (checked) {
        const index = prev.findIndex((item) => item?.id === value?.id);
        if (index === -1) return [value, ...prev];
      }
      return prev.filter((item) => item?.id !== value?.id);
    });
  };

  const { list, refetch, isLoading, isFetching } = useGetData({
    objectType,
    objectId,
    params: {
      ...params,
      ...(mode === "soft" && {
        except_id: followers?.map((item) => item.id).join(","),
      }),
    },
    mode,
  });
  const { onAdd } = useAction(objectId, objectType);

  useEffect(() => {
    refetch();
  }, [followers, params]);

  useEffect(() => {
    setCheckedValue([]);
  }, [followers]);

  const listEmployee = list?.data ?? [];

  const handleChangeSelected = () => {
    if (checkedValue?.length === 0) return;
    setParams((prev) => ({ ...prev, page: 1 }));
    if (isSoftMode) {
      onChange([...checkedValue]);
      setCheckedValue([]);
      return;
    }
    const data = checkedValue?.map((item) => item?.user_id);
    onAdd(data);
    setCheckedValue([]);
  };

  const handleChangeAll = () => {
    setParams((prev) => ({ ...prev, page: 1 }));
    if (isSoftMode) {
      onChange([...listEmployee]);
      setCheckedValue([]);
      return;
    }
    const data = listEmployee?.map((item) => item?.user_id);
    onAdd(data);
    setCheckedValue([]);
  };

  const handleCheckAll = (checked: boolean): void => {
    setCheckedValue((prev) =>
      checked ? [...prev, ...(listEmployee ?? [])] : [],
    );
  };

  const handleSelect = useCallback(
    _.debounce((value: any): void => {
      if (isSoftMode) {
        onChange([{ ...value }]);
        return;
      }
      onAdd([value?.user_id]);
    }, 300),
    [isSoftMode, onChange, onAdd],
  );

  const handleChangePage: PaginationProps["onChange"] = (page, pageSize) => {
    setParams((prev) => ({ ...prev, limit: pageSize, page: page }));
  };

  const handleCheckedAll = () => {
    const checkedIds = checkedValue?.map((item) => item?.id);
    const listEmployeeId = listEmployee?.map((item) => item?.id);
    return (
      checkedIds?.length > 0 &&
      listEmployeeId?.every((i) => checkedIds.includes(i))
    );
  };
  handleChangeAll;
  return (
    <div className="rounded-[5px] border flex flex-col p-2.5 gap-2.5 min-w-[0px] w-full h-full">
      <Row className="font-medium text-[16px] leading-[16px]">
        Danh sách nhân viên{" "}
      </Row>
      <Row>
        <Searching
          onSearch={({ keyword }) =>
            setParams((prev) => ({ ...prev, keyword, page: 1 }))
          }
        />
      </Row>
      <FormTera>
        <Row className="grid grid-cols-3 gap-2.5 flex-wrap items-center">
          <FormTeraItem name="department">
            <SelectDepartment
              onChangeCustom={(value) =>
                setParams((prev) => ({ ...prev, department: value, page: 1 }))
              }
              labelInValue={false}
              value={params.department}
              placeholder="Chọn phòng ban"
              className="col-span-1 rounded-xsm"
            />
          </FormTeraItem>
          <FormTeraItem name="job_title">
            <SelectJobTitle
              onChangeCustom={(value) =>
                setParams((prev) => ({ ...prev, job_title: value, page: 1 }))
              }
              labelInValue={false}
              value={params.job_title}
              placeholder="Chọn chức danh"
              className="col-span-1 rounded-xsm"
            />
          </FormTeraItem>
          <FormTeraItem name="position">
            <SelectPosition
              onChangeCustom={(value) =>
                setParams((prev) => ({ ...prev, position: value, page: 1 }))
              }
              labelInValue={false}
              value={params.position}
              placeholder="Chọn vị trí"
              className="col-span-1 rounded-xsm"
            />
          </FormTeraItem>
        </Row>
      </FormTera>

      <Row className="flex justify-between items-center w-full px-1 mt-[2px]">
        <div className="flex gap-2.5 items-center">
          <Checkbox
            indeterminate={
              checkedValue?.length < listEmployee?.length &&
              checkedValue?.length > 0
            }
            checked={handleCheckedAll()}
            onChange={(e) => handleCheckAll(e.target.checked)}
          />

          <div
            className={`text-[12px] font-normal ${
              checkedValue?.length > 0
                ? "text-blue-600 cursor-pointer"
                : "text-gray-500"
            } `}
            onClick={handleChangeSelected}
          >
            Thêm các mục đã chọn
          </div>
        </div>
        {/* <div
          className="text-[12px] text-blue-600 font-normal cursor-pointer"
          onClick={handleChangeAll}
        >
          Thêm tất cả
        </div> */}
        <div />
      </Row>
      <Spin spinning={isLoading || isFetching}>
        <Row className="flex flex-col gap-2.5 flex-1 overflow-auto">
          {listEmployee?.length > 0 || isLoading ? (
            listEmployee?.map((item) => (
              <Item
                key={item.id}
                onSelect={handleSelect}
                onChecked={handleCheck}
                checked={checkedValue?.find((val) => val?.id === item?.id)}
                employee={item}
                type="left"
              />
            ))
          ) : (
            <div className="w-full flex justify-center">
              <Empty className="w-[100px]" />
            </div>
          )}
        </Row>
      </Spin>

      {list?.total >= params?.limit && (
        <PaginationShort
          total={list?.total ?? 0}
          page={params?.page}
          pageSize={params?.limit ?? 6}
          onChange={handleChangePage}
          maxPage={list?.last_page}
        />
      )}
    </div>
  );
};

export default UserList;
