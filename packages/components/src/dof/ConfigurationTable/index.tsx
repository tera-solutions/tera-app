import { mergeArrayObjectByKeyDependOnNewArray } from "@tera/commons/utils";
import { Table, useDetectDevice } from "tera-dls";
import { useMemo } from "react";

interface IProps {
  objectType?: string;
  defaultColumns: any;
  configurationColumns: any;
}

const deviceBreakpoints = {
  largeDesktop: { width: 1400 },
  desktop: { width: 1400 },
  largeTablet: { width: 1200 },
  tablet: { width: 960 },
  mobile: { width: 768 },
  miniMobile: { width: 568 },
};
const isLargeDesktopScreen = (currentScreenWidth: number): boolean =>
  currentScreenWidth > deviceBreakpoints.largeDesktop.width;

const isDesktopScreen = (currentScreenWidth: number): boolean =>
  currentScreenWidth <= deviceBreakpoints.desktop.width &&
  currentScreenWidth > deviceBreakpoints.largeTablet.width;

const isLargeTabletScreen = (currentScreenWidth: number): boolean =>
  currentScreenWidth <= deviceBreakpoints.largeTablet.width &&
  currentScreenWidth > deviceBreakpoints.tablet.width;

const isTabletScreen = (currentScreenWidth: number): boolean =>
  currentScreenWidth <= deviceBreakpoints.tablet.width &&
  currentScreenWidth > deviceBreakpoints.mobile.width;

const isMobileScreen = (currentScreenWidth: number): boolean =>
  currentScreenWidth <= deviceBreakpoints.mobile.width &&
  currentScreenWidth > deviceBreakpoints.miniMobile.width;

const isMiniMobileScreen = (currentScreenWidth: number): boolean =>
  currentScreenWidth <= deviceBreakpoints.miniMobile.width;

export const getHiddenColumnDataIndexes = (
  currenScreenWidth: number,
  columns: any,
): Array<string> => {
  const result = new Set();

  columns?.forEach((column) => {
    const {
      lock = false,
      show_desktop = true,
      hide_tablet_lg = 0,
      hide_tablet = 0,
      show_mobile = 0,
      hide_mini_mobile = 0,
      dataIndex,
    } = column;

    if (lock) return;

    switch (true) {
      case isLargeDesktopScreen(currenScreenWidth) && !show_desktop:
        result.add(dataIndex);
        break;
      case isDesktopScreen(currenScreenWidth) && !show_desktop:
        result.add(dataIndex);
        break;
      case isLargeTabletScreen(currenScreenWidth) && Boolean(hide_tablet_lg):
        result.add(dataIndex);
        break;
      case isTabletScreen(currenScreenWidth) && Boolean(hide_tablet):
        result.add(dataIndex);
        break;
      case isMobileScreen(currenScreenWidth) && Boolean(show_mobile):
        result.add(dataIndex);
        break;
      case isMiniMobileScreen(currenScreenWidth) && Boolean(hide_mini_mobile):
        result.add(dataIndex);
        break;
    }
  });
  return [...result] as Array<string>;
};

const ConfigurationTable = (props: IProps) => {
  const {
    defaultColumns = [],
    configurationColumns = [],
    ...restProps
  } = props;

  const { widthScreen } = useDetectDevice();

  const mergedColumns = mergeArrayObjectByKeyDependOnNewArray(
    defaultColumns,
    configurationColumns,
    "dataIndex",
  );

  const sortedColumns = mergedColumns.sort((prev, cur) => {
    const { order: previousOrder = 0 } = prev;
    const { order: currentOrder = 0 } = cur;
    return previousOrder - currentOrder;
  });

  const hiddenColumnDataIndexes = useMemo(
    (): Array<string> => getHiddenColumnDataIndexes(widthScreen, sortedColumns),
    [sortedColumns, widthScreen],
  );

  return (
    <Table
      {...restProps}
      columns={sortedColumns}
      hiddenColumns={hiddenColumnDataIndexes ?? []}
    />
  );
};

export default ConfigurationTable;
