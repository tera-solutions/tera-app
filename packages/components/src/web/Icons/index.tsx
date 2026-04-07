import React from "react";
import Menu1 from "./Menu1";
import Menu2 from "./Menu2";
import Menu4 from "./Menu4";
import Menu5 from "./Menu5";
import Menu6 from "./Menu6";
import Menu7 from "./Menu7";
import Menu8 from "./Menu8";
import Menu9 from "./Menu9";
import Menu10 from "./Menu10";
import Menu11 from "./Menu11";
import Menu12 from "./Menu12";
import Menu13 from "./Menu13";
import Menu14 from "./Menu14";
import { TypeIcon } from "./interface";
import Menu16 from "./Menu16";
import Menu15 from "./Menu15";
import Menu3 from "./Menu3";
import Menu17 from "./Menu17";
import classNames from "classnames";

interface IconsProps {
  icon: TypeIcon;
  className?: string;
  [key: string]: any;
}

function Icons({ icon, className, ...props }: IconsProps) {
  const renderIcon = {
    menu1: <Menu1 {...props} />,
    menu2: <Menu2 {...props} />,
    menu3: <Menu3 {...props} />,
    menu4: <Menu4 {...props} />,
    menu5: <Menu5 {...props} />,
    menu6: <Menu6 {...props} />,
    menu7: <Menu7 {...props} />,
    menu8: <Menu8 {...props} />,
    menu9: <Menu9 {...props} />,
    menu10: <Menu10 {...props} />,
    menu11: <Menu11 {...props} />,
    menu12: <Menu12 {...props} />,
    menu13: <Menu13 {...props} />,
    menu14: <Menu14 {...props} />,
    menu15: <Menu15 {...props} />,
    menu16: <Menu16 {...props} />,
    menu17: <Menu17 {...props} />,
  };
  return (
    <div className={classNames("tera-menu__item", className)}>
      {renderIcon[icon]}
    </div>
  );
}

export default Icons;
