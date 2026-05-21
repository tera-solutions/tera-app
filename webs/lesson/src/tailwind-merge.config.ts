import { extendTailwindMerge } from "tailwind-merge";

import { clsx, type ClassValue } from "clsx";

const isDev = process.env.NODE_ENV === "development";

export const tw = (...inputs: ClassValue[]) => {
  const classes = clsx(inputs);
  if (isDev) return classes;

  // Tối ưu: Chỉ split và join 1 lần duy nhất trên chuỗi đã gộp
  return classes
    .split(" ")
    .filter(Boolean)
    .map((className) => `sale-${className}`)
    .join(" ");
};

const customTwMerge = extendTailwindMerge({
  extend: {
    // Sử dụng extend để giữ lại các class mặc định của Tailwind
    classGroups: {
      rounded: [{ rounded: ["xsm"] }], // v4 ưu tiên cấu trúc object
      shadow: [{ shadow: ["xsm", "smd"] }],
      "font-size": [{ text: ["xxs"] }],
    },
  },
});

export default customTwMerge;
