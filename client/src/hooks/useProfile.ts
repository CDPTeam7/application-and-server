import useAuthStore from "@/stores/useAuthStore";
import { useEffect, useRef } from "react";

/**
 * 유저 정보를 확인 | 수정할 수 있습니다.
 */
export default function useProfile() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const region = useRef("");
  const nickname = useRef("");
  const profile = useRef(); // 유저 프로필 사진도 표시.

  useEffect(() => {
    if (currentUser === null) {
      // 상위 container 에서 유저 확인을 진행하기에 문제는 없다고 판단하고있음.
      return;
    }
    nickname.current = currentUser.nickname;
    region.current = currentUser.region;
  }, []);

  const changeProfile = (region?: string, nickname?: string) => {
    // api를 써서 update.
    // currentUser 를 새로 받아와야하는데 로직 분리에서 문제.
  };

  return { region, nickname, changeProfile };
}
