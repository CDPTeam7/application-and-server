import { requestModifyUserInfo } from "@/api";
import useAuthStore from "@/stores/useAuthStore";
import { useEffect, useState } from "react";

/**
 * 유저 정보를 확인 | 수정할 수 있습니다.
 */
export default function useProfile() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [region, setRegion] = useState<string | null>(null);
  const [area, setArea] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>("");

  useEffect(() => {
    if (currentUser === null) {
      // 상위 container 에서 유저 확인을 진행하기에 문제는 없다고 판단하고있음.
      return;
    }
    setNickname(currentUser.nickname);
    setRegion(currentUser.region);
    setArea(currentUser.area);
  }, []);

  const changeProfile = async (data: { region: string; area: string; nickname: string }) => {
    // api를 써서 update.
    // currentUser 를 새로 받아와야하는데 로직 분리에서 문제.
    try {
      await requestModifyUserInfo(data);
      setNickname(data.nickname);
      setRegion(data.region);
      setArea(data.area);
    } catch (e) {
      return e;
    }
  };

  return { region, area, setArea, setRegion, nickname, setNickname, changeProfile };
}
