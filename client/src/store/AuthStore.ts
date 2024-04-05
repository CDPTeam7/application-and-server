import {create} from 'zustand';

// 인터페이스 정의
interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

// 초기 상태 정의
const initialState: AuthState = {
  isLoggedIn: false,
  username: null,
  login: () => true,
  logout: () => {},
};

// Zustand 상태 생성
const useAuthStore = create<AuthState>((set) => ({
  ...initialState,
  // 로그인 액션 정의
  login: (username: string, password: string) => {
    // 여기서는 간단하게 username이 'admin'이고 password가 'password'일 때만 로그인 성공으로 가정
    // 또한, 패킷을 뜯어도 안전하도록 해싱처리를 해야하는데, 그건 일단 나중에.
    if (username === 'admin' && password === 'password') {
      set({ isLoggedIn: true, username: username });
      return true;
    } else {
      // 로그인 실패 처리
      console.log('로그인 실패');
      return false;
    }
  },
  // 로그아웃 액션 정의
  logout: () => {
    set({ isLoggedIn: false, username: null });
  },
}));

export default useAuthStore;