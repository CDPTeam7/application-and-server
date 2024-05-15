import {
  requestAreaMyRank,
  requestAreaTopRank,
  requestMyRank,
  requestRegionMyRank,
  requestRegionTopRank,
  requestTopRank,
} from "@/api";
import useAuthStore from "@/stores/useAuthStore";
import { TopRankRecord } from "@/types/RankRecord";
import { useEffect, useState } from "react";

export type RankType = "all" | "region" | "area";

export const useRank = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [rankType, setRankType] = useState<RankType>("all");
  const [deriv, setDeriv] = useState(0); // 각 등수에 대한 변화량 입니다.
  const [myRank, setMyRank] = useState<number>(0); // 각 탭에 대한 순위 표시입니다.
  const [topRank, setTopRank] = useState<TopRankRecord[]>([]);

  useEffect(() => {
    fetchRanks();
  }, []);

  useEffect(() => {
    fetchRanks();
  }, [rankType]);

  const fetchRanks = async () => {
    try {
      fetchRankByType(rankType, currentUser?.region ?? "", currentUser?.area ?? "");
    } catch (e) {
      throw e;
    }
  };

  const fetchRankByType = async (type: RankType, region: string, area: string) => {
    try {
      const myRankRes =
        type === "all"
          ? await requestMyRank()
          : type === "region"
          ? await requestRegionMyRank(region)
          : await requestAreaMyRank(region, area);
      setMyRank(myRankRes.data.data[0].rank);
      setDeriv(myRankRes.data.data[0].rankDeriv);
      const topRankRes =
        type === "all"
          ? await requestTopRank()
          : type === "region"
          ? await requestRegionTopRank(region)
          : await requestAreaTopRank(region, area);
      setTopRank([...topRankRes.data.data]);
    } catch (e) {
      throw e;
    }
  };

  return { rankType, topRank, setRankType, deriv, myRank };
};
