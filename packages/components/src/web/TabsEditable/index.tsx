import classNames from "classnames";
import React, { useMemo } from "react";
import { PlusSolid, TabItemType, Tabs, XMarkSolid } from "tera-dls";

export interface ITabEditableItems {
  label: string | React.ReactNode;
  children?: string | React.ReactNode;
  key: string;
  closable?: boolean;
}

interface TabEditableProps {
  items: ITabEditableItems[];
  activeKey: string;
  className?: string;
  renderRightComponent?: React.ReactNode;
  onEdit?: (targetKey, action: "add" | "remove") => void;
  onChange?: (key) => void;
}

function TabEditable({
  items,
  activeKey,
  className,
  renderRightComponent,
  onEdit,
  onChange,
}: TabEditableProps) {
  const renderUI = useMemo(() => {
    return items.map(
      (tab) =>
        tab.children && (
          <div
            key={tab?.key}
            className={`${tab.key === activeKey ? "h-full" : "hidden"}`}
          >
            {tab.children}
          </div>
        ),
    );
  }, [items, activeKey]);

  const itemsTab = useMemo((): any => {
    const itemsTab = items?.map((tab) => ({
      key: tab?.key,
      label: (
        <div className="flex items-center gap-x-[5px]">
          <p>{tab?.label || `New tab ${tab?.key}`}</p>
          {tab?.closable && (
            <span
              className="h-[15px] w-[15px] flex justify-center items-center hover:bg-gray-200 rounded-full text-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(tab?.key, "remove");
              }}
            >
              <XMarkSolid
                className={`w-4 h-4 ${
                  tab?.key === activeKey ? "text-red-300" : ""
                }`}
              />
            </span>
          )}
        </div>
      ),
    }));
    const addIcon: TabItemType = {
      key: "add",
      label: (
        <div className="flex items-center gap-x-1">
          <PlusSolid className="w-5 h-5 text-blue-600" />
          <span className="text-gray-500">[F8]</span>
        </div>
      ),
    };
    return [...itemsTab, addIcon];
  }, [items, activeKey]);

  const handleChangeTab = (key) => {
    if (key === "add") {
      onEdit(undefined, "add");
    } else {
      onChange(key);
    }
  };

  const classContainer = "h-full flex-1 mb-0 border-0 ";

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center justify-between relative before:content[''] before:absolute before:left-0 before:bottom-0 before:w-full before:border-b">
        <Tabs
          items={itemsTab}
          activeKey={activeKey}
          onChange={handleChangeTab}
          itemClassName="text-gray-800 border px-[5px] py-[7.5px] rounded-t-lg bg-gray-50 font-normal"
          activeClassName="!bg-white !text-blue-600 border-b-white shadow"
          className={classNames(classContainer, className)}
        />
        {renderRightComponent}
      </div>
      <div className="tab-editable-content h-full overflow-hidden">
        {renderUI}
      </div>
    </div>
  );
}

export default TabEditable;
