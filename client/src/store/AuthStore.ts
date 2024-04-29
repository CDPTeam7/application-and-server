// 로그인 기능 저장

import {create} from 'zustand';
import { checkToken, login, signUp } from "@/api";
import { TOKEN_ACCESS_ID, TOKEN_REFRESH_ID, removeCookie, setCookie } from '@/common/cookie';
import { AxiosResponse } from 'axios';
import { useUserStore } from './UserStore';

// 인터페이스 정의
interface AuthState {
  isAuth: boolean;
  login: (id: string, password: string) => Promise<AxiosResponse>;
  signUp: (id:string, password:string) => Promise<AxiosResponse>;
  checkToken: () => Promise<AxiosResponse>;
  logout: () => void;
}

// 초기 상태 정의
const initialState = {
  isAuth: false,
};

const setUser = useUserStore.getState().setUser;

// Zustand 상태 생성
const useAuthStore = create<AuthState>((set) => ({
  ...initialState,
  // 로그인 액션 정의
  login: async (id: string, password: string) => {
    // 여기서는 간단하게 username이 'admin'이고 password가 'password'일 때만 로그인 성공으로 가정
    // 또한, 패킷을 뜯어도 안전하도록 암호화처리를 해야하는데, 그건 일단 나중에.
    const res = await login(id, password);
    console.log(res);
    if(res.data.result === "success") {
      // for test
      console.log("로그인 성공?");
      set({isAuth:true});

      // set cookie for this user
      
      setUser({
        id,
        "nickname":"testNickname",
        "region":"testRegion"
      });

      setCookie(TOKEN_ACCESS_ID, res.data.access_token);
      setCookie(TOKEN_REFRESH_ID, res.data.refresh_token);

      // set response state and message

    }
    else {
      console.log('로그인 실패');
    }
    return res;
  },

  // 로그아웃 액션 정의
  logout: () => {
    removeCookie("id");
    set({ isAuth: false });
  },

  signUp: async (id: string, password: string) => {
    // 일단은 가입되게 해놨음
    // db에 쓰게 될텐데 그거 배려가 필요함
    const res = await signUp(id, password);
    if(res.data.result === "success") {
      console.log("회원가입 성공?");
    }
    else {
      console.log('회원가입 실패');
    }
    return res;
  },

  checkToken: async () => {
    const res = await checkToken();
    if(res.data.result === "success") {
      console.log("토큰 확인 성공");
      setUser({
        "id":"admin",
        "nickname":"admin",
        "region":res.data.result.region ?? "undefined",
      });
      set({isAuth:true}); 
    }
    else {
      console.log("토큰 확인 실패");
    }
    
    return res;
  }
}));

export default useAuthStore;