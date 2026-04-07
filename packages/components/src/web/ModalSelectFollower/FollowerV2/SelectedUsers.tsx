import DefaultImage from "@tera/components/web/DefaultImage";
import { followerMode } from "@tera/components/dof/CrmProvider";
import useOnScreen from "@tera/commons/hooks/useOnScreen";
import { useCallback, useEffect, useRef, useState } from "react";
import emptyFollowing from "@tera/themes/images/uiNew/empty-following.png";
import { Checkbox, Row, Spin } from "tera-dls";
import useAction from "./Hook/useAction";
import useGetData from "./Hook/useGetData";
import Item from "./Item";
import _ from "lodash";
import classNames from "classnames";

interface IProps {
  followers: any;
  onChange: (employee: any) => void;
  mode: followerMode;
  objectType?: string;
  objectId?: string;
  loadingLimit?: number;
}

const SelectedUsers = (props: IProps) => {
  const {
    followers: defaultValue,
    onChange,
    mode,
    objectType,
    objectId,
    loadingLimit = 10,
  } = props;
  const [checkedValue, setCheckedValue] = useState<any>([]);
  const isSoftMode = mode === "soft";

  const [followers, setFollowers] = useState<any>();
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  // const latestRef = useRef<HTMLDivElement>(null);
  const hasScrollRef = useRef<boolean>(true);

  const { list, refetch, isLoading, isFetching } = useGetData({
    objectType,
    objectId,
    follower: true,
    mode,
    params: {
      limit: pageLimit,
      page: 1,
    },
    enable: !isSoftMode,
    onSuccess: (data) => {
      if (hasScrollRef.current) {
        hasScrollRef.current = false;
        setLoading(false);
      }
      setFollowers(data?.data);
    },
  });

  useEffect(() => {
    mode === "soft" && setFollowers(defaultValue);
  }, [defaultValue, mode]);

  const { onRemove } = useAction(objectId, objectType);

  const handleObserver = (entries: any) => {
    const isLoad =
      entries[0].isIntersecting &&
      list?.data?.length <= list?.total &&
      list?.data?.length <= pageLimit &&
      list?.total > pageLimit;

    if (isLoad) {
      setLoading(true);
      hasScrollRef.current = true;
      setPageLimit((prev) => prev + loadingLimit);
      setTimeout(() => {
        refetch();
      }, 10);
    }
  };

  const { latestRef } = useOnScreen({
    callback: handleObserver,
    dependencies: [followers],
  });

  useEffect(() => {
    setCheckedValue([]);
  }, [followers]);

  const handleChangeSelected = useCallback(
    _.debounce(() => {
      if (checkedValue?.length === 0) return;
      if (isSoftMode) {
        onChange([...checkedValue]);
        setCheckedValue([]);
        return;
      }
      const data = checkedValue?.map((item) => item?.user_id);
      onRemove(data);
      setPageLimit(10);
      setCheckedValue([]);
    }, 300),
    [checkedValue, onChange, isSoftMode],
  );

  const handleChangeAll = () => {
    if (isSoftMode) {
      onChange([...followers]);
      setCheckedValue([]);
      return;
    }
    const data = followers?.map((item) => item?.user_id);
    onRemove(data);
    setPageLimit(10);
    setCheckedValue([]);
  };

  const handleCheckAll = (checked: boolean): void => {
    setCheckedValue(checked ? followers : []);
  };

  const handleSelect = useCallback(
    _.debounce((value: any): void => {
      if (isSoftMode) {
        onChange([{ ...value }]);
        return;
      }
      onRemove([value?.user_id]);
    }, 300),
    [isSoftMode, onChange, onRemove],
  );

  const handleCheck = (checked: boolean, value: any): void => {
    setCheckedValue((prev) => {
      if (checked) {
        const index = prev.findIndex((item) => item?.id === value?.id);
        if (index === -1) return [value, ...prev];
      }
      return prev.filter((item) => item?.id !== value?.id);
    });
  };

  const addingLastRef = (index) =>
    followers.length === index + 1 &&
    followers?.length >= loadingLimit &&
    mode === "default"
      ? latestRef
      : undefined;

  handleChangeAll;
  return (
    <div
      className={classNames(
        "rounded-[5px] border flex flex-col p-2.5 gap-2.5 min-w-[0px] w-full h-full",
        {
          "tera-load-more-loading": loading,
        },
      )}
    >
      <Row className="font-medium text-[16px] leading-[16px]">
        Danh sách người theo dõi
      </Row>
      {followers?.length === 0 ? (
        <Row className="flex justify-center w-full h-[500px] mt-[15px]">
          <div className="flex flex-col gap-2.5 items-center">
            <DefaultImage
              src={emptyFollowing}
              alt={""}
              className="w-[50px] h-[50px] object-cover"
            />
            <div className="text-gray-500">
              Chưa có người theo dõi nào được chọn
            </div>
          </div>
        </Row>
      ) : (
        <>
          <Row className="flex justify-between items-center px-1 w-full mt-[15px]">
            <div className="flex gap-2.5 items-center">
              <Checkbox
                labelClassName="text-[12px] text-blue-600 font-normal"
                indeterminate={
                  checkedValue?.length !== followers?.length &&
                  checkedValue?.length > 0
                }
                checked={
                  checkedValue?.length === followers?.length &&
                  followers?.length > 0
                }
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
                Gỡ các mục đã chọn
              </div>
            </div>
            {/* <div
              className="text-[12px] text-blue-600 font-normal cursor-pointer"
              onClick={handleChangeAll}
            >
              Xóa tất cả
            </div> */}
            <div />
          </Row>
          <Spin
            spinning={
              isLoading &&
              mode === "default" &&
              !hasScrollRef.current &&
              isFetching
            }
          >
            <Row className="flex flex-col gap-2.5 h-[580px] overflow-auto ">
              {followers?.map((item, index) => (
                <Item
                  key={item.id}
                  onSelect={handleSelect}
                  employee={item}
                  onChecked={handleCheck}
                  checked={checkedValue?.find((val) => val?.id === item?.id)}
                  type="right"
                  ref={addingLastRef(index)}
                />
              ))}
              {loading && (
                <Spin wrapperClassName="w-full flex justify-center" spinning />
              )}
            </Row>
          </Spin>
        </>
      )}
    </div>
  );
};

export default SelectedUsers;
