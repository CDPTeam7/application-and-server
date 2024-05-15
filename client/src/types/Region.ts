export interface Area {
  areaName: string;
}

export interface Region {
  regionName: string;
  areas: Area[];
}

export const REGION_LIST: Region[] = [
  {
    regionName: "서울",
    areas: [
      { areaName: "은평구" },
      { areaName: "강북구" },
      { areaName: "도봉구" },
      { areaName: "노원구" },
      { areaName: "성북구" },
      { areaName: "종로구" },
      { areaName: "서대문구" },
      { areaName: "동대문구" },
      { areaName: "중구" },
      { areaName: "중랑구" },
      { areaName: "마포구" },
      { areaName: "용산구" },
      { areaName: "성동구" },
      { areaName: "광진구" },
      { areaName: "강서구" },
      { areaName: "양천구" },
      { areaName: "영등포구" },
      { areaName: "동작구" },
      { areaName: "서초구" },
      { areaName: "강남구" },
      { areaName: "송파구" },
      { areaName: "강동구" },
      { areaName: "구로구" },
      { areaName: "금천구" },
      { areaName: "관악구" },
    ],
  },
  {
    regionName: "대전",
    areas: [{ areaName: "동구" }, { areaName: "중구" }, { areaName: "서구" }, { areaName: "유성구" }, { areaName: "대덕구" }],
  },
  {
    regionName: "대구",
    areas: [
      { areaName: "북구" },
      { areaName: "동구" },
      { areaName: "서구" },
      { areaName: "남구" },
      { areaName: "수성구" },
      { areaName: "달서구" },
      { areaName: "달성군" },
    ],
  },
  {
    regionName: "부산",
    areas: [
      { areaName: "중구" },
      { areaName: "동구" },
      { areaName: "서구" },
      { areaName: "영도구" },
      { areaName: "부산진구" },
      { areaName: "동래구" },
      { areaName: "남구" },
      { areaName: "북구" },
      { areaName: "해운대구" },
      { areaName: "사하구" },
      { areaName: "사상구" },
      { areaName: "수영구" },
      { areaName: "연제구" },
      { areaName: "강서구" },
      { areaName: "금정구" },
    ],
  },
];

export const getRegionName = () => REGION_LIST.map((value) => value.regionName);

export const getAreaName = (region: string) => {
  const r = REGION_LIST.find((value) => value.regionName === region);
  if (r === undefined) return [];
  return r.areas.map((value) => value.areaName);
};
