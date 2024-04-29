// 로그인된 유저의 정보 저장

import { PointRecord, count as countRequest } from "@/api/point";
import { create } from "zustand";

// 유저의 정보 (인증 정보는 별개)
// api 호출 최소화 전략 (캐시)
// 현재는 포인트 딜레이마다 호출을 할 예정
const CALL_DELAY = 60 * 1000; // 갱신 딜레이 1분

export interface User {
  id: string;
  nickname: string;
  region: string;
}

export interface UserState {
  flushUserData: () => void; // 유저가 로그아웃 되면 정보를 지우는 함수
  currentUser: User | null; // 현재 로그인된 유저의 정보
  setUser: (user: User) => void;
  requestPointByCount: (from: number, count: number) => Promise<PointRecord[]>;
  getPoint: () => Promise<number>;
}

const initialState = {
  currentUser: null,
};

const pointApiState: { lastCallTime: number; lastPointRecord: PointRecord[] } =
  {
    lastCallTime: 0,
    lastPointRecord: [],
  };

export const useUserStore = create<UserState>((set) => ({
  ...initialState,
  flushUserData: () => {
    set({ currentUser: null });
  },
  setUser: (user: User) => {
    console.log("유저 설정 완료");
    set({ currentUser: user });
  },
  requestPointByCount: async (from: number, count: number) => {
    const { lastCallTime } = pointApiState;

    const currentTime = new Date().getTime();
    const timeSinceLastCall = currentTime - (lastCallTime ?? 0);

    if (
      timeSinceLastCall > CALL_DELAY ||
      from + count > pointApiState.lastPointRecord.length
    ) {
      pointApiState.lastCallTime = currentTime;

      await countRequest(from, count)
        .then((value) => {
          pointApiState.lastPointRecord = value.data.data.map(
            (value: { after_total: any; date: any; point: any }) => {
              return {
                date: value.date,
                place: "unknown",
                point: value.point,
                afterTotal: value.after_total,
              };
            }
          );
        })
        .catch((value) => {
          console.log(value);
        });
    }

    return pointApiState.lastPointRecord;
  },
  getPoint: async () => {
    if (pointApiState.lastPointRecord.length > 0)
      return pointApiState.lastPointRecord[0].afterTotal;
    
    try {
      const value = await countRequest(0, 1);
      pointApiState.lastPointRecord = value.data.data.map((value: { date: any; point: any; after_total: any; }) => {
        return {date:value.date, place:"unknown", point:value.point,afterTotal:value.after_total}
      });
      console.log(pointApiState.lastPointRecord);
      return pointApiState.lastPointRecord[0].afterTotal;
    }
    catch(err) {
      console.log(err);
      return 0;
    }
  },
}));
