import { axiosWithCookie } from "@/utils/axios";
import { TOKEN_ACCESS_ID, getCookie } from "@/utils/cookie";
import axios, { AxiosResponse } from "axios";

// 로그인 시 패킷을 중간에 열어볼 수 있어서, RSA 암호화 필요

export interface SignUpParam {
  id: string;
  password: string;
  nickname: string;
  region: string;
  area: string;
}
export function requestSignUp(param: SignUpParam) {
  return axios.post("/api/auth/signup", {
    user_id: param.id,
    user_pw: param.password,
    nickname: param.nickname,
    regionName: param.region,
    areaName: param.area,
  });
}

export function requestLogin(userId: string, password: string) {
  interface LoginResponse {
    msg: string;
    result: string;
    access_token: string;
    refresh_token: string;
    user_id: string;
    nickname: string;
    regionName: string;
    areaName: string;
  }
  return axios.post("/api/auth/login", {
    user_id: userId,
    user_pw: password,
  }) as Promise<AxiosResponse<LoginResponse>>;
}

export function requestLogout() {
  return axiosWithCookie.post("/api/auth/logout", {
    access_token: getCookie(TOKEN_ACCESS_ID),
  });
}

export function requestCheckUserInfo() {
  interface CheckUserInfo {
    result: string;
    msg: string;
    data: {
      nickname: string;
      point: number;
      score: number;
      regionName: string;
      areaName: string;
    };
  }
  return axiosWithCookie.get("/api/auth/check-userinfo") as Promise<AxiosResponse<CheckUserInfo>>;
}

export function requestModifyUserInfo(data: { nickname: string; region: string; area: string }) {
  const { nickname, region, area } = data;
  interface ModifyUserInfo {
    result: string;
    msg: string;
  }

  return axiosWithCookie.post("/api/auth/modify-userinfo", {
    nickname,
    regionName: region,
    areaName: area,
  }) as Promise<AxiosResponse<ModifyUserInfo>>;
}
