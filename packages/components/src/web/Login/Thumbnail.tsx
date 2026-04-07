import React from "react";
import "react-slideshow-image/dist/styles.css";
import thumbnail1 from "@tera/themes/images/uiNew/thumbnail-1.png";
import thumbnail2 from "@tera/themes/images/uiNew/thumbnail-2.png";
import thumbnail3 from "@tera/themes/images/uiNew/thumbnail-3.png";
import { Slide } from "react-slideshow-image";
import Footer from "./Footer";

const slideImages = [
  {
    url: thumbnail1,
    content: "Nâng cao hiệu quả hoạt động kinh doanh với Tera solutions",
  },
  {
    url: thumbnail2,
    content: "Nâng cao hiệu quả hoạt động kinh doanh với Tera \n solutions",
  },
  {
    url: thumbnail3,
    content: "Nâng cao hiệu quả hoạt động kinh doanh với Tera  \n solutions",
  },
];

const Thumbnail = () => {
  return (
    <div className="w-[600px] h-full rounded-lg overflow-hidden flex flex-col justify-between text-white">
      <Slide
        indicators={() => (
          <div className="group cursor-pointer">
            <p className=" w-[15px] h-[15px] rounded-full bg-[#6B7280] mr-[8px] group-[.active]:bg-white" />
          </div>
        )}
        prevArrow={<div />}
        nextArrow={<div />}
        autoplay
      >
        {slideImages.map((item, index) => (
          <div key={index} className="flex flex-col items-center mb-[20px] ">
            <div
              style={{
                backgroundImage: `url(${item.url})`,
                width: 600,
                height: 435,
              }}
            />
            <p className="mt-[30px] text-xl font-light max-w-[450px] text-center leading-[36px]">
              {item.content}
            </p>
          </div>
        ))}
      </Slide>
      <div className="mt-[30px]">
        <Footer />
      </div>
    </div>
  );
};

export default React.memo(Thumbnail);
