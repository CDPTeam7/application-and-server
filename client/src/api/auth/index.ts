import { axiosWithCookie } from "@/utils/axios";
import axios from "axios";

// 로그인 시 패킷을 중간에 열어볼 수 있어서, RSA 암호화 필요

export function requestSignUp(userId: string, password: string) {
  return axios.post("/api/auth/signup", {
    user_id: userId,
    user_pw: password,
  });
}

export function requestLogin(userId: string, password: string) {
  return axios.post("/api/auth/login", {
    user_id: userId,
    user_pw: password,
  });
}

export function requestCheckToken() {
  return axiosWithCookie.post("/api/auth/checkToken");
}
