import { mergeArrayObjectByKeyDependOnNewArray } from "tera-dls";

// const isDesktopScreen = (currentScreenWidth: number): boolean =>
//   currentScreenWidth <= deviceBreakpoints.desktop.width;

// const isLargeTabletScreen = (currentScreenWidth: number): boolean =>
//   currentScreenWidth < deviceBreakpoints.desktop.width &&
//   currentScreenWidth >= deviceBreakpoints.largeTablet.width;

// const isTabletScreen = (currentScreenWidth: number): boolean =>
//   currentScreenWidth < deviceBreakpoints.largeTablet.width &&
//   currentScreenWidth >= deviceBreakpoints.tablet.width;

// const isMobileScreen = (currentScreenWidth: number): boolean =>
//   currentScreenWidth < deviceBreakpoints.mobile.width;

export const getHiddenColumnDataIndexes = ({
  columns,
  isDesktop,
  isMobile,
  isTablet,
}): Array<string> => {
  const result = new Set();

  columns?.forEach((column) => {
    const {
      status = "active",
      lock = false,
      show_desktop = true,
      //hide_tablet_lg = 0,
      hide_tablet = 0,
      show_mobile = 0,
      //hide_mini_mobile = 0,
      dataIndex,
      key,
    } = column;

    if (lock) return;

    switch (true) {
      case status === "inactive":
        result.add(key ?? dataIndex);
        break;
      case isDesktop && !show_desktop:
        result.add(key ?? dataIndex);
        break;
      case isTablet && Boolean(hide_tablet):
        result.add(key ?? dataIndex);
        break;
      case isMobile && !show_mobile:
        result.add(key ?? dataIndex);
        break;
    }
  });
  return [...result] as Array<string>;
};

export const getRowKey = (rowKey, item) => {
  if (typeof rowKey === "function") return rowKey(item);
  return item[rowKey];
};

export const mapDefaultIndexNumber = (columns, indexNumberObject) => {
  return mergeArrayObjectByKeyDependOnNewArray(
    [indexNumberObject],
    columns,
    "key",
  );
};
