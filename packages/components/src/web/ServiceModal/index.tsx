import Background from "@tera/themes/images/servicePackage/background.png";
import { Modal } from "tera-dls";

const index = ({ children, ...restProps }) => {
  return (
    <Modal
      title={""}
      {...restProps}
      modalRender={() => (
        <div
          className="bg-white text-white rounded-[36px] p-[30px] flex flex-col items-center"
          style={{
            backgroundImage: `url(${Background})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {children}
        </div>
      )}
    />
  );
};

export default index;
