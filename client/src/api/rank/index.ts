import { axiosWithCookie } from "@/utils/axios";
import { MyRankResponse, TopRankResponse } from "@/types/RankRecord";
import { AxiosResponse } from "axios";

export function requestTopRank() {
  return axiosWithCookie.get("/api/ranking/top") as Promise<AxiosResponse<TopRankResponse>>;
}

export function requestMyRank() {
  return axiosWithCookie.get("/api/ranking/my-rank") as Promise<AxiosResponse<MyRankResponse>>;
}

export * from "./area";
export * from "./region";
