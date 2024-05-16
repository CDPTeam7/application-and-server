import { axiosImage } from "@/utils/axios";

export const requestSetImage = (image: File) => {
  return axiosImage.post("/api/image/set-image", {
    image,
  });
};
