import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Outlet } from "react-router-dom";

import { useStores } from "@tera/stores/useStores";

import { ModuleType } from "@tera/commons/interfaces/router";
import ModalConfirm from "@tera/components/web/ModalConfirm";

import MenuComponent from "../Menu";
import InlineMenuV2 from "../Menu/InlineMenuV2";

function BasicLayout({ module }: { module?: ModuleType }) {
  const {
    confirmStore: { openConfirm },
  } = useStores();
  const [isExpand, setIsExpand] = useState<boolean>(false);

  return (
    <>
      <div id="basic-layout" className="w-full">
        {/* <InlineMenuV2 isExpand={isExpand} onChangeSize={setIsExpand} /> */}
        <div
          className={`flex flex-col flex-1 w-full h-full transition-all min-h-screen`}
        >
          {/* <MenuComponent module={module} isExpand={isExpand} /> */}

          <div className={`bg-[#00000] h-full flex-1`}>
            <Outlet />
          </div>
        </div>
      </div>
      {openConfirm && <ModalConfirm />}
    </>
  );
}

export default observer(BasicLayout);
