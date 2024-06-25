// import { Area, Region } from "./Region";

// export interface AreaRank extends Area {
//   areaPoint: number;
//   areaRank: number;
//   areaRankDeriv: number;
// }

// export interface RegionRank extends Region {
//   regionPoint: number;
//   regionRank: number;
//   regionRankDeriv: number;
//   areas: AreaRank[];
// }

// const getRandomPoint = () => Math.floor(Math.random() * 1000000 + 1);
// const getRandomDeriv = () => Math.floor((Math.random() - 0.5) * 10 + 1);

// export let RANK_EXAMPLE: RegionRank[] = REGION_LIST.map((value) => {
//   let regionPoint: number = 0,
//     regionRankDeriv: number = 0;
//   const ret = {
//     ...value,
//     areas: value.areas.map((value) => {
//       const areaRankDeriv = getRandomDeriv();
//       const areaPoint = getRandomPoint();
//       regionRankDeriv += areaRankDeriv;
//       regionPoint += areaPoint;
//       return {
//         ...value,
//         areaRank: -1,
//         areaRankDeriv: getRandomDeriv(),
//         areaPoint: getRandomPoint(),
//       };
//     }) as AreaRank[],
//     regionPoint: 0,
//     regionRank: 1,
//     regionRankDeriv: 0,
//   };
//   ret.regionPoint = regionPoint;
//   ret.regionRankDeriv = regionRankDeriv;

//   ret.areas = ret.areas
//     .sort((a, b) => b.areaPoint - a.areaPoint)
//     .map((value, idx) => ({
//       ...value,
//       areaRank: idx + 1,
//     }));
//   return ret;
// });

// RANK_EXAMPLE = RANK_EXAMPLE.sort((a, b) => b.regionPoint - a.regionPoint).map((value, idx) => ({
//   ...value,
//   regionRank: idx + 1,
// })); // 쿼리 받고 SORT!

/**
 * 요청 사항 변경으로 새로 작성
 */

export interface MyRank {
  rank: number;
  rankDeriv: number;
}

export interface TopRankRecord {
  regionName: string;
  areaName: string;
  nick: string;
  rank: number;
  score: number;
  rankDeriv: number;
}

export interface MyRankResponse {
  data: [MyRank];
  msg: string;
  result: string;
}

export interface TopRankResponse {
  data: TopRankRecord[];
  ms: string;
  result: string;
}
