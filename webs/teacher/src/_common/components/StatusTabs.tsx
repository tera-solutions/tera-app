import { Tabs } from "tera-dls";

export interface StatusTabItem {
  key: string;
  label: string;
}

interface StatusTabsProps {
  tabs: StatusTabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

/** Shared horizontal status-filter tabs ("Tất cả | ...") for list pages. */
const StatusTabs = ({ tabs, activeKey, onChange, className }: StatusTabsProps) => (
  <Tabs
    className={className}
    items={tabs.map((tab) => ({ key: tab.key, label: tab.label }))}
    activeKey={activeKey}
    onChange={onChange}
    activeClassName="text-brand"
  />
);

export default StatusTabs;
