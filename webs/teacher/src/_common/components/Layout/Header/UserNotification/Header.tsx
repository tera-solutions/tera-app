import { observer } from "mobx-react-lite";
import { Badge, Tabs, Toggle } from "tera-dls";

interface IHeaderModalMoreView {
  currentTab: string;
  handleChangeTab: (key: string) => void;
}

const HeaderModalMoreView = ({
  currentTab,
  handleChangeTab,
}: IHeaderModalMoreView) => {
  const tabItems = [
    {
      key: "important",
      label: (
        <h3 className="tab-table">
          <span>Quan trọng</span>
          {/* ({getStatusSummaryCount(summary, key)}) */}
          <Badge showZero count={29} />
        </h3>
      ),
    },
    {
      key: "system",
      label: (
        <h3 className="tab-table">
          <span>Hệ thống</span>
          <Badge showZero count={29} />
        </h3>
      ),
    },
    {
      key: "contact",
      label: (
        <h3 className="tab-table">
          <span>Liên hệ</span>
          <Badge showZero count={29} />
        </h3>
      ),
    },
  ];

  return (
    <div className="flex justify-between border-b-[1px] border-gray-200 px-5">
      <Tabs
        onChange={handleChangeTab}
        items={tabItems}
        activeKey={currentTab}
        className="mb-0 w-[75%]"
      />
      <div className="flex items-center gap-2.5">
        <span>Thông báo</span>
        <Toggle containerClassName="block" />
      </div>
    </div>
  );
};

export default observer(HeaderModalMoreView);
