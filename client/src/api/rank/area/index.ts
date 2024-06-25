import { MyRankResponse, TopRankResponse } from "@/types/RankRecord";
import { axiosWithCookie } from "@/utils/axios";
import { AxiosResponse } from "axios";

export function requestAreaTopRank(region: string, area: string) {
  return axiosWithCookie.post("/api/rank/area/top", {
    regionName: region,
    areaName: area,
  }) as Promise<AxiosResponse<TopRankResponse>>;
}

export function requestAreaMyRank(region: string, area: string) {
  return axiosWithCookie.post("/api/rank/area/my-rank", {
    regionName: region,
    areaName: area,
  }) as Promise<AxiosResponse<MyRankResponse>>;
}
