import { HEADING_CLASS_NAME } from "@tera/commons/constants/common";
import Information from "./containers/Information";
import { Row } from "tera-dls";
import OnlineService from "./containers/OnlineService";
import Banner from "./containers/Banner";
import Social from "./containers/Social";

const SettingStore = () => {
  return (
    <div className="p-6">
      <h1 className={HEADING_CLASS_NAME}>Cài đặt cửa hàng</h1>
      <Row className="gap-8">
        <Information />
        <OnlineService />
        <Banner />
        <Social />
      </Row>
    </div>
  );
};

export default SettingStore;
