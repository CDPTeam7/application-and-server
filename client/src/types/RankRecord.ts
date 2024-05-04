import { Area, Region } from "./Region";

export interface AreaRank extends Area {
  areaPoint: number;
  areaRank: number;
  areaRankDeriv: number;
}

export interface RegionRank extends Region {
  regionPoint: number;
  regionRank: number;
  regionRankDeriv: number;
  areas: AreaRank[];
}
