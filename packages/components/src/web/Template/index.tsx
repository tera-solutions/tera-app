import { Row } from "tera-dls";
import backgroundLogin from "@tera/themes/images/uiNew/bg-login.png";
const Template = ({ children }) => {
  return (
    <div
      style={{
        background: `url(${backgroundLogin})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
      className={`min-h-screen w-[100vw] bg-no-repeat bg-center flex flex-col justify-center items-center before:content-[''] before:bg-[#00000017] before:w-full before:h-screen before:absolute`}
    >
      <Row className={`w-auto flex h-[700px] gap-20`}>{children}</Row>
    </div>
  );
};

export default Template;
