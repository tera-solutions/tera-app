import React from "react";
import { Drawer, DrawerProps } from "tera-dls";
import MiniInlineMenu from "./MiniInlineMenu";

function DrawerMenu(props: DrawerProps) {
  return (
    <Drawer placement="left" {...props}>
      <MiniInlineMenu onClose={props.onClose} />
    </Drawer>
  );
}

export default DrawerMenu;
