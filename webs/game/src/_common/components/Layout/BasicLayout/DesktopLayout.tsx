import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Outlet } from "react-router-dom";

function BasicLayout() {
  const [isExpand, setIsExpand] = useState<boolean>(true);

  return (
    <>
      <Outlet />
    </>
  );
}

export default observer(BasicLayout);
