import { axiosWithCookie } from "@/common/axios";
import axios from "axios";

// 로그인 시 패킷을 중간에 열어볼 수 있어서, RSA 암호화 필요

export function signUp(userId:string, password:string) {
  return axios.post("/api/auth/signup", {
    user_id:userId,
    user_pw:password
  });
}

export function login(userId:string, password:string) {
  return axios.post("/api/auth/login", {
      user_id:userId,
      user_pw:password
  });
}

export function checkToken() {
  return axiosWithCookie.post("/api/auth/checkToken");
}