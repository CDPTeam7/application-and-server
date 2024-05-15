import { axiosImage } from "@/utils/axios";

export const requestSetImage = (image: any) => {
  return axiosImage.post("/api/model/set-image", {
    data: {
      image,
    },
  });
};
