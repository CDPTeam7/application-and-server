import {create} from 'zustand';
import { checkToken, login, signUp } from "@/api";
import { TOKEN_ACCESS_ID, TOKEN_REFRESH_ID, removeCookie, setCookie } from '@/common/cookie';

export interface Message {
  message:string,
  status:number
}

// 인터페이스 정의
interface AuthState {
  isAuth: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<Message>;
  signUp: (username:string, password:string) => Promise<Message>;
  checkToken: () => Promise<Message>;
  logout: () => void;
}

// 초기 상태 정의
const initialState = {
  isAuth: false,
  username: null,
};

// Zustand 상태 생성
const useAuthStore = create<AuthState>((set) => ({
  ...initialState,
  // 로그인 액션 정의
  login: async (username: string, password: string) => {
    // 여기서는 간단하게 username이 'admin'이고 password가 'password'일 때만 로그인 성공으로 가정
    // 또한, 패킷을 뜯어도 안전하도록 암호화처리를 해야하는데, 그건 일단 나중에.
    const res = {
      message:"",
      status:0
    };
    await login(username, password)
    .then((value) => {
      value.data as unknown;
      set({ isAuth: true, username: username });
      console.log("로그인 성공?");
      setCookie(TOKEN_ACCESS_ID, value.data.access_token);
      setCookie(TOKEN_REFRESH_ID, value.data.refresh_token);
      res.status = value.status;
      res.message = value.data.msg;
    })
    .catch((value) => {
      console.log(value);
      console.log('로그인 실패');
      res.status = value.response?.status ?? 0;
      res.message = value.response?.data?.msg;
    });
    return res;
  },
  // 로그아웃 액션 정의
  logout: () => {
    removeCookie("id");
    set({ isAuth: false, username: null });
  },

  signUp: async (username: string, password: string) => {
    // 일단은 가입되게 해놨음
    // db에 쓰게 될텐데 그거 배려가 필요함
    const res = {
      message:"",
      status:0
    };
    await signUp(username, password)
    .then((value) => {
      value.data as unknown;

      console.log("회원가입 성공?");
      res.status = value.status;
      res.message = value.data.msg;
    })
    .catch((value) => {
      console.log(value);
      console.log('회원가입 실패');
      res.status = value.response?.status ?? 0;
      res.message = value.response?.data?.msg;
    });
    return res;
  },

  checkToken: async () => {
    const res = {
      status:0,
      message: ""
    };

    await checkToken()
    .then((value) => {
      console.log("토큰 확인 성공");
      set({isAuth:true});
      res.message = value.data.msg;
      res.status = value.status;
    })
    .catch((value) => {
      console.log("토큰 확인 실패");
      res.status = value.status;
    });

    return res;
  }
}));

export default useAuthStore;