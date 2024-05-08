import { axiosWithCookie } from "@/utils/axios";
import { MyRankResponse, TopRankResponse } from "@/types/RankRecord";
import { AxiosResponse } from "axios";

export function requestRegionTopRank(region: string) {
  return axiosWithCookie.post("/api/ranking/region/top", {
    regionName: region,
  }) as Promise<AxiosResponse<TopRankResponse>>;
}

export function requestRegionMyRank(region: string) {
  return axiosWithCookie.post("/api/ranking/region/my-rank", {
    regionName: region,
  }) as Promise<AxiosResponse<MyRankResponse>>;
}
