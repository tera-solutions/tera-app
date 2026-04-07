import { useEffect, useState } from "react";
import customTwMerge from "tailwind-merge.config";
import { Image } from "tera-dls";
import imageDefault from "@tera/themes/images/uiNew/logo.png";
import DefaultImage from "../DefaultImage";

type ImageType = {
  src?: string;
  alt?: string;
};
type ViewListImageProps = {
  listImage?: ImageType[];
};
const ViewListImage = ({ listImage }: ViewListImageProps) => {
  const [mainImage, setMainImage] = useState(
    listImage?.[0] || { src: imageDefault, alt: "default-image" },
  );

  useEffect(() => listImage && setMainImage(listImage[0]), [listImage]);

  return listImage?.length > 0 ? (
    <div className="flex items-center justify-center gap-4">
      <div className="space-y-2.5 max-h-[360px] overflow-auto pr-2.5 scrollbar-vertical-small">
        {listImage.map((image) => (
          <DefaultImage
            src={image.src}
            alt={image.alt}
            className={customTwMerge(
              "h-[50px] w-[50px] rounded-[5px] cursor-pointer border-2 bg-cover transition-all max-w-none object-cover",
              mainImage.src === image.src ? "border-blue-600" : "opacity-70",
            )}
            onClick={() => setMainImage(image)}
          />
        ))}
      </div>
      <Image
        containerClassName="h-fit mx-[65px]"
        imageClassName="w-[150px] h-[150px] object-cover"
        borderRadius={5}
        src={mainImage.src}
        alt={mainImage.alt}
      />
    </div>
  ) : (
    <></>
  );
};

export default ViewListImage;
