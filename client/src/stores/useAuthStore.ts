// 로그인 기능 저장

import { create } from "zustand";
import { SignUpParam, requestCheckUserInfo, requestLogin, requestLogout, requestSignUp } from "@/api";
import { TOKEN_ACCESS_ID, TOKEN_REFRESH_ID, removeCookie, setCookie } from "@/utils/cookie";
import { AxiosResponse } from "axios";

type LoginState = "pending" | "finish";

export interface User {
  id: string;
  nickname: string;
  region: string;
  area: string;
}

// 인터페이스 정의
interface AuthState {
  loginState: LoginState;
  currentUser: User | null; // 현재 로그인된 유저의 정보, 로그인 되어있지 않다면 null 이다.
  login: (id: string, password: string) => Promise<AxiosResponse>;
  signUp: (data: SignUpParam) => Promise<AxiosResponse>;
  checkToken: () => Promise<AxiosResponse>;
  logout: () => void;
}

// 초기 상태 정의
const initialState = {
  loginState: "pending" as LoginState,
  currentUser: null,
};

// Zustand 상태 생성
const useAuthStore = create<AuthState>((set) => ({
  ...initialState,

  /**
   * 로그인 API를 이용해 로그인을 수행하는 디스패치 입니다.
   * @param id 아이디
   * @param password 비밀번호
   * @returns 로그인 성공 여부에 대한 `AxiosResponse`
   */
  login: async (id: string, password: string) => {
    try {
      const res = await requestLogin(id, password);

      // set cookie for this user
      set({
        currentUser: {
          id,
          nickname: res.data.nickname,
          region: res.data.regionName,
          area: res.data.areaName,
        },
      });

      setCookie(TOKEN_ACCESS_ID, res.data.access_token);
      setCookie(TOKEN_REFRESH_ID, res.data.refresh_token);

      return res;
    } catch (err) {
      console.log("로그인 실패");
      throw err;
    }
  },

  /**
   * 로그아웃을 합니다.
   * state.currentUser 가 null 로 변합니다.
   */
  logout: async () => {
    try {
      requestLogout();

      removeCookie(TOKEN_ACCESS_ID);
      removeCookie(TOKEN_REFRESH_ID);
    } catch (err) {
      console.log("로그인 실패");
      throw err;
    }
  },

  /**
   * 아이디, 닉네임, 비밀번호, 지역정보 등을 바탕으로 회원을 등록합니다.
   *
   * @param id 아이디
   * @param password 비밀번호
   * @param region 지역정보
   * @returns
   */
  signUp: async (data: SignUpParam) => {
    try {
      const signUpResponse = await requestSignUp(data);
      console.log("회원 가입 중...");

      return signUpResponse;
    } catch (e) {
      throw e;
    }
  },

  /**
   * 토큰 확인을 통해 유저 정보를 로드해옵니다.
   *
   * 현재 유저 정보가 null로 받아올 수 없으면 로그인을 해도 의미가 없으므로,
   *
   * 실패 시 쿠키 정보도 리셋됩니다.
   *
   * @returns 토큰 확인 결과에 대한 AxiosResponse
   */
  checkToken: async () => {
    try {
      const res = await requestCheckUserInfo();

      set({
        currentUser: {
          id: "id",
          nickname: res.data.data.nickname ?? "nickname",
          region: res.data.data.regionName,
          area: res.data.data.areaName,
        },
        loginState: "finish",
      });
      console.log("토큰 확인 성공");
      return res;
    } catch (e) {
      console.log("토큰 확인 실패 : 클라이언트 에러");
      console.log(e);
      set({ currentUser: null, loginState: "finish" });
      return e as AxiosResponse;
    }
  },
}));

export default useAuthStore;
