import NoPermission from "@tera/components/web/NoPermission";
import { usePermission } from "_common/hooks/usePermission";
import { observer } from "mobx-react-lite";
import { createContext, useMemo } from "react";
//import { useQuery } from '@tanstack/react-query';
import { IMenu } from "../Menu/interface";
import menu from "../Menu/admin.json";
import QuickAction from "@tera/components/dof/QuickAction";
import { useParams } from "react-router-dom";
import classNames from "classnames";

interface PageLayoutProp {
  page_key: string;
  children?: any;
  actions?: any;
  action_type?: string;
  type?: string;
}

export const PageContext = createContext({});

const PageLayout = observer(
  ({ actions, action_type, page_key, children }: PageLayoutProp) => {
    const { hasPage } = usePermission();
    const { id } = useParams();
    const convertId = Number(id) || null;
    // const { data: pageConfig } = useQuery(
    //   ['get-page-by-object-type', page_key],
    //   () => ManagePageApi.getConfig({ object_type: page_key }),
    //   {
    //     gcTime: 300000,
    //     staleTime: 300000,
    //     enabled: !!page_key,
    //   },
    // );
    const pageConfig = undefined;

    const config = useMemo(() => {
      const defaultConfig: IMenu = menu.subMenu.find(
        (item) => item.code === page_key,
      );
      return { ...defaultConfig, ...(pageConfig ?? {}) };
    }, [pageConfig, page_key]);

    if (!hasPage(page_key)) return <NoPermission />;

    return (
      <PageContext.Provider value={config}>
        <div
          className={classNames("flex h-full", {
            "pr-[40px]": actions?.length > 0,
          })}
        >
          <div data-object_type={page_key} className="h-full w-full">
            {children}
          </div>
          {actions?.length > 0 && (
            <QuickAction
              actions={actions}
              object_id={convertId}
              object_type={action_type}
            />
          )}
        </div>
      </PageContext.Provider>
    );
  },
);

export default PageLayout;
