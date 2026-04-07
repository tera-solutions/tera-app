import { IMenu } from "@tera/components/web/Layout/Menu/interface";
import { PageContext } from "@tera/components/web/Layout/PageLayout";
import { useContext } from "react";

const usePageConfig = () => {
  return useContext(PageContext) as IMenu;
};

export default usePageConfig;
