import axios from "axios";
import { TOKEN_ACCESS_ID, TOKEN_REFRESH_ID, getCookie } from "./cookie";

export const axiosWithCookie = axios.create({
  headers:{
    accessToken:await getCookie(TOKEN_ACCESS_ID),
    refreshToken:await getCookie(TOKEN_REFRESH_ID)
  }
})