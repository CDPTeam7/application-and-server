import axios from "axios";
import { TOKEN_ACCESS_ID, TOKEN_REFRESH_ID, getCookie } from "./cookie";

export const axiosWithCookie = axios.create({
  headers: {
    accessToken: getCookie(TOKEN_ACCESS_ID),
    refreshToken: getCookie(TOKEN_REFRESH_ID),
  },
});

export const axiosImage = axios.create({
  headers: {
    accessToken: getCookie(TOKEN_ACCESS_ID),
    refreshToken: getCookie(TOKEN_REFRESH_ID),
    "Content-Type": "multipart/form-data",
  },
});
