import React from "react";
import { observer } from "mobx-react-lite";
import { Outlet } from "react-router-dom";

const UnAuthLayout = observer(() => {
  return <Outlet />;
});

export default UnAuthLayout;
