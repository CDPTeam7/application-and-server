// 로그인된 유저의 정보 저장

import { PointRecord, count as countRequest } from "@/api/point";
import { create } from "zustand";

// 유저의 정보 (인증 정보는 별개)
// api 호출 최소화 전략 (캐시)
// 현재는 포인트 딜레이마다 호출을 할 예정
const CALL_DELAY = 60*1000; // 갱신 딜레이 1분

export interface User {
  id: string;
  nickname: string;
  region: string;
}

export interface UserState {
  flushUserData:() => void; // 유저가 로그아웃 되면 정보를 지우는 함수
  currentUser:User | null; // 현재 로그인된 유저의 정보
  setUser:(user:User) => void;
  getPoint:(from:number, count:number) => Promise<PointRecord[]>;
}

const initialState = {
  currentUser: null
};

const pointApiState = {
  lastCallTime:0,
  lastPointRecord:[]
};

export const useUserStore = create<UserState>((set) => ({
  ...initialState,
  flushUserData: () => {
    set({currentUser:null});
  },
  setUser: (user:User) => {
    console.log("유저 설정 완료");
    set({currentUser:user});
  },
  getPoint: async (from:number, count:number) => {
    const {lastCallTime} = pointApiState;
    
    const currentTime = new Date().getTime();
    const timeSinceLastCall = currentTime - (lastCallTime ?? 0);

    if(timeSinceLastCall > CALL_DELAY) {
      pointApiState.lastCallTime = currentTime;
      
      await countRequest(from, count)
      .then(value => {
        pointApiState.lastPointRecord = {
          place:"unknown",
          
          ...value.data.data,
        };
      })
      .catch(value => {
        console.log(value);
      });

    }

    return pointApiState.lastPointRecord;
  }
}));