import { useMutationLegacy } from "@tera/commons/hooks/tanstack";
import { useEffect, useRef } from "react";
// redux
import { useStores } from "@tera/stores/useStores";
// component
import backgroundImage from "@tera/themes/images/uiNew/bg-form.png";
import vector1 from "@tera/themes/images/uiNew/vector1.png";
import {
  Col,
  getQueryParams,
  notification,
  Row,
  Spin,
  updateQueryParams,
} from "tera-dls";
// import { Pagination } from 'swiper';

import { useLocation, useNavigate } from "react-router-dom";
import { AuthApi } from "@tera/api/auth/auth";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

const swiperArray = [
  {
    id: 1,
    image: vector1,
    text: "Nâng cao hiệu quả hoạt động kinh doanh với Tera solutions",
  },
  {
    id: 2,
    image: vector1,
    text: "Linh động ứng dụng theo yêu cầu doanh nghiệp",
  },
  {
    id: 3,
    image: vector1,
    text: "Tích hợp công nghệ AI vào sản phẩm",
  },
];

const CheckAuthPage = () => {
  const navigate = useNavigate();
  const {
    authStore: { logo, auth_url, updateUser },
  } = useStates();
  const location = useLocation();
  const params: { [key: string]: any } = getQueryParams(location.search);

  const classCoverBox = "h-[100vh] flex items-center justify-center bg-cover";
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  const { mutate: onCheckAuth, isLoading } = useMutationLegacy({
    mutationFn: (variables) => AuthApi.checkAuth(variables),

    onSuccess: (res) => {
      if (res.data?.user?.type === "individual") {
        navigate("/403");
        return;
      }
      updateUser(res?.data);

      setTimeout(() => {
        navigate("/");
      }, 200);
    },

    onError: (error: any) => {
      const errorMessage = error?.data?.msg ?? "Error!! please try again!";
      notification.error({
        message: errorMessage,
      });
    },
  });

  useEffect(() => {
    try {
      if (params?.client_id) {
        const parseReq = JSON.parse(params?.req);
        if (parseReq?.iv && !isLoading) {
          onCheckAuth(parseReq);
        }
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: error?.message || "Lỗi bất thường trong quá trình login",
      });
    }
  }, [auth_url, isLoading, params?.client_id]);

  return (
    <div
      className={classCoverBox}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="container">
        <Spin spinning={isLoading}>
          <div className="flex justify-center mb-10">
            <img
              src={logo}
              alt=""
              className="pt-16 pb-8 px-16 h-[100px] w-auto box-content"
            />
          </div>
          <Swiper
            className="quote"
            // modules={[Pagination]}
            navigation={{
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }}
            pagination={true}
            loop
          >
            {swiperArray.map((item: any) => (
              <SwiperSlide className="quote__itm" key={item.id}>
                <Row className="w-full h-full justify-center">
                  <Col className="flex items-center">
                    <img src={item.image} alt="vector1" />
                  </Col>
                  <Col className="text-center h-6 text-3xl font-light">
                    <p className="quote__txt">{item.text}</p>
                  </Col>
                </Row>
              </SwiperSlide>
            ))}
          </Swiper>
        </Spin>
      </div>
    </div>
  );
};

export default CheckAuthPage;
