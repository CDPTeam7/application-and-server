// 쿠키 저장소
import { Cookies } from "react-cookie";

const cookies = new Cookies();
export const TOKEN_REFRESH_ID = "refreshToken";
export const TOKEN_ACCESS_ID = "accessToken";

export const setCookie = (name:string, value:string) => {
  return cookies.set(name, value, {maxAge:60*60*3, path:"/"});
}

export const getCookie = (name:string) => {
  return cookies.get(name);
}

export const removeCookie = (name:string) => {
  return cookies.remove(name);
}